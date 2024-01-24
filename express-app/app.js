// app.js
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const server = require("http").createServer(app);
const port = process.env.PORT || 8081;
var token = null;

const corsOptions = {
  origin: "http://localhost:8000", // Replace with your Django server's address
  optionsSuccessStatus: 200, // For legacy browser support
};
app.use(cors(corsOptions));

app.use(express.static("public"));
// app.get("/", function (req, res) {
//   res.sendFile(path.join(__dirname, "./public", "index.html"));
// });
// app.get("/login", function (req, res) {
//   res.sendFile(path.join(__dirname, "./public", "login.html"));
// });

server.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
