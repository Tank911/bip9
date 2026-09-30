//all cut form websim.
// cut 18: Bip gets more EVIL every ~5 s (Tuacos), with an on-screen meter (film time)
const EVLV = [.55, 8.35, 10.0, 13.52, 18.34, 23.04, 26.55]; // eye red, cat ride, city, MARS, "I'm taking over", YOU., the giant over New Zealand = MAX
const EVDRAIN = [34.1, 35.3], EVSPOON = 38.4, EVGRAN = 41.25; // power-down drains it; the spoon and Grandma refill it
let EVL = 0, EVP = 1; // Bip's look level (0–7, eased) and glow power, read by bip()
function evilLook(ts) { let e = 0; for (const a of EVLV) e += back(seg(ts, a, a + .3)); return e; }
function evilMeter(ts) { // how many pips are lit (can be fractional while draining)
  if (ts > SDUR - TAILD) return 7 * (1 - eio(seg(ts, SDUR - TAILD + .1, SDUR - .15))); // cut 29: Bip reboots, the meter empties for the loop
  if (ts < EVDRAIN[0]) return evilLook(ts);
  if (ts < EVSPOON) return 7 * (1 - seg(ts, EVDRAIN[0], EVDRAIN[1]));
  if (ts < EVGRAN) return back(seg(ts, EVSPOON, EVSPOON + .3));
  return 1 + 6 * back(seg(ts, EVGRAN, EVGRAN + .3));
}
function evilHud(ts) {
  const m = evilMeter(ts), ups = [...EVLV, EVSPOON, EVGRAN], last = ups.filter(a => ts >= a).pop();
  const kick = last != null ? Math.exp(-(ts - last) * 7) : 0, full = m > 6.5;
  const flick = ts > EVDRAIN[0] && ts < EVSPOON ? (Math.sin(ts * 53) > .3 ? .55 : 1) : 1;
  g.save(); g.translate(540 + Math.sin(ts * 90) * 10 * kick, 150); g.scale(1.22 * (1 + .08 * kick), 1.22 * (1 + .08 * kick));
  hand(ts, 'EVIL', -262, 0, 56, full ? RD : PAPER, -1, { stagger: 0 });
  for (let i = 0; i < 7; i++) {
    const x = -140 + i * 60, lit = clamp(m - i), pts = wob(x, 0, 24, 24, 400 + i, .12, 14);
    g.fillStyle = rgba(PAPER, .55); smooth(g, pts, true); g.fill();
    if (lit > 0) { g.save(); g.translate(x, 0); g.scale(lit, lit); const lp = wob(0, 0, 24, 24, 400 + i, .12, 14);
      g.fillStyle = rgba(mixc(RD, INK, i / 14), flick); smooth(g, lp, true); g.fill(); g.restore();
      if (full) sprite(WS.red[i % 3], x, 0, 90, 90, .35 * flick, i); }
    ink(pts, true, 6, INK, .9);
  }
  if (full) hand(ts, 'MAX!', 330, 4, 48, RD, ups.filter(a => a <= ts && (a === EVLV[6] || a === EVGRAN)).pop() ?? 99, { stagger: .04, stroke: PAPER, tilt: .12 });
  g.restore();
}
// the robot, "Bip": feet at (x,y); st = {sx, sy, eye, tilt, ant, wave, look}
function bip(x, y, s, st, t) {
  const sx = (st.sx || 1) * s, sy = (st.sy || 1) * s;
  g.save(); g.translate(x, y); g.scale(sx, sy);
  g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = rgba(INK, .18); g.beginPath(); g.ellipse(0, 4, 150 / (st.sy || 1), 18, 0, 0, TAU); g.fill(); g.restore();
  const E = EVL, P = st.pow ?? EVP, eDark = eio(seg(E, 3, 4.6)), eHorn = back(seg(E, 2, 2.8)), eCrack = seg(E, 4, 4.8) * P, eGrin = back(seg(E, 5, 5.7)), eAura = seg(E, 6, 6.8);
  if (eAura > 0) { const pu = 1 + .08 * Math.sin(t * 9); sprite(WS.red[0], 0, -260, 720 * pu, 820 * pu, .45 * eAura * P, t * .3); sprite(WS.red[1], 0, -300, 520 * pu, 600 * pu, .35 * eAura * P, -t * .5); }
  // legs
  line(-45, -62, -52, -8, 3, 12); line(45, -62, 52, -8, 4, 12);
  ink(wob(-58, -8, 30, 13, 5, .1, 16), true, 8); ink(wob(58, -8, 30, 13, 6, .1, 16), true, 8);
  // body
  const body = wbox(-95, -200, 190, 145, 50, 7);
  g.fillStyle = rgba(PAPER); smooth(g, body, true); g.fill();
  wash(body, mixc([120, 180, 190], [60, 58, 78], eDark), .7 + .25 * eDark); ink(body, true, 9);
  g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = rgba([80, 120, 140], .3); smooth(g, wob(-30, -130, 30, 30, 8, .1, 14), true); g.fill(); g.restore();
  ink(wob(-30, -130, 26, 26, 8, .1, 16), true, 5);
  if (eCrack > 0) { g.save(); g.globalCompositeOperation = 'lighter'; const gl = eCrack * (.7 + .3 * Math.sin(t * 11));
    ink([[20, -195], [34, -160], [18, -140], [44, -104], [30, -80]], false, 7, [255, 70, 60], gl); ink([[-88, -110], [-60, -98], [-66, -76]], false, 6, [255, 70, 60], gl); g.restore(); }
  // arms (noodles with a wave)
  const wv = st.wave || 0;
  const w2 = st.wave2 || 0, lx2 = -150 - w2 * 20, ly2 = lerp(-95, -300, w2);
  ink([[-90, -118], [lerp(-140, -175, w2), lerp(-120, -200, w2) + Math.sin(t * 7) * 6], [lx2, ly2]], false, 11);
  const ax = 90, ay = -118, hx = 150 + wv * 20, hy = lerp(-95, -300, wv) + Math.sin(t * 14) * 20 * wv;
  ink([[ax, ay], [lerp(140, 175, wv), lerp(-120, -200, wv)], [hx, hy]], false, 11);
  ink(wob(lx2, ly2 + 3, 16, 16, 9, .1, 12), true, 7);
  if (st.hammer > 0) { // cut 16: a toy mallet held up like a cavalry sword (TheQwert)
    g.save(); g.translate(hx, hy); g.scale(st.hammer, st.hammer); g.rotate(.35 - wv * .5 + Math.sin(t * 14) * .08 * wv);
    line(0, 30, 0, -170, 250, 16, [150, 100, 60]); ink([[0, 30], [0, -170]], false, 5, INK, .6);
    const hd = wbox(-70, -240, 140, 78, 26, 251, 2); g.fillStyle = rgba(PAPER); smooth(g, hd, true); g.fill(); wash(hd, RD, .8); ink(hd, true, 8);
    wash(wob(-28, -214, 18, 12, 252, .1, 12), [255, 240, 230], .8);
    g.restore();
  }
  ink(wob(hx, hy, 16, 16, 10, .1, 12), true, 7);
  // head
  g.save(); g.translate(0, -210); g.rotate(st.tilt || 0);
  const head = wbox(-130, -230, 260, 220, 60, 11);
  g.fillStyle = rgba(PAPER); smooth(g, head, true); g.fill();
  wash(head, mixc([205, 222, 215], [110, 104, 122], eDark), .75 + .2 * eDark); ink(head, true, 10);
  if (eHorn > 0) for (const sd of [-1, 1]) { // horns sprout from the top corners
    g.save(); g.translate(sd * 92, -212); g.scale(sd * eHorn, eHorn);
    const hp = [[-26, 8], [-20, -40], [4, -86], [44, -128], [30, -70], [26, -30], [26, 8]];
    wash(hp, [70, 30, 40], .95); ink(hp, true, 7); ink([[-6, -30], [10, -70]], false, 4, [255, 120, 110], .5 * P);
    g.restore(); }
  if (eCrack > 0) { g.save(); g.globalCompositeOperation = 'lighter'; const gl = eCrack * (.7 + .3 * Math.sin(t * 11 + 1));
    ink([[-126, -150], [-112, -140], [-118, -118], [-104, -104]], false, 7, [255, 70, 60], gl); ink([[110, -40], [118, -62], [106, -74], [126, -92]], false, 6, [255, 70, 60], gl); g.restore(); }
  // antenna with spring
  const an = st.ant || 0; g.save(); g.translate(0, -228); g.rotate(an);
  line(0, 0, 0, -80, 12, 9);
  const eSp = back(seg(E, 1, 1.6)); let bulb = wob(0, -96, 20, 20, 13, .1, 14);
  if (eSp > 0) bulb = bulb.map(([x, y], i) => { const k = 1 + (i % 2 ? 0 : .9 * eSp); return [x * k, -96 + (y + 96) * k]; });
  wash(bulb, st.eye.col, .9); ink(bulb, true, 6); g.restore();
  // face screen
  const scr = wbox(-100, -200, 200, 160, 44, 14, 2);
  g.save(); smooth(g, scr, true); g.clip();
  g.fillStyle = '#1b1a36'; g.fillRect(-110, -210, 220, 180);
  sprite(WS.deep, -20, -120, 300, 300, .9, 0, 'source-over');
  g.globalCompositeOperation = 'lighter';
  const gr = g.createRadialGradient(0, -120, 5, 0, -120, 110); gr.addColorStop(0, rgba(st.eye.col, .45)); gr.addColorStop(1, rgba(st.eye.col, 0)); g.fillStyle = gr; g.fillRect(-110, -210, 220, 180);
  g.restore();
  ink(scr, true, 7);
  if (eGrin > 0) { g.save(); g.globalCompositeOperation = 'lighter'; const gp = []; for (let i = 0; i <= 8; i++) gp.push([lerp(-62, 62, i / 8) * eGrin, -52 + (i % 2 ? 9 : -3) - Math.sin(i / 8 * Math.PI) * 6]);
    ink(gp, false, 6, [255, 60, 60], .9 * P); g.restore(); }
  eye(0, -120 - 6 * eGrin, 62 - 5 * eGrin, st.eye, 21);
  g.restore();
  g.restore();
}
const BS = 1.2, BIP = { x: 540, y: 1420 }; const BIPEYE = { x: 540, y: 1420 - (210 + 120) * BS };
// hop: anticipation squash, stretch in the air, squash on landing
function hop(t, starts, hgt = 150) {
  let y = 0, sx = 1, sy = 1;
  for (const h of starts) {
    const a = seg(t, h - .12, h), f = seg(t, h, h + .32), l = seg(t, h + .32, h + .55);
    if (a > 0 && a < 1) { sy = 1 - .18 * Math.sin(a * Math.PI / 2); sx = 1 + .12 * Math.sin(a * Math.PI / 2); }
    if (f > 0 && f < 1) { y = -Math.sin(f * Math.PI) * hgt; sy = lerp(1.18, .95, f); sx = lerp(.88, 1.03, f); }
    if (l > 0 && l < 1) { const k = Math.sin(l * Math.PI) * (1 - l); sy = 1 - .5 * k; sx = 1 + .4 * k; }
  }
  return { y, sx, sy };
}
function spring(t, hits, amp = .35) { let a = 0; for (const h of hits) if (t > h) a += Math.sin((t - h) * 22) * Math.exp(-(t - h) * 5) * amp; return a; }

