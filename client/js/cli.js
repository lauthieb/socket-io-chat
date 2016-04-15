var socket = io.connect('http://localhost:1337');
var msgtpl = $('#msgtpl').html();
$('#msgtpl').remove();

/* Emit events */
$('#loginform').submit(function (event) {
    event.preventDefault(); // Not submit the form

    socket.emit('login', {
        username: $('#username').val(),
        email: $('#email').val()
    });
});

$('#form').submit(function(event) {
    event.preventDefault(); // Not submit the form

    socket.emit('newmsg', {
        message: $('#message').val()
    });
    
    $('#message').val('');
    $('#message').focus();
});


/* Listen events */
socket.on('logged', function() {
    $('#login').fadeOut();
    $('#message').focus();
});

socket.on('newuser', function(user) {
    $('#users').append('<img src="' + user.avatar + '" id="' + user.id + '">');
});

socket.on('newmsg', function(message) {
    $('#messages').append('<div class="message">' + Mustache.render(msgtpl, message) + '</div>');
    $('#messages').animate({scrollTop: $('#messages').prop('scrollHeight')}, 50); // Scroll bottom
});

socket.on('disuser', function(user) {
    $('#' + user.id).remove();
});