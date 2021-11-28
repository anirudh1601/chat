function escapeHTML (unsafe_str) {
    return unsafe_str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/\'/g, '&#39;')
    .replace(/\//g, '&#x2F;')
}
function scrollToBottom() {
    let objDiv = document.getElementById("chat-messages");
    objDiv.scrollTop = objDiv.scrollHeight;
}
scrollToBottom();

const roomName = JSON.parse(document.getElementById('json-roomname').textContent);
const user = JSON.parse(document.getElementById('json-username').textContent);

const socket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/'
    + roomName
    + '/room'
);

socket.onmessage = function(e) {
    console.log('onmessage');
    const data = JSON.parse(e.data);

    if (data.message) {
        document.querySelector('#chat-messages').innerHTML += escapeHTML( data.user + ':' + data.message + '\n' );
        document.querySelector('#user').innerHTML+=(data.user_presentation)
    } else {
         return 
    }

    scrollToBottom();
};

socket.onclose = function(e) {
    console.log('The socket close unexpectadly');
};

document.querySelector('#chat-message-submit').onclick = function(e) {
    const messageInputDom = document.querySelector('#chat-message-input');
    const message = messageInputDom.value;

    socket.send(JSON.stringify({
        'message': message,
        'user': user,
    }));

    messageInputDom.value = '';
};