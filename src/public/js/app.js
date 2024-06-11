const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");
const appSocket = new WebSocket("ws://" + window.location.host);

appSocket.addEventListener("open", () => {
  console.log("Sujing in❤");
});

appSocket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});

appSocket.addEventListener("close", () => {
  console.log("Sujing out❤");
});

// setTimeout(() => {
//     appSocket.send("sujini cuter!!!");
// }, 5000);

messageForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const input = messageForm.querySelector("input");
    appSocket.send(input.value);
    input.value = "";
});
