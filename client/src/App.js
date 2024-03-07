// App.js
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  //const [userId, setUserId] = useState('user123'); // You can set the user ID dynamically based on authentication

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending request to server...');
      const res = await axios.post('http://localhost:5000/chat', {  question });
      console.log('Response received:', res.data.message);
      setResponse(res.data.message);
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred while processing your request');
    }
    setQuestion('');
  };

  return (
    <div className="App">
      <h1>Chat with ChatGPT</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
      {response && <div className="response">{response}</div>}
    </div>
  );
};

export default App;
