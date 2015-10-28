var Connection = require('ssh2');

module.exports = function(serverHost, logRemotePath, socket) {
	
	// Instantiate ssh2
	var c = new Connection();

	// Username and password for access to server
	c.connect({
		host: serverHost,
		port: 22,
		username: 'foo',
		password: 'bar'
	});

	c.on('connect', function() {
		console.log('Connection :: connect');
	});

	c.on('ready', function() {
		console.log('Connection :: ready');
		c.sftp(function(err, sftp) {
			if (err) throw err;
			sftp.on('end', function() {
				console.log('SFTP :: SFTP session closed');
			});
			
			// Read the log file
			sftp.readFile(logRemotePath, 'utf8', function(err, data) {
				socket.emit('server-status', {statusMsg: 'Retrieving log file...'});
				var handle = new Buffer(1);
				// Error handling
				if (err || data === false) {
					sftp.close(handle, function(err) {
						socket.emit('server-status', {statusMsg: 'Error: failed to retrieve log file.'});
						console.log('SFTP :: Handle closed due to error');
						console.log(err);
						sftp.end();
				  	});
				} else {
					// Stream log data to client
					var mylog = '<pre>' + data + '</pre>';
					socket.emit('server-data', {logData: mylog});
					c.end();
				}
				return;
			});
			
		});
	});

	c.on('error', function(err) {
		console.log('Connection :: error :: ' + err);
	});

	c.on('end', function() {
		console.log('Connection :: end');
	});

	c.on('close', function(had_error) {
		console.log('Connection :: close');
	});

};