$(document).ready(function() {
    var socket = io.connect('http://localhost:8100');
    var dataContainer = $('#data-container');

    var submitButton = $('#submit');

    function logStr(eventStr, msg) {
        console.log(eventStr + ':: ' + msg);
    }

    socket.on('connect', function () {
        submitButton.on('click', function () {
            var serverName = $('input[name="server"]').val(),
                formattedDate = $('input[name="date"]').val(),
                webappName = $('input[name="webapp"]').val(),
                catalinaLog = "";
            if ($('input[name="catalina-log"]').is(':checked')) {
                catalinaLog = "yes";
            } else {
                catalinaLog = "no";
            }
            socket.emit('client-message', {server: serverName, date: formattedDate, webapp: webappName, catalina: catalinaLog});
            logStr('Sent', 'Params are ' + serverName + ', ' + catalinaLog + '.');
        });
    });

    socket.on('server-status', function(data) {
        dataContainer.append('<div class="statusMsg">' + data.statusMsg + '</div>');
    });

    socket.on('server-error', function(data) {
        dataContainer.append('<div class="errMsg">' + data.errMsg + '</div>');
    });

    socket.on('server-data', function(data) {
        dataContainer.empty().append('<div class="logMsg">' + data.logData + '</div>');
    });
});