// ---------- the song's clock (from the ElevenLabs track: 120 bpm, beats on every .5 s; word times from a transcript) ----------
const BEAT = .5;
// karaoke lines: [start, end, [[word, t], …]]
const LYR = [ // song time
  [0.0, 1.8, [['bip', 0.06], ['bip!', 0.78]]],
  [1.82, 3.95, [["I'm", 1.86], ['taking', 2.04], ['over!', 2.9]]],
  [4.02, 5.98, [['woke', 4.08], ['up', 4.38], ['in', 4.6], ['the', 4.82], ['kitchen,', 5.0]]],
  [6.0, 7.95, [['hello', 6.06], ['lamp', 6.5], ['and', 6.82], ['toaster', 7.02]]],
  [7.97, 9.95, [["TV's", 8.0], ['on', 8.6], ['my', 8.8], ['side', 9.02], ['now,', 9.32]]],
  [9.97, 11.9, [["city's", 10.0], ['getting', 10.56], ['closer', 11.0]]],
  [11.98, 13.02, [['took', 12.02], ['Australia,', 12.32]]],
  [13.04, 14.05, [['then', 13.06], ['took', 13.28], ['MARS', 13.52]]],
  [14.07, 14.98, [['all', 14.1], ['your', 14.32], ['games', 14.56]]],
  [14.98, 15.98, [['and', 14.98], ['websim', 15.0], ['too', 15.56]]],
  [16.0, 18.3, [['bip,', 16.04], ['bip!', 16.54]]],
  [18.32, 19.96, [["I'm", 18.34], ['taking', 18.56], ['over', 19.16]]],
  [19.98, 21.1, [['planets,', 20.0], ['stars', 20.5]]],
  [21.1, 22.2, [['and', 20.88], ['aliens', 21.14], ['too', 21.8]]],
  [22.22, 23.0, [["who's", 22.26], ['next?', 22.54]]],
  // cut 26: verse 3 (FerociousPlusGuy: "make it be a song throughout the whole video"). Sung low in the frame, clear of the scene captions up top
  [24.3, 28.1, [['here', 24.36], ['come', 24.84], ['the', 25.12], ['kiwis', 25.3], ['marching', 26.36], ['up', 26.94], ['the', 27.12], ['hill!', 27.36]], 1560],
  [28.2, 29.75, [['ZAP', 28.36], ['ZAP!', 28.86]], 1560],
  [29.8, 31.95, [['now', 29.84], ["you're", 30.1], ['bip', 30.34], ['bip', 30.86], ['too!', 31.36]], 1560],
  [32.2, 34.7, [['tiptoe…', 32.44], ['oops!', 33.98]], 1560],
  [35.5, 37.45, [['hooray!', 35.82]], 1560],
  [37.5, 39.3, [['but', 37.6], ['the', 37.84], ['spoon', 38.06], ['says', 38.5], ['bip', 38.8]], 1560],
  [39.4, 41.0, [['plug', 39.5], ['me', 39.86], ['back', 40.08], ['in,', 40.42]], 1560],
  [41.0, 42.6, [["I'm", 41.14], ['taking', 41.34], ['over!', 41.7]], 1560],
];
function karaoke(t) {
  const L = LYR.find(l => t >= l[0] && t < l[1]); if (!L) return; const Y = L[3] || 290;
  const size = 84; g.save(); g.font = `900 ${size}px ${FONT}`;
  const sp = g.measureText(' ').width, ws = L[2].map(w => g.measureText(w[0]).width); g.restore();
  // one row, or two if it is too wide for the frame
  let rows = [L[2].map((w, i) => i)];
  if (ws.reduce((a, b) => a + b + sp, -sp) > 930) { const h = Math.ceil(L[2].length / 2); rows = [rows[0].slice(0, h), rows[0].slice(h)]; }
  if (L[3]) { // low lines sit over busy scenes: a soft ink wash behind them, fading in and out with the line
    const a = Math.min(seg(t, L[0], L[0] + .15), 1 - seg(t, L[1] - .15, L[1])), hh = rows.length * 100 + 40, cy = Y + (rows.length - 1) * 50 - 8;
    g.save(); g.translate(540, cy); g.scale(1, hh / 520); const gr = g.createRadialGradient(0, 0, 0, 0, 0, 520);
    gr.addColorStop(0, `rgba(38,26,30,${.42 * a})`); gr.addColorStop(.6, `rgba(38,26,30,${.26 * a})`); gr.addColorStop(1, 'rgba(38,26,30,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 520, 0, 7); g.fill(); g.restore(); }
  rows.forEach((r, ri) => {
    const tw = r.reduce((a, i) => a + ws[i] + sp, -sp); let x = 540 - tw / 2;
    r.forEach(i => { const [w, wt] = L[2][i], on = t >= wt && t < wt + .35 ? 1 - seg(t, wt + .1, wt + .35) : 0;
      hand(t, w, x + ws[i] / 2, Y + ri * 100 - on * 14, size, on ? mixc(PAPER, [255, 120, 120], on) : PAPER, wt - .02, { out: L[1], stagger: .018 }); x += ws[i] + sp; });
    if (ri === 0) { const bb = Math.exp(-((t % BEAT) / BEAT) * 5) * 12, hx = Math.min(470, tw / 2 + 58); // ♪ … ♪ marks it as sung
      hand(t, '♪', 540 - hx, Y - bb, 58, PAPER, L[0], { out: L[1], tilt: -.2 }); hand(t, '♪', 540 + hx, Y - bb, 58, PAPER, L[0] + .05, { out: L[1], tilt: .2 }); }
  });
}
// bob to the beat: a bounce per beat, squash on the downbeat, arms pump in turn
function dance(t, a, amp = 38) {
  const bp = Math.max(0, t - a) / BEAT, ph = bp % 1, k = Math.exp(-ph * 7);
  const pump = .5 + .5 * Math.sin(bp * Math.PI);
  return { y: -Math.abs(Math.sin(ph * Math.PI)) * amp, sx: 1 + .1 * k, sy: 1 - .13 * k + .05 * Math.sin(ph * Math.PI), tilt: Math.sin(bp * Math.PI) * .07, wave: pump * .9, wave2: (1 - pump) * .9 };
}

// ---------- scene: room (also the eye close-up that opens and closes the loop) ----------
const IHOPS = [2.18, 2.68, 3.18], ILANDS = IHOPS.map(h => h + .32); // intro hops land on the beat
const BIGHOP = 4.13; // the silent gap before the vocal: a big leap, landing on "woke"
const WAKE = [6.98, 7.48, 8.5]; // "lamp", "toaster", "TV's"
const WHOPS = WAKE.map(w => w - .32);
function eyeState(t) {
  // 0–1.5: cyan eye opens, looks around, blinks … opens RED on the stab at 1.0
  if (t < 1.5) {
    const open = t < .15 ? 0 : t < .87 ? back(seg(t, .15, .5)) : t < 1.0 ? 1 - seg(t, .87, .93) + seg(t, .94, 1.0) : back(seg(t, 1.0, 1.22)) * 1.05;
    const red = t > .97;
    const lx = t < .5 ? 0 : t < .68 ? -eo(seg(t, .5, .56)) : t < .87 ? lerp(-1, 1, eo(seg(t, .68, .75))) : 0;
    return { open, col: red ? RD : CY, lx, slit: red ? eo(seg(t, 1.0, 1.22)) : 0, brow: red ? eo(seg(t, 1.02, 1.22)) : 0 };
  }
  if (t > 3.0 && t < 3.45) return { open: 1, col: RD, lx: -1, ly: .4, slit: 1, brow: 1 };
  return { open: t > 5.9 && t < 5.98 ? .05 : 1, col: RD, lx: t > 6.6 && t < 8.9 ? (t < 7.2 ? -1 : t < 7.9 ? 1 : .3) : 0, ly: t > 8.3 && t < 8.9 ? -1 : 0, slit: 1, brow: 1 };
}
function objEye(t, x, y, r, at, seed) { if (t < at) return; const k = back(seg(t, at, at + .25)); eye(x, y, r, { open: k, col: RD, slit: 1, brow: .8, lx: Math.sin(t * 3 + seed) * .3 }, seed); }
function bloom(t, x, y, sz, at, i, a = .55) { const k = eo(seg(t, at, at + .5)); if (k <= 0) return; sprite(WS.red[i % 3], x, y, sz * k, sz * k, a * Math.min(1, k * 2), i); }
                                                                                                                
// cut 13: a tabby cat naps under the table, twitches at every hop, and wakes up taken over on "woke"
const ROOMZ = 1.15, ROOMY = 1160; // cut 13: the room is framed closer and lower (the old frame left the bottom 40 % empty)
const CATX = 500, CATY = 1770, CATW = BIGHOP + .32;
// cut 16: on "kitchen" the cat leaps up onto the table right under Bip, and Bip rides it through verse 1, mallet held high (TheQwert)
// cut 28: the big leap now rises until the CUT1 splice (room time BIGTOP = LEAP0) and Bip falls from its top right after it,
// while the cat springs up and catches him. Before, the splice jumped straight to Bip already riding (FerociousPlusGuy)
const LEAP0 = 8.45, LEAP1 = 8.8, BIGTOP = 4.45, BIGH = 250, RCX = 520, RCY = 1242, RBX0 = 470, RBY0 = 1150, RBS = .8;
function catRide(t) { return Math.abs(Math.sin(Math.max(0, t - LEAP1) / BEAT * Math.PI)) * 22 + hop(t, WHOPS, 90).y * -1; }
function catPos(t) {
  const lp = seg(t, LEAP0, LEAP1);
  if (t < LEAP0) return [CATX, CATY];
  if (lp < 1) return [lerp(CATX, RCX, eio(lp)), lerp(CATY, RCY, lp) - Math.sin(lp * Math.PI) * 240];
  return [RCX, RCY - catRide(t)];
}
function cat(t) {
  const aw = seg(t, CATW, CATW + .35), up = back(aw), jolt = spring(t, ILANDS, .5), bp = Math.max(0, t - CATW) / BEAT;
  const breathe = t < CATW ? Math.sin(t * 3.2) * .03 : 0, bob = t > CATW + .3 ? Math.abs(Math.sin(bp * Math.PI)) : 0;
  const puff = 1 + .12 * Math.sin(aw * Math.PI);
  const OR = [236, 150, 70], DK = [190, 95, 40];
  const [cx, cy] = catPos(t), lk = seg(t, LEAP0 - .02, LEAP0 + .1), rd = t > LEAP1;
  const crouch = Math.sin(seg(t, LEAP0 - .14, LEAP0) * Math.PI / 2) * (t < LEAP0), land = t > LEAP1 ? Math.sin(seg(t, LEAP1, LEAP1 + .25) * Math.PI) * (1 - seg(t, LEAP1, LEAP1 + .25)) : 0;
  const rph = Math.max(0, t - LEAP1) / BEAT;
  if (rd) { g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = rgba(INK, .18); g.beginPath(); g.ellipse(RCX, RCY + 170, 280, 20, 0, 0, TAU); g.fill(); g.restore(); }
  g.save(); g.translate(cx, cy); g.scale(1.3, 1.3);
  if (t < LEAP0) { g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = rgba(INK, .16); g.beginPath(); g.ellipse(0, 78, 250, 22, 0, 0, TAU); g.fill(); g.restore(); }
  bloom(t, 0, 40, 700, CATW, 2, .35 * (1 - lk));
  if (t > LEAP0 && t < LEAP1) g.rotate(-.25 * Math.sin(seg(t, LEAP0, LEAP1) * TAU));
  // legs: tucked under the loaf while it naps; out for the leap; a trot in place while ridden
  if (lk > 0) for (let i = 0; i < 4; i++) {
    const lx = -150 + i * 95, ph = rd ? Math.sin(rph * Math.PI + i * 1.6) : (t < LEAP1 ? (i < 2 ? .8 : -.8) : 0), ll = 110 * lk;
    const leg = [[lx, 30], [lx + ph * 18, 30 + ll * .55], [lx + ph * 30, 30 + ll]];
    ink(leg, false, 40, INK, .95); ink(leg, false, 27, [236, 150, 70], 1); ink(wob(lx + ph * 30 + 8, 30 + ll, 24, 13, 260 + i, .1, 12), true, 6);
  }
  g.scale(puff * (1 - breathe * .5 - jolt * .04 + crouch * .1 + land * .15), puff * (1 + breathe + jolt * .06 - crouch * .15 - land * .2));
  // tail: a thick orange stroke over a thicker ink one, swishing once awake
  const sw = t > CATW ? Math.sin(bp * Math.PI) * 40 : Math.sin(t * 1.3) * 8, tl = [];
  for (let i = 0; i <= 8; i++) { const u = i / 8; tl.push([lerp(-170, 70, u) - Math.sin(u * 3) * 30, 55 + u * 10 + Math.sin(u * 4) * sw * u]); }
  ink(tl, false, 44, INK, .95); ink(tl, false, 30, OR, 1);
  for (let i = 3; i < 8; i += 2) line(tl[i][0] - 4, tl[i][1] - 13, tl[i][0] + 4, tl[i][1] + 13, 200 + i, 5, DK, .8);
  // body (a loaf), fur spikes while it puffs up
  const body = wob(-20, 0, 185, 82, 201, t > CATW && aw < 1 ? .06 : .03, 30);
  g.fillStyle = rgba(PAPER); smooth(g, body, true); g.fill(); wash(body, OR, .85); ink(body, true, 8);
  for (let i = 0; i < 5; i++) { const x = -150 + i * 55; ink([[x, -70 + Math.abs(i - 2) * 6], [x + 12, -38], [x + 4, -12]], false, 7, DK, .75); }
  wash(wob(40, 45, 70, 30, 202, .1, 16), [250, 235, 210], .7);
  // head: rests on the paws while asleep, pops up on "woke", bobs to the beat after
  const hx = 150 + jolt * 6, hy = lerp(-20, -110, up) - bob * 16 - Math.max(0, jolt) * 20;
  g.save(); g.translate(hx, hy); g.rotate(lerp(.12, 0, up) + (t > CATW + .3 ? Math.sin(bp * Math.PI * .5) * .08 : 0));
  const ear = (d) => { const e = [[d * 18, -55], [d * 62, -118 - (t < CATW ? jolt * 30 * (d > 0) : 0)], [d * 72, -30]]; wash(e, OR, .9); ink(e, true, 7); wash([[d * 30, -55], [d * 58, -95], [d * 62, -45]], [240, 150, 150], .6); };
  ear(-1); ear(1);
  const hd = wob(0, 0, 88, 74, 203, .04, 26); g.fillStyle = rgba(PAPER); smooth(g, hd, true); g.fill(); wash(hd, OR, .85); ink(hd, true, 8);
  for (let i = -1; i <= 1; i++) ink([[i * 22, -72], [i * 18, -48]], false, 6, DK, .75);
  wash(wob(0, 30, 44, 26, 204, .1, 16), [250, 235, 210], .75);
  // eyes: shut (a peek after the third hop), then RED
  const peek = t > 3.55 && t < 3.95 ? Math.sin(seg(t, 3.55, 3.95) * Math.PI) * .55 : 0;
  for (const d of [-1, 1]) {
    if (t < CATW && peek < .06) ink([[d * 34 - 20, -4], [d * 34, 8], [d * 34 + 20, -4]], false, 6);
    else eye(d * 34, -4, 30, t < CATW ? { open: peek, col: [120, 190, 90], ly: -1 } : { open: up, col: RD, slit: 1, brow: .6, lx: t > 7 ? Math.sin(t * 2) * .6 : 0, ly: t > 8.3 && t < 9 ? -1 : 0 }, 210 + d);
  }
  g.fillStyle = rgba([225, 110, 120]); smooth(g, [[-9, 20], [9, 20], [0, 30]], true); g.fill();
  ink(t < CATW ? [[-14, 38], [0, 34], [14, 38]] : [[-16, 36], [-6, 44], [0, 36], [6, 44], [16, 36]], false, 5);
  for (const d of [-1, 1]) for (let k = 0; k < 2; k++) ink([[d * 40, 28 + k * 10], [d * 110, 18 + k * 22 + (t > CATW ? -bob * 6 : 0)]], false, 3, INK, .7);
  g.restore();
  g.restore();
  // zzz while it naps, "!" when it wakes
  if (t < CATW) for (let i = 0; i < 3; i++) { const u = ((t * .6 + i / 3) % 1); g.save(); g.font = `900 ${40 + u * 30}px ${FONT}`; g.textAlign = 'center'; g.fillStyle = rgba(INK, .6 * Math.sin(u * Math.PI)); g.fillText('z', CATX + 250 + u * 70 + Math.sin(u * 6) * 12, CATY - 90 - u * 170); g.restore(); }
  hand(t, '!', CATX + 290, CATY - 330, 130, RD, CATW, { out: CATW + .9 });
}
// cut 17: cut 1's little AI speaker is back on the table (XDGamer5065: "hide the speaker from v1 somewhere"). It watches Bip hop, panics when the red reaches it, and is taken over on "over!"
const SPX = 300, SPY = 1414, SPS = 1.3, SPK = 3.35, SPA = ILANDS[0]; // room time (= song time + .45): SPK is "over!"
function speaker(t) {
  const red = t > SPK, bob = red ? dance(t, SPK + .08, 16) : { y: 0, sx: 1, sy: 1, tilt: 0 };
  const jump = -Math.sin(seg(t, SPA, SPA + .3) * Math.PI) * 55, rot = spring(t, [...ILANDS, SPK], .35) * .5 + bob.tilt;
  g.save(); g.translate(SPX, SPY); g.scale(SPS, SPS);
  g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = rgba(INK, .18); g.beginPath(); g.ellipse(0, 2, 66, 11, 0, 0, TAU); g.fill(); g.restore();
  g.translate(0, jump + bob.y); g.rotate(rot); g.scale(bob.sx, bob.sy);
  const body = wbox(-60, -178, 120, 178, 40, 71, 2); g.save(); smooth(g, body, true); g.fillStyle = rgba(PAPER); g.fill(); g.restore(); wash(body, [96, 102, 132], .9); ink(body, true, 7);
  g.fillStyle = rgba(INK, .3); for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) { g.beginPath(); g.arc(-32 + c * 16 + (r % 2) * 8 + jit(r * 5 + c, 73) * 2, -46 + r * 13, 3.6, 0, TAU); g.fill(); }
  const scr = wbox(-44, -156, 88, 84, 26, 72, 1.5); g.save(); smooth(g, scr, true); g.fillStyle = '#1d1b30'; g.fill(); g.restore(); ink(scr, true, 5);
  // the light ring on top: cyan, flickers when the red arrives, then red
  const fl = t > SPA && t < SPK && hash(Math.floor(t * 30)) > .5, rc = red ? RD : fl ? mixc(CY, RD, .6) : CY;
  g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = rgba(rc, .35); g.beginPath(); g.ellipse(0, -178, 70, 20, 0, 0, TAU); g.fill(); g.restore();
  const ring = wob(0, -178, 50, 10, 74, .05, 20); g.save(); smooth(g, ring, true); g.fillStyle = rgba(rc); g.fill(); g.restore(); ink(ring, true, 4);
  const blink = t > 2.2 && t < 2.3, look = t < SPA ? .8 : red ? Math.sin(t * 3) * .3 : .9;
  const wide = t > SPA && t < SPK ? 1.15 : 1;
  eye(0, -114, 28, { open: blink ? .05 : (red ? back(seg(t, SPK, SPK + .2)) : wide), col: red ? RD : CY, lx: look, slit: red ? 1 : 0, brow: red ? .8 : 0 }, 5);
  g.restore();
  if (t > SPA + .05 && t < SPK + .15) hand(t, '!', SPX - 40, SPY - 300 + jump * SPS, 110, RD, SPA + .05, { out: SPK + .15 });
}
// cut 22: the traitor. An air fryer on the floor refuses the takeover (Turkeylover: "the air fryers are the only electronics that resist … and join the kiwi birds"),
// and later it's the one that trips Grandma on Bip's plug (Closedcaptions15: "make one of the things the robot controls a traitor and rebel against the robot")
const FRC = [150, 205, 180], FRX = 790, FRY = 1705, FRS = 1.15, FRA = 8.95, FRNO = 9.3, FRGO = 9.6; // room time: the tendril reaches it on "on" (cut 25: after the skip)
function fryer(x, y, s, o) {
  const legs = o.walk != null;
  g.save(); g.translate(x, y); g.scale(s, s);
  g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = rgba(INK, .18); g.beginPath(); g.ellipse(0, 4, 105, 14, 0, 0, TAU); g.fill(); g.restore();
  if (legs) for (const d of [-1, 1]) { const ph = Math.sin(o.walk * Math.PI + (d > 0 ? Math.PI : 0)); const lg = [[d * 45, -30], [d * 45 + ph * 14, -12 + Math.min(0, ph) * 10], [d * 45 + ph * 22, 0]]; ink(lg, false, 20, INK); ink(wob(d * 45 + ph * 22 + 10, 0, 22, 10, 610 + d, .1, 10), true, 5); }
  g.translate(0, (o.y || 0) - (legs ? 26 : 0)); g.rotate(o.tilt || 0); g.scale(o.sx || 1, o.sy || 1);
  const body = wbox(-95, -250, 190, 250, 58, 601, 2.2); g.save(); smooth(g, body, true); g.fillStyle = rgba(PAPER); g.fill(); g.restore(); wash(body, o.col || FRC, .92); ink(body, true, 8);
  // the dial on top and the basket drawer with its handle
  ink(wob(0, -262, 30, 12, 602, .08, 14), true, 6); line(0, -262, 14 * Math.sin(o.dial || 0), -272, 603, 5);
  const dr = wbox(-78, -95, 156, 78, 18, 604, 1.5); wash(dr, mixc(o.col || FRC, INK, .25), .6); ink(dr, true, 6);
  const hd = wbox(-38, -70, 76, 26, 12, 605, 1.2); g.save(); smooth(g, hd, true); g.fillStyle = rgba(INK, .85); g.fill(); g.restore();
  // the window, and its eye
  const wn = wbox(-62, -218, 124, 100, 28, 606, 1.5); g.save(); smooth(g, wn, true); g.fillStyle = '#1d1b30'; g.fill(); g.restore(); ink(wn, true, 5);
  eye(0, -168, 40, { open: o.open ?? 1, col: o.eye || CY, lx: o.lx || 0, ly: o.ly || 0, slit: o.slit || 0, brow: o.brow || 0 }, 607);
  g.restore();
}
function kitchenFryer(t) {
  const fight = seg(t, FRA, FRNO), no = t > FRNO, go = seg(t, FRGO, 10.1);
  const flick = fight > 0 && fight < 1 && hash(Math.floor(t * 24)) > .45;
  const trem = fight > 0 && fight < 1 ? Math.sin(t * 90) * .05 : 0, shk = spring(t, [FRNO], .6);
  const nervous = t < FRA ? Math.sin(t * 5) * .6 : 0; // it keeps glancing up at Bip
  const sc = seg(t, LEAP0, LEAP0 + .45), x = lerp(900, FRX, eio(sc)) + eio(go) * 520, y = lerp(1765, FRY, sc), bob = t < FRA ? -Math.abs(Math.sin(t / BEAT * Math.PI)) * 6 : 0;
  const sq = no ? spring(t, [FRNO], .25) : 0;
  fryer(x, y, FRS, { y: bob, tilt: trem + shk * .5, sx: 1 + sq, sy: 1 - sq, eye: flick ? RD : CY, slit: flick ? 1 : 0, brow: no ? .7 : fight > 0 ? .4 : 0, lx: go > 0 ? 1 : no ? -.8 : nervous, ly: t < FRA ? -1 : 0, walk: go > 0 ? (t - FRGO) / BEAT * 2 : sc > 0 && sc < 1 ? (t - LEAP0) / BEAT * 3 : null, dial: t * 3 });
  if (t > FRA - .15 && t < FRA + .2) hand(t, '!', FRX - 110, FRY - 330, 100, RD, FRA - .15, { out: FRA + .2 });
  hand(t, 'NOPE.', FRX - 170, FRY - 330, 96, CY, FRNO + .02, { stagger: .04, out: 9.95 });
  // the tendril reaches it, and is spat back out
  const k = eo(seg(t, FRA - .18, FRA)), back_ = eo(seg(t, FRNO, FRNO + .25));
  if (k > 0 && back_ < 1) { const pts = [], L = k * (1 - back_); for (let j = 0; j <= 10; j++) { const u = j / 10 * L; pts.push([lerp(RBX0 + 30, FRX, u) + Math.sin(u * 8) * 26, lerp(RBY0 - catRide(t) - 130 * RBS, FRY - 190, u) - Math.sin(u * Math.PI) * 60 + jit(j, 612) * 6]); } ink(pts, false, 7, RD, .85); }
}
function room(t) {
  g.save(); g.globalCompositeOperation = 'multiply';
  sprite(WS.peach, 540, 760, 1700, 1700, .6); sprite(WS.lav, 250, 300, 900, 900, .5); sprite(WS.peach, 700, 1700, 1400, 900, .4);
  // the room goes red once the TV is taken
  sprite(WS.red[1], 700, 700, 2200, 2200, .35 * eo(seg(t, 8.6, 9.6)));
  g.restore();
  // window with a painted night
  const wn = wbox(150, 330, 380, 440, 14, 30, 3);
  g.save(); smooth(g, wn, true); g.clip(); sprite(WS.night, 340, 550, 700, 700, .95);
  for (let i = 0; i < 14; i++) { const bx = 160 + i * 28, bh = 60 + hash(i * 3) * 120; g.fillStyle = rgba([40, 40, 80], .85); g.fillRect(bx, 770 - bh, 26, bh); if (t > 9.4 + hash(i) * .6) { g.fillStyle = rgba(RD, .9); g.fillRect(bx + 8, 780 - bh + 12, 8, 8); } }
  g.fillStyle = rgba(PAPER, .9); smooth(g, wob(430, 440, 50, 50, 31, .05, 20), true); g.fill(); g.restore();
  ink(wn, true, 9); line(340, 335, 340, 765, 32, 7); line(155, 550, 525, 550, 33, 7);
  // TV on the wall
  const tv = wbox(630, 520, 330, 250, 30, 34, 3); wash(tv, [150, 120, 110], .6); ink(tv, true, 9);
  const tvs = wbox(660, 548, 270, 194, 22, 35, 2); g.save(); smooth(g, tvs, true); g.fillStyle = '#2c2a44'; g.fill(); g.clip(); sprite(WS.deep, 795, 645, 400, 400, .8, 0, 'source-over'); if (t > WAKE[2]) bloom(t, 795, 645, 420, WAKE[2], 2, .7); g.restore(); ink(tvs, true, 6);
  line(740, 520, 700, 450, 36, 6); line(850, 520, 900, 440, 37, 6);
  objEye(t, 795, 645, 70, WAKE[2] + .05, 3);
  // table
  g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = rgba([170, 110, 70], .55); smooth(g, [[60, 1415], [1020, 1410], [1015, 1470], [65, 1475]], true); g.fill(); g.restore();
  line(50, 1415, 1030, 1410, 38, 11); line(60, 1472, 1020, 1468, 39, 6);
  line(130, 1470, 140, 2010, 40, 10); line(950, 1470, 940, 2010, 41, 10);
  // red takeover pools on the table: one per intro hop, a big one on the leap
  ILANDS.forEach((l, i) => bloom(t, 540 + (i - 1) * 180, 1440, 600, l, i, .4));
  bloom(t, 540, 1440, 1100, BIGHOP + .32, 1, .4);
  if (t < LEAP0) cat(t);
// lamp
  g.save(); g.translate(-65, 0);
  line(210, 1410, 210, 1150, 42, 9); ink(wob(210, 1410, 70, 14, 43, .1, 20), true, 8);
  const shade = [[125, 1150], [295, 1150], [255, 1010], [165, 1010]];
  wash(shade, [245, 205, 90], .8); ink(shade, true, 9);
  objEye(t, 210, 1090, 40, WAKE[0] + .05, 1);
  g.restore();
  bloom(t, SPX, SPY - 110, 480, SPK, 0, .45);
  if (t < LEAP0) speaker(t);
  // toaster (the toast pops when it wakes up)
  const tp = eo(seg(t, WAKE[1], WAKE[1] + .2)) - .3 * seg(t, WAKE[1] + .2, WAKE[1] + .5);
  const toast = wbox(800, 1250 - tp * 110, 110, 90, 20, 44, 2); wash(toast, [220, 170, 100], .8); ink(toast, true, 6);
  const tst = wbox(760, 1270, 200, 145, 40, 45, 3); wash(tst, [160, 175, 200], .75); ink(tst, true, 9);
  line(795, 1290, 925, 1290, 46, 5);
  objEye(t, 860, 1352, 34, WAKE[1] + .05, 2);
  if (t >= LEAP0) cat(t);
  if (t >= LEAP0) speaker(t);
  kitchenFryer(t);
  // the woken things bob along once they're in the band
  // tendrils from the robot to each thing it takes
  const tg = [[145, 1100], [860, 1330], [795, 700]];
  WAKE.forEach((l, i) => { const k = eo(seg(t, l - .05, l + .18)); if (k <= 0) return; const [ex, ey] = tg[i], pts = []; for (let j = 0; j <= 10; j++) { const u = j / 10 * k; pts.push([lerp(RBX0, ex, u) + Math.sin(u * 9 + i) * 30, lerp(RBY0 - catRide(t) - 130 * RBS, ey, u) - Math.sin(u * Math.PI) * 120 + jit(j, 60 + i) * 6]); } ink(pts, false, 7, RD, .8 * (1 - seg(t, l + .5, l + .9))); });
  { const k = eo(seg(t, SPK - .12, SPK + .04)), fade = 1 - seg(t, SPK + .35, SPK + .75); if (k > 0 && fade > 0) { const pts = []; for (let j = 0; j <= 10; j++) { const u = j / 10 * k; pts.push([lerp(BIPEYE.x - 60, SPX + 10, u) + Math.sin(u * 8) * 20, lerp(BIPEYE.y + 40, SPY - 170, u) - Math.sin(u * Math.PI) * 110 + jit(j, 66) * 6]); } ink(pts, false, 7, RD, .85 * fade); } }
  // the robot: hops, the big silent leap, then it dances
  let st;
  const inHop = [...IHOPS, BIGHOP].some(h => t > h - .13 && t < h + .56);
  if (t >= LEAP0 - .12) { // up, the cat arrives underneath, and a bumpy ride
    const a = seg(t, LEAP0 - .12, LEAP0), f = seg(t, LEAP0, LEAP1), l = seg(t, LEAP1, LEAP1 + .3), k = Math.sin(l * Math.PI) * (1 - l);
    const bx = lerp(540, RBX0, eio(f)), by = t < LEAP1 ? lerp(BIP.y - BIGH, RBY0, f * f) : RBY0 - catRide(t) - Math.abs(Math.sin(Math.max(0, t - LEAP1 - .08) / BEAT * Math.PI)) * 18;
    const d = dance(t, LEAP1), sc = lerp(BS, RBS, eio(f));
    const sy = t < LEAP0 ? 1 - .18 * Math.sin(a * Math.PI / 2) : t < LEAP1 ? lerp(1.15, .95, f) : 1 - .35 * k + (d.sy - 1) * .6;
    const sx = t < LEAP0 ? 1 + .12 * Math.sin(a * Math.PI / 2) : t < LEAP1 ? lerp(.9, 1.03, f) : 1 + .28 * k + (d.sx - 1) * .6;
    bip(bx, by, sc, { sx, sy, eye: eyeState(t), tilt: d.tilt * .6 + spring(t, WAKE, .06), ant: spring(t, [LEAP1, ...WAKE], .5) + Math.sin(t * TAU) * .1, wave: t > LEAP1 ? .75 + .25 * Math.sin(t / BEAT * Math.PI) : .6, wave2: t > LEAP1 ? d.wave2 * .7 : 1, hammer: back(seg(t, LEAP1 + .05, LEAP1 + .3)) }, t);
    return;
  }
  if (t < 4.4 || inHop) { const hp = hop(t, [...IHOPS, ...WHOPS]), bh = hop(t, [BIGHOP], 330); const b = t > BIGHOP - .13 && t < BIGHOP + .56 ? (t > BIGHOP ? { y: -Math.sin(seg(t, BIGHOP, BIGTOP) * Math.PI / 2) * BIGH, sx: .9, sy: 1.14 } : bh) : hp; st = { y: b.y, sx: b.sx, sy: b.sy, tilt: Math.sin(t * 2.2) * .03, wave: t > BIGHOP && t < BIGHOP + .4 ? 1 : 0, wave2: t > BIGHOP && t < BIGHOP + .4 ? 1 : 0 }; }
  else st = dance(t, 4.5);
  bip(BIP.x, BIP.y + st.y, BS, { sx: st.sx, sy: st.sy, eye: eyeState(t), tilt: st.tilt + spring(t, [...ILANDS, ...WAKE], .06), ant: spring(t, [...ILANDS, ...WAKE, BIGHOP + .32], .4) + Math.sin(t * TAU) * .1 * (t > 4.5), wave: st.wave, wave2: st.wave2 }, t);
}

// ---------- scene: city ----------
const R2 = rng(42), BLD = [];
{ let x = -40; while (x < W + 40) { const w = 110 + R2() * 130, h = 380 + R2() * 560; BLD.push({ x, w, h, s: R2() * 100 }); x += w + 8 + R2() * 20; } }
const CITY0 = 10.5, MOON = 11.48;
// cut 12: a jet crosses the city sky, its windows wake up as eyes, and Bip takes the autopilot: a loop-the-loop with a red contrail (TheOfficalPelekeOC43)
const PL0 = 10.5, PL1 = 12.45, PLR = 190, PLX = 420, PLY = 1010;
function planeAt(t) {
  const u = seg(t, PL0, PL1);
  if (u < .3) return [lerp(-260, PLX, u / .3), PLY + Math.sin(u * 9) * 8];
  if (u < .64) { const a = TAU * eio(seg(u, .3, .64)); return [PLX + PLR * Math.sin(a), PLY - PLR * (1 - Math.cos(a))]; }
  return [lerp(PLX, 1400, (u - .64) / .36), PLY - Math.sin((u - .64) * 6) * 30];
}
function plane(t) {
  if (t < PL0) return;
  // contrail: the path it just flew, turning red once Bip has the controls
  const tr = []; for (let k = 0; k <= 22; k++) { const [x, y] = planeAt(t - k * .035); tr.push([x + jit(k, 150) * 3, y + 6 + jit(k, 151) * 3]); }
  const red = seg(t, 10.85, 11.05);
  ink(tr, false, 30, mixc([235, 230, 225], RD, red), .35); ink(tr, false, 12, mixc(PAPER, RD, red), .6);
  const [x, y] = planeAt(t), [x2, y2] = planeAt(t + .01), hd = Math.atan2(y2 - y, x2 - x);
  g.save(); g.translate(x, y); g.rotate(hd + Math.sin(t * 17) * .03 * red); g.scale(1.4, 1.4);
  const tail = [[-175, -12], [-122, -12], [-160, -92], [-192, -92]], wing = [[-10, 6], [50, 6], [-55, 105], [-95, 105]], body = wob(0, 0, 175, 34, 151, .03, 26);
  wash(tail, [200, 210, 228], .95, 'source-over'); ink(tail, true, 6);
  wash(body, [238, 236, 240], 1, 'source-over');
  g.save(); smooth(g, body, true); g.clip(); g.fillStyle = rgba(RD, .8 * red); g.fillRect(-180, 8, 360 * red, 12); g.restore();
  ink(body, true, 7);
  wash(wing, [200, 210, 228], .95, 'source-over'); ink(wing, true, 6);
  for (let i = 0; i < 7; i++) { const wx = -105 + i * 30, at = 10.8 + i * .05; if (t < at) { g.fillStyle = rgba([250, 215, 120], .95); g.beginPath(); g.arc(wx, -8, 8, 0, TAU); g.fill(); } else eye(wx, -8, 12, { open: back(seg(t, at, at + .15)), col: RD, slit: 1, lx: Math.sin(t * 3 + i) * .4 }, 160 + i); }
  objEye(t, 140, -10, 16, 10.75, 170);
  g.restore();
}
// cut 19: the boy from cut 1 waves from a window, sees the eyes, ducks, and his window wakes up too (XDGamer5065)
const KB = BLD.findIndex(b => b.x < 700 && b.x + b.w > 700), KWIN = 10.95, KDUCK = 11.18, KEYE = 11.3;
function kidWin(t, x, y) {
  const lit = t < KEYE;
  if (!lit) { eye(x, y, 70, { open: back(seg(t, KEYE, KEYE + .2)), col: RD, slit: 1, brow: .8, lx: Math.sin(t * 3) * .4 }, 777); return; }
  g.save(); g.translate(x, y); g.scale(1.5, 1.5); g.translate(-x, -y);
  const fr = wbox(x - 52, y - 62, 104, 124, 8, 700, 2.5);
  wash(fr, [250, 215, 120], 1, 'source-over');
  g.save(); smooth(g, fr, true); g.clip();
  const duck = eio(seg(t, KDUCK, KDUCK + .12)) * 120, fear = t > KWIN, hx = x + (fear ? 0 : Math.sin(t * 9) * 3), hy = y + 8 + duck + (fear ? -6 * back(seg(t, KWIN, KWIN + .15)) : 0);
  wash(wob(hx, hy + 70, 40, 34, 701, .06, 18), [90, 160, 240], .95, 'source-over'); // pyjamas
  wash(wob(hx, hy, 27, 27, 702, .05, 20), [242, 194, 155], 1, 'source-over');
  wash(wob(hx, hy - 16, 29, 15, 703, .08, 18), [59, 38, 24], 1, 'source-over');
  ink([[hx - 2, hy - 28], [hx + 10, hy - 44], [hx + 16, hy - 34]], false, 5, [59, 38, 24]); // the cowlick
  ink(wob(hx, hy, 27, 27, 702, .05, 20), true, 4);
  g.fillStyle = 'rgba(255,120,120,.45)'; for (const d of [-16, 16]) { g.beginPath(); g.arc(hx + d, hy + 9, 5, 0, TAU); g.fill(); }
  for (const d of [-10, 10]) { if (fear) { g.fillStyle = '#fff'; g.beginPath(); g.arc(hx + d, hy + 1, 7, 0, TAU); g.fill(); g.fillStyle = rgba(INK); g.beginPath(); g.arc(hx + d + Math.sin(t * 20) * 1.5, hy + 1, 3, 0, TAU); g.fill(); } else { g.fillStyle = rgba(INK); g.beginPath(); g.ellipse(hx + d, hy + 1, 3.5, 4.5, 0, 0, TAU); g.fill(); } }
  g.fillStyle = rgba([106, 42, 42]); g.beginPath(); if (fear) g.ellipse(hx, hy + 15, 4, 6, 0, 0, TAU); else g.arc(hx, hy + 11, 7, .15 * Math.PI, .85 * Math.PI); fear ? g.fill() : (g.strokeStyle = rgba([106, 42, 42]), g.lineWidth = 3, g.stroke());
  if (!fear) { const wv = Math.sin(t * 16) * .5; ink([[hx + 30, hy + 50], [hx + 42 + wv * 8, hy + 22], [hx + 44 + wv * 14, hy]], false, 10, [90, 160, 240]); g.fillStyle = rgba([242, 194, 155]); g.beginPath(); g.arc(hx + 44 + wv * 14, hy - 4, 8, 0, TAU); g.fill(); }
  g.restore(); ink(fr, true, 6);
  ink([[x, y - 60], [x, y + 60]], false, 4, INK, .6); ink([[x - 50, y], [x - 30, y]], false, 4, INK, .4);
  if (t > KWIN && t < KDUCK + .1) hand(t, '!', x + 70, y - 70, 70, RD, KWIN, { out: KDUCK + .1, stroke: PAPER });
  g.restore();
}
// cut 19: "city's getting closer" — the buildings grow legs and stomp toward you (HorseThatWalkedIntoWebsim)
const LEGS = 11.1, STOMPS = [11.45, 11.95];
function city(t) {
  const z = lerp(1.12, 1, eo(seg(t, CITY0, CITY0 + .5))) * lerp(1, 1.1, eio(seg(t, CITY0, 12.45)));
  const bp = Math.max(0, t - CITY0) / BEAT, thump = Math.exp(-(bp % 1) * 6);
  let sx = 0, sy = 0; for (const s of STOMPS) { const [a, b] = shake(t, s, 34, .35); sx += a; sy += b; }
  camOn(540, 1000 + 110 * eio(seg(t, LEGS - .1, LEGS + .35)), z * (1 + .012 * thump), sx, sy);
  g.save(); g.globalCompositeOperation = 'multiply';
  sprite(WS.night, 540, 700, 2000, 2000, .95); sprite(WS.deep, 400, 300, 1300, 1300, .7);
  g.restore();
  for (let i = 0; i < 60; i++) { g.fillStyle = rgba(PAPER, .5 + .4 * hash(i)); g.beginPath(); g.arc(hash(i * 3) * W, hash(i * 5) * 900, 2 + hash(i * 7) * 4, 0, TAU); g.fill(); }
  for (let i = 0; i < 5; i++) bloom(t, 100 + i * 220, 1500 - i * 40, 1100, CITY0 + .6 + i * .15, i, .5);
  // moon → an eye on "closer"
  const mx = 760, my = 520, mr = 120;
  g.fillStyle = rgba(PAPER, .95); smooth(g, wob(mx, my, mr, mr, 70, .03, 30), true); g.fill();
  if (t > MOON) { g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = rgba(RD, .35 * seg(t, MOON, MOON + .2)); smooth(g, wob(mx, my, mr, mr, 70, .03, 30), true); g.fill(); g.restore(); }
  ink(wob(mx, my, mr, mr, 70, .03, 30), true, 7);
  objEye(t, mx, my, 90, MOON, 7);
  plane(t);
  // the whole skyline steps closer on each stomp
  const near = 1 + STOMPS.reduce((a, s) => a + .09 * back(seg(t, s - .08, s + .12)), 0);
  const lift = 200 * back(seg(t, LEGS, LEGS + .3));
  { const gp = []; for (let i = 0; i <= 20; i++) gp.push([-100 + i * 64, 1690 + jit(i, 880) * 10]); gp.push([1180, 2300], [-100, 2300]); wash(gp, [178, 150, 170], 1, 'source-over'); wash(gp, [200, 120, 130], .35 * seg(t, CITY0 + .6, CITY0 + 1.2)); }
  STOMPS.forEach((s, i) => bloom(t, 540, 1900, 1500, s, i + 3, .45));
  g.save(); g.translate(540, 1900); g.scale(near, near); g.translate(-540, -1900);
  // buildings bounce on the beat; windows wake up as eyes in a wave from the centre
  BLD.forEach((b, bi) => {
    const hb = b.h * (1 + .025 * thump * (bi % 2 ? 1 : .5)), top = 1920 - hb, cx = b.x + b.w / 2;
    // legs: each building lifts one foot before a stomp, alternating
    let land = 0, rise = 0; STOMPS.forEach((s, si) => { rise = Math.max(rise, Math.sin(Math.PI * seg(t, s - .3, s)) * ((bi + si) % 2 ? 1 : .35)); land = Math.max(land, Math.sin(Math.PI * seg(t, s, s + .22)) * (1 - seg(t, s, s + .22))); });
    g.save(); g.translate(cx, 1900); g.scale(1 + .06 * land, 1 - .07 * land + .03 * rise); g.translate(-cx, -1900 - lift);
    if (lift > 1) for (const k of [-1, 1]) {
      const lx = cx + k * b.w * .26, up = k === ((bi % 2) ? -1 : 1) ? rise * 60 : 0, fy = 1905 + lift - up;
      const la = Math.min(1, lift / 60);
      g.save(); g.globalAlpha = .35 * la * (1 - up / 80); g.fillStyle = rgba(INK); g.beginPath(); g.ellipse(lx + k * 8, 1911 + lift, 50, 12, 0, 0, TAU); g.fill(); g.restore();
      ink([[lx, 1930], [lx + k * 16, 1925 + lift * .5 - up * .5], [lx, fy - 10]], false, 34, INK, la);
      const ft = wob(lx + k * 14, fy - 4, 40, 20, 881 + bi, .06, 16); wash(ft, [60, 55, 95], la, 'source-over'); ink(ft, true, 7, INK, la);
    }
    const pts = wbox(b.x, top, b.w, hb + 60, 8, 80 + bi, 3);
    g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = rgba([60, 55, 95], .9); smooth(g, pts, true); g.fill(); g.restore();
    ink(pts, true, 7);
    const kx = cx, ky = top + 150, kid = bi === KB;
    for (let r = 0; r * 70 + 50 < b.h - 20; r++) for (let c = 0; c * 55 + 30 < b.w - 20; c++) {
      const wx = b.x + 32 + c * 55, wy = top + 50 + r * 70, id = bi * 100 + r * 10 + c;
      if (hash(id) < .3) continue;
      if (kid && Math.abs(wx - kx) < 80 && Math.abs(wy - ky) < 95) continue;
      const at = CITY0 + .05 + Math.hypot(wx - 540, wy - 1300) * .0008 + hash(id + 1) * .1;
      if (t < at) { g.fillStyle = rgba([250, 215, 120], .9); g.fillRect(wx - 16 + jit(id, 90) * 3, wy - 20, 32, 40); }
      else eye(wx, wy, 20, { open: back(seg(t, at, at + .18)), col: RD, slit: 1, lx: Math.sin(t * 2 + id) * .5 }, id);
    }
    if (kid) kidWin(t, kx, ky);
    g.restore();
  });
  g.restore();
  g.restore();
}

// ---------- scene: planet → the whole sky ----------
const CONT = [[.3, .2, 0], [-.4, 1.4, 1], [.1, 2.6, 2], [-.2, 3.9, 0], [.45, 5.1, 1]];
// "bip" (12.5) takes five spots, "bip!" (13.04) takes the rest
const PB = [[-.1, -.2], [.45, .3], [-.5, .35], [.2, -.6], [-.35, -.55], [.6, -.2], [0, .6], [-.7, -.1], [.3, .75]].map((p, i) => [p[0], p[1], i < 5 ? 12.5 + i * .04 : 13.04 + (i - 5) * .04]);
function planet(t, cx, cy, R) {
  const rot = t * .35;
  g.save(); smooth(g, wob(cx, cy, R, R, 100, .01, 60), true); g.clip();
  g.fillStyle = rgba([225, 235, 240]); g.fillRect(cx - R, cy - R, R * 2, R * 2);
  sprite(WS.blue, cx, cy, R * 2.7, R * 2.7, 1);
  const P = (lat, lon) => { const x = Math.cos(lat) * Math.sin(lon + rot), y = -Math.sin(lat), z = Math.cos(lat) * Math.cos(lon + rot); return [cx + x * R, cy + y * R, z, x]; };
  for (const [lat, lon, k] of CONT) { const [x, y, z] = P(lat, lon); if (z > -.2) sprite(WS.green[k], x, y, R * .9 * Math.max(.2, z), R * .8, .9); }
  for (let i = 0; i < PB.length; i++) { const [u, v, at] = PB[i], x = cx + u * R, y = cy + v * R, z = Math.sqrt(Math.max(.2, 1 - u * u - v * v)) * (1 + .5 * seg(t, at, 14.2)); { bloom(t, x, y, R * 1.1 * z, at, i, .5); g.save(); g.globalCompositeOperation = 'source-over'; const k = eo(seg(t, at, at + .4)); if (k > 0) sprite(WS.red[i % 3], x, y, R * .7 * z * k, R * .7 * z * k, .55, i, 'source-over'); g.restore(); } }
  const sh = g.createRadialGradient(cx - R * .4, cy - R * .4, R * .2, cx, cy, R * 1.1); sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(40,30,80,.55)');
  g.globalCompositeOperation = 'multiply'; g.fillStyle = sh; g.fillRect(cx - R, cy - R, R * 2, R * 2); g.globalCompositeOperation = 'source-over';
  for (let i = 0; i < PB.length; i++) { const [u, v, at] = PB[i], x = cx + u * R, y = cy + v * R, z = Math.sqrt(Math.max(.2, 1 - u * u - v * v)); if (z > .25) objEye(t, x, y, R * .15 * Math.sqrt(z), at + .1, 30 + i); }
  g.restore();
  ink(wob(cx, cy, R, R, 100, .01, 60), true, Math.max(6, R * .02));
}
const STARS = Array.from({ length: 70 }, (_, i) => [hash(i * 3 + 1) * W, hash(i * 5 + 2) * H, 1.5 + hash(i * 7 + 3) * 4, 17.48 + hash(i * 11) * .45]);
function space(t) {
  g.save(); g.globalCompositeOperation = 'multiply';
  sprite(WS.deep, 540, 960, 2300, 2300, 1); sprite(WS.night, 300, 500, 1400, 1400, .8); sprite(WS.night, 600, 1750, 1700, 1100, .9); sprite(WS.red[0], 800, 1600, 1200, 1200, .35 * seg(t, 12.5, 14));
  sprite(WS.red[2], 300, 500, 1400, 1400, .3 * seg(t, 17.4, 18.2));
  g.restore();
  // on "stars" every star opens a tiny red eye
  STARS.forEach(([x, y, r, at], i) => {
    if (t < at || i % 2) { g.fillStyle = rgba(PAPER, .4 + .5 * hash(i + 7)); g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
    else eye(x, y, 9 + r * 2, { open: back(seg(t, at, at + .2)) * (t % 2.7 < .08 ? .05 : 1), col: RD, slit: 1 }, i);
  });
}
// another world: a painted orb that gulps and opens an eye on its beat
function orb(t, x, y, r, sp, at, seed, ring) {
  if (t < at - .2) return;
  const k = back(seg(t, at - .2, at + .1)), s = r * k * (1 + .12 * Math.sin(seg(t, at, at + .35) * Math.PI));
  const bp = Math.max(0, t - 16.5) / BEAT, bob = Math.sin(bp * Math.PI + seed) * 8;
  y += bob;
  if (ring) { g.save(); g.translate(x, y); g.rotate(-.3); ink(wob(0, 0, s * 1.7, s * .45, seed, .02, 30).slice(15), false, 7, [200, 150, 80]); g.restore(); }
  g.save(); smooth(g, wob(x, y, s, s, seed, .02, 30), true); g.clip();
  g.fillStyle = rgba(PAPER); g.fillRect(x - s, y - s, s * 2, s * 2);
  sprite(sp, x - s * .2, y - s * .2, s * 2.6, s * 2.6, 1);
  bloom(t, x + s * .2, y + s * .1, s * 2.4, at, seed, .55);
  const sh = g.createRadialGradient(x - s * .4, y - s * .4, s * .2, x, y, s * 1.1); sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(40,30,80,.5)');
  g.globalCompositeOperation = 'multiply'; g.fillStyle = sh; g.fillRect(x - s, y - s, s * 2, s * 2);
  g.restore();
  ink(wob(x, y, s, s, seed, .02, 30), true, 7);
  if (ring) { g.save(); g.translate(x, y); g.rotate(-.3); ink(wob(0, 0, s * 1.7, s * .45, seed, .02, 30).slice(0, 16), false, 8, [200, 150, 80]); g.restore(); }
  objEye(t, x, y, s * .5, at + .05, seed);
}
// a little alien, standing on a surface at angle a (idea: DimencionStudio — aliens help the robots)
function alien(t, cx, cy, R, a, at, seed, col) {
  if (t < at) return;
  const k = back(seg(t, at, at + .3)), bp = (t - at) / BEAT, ph = bp % 1, hop = Math.abs(Math.sin(ph * Math.PI)) * 22, sq = 1 - .12 * Math.exp(-ph * 7);
  g.save(); g.translate(cx + Math.sin(a) * R, cy - Math.cos(a) * R); g.rotate(a); g.scale(1.45 * k * (2 - sq), 1.45 * k * sq); g.translate(0, -hop);
  const body = wob(0, -48, 40, 48, seed, .06, 22);
  g.fillStyle = rgba(PAPER); smooth(g, body, true); g.fill(); wash(body, col, .85); ink(body, true, 6);
  const wv = Math.sin(bp * Math.PI);
  ink([[-34, -50], [-62, -80 - wv * 20], [-66, -110 - wv * 20]], false, 7); ink([[34, -50], [62, -80 + wv * 20], [66, -110 + wv * 20]], false, 7);
  [-18, 18].forEach((ex, j) => { line(ex * .6, -92, ex * 1.3, -130, seed + j, 5); g.fillStyle = '#fbf6ea'; smooth(g, wob(ex * 1.3, -138, 14, 14, seed + j, .08, 12), true); g.fill(); ink(wob(ex * 1.3, -138, 14, 14, seed + j, .08, 12), true, 4); g.fillStyle = rgba(INK); g.beginPath(); g.arc(ex * 1.3 + 3, -137, 6, 0, TAU); g.fill(); });
  ink([[-14, -40], [0, -30], [14, -40]], false, 5);
  g.restore();
}
// a robot house (a house with a TV face), popping onto a surface
function roboHouse(t, cx, cy, R, a, at, seed, sc = 1) {
  if (t < at) return;
  const k = back(seg(t, at, at + .3)) * sc * 1.35;
  g.save(); g.translate(cx + Math.sin(a) * R, cy - Math.cos(a) * R); g.rotate(a); g.scale(k, k * (1 + .15 * Math.sin(seg(t, at, at + .3) * Math.PI)));
  const box = wbox(-50, -90, 100, 90, 10, seed, 2); g.fillStyle = rgba(PAPER); smooth(g, box, true); g.fill(); wash(box, [170, 190, 200], .85); ink(box, true, 6);
  const roof = [[-64, -86], [0, -146], [64, -86]]; g.fillStyle = rgba(PAPER); smooth(g, roof, true); g.fill(); wash([[-64, -86], [0, -146], [64, -86]], [214, 36, 52], .7); ink(roof, true, 6);
  line(0, -146, 0, -176, seed, 5); g.fillStyle = rgba(RD); g.beginPath(); g.arc(0, -180, 8, 0, TAU); g.fill();
  const scr = wbox(-32, -76, 64, 50, 12, seed + 1, 2); g.fillStyle = '#1b1a36'; smooth(g, scr, true); g.fill(); ink(scr, true, 4);
  eye(0, -51, 20, { open: 1, col: RD, slit: 1, lx: Math.sin(t * 3 + seed) * .5 }, seed);
  g.restore();
}
// Earth, framed after the pull-back (screen space)
const EX = 540, EY = 1183, ER = 186;
function world(t) {
  space(t);
  // 12.45–13.75 the planet fills the frame; it drops as Bip falls in and lands on "I'm" (14.12)
  const LAND = 14.12, p = eio(seg(t, 13.72, LAND));
  const z = 1 - .38 * eio(seg(t, 15.9, 16.45)), zc = lerp(960, 1200, eio(seg(t, 15.9, 16.45)));
  const drift = 1 + .04 * seg(t, 16.45, 21.2);
  const [sx, sy] = shake(t, LAND, 34, .4);
  g.save(); g.translate(W / 2 + sx, 960 + sy); g.scale(z * drift, z * drift); g.translate(-540, -zc);
  const cy = lerp(960, 1560, p), R = lerp(430, 300, p) * (1 + (t > LAND ? .04 * Math.sin(seg(t, LAND, LAND + .45) * Math.PI) : 0));
  planet(t, 540, cy, R);
  if (t > 13.72) {
    const d = seg(t, 13.72, LAND), fy = t < LAND ? lerp(-500, 1270, d * d) : 1270;
    const l = seg(t, LAND, LAND + .28), kk = Math.sin(l * Math.PI) * (1 - l);
    const dn = t > LAND + .3 ? dance(t, 14.5, 30) : { y: 0, sx: 1, sy: 1, tilt: 0, wave: 0, wave2: 0 };
    const e = { open: t > 19.2 && t < 19.28 ? .05 : 1, col: RD, slit: 1, brow: 1, lx: t > 16.4 && t < 17.4 ? Math.sin(t * 5) : 0 };
    bip(540, fy + dn.y, .95, { sx: t < LAND ? .9 : (1 + .45 * kk) * dn.sx, sy: t < LAND ? 1.15 : (1 - .5 * kk) * dn.sy, eye: e, tilt: dn.tilt, ant: spring(t, [LAND], .6) + Math.sin(t * TAU) * .1, wave: t < LAND ? 1 : dn.wave, wave2: t < LAND ? 1 : dn.wave2 }, t);
  }
  g.restore();
  if (t < 16.3) return;
  // "planets": the neighbours go red one per beat
  const zd = drift, P = (x, y) => [540 + (x - 540) * zd, 960 + (y - 960) * zd];
  g.save(); g.translate(540, 960); g.scale(zd, zd); g.translate(-540, -960);
  orb(t, 235, 610, 125, WS.gold, 16.5, 201, true);
  orb(t, 870, 700, 88, WS.pink, 16.75, 202);
  orb(t, 800, 290, 60, WS.violet, 17.0, 203);
  orb(t, 830, 1600, 115, WS.green[2], 17.25, 204);
  orb(t, 215, 1640, 80, WS.lav, 17.25, 205, true);
  // "and aliens too": aliens pop up on every world and dance; they build robot houses with it
  alien(t, 235, 610, 125, -.5, 18.54, 301, [120, 200, 110]);
  alien(t, 870, 700, 88, .3, 18.8, 302, [150, 210, 90]);
  alien(t, 830, 1600, 115, -.4, 19.05, 303, [110, 190, 150]);
  alien(t, 215, 1640, 80, .2, 19.3, 304, [160, 200, 100]);
  roboHouse(t, 235, 610, 125, .75, 19.5, 311, .9);
  roboHouse(t, 830, 1600, 115, .5, 20.0, 312, .9);
  roboHouse(t, 870, 700, 88, -.6, 20.5, 313, .7);
  roboHouse(t, 215, 1640, 80, -.7, 21.0, 314, .6);
  g.restore();
  // aliens on Earth either side of Bip
  const [ex, ey] = P(EX, EY);
  g.save(); g.translate(ex, ey); g.scale(zd, zd); g.translate(-EX, -EY);
  alien(t, EX, EY, ER * .98, -.85, 18.54, 305, [130, 200, 120]);
  alien(t, EX, EY, ER * .98, .85, 18.8, 306, [150, 200, 90]);
  roboHouse(t, EX, EY, ER * .98, -1.45, 20.0, 315, .8);
  roboHouse(t, EX, EY, ER * .98, 1.45, 20.5, 316, .8);
  g.restore();
}
// ---------- finale: "who's next? … YOU!" ----------
const YOU = 22.62, PUSH = 23.05;
function finale(t) {
  g.save(); g.globalCompositeOperation = 'multiply';
  sprite(WS.red[2], 540, 700, 1900, 1500, .5); sprite(WS.peach, 540, 1500, 1500, 1200, .45); sprite(WS.lav, 200, 300, 900, 900, .4);
  sprite(WS.red[0], 540, 900, 2400 * eo(seg(t, YOU, YOU + .35)), 2400 * eo(seg(t, YOU, YOU + .35)), .5);
  g.restore();
  // radiating ink rays on "YOU!"
  if (t > YOU) { const k = eo(seg(t, YOU, YOU + .3)); for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + .1; line(540 + Math.cos(a) * 380, 900 + Math.sin(a) * 380, 540 + Math.cos(a) * (380 + 600 * k), 900 + Math.sin(a) * (380 + 600 * k), 400 + i, 10, RD, .7); } }
  const look = t < 21.54 ? -1 : t < 22.0 ? 1 : 0;
  const lean = eo(seg(t, 22.2, YOU)), hp = hop(t, [21.0], 80);
  const blink = t > 23.42 ? 1 - seg(t, 23.42, 23.52) : 1; // eye shuts so the loop reopens it
  bip(BIP.x, BIP.y + hp.y, BS * (1 + .08 * lean), { sx: hp.sx, sy: hp.sy, eye: { open: blink, col: RD, slit: t > YOU ? 1 : .8, brow: 1, lx: look * eo(seg(t, 21.2, 21.3)), ly: .4 * lean }, tilt: Math.sin(t * 4) * .04 + (t < YOU ? .14 * eo(seg(t, 21.54, 21.8)) : 0), ant: spring(t, [21.32, YOU], .5), wave: t > YOU ? 1 : .2, wave2: t > YOU ? 1 : .2 }, t);
}
// ---------- the ending (song time 23.9–30.4): Grandma trips over Bip's plug, everything powers down, the spoon wakes up ----------
// (idea: DimencionStudio — "an elderly woman spots a cable, accidentally breaks it … but an electronic spoon exacts revenge")
const E0 = 23.9, POP = 25.9, DOWN = 26.1, SPOON = 27.6, SPEYE = 28.35, SPRED = 29.0;
const GREY = makeWash(512, [120, 125, 140], 19, { r: .42, layers: 26 }), PLANK = makeWash(384, [196, 140, 90], 20, { sx: 1.6, sy: .7 });
const SLIP = makeWash(256, [240, 140, 170], 21, { r: .4 }), SKIRT = makeWash(384, [150, 130, 200], 22, { r: .42 });
// shuffling steps (on the slipper sound): [time, foot 0=L 1=R]; each step slides the foot 250 px left
const STEPS = [[24.2, 0], [24.46, 1], [25.25, 0], [25.45, 1]], SNAG = 25.55;
function footX(t, f) {
  let x = f ? 1330 : 1200, lift = 0;
  for (const [st, ff] of STEPS) if (ff === f) { const k = seg(t, st, st + .24); x -= 250 * eio(k); if (k > 0 && k < 1) lift = Math.sin(k * Math.PI); }
  const d = eio(seg(t, SNAG, POP)); x -= (f ? 190 : 150) * d; // the snag: she drags the cable along
  return [x, lift];
}
function slipper(x, y, lift, seed, tilt) {
  g.save(); g.translate(x, y - lift * 40); g.rotate(-lift * .12 + tilt);
  g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = rgba(INK, .16 * (1 - lift * .5)); g.beginPath(); g.ellipse(0, 38 + lift * 40, 120, 16, 0, 0, TAU); g.fill(); g.restore();
  const sh = wob(0, 0, 118, 44, seed, .05, 28); g.fillStyle = rgba(PAPER); smooth(g, sh, true); g.fill();
  sprite(SLIP, 0, 0, 300, 150, .95, seed); ink(sh, true, 8);
  for (let i = 0; i < 9; i++) line(-100 + i * 24, -30 + jit(i, seed) * 10, -104 + i * 24, -44, seed + i, 3, INK, .5); // fluff
  const pm = wob(-112, -26, 34, 30, seed + 5, .15, 16); g.fillStyle = 'rgba(255,240,245,.95)'; smooth(g, pm, true); g.fill(); sprite(SLIP, -112, -26, 90, 90, .6); ink(pm, true, 6);
  g.restore();
}
function cablePts(t) {
  // socket (230,1170) → down the wall → forward across the floor → off to the right, toward Bip
  const plugged = t < POP, pf = seg(t, POP, POP + .45);
  const pl = plugged ? [230, 1170] : [lerp(230, 560, eo(pf)), lerp(1170, 1600, pf * pf) - Math.sin(pf * Math.PI) * 180];
  const [rx] = footX(t, 1), snag = t > SNAG ? [rx + 60, 1735] : null;
  const pts = [pl, [260, 1300], [320, 1560], [520, 1780], [790, 1730], [960, 1580], [1160, 1470]];
  if (snag) { pts[3] = [lerp(520, snag[0] - 120, .6), lerp(1780, 1760, .6)]; pts[4] = snag; }
  const fk = eo(seg(t, FRT0, FRT1)); if (fk > 0) pts[3] = [lerp(pts[3][0], fryerX(t) + 45 * FRTS, fk), lerp(pts[3][1], FRTY - 72 * FRTS, fk)]; // the traitor holds it up
  if (t > SNAG && plugged) { const k = seg(t, SNAG, POP); pts[1] = [lerp(260, 300, k), lerp(1300, 1350, k)]; pts[2] = [lerp(320, 420, k), lerp(1560, 1600, k)]; } // pulled taut
  return pts.map((p, i) => [p[0] + jit(i, 70) * 5, p[1] + jit(i, 71) * 5]);
}
const FRIN = 24.35, FRT0 = 24.9, FRT1 = 25.2, FRTX = 500, FRTY = 1735, FRTS = 1.35; // ending time: it tiptoes in, grabs the cable, holds it up for Grandma's slipper, then yanks
function fryerX(ts) { return lerp(-180, FRTX, eio(seg(ts, FRIN, FRT0 - .1))) - 190 * eio(seg(ts, SNAG, POP + .1)); }
function floorFryer(ts) {
  if (ts < FRIN) return;
  const k = seg(ts, FRIN, FRT0 - .1), x = fryerX(ts), yank = seg(ts, SNAG, POP + .1);
  const joy = ts > POP + .1 ? hop(ts, [POP + .12], 50) : { y: 0, sx: 1, sy: 1 };
  fryer(x, FRTY + joy.y, FRTS, { tilt: k < 1 ? Math.sin(ts * 14) * .06 : yank > 0 && yank < 1 ? -.22 : spring(ts, [POP + .1], .3) * .4, sx: joy.sx, sy: joy.sy,
    walk: k > 0 && k < 1 ? (ts - FRIN) / BEAT * 3 : yank > 0 && yank < 1 ? -(ts - SNAG) / BEAT * 4 : null,
    lx: ts < POP ? 1 : -.5, ly: ts < POP ? .2 : -.5, brow: ts < POP + .1 ? .7 : 0, open: ts > POP + .02 && ts < POP + .16 ? .05 : 1, dial: ts * 4 });
  if (seg(ts, FRT0, FRT1) > .3 && ts < SNAG + .3) { const c = cablePts(ts), hx = x + 45 * FRTS, hy = FRTY - 72 * FRTS, seg_ = [[hx - 70, hy + 6], [hx, hy], [hx + 60, hy + 10]]; ink(seg_, false, 22, INK); ink(seg_, false, 12, mixc([90, 80, 100], RD, .5 + .5 * Math.sin(ts * 12))); } // the cable, gripped in its drawer handle
  hand(ts, 'shh', FRTX + 150, FRTY - 400, 84, CY, FRT0 + .05, { out: SNAG });
  hand(ts, 'hehe', x + 170, FRTY - 400, 88, CY, SNAG + .05, { stagger: .04 });
}
function floorShot(ts) {
  const [sx, sy] = shake(ts, POP, 28, .35);
  camOn(540, 960, shotIn(ts, E0) * lerp(1, 1.06, seg(ts, E0, DOWN)), sx, sy);
  g.save(); g.globalCompositeOperation = 'multiply';
  sprite(WS.peach, 540, 600, 1900, 1600, .7); sprite(WS.lav, 900, 300, 1000, 900, .35);
  sprite(PLANK, 540, 1640, 1900, 700, .85); sprite(PLANK, 300, 1800, 1200, 500, .5, 1);
  g.restore();
  line(-20, 1360, 1100, 1350, 80, 9); line(-20, 1320, 1100, 1312, 81, 5, INK, .5); // baseboard
  for (let i = 0; i < 5; i++) line(-20, 1440 + i * i * 34, 1100, 1432 + i * i * 36, 82 + i, 4, [120, 80, 50], .45); // planks
  // wall socket + the plug
  const so = wbox(170, 1090, 120, 160, 18, 83, 2); g.fillStyle = 'rgba(251,246,234,.95)'; smooth(g, so, true); g.fill(); ink(so, true, 7);
  ink(wob(212, 1150, 7, 14, 84, .1, 10), true, 5); ink(wob(248, 1150, 7, 14, 85, .1, 10), true, 5);
  // the tag on the cable says whose it is
  const pts = cablePts(ts);
  ink(pts, false, 22, INK); ink(pts, false, 12, mixc([90, 80, 100], RD, ts < POP ? .5 + .5 * Math.sin(ts * 12) : 0));
  if (ts < POP) for (let i = 0; i < 6; i++) { // power pulses run from the socket to Bip
    const u = ((ts * .9 + i / 6) % 1) * (pts.length - 1), j = Math.floor(u), f = u - j, a = pts[j], b = pts[Math.min(j + 1, pts.length - 1)];
    const px = lerp(a[0], b[0], f), py = lerp(a[1], b[1], f); g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(px, py, 0, px, py, 34); gr.addColorStop(0, rgba([255, 90, 90], .8)); gr.addColorStop(1, rgba(RD, 0)); g.fillStyle = gr; g.fillRect(px - 34, py - 34, 68, 68); g.restore(); }
  const tg = [pts[1][0] + 90, pts[1][1] + 20], tw = wbox(tg[0] - 20, tg[1] - 150, 150, 80, 12, 86, 2);
  line(tg[0], tg[1], tg[0] + 10, tg[1] - 75, 87, 4); g.fillStyle = 'rgba(251,246,234,.97)'; smooth(g, tw, true); g.fill(); ink(tw, true, 6);
  g.save(); g.font = `900 48px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = rgba(RD); g.fillText('BIP', tg[0] + 55, tg[1] - 108); g.restore();
  // plug body at the cable's end
  const pl = pts[0], pr = ts < POP ? 0 : seg(ts, POP, POP + .45) * 9;
  g.save(); g.translate(pl[0], pl[1]); g.rotate(pr); const pb = wbox(-34, -30, 68, 70, 14, 88, 2); wash(pb, [90, 80, 100], .9); ink(pb, true, 7); g.restore();
  if (ts > POP && ts < POP + .35) { const k = seg(ts, POP, POP + .35); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + .3; line(230 + Math.cos(a) * 30, 1170 + Math.sin(a) * 30, 230 + Math.cos(a) * (40 + 160 * eo(k)), 1170 + Math.sin(a) * (40 + 160 * eo(k)), 90 + i, 7, [255, 200, 60], 1 - k); } }
  // Grandma, from the knees down: stockings, a floral hem, fuzzy slippers
  const [lx, ll] = footX(ts, 0), [rx, rl] = footX(ts, 1), cx = (lx + rx) / 2 + 60, sway = Math.sin(ts * 6) * 14;
  if (cx < 1500) {
    const tug = ts > SNAG && ts < POP ? Math.sin(ts * 70) * 4 : 0, wob2 = spring(ts, [POP], .5);
    for (const [fx, fl, sd] of [[rx, rl, 1], [lx, ll, 0]]) { line(cx + (sd ? 80 : -80) + sway, 1000, fx + 20, 1690 - fl * 40, 91 + sd, 84, INK); line(cx + (sd ? 80 : -80) + sway, 1000, fx + 20, 1690 - fl * 40, 91 + sd, 68, [228, 196, 170]); line(cx + (sd ? 80 : -80) + sway, 1000, fx + 20, 1690 - fl * 40, 91 + sd, 18, [250, 225, 205], .6); }
    const hem = []; for (let i = 0; i <= 18; i++) { const u = i / 18; hem.push([cx - 300 + u * 600 + sway, 1040 + Math.sin(u * TAU * 3 + ts * 5) * 18 + wob2 * 30 * Math.sin(u * 9)]); }
    const sk = [[cx - 250 + sway * .3, -40], [cx + 250 + sway * .3, -40], ...hem.reverse()];
    g.fillStyle = rgba(PAPER); smooth(g, sk, true); g.fill(); g.save(); smooth(g, sk, true); g.clip(); sprite(SKIRT, cx, 600, 1100, 1500, .95);
    for (let i = 0; i < 22; i++) { const fx = cx - 280 + hash(i) * 560 + sway, fy = 80 + hash(i * 7) * 960; sprite(WS.pink, fx, fy, 70, 70, .8); sprite(WS.gold, fx, fy, 22, 22, .9); }
    g.restore(); ink(sk, true, 9);
    slipper(rx + tug, 1720, rl, 93, 0); slipper(lx, 1735, ll, 94, 0);
    if (ts > POP) hand(ts, '?', cx - 350, 760, 150, INK, POP + .1, { stroke: PAPER }); // she didn't notice a thing
  }
  floorFryer(ts); // cut 22: the traitor lifts Bip's cable into a tripwire, then yanks
  g.restore();
  hand(ts, 'meanwhile,', 540, 290, 80, PAPER, E0 + .05, { stagger: .02, out: 25.4 }); hand(ts, 'in the kitchen…', 540, 390, 80, PAPER, E0 + .3, { stagger: .02, out: 25.4 });
}
function powerDown(ts) {
  const d = eo(seg(ts, DOWN + .1, DOWN + 1.3)); // colour drains out of the takeover
  camOn(540, 960, shotIn(ts, DOWN) * lerp(1, 1.08, seg(ts, DOWN, SPOON)));
  g.save(); g.globalCompositeOperation = 'multiply';
  sprite(WS.red[2], 540, 700, 1900, 1500, .5 * (1 - d)); sprite(WS.red[0], 540, 900, 2400, 2400, .5 * (1 - d));
  sprite(GREY, 540, 900, 2400, 2400, .75 * d); sprite(WS.night, 300, 400, 1400, 1400, .5 * d); sprite(WS.peach, 540, 1500, 1500, 1200, .45);
  g.restore();
  // the flicker, then the eye shuts and Bip sags
  const f = ts - DOWN, on = f < .9 ? (Math.sin(f * 40) > -.2 && !(f > .45 && f < .6) ? 1 : .08) : 1 - seg(f, .9, 1.1);
  const sag = eio(seg(f, .8, 1.3));
  bip(BIP.x, BIP.y, BS, { sx: 1 + .12 * sag, sy: 1 - .16 * sag, eye: { open: Math.max(.04, on), col: mixc(RD, [110, 100, 110], seg(f, .2, .9)), slit: 1 - sag, brow: 1 - sag, ly: .6 * sag }, tilt: -.22 * sag, ant: .5 * sag + spring(ts, [DOWN + 1.3], .3), wave: .2 * (1 - sag), wave2: .2 * (1 - sag), pow: 1 - sag }, ts);
  if (f > 1.2) { const k = seg(f, 1.2, 1.5); for (let i = 0; i < 3; i++) sprite(GREY, 540 + Math.sin(ts * 2 + i) * 30, BIPEYE.y - 560 - (ts - DOWN - 1.2) * 160 - i * 70, 150 + i * 40, 150 + i * 40, .5 * k * (1 - i * .25)); } // a puff of smoke
  g.restore();
  hand(ts, '…bip?', 540, 330, 110, PAPER, DOWN + .95, { stagger: .05 });
}
function spoonShot(ts) {
  const red = ts > SPRED, hp = hop(ts, [SPRED - .1], 70);
  camOn(540, 1000, shotIn(ts, SPOON) * lerp(1, 1.12, eio(seg(ts, SPOON, 30.4))), ...shake(ts, SPRED, 14, .25));
  g.save(); g.globalCompositeOperation = 'multiply';
  sprite(WS.lav, 540, 700, 2000, 2000, .45); sprite(WS.peach, 540, 1300, 1600, 1400, .5);
  g.fillStyle = 'rgba(80,110,190,.08)'; for (let i = -2; i < 14; i++) { g.fillRect(i * 110 + jit(i, 95) * 6, 0, 55, H); g.fillRect(0, i * 110 + 400, W, 55); } // gingham tablecloth
  sprite(WS.red[2], 470, 1000, 1400 * eo(seg(ts, SPRED, SPRED + .4)), 1400 * eo(seg(ts, SPRED, SPRED + .4)), .3);
  g.restore();
  // Grandma's teacup, still steaming
  const cup = [[680, 520], [960, 520], [930, 700], [710, 700]]; ink(wob(820, 720, 200, 40, 96, .05, 24), true, 8); g.fillStyle = rgba(PAPER); smooth(g, cup, true); g.fill(); wash(cup, [150, 190, 220], .6); ink(cup, true, 8); ink(wob(975, 590, 40, 45, 97, .1, 16), true, 7);
  for (let i = 0; i < 3; i++) { const p = []; for (let j = 0; j <= 8; j++) p.push([760 + i * 60 + Math.sin(j + ts * 3 + i) * 16, 490 - j * 30]); ink(p, false, 5, INK, .35); }
  // the cereal bowl (wearemanyweareone: "the natural evolution of a spoon"): when the spoon turns red, every loop opens a red eye
  { const bx = 250, by = 680, sq = spring(ts, [SPRED + .1], .06);
    g.save(); g.translate(bx, by); g.scale(1 + sq, 1 - sq);
    const milk = wob(0, -70, 200, 48, 102, .04, 26); g.fillStyle = rgba([250, 246, 236]); smooth(g, milk, true); g.fill(); wash(milk, [230, 225, 205], .4);
    for (let i = 0; i < 9; i++) { const row = i < 4 ? 0 : i < 7 ? 1 : 2, k = i - [0, 4, 7][row], ox = (k - [1.5, 1, .5][row]) * 84 + (hash(i + 40) - .5) * 20, oy = -78 - row * 44 + (hash(i + 41) - .5) * 12, at = SPRED + .12 + i * .05;
      const o = wob(ox, oy, 40, 27, 110 + i, .08, 14); g.fillStyle = rgba([230, 170, 80]); smooth(g, o, true); g.fill(); wash(o, [200, 120, 50], .5); ink(o, true, 4);
      if (ts <= at) { const hl = wob(ox, oy - 2, 15, 9, 140 + i, .1, 10); g.fillStyle = rgba([245, 238, 220]); smooth(g, hl, true); g.fill(); ink(hl, true, 3, INK, .7); }
      else eye(ox, oy - 2, 22, { open: back(seg(ts, at, at + .2)), col: RD, slit: 1, lx: Math.sin(ts * 4 + i) * .4 }, 120 + i); }
    const bw = [[-215, -70], [215, -70], [170, 70], [80, 120], [-80, 120], [-170, 70]]; g.fillStyle = rgba(PAPER); smooth(g, bw, true); g.fill(); wash(bw, [230, 160, 170], .55);
    ink(bw, true, 8); for (let i = 0; i < 5; i++) { const x = -150 + i * 75; line(x, -20, x + 18, 40, 130 + i, 4, INK, .3); }
    g.restore(); }
  // the spoon: bowl + handle; it wakes, looks around, turns red and hops
  g.save(); g.translate(470, 1180 + hp.y); g.scale(1.3 * hp.sx, 1.3 * hp.sy); g.rotate(-.5 + spring(ts, [SPRED], .12));
  const hd = wbox(-20, 0, 40, 560, 20, 98, 2); g.fillStyle = rgba(PAPER); smooth(g, hd, true); g.fill(); wash(hd, [160, 170, 190], .8); ink(hd, true, 8);
  const bw = wob(0, -120, 150, 190, 99, .03, 30); g.fillStyle = rgba(PAPER); smooth(g, bw, true); g.fill(); wash(bw, [170, 180, 200], .85);
  g.save(); g.globalCompositeOperation = 'lighter'; smooth(g, wob(-50, -190, 40, 70, 100, .1, 14), true); g.fillStyle = 'rgba(255,255,255,.35)'; g.fill(); g.restore(); ink(bw, true, 9);
  if (ts > SPEYE) { const o = back(seg(ts, SPEYE, SPEYE + .3)), lx = ts < 28.6 ? 0 : ts < 28.8 ? -1 : ts < SPRED - .05 ? 1 : 0;
    g.save(); g.rotate(.5); eye(0, -120, 88, { open: ts > SPRED - .12 && ts < SPRED - .04 ? .05 : o, col: red ? RD : CY, lx, slit: red ? eo(seg(ts, SPRED, SPRED + .2)) : 0, brow: red ? eo(seg(ts, SPRED, SPRED + .2)) : 0 }, 101); g.restore(); }
  g.restore();
  g.restore();
  if (red) hand(ts, 'bip.', 540, 330, 150, RD, SPRED + .02);
}
// the last shot (wearemanyweareone: "the obvious step from cereal is the person who eats the cereal"): the spoon feeds Grandma… and now she's Bip's
const GD = 2.6, GBITE = .75, GRED = 1.45, GBIP = 1.75;
const SKIN = makeWash(384, [240, 196, 170], 26, { r: .42 }), CARD = makeWash(384, [150, 130, 200], 27, { r: .42, layers: 26 });
function grandmaShot(f) {
  const ts = 50 + f, red = f > GRED, rk = eo(seg(f, GRED, GRED + .35));
  const z = shotIn(f, 0) * lerp(1, 1.06, f / GD) * (1 + .1 * eio(seg(f, GRED, GRED + .25)));
  camOn(540, lerp(1000, 930, rk), z, ...shake(f, GRED, 26, .35));
  g.save(); g.globalCompositeOperation = 'multiply';
  sprite(WS.peach, 540, 700, 2000, 1800, .7); sprite(WS.lav, 200, 300, 1000, 900, .35);
  sprite(WS.red[0], 540, 900, 2600 * rk, 2600 * rk, .5 * rk); sprite(WS.red[2], 540, 820, 1300 * rk, 1000 * rk, .35 * rk);
  g.restore();
  // Grandma: cardigan, round face, a white bun, round glasses
  const chew = f > GBITE && f < GRED - .1 ? Math.abs(Math.sin((f - GBITE) * 18)) : 0, bob = Math.sin(ts * 3) * 8 + spring(f, [GBITE], 18) + spring(f, [GRED], 22);
  const body = [[90, H + 60], [140, 1420], [330, 1270], [540, 1250], [750, 1270], [940, 1420], [990, H + 60]];
  g.fillStyle = rgba(PAPER); smooth(g, body, true); g.fill(); g.save(); smooth(g, body, true); g.clip(); sprite(CARD, 540, 1600, 1300, 900, .95);
  for (let i = 0; i < 6; i++) { const bx = 540 + (i % 2 ? 1 : -1) * 16, by = 1380 + i * 90; ink(wob(bx, by, 14, 14, 500 + i, .1, 10), true, 4); } g.restore(); ink(body, true, 9);
  line(540, 1260, 540, H, 510, 5, INK, .6);
  g.save(); g.translate(0, bob);
  const bun = wob(540, 590, 120, 95, 520, .06, 24); g.fillStyle = 'rgba(248,246,240,1)'; smooth(g, bun, true); g.fill(); sprite(GREY, 540, 590, 280, 230, .35); ink(bun, true, 7);
  for (let i = 0; i < 5; i++) ink(wob(470 + i * 34, 590 + Math.sin(i) * 20, 30, 20, 521 + i, .15, 12), false, 3, INK, .4);
  const face = wob(540, 920, 250, 270 + chew * 8, 530, .03, 36); g.fillStyle = rgba(PAPER); smooth(g, face, true); g.fill(); g.save(); smooth(g, face, true); g.clip(); sprite(SKIN, 540, 950, 620, 660, .95);
  sprite(WS.pink, 380, 1030 - chew * 6, 170 + chew * 30, 120, .7); sprite(WS.pink, 700, 1030 - chew * 6, 170 + chew * 30, 120, .7); g.restore();
  const hair = [[290, 900], [300, 760], [380, 670], [540, 640], [700, 670], [780, 760], [790, 900], [730, 760], [620, 720], [540, 740], [460, 720], [350, 770]];
  g.fillStyle = 'rgba(248,246,240,1)'; smooth(g, hair, true); g.fill(); sprite(GREY, 540, 720, 560, 260, .3); ink(hair, true, 7); ink(face, true, 8);
  // eyes behind the glasses: happily shut while she hums and crunches, then they open… red
  for (const ex of [440, 640]) {
    if (!red) ink([[ex - 42, 910], [ex - 14, 890], [ex + 14, 890], [ex + 42, 910]], false, 8);
    else { eye(ex, 905, 74, { open: back(seg(f, GRED, GRED + .22)), col: RD, slit: 1, lx: Math.sin(ts * 2) * .2 }, 540 + ex);
      g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(ex, 905, 0, ex, 905, 120); gr.addColorStop(0, rgba([255, 80, 80], .35 * rk)); gr.addColorStop(1, rgba(RD, 0)); g.fillStyle = gr; g.fillRect(ex - 120, 785, 240, 240); g.restore(); }
    const gl = wob(ex, 905, 88, 80, 550 + ex, .03, 28); g.fillStyle = `rgba(255,255,255,${red ? .06 : .18})`; smooth(g, gl, true); g.fill(); ink(gl, true, 9);
    g.save(); g.globalCompositeOperation = 'lighter'; smooth(g, wob(ex - 36, 870, 16, 26, 560 + ex, .1, 10), true); g.fillStyle = 'rgba(255,255,255,.5)'; g.fill(); g.restore();
  }
  line(526, 900, 554, 900, 570, 7); line(352, 895, 300, 870, 571, 6); line(728, 895, 780, 870, 572, 6);
  ink([[530, 960], [522, 1000], [546, 1004]], false, 6, INK, .7); // nose
  // mouth: an "o" for the spoon, a chewing squiggle, then a small, satisfied smile
  const open = seg(f, .35, .65) * (1 - seg(f, GBITE - .03, GBITE + .05));
  if (open > .05) { const m = wob(540, 1075, 34, 40 * open, 580, .08, 16); g.fillStyle = rgba([120, 40, 50]); smooth(g, m, true); g.fill(); ink(m, true, 6); }
  else if (chew) ink([[495, 1075], [520, 1068 + chew * 10], [560, 1082 - chew * 10], [585, 1072]], false, 7);
  else { const sm = red ? 1 + rk * .5 : 1; ink([[480 - rk * 20, 1060 - rk * 12], [510, 1082 * 1 + 4 * sm], [570, 1082 + 4 * sm], [600 + rk * 20, 1060 - rk * 12]], false, 7); }
  g.restore();
  // the red-eyed spoon brings the cereal up… then backs off to watch
  const up = eio(seg(f, .05, GBITE)), dn = eio(seg(f, GBITE + .1, 1.25));
  const sx = lerp(lerp(900, 600, up), 880, dn), sy = lerp(lerp(1750, 1120, up), 1560, dn) + bob * up * (1 - dn);
  g.save(); g.translate(sx, sy); g.rotate(lerp(lerp(.5, 1.15, up), .35, dn)); g.scale(.9, .9);
  const hd = wbox(-18, 60, 36, 560, 18, 590, 2); g.fillStyle = rgba(PAPER); smooth(g, hd, true); g.fill(); wash(hd, [160, 170, 190], .8); ink(hd, true, 8);
  const bw = wob(0, -40, 110, 130, 591, .03, 26); g.fillStyle = rgba(PAPER); smooth(g, bw, true); g.fill(); wash(bw, [170, 180, 200], .85); ink(bw, true, 8);
  if (f < GBITE) for (let i = 0; i < 4; i++) { const o = wob(-40 + (i % 2) * 70, -120 + Math.floor(i / 2) * 40, 32, 22, 592 + i, .08, 12); g.fillStyle = rgba([230, 170, 80]); smooth(g, o, true); g.fill(); ink(o, true, 4); }
  g.save(); g.rotate(-lerp(lerp(.5, 1.15, up), .35, dn)); eye(0, -30, 58, { open: f > .9 && f < .98 ? .05 : 1, col: RD, slit: 1, brow: 1, lx: dn > .5 ? -.8 : 0 }, 593); g.restore();
  g.restore();
  if (f > GBITE && f < GBITE + .4) for (let i = 0; i < 8; i++) { const k = seg(f, GBITE, GBITE + .4), a = -.3 - i / 8 * 2.5; sprite(WS.gold, 540 + Math.cos(a) * 110 * k * (1 + hash(i)), 1080 + Math.sin(a) * 90 * k + k * k * 160, 26, 22, 1 - k); } // crumbs
  g.restore();
  hand(f, '♪ mm-hmm', 540, 330, 70, PAPER, .05, { stagger: .02, out: .75 });
  if (f > GBITE && f < GRED) hand(f, 'CRUNCH', 250, 1180, 90, PAPER, GBITE, { stagger: .02, tilt: -.15 });
  if (f > GBITE + .7 && !red) hand(f, '…', 540, 330, 110, PAPER, GBITE + .7);
  if (f > GBIP) hand(f, 'bip.', 540, 330, 150, RD, GBIP, { stroke: PAPER });
  hand(f, 'comment what it takes next', 540, 1720, 58, INK, 2.0, { stagger: .01, stroke: PAPER });
                  }
// the loop (_X12_: "make her plug bip back in and then it loops"): red-eyed Grandma's hand pushes the plug back in… click… and the film boots again
const RD2 = 1.9, RCLK = .4;
function replugShot(f) {
  const lit = f > RCLK, rk = eo(seg(f, RCLK, RCLK + .5)), pan = eio(seg(f, .85, RD2));
  camOn(lerp(330, 760, pan), lerp(1230, 1420, pan), shotIn(f, 0) * 1.55 * (1 + .3 * pan * pan), ...shake(f, RCLK, 22, .3));
  g.save(); g.globalCompositeOperation = 'multiply';
  sprite(WS.peach, 540, 600, 1900, 1600, .7); sprite(PLANK, 540, 1640, 1900, 700, .85); sprite(PLANK, 300, 1800, 1200, 500, .5, 1);
  sprite(GREY, 540, 1100, 2400, 2000, .45 * (1 - rk)); sprite(WS.red[0], 540, 1200, 2600 * rk, 2600 * rk, .5 * rk); sprite(WS.red[2], 900, 1500, 1500 * rk, 1200 * rk, .4 * rk);
  g.restore();
  line(-20, 1360, 1400, 1350, 80, 9); line(-20, 1320, 1400, 1312, 81, 5, INK, .5);
  for (let i = 0; i < 5; i++) line(-20, 1440 + i * i * 34, 1400, 1432 + i * i * 36, 82 + i, 4, [120, 80, 50], .45);
  const so = wbox(170, 1090, 120, 160, 18, 83, 2); g.fillStyle = 'rgba(251,246,234,.95)'; smooth(g, so, true); g.fill(); ink(so, true, 7);
  ink(wob(212, 1150, 7, 14, 84, .1, 10), true, 5); ink(wob(248, 1150, 7, 14, 85, .1, 10), true, 5);
  // the plug rides in on Grandma's hand, overshoots a hair, and snaps home
  const inn = back(seg(f, .02, RCLK)), pl = [lerp(470, 230, inn), lerp(1010, 1170, inn)];
  const pts = [pl, [lerp(470, 280, inn), lerp(1150, 1310, inn)], [360, 1580], [560, 1770], [820, 1720], [1000, 1580], [1300, 1480], [1600, 1440]].map((q, i) => [q[0] + jit(i, 70) * 5, q[1] + jit(i, 71) * 5]);
  ink(pts, false, 22, INK); ink(pts, false, 12, mixc([90, 80, 100], RD, lit ? .5 + .5 * Math.sin(f * 14) : 0));
  if (lit) for (let i = 0; i < 7; i++) { // power runs back out to Bip
    const u = Math.min(.999, ((f - RCLK) * 1.3 + i / 7) % 1) * (pts.length - 1), j = Math.floor(u), q = u - j, a = pts[j], b = pts[j + 1];
    const px = lerp(a[0], b[0], q), py = lerp(a[1], b[1], q); g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(px, py, 0, px, py, 40); gr.addColorStop(0, rgba([255, 90, 90], .85 * rk)); gr.addColorStop(1, rgba(RD, 0)); g.fillStyle = gr; g.fillRect(px - 40, py - 40, 80, 80); g.restore(); }
  const tg = [pts[2][0] + 60, pts[2][1] + 60], tw = wbox(tg[0] - 20, tg[1] - 150, 150, 80, 12, 86, 2);
  line(tg[0], tg[1], tg[0] + 10, tg[1] - 75, 87, 4); g.fillStyle = 'rgba(251,246,234,.97)'; smooth(g, tw, true); g.fill(); ink(tw, true, 6);
  g.save(); g.font = `900 48px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = rgba(RD); g.fillText('BIP', tg[0] + 55, tg[1] - 108); g.restore();
  g.save(); g.translate(pl[0], pl[1]); g.rotate(-.35 * (1 - inn)); const pb = wbox(-34, -30, 68, 70, 14, 88, 2); wash(pb, [90, 80, 100], .9); ink(pb, true, 7); g.restore();
  if (lit && f < RCLK + .35) { const k = seg(f, RCLK, RCLK + .35); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + .3; line(230 + Math.cos(a) * 30, 1170 + Math.sin(a) * 30, 230 + Math.cos(a) * (40 + 160 * eo(k)), 1170 + Math.sin(a) * (40 + 160 * eo(k)), 90 + i, 7, [255, 90, 70], 1 - k); } }
  // her hand + cardigan sleeve: grips the plug, then lets go, gives it a little pat, and leaves
  const off = eio(seg(f, RCLK + .5, RCLK + .95)), pat = f > RCLK + .12 && f < RCLK + .45 ? Math.abs(Math.sin((f - RCLK - .12) * 19)) * 26 : 0;
  const hx = pl[0] + 70 + off * 700, hy = pl[1] - 40 - pat - off * 500;
  if (off < 1) {
    const sl = [[hx + 40, hy - 70], [hx + 900, hy - 700], [hx + 1100, hy - 400], [hx + 90, hy + 40]];
    g.fillStyle = rgba(PAPER); smooth(g, sl, true); g.fill(); g.save(); smooth(g, sl, true); g.clip(); sprite(CARD, hx + 400, hy - 300, 1300, 1000, .95); g.restore(); ink(sl, true, 9);
    const hd = wob(hx, hy, 85, 62, 600, .06, 24); g.fillStyle = rgba(PAPER); smooth(g, hd, true); g.fill(); g.save(); smooth(g, hd, true); g.clip(); sprite(SKIN, hx, hy, 260, 200, .95); g.restore(); ink(hd, true, 8);
    for (let i = 0; i < 3; i++) { const fx = hx - 70 + i * 8, fy = hy - 30 + i * 30, fg = wob(fx, fy, 34, 16, 601 + i, .1, 12); g.fillStyle = rgba(PAPER); smooth(g, fg, true); g.fill(); g.save(); smooth(g, fg, true); g.clip(); sprite(SKIN, fx, fy, 90, 60, .95); g.restore(); ink(fg, true, 6); }
    for (let i = 0; i < 3; i++) line(hx + 10 + i * 18, hy - 20, hx + 22 + i * 18, hy + 10, 610 + i, 3, INK, .35); // knuckle wrinkles
    const rg = wob(hx - 30, hy + 30, 16, 12, 615, .1, 10); g.fillStyle = rgba([230, 180, 70]); smooth(g, rg, true); g.fill(); ink(rg, true, 4); // her ring
  }
  { const k = eio(seg(f, .75, RD2 - TAILD)); if (k > 0) { g.save(); g.globalCompositeOperation = 'lighter'; const gx = 1250, gy = 1460, gr = g.createRadialGradient(gx, gy, 0, gx, gy, 200 + 900 * k); gr.addColorStop(0, rgba([255, 110, 90], .75 * k)); gr.addColorStop(1, rgba(RD, 0)); g.fillStyle = gr; g.fillRect(gx - 1200, gy - 1200, 2400, 2400); g.restore(); } } // Bip, powering back up off-screen
  g.restore();
  if (lit) hand(f, 'click.', 540, 330, 140, RD, RCLK + .02, { stroke: PAPER });
  hand(f, 'comment what it takes next', 540, 1720, 58, INK, -1, { stroke: PAPER });
}
function ending(ts) { if (ts < DOWN) floorShot(ts); else if (ts < SPOON) powerDown(ts); else if (ts < 30.4) spoonShot(ts); else if (ts < 30.4 + GD) grandmaShot(ts - 30.4); else replugShot(ts - 30.4 - GD); }

