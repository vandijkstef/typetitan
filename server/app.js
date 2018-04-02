const path = require('path');

const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const compression = require('compression');
const ws = require('ws').Server;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// var favicon = require('serve-favicon');

// Require all routes
const index = require('./routes/index');

// Setup websocket
const wss = new ws({port: 13375});
wss.on('connection', (ws, req) => {

	// Fetch connection session ID
	const value = '; ' + req.headers.cookie;
	const parts = value.split('; ' + 'connect.sid' + '=');
	const sessionID = parts.pop().split(';').shift();

	ws.on('message', (message) => {
		console.log('received', message);
		if (message === 'wantScores') {
			ws.send('heres some scores');
		}
	});
});
// Require our websocket. This will setup the websocket on it's own
require('./socket.js');

// Setup App
const app = express();

// Enable GZIP
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Add session support
app.use(session({
	secret: 'hAF38J5ja',
	store: new FileStore(),
	saveUninitialized: true,
	resave: false
}));

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); // uncomment after placing your favicon in /public

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
