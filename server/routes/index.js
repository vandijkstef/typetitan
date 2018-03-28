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

router.post('/', (req, res) => {
	TypeTitan.Create.Game(req.body.dict, req.body.mode, req.body.modifier, (gameID) => {
		gameID = gameID.replace('g-', '');
		res.redirect(`/game/${gameID}`);
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

module.exports = router;
