var http = require('http');
var md5 = require('MD5');

var httpServer = http.createServer(function(req, res) {
    res.end('Hello World');
    console.log('Un utilisateur a chargé la page');
});

httpServer.listen(1337);

var io = require('socket.io').listen(httpServer);

// Capture all the connections
io.sockets.on('connection', function(socket) {
    console.log('New user connected');

    var person;

    socket.on('login', function(user) {
        person = user;
        person.id = user.email.replace('@', '-').replace('.', '-');
        person.avatar = 'https://gravatar.com/avatar/' + md5(user.email) + '?s=50';
        socket.broadcast.emit('newuser'); // Alert others about new user
    })
});