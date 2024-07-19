const { log } = require('console')
const { Socket } = require('socket.io')

const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {cors: { 
    origin: '*', // Permitir qualquer origem durante o desenvolvimento
    methods: ["GET", "POST"]
} })

const PORT = process.env.PORT || 3001

io.on('connection', socket => {
    console.log('Usuário conectado!', socket.id)

    socket.on('disconnect', reason => {
        console.log('Usuário desconectado!', socket.id)
    })

    socket.on('set_username', username => {
        socket.data.username = username
        console.log(socket.data.username)
    })

    socket.on('message', ({ text, location }) => {
        io.emit('receive_message', {
            text,
            authorId: socket.id,
            author: socket.data.username,
            location
        });
    });
})

server.listen(PORT,() =>  console.log('Server runing...'))
