var socket = io('http://10.142.239.91:3000');
socket.on('message-from-server', function (evt) {
    $("#msg").html(evt.greeting);
});
socket.emit("message-from-client", {
    greeting: 'Hello from Client'
});
socket.on('chat-to-client', function (evt) {
    let append = '<br/> <li class="other"> <div class="msg"> <div class="user">' + evt.username + '</div> <p>' + evt.text + '</p> <time>' + $.format.date(evt.time, 'hh:mm:ss a') + '</time> </div> </li>';
    $(".chat").append(append);
});
socket.on('change-user-count', function (evt) {
    if(evt.count === 1){
        $('#members').html('You alone are online');
    }else{
        $('#members').html(evt.users + " are chatting");
    }
});

var username = "";
$("#chatForm").submit(function (event) {
    let chatText = $('#chatText').val();
    socket.emit("chat-to-server", {
        text: $('#chatText').val(),
        time: $.now()
    });
    let append = '<br/> <li class="self"> <div class="msg"> <div class="user">' + username + '</div> <p>' + chatText + '</p> <time>'+ $.format.date($.now(), 'hh:mm:ss a') +'</time> </div> </li>';
    $(".chat").append(append);
    $('#chatText').val('');
    $('#chatText').focus();
    event.preventDefault();
});
$('#username_form').submit(function (event) {
    $('#login-modal').modal('hide');
    username = $('#username_entry').val();
    if(username === ""){
       getUserName();
    }else{
        $('#login-modal').modal('hide');
        socket.emit('new-user', {
            username: username
        });
    }
    event.preventDefault();
});
$(document).ready(function() {
    getUserName();
});
var getUserName = function () {
    $('#login-modal').modal({backdrop: 'static', keyboard: false});
    $('#login-modal').modal('show');
    $('#login-modal').on('shown.bs.modal', function() {
        $("#username_entry").focus();
    });
};