const settings = require('./settings.js');
const fs = require('fs');
const uniqid = require('uniqid');
const store = require('json-fs-store')('../server/cache');

const TypeTitan = {
	Get: {
		Dict: (options, callback) => {
			var data = fs.readFileSync(`./public/dicts/${options.file}.json`, 'utf8');
			data = JSON.parse(data);
			callback(data);
		},
		Dicts: () => {
			return settings.dictionaries;
		},
		Modes: () => {
			return settings.gameModes;
		},
		Word: (dict) => {
			const index = Math.floor(Math.random() * dict.length);
			const newWord = dict.splice(index, 1);
			return newWord[0];
		}
	},
	Create: {
		Game: (dict, mode, modifier, callback) => {
			const game = {
				id: 'g-' + uniqid(),
				settings: {
					dict: dict,
					mode: mode,
					modifier: modifier
				},
				dict: [],
				results: []
			};
			TypeTitan.Get.Dict({file: game.settings.dict}, (dict) => {
				let limit = game.settings.modifier || dict.length;
				if (limit > 50) {
					limit = 50;
				}
				for (let i = 0; i < limit; i++) {
					game.dict.push(TypeTitan.Get.Word(dict));
				}
				store.add(game, (err) => {
					if (err) {
						throw err;
					} else {
						callback(game.id);
					}
				});
			});
		}
	}
};

module.exports = TypeTitan;