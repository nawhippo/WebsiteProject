import React, { useEffect, useState } from 'react';

const getAllMessages = ({ userId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch(`api/${userId}/messages`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setMessages(data))
      .catch(error => console.error('Error fetching messages:', error));
  }, [userId]);

  return (
    <div>
      <h2>All Messages:</h2>
      {messages.length > 0 ? (
        <ul>
          {messages.map(message => (
            <li key={message.id}>
              <p>{message.content}</p>
              <p>Sender: {message.sender.name}</p>
              <p>Recipients: {message.recipients.map(user => user.name).join(', ')}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No messages found.</p>
      )}
    </div>
  );
};

export default getAllMessages;