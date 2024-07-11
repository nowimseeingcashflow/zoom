import express from "express";
import SocketIO from "socket.io";
import http from "http";
import cookieParser from "cookie-parser";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.use(cookieParser());
app.use(express.json());

function requireNickname(req, res, next) {
  const nickname = req.cookies.nickname;

  if (!nickname) {
    // Redirect user to login or nickname setting page
    return res.redirect("/");
  }

  next();
}

app.get("/", (req, res) => res.render("index"));

app.get("/chat", requireNickname, (req, res) => {
  const nickname = req.cookies.nickname;
  res.render("newhome");
});

app.get("/iloveyou", (req, res) => {
  res.render("I love you Sujin!");
});

const server = http.createServer(app);
const wss = SocketIO(server);

wss.on("connection", (socket) => {
  socket.on("room", (msg) => {
    socket.join(msg);
  });

  socket.on("message", (msg, nickname, room) => {
    const chat = `${nickname} : ${msg}`;
    wss.to(room).emit("showMessage", chat);
  });

  socket.on("disconnected", () => {
    console.log("Disconnected from client");
  });
});
// const sockets = [];

// wss.on("connection", (socket) => {
//   sockets.push(socket);

//   socket.on("message", (data) => {
//     var data = data.toString("utf8");

//     const parsedData = JSON.parse(data);
//     const message = parsedData.text;
//     const nickname = parsedData.nickname;

//     if (message === undefined) {
//       sockets.forEach((eaSocket) => {
//         eaSocket.send(nickname + " is connected!");
//       });
//       return;
//     }
//     sockets.forEach((eaSocket) => {
//       eaSocket.send(nickname + " : " + message);
//     });
//   });

//   socket.on("close", () => {
//     console.log("Disconnected from client");
//   });
// });

server.listen(8080, () => console.log("Listening on localhost:8080"));
