const express = require('express');
const router = express.Router();
const TypeTitan = require('../scripts/TypeTitan.js');
const store = require('json-fs-store')('../server/cache');

router.get('/', (req, res) => {
	const dicts = TypeTitan.Get.Dicts();
	const gameModes = TypeTitan.Get.Modes();
	res.render('index.ejs', {
		data: 'TypeTitans',
		dicts: dicts,
		gameModes: gameModes
	});
});

router.get('/game', (req, res) => {
	res.redirect('/');
});

router.get('/game/:id', (req, res) => {
	store.load(`g-${req.params.id}`, (err, data) => {
		if (err) {
			res.redirect('/');
		} else {
			res.render('game.ejs', {
				game: data
			});
		}
	});
});

// Submission of home page
// Creates a new game and brings you there
router.post('/', (req, res) => {
	TypeTitan.Create.Game(req.body.dict, req.body.mode, req.body.modifier, (gameID) => {
		gameID = gameID.replace('g-', '');
		res.redirect(`/game/${gameID}`);
	});
});

// Submission of game
// Checks your answers and stores data server-side
router.post('/game', (req, res) => {
	store.load(`${req.body.gameID}`, (err, gameData) => {
		const dict = gameData.dict;
		const stats = {
			right: 0,
			wrong: 0
		};
		for (let i = 0; i < dict.length; i++) {
			if (dict[i][0] === req.body['word-' + i]) {
				stats.right++;
			} else {
				stats.wrong++;
			}
		}
		// res.redirect('/game/:id/:player');
		res.render('postgame.ejs', {
			stats: stats
		});
	});
});

module.exports = router;
