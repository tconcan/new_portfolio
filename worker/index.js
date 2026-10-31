// Cloudflare Worker in front of the static assets, invoked only for .mp4
// requests (see run_worker_first in wrangler.jsonc). Workers static assets
// answer Range requests with the whole file (200), and iOS Safari refuses to
// play video from a server that can't return 206 Partial Content, so this
// slices the requested byte range itself. Everything else passes through.

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const range = request.headers.get("Range");

    if (!range || response.status !== 200 || request.method !== "GET") {
      return withAcceptRanges(response);
    }

    const body = await response.arrayBuffer();
    const size = body.byteLength;
    const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());

    let start;
    let end;
    if (match && match[1] === "" && match[2] !== "") {
      // Suffix range: the last N bytes
      start = Math.max(0, size - Number(match[2]));
      end = size - 1;
    } else if (match && match[1] !== "") {
      start = Number(match[1]);
      end = match[2] === "" ? size - 1 : Math.min(Number(match[2]), size - 1);
    }

    if (start === undefined || start > end || start >= size) {
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${size}` },
      });
    }

    const headers = new Headers(response.headers);
    headers.set("Accept-Ranges", "bytes");
    headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
    headers.set("Content-Length", String(end - start + 1));
    return new Response(body.slice(start, end + 1), { status: 206, headers });
  },
};

function withAcceptRanges(response) {
  const headers = new Headers(response.headers);
  headers.set("Accept-Ranges", "bytes");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
