const socket = io();
let username;
// flag varibable to check whether join info to display or left info to display
var checkUpdate = 0;
let feedback = document.getElementById("feedback");
let join = document.getElementById("join-user");
// when join button is clicked then it takes username and emit to server
join.addEventListener("click", () => {
  username = document.getElementById("username").value;
  feedback.innerHTML = `${username} Online`;
  // if null is typed return nothing
  if (username.length == 0) {
    return;
  }
  socket.emit("newuser", username);
  //to switch the window
  let joinScreen = document.querySelector(".join-screen");
  let chatScreen = document.querySelector(".chat-screen");
  joinScreen.classList.remove("active");
  chatScreen.classList.add("active");
});

socket.on("newuser", (data) => {
  formatMessage("update", data);
});

let sendMessage = document.getElementById("send-message");
let messageInput = document.getElementById("message-input");
// handle the send button to send message
sendMessage.addEventListener("click", () => {
  // get message from input box
  let message = messageInput.value;
  if (message == "") {
    return;
  }
  socket.emit("chat", {
    username: username,
    message: message,
    time: new Date().toLocaleTimeString(),
  });
  // to remove the value in input box
  messageInput.value = "";
  messageInput.focus();
});

socket.on("chat", (data) => {
  feedback.innerHTML = `${username} Online`;
  formatMessage("my", data);
});
socket.on("chatgroup", (data) => {
  feedback.innerHTML = `${username} Online`;
  formatMessage("other", data);
});
// to show typing message when user types in input box
messageInput.addEventListener("keypress", () => {
  socket.emit("typing", username);
});
socket.on("typing", (data) => {
  feedback.innerHTML = `<p>${data} is typing...</p>`;
});

let exit = document.getElementById("exit-chat");
exit.addEventListener("click", () => {
    // as it contains the starting url so it redirect to the home url
  window.location.href = window.location.href;
});
socket.on("exit", (data) => {
  // flag varibable to left info to display
  checkUpdate = 1;
  formatMessage("update", data);
});

/**
 * if type matches it renders the message send by the user
 *
 * @param {string} type
 * @param {object} message
 */
function formatMessage(type, message) {
  let messageContainer = document.querySelector(".messages");
  if (type == "my") {
    let divContainer = document.createElement("div");
    divContainer.setAttribute("class", "message my-message");
    divContainer.innerHTML = `<div class="own"><div class='name'>You</div><div class="text">${message.message}</div><div class='time'>${message.time}</div></div>`;
    messageContainer.appendChild(divContainer);
  } else if (type == "other") {
    let divContainer = document.createElement("div");
    divContainer.setAttribute("class", "message other-message");
    divContainer.innerHTML = `<div class="other"><div class='name'>${message.username}</div><div class="text">${message.message}</div><div class='time'>${message.time}</div></div>`;
    messageContainer.appendChild(divContainer);
  } else if (type == "update") {
    const divContainer = document.createElement("div");
    divContainer.setAttribute("class", "update");
    if (checkUpdate == 0) {
      divContainer.innerHTML = `<p>${message} has joined the chat</p>`;
    } else if (checkUpdate == 1) {
      divContainer.innerHTML = `<p>${message} has left the chat</p>`;
    }
    messageContainer.appendChild(divContainer);
  }
  messageContainer.scrollTop = messageContainer.scrollHeight;
}
