const host = window.location.hostname;
const port = window.location.port;
const socket = io(`http://${host}:${port}`);

const form = document.getElementById("forms");
const messageInput = document.getElementById("input");
const messageContainer = document.querySelector(".contain");
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

const name = prompt("Enter Your Name To Join This Chat");
socket.emit('new-user-joined', name);
if (!name) {
    alert("Please enter your name properly");
    name = "Guest";
}

socket.on('user-joined', name => {
    appendMessage(`${name} joined the Chat`, 'join');
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
        socket.emit('send', message);
        messageInput.value = "";
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
});
