const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3300, function () {
  console.log("Server is running on port 3300");
});

// Begin Websocket

const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
  const numClients = wss.clients.size;
  console.log("Clients connected", numClients);
  wss.broadCast(`Current visitors: ${numClients}`);

  if (ws.readyState === ws.OPEN) {
    ws.send("welcome to my server");
  }

  ws.on("close", function close() {
    wss.broadCast(`Client disconnected`);
    console.log("Client disconnected");
  });
});

wss.broadCast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
