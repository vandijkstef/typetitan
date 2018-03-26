const express = require('express');
const router = express.Router();
const TypeTitan = require('../scripts/TypeTitan.js');

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
	// console.log(req.body);
	// GetDict(req.body.dict)
	// GameMode(req.body.mode)
	// Modifief(req.body.modifier)
	TypeTitan.Create.Game(req.body.dict, req.body.mode, req.body.modifier, (gameID) => {
		console.log(gameID);
		res.send('done');
	});
});

router.get('/game', (req, res) => {
	res.redirect('/');
});

router.get('/game/:id', (req, res) => {
	TypeTitan.Get.Dict('en', (data) => {
		console.log(data);
		res.render('game.ejs', {
			data: 'TypeTitans Game'
		});
	});
});

module.exports = router;
