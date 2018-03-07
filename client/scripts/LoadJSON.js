import API from './API.js';

class LoadJSON extends API {
	constructor() {
		super('/client/');
	}

	Dict(fileName, callback) {
		this.callCallback(null, `/dicts/${fileName}.json`, function(data) {
			callback(data);
		});
	}
}

export default LoadJSON;