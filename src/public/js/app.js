const appSocket = new WebSocket("wss://"+ window.location.host);
const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

appSocket.addEventListener("open", () => {
  console.log("in❤");
});

appSocket.addEventListener("message", (msg) => {
    const li = document.createElement("li");
    li.className = "chat-message";
    li.innerText = msg.data;
    messageList.append(li);
    li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

appSocket.addEventListener("close", () => {
  console.log("out❤");
});

messageForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const nickname = document.cookie
  .split('; ')
  .find(pair => pair.startsWith('nickname='))
  ?.split('=')[1];

    const input = messageForm.querySelector("input");
    const text = input.value.trim();
    appSocket.send(JSON.stringify({ text: text, nickname: nickname }));
    input.value = "";
});
