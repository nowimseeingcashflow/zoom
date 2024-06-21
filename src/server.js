import express from "express";
import Websocket from "ws";
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
    return res.redirect('/'); 
  }
  console.log(nickname);
  
  next();
}

app.get("/", (req, res)=> res.render("index"))

app.get("/chat", requireNickname, (req, res) => {
  res.render("home")
});

const server = http.createServer(app);
const wss = new Websocket.Server({ server });

const sockets = [];

wss.on("connection", (socket, req) => {
  sockets.push(socket);
  req.socket = socket;

  socket.on("setNick", (data)=>{
    if (data.type === 'setNickname') {
      const nickname = data.nickname;
      req.socket.nickname = nickname;
      wss.clients.forEach(client => {
        if (client.readyState === socket.OPEN) {
          client.send(JSON.stringify({ type: 'nickname', nickname }));
        }
      });
    }
  })
  socket.on("message", (data) => {
    var message = data.toString("utf8");

    if (data.type === 'setNickname') {
      const nickname = data.nickname;
      req.socket.nickname = nickname;
      sockets.forEach((eaSocket) => {
        eaSocket.send(JSON.stringify({ type: 'nickname', nickname }));
        }
  );
    }
    if (data.type === 'chatty'){
      sockets.forEach((eaSocket) => {
      eaSocket.send(JSON.stringify({ type: 'message', text: message }));
    });
  }
  });
  socket.on("close", () => {
    console.log("Disconnected from client");
  });
});

server.listen(5000, () => console.log("Listening on localhost:5000"));
