document.addEventListener('DOMContentLoaded', () => {
  const messageList = document.querySelector('#message-list');

  const getMessages = () => {
    fetch('/messages', {
      headers: {'Content-Type': 'application/json'},
    })
      .then(response => {
        if (response.ok) return response.json();
      })
      .then(response => {
        messageList.innerHTML = '';
        for (const messageObject of response) {
          const messageContainer = document.createElement('div');
          messageContainer.setAttribute('id', messageObject._id);
          messageList.prepend(messageContainer);
          const messageText = document.createElement('li');
          messageText.innerText = messageObject.message;
          const deleteButton = document.createElement('button');
          deleteButton.setAttribute('class', 'del');
          deleteButton.innerText = 'Delete';
          deleteButton.addEventListener('click', () => {
            fetch('/messages', {
              method: 'DELETE',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({id: messageContainer.id}),
            })
              .then(response => {
                if (response.ok) getMessages();
              })
              .catch(err => console.log(err));
          });
          messageContainer.appendChild(messageText);
          messageContainer.appendChild(deleteButton);
        }
      })
      .catch(err => console.log(err));
  };

  getMessages();

  setInterval(getMessages, 2000);

  const saveButton = document.querySelector('#save');
  const passworldField = document.querySelector('#pass');
  const messageField = document.querySelector('#desc');

  saveButton.addEventListener('click', () => {
    if (messageField.value && passworldField.value) {
      fetch('/messages', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: messageField.value, password: passworldField.value}),
      })
        .then(response => {
          if (response.ok) getMessages();
        })
        .catch(err => console.log(err));
    }
  });
  
});