const settings = require('./settings.js');
const fs = require('fs');
// const path = require('path');
const TypeTitan = {
	Get: {
		Dict: (file, callback) => {
			//`../public/dicts/${file}.json`
			var data = fs.readFileSync(`./public/dicts/${file}.json`, 'utf8');
			callback(data);
		},
		Dicts: () => {
			return settings.dictionaries;
		},
		Modes: () => {
			return settings.gameModes;
		}
	},
	Create: {
		Game: (mode, modifier) => {
			// console.log(mode, modifier);
			const game = {
				mode: mode,
				modifief: modifier,
				dict: []
			};
			return game;
		}
	}
};

module.exports = TypeTitan;