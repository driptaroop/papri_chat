//SOCKET IO START
var socket = io('http://localhost:3000');
socket.on('message-from-server', function (evt) {
    $("#msg").html(evt.greeting);
});
socket.emit("message-from-client", {
    greeting: 'Hello from Client'
});
socket.on('chat-to-client', function (evt) {
    appendToChat({
        user: 'other',
        username: evt.username,
        text: evt.text,
        time: evt.time
    });
});
socket.on('change-user-count', function (evt) {
    if(evt.count === 1){
        $('#members').html('You alone are online');
    }else{
        $('#members').html(evt.users + " are chatting");
    }
});
//SOCKET IO END

//JQUERY START
var username = "";
emojione.ascii = true;
$(document).ready(function() {
    getUserName();
    $("#chatForm").submit(function (event) {
        let chatText = $('#chatText').val();
        if (chatText.trim() !== '') {
            let now = $.now();
            socket.emit("chat-to-server", {
                text: $('#chatText').val(),
                time: now
            });
            appendToChat({
                user: 'self',
                username: username,
                text: chatText,
                time: now
            });
            $('#chatText').val('');
            $('#chatText').focus();
        }
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
});

var getUserName = function () {
    $('#login-modal').modal({backdrop: 'static', keyboard: false});
    $('#login-modal').modal('show');
    $('#login-modal').on('shown.bs.modal', function() {
        $("#username_entry").focus();
    });
};
let appendToChat = function (details) {
    let append = '<br/> <li class="' + details.user + '"> <div class="msg"> <div class="user">' + details.username + '</div> <p> ' + details.text + ' </p> <time>'+ $.format.date(details.time, 'hh:mm:ss a') +'</time> </div> </li>';
    $(makeEmoji(append)).hide().appendTo('#chatArea').fadeIn(500);
    goToEndOfChat();
};
let goToEndOfChat = function () {
    window.scrollTo(0,document.body.scrollHeight);
    //$('.chat').animate({scrollTop: $('.chat li:last-child').offset().top + 30});
};
let makeEmoji = function (innerHtml) {
    return emojione.toImage(innerHtml);
}
//JQUERY END