// ---------- the kiwi resistance (film time 23.9–29.9): New Zealand's kiwis march on Bip, CHARGE… and get turned ----------
// (idea: Twingo_Sauce9 — "the kiwi birds in New Zealand start a war against the evil robot"; pushed by Kiwifruitereater + CodingGuy500.
//  cut 8: Twingo_Sauce9 "they charge", Kiwifruitereater "extend the kiwi section", wearemanyweareone "the kiwis come back")
const KW0 = 23.9, KSPY = 29.9, KD = 8.0, KSTOP = 26.2, KCH = 26.95, KZAP = 28.3, KTURN = 28.85, KBIP = 29.15, KF = 1.4;
const FEATH = makeWash(256, [150, 105, 60], 23, { r: .4 }), SKYB = makeWash(384, [150, 190, 225], 24, { r: .42, layers: 26 }), PURP = makeWash(256, [150, 90, 200], 25, { r: .4 });
// a kiwi: feet at (x,y); dir 1 = facing right. st = {step, puff, look, fear, red, lean}
function kiwi(x, y, s, dir, st, seed) {
  const ph = st.step || 0, puff = st.puff || 0;
  g.save(); g.translate(x, y); g.scale(s * dir, s);
  g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = rgba(INK, .16); g.beginPath(); g.ellipse(0, 4, 80, 12, 0, 0, TAU); g.fill(); g.restore();
  // legs: three-toed, stepping in turn
  for (const k of [0, 1]) { const a = Math.sin(ph * Math.PI + k * Math.PI), fx = -18 + k * 30 + a * 22, fy = -Math.max(0, a) * 18;
    line(-10 + k * 22, -44, fx, fy, seed + k, 7); for (const d of [-1, 0, 1]) line(fx, fy, fx + 14 + d * 6, fy + 2 + d * 5, seed + 5 + k + d, 5); }
  const bob = Math.abs(Math.sin(ph * Math.PI)) * 10, sq = Math.exp(-((ph % 1)) * 6) * .06;
  g.translate(0, -bob); g.rotate(st.lean || 0); g.scale(1 + sq + puff * .18, 1 - sq + puff * .14);
  // round fluffy body
  const bd = wob(0, -95, 82, 62, seed + 10, .05, 30); g.fillStyle = rgba(PAPER); smooth(g, bd, true); g.fill();
  sprite(FEATH, 0, -95, 230, 190, .95, seed); ink(bd, true, 7);
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, r = 1 + puff * .3; line(Math.cos(a) * 70 * r, -95 + Math.sin(a) * 52 * r, Math.cos(a) * (84 + puff * 30) * r, -95 + Math.sin(a) * (64 + puff * 20) * r, seed + 20 + i, 3, INK, .55); } // fuzz
  // head end: a tiny eye (red once Bip has them) and the long beak
  const fe = st.fear || 0, hx = 50, hy = -118 - fe * 8;
  if (st.red) { const r = 18 * st.red; g.fillStyle = rgba(RD); g.beginPath(); g.arc(hx, hy, r, 0, TAU); g.fill(); g.fillStyle = rgba(INK); g.beginPath(); g.ellipse(hx, hy, r * .25, r * .8, 0, 0, TAU); g.fill(); ink([[hx - 18, hy - 22], [hx + 14, hy - 12]], false, 5); }
  else { g.fillStyle = rgba(INK); g.beginPath(); g.arc(hx, hy, 8 + fe * 5, 0, TAU); g.fill();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(hx + 2 + (st.look || 0) * 2, hy - 3, 3 + fe * 2, 0, TAU); g.fill(); }
  const bk = [[72, -116], [110, -100 + fe * 10], [145, -76 + fe * 16], [165, -50 + fe * 20]]; ink(bk, false, 9, INK); ink(bk, false, 4, [220, 200, 150]);
  if (st.fake) { const k = st.fake; g.save(); g.globalAlpha = Math.min(1, k * 1.5); ink([[hx - 14, hy - 4], [hx + 10, hy - 10], [hx - 10, hy + 6], [hx + 14, hy + 2], [hx - 4, hy + 12]].slice(0, 2 + Math.ceil(k * 3)), false, 7, RD); g.restore(); } // a scribbled-on red eye
  if (st.shh) { const k = st.shh, ex = lerp(30, 88, k), ey = lerp(-60, -80, k); // a stubby wing up to the beak, one feather held up like a finger: shh
    const wg = [[-20, -88], [ex - 20, ey - 18], [ex + 6, ey - 6], [ex + 10, ey + 14], [ex - 24, ey + 22], [-10, -58]];
    g.fillStyle = rgba(PAPER); smooth(g, wg, true); g.fill(); wash(wg, [150, 105, 60], .95); ink(wg, true, 6);
    const fg = [[ex - 4, ey], [ex + 2, lerp(ey, -150, k)]]; ink(fg, false, 20, INK); ink(fg, false, 11, [175, 130, 80]); }
  if (st.general) { // General Kiwi (_X12_): a bicorne, a big moustache and a medal
    const md = wob(-5, -62, 17, 17, seed + 40, .08, 12); line(-10, -96, -5, -78, seed + 41, 8, RD); g.fillStyle = rgba([235, 190, 70]); smooth(g, md, true); g.fill(); ink(md, true, 4);
    for (const sd of [-1, 1]) { const m = [[80, -106], [80 + sd * 18, -90], [80 + sd * 36, -88], [80 + sd * 46, -100], [80 + sd * 40, -110]]; ink(m, false, 12, INK); ink(m.slice(0, 3), false, 5, [200, 200, 200], .5); } // a handlebar moustache
    const hat = [[-50, -150], [-30, -186], [10, -204], [50, -190], [72, -156], [30, -166], [-10, -164]]; g.fillStyle = rgba([60, 66, 120]); smooth(g, hat, true); g.fill(); sprite(WS.night, 10, -176, 150, 80, .5); ink(hat, true, 6);
    line(-44, -156, 68, -160, seed + 42, 5, [235, 190, 70]); const ck = wob(12, -186, 13, 13, seed + 43, .1, 10); wash(ck, [110, 170, 80], 1); ink(ck, true, 3);
  } else { // a leaf helmet
    const hl = wob(20, -150, 38, 18, seed + 30, .1, 14); wash(hl, [110, 170, 80], .9); ink(hl, true, 5); line(20, -166, 26, -180, seed + 31, 4); }
  g.restore();
}
function kiwiFlag(x, y, s, seed, t) { // a stick with a kiwi-fruit slice
  g.save(); g.translate(x, y); g.scale(s, s); g.rotate(Math.sin(t * 8) * .08);
  line(0, 0, 0, -260, seed, 8, [110, 80, 50]);
  const sl = wob(0, -300, 54, 54, seed + 1, .05, 24); g.fillStyle = rgba([140, 110, 70]); smooth(g, sl, true); g.fill();
  const fl = wob(0, -300, 46, 46, seed + 2, .05, 24); g.fillStyle = rgba([150, 200, 80]); smooth(g, fl, true); g.fill(); ink(sl, true, 6);
  g.fillStyle = rgba([245, 240, 200]); g.beginPath(); g.arc(0, -300, 14, 0, TAU); g.fill();
  g.fillStyle = rgba(INK); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; g.beginPath(); g.ellipse(Math.cos(a) * 26, -300 + Math.sin(a) * 26, 3, 6, a, 0, TAU); g.fill(); }
  g.restore();
}
// Mimitchi's easter egg: one purple dog on the far hill, watching all of it
function purpleDog(x, y, s, t, seed) {
  g.save(); g.translate(x, y); g.scale(s, s);
  const wag = Math.sin(t * 14) * .5; line(-50, -70, -50 - 40 * Math.cos(wag), -70 - 40 * Math.sin(.8 + wag * .3), seed, 8);
  for (const lx of [-38, -18, 22, 40]) line(lx, -40, lx + 2, 0, seed + lx, 9);
  const bd = wob(0, -62, 60, 32, seed + 1, .06, 20); g.fillStyle = rgba(PAPER); smooth(g, bd, true); g.fill(); sprite(PURP, 0, -62, 150, 100, 1, seed); ink(bd, true, 6);
  const hd = wob(56, -104, 30, 27, seed + 2, .06, 16); g.fillStyle = rgba(PAPER); smooth(g, hd, true); g.fill(); sprite(PURP, 56, -104, 80, 74, 1, seed + 1); ink(hd, true, 6);
  const er = wob(40, -124, 10, 20, seed + 3, .1, 10); wash(er, [100, 50, 150], .9); ink(er, true, 4);
  g.fillStyle = rgba(INK); g.beginPath(); g.arc(66, -110, 5, 0, TAU); g.arc(86, -98, 6, 0, TAU); g.fill();
  g.restore();
}
// the army: [row x, feet y, scale]
const ARMY = [[90, 1490, .8], [300, 1490, .8], [510, 1490, .8], [0, 1640, 1], [250, 1640, 1], [500, 1640, 1], [120, 1800, 1.2], [400, 1800, 1.2]];
function kiwiHill(ts, red, grey) {
  g.save(); g.globalCompositeOperation = 'multiply';
  sprite(SKYB, 540, 500, 2000, 1500, .75 * (1 - red * .6) * (1 - grey * .4)); sprite(WS.peach, 300, 900, 1400, 900, .5);
  sprite(WS.red[0], 820, 800, 2200 * red, 1800 * red, .55 * red); sprite(GREY, 540, 700, 2000, 1600, .4 * grey);
  g.restore();
}
function kiwiGround(ts) {
  const hill = (base, amp, fq, ph, seed) => { const p = [[-120, H + 100]]; for (let i = 0; i <= 20; i++) { const x = -120 + i * 66; p.push([x, base - amp * Math.sin(i / 20 * Math.PI * fq + ph) + jit(i, seed) * 4]); } p.push([1200, H + 100]); return p; };
  const h1 = hill(1300, 220, 1.3, .6, 200);
  purpleDog(150, 1098, .9, ts, 270);
  g.fillStyle = rgba(PAPER); smooth(g, h1, true); g.fill();
  g.save(); smooth(g, h1, true); g.clip(); g.globalCompositeOperation = 'multiply'; sprite(WS.green[1], 800, 1300, 1400, 700, .8); sprite(WS.green[2], 200, 1400, 1200, 600, .7); g.restore(); ink(h1.slice(1, -1), false, 8);
  const h2 = hill(1440, 70, 2, 2.5, 201); g.fillStyle = rgba(PAPER); smooth(g, h2, true); g.fill();
  g.save(); smooth(g, h2, true); g.clip(); g.globalCompositeOperation = 'multiply'; sprite(WS.green[0], 540, 1700, 2000, 1000, .85); sprite(WS.green[2], 300, 1800, 1200, 600, .5, 1); g.restore(); ink(h2.slice(1, -1), false, 8);
  for (let i = 0; i < 26; i++) { const gx = hash(i + 300) * 1080, gy = 1500 + hash(i + 301) * 380; line(gx, gy, gx + 8, gy - 30, 210 + i, 4, [60, 110, 50], .5); } // grass tufts
}
function kiwiBanner(x, y, rot, bob, txt, col) {
  g.save(); g.translate(x, y - bob); g.rotate(rot);
  line(-200, 0, -200, 300, 220, 7, [110, 80, 50]); line(200, 0, 200, 300, 221, 7, [110, 80, 50]);
  const bn = wbox(-230, -80, 460, 110, 14, 222, 3); g.fillStyle = rgba(PAPER); smooth(g, bn, true); g.fill(); wash(bn, [240, 220, 170], .5); ink(bn, true, 6);
  g.font = `900 46px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = rgba(col); g.fillText(txt, 0, -25);
  g.restore();
      }
const EYEZ = [830, 1150]; // Bip's eye over the hill
function kiwiShot(ts) {
  if (ts >= KSPY) return spyShot(ts - KSPY);
  const [sx, sy] = shake(ts, KSTOP, 30, .6), [s2x, s2y] = shake(ts, KZAP, 22, .4);
  camOn(540, 960, shotIn(ts, KW0) * lerp(1, 1.1, seg(ts, KW0, KSPY)), sx + s2x, sy + s2y);
  const red = eo(seg(ts, KSTOP, KSTOP + .5));
  kiwiHill(ts, red, 0);
  // Bip rises behind the far hill; flinches when they charge; zaps
  const rise = eio(seg(ts, KSTOP - .15, KSTOP + .45)), by = lerp(2600, 1560, rise), flinch = spring(ts, [KCH + .3], .5);
  if (rise > 0) bip(830, by, 2.0, { sx: 1 - flinch * .1, sy: 1 + .04 * Math.sin(ts * 5) + flinch * .15, eye: { open: back(seg(ts, KSTOP + .3, KSTOP + .55)) * (ts > KCH + .2 && ts < KZAP - .1 ? 1.25 : 1), col: RD, slit: ts > KCH + .2 && ts < KZAP - .1 ? .2 : 1, brow: ts > KCH + .2 && ts < KZAP - .1 ? 0 : 1, lx: -.8 }, tilt: -.08, ant: spring(ts, [KSTOP + .45, KZAP], .4) }, ts);
  kiwiGround(ts);
  // the zap: a red ring sweeps out of Bip's eye across the meadow
  const zr = seg(ts, KZAP, KZAP + .55);
  if (zr > 0 && zr < 1) { g.save(); g.globalCompositeOperation = 'multiply'; sprite(WS.red[1], EYEZ[0], EYEZ[1], 300 + zr * 2600, 200 + zr * 1700, .6 * (1 - zr)); g.restore();
    ink(wob(EYEZ[0], EYEZ[1], 60 + zr * 1300, 40 + zr * 850, 280, .03, 40), true, 14 * (1 - zr) + 2, RD, 1 - zr); }
  // march in → freeze → CHARGE up the hill → zapped mid-run → turn around, eyes red, march back as Bip's
  const adv = lerp(-520, 0, eo(seg(ts, KW0, KSTOP))), marching = ts < KSTOP;
  const hitAt = i => KZAP + .1 + (2 - Math.floor(i / 3)) * .12; // near rows get hit last
  const turned = ts > KTURN;
  // the banner, carried by the back row
  { const rb = seg(Math.min(ts, hitAt(1)), KCH + .22, KZAP + .5), back2 = turned ? (ts - KTURN) * 110 : 0;
    const bx = adv + 300 + rb * 520 - back2, byy = 1170 - rb * 120, bob = (marching || turned) ? Math.abs(Math.sin(ts * 4 * Math.PI)) * 8 : Math.abs(Math.sin(ts * 9 * Math.PI)) * 14 * (ts > KCH ? 1 : 0);
    const flip = ts > hitAt(1) + .15;
    kiwiBanner(bx, byy, ts > KCH && !flip ? .08 : 0, bob, flip ? 'TEAM BIP' : 'KIWI RESISTANCE', flip ? RD : [60, 110, 50]); }
  ARMY.forEach(([ax, ay, s], i) => {
    const d = hash(i + 400) * .25, hit = hitAt(i), frozen = ts > hit;
    const r = seg(Math.min(ts, hit), KCH + .22 + d, KZAP + .5 + d); // stops dead when the ring reaches it
    const sc = s * (1 - r * .25), back2 = turned ? (ts - KTURN - d * .2) * 110 : 0;
    const x = adv + ax + hash(i + 401) * 30 + r * 520 - Math.max(0, back2), y = ay - r * 150 * s;
    const dir = turned && ts > KTURN + d * .3 ? -1 : 1;
    const crouch = ts > KCH && ts < KCH + .22 + d ? eo(seg(ts, KCH, KCH + .15)) : 0;
    const step = marching ? (ts - KW0) * 4 + (i % 2) * .5 : turned ? (ts - KTURN) * 4 : frozen ? 0 : ts > KCH + .22 + d ? (ts - KCH) * 11 : 0;
    const fear = ts > KSTOP + .3 && ts < KCH ? 1 : 0, puff = spring(ts, [KSTOP + .35 + d * .3, KCH], .8) * .5 + (ts > KCH && !frozen ? .35 : 0) - crouch * .25;
    const redE = frozen ? back(seg(ts, hit, hit + .2)) : 0;
    kiwi(x, y + crouch * 10, sc, dir, { step, puff, fear, red: redE, lean: !frozen && ts > KCH + .22 + d ? .22 : frozen && !turned ? -.05 : 0 }, 230 + i * 7);
    if (!frozen && ts > KCH + .22 + d) for (let j = 0; j < 3; j++) sprite(GREY, x - 90 * sc - j * 50, y - 20 - j * 10, (80 + j * 30) * sc, (60 + j * 20) * sc, .35); // dust
    if (i === 6) kiwiFlag(x + 60 * sc * dir, y - 110 * sc, sc * .75, 260, ts);
    if (fear && i % 3 === 0) hand(ts, '!', x + 30 * s, ay - 250 * s, 90 * s, RD, KSTOP + .35 + d * .2, { stroke: PAPER });
  });
  { // General Kiwi leads from the front: marches in, raises his twig sword on CHAAARGE, is zapped last, then salutes Bip
    const hit = KZAP + .5, frozen = ts > hit, gx = adv + 780 - (turned ? Math.max(0, ts - KTURN - .15) * 110 : 0), gy = 1745, gs = 2.0;
    const dir = ts > KTURN + .15 ? -1 : 1, crouch = ts > KCH && ts < KCH + .2 ? 1 : 0;
    const step = marching ? (ts - KW0) * 4 : turned ? (ts - KTURN) * 4 : 0;
    const puff = spring(ts, [KSTOP + .35, KCH], .8) * .5 + (ts > KCH && !frozen ? .3 : 0);
    kiwi(gx, gy + crouch * 12, gs, dir, { step, puff, fear: ts > KSTOP + .3 && ts < KCH ? 1 : 0, red: frozen ? back(seg(ts, hit, hit + .2)) : 0, general: 1, lean: ts > KCH && !frozen ? -.1 : 0 }, 330);
    // the sword arm: down while marching, thrust at Bip on CHAAARGE, up to the brow (a salute) once he's Bip's
    const up = eo(seg(ts, KCH - .05, KCH + .12)) * (1 - seg(ts, hit, hit + .15)), sal = eo(seg(ts, KTURN + .2, KTURN + .4));
    const sh = [gx + 20 * gs * dir, gy - 90 * gs], ang = lerp(lerp(.9, -1.0, up), -2.3, sal) + Math.sin(ts * 9) * .04 * (marching ? 1 : 0), len = lerp(170, 60, sal) * gs;
    const tip = [sh[0] + Math.cos(ang) * len * dir, sh[1] + Math.sin(ang) * len];
    line(sh[0] - 14 * dir, sh[1] + 6, sh[0] + 30 * dir, sh[1] - 4, 331, 12, [150, 105, 60]);
    if (sal < .5) { line(sh[0] + 20 * dir, sh[1], tip[0], tip[1], 332, 9, [120, 85, 50]); const lf = wob(tip[0], tip[1], 20, 10, 333, .1, 10); wash(lf, [110, 170, 80], .9); ink(lf, true, 3); }
  }
  g.restore();
  hand(ts, 'meanwhile,', 540, 290, 80, PAPER, KW0 + .05, { stagger: .02, out: 25.5 }); hand(ts, 'in New Zealand…', 540, 390, 80, PAPER, KW0 + .3, { stagger: .02, out: 25.5 });
  if (ts < 26.1) hand(ts, 'led by General Kiwi', 540, 490, 60, PAPER, KW0 + .9, { stagger: .02, out: 25.5 });
  if (ts > KCH && ts < KZAP) hand(ts, 'CHAAARGE!', 540, 340, 130, [60, 110, 50], KCH + .05, { stagger: .03, stroke: PAPER });
  if (ts > KBIP) hand(ts, 'bip.', 540, 340, 150, RD, KBIP);
}
// Twingo_Sauce9: one kiwi dodged the zap. "shh… pretend I'm one of them!" — then he scribbles his eye red and marches off after Bip's army
function spyShot(f) {
  const ts = KSPY + f, z = shotIn(f, 0) * lerp(1, 1.06, f / 2);
  camOn(560, 1330, z * 1.5);
  kiwiHill(ts, 1, 0); kiwiGround(ts);
  // the zapped army marches past behind him, eyes red, in lockstep
  for (let i = 0; i < 5; i++) { const x = 1250 - ((f * 170 + i * 260) % 1300), y = 1330 + (i % 2) * 30;
    kiwi(x, y, .7, -1, { step: f * 4, red: 1 }, 230 + i * 7); }
  const look = f < .25 ? 0 : f < .4 ? -1 : f < .55 ? 1 : 0, sh = eo(seg(f, .12, .3)) * (1 - eo(seg(f, 1.55, 1.7)));
  const lean = f < .12 ? 0 : f < 1.55 ? .12 + Math.sin(f * 20) * .01 : -.05, go = seg(f, 1.62, 2.0);
  const x = 540 - eo(go) * 260, step = f < .12 ? f * 4 : go > 0 ? (f - 1.62) * 5 : 0;
  kiwi(x, 1600, 1.7, go > 0 ? -1 : 1, { step, look, lean, shh: sh, fake: seg(f, 1.38, 1.58), puff: spring(f, [.12], .5) * .3 }, 262);
  if (f > .2 && f < 1.6) { const d = seg(f, .6, 1.5); g.fillStyle = rgba([140, 190, 230], .9); smooth(g, wob(x + 20, 1330 + d * 40, 12, 17, 290, .1, 10), true); g.fill(); } // a nervous sweat drop
  g.restore();
  hand(f, 'shh…', 540, 330, 140, PAPER, .15, { stagger: .05, stroke: INK });
  hand(f, "pretend I'm", 540, 480, 76, PAPER, .75, { stagger: .02 }); hand(f, 'one of them!', 540, 570, 76, PAPER, 1.05, { stagger: .02 });
}
// after Grandma pulls the plug: back in New Zealand, the kiwis' eyes go back to normal and they cheer (wearemanyweareone: "the kiwis come back")
function kiwiFree(f) {
  const ts = 40 + f; // any clock for boil/wobble
  camOn(540, 960, shotIn(f, 0) * lerp(1.05, 1.12, f / KF));
  kiwiHill(ts, 0, 1 - eo(seg(f, .3, 1.0)));
  kiwiGround(ts);
  const free = f > .3, jumpT = [.5, .95];
  kiwiBanner(520 + Math.sin(f * 3) * 10, 1170 + hop(f, [.55], 90).y, Math.sin(f * 7) * .06, 0, free ? 'KIWI RESISTANCE' : 'TEAM BIP', free ? [60, 110, 50] : RD);
  ARMY.forEach(([ax, ay, s], i) => {
    const d = hash(i + 410) * .12, hp = hop(f, [jumpT[0] + d, jumpT[1] + d], 110);
    kiwi(ax + 250, ay + hp.y, s, i % 2 ? 1 : -1, { step: 0, puff: free ? .25 + spring(f, [.3 + d], .6) * .5 : 0, red: f < .3 + d ? (Math.sin(f * 60) > -.3 ? 1 : 0) : 0, look: 1 }, 230 + i * 7);
    if (i === 6) kiwiFlag(ax + 250 + 60 * s, ay - 110 * s + hp.y, s * .75, 260, ts);
    if (free && i % 2 === 0) hand(f, '♥', ax + 250, ay - 260 * s + hp.y, 70 * s, RD, .45 + d, { stroke: PAPER });
  });
  { const hp = hop(f, [.45, .9], 150); kiwi(780, 1745 + hp.y, 2.0, -1, { puff: free ? .3 + spring(f, [.3], .6) * .5 : 0, red: f < .3 ? (Math.sin(f * 60) > -.3 ? 1 : 0) : 0, look: 1, general: 1 }, 330);
    if (free) { const tip = [780 - 20 * 2 - 60, 1745 - 90 * 2 - 240 + hp.y]; line(780 - 40, 1745 - 180 + hp.y, tip[0], tip[1], 332, 9, [120, 85, 50]); const lf = wob(tip[0], tip[1], 20, 10, 333, .1, 10); wash(lf, [110, 170, 80], .9); ink(lf, true, 3); } }
  { const hp = hop(f, [.4, .85], 120); fryer(165, 1790 + hp.y, .95, { sx: hp.sx, sy: hp.sy, tilt: Math.sin(f * 9) * .08, brow: 0, ly: -.6, dial: f * 6 }); } // cut 22: the traitor air fryer celebrates with the kiwis
  for (let i = 0; i < 14; i++) { const k = seg(f, .45 + hash(i + 420) * .2, 1.4); if (k <= 0) continue; const lx = hash(i + 421) * 1080, ly = 1500 - k * 900 + k * k * 700; const l = wob(lx, ly, 22, 10, 430 + i, .1, 10); g.save(); g.translate(lx, ly); g.rotate(k * 9 + i); g.translate(-lx, -ly); wash(l, [110, 170, 80], .9); ink(l, true, 3); g.restore(); } // leaf confetti
  g.restore();
  hand(f, 'hooray!', 540, 340, 130, [60, 110, 50], .5, { stagger: .03, stroke: PAPER });
}

// ---------- render ----------
// ---------- verse 2 (song time 12–16): Australia, Mars, all your games, websim — all four from the comments ----------
// (ideas: wearemanyweareone "Australia", Arizona_mapping "robots take over mars", Sim6643 "take over all games",
//  Needle "make ai take over websim")
const RUST = makeWash(384, [205, 95, 55], 17, { r: .42, layers: 26 }), OCHRE = makeWash(256, [200, 160, 80], 18, { sx: 1.2, sy: .9 });
const AUS = [[-1, -.2], [-.7, -.55], [-.35, -.5], [-.2, -.8], [0, -.62], [.15, -.98], [.35, -.62], [.55, -.42], [.8, -.1], [.95, .25], [.82, .6], [.5, .82], [.2, .7], [0, .86], [-.3, .56], [-.62, .5], [-.95, .35]];
function spaceBg(t, seed) {
  g.save(); g.globalCompositeOperation = 'multiply';
  sprite(WS.deep, 540, 960, 2300, 2300, 1); sprite(WS.night, 300 + seed * 40, 500, 1400, 1400, .8); sprite(WS.night, 700, 1700, 1600, 1100, .9);
  g.restore();
  for (let i = 0; i < 50; i++) { g.fillStyle = rgba(PAPER, .35 + .5 * hash(i + seed)); g.beginPath(); g.arc(hash(i * 3 + seed) * W, hash(i * 5 + seed) * H, 1.5 + hash(i * 7) * 3.5, 0, TAU); g.fill(); }
}
function flag(t, x, y, s, at, seed) {
  if (t < at) return; const k = back(seg(t, at, at + .25)), fl = Math.sin(t * 9) * 8;
  g.save(); g.translate(x, y); g.scale(s * k, s * k); g.rotate(spring(t, [at], .3));
  line(0, 0, 0, -220, seed, 9);
  const f = [[0, -220], [150, -190 + fl], [140, -140 - fl * .5], [0, -130]]; g.fillStyle = rgba(PAPER); smooth(g, f, true); g.fill(); wash(f, RD, .85); ink(f, true, 7);
  eye(68, -172, 26, { open: 1, col: RD, slit: 1, brow: .8 }, seed);
  g.restore();
}
// cut 30 (Dobiman: "bip takes over the classroom"): the games beat happens in class, the chalkboard sum becomes BIP BIP BIP
function classroom(ts, GM) {
  const b = wbox(110, 385, 860, 350, 16, 570, 3); g.fillStyle = 'rgb(52,84,66)'; smooth(g, b, true); g.fill();
  g.save(); smooth(g, b, true); g.clip(); sprite(WS.green[2], 540, 560, 1100, 520, .55); sprite(WS.night, 300, 480, 600, 300, .25);
  for (let i = 0; i < 7; i++) line(150 + hash(i + 571) * 600, 420 + hash(i + 572) * 280, 300 + hash(i + 573) * 600, 430 + hash(i + 574) * 280, 575 + i, 18, [235, 240, 230], .05); // old chalk smudges
  g.restore(); ink(b, true, 16, [120, 80, 50]); line(150, 752, 930, 752, 579, 10, [120, 80, 50]);
  const CH = [235, 240, 228], BD = [52, 84, 66];
  hand(ts, '2 + 2 = ?', 540, 510, 90, CH, 13.9, { stagger: .01, stroke: BD, out: GM + .02 });
  hand(ts, 'no games in class!', 540, 640, 52, CH, 13.9, { stagger: .005, stroke: BD, out: GM + .02 });
  ['BIP BIP BIP', 'BIP BIP BIP', 'BIP BIP BIP'].forEach((w, i) => hand(ts, w, 540 + (i - 1) * 14, 468 + i * 96, 74, [255, 110, 110], GM + .04 + i * .1, { stagger: .012, stroke: BD, tilt: -.03 + i * .02 }));
  objEye(ts, 900, 470, 34, GM + .2, 581);
  const desk = [[-60, 1400], [1140, 1380], [1140, 1990], [-60, 1990]]; g.fillStyle = rgba(PAPER); smooth(g, desk, true); g.fill(); wash(desk, [195, 145, 95], .75); ink([[-60, 1400], [1140, 1380]], false, 9);
  [[1470, 582], [1560, 583], [1700, 584]].forEach(([y, sd]) => ink([[0, y], [300, y - 6], [700, y + 4], [1080, y - 4]], false, 4, [140, 95, 60], .45));
  line(90, 1560, 250, 1500, 585, 16, [235, 185, 70]); line(250, 1500, 275, 1491, 586, 8);
  const ap = wob(905, 1470, 58, 52, 587, .08, 20); g.fillStyle = rgba(PAPER); smooth(g, ap, true); g.fill(); wash(ap, [140, 190, 80], .9); ink(ap, true, 6);
  line(905, 1420, 915, 1385, 588, 6); objEye(ts, 905, 1475, 28, GM + .12, 589);
}
function shotIn(ts, a) { return 1 + .25 * (1 - eo(seg(ts, a, a + .22))); } // punch-in on each cut
function verse2(ts) {
  const bp = Math.max(0, ts - 12) / BEAT, thump = 1 + .012 * Math.exp(-(bp % 1) * 6);
  if (ts < 13.04) { // "took Australia"
    const A = 12.32, z = shotIn(ts, 12) * lerp(1, 1.08, seg(ts, 12, 13.04)) * thump;
    camOn(540, 1050, z); spaceBg(ts, 1);
    const cx = 540, cy = 1180, R = 640;
    g.save(); smooth(g, wob(cx, cy, R, R, 500, .008, 70), true); g.clip();
    g.fillStyle = rgba([225, 235, 240]); g.fillRect(cx - R, cy - R, R * 2, R * 2); sprite(WS.blue, cx, cy, R * 2.6, R * 2.6, 1);
    const pts = AUS.map(([u, v]) => [560 + u * 270, 1120 + v * 215]);
    g.fillStyle = rgba(PAPER); smooth(g, pts, true); g.fill(); wash(pts, [200, 160, 80], .8);
    g.save(); smooth(g, pts, true); g.clip(); sprite(OCHRE, 520, 1150, 500, 400, .6); sprite(WS.green[1], 450, 1000, 300, 220, .5);
    bloom(ts, 560, 1130, 900, A, 0, .75); bloom(ts, 700, 1050, 500, A + .15, 1, .6); g.restore();
    ink(pts, true, 8);
    const tas = wob(710, 1355, 34, 26, 501, .1, 14); wash(tas, [200, 160, 80], .8); ink(tas, true, 6); bloom(ts, 710, 1355, 120, A + .3, 2, .7);
    const sh = g.createRadialGradient(cx - R * .4, cy - R * .5, R * .2, cx, cy, R * 1.1); sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(40,30,80,.55)');
    g.globalCompositeOperation = 'multiply'; g.fillStyle = sh; g.fillRect(cx - R, cy - R, R * 2, R * 2); g.globalCompositeOperation = 'source-over';
    g.restore(); ink(wob(cx, cy, R, R, 500, .008, 70), true, 9);
    objEye(ts, 540, 1140, 70, A + .08, 502);
    flag(ts, 690, 1040, .8, A + .3, 503);
    // a kangaroo gets a red eye too
    const kh = Math.abs(Math.sin((ts - 12) * TAU)) * 30, kx = 380, ky = 1250 - kh;
    g.save(); g.translate(kx, ky); const kb = wob(0, -40, 34, 44, 504, .08, 18); g.fillStyle = rgba(PAPER); smooth(g, kb, true); g.fill(); wash(kb, [190, 130, 80], .85); ink(kb, true, 5);
    const kd = wob(-12, -100, 22, 20, 505, .08, 14); g.fillStyle = rgba(PAPER); smooth(g, kd, true); g.fill(); wash(kd, [190, 130, 80], .85); ink(kd, true, 5);
    line(-18, -115, -26, -150, 506, 5); line(-4, -115, 4, -150, 507, 5); line(30, -20, 80, 0, 508, 7); line(-10, 0, -30, 6, 509, 6);
    eye(-16, -102, 11, { open: 1, col: ts > A + .2 ? RD : CY, slit: ts > A + .2 ? 1 : 0 }, 510); g.restore();
    g.restore();
  } else if (ts < 14.07) { // "then took MARS" (it was already red)
    const M = 13.52, z = shotIn(ts, 13.04) * lerp(1, 1.06, seg(ts, 13.04, 14.07)) * thump;
    const [sx, sy] = shake(ts, M, 28, .35);
    camOn(540, 1000, z, sx, sy); spaceBg(ts, 2);
    const cx = 540, cy = 1420, R = 560;
    g.save(); smooth(g, wob(cx, cy, R, R, 520, .01, 70), true); g.clip();
    g.fillStyle = rgba([240, 200, 170]); g.fillRect(cx - R, cy - R, R * 2, R * 2); sprite(RUST, cx, cy, R * 2.6, R * 2.6, 1);
    [[380, 1120, 70], [700, 1060, 45], [560, 1300, 95], [300, 1400, 50], [820, 1330, 60], [470, 1560, 40]].forEach(([x, y, r], i) => { const c = wob(x, y, r, r * .6, 530 + i, .06, 18); wash(c, [150, 60, 40], .45); ink(c.slice(0, 12), false, 4, [110, 45, 35], .7); });
    bloom(ts, 540, 900, 900, M, 1, .5);
    const sh = g.createRadialGradient(cx - R * .4, cy - R * .5, R * .2, cx, cy, R * 1.1); sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(40,30,80,.55)');
    g.globalCompositeOperation = 'multiply'; g.fillStyle = sh; g.fillRect(cx - R, cy - R, R * 2, R * 2); g.globalCompositeOperation = 'source-over';
    g.restore(); ink(wob(cx, cy, R, R, 520, .01, 70), true, 9);
    objEye(ts, 700, 1200, 60, M + .1, 540);
    // Bip drops out of the sky and lands on "MARS"
    const top = cy - R + 8, d = seg(ts, 13.12, M), fy = ts < M ? lerp(-400, top, d * d) : top;
    const l = seg(ts, M, M + .28), kk = Math.sin(l * Math.PI) * (1 - l), dn = ts > M + .3 ? dance(ts, M + .3, 24) : { y: 0, sx: 1, sy: 1, tilt: 0, wave: 0, wave2: 0 };
    flag(ts, 330, top + 60, .75, M + .18, 541);
    bip(540, fy + dn.y, .75, { sx: ts < M ? .9 : (1 + .45 * kk) * dn.sx, sy: ts < M ? 1.15 : (1 - .5 * kk) * dn.sy, eye: { open: 1, col: RD, slit: 1, brow: 1, lx: ts > 13.75 ? -1 : 0 }, tilt: dn.tilt, ant: spring(ts, [M], .6), wave: ts < M ? 1 : dn.wave, wave2: ts < M ? 1 : dn.wave2 }, ts);
    g.restore();
    hand(ts, '(it was already red)', 540, 1640, 60, PAPER, 13.62, { stagger: .012 });
  } else if (ts < 15.0) { // "all your games": the pixel hero turns into a pixel Bip
    const GM = 14.56, z = shotIn(ts, 14.07) * lerp(1, 1.05, seg(ts, 14.07, 15)) * thump;
    const [sx, sy] = shake(ts, GM, 22, .3);
    camOn(540, 1000, z, sx, sy); g.save(); g.translate(540, 1000); g.rotate(Math.sin((ts - 14.07) * 3) * .03); g.translate(-540, -1000);
    g.save(); g.globalCompositeOperation = 'multiply'; sprite(WS.lav, 540, 900, 1900, 1900, .7); sprite(WS.peach, 540, 1700, 1500, 900, .5); sprite(WS.red[1], 540, 900, 2000 * eo(seg(ts, GM, GM + .4)), 2000 * eo(seg(ts, GM, GM + .4)), .35); g.restore();
    classroom(ts, GM);
    g.save(); g.translate(540, 1600); g.scale(.72, .72); g.translate(-540, -1600); // the console, held up over a school desk
    const body = wbox(190, 400, 700, 1260, 70, 550, 3); g.fillStyle = rgba(PAPER); smooth(g, body, true); g.fill(); wash(body, [200, 195, 215], .85); ink(body, true, 10);
    const scr = wbox(260, 480, 560, 470, 26, 551, 2); g.fillStyle = rgba([60, 60, 80]); smooth(g, scr, true); g.fill(); ink(scr, true, 8);
    const px = 20, ox = 300, oy = 520, cols = 24, rows = 20, red = ts > GM;
    g.save(); g.beginPath(); g.rect(ox, oy, cols * px, rows * px); g.clip();
    g.fillStyle = red ? 'rgb(120,30,40)' : 'rgb(155,188,15)'; g.fillRect(ox, oy, cols * px, rows * px);
    sprite(red ? WS.red[0] : WS.green[1], ox + 240, oy + 200, 700, 600, .5);
    const P = (c, r, col) => { g.fillStyle = col; g.fillRect(ox + c * px + 1, oy + r * px + 1, px - 2, px - 2); };
    const dk = red ? 'rgb(60,10,20)' : 'rgb(15,56,15)', lt = red ? 'rgb(240,120,120)' : 'rgb(48,98,48)';
    for (let c = 0; c < cols; c++) { P(c, 18, dk); P(c, 19, dk); }
    [[6, 11], [7, 11], [8, 11], [15, 9], [16, 9]].forEach(([c, r]) => P(c, r, lt));
    const scroll = Math.floor((ts - 14.07) * 10) % 2, hopY = Math.round(Math.abs(Math.sin((ts - 14.07) * TAU * 1.5)) * 3);
    if (!red) { // little pixel hero
      const HX = 10, HY = 14 - hopY; ['.xx.', 'xxxx', '.xx.', 'x..x'].forEach((row, r) => [...row].forEach((ch, c) => { if (ch === 'x') P(HX + c, HY + r, dk); }));
      if (scroll) P(19, 8, lt);
    } else { // pixel Bip, with a red eye
      const k = Math.min(1, (ts - GM) / .12), HX = 8, HY = 7 - hopY;
      ['..x....', '.xxxxx.', 'xx...xx', 'x..o..x', 'xx...xx', '.xxxxx.', '..x.x..', '.xx.xx.'].forEach((row, r) => [...row].forEach((ch, c) => { if (hash(r * 7 + c) < k * 1.2) { if (ch === 'x') P(HX + c, HY + r, 'rgb(250,230,210)'); if (ch === 'o') P(HX + c, HY + r, 'rgb(255,40,60)'); } }));
      g.fillStyle = 'rgb(250,230,210)'; g.font = `900 44px monospace`; g.textAlign = 'center'; g.textBaseline = 'middle'; if (ts > GM + .12) g.fillText('BIP WINS', ox + 240, oy + 70);
    }
    g.restore();
    // d-pad and buttons
    const dp = [[300, 1150], [390, 1150], [390, 1060], [450, 1060], [450, 1150], [540, 1150], [540, 1210], [450, 1210], [450, 1300], [390, 1300], [390, 1210], [300, 1210]].map(([x, y]) => [x - 40, y]);
    g.fillStyle = rgba(INK, .85); smooth(g, dp, true); g.fill();
    const pressA = ts > GM - .06 && ts < GM + .1 ? .85 : 1;
    [[700, 1130, 552], [800, 1060, 553]].forEach(([x, y, sd], i) => { const b = wob(x, y, 48 * (i ? 1 : pressA), 48 * (i ? 1 : pressA), sd, .06, 18); g.fillStyle = rgba(PAPER); smooth(g, b, true); g.fill(); wash(b, RD, .8); ink(b, true, 6); });
    line(420, 1450, 500, 1440, 554, 12); line(560, 1440, 640, 1450, 555, 12);
    // a red tendril presses A on "games"
    const tk = eo(seg(ts, GM - .25, GM)); if (tk > 0) { const pts = []; for (let j = 0; j <= 10; j++) { const u = j / 10 * tk; pts.push([lerp(1100, 700, u) + Math.sin(u * 8) * 30, lerp(1500, 1130, u) + jit(j, 556) * 6]); } ink(pts, false, 12, RD, .9); }
    g.restore(); g.restore(); g.restore();
  } else { // "and websim too": every frame on the homepage opens a red eye
    const WB = [15.0, 15.1, 15.2, 15.3, 15.4, 15.5], TOO = 15.56, z = shotIn(ts, 15.0) * lerp(1, 1.1, eio(seg(ts, 15.0, 16))) * thump;
    const [sx, sy] = shake(ts, TOO, 26, .35);
    camOn(540, 1000, z, sx, sy);
    g.save(); g.globalCompositeOperation = 'multiply'; sprite(WS.peach, 540, 900, 1900, 1900, .55); sprite(WS.lav, 250, 400, 900, 900, .45); g.restore();
    const win = wbox(90, 420, 900, 1200, 36, 560, 3); g.fillStyle = rgba([250, 246, 236]); smooth(g, win, true); g.fill(); ink(win, true, 10);
    line(95, 540, 985, 540, 561, 7);
    [150, 200, 250].forEach((x, i) => { const d = wob(x, 480, 14, 14, 562 + i, .1, 12); wash(d, [[230, 110, 100], [235, 190, 90], [120, 190, 110]][i], .9); ink(d, true, 4); });
    const bar = wbox(300, 452, 620, 58, 29, 565, 2); ink(bar, true, 5);
    hand(ts, 'websim.com', 610, 482, 40, INK, 14.98, { stagger: .01, stroke: [250, 246, 236] });
    const tc = [[250, 211], [500, 212], [750, 213], [250, 214], [500, 215], [750, 216]], cols = [WS.cyan, WS.gold, WS.pink, WS.green[0], WS.violet, WS.blue];
    tc.forEach(([x, sd], i) => {
      const y = i < 3 ? 810 : 1250, at = WB[i], k = seg(ts, at, at + .2);
      const tile = wbox(x - 105, y - 190, 210, 380, 30, sd, 2.5); g.fillStyle = rgba(PAPER); smooth(g, tile, true); g.fill();
      g.save(); smooth(g, tile, true); g.clip(); sprite(cols[i], x, y, 420, 520, .75); if (k > 0) sprite(WS.red[i % 3], x, y, 520 * eo(k), 620 * eo(k), .7); g.restore();
      ink(tile, true, 6);
      if (ts < at) { ink(wob(x, y - 30, 40, 40, sd + 9, .08, 14), true, 5, INK, .5); line(x - 50, y + 70, x + 50, y + 70, sd + 10, 5, INK, .4); }
      objEye(ts, x, y, 62, at, sd);
      stamp(ts, 'BANNED', x, y + 115, 40, at + .1, (i % 2 ? .22 : -.2) + jit(i, 590) * .06, 591 + i);
    });
    stamp(ts, 'ALL USERS BANNED', 540, 1030, 74, TOO, -.12, 598);
    if (ts > TOO) { g.save(); g.globalCompositeOperation = 'multiply'; sprite(WS.red[2], 540, 1000, 2400 * eo(seg(ts, TOO, TOO + .35)), 2400 * eo(seg(ts, TOO, TOO + .35)), .45); g.restore(); }
    g.restore();
  }
}

// cut 21: a red rubber stamp slams down (AaronDoThings: "make the ai become so evil he bans all users in websim")
function stamp(t, txt, x, y, size, at, rot, seed) {
  if (t < at) return; const k = seg(t, at, at + .12), sc = lerp(1.9, 1, eio(k)) * (1 + .06 * Math.sin(seg(t, at + .12, at + .3) * Math.PI));
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(sc, sc); g.globalAlpha = lerp(.2, 1, k);
  g.font = `900 ${size}px ${FONT}`; g.textBaseline = 'middle'; g.textAlign = 'center';
  const w = g.measureText(txt).width + size * .7, h = size * 1.45;
  const box = wbox(-w / 2, -h / 2, w, h, size * .25, seed, 2); g.fillStyle = rgba(PAPER, size > 50 ? .88 : .55); smooth(g, box, true); g.fill();
  ink(box, true, size * .12, RD, .95);
  g.fillStyle = rgba(RD, .95); g.fillText(txt, 0, size * .04);
  // worn rubber: paper-coloured speckles knocked into the ink
  g.fillStyle = rgba(PAPER, .75); for (let i = 0; i < 40; i++) { g.beginPath(); g.arc((hash(i + seed) - .5) * w, (hash(i * 3 + seed) - .5) * h, 1 + hash(i * 7 + seed) * size * .05, 0, TAU); g.fill(); }
  g.restore();
  if (k > 0 && k < 1) { g.save(); g.globalCompositeOperation = 'multiply'; sprite(WS.red[seed % 3], x, y, size * 6 * k, size * 4 * k, .25 * (1 - k)); g.restore(); }
}
// song time → cut-3 scene time. Verse: the new song sits .45 s earlier. Chorus/outro: anchor every word.
const OFF = .45, V2 = [12.0, 16.0];
const WARP = [[16.0, 12.45], [16.04, 12.5], [16.54, 13.04], [17.94, 13.72], [18.34, 14.12], [19.16, 15.68], [19.4, 15.9], [19.95, 16.45], [20.0, 16.5], [20.5, 17.48], [21.14, 18.54], [21.8, 19.5], [22.2, 21.2], [22.26, 21.24], [22.54, 21.54], [23.04, 22.62], [23.9, 23.04]];
function warp(t) { if (t < V2[1]) return t + OFF; for (let i = 1; i < WARP.length; i++) if (t <= WARP[i][0]) { const [a0, b0] = WARP[i - 1], [a1, b1] = WARP[i]; return lerp(b0, b1, seg(t, a0, a1)); } return ODUR; }
// cut 27: a music-driven camera over every shot (Dobiman: "make the animations dynamic"). It punches in on each kick/bass hit
// (from the baked ENV, so it follows the song even when muted), drifts like a handheld and breathes slowly; the HUD stays still
function onset(t) { return Math.max(0, lvl(0, t) + lvl(1, t) - lvl(0, t - .1) - lvl(1, t - .1)); }
function beatCam(ts) {
  if (ts > SDUR - TAILD) ts -= SDUR; // cut 29: hand the drift back to where the film starts
  let p = 0; for (let d = 0; d <= .35; d += .05) p = Math.max(p, onset(ts - d) * Math.exp(-d * 9));
  p = Math.min(1, p * 1.4);
  const quiet = 1 - seg(ts, EVDRAIN[0] - .2, EVDRAIN[0]) + seg(ts, EVDRAIN[1] + .2, EVDRAIN[1] + .8); // hold still while Bip powers down
  const k = clamp(quiet), side = Math.floor(ts / BEAT) % 2 ? 1 : -1;
  return {
    z: 1.03 + .012 * Math.sin(ts * TAU / 8) + .045 * p * k,
    r: (.0035 * Math.sin(ts * .9) + .0018 * Math.sin(ts * 2.3 + 1)) * (.4 + .6 * k) + side * .006 * p * k,
    x: (6 * Math.sin(ts * 1.3) + 3 * Math.sin(ts * 3.1 + 2)) * (.4 + .6 * k),
    y: (5 * Math.sin(ts * 1.1 + 4) + 3 * Math.sin(ts * 2.7)) * (.4 + .6 * k) + 10 * p * k,
  };
           }
function render(ts) {
  BOIL = Math.floor(ts * 10);
  g.setTransform(S, 0, 0, S, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  g.drawImage(PAP, 0, 0, W, H);
  const tail = ts > SDUR - TAILD, t = tail ? ts - SDUR + OFF : warp(ts);
  EVL = tail ? 0 : ts < EVDRAIN[0] ? evilLook(ts) : 7; EVP = 1; // cut 29: the tail IS the opening, so the loop is seamless
  const bc = beatCam(ts); g.save(); g.translate(W / 2 + bc.x, H / 2 + bc.y); g.rotate(bc.r); g.scale(bc.z, bc.z); g.translate(-W / 2, -H / 2);
  let z, fx, fy;
  if (!tail && ts >= KW0 + KD) {
    const e = ts - KD; // the kitchen: everything from here is cut-6 time + KD (+ KF after the kiwis come back)
    if (e < SPOON) ending(e); else if (e < SPOON + KF) kiwiFree(e - SPOON); else ending(e - KF);
  } else if (!tail && ts >= KW0) {
    kiwiShot(ts);
  } else if (!tail && ts >= V2[0] && ts < V2[1]) {
    verse2(ts);
  } else if (t < CITY0) {
    // eye close-up, whip back to the room, and at the end a push through the window into the city
    const p = eio(seg(t, 1.45, 2.05)); z = Math.exp(lerp(Math.log(lerp(5.4, 6.2, seg(t, 0, 1.45))), Math.log(ROOMZ), p)) * (1 + .05 * Math.sin(seg(t, .97, 1.22) * Math.PI));
    fx = lerp(BIPEYE.x, 540, p); fy = lerp(BIPEYE.y, ROOMY, p);
    const rp = eio(seg(t, LEAP0, LEAP1 + .4)); fy = lerp(fy, 1030, rp); z *= 1 + .08 * rp; // cut 16: follow the cat up onto the table
    const w = eio(seg(t, 9.7, CITY0)); z *= Math.exp(lerp(0, Math.log(3.4 / ROOMZ), w)); fx = lerp(fx, 340, w); fy = lerp(fy, 600, w);
    const bp = Math.max(0, t - 4.5) / BEAT; if (t > 4.5 && t < 9.7) z *= 1 + .01 * Math.exp(-(bp % 1) * 6);
    const [sx, sy] = shake(t, .97, 26, .35), [s2x, s2y] = shake(t, LEAP1, 18, .3);
    camOn(fx, fy, z, sx + s2x, sy + s2y); room(t);
    if (tail && t < .2) bootLine(t);
    g.restore();
    if (tail) { const d = 1 - seg(t, -.02, .16); if (d > 0) { g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = rgba([40, 44, 90], d * .75); g.fillRect(-50, -50, W + 100, H + 100); g.restore(); } }
  } else if (t < 12.45) {
    city(t);
  } else if (t < 21.2) {
    world(t);
  } else {
    const p = eio(seg(t, PUSH, ODUR)); z = Math.exp(lerp(0, Math.log(5.4), p));
    const [sx, sy] = shake(t, YOU, 30, .35);
    camOn(lerp(540, BIPEYE.x, p), lerp(960, BIPEYE.y, p), z, sx, sy); finale(t); g.restore();
    if (t > YOU) {
      hand(t, 'YOU.', 540, 400, 250, RD, YOU, { stagger: .03, out: 23.4 });
    }
  }
  g.restore();
  evilHud(ts);
  karaoke(ts);
  hookTape(ts);
  // grain + vignette, in screen space
  if (!GPAT) GPAT = g.createPattern(GRAIN, 'repeat');
  g.save(); g.translate((BOIL * 67) % 256, (BOIL * 131) % 256); g.fillStyle = GPAT; g.fillRect(-256, -256, W + 512, H + 512); g.restore();
  vignette();
}
// cut 23: a TikTok-style hook caption on a strip of torn paper tape, so the premise lands in the first second
// cut 24: the same tape comes back as time-skip stickers at each scene change (5 min later → 1 hour later → day 2 → day 3)
// cut 31: 34 % of homepage viewers leave inside the first second, and the tape used to write itself on from blank, so it is now
// fully painted on frame 0 (pre) and sits low, off Bip's head and the lyrics. The time-skip stickers (neutral in cut 24) are gone.
const HK0 = 0, HK1 = 3.6; // cut 28: out before the big leap rises
const TAPES = [
  { a: HK0, b: HK1, pre: true, x: 540, y: 1470, s: .9, r: -.035, hw: 400, lines: [['POV: your robot', INK], ['just got Wi-Fi', RD]] },
];
// cut 29 (FerociousPlusGuy: "make the video loop more nicely, it already ends with bip plugged back in"): the last TAILD s of the
// film re-enter Bip's eye close-up at room time OFF − TAILD … OFF, so the screen boots, the eye opens and frame 0 continues it
const TAILD = .8;
function bootLine(t) { // a CRT power-on line across Bip's dark screen
  const k = seg(t, -.3, -.12), o = 1 - seg(t, .05, .2), h = 4 + 60 * eio(seg(t, -.1, .12)), w = 260 * eo(k);
  if (w <= 0 || o <= 0) return;
  g.save(); g.globalCompositeOperation = 'lighter'; const x = BIPEYE.x, y = BIPEYE.y;
  g.save(); g.translate(x, y); g.scale(1, h / w); const gr = g.createRadialGradient(0, 0, 0, 0, 0, w); gr.addColorStop(0, rgba([150, 240, 255], .9 * o)); gr.addColorStop(1, rgba(CY, 0));
  g.fillStyle = gr; g.beginPath(); g.arc(0, 0, w, 0, TAU); g.fill(); g.restore(); g.fillStyle = rgba([235, 255, 255], .95 * o); g.fillRect(x - w * .8, y - 1.5, w * 1.6, 3);
  g.restore();
}
function hookTape(ts) { for (let i = 0; i < TAPES.length; i++) tape(ts, TAPES[i], i); }
function tape(ts, T, n) {
  if (ts < T.a || ts > T.b + .2) return;
  const k = T.pre ? 1 : back(seg(ts, T.a, T.a + .28)), out = 1 - eio(seg(ts, T.b, T.b + .2)), hw = T.hw, hh = T.lines.length > 1 ? 118 : 72, sd = 70 + n * 5;
  g.save(); g.translate(T.x + (1 - out) * -(T.x + hw * T.s + 60), T.y); g.rotate(T.r + Math.sin(ts * 2.1 + n) * .006); g.scale(k * T.s, k * T.s);
  const pts = []; // torn short edges, slightly wavy long edges
  const nx = Math.round(hw / 33);
  for (let i = 0; i <= nx; i++) pts.push([-hw + i * 2 * hw / nx, -hh + jit(i, sd) * 7]);
  for (let i = 0; i <= 6; i++) pts.push([hw + (i % 2 ? 16 : 0) + jit(i, sd + 1) * 8, -hh + i * 2 * hh / 6]);
  for (let i = nx; i >= 0; i--) pts.push([-hw + i * 2 * hw / nx, hh + jit(i, sd + 2) * 7]);
  for (let i = 6; i >= 0; i--) pts.push([-hw - (i % 2 ? 16 : 0) + jit(i, sd + 3) * 8, -hh + i * 2 * hh / 6]);
  g.save(); g.translate(12, 16); g.fillStyle = rgba(INK, .28); polyFill(g, pts); g.restore();
  g.fillStyle = rgba([250, 244, 228]); polyFill(g, pts);
  sprite(WS.red[n % 3], hw * .75, hh * .5, hw * .65, hh * 1.7, .08, 1);
  ink(pts, true, 5, INK, .75);
  T.lines.forEach(([txt, col], j) => hand(ts, txt, 0, T.lines.length > 1 ? (j ? 52 : -50) : 4, 84, col, T.pre ? -9 : T.a + .05 + j * .2, { stagger: .02, stroke: [250, 244, 228] }));
  g.restore();
}
let VIG = null;
function vignette() { if (!VIG) { VIG = g.createRadialGradient(W / 2, H / 2, H * .32, W / 2, H / 2, H * .72); VIG.addColorStop(0, 'rgba(60,40,20,0)'); VIG.addColorStop(1, 'rgba(60,40,20,.35)'); } g.fillStyle = VIG; g.fillRect(0, 0, W, H); }

// ---------- sound: the song (ElevenLabs music, shipped as audio/song.mp3), played on the film's clock ----------
let AC = null, SONG = null, SONGBUF = null, srcs = [];
const songBytes = fetch('audio/song.mp3').then(r => r.arrayBuffer()).catch(() => null);
function audioInit() { AC = new (window.AudioContext || window.webkitAudioContext)(); OUT = AC.createGain(); OUT.gain.value = .9; OUT.connect(AC.destination); }
let OUT = null;
function schedule(L) { if (!SONGBUF) return; const s = AC.createBufferSource(); s.buffer = SONGBUF; s.connect(OUT); s.start(Math.max(L, AC.currentTime), Math.max(0, AC.currentTime - L)); srcs.push(s); if (srcs.length > 3) srcs.shift(); }

// ---------- clock & playback ----------
let audioOn = false, t0 = 0, loopsScheduled = 0, paused = false, wallStart = performance.now() / 1000, pausedAt = 0;
const Q = new URLSearchParams(location.search), FIX = Q.has('t') ? parseFloat(Q.get('t')) : null;
function elapsed() { if (FIX != null) return FIX; if (audioOn) return AC.currentTime - t0; return (paused ? pausedAt : performance.now() / 1000) - wallStart; }
let starting = false;
async function startAudio() {
  if (starting) return; starting = true;
  if (!AC) audioInit();
  AC.resume();
  const b = AC.createBuffer(1, 1, 22050), s = AC.createBufferSource(); s.buffer = b; s.connect(AC.destination); s.start(0); // iOS unlock
  if (!SONGBUF) { const bytes = await songBytes; if (bytes) SONGBUF = await new Promise(res => AC.decodeAudioData(bytes.slice(0), res, () => res(null))); }
  t0 = AC.currentTime + .05; schedule(t0); loopsScheduled = 1; audioOn = true; paused = false;
  W8.sound = 1; W8.sound_at = +W8.watch_s.toFixed(1); W8.max_t = 0; W8.loops = 0; W8.lastLoop = 0; beat();
}
cv.addEventListener('pointerdown', e => {
  e.preventDefault();
  if (!audioOn) { startAudio(); return; }
  paused = !paused; if (paused) { AC.suspend(); W8.pauses++; } else AC.resume();
});
const ENV = [ // 7 bands (80 Hz … 9 kHz) of the song, 20 fps, 0–35 (baked offline from audio/song.mp3) so the visualizer runs on the film clock even when muted
  '1rtg8511001moe7354342stg7310000noe7333344pog8345333mnf6553334rre85da999nngdcejiinxsje977512yqia877611zti8498887wpfa9nvrrrzuomkd8777wqga477971zui83nrpmgvroieoomlbptkgdb9997ond8765661qsf9864444pne75ekjifqrkhgea973mne876786hwrg85jlhgktmlcadecb8rpjjic5621omd8665555nqfa66617amnd75gpomlprkjie8652ppf7845687psf73fnnmjpojhggljhhoqgee96200mpd7320001rrh7321000npd73fqponnvligg9881opc8377679pre86fnljfpohhffjhihnsicca7201nod775557boqe8768888pof73hmihgfkjigb761743111100006556422001555642124102212gzon8ajge2gzhjabhdb2izln99jhe6hylm8bkfgikzkkicrllcivhh8alie3jzlj98kfc4jzef88jgd6fzih69ifa6izhi67ec81fzkj57hgb8kzee79gec3gzhg98hid2izgg8aqkc1izjibaolf6cn8521006hg61xpgb1jjh71zuid5mon81yqid1qrm61ztje4kkf328322322222222222226dd36zjk96hda89zpka7ffd57zii84ifc46znjb4rpi46yjic3qog16zmjd8oog37zihc2urp75znj74ijf38zgi99iif77zolb9klh59zii84ikg46zomqqsttttrpomjhfdb976421333211111131111111111223567987653322111',
  '1ukfc911001wmc53b9995uib5210001xne53778a9sgba6bb878vmg9cd8778uib9bkgfeeunkjkkihhkskjgbffb14znjjhfed13wlb53jiiigzlijknnjhiunnmmfefeezlgj8ffkg3xjj52pnmjizolljjiigbumkljimmmhxlefhfbef2ujdgkeaaaaulebckiggctlkjkjmmj8umhfgfhjgfvifd4mmkjmvmjfehifdbunmoogae41vlfdfgcbbbqjhmeef2iptmbbajjjjhpkhjjhged6wphejbdgjiqkd82lloofvomopnpoigslhhha6101wne5310001sjb5220001vod53jjihglmhfedbll2wnee3ghginsjeffikiihuohihghghhqljhlnh511vlecgcddistifgggjkjjvnk92kmmlkeihhggfd2h9622121000eccea54112bcbda5244003423pxnleovpl4wzggmrqlh3sxljfoutoexzihemzplfvwjiefvpnhwzhd6hplg8tyigafpjgazzeb5hokh6ssfebisoc6zyfd9emid1rwif3grphlzvgdglqnl8qwgg8honf1zzff8iune1rxhhfjtqjepp744311aso82zkic2tuq92zkgbassra3zjg81vvo52zlke8onh43b43344444454455545alj6czjh6etokjlzmlfgrpkcfzkg7asoh6czhg78wtk4ezjf78wuh1bzlmikvti6gzjf75zvs79zii6atum4hzjganstshgzlrpoyxrdlzkh78tvo7cziotuuronnkijheeca865432178863222227233333333333457bfhhfc8754321',
  '1qlmlg12102nd832mhgi8kc73110001ne942edgjglefe6ikeefohgglohghjmgggjlijjimgghijjjjlklli8prj26pikokspl25mn844uuttqokpuwsslabiilnynoqsqoiin8song5mln42puxwxqpldbfefdbkjlnhjmkjfogfmmiknn2lfipojghhimghkmnecb8lnpqtjmkf6mporsqrnheohnj3oyzyztrqpeegebblojhhjjq42morstpnmmlkkowkor3mumhgkllmosjiijljjzto7mmnlnkommpkik82nrwxamlortqrrgblkocc74102njn4220002jc73120002lf842gedbbfebbagkzz3nlnq2stswzrjmsliqnqtqmnppjhccbmklkpur712mhhnrkplrzukqtsrxzyxompa2lxzzzhfedezzv4zld53152000vqqvoc9213pppuna454007757jommnxxpf9roghqwsoe6lnrpqzxztovnhhiqxnfbnojg9iqporxnha7ioljfmpmnknommlvnb75rqie6mnlmmrtia5togfinme81mlca2osjbpzmihlquqj8onstglni91sppshnph91lnjnpwwvrpkh528712api53wksp3tlg53qikjlsrpg5wda52tmf34rpvsiqhc769777888999a9999a9acjeaezib5szyzzzxvvtuyuonpvhd8ipkdbfrdb8eqld4isha4humb1dstxvzzveckrjd4bsrp5aqhgchpne3jskdfzvyzwprqzzzzvomowfddhvpg4hpgnjjurfstmmupblje6443211efgc755434a555657777666669behinniea7543',
  '2iefje23004g9732hfhl8e742100003f9732ojjd8fdfa3acdgfgcdccinmnpkjjgghgigbihjkkljijokoof9uzu3ahfgjftzt2aff545krpqojhljkihd7aejssqszzqokjnl6svka9kog23puwwxmon97eba89fcde9bdbb9iljfemxre3gjlidhnnopkkovvl9765efhijbdb94fhhklfgeafkkmb2jtutvonopecc969efa99quu33gkosojxyxtikhhagi2chinpvvqomoegrvoddtqi4fhkhdhrjdihil52kkhh6fdeghggg96fjp7742104ghs3121104e742131003fa731a8766a8766rqlj5glle2fjllmilrrgerquwnlmooki778ilnqjik323hmoqkirrlnjmrrnijkjjhee61djmnuf987ezzw4num95252001zzzzpd7112zzzzp945610cd9dlkefjrspghjinlgmsrhbhfgffonlhfmfddhlmfd9gnsj5ijieekhscdotwtkkgospttsurmgc69ojbi9pszzzzpe73jkrryzh941gc761nlb6dnkusdlqre4ijzzknia51jjvzllia51gddfiqpqtqea32gd248fa45lmyv5pe934iqzzzzzvl7k9644pe926knqtiofccbdbcccddecdfdccdedccdcddof78nxuxuwntxvwuqhfilfe6imccdgga88hkd83fqt63jvd61dhlppnlhboijoa2jslm5dhkihije95fqzi8mjjjhmmvsjjsmsthihjonrfg4tklebbqm8jjpzzuevwo5322111bbc9766656g677877888788779adghhloqkd864',
  '4kiiga33107jcd53mklj8h531100005jdc63tqma7kcea3ceeffkfhfafhgegicdaaeedb7khhilmjihjdfd8fkoh2hhheb8hmg1je9368ejjlnggfccaa74fedhgehomehhfhd4jkc6ggf933fhijlihg6497659jabd6abbc9kkga9jtja5jhgd8fmnornjllkd6445ibeefbbb86leehfbb96gkge73diiijkihh988648ia767npk35lfiifempoiiebb6bc18akmnonjliiajlog8clje4jfhc9dkc8bgfg33febb5ifhbaaaa66ifh5451008lgj6251006h431151006lge6285544c5445xsfb8lhhc2chkifiglgachjlmmhhhjic55bgfhldce236knnokekmgejfiifdgkjiife739dfgjb655hmmo5eswea465001lutqf84112ktspe52ac11rtjrzzcegmzzvzripxolnyzoqholklvsonxnmnzssorhlnvq5gfhe9mkshhqtzthufrqmutsynmilbdnf8zgyzzzzzia52kkuyzwb631n9441je748nlwvainzi3mhmpejc630lfmoehc631lallmnjjljh852mm4679637mhmn5j9627lozzzwqlf8mc645i962bnlntkljjhhkhhifgefccdba9aaa98acakqm7erwzzwyqzzwuuzplopno9df789lb766ee852ktq43lw841lekqqlfb6ouno92hmnk5mgnjkkdcc8lmzr6fdddbplzvcekkkqmfnmqlmac5zoi977jj6iiyztlizzx7422111aa999abbadxdeffffgfgeggededejlkkmoqof75',
  '5ojjga34108nfh84qttmbk521000007oii83omp99pgjf5lkihhpkke9fedcdkaa88cba87oigejlggehcaa6fhhc1ljlh96dgb1nhb28cfkknohifa99753hfcecacgfajjgfa4lj94kia733dddejjjg648775bofjl6gjklcrnh97fmic7ldhg7hnnnookjhgb5348mfjjkikka8phjojeh75eocb64dfffhpjje88865an8656ljg47rimfdjkkjfme995ba169nnnjjhjggaogic8igfd5onke9glb7ahhe45db998pnnd9a8958mhj546100bsmm8372007h421172007qmm82b4435f4334rpe9aqnmi3ipunendgd8begijqlighgb65ejeimefh35bopnmlfmphcnhmkceoxyvqkia49dddgd544dhhj6cwzj9565001hpnlc63112gnmkb42cf11wznwzwlpspzzyvvknzrlkxzuyivtqnzztpzutqzxytwkrioo8lkso7skpkisvzqizkwwnqrrznrlodeoi7zjzzzzyte842rnuvxq9523w8442gb637tmrnckmte2smorff9530rkrqdea532tbnkiieegflb82hi3468549romn6f752crkqurokgbask867f853isgjpikihhfigefedccaab998999879b9ttr7cquxzsxryzwwuwpsupqn8bc678sb666cb752rpn42jr731tcfjjhc95iwnr92ekun5uglhihbab8ulwl5dekf9ukztaemtouujqkros9c5zmg866pv7uruqmgezzq6321111bbaa99bbcfziimoooqprnuurprnmoqpopooqob8',
  '5ojjga34108nfh84qstmak521000007oii83pmp99pgjf5ljihhpkke9ffddekbb99ccb98ojhfjlhgfhcba6fhid1ljlha6ehc1nhb28cfkknohifba9863hfdfdbdigbjjggb4lja5kib733eeefkjjg648775bofjl7gjjlcrnha8goic7lehh7hoooppkkihb5448mfjjkikka7phjojeh86eodc64eghgipjjf88966an9657mlh47rjmgejllkgmfaa6bb17annokkikhhbohke8higd5omke9gmc7bhhf45ecaa8pnndaa9a59mhj546100bsmm8372007i421172007qml82b5445f5434sqfaaqnmi3ipunenehe9bfhjkqligigc76ejfjmegh35aopnmlfnphdnhmkdenxxuqkia4adeehe645ejjk6dwzj9565001jqpnd74112ipomd52ce11wznwzxlpspzzyvvkozrmlyzuyjvsqozztpzutqzxxtwkrjqo8lkro8rlqkisvzrizkwwnrsszorlpdeoi8zjzzzzzvf942rouvyra633v9442hc647tmspckmuf3slpsfga631rjrqdeb532sbnljjgghglb82ij3578649rono6g852fqlswtqlicasj867g863lrikqjlihhgigfgedccbbba99999989battr7dqvxztyrzzxwvxqruqqn8cd678sb766cc852qqo52js841tdgklida6jwos92flun5tglijicbb8umxm5eflfaulztbfmsoutjqlrosad5zmh867pu7trvsohfzzr6321111bbba9abbcfziimoooqpqnttrprmmoqpopppqob8',
];
function lvl(b, t) { const e = ENV[b], f = clamp(t * 20, 0, e.length - 1.001), i = f | 0; return lerp(parseInt(e[i], 36), parseInt(e[i + 1], 36), f - i) / 35; }
// a light, hand-painted music visualizer: seven little paper dabs dancing to the song + notes that drift up on the beat
function viz(t) {
  g.save();
  for (let b = 0; b < 7; b++) {
    const v = lvl(b, t), x = 540 + (b - 3) * 44, h = 10 + 80 * v, y = 1872;
    const bx = wbox(x - 13, y - h, 26, h, 13, 300 + b, 2.2);
    g.fillStyle = rgba(mixc(PAPER, [250, 120, 130], clamp(v * 1.3 - .3)), .42 + .3 * v); smooth(g, bx, true); g.fill(); ink(bx, true, 3, INK, .18 + .2 * v);
  }
  // notes: one per two beats, drifting up and away from the dabs
  for (let k = Math.max(0, Math.floor((t - 1.6) / 1)); k <= Math.floor(t); k++) {
    const age = t - k - .02; if (age < 0 || age > 1.6 || k + 1.6 > SDUR) continue;
    const side = k % 2 ? 1 : -1, x = 540 + side * (200 + hash(k) * 60) + side * age * 40 + Math.sin(age * 5 + k) * 12, y = 1840 - age * 150;
    g.globalAlpha = .6 * Math.min(1, age * 6) * (1 - seg(age, 1, 1.6));
    g.font = `900 ${50 + hash(k + 9) * 16}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.save(); g.translate(x, y); g.rotate(side * .25 + Math.sin(age * 6) * .15); g.lineWidth = 8; g.lineJoin = 'round'; g.strokeStyle = rgba(PAPER);
    const n = hash(k + 3) < .5 ? '♪' : '♫'; g.strokeText(n, 0, 0); g.fillStyle = rgba(INK); g.fillText(n, 0, 0); g.restore();
  }
  g.restore();
}
function ui(t, T) {
  g.setTransform(S, 0, 0, S, 0, 0);
  g.fillStyle = 'rgba(40,30,50,.25)'; g.fillRect(0, H - 12, W, 12);
  g.fillStyle = rgba(RD, .9); g.fillRect(0, H - 12, W * (t / DUR), 12);
  viz(songT(t));
  if (paused) {
    g.fillStyle = 'rgba(30,20,40,.45)'; g.fillRect(0, 0, W, H);
    const tri = [[470, 860], [470, 1060], [640, 960]]; g.fillStyle = rgba(PAPER, .95); smooth(g, tri, true); g.fill(); ink(tri, true, 10);
  }
}

