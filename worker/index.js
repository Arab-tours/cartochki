// Cloudflare Worker: прокси для проверки домашнего задания на GitHub Pages.
// ВЕРСИЯ НА GOOGLE GEMINI (есть бесплатный лимит). Ключ хранится только здесь (секрет GEMINI_API_KEY), в сайте его нет.
// Необязательное поле ref — второе изображение (образец рука’а МГИМО для прописей), идёт после фото.
// Настройки (Settings → Variables): GEMINI_API_KEY (secret), ALLOWED_ORIGINS (необязательно),
// MODEL (необязательно, по умолчанию gemini-flash-latest), DAILY_LIMIT (необязательно, число проверок на ученика в сутки; нужен KV с именем KV).
export default {
  async fetch(req, env) {
    const allowed = (env.ALLOWED_ORIGINS || "https://arab-tours.github.io").split(",").map(s => s.trim());
    const origin = req.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : allowed[0],
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "content-type",
      "Vary": "Origin"
    };
    const json = (o, st = 200) => new Response(JSON.stringify(o), { status: st, headers: { ...cors, "content-type": "application/json" } });
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    if (req.method !== "POST" || !allowed.includes(origin)) return json({ error: "forbidden" }, 403);
    let b; try { b = await req.json(); } catch { return json({ error: "bad json" }, 400); }
    if (b.ping) return json({ ok: true });
    if (!b.prompt || !b.image || b.prompt.length > 200000 || b.image.length > 4000000 || (b.ref && b.ref.length > 3000000)) return json({ error: "bad request" }, 400);
    const user = String(b.user || "").slice(0, 40);
    if (env.KV && env.DAILY_LIMIT) {
      const key = "u:" + user + ":" + new Date().toISOString().slice(0, 10);
      const n = parseInt(await env.KV.get(key) || "0", 10);
      if (n >= parseInt(env.DAILY_LIMIT, 10)) return json({ error: "limit" }, 429);
      await env.KV.put(key, String(n + 1), { expirationTtl: 90000 });
    }
    const model = env.MODEL || "gemini-flash-latest";
    const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent", {
      method: "POST",
      headers: { "x-goog-api-key": env.GEMINI_API_KEY, "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [
          { inline_data: { mime_type: b.mime || "image/jpeg", data: b.image } },
          ...(b.ref ? [{ inline_data: { mime_type: "image/jpeg", data: b.ref } }] : []),
          { text: b.prompt }
        ] }],
        generationConfig: { maxOutputTokens: 3000, temperature: 0.2 }
      })
    });
    const j = await r.json();
    const text = ((j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || []).map(p => p.text || "").join("");
    return json({ text, error: j.error || null }, r.ok ? 200 : 502);
  }
};
