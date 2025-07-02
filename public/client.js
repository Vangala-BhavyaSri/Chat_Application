const socket = io();
let myId = Math.random().toString(36).substring(2, 10); // Temporary user ID

function sendMessage() {
  const msg = document.getElementById('message').value;
  if (!msg.trim()) return;
  socket.emit('chatMessage', { id: myId, text: msg });
  document.getElementById('message').value = '';
}

socket.on('chatMessage', ({ id, text }) => {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message');
  if (id === myId) msgDiv.classList.add('self');
  msgDiv.textContent = text;
  document.getElementById('messages').appendChild(msgDiv);
  scrollToBottom();
});

socket.on('imageMessage', ({ id, imageUrl }) => {
  const img = document.createElement('img');
  const wrapper = document.createElement('div');
  wrapper.classList.add('message');
  if (id === myId) wrapper.classList.add('self');
  img.src = imageUrl;
  wrapper.appendChild(img);
  document.getElementById('messages').appendChild(wrapper);
  scrollToBottom();
});

document.getElementById('imageInput').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append('image', file);

  fetch('/upload', {
    method: 'POST',
    body: formData
  }).then(res => res.json())
    .then(data => {
      socket.emit('imageMessage', { id: myId, imageUrl: data.imageUrl });
    });
});

function scrollToBottom() {
  const messages = document.getElementById('messages');
  messages.scrollTop = messages.scrollHeight;
}

