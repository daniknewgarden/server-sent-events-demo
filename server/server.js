const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 8000;

const ServerSentEvents = (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let id = 0;
  let user;

  const sentInterval = setInterval(() => {
    user = `user-${id}`;
    if (user) {
      res.write(`data: 👤 ${user}\n`);
      res.write(`id: ${id++}\n`);
      res.write(`\n`);
    }
  }, 1000);

  setTimeout(() => {
    clearInterval(sentInterval);
    res.write(`event: end-of-stream\n`);
    res.write(`data: This is the end of stream 🦍\n`);
    res.write("\n");
    res.end("End of stream");
  }, 20000);
};

http
  .createServer((req, res) => {
    const url = new URL(`http://${req.headers.host}${req.url}`);

    if (url.pathname === "/stream") {
      ServerSentEvents(req, res);
      return;
    }

    const fileStream = fs.createReadStream(path.join(__dirname, "index.html"));
    fileStream.pipe(res);
  })
  .listen(PORT, () => {
    console.log(`Server was started on ${PORT} 🏁`);
  });
