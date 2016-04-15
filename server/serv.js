var http = require('http');
var md5 = require('MD5');

var httpServer = http.createServer(function(req, res) {
    res.end('Hello World');
    console.log('Un utilisateur a chargé la page');
});

httpServer.listen(1337);

var io = require('socket.io').listen(httpServer);
var users = [];
var messages = [];
var HISTORY = 2;

// Capture all the connections
io.sockets.on('connection', function(socket) {
    var person = null;
    console.log('New user connected');

    for (var k in users) {
        socket.emit('newuser', users[k]);
    }

    for (var k in messages) {
        socket.emit('newmsg', messages[k]);
    }

    socket.on('login', function(user) {
        person = user;
        person.id = md5(user.email);
        person.avatar = 'https://gravatar.com/avatar/' + md5(user.email) + '?s=50';
        users[person.id] = person;
        // socket.broadcast.emit('newuser'); Alert others about new user
        io.sockets.emit('newuser', person); // Alert all the sockets
        socket.emit('logged');
    });

    socket.on('newmsg', function(message) {
        message.user = person;
        date = new Date();
        message.hours = date.getHours();
        message.minutes = date.getMinutes();
        messages.push(message);
        if (messages.length > HISTORY) {
            messages.shift();
        }
        io.sockets.emit('newmsg', message);
    });

    socket.on('disconnect', function() {
        console.log('User disconnected');
        if(person != null) {
            delete users[person.id];
            io.sockets.emit('disuser', person);
        }
    });
});