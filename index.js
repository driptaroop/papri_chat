let express = require('express');
let path = require('path');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let port = 3000;
let userMap = {};

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function (socket) {
    let username = "";
    console.log("connection established");
    socket.emit('message-from-server', {
        greeting: 'Welcome To Chat'
    });
    socket.on('message-from-client', function (msg) {
        console.log(msg.greeting);
    });
    socket.on('disconnect', function () {
       console.log(socket.id + " disconnected");
       delete userMap[socket.id];
       let activeUsers = getActiveUsers();
       io.sockets.emit('change-user-count', {
           users: activeUsers.join(','),
           count: activeUsers.length
        });
    });
    socket.on('new-user', function (user) {
        username = user.username;
        userMap[socket.id] = username;
        let activeUsers = getActiveUsers();
        io.sockets.emit('change-user-count', {
            users: activeUsers.join(','),
            count: activeUsers.length
        });
    });
    socket.on('chat-to-server', function (msg) {
        console.log(msg.text);
        socket.broadcast.emit('chat-to-client', {
            text: msg.text,
            time: msg.time,
            username: username
        });
    });
});

var getActiveUsers = function () {
    return (Object.keys(userMap).map(key => userMap[key]));
}

server.listen(port, function (request, response) {
   console.log("server started on " + port);
});