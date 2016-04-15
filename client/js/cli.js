var socket = io.connect('http://localhost:1337');

$('#loginform').submit(function (event) {
    event.preventDefault(); // Not submit the form

    socket.emit('login', {
        username: $('#username').val(),
        email: $('#email').val()
    });
});

socket.on('newuser', function() {
    alert('newuser received');
});