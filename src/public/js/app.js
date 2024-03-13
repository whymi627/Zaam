const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");
const call = document.getElementById("call");

call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnection;

// 연결된 카메라 가져오기

async function getCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        // console.log(devices);
        const cameras = devices.filter((device) => device.kind === "videoinput");
        // console.log(cameras);
        const currentCamera = myStream.getVideoTracks()[0];
        cameras.forEach((camera) => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if(currentCamera.label === camera.label){
                option.selected = true;
            }
            camerasSelect.appendChild(option);
        });
        console.log(myStream.getAudioTracks());
        
    } catch (error) {
        console.log(error);
    }
}

// 디바이스ID로 media stream가져오기
async function getMedia(deviceId){
    const initialConstrains = {
        audio: true,
        video: { facingMode: "user" },
    };
    const cameraConstrains = {
        audio: true,
        video: { deviceId: {exact: deviceId} },

    };

    try {
        myStream = await navigator.mediaDevices.getUserMedia(
          deviceId ? cameraConstrains : initialConstrains
        );
        // console.log(myStream);
        myFace.srcObject = myStream;
        if (!deviceId) {
            await getCameras();
        }

        
    } catch (error) {
        console.error("Error accessing media devices:", error);
        // 여기에서 오류 처리를 수행하거나 사용자에게 오류 메시지를 표시할 수 있습니다.
    
    }
}

// 모든걸 시작시키는 함수이기때문에 삭제
// getMedia();

function handleMuteClick() {
    // console.log(myStream.getAudioTracks());
    myStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
            
    if(!muted){
        muteBtn.innerText = "Unmute";
        muted = true;
    } else {
        muteBtn.innerText = "Mute";
        muted = false;
    }

}
function handleCameraClick() {
    // console.log(myStream.getVideoTracks());
    myStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
    if(cameraOff){
        cameraBtn.innerText = "Turn Camera Off";
        cameraOff = false;
    } else {
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = true;
    }
}

// 카메라 변경 감지
async function handleCameraChange(){
    // console.log(camerasSelect.value);
    await getMedia(camerasSelect.value);
}
muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);

// Welcome Form (join a room)
const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

async function initCall(){
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();

}

async function handleWelcomeSubmit(event) {
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    // console.log(input.value);
    await initCall();
    socket.emit("join_room", input.value);
    roomName = input.value;
    input.value="";

}
welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// Socket Code

// client
// for Peer A
socket.on("welcome", async () => {
    // console.log("somebody joined.");
    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);
    console.log("sent the offer.");
    socket.emit("offer", offer, roomName);
});

// for Peer B
socket.on("offer", async (offer) => {
    // console.log(offer);
    console.log("received the offer.");
    myPeerConnection.setRemoteDescription(offer);
    const answer = await myPeerConnection.createAnswer();
    // console.log(answer);
    myPeerConnection.setLocalDescription(answer);
    socket.emit("answer", answer, roomName); // server로 answer 보내기

});

socket.on("answer", answer => {
    console.log("received the answer.");
    myPeerConnection.setRemoteDescription(answer);
});
// RTC Code

// function makeConnection(){
//     // 양 브라우저 간 peer to peer 연결을 만듦.
//     myPeerConnection = new RTCPeerConnection();
//     // console.log(myStream.getTracks());
//     myStream
//         .getTracks()
//         .forEach((track) => myPeerConnection.addTrack(track, myStream));
// }

// RTC Code

function makeConnection(){
    try {
        // 양 브라우저 간 peer to peer 연결을 만듦.
        myPeerConnection = new RTCPeerConnection();
        
        if (myStream && myStream.getTracks().length > 0) {
            myStream.getTracks().forEach((track) => myPeerConnection.addTrack(track, myStream));
        } else {
            console.error("Cannot make connection: Media stream is not available.");
            // 미디어 스트림이 없을 때 적절한 오류 처리를 수행하세요.
        }
    } catch (error) {
        console.error("Error in makeConnection():", error);
        // 오류를 적절히 처리하거나 사용자에게 알림을 제공할 수 있습니다.
    }
}
