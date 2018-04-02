const ws = require('ws').Server;

// Setup websocket
const wss = new ws({port: 13375});
wss.on('connection', (ws, req) => {

	// Fetch connection session ID
	const value = '; ' + req.headers.cookie;
	const parts = value.split('; ' + 'connect.sid' + '=');
	const sessionID = parts.pop().split(';').shift();
	console.log(sessionID); 
	
	ws.on('message', (message) => {
		console.log('received:', message);
		if (message === 'wantScores') {
			ws.send('heres some scores');
		}
	});
});

module.exports = wss;