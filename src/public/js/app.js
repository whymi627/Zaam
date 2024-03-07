// alert("Hi");
const messageList = document.querySelector("ul");
const nickNameForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
    // alert("웹소켓 서버와 연결에 성공")
    console.log("Connected to Server ✅");
});

socket.addEventListener("message", (message) => {
    // console.log("Just got this: ", message.data, " from the Server");
    // alert(message.data);
    // console.log("New message: ", message.data);
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});

socket.addEventListener("close", () => {
    // alert("웹소켓 서버와 연결이 종료됨.")
    console.log("Disconnected from Server ❌");
});

// setTimeout(() => {
//     socket.send("Hello from the browser!");
// }, 10000);

function handleSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(input.value);
    // console.log(input.value);
    input.value = "";
}
function handleNickSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(input.value);
    // console.log(input.value);
    input.value = "";
}
messageForm.addEventListener("submit", handleSubmit);
nickNameForm.addEventListener("submit", handleNickSubmit)