import settings from './settings.js';

// Debug helper - Splits (temporary) console.logs from solid logs
const debug = {
	log: function(data, data2 = '') {
		if (settings.debug) {
			console.log(data, data2);
		}
	},
	warn: function(data) {
		console.warn(data);
	},
	flow: function(className, method, action) {
		if (settings.debug && settings.flow) {
			console.log('[Flow]', className, method, action);
		}
	}
};

export default debug;