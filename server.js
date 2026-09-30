// Watch-time log: one row per viewing session (random id, no personal data).
export const schema = `
  CREATE TABLE IF NOT EXISTS watch (
    sid TEXT PRIMARY KEY, cut INTEGER, rev INTEGER, started INTEGER, updated INTEGER,
    max_t REAL DEFAULT 0, watch_s REAL DEFAULT 0, loops INTEGER DEFAULT 0, finished INTEGER DEFAULT 0,
    sound INTEGER DEFAULT 0, sound_at REAL, pauses INTEGER DEFAULT 0, last_t REAL DEFAULT 0,
    vw INTEGER, vh INTEGER, iframe INTEGER, hero INTEGER, ref TEXT, beats INTEGER DEFAULT 0, ended INTEGER DEFAULT 0
  );
  CREATE INDEX IF NOT EXISTS watch_cut ON watch (cut, started);
`;

const num = (v, lo, hi, d = 0) => { v = Number(v); return Number.isFinite(v) ? Math.max(lo, Math.min(hi, v)) : d; };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/watch") return new Response("Not found", { status: 404 });
    if (request.method !== "POST") return new Response("POST only", { status: 405 });
    let b;
    try { b = JSON.parse(await request.text()); } catch (e) { return new Response("bad json", { status: 400 }); }
    const sid = String(b.sid || "");
    if (!/^[a-z0-9]{8,24}$/.test(sid)) return new Response("bad sid", { status: 400 });
    const now = Date.now();
    const ref = String(b.ref || "").slice(0, 120);
    await env.DB.prepare(
      `INSERT INTO watch (sid, cut, rev, started, updated, max_t, watch_s, loops, finished, sound, sound_at, pauses, last_t, vw, vh, iframe, hero, ref, beats, ended)
       VALUES (?1, ?2, ?3, ?4, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, 1, ?18)
       ON CONFLICT(sid) DO UPDATE SET
         updated = ?4, max_t = MAX(max_t, ?5), watch_s = MAX(watch_s, ?6), loops = MAX(loops, ?7),
         finished = MAX(finished, ?8), sound = MAX(sound, ?9), sound_at = COALESCE(sound_at, ?10),
         pauses = MAX(pauses, ?11), last_t = ?12, beats = MIN(beats + 1, 100000), ended = MAX(ended, ?18)`
    ).bind(
      sid, num(b.cut, 0, 999) | 0, num(b.rev, 0, 99999) | 0, now,
      num(b.max_t, 0, 60), num(b.watch_s, 0, 36000), num(b.loops, 0, 10000) | 0, b.finished ? 1 : 0,
      b.sound ? 1 : 0, b.sound_at == null ? null : num(b.sound_at, 0, 36000), num(b.pauses, 0, 10000) | 0,
      num(b.last_t, 0, 60), num(b.vw, 0, 10000) | 0, num(b.vh, 0, 10000) | 0, b.iframe ? 1 : 0, b.hero ? 1 : 0,
      ref, b.ended ? 1 : 0
    ).run();
    return new Response(null, { status: 204 });
  },
};
