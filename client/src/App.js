import { useEffect, useState } from 'react';
import './App.css';
import io from 'socket.io-client'

const socket = io('http://localhost:4000') // Connect to server

socket.on('connect', () => {
  console.log('Connected to server')
})

function App() {

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([{
    body: 'Welcome to the chat room',
    from: 'Admin'
  }])

  const handleChange = (e) => {
    setMessage(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('message', message)
    setMessage('')
    setMessages([...messages, {
      body: message,
      from: 'Me'
    }])
  }

  useEffect(() => {
    const receiveMessage = async (message) => {
      await setMessages([...messages, message])
    }

    socket.on('message', receiveMessage)

    return () => {
      socket.off('message', receiveMessage)
    }
  }, [messages])

  return (
    <div className="App">
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          value={message}
          type="text"
          placeholder="Username"
          onChange={(e) => handleChange(e)}
        />
        <button type="submit">Send</button>
      </form>

      {messages.map((message, index) => (
        <div key={index}>
          <p>{message.from}: {message.body}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
