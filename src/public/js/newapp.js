const socket = io();

const chats = document.querySelector("#chats");
const chatsForm = chats.querySelector("form");
const welcome = document.querySelector("#welcome");
const messageList = document.querySelector("ul");
const createRoomButton = document.querySelector("#createRoomButton");
let roomName;

welcome.style.display = "none";

function messageSend(msg) {
  const li = document.createElement("li");
  li.className = "chat-message";
  li.innerText = msg;
  messageList.append(li);
  li.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

createRoomButton.addEventListener("click", ()=>{
  welcome.style.display = "block";
  const chatrooms = document.querySelector("#chatroom");
  const chatroom = document.createElement("div");
  chatroom.className = "chatroom-enter";
});

welcome.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = welcome.querySelector("input");
  roomName = input.value;
  socket.emit("room", roomName);
  input.value = "";
});

chatsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const nickname = document.cookie
    .split("; ")
    .find((pair) => pair.startsWith("nickname="))
    ?.split("=")[1];

  const input = chatsForm.querySelector("input");
  const text = input.value.trim();
  socket.emit("message", text, nickname, roomName);
  input.value = "";
});

socket.on("showMessage", (msg)=>{
  messageSend(msg);
});

