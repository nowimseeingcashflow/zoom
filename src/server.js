import express from "express";
import Websocket from "ws";
import http from "http";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.use(express.static('css'));

app.get("/", (req, res)=> res.render("index"))
app.get("/chat", (req, res) => res.render("home"));

const server = http.createServer(app);
const wss = new Websocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  // console.log(socket);

  socket.on("message", (msg) => {
    var message = msg.toString("utf8");
    sockets.forEach((eaSocket) => {
      eaSocket.send(message);
    });
  });
  socket.on("close", () => {
    console.log("Disconnected from client");
  });
});

server.listen(5000, () => console.log("Listening on localhost:5000"));
