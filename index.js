const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));

//static serving
app.use(express.static(path.join(__dirname, 'dist')));

//manual catch all
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

const server = app.listen(process.env.PORT || 8080);

const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('someone connected');

    socket.on('create', (room) => {
        socket.join(room.roomName);

        var clients = io.sockets.adapter.rooms[room.roomName].sockets;

        //to get the number of clients
        //let numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;

        let names = [];
        for (let clientId in clients) {
            //this is the socket of each client in the room.
            let clientSocket = io.sockets.connected[clientId];
            names.push(clientSocket.name);
        }
        console.log(names);

        io.sockets.in(room.roomName).emit('p', names);
    });

    socket.on('msg', (msg) => {
        io.sockets.in(msg.room).emit('msg', msg.msg);
    });

    socket.on('disconnect', () => {
        console.log('someone disconnected');
    });
});