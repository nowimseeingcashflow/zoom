const appSocket = new WebSocket("ws://chatty-server-env-1.eba-bpwvsyt8.ap-northeast-2.elasticbeanstalk.com/chat");
const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

appSocket.addEventListener("open", () => {
  console.log("Sujing in❤");
});

appSocket.addEventListener("message", (msg) => {
    const li = document.createElement("li");
    li.className = "chat-message";
    li.innerText = msg.data;
    messageList.append(li);
    li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

appSocket.addEventListener("close", () => {
  console.log("Sujing out❤");
});

// setTimeout(() => {
//     appSocket.send("sujini cuter!!!");
// }, 5000);

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
