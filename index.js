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

        var roster = io.sockets.clients(room.roomName);
        let x = [];

        console.log("roster: " + roster);

        // roster.forEach(function (client) {
        //     x.push(client.name);
        // });

        io.sockets.in(room.roomName).emit('p', x);
    });

    socket.on('msg', (msg) => {
        io.sockets.in(msg.room).emit('msg', msg.msg);
    });

    socket.on('disconnect', () => {
        console.log('someone disconnected');
    });
});