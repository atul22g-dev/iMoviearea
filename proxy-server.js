import http from "http";
import https from "https";
import { URL } from "url";

const PORT = 3001;

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsed = new URL(req.url, `http://localhost:${PORT}`);

  if (parsed.pathname === "/api/download") {
    const videoUrl = parsed.searchParams.get("url");
    const fileName = parsed.searchParams.get("name") || "download";

    if (!videoUrl) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing url parameter" }));
      return;
    }

    let targetUrl;
    try {
      targetUrl = new URL(videoUrl);
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid URL" }));
      return;
    }

    const client = targetUrl.protocol === "https:" ? https : http;

    console.log(`[download] ${fileName} ← ${videoUrl.substring(0, 80)}...`);

    const proxyReq = client.get(
      videoUrl,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Referer: "https://fast.wistia.net/",
        },
        timeout: 30000,
      },
      (proxyRes) => {
        // Follow redirects
        if (
          proxyRes.statusCode >= 300 &&
          proxyRes.statusCode < 400 &&
          proxyRes.headers.location
        ) {
          const redirUrl = proxyRes.headers.location;
          const redirClient = redirUrl.startsWith("https") ? https : http;
          redirClient
            .get(redirUrl, {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                Referer: "https://fast.wistia.net/",
              },
              timeout: 60000,
            }, (redirRes) => {
              sendResponse(redirRes, fileName, res);
            })
            .on("error", (err) => {
              console.error(`[download] redirect error:`, err.message);
              res.writeHead(502, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Redirect failed" }));
            });
          return;
        }

        sendResponse(proxyRes, fileName, res);
      }
    );

    proxyReq.on("error", (err) => {
      console.error(`[download] proxy error:`, err.message);
      if (!res.headersSent) {
        res.writeHead(502, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Proxy request failed" }));
      }
    });

    proxyReq.on("timeout", () => {
      proxyReq.destroy();
      if (!res.headersSent) {
        res.writeHead(504, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Request timed out" }));
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

function sendResponse(proxyRes, fileName, res) {
  const safeName = fileName.replace(/[^a-zA-Z0-9\s\-_.()]/g, "");
  const contentType = proxyRes.headers["content-type"] || "video/mp4";
  const contentLength = proxyRes.headers["content-length"] || "";

  console.log(`[download] streaming ${safeName}.mp4 (${contentLength || "unknown"} bytes, ${contentType})`);

  const headers = {
    "Content-Type": contentType,
    "Content-Disposition": `attachment; filename="${safeName}.mp4"`,
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-cache",
  };
  if (contentLength) headers["Content-Length"] = contentLength;

  res.writeHead(proxyRes.statusCode || 200, headers);
  proxyRes.pipe(res);
}

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[download-proxy] running on http://127.0.0.1:${PORT}`);
});
