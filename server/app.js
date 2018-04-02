const path = require('path');

const express = require('express');
const eSession = require('express-session');
const FileStore = require('session-file-store')(eSession);
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// var favicon = require('serve-favicon');

// Require our websocket. This will setup the websocket on it's own
require('./socket.js');

// Setup App
const app = express();

// Add session support
const session = eSession({
	secret: 'hAF38J5ja',
	store: new FileStore(),
	saveUninitialized: true,
	resave: false
});
app.use(session);

// Enable GZIP
app.use(compression());

// Enable form data and cookies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); // uncomment after placing your favicon in /public

// Require all routes
const routes = {
	index: require('./routes/index')
};
app.use('/', routes.index);

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
