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
        socket.join(room.roomName);
        let pres = false;
        rooms.forEach(roomObject => {
            if (roomObject.name === room.roomName) {
                pres = true;    
            }
        });
        if (!pres) {
            let roomObject = {
                name: room.roomName,
                participants: [room.call]
            }
            rooms.push(roomObject);
        } else {
            let p;
            rooms.forEach(roomObject => {
                if (roomObject.name === room.roomName) {
                    p = roomObject.participants;
                    p.push(room.call);    
                }
            });
            rooms.push(p);
        }
        io.sockets.in(roomObject.name).emit('p', roomObject.participants);
    });    

    socket.on('msg', (msg) => {
        io.sockets.in(msg.room).emit('msg', msg.msg);
    });

    socket.on('disconnect', () => {
        console.log('someone disconnected');
    });
});