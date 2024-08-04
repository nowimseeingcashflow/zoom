const socket = io();

const myFace = document.getElementById("myFace");
let myStream;

async function getMedia() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    myFace.srcObject = myStream;
  } catch (e) {
    console.log(e);
  }
}

getMedia();

const muteBtn = document.getElementById("mute");
const camBtn = document.getElementById("camera");

function handleMuteClick(e) {
  e.preventDefault();
  myStream.getAudioTracks().forEach((track) => {
    track.enabled = !track.enabled;
  });
  if (muteBtn.src.endsWith("/public/mute.png") === true) {
    muteBtn.src = "/public/unmute.png";
  } else {
    muteBtn.src = "/public/mute.png";
  }
}

function handleCamClick(e) {
  e.preventDefault();
  myStream.getVideoTracks().forEach((track) => {
    track.enabled = !track.enabled;
  });
  if (camBtn.src.endsWith("/public/nocam.png") === true) {
    camBtn.src = "/public/cam.png";
  } else {
    camBtn.src = "/public/nocam.png";
  }
}

muteBtn.addEventListener("click", handleMuteClick);
camBtn.addEventListener("click", handleCamClick);

const chats = document.querySelector("#chats");
const chatsForm = chats.querySelector("form");
const welcome = document.querySelector("#welcome");
const messageList = document.querySelector("ul");
const chatrooms = document.querySelector("#chatroom");
const createRoomButton = document.querySelector("#createRoomButton");
let roomName;

welcome.style.display = "none";
chats.style.display = "none";

function messageSend(msg) {
  const li = document.createElement("li");
  li.className = "chat-message";
  li.innerText = msg;
  messageList.append(li);
  li.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

createRoomButton.addEventListener("click", (e)=>{
  e.preventDefault();
  welcome.style.display = "block";
});

welcome.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = welcome.querySelector("input");
  roomName = input.value;

  const chatroom = document.createElement("button");
  chatroom.className = "chatroom-enter";
  chatroom.id = roomName;
  chatroom.innerText = roomName;
  chatroom.onclick = () => {
    roomName = chatroom.id;
    socket.emit("room", roomName);
    chats.style.display = "block";
    createRoomButton.style.display = "none";
    chatrooms.style.display = "none";
  }

  // console.log(document.querySelectorAll("#chatroom-enter"));
  // if (document.querySelectorAll("#chatroom-enter").length >10){
  //   alert("채팅방은 10개까지만 만들 수 있습니다.");
  //   return;
  // }  
  chatrooms.append(chatroom);
  input.value = "";
  welcome.style.display = "none";
});

// chatroomEnter.addEventListener("click", (e)=>{
//   e.preventDefault();
//   console.log(chatroomEnter);
//   // socket.emit("room", roomName);
// })

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

