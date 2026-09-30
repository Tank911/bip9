
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
