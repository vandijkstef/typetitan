import AppData from './AppData.js';
import debug from './debug.js';

const appDataHelper = {
	store: function(appData) {
		// Copy the appData into something we can work with without having it reflect in the actual appData
		let workData = Object.assign({}, appData);
		delete workData.dicts;
		delete workData.elements;
		debug.log('appDataHelper: Store', workData);
		localStorage.setItem('appData', JSON.stringify(workData));
	},
	fetch: function() {
		let appData = new AppData();
		if (localStorage.getItem('appData')) {
			const fetchedData = JSON.parse(localStorage.getItem('appData'));
			fetchedData.gamesPlayed.forEach(function(game) {
				appData.gamesPlayed.push(game);
			});
		}
		return appData;
	}
};

export default appDataHelper;