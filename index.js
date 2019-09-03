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
let rooms = [];

io.on('connection', (socket) => {
    console.log('someone connected');

    socket.on('create', (room) => {
        socket.join(room);
        rooms.push(room);
        io.emit('getUsers', room);
        console.log(room);
    });    

    socket.on('#msg', (msg) => {
        console.log(msg.msg);
        console.log(msg.room);
        io.sockets.in(msg.room).emit(msg.msg);
    });

    socket.on('getUsers', (roomName) => {
        io.of('/').in(roomName).clients((err, data) => {
            io.emit('#users', data);
        });
    })

    socket.on('disconnect', () => {
        console.log('someone disconnected');
    });
});