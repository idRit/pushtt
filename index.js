const express = require('express');
const path = require('path');

const app = express();

//static serving
app.use(express.static(path.join(__dirname, 'dist')));

//manual catch all
app.get('*', function (req, res) {
  res.sendFile(__dirname + '/dist/index.html');
});

let rooms = [];

app.get('/api/joinRooms', async (req, res) => {

});

app.post('/api/createRoom', async (req,res) => {
    
});

app.get()

const server = app.listen(process.env.PORT || 8080);

const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('someone connected');
    


    socket.on('disconnect', () => {
        console.log('someone disconnected');
    });
});