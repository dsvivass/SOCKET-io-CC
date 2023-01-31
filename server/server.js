import express from 'express'
import morgan from 'morgan'
import { Server } from 'socket.io'
import { createServer } from 'http'
import cors from 'cors' 
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Initial config
const app = express() // Express server

const server = createServer(app) // HTTP server
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3001',
    }
}) // Socket.io server

// Middlewares
app.use(cors())
app.use(morgan('dev'))

io.on('connection', (socket) => {
    console.log('New connection', socket.id)

    socket.on('message', (data) => {
        socket.broadcast.emit('message', {
            body: data,
            from: socket.id
        }) // Send message to all clients except the sender
    })
})

server.listen(process.env.PORT , () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})