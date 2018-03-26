const settings = require('./settings.js');
const fs = require('fs');
const uniqid = require('uniqid');
const store = require('json-fs-store')('../server/cache');

const TypeTitan = {
	Get: {
		Dict: (file, callback) => {
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
		Game: (dict, mode, modifier, callback) => {
			const game = {
				id: 'g-' + uniqid(),
				mode: mode,
				modifier: modifier,
				dict: [],
				results: []
			};
			store.add(game, (err) => {
				if (err) {
					throw err;
				} else {
					callback(game.id);
				}
			});
		}
	}
};

module.exports = TypeTitan;