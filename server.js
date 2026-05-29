const { createServer } = require("node:http");
const next = require("next");

const port = Number.parseInt(process.env.PORT ?? "7000", 10);
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, () => {
    console.log(`> FlumeTV UI ready on http://localhost:${port}`);
  });
});
