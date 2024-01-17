// app.js
const app = require("express")();
const ws = require("ws");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 8080;
app.get("/", function (req, res) {
  res.sendFile("index.html");
});
try {
  const client = new ws("ws://localhost:8000/ws/chat/1/");

  client.on("open", () => {
    // Causes the server to print "Hello"
    console.log("Connected!");
  });
} catch (error) {
  console.log(error);
}

server.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
