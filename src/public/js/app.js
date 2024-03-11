//front-end

// 자동적으로 backend socket.io와 연결해주는 함수
const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);

}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value="";

}


function showRoom() {
   welcome.hidden = true;
   room.hidden = false;
   const h3 = room.querySelector("h3");
   h3.innerText = `Room ${roomName}`;
   const form = room.querySelector("form");
   form.addEventListener("submit", handleMessageSubmit);

}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value ="";
}


form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", () => {
    console.log("Welcome event received!");
    addMessage("Someone Joined!!.");
});

socket.on("bye", () => {
    console.log("bye event received!");
    addMessage("Someone left ㅠㅠ!!.");
});

socket.on("new_message", addMessage);