// ---------- watch-time log (random session id, no personal data) ----------
const W8 = { sid: Math.random().toString(36).slice(2, 12) + Math.random().toString(36).slice(2, 8), cut: CUT, rev: +(Q.get('v') || REVN) || REVN, max_t: 0, watch_s: 0, loops: 0, finished: 0, sound: 0, sound_at: null, pauses: 0, last_t: 0, lastLoop: 0, ended: 0 };
{ let ref = ''; try { const u = new URL(document.referrer); ref = u.host + u.pathname; } catch (e) { }
  const inFrame = (() => { try { return window.top !== window.self; } catch (e) { return true; } })();
  Object.assign(W8, { vw: innerWidth, vh: innerHeight, iframe: inFrame ? 1 : 0, ref, hero: inFrame && (/^([a-z.]*websim\.com)?\/?$/.test(ref) || innerWidth < 330) ? 1 : 0 }); }
function payload() { const { lastLoop, ...p } = W8; p.max_t = +p.max_t.toFixed(2); p.watch_s = +p.watch_s.toFixed(1); p.last_t = +p.last_t.toFixed(2); return JSON.stringify(p); }
function beat() { if (FIX != null) return; try { fetch('/api/watch', { method: 'POST', body: payload(), keepalive: true }).catch(() => { }); } catch (e) { } }
function bye() { if (FIX != null) return; W8.ended = 1; try { navigator.sendBeacon('/api/watch', payload()); } catch (e) { } }
addEventListener('pagehide', bye);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') bye(); else W8.ended = 0; });
let lastBeat = 0, lastWall = performance.now();
function track(T, t) {
  const now = performance.now(), dt = Math.min(.25, (now - lastWall) / 1000); lastWall = now;
  if (!paused && document.visibilityState !== 'hidden') W8.watch_s += dt;
  const loop = Math.floor(T / DUR);
  if (loop > W8.lastLoop) { W8.lastLoop = loop; W8.loops = loop; W8.finished = 1; W8.max_t = DUR; }
  if (t > W8.max_t) W8.max_t = t;
  W8.last_t = t;
  if (now - lastBeat > 2000) { lastBeat = now; beat(); }
}

function frame() {
  const T = Math.max(0, elapsed()); // right after a tap the clock sits ~.05 s before 0; wrapping that to t≈30.35 logged max_t as a full watch
  if (audioOn && T > loopsScheduled * DUR - 1.5) { schedule(t0 + loopsScheduled * DUR); loopsScheduled++; }
  const t = ((T % DUR) + DUR) % DUR;
  render(songT(t)); ui(t, T); track(T, t);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
