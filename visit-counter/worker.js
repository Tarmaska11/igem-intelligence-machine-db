// A visit counter for the iGEM Intelligence Machine.
//
// The website is static, so nothing on GitHub's side can count a visit - fetching
// a file from GitHub Pages runs no code. This is the smallest thing that can:
// a Cloudflare Worker with one KV key. It is free, it needs no card, and it is
// yours, so it does not disappear when somebody else's free service shuts down.
//
// Setup, about ten minutes:
//   1. dash.cloudflare.com -> Workers & Pages -> Create -> Worker. Deploy it.
//   2. Edit code, paste this file, deploy again.
//   3. Storage & Databases -> KV -> Create namespace, call it VISITS.
//   4. Back in the Worker: Settings -> Bindings -> Add -> KV namespace,
//      variable name COUNTER, namespace VISITS.
//   5. Put the worker URL in site.json:
//
//        "visits": {
//          "enabled": true,
//          "endpoint": "https://<your-worker>.workers.dev/up",
//          "field": "count"
//        }
//
// GET /up   adds one and returns the new total
// GET /     returns the total without changing it

const HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "no-store",
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: HEADERS });
    }
    if (request.method !== "GET") {
      return new Response(JSON.stringify({ error: "GET only" }), { status: 405, headers: HEADERS });
    }

    const key = "total";
    let count = Number(await env.COUNTER.get(key)) || 0;

    if (new URL(request.url).pathname.replace(/\/+$/, "").endsWith("/up")) {
      count += 1;
      // KV is eventually consistent, which is fine for a counter - a couple of
      // simultaneous visits may share a number, and nobody will ever notice
      await env.COUNTER.put(key, String(count));
    }

    return new Response(JSON.stringify({ count }), { headers: HEADERS });
  },
};
