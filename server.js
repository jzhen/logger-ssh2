/**
 * Require dependencies
 */
var express = require('express'),
	routes = require('./routes'),
	http = require('http'),
	path = require('path'),
	fs = require('fs'),
	streamHandler = require('./streamHandler');

/**
 * Create an express instance and set the port
 */
var app = express();
app.set('port', process.env.PORT || 8100);

/**
 * Start the server
 */
var server = http.createServer(app);

/**
 * Define templating engine
 */
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

/**
 * Set up express
 */
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('logger'));
app.use(express.session());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Development only
 */
if ('development' == app.get('env')) {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

/**
 * Define routes
 */
app.use(app.router);
app.get('/', routes.index);
app.get('/:page', routes.anypage);

/**
 * Initialize socket.io
 */
var io = require('socket.io').listen(server.listen(8100));

// Declare log variables to pass into ssh2
var serverHost = '', logRemotePath = '', rootPath = '/highwire/', tomcatLogPath = '/tomcat/logs/';

// Use submitted data from displaylog.js to retrieve logs
io.sockets.on('connection', function (socket) {
	socket.on('client-message', function (data) {
		if (data.server && data.date && data.webapp) {
			serverHost = data.server;
			var serverId = serverHost.substring(0, serverHost.indexOf('.'));
			console.log('Server host === ' + data.server + ', and server id === ' + serverId);
			console.log('Date string === ' + data.date);
			console.log('Webapp name === ' + data.webapp);
			console.log('Catalina option === ' + data.catalina);

			// Get remote log
			if (data.catalina === 'no') {
				logRemotePath = rootPath + serverId + tomcatLogPath + data.webapp + '/' + data.date + '.log';
			} else {
				logRemotePath = rootPath + serverId + tomcatLogPath + 'catalina.' + data.date + '.log';
			}

			// Invoke required module
			streamHandler(serverHost,logRemotePath, socket);
			
	  	} else {
			console.log('Missing parameter.');
			socket.emit('server-error', {errMsg: 'All fields are required except the Catalina checkbox.'});
	  	}
	});
});
