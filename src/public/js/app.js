//front-end

const socket = io();

const welcom = document.getElementById("welcome");
const form = document.querySelector("form");

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", { payload: input.value}, () =>{
        console.log("Server is done!");

    }
    );
    input.value ="";
}
form.addEventListener("submit", handleRoomSubmit);