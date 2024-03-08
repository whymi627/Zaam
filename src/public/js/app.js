//front-end

const socket = io();

const welcom = document.getElementById("welcome");
const form = document.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

function backendDone(msg) {
    console.log(`The backend says: `, msg);
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", { payload: input.value}, backendDone);
    input.value ="";
}
form.addEventListener("submit", handleRoomSubmit);