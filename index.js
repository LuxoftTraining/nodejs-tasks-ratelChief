const http = require("http");
const host = "localhost";
const port = 9000;

const listener = (req, res) => {
  res.setHeader("Content-type", "application/json");
  res.writeHead(200);

  res.end(JSON.stringify({ key: 111 }));
};

const server = http.createServer(listener);

server.listen(port, host, () => {
  console.log(`server is running on ${host}:${port}`);
});
