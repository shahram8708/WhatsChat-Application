const host = window.location.hostname;
const port = window.location.port;
const socket = io(`http://${host}:${port}`);

const form = document.getElementById("forms");
const messageInput = document.getElementById("input");
const messageContainer = document.querySelector(".contain");
const roomContainer = document.getElementById("room_id");
const send = new Audio("send.mp3")
const receive = new Audio("recieve.mp3")
const left = new Audio("left.mp3")
const join = new Audio("join.mp3")

const appendMessage = (message, position) => {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageElement.classList.add("message");
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position === "send") {
        send.play()
    }
    if (position === "receive") {
        receive.play()
    }
    if (position === "left") {
        left.play()
    }
    if (position === "join") {
        join.play()
    }
}

let name = prompt("Enter Your Name To Join This Chat");

if (!name || !/^[a-zA-Z]+$/.test(name)) {
    alert("Please enter your name properly with only alphabetic characters.");
    window.location.href = `http://${host}:${port}/notjoin.html`;
}else{

    let roomId = prompt("Room ID should only be a number and 5 digits long. Create your room Id. Someone has already created Room Id, so enter that Room Id and join chat. And when there is no need to create a room Id, then create your own room Id. And give that Id to your friend so that he can join this chat.");

    if (!roomId || isNaN(roomId) || roomId.length > 5) {
        alert("Please enter a valid Room ID containing only numbers and up to 5 digits.");
        roomId = "Guest";
        window.location.href = `http://${host}:${port}/notjoin.html`;
    }else{

roomContainer.innerText=roomId;
localStorage.setItem('roomId', roomId);

socket.emit('join-room', roomId, name);

}

}


socket.on('user-joined', name => {
    appendMessage(`${name} joined the Chat`, 'join');
    messageContainer.scrollTop = messageContainer.scrollHeight;
});

socket.on('welcome', welcomeMessage => {
    appendMessage(welcomeMessage, 'receive');
    messageContainer.scrollTop = messageContainer.scrollHeight;
});

socket.on('receive', data => {
    appendMessage(`${data.name} : ${data.message}`, 'receive');
    messageContainer.scrollTop = messageContainer.scrollHeight;
});

socket.on('left', name => {
    appendMessage(`${name} left the Chat`, 'left');
    messageContainer.scrollTop = messageContainer.scrollHeight;
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let message = messageInput.value.trim(); 
    
    if (!message) {
        alert("Please Enter Message");
        message = "Hello";
    } else {
        appendMessage(`You : ${message}`, 'send');
        const roomKey = localStorage.getItem('roomId');
        socket.emit('send', { message: message, roomId: roomKey });
        messageInput.value = "";
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
});
