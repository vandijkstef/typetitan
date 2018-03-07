import debug from './debug.js';
import LoadJSON from './LoadJSON.js';
import appDataHelper from './appDataHelper.js';
import Word from './Word.js';
import UI from '../UItools/UItools.js';
import settings from './settings.js';

class TypeTitan {
	constructor() {
		debug.flow(this.constructor.name, 'Constructor', 'init');
		this.timers = {
			appLoad: window.performance.now(),
			word: window.performance.now(),
			tick: window.performance.now()
		};
		this.appData = appDataHelper.fetch();
		console.log(this.appData);
		this.gameData = new GameData();
		this.CreateMainMenu();
		this.CreateSettings();
		this.DoKey();
	}

	GetDict(dict, mode, callback) {
		new LoadJSON().Dict(dict, (data) => {
			debug.flow(this.constructor.name, 'Constructor', 'Got Dict');

			data.forEach((word) => {
				const newWord = new Word(word);
				this.appData.dicts.full.push(newWord);
			});
			this.RefreshDict();
			callback();
		});
	}

	RefreshDict() {
		this.appData.dicts.remaining = [];
		this.appData.dicts.used = [];
		this.appData.dicts.full.forEach((word) => {
			const copy = Object.assign({}, word);
			this.appData.dicts.remaining.push(copy);
		});
	}

	SetWord() {
		this.timers.word = window.performance.now();
		debug.flow(this.constructor.name, 'SetWord', 'New word');
		const Word = this.GetWord();
		const wordArray = [];
		Word.word.forEach((letter) => {
			wordArray.push(UI.getText(letter, 'inactive', '', 'span'));
		});
		if (!this.appData.elements.word) {
			debug.flow(this.constructor.name, 'SetWord', 'Creating element');
			this.appData.elements.word = UI.createElement('', 'word', 'p');
			UI.render(this.appData.elements.word, document.body);
		}
		this.appData.elements.word.innerHTML = null;
		UI.render(wordArray, this.appData.elements.word);
		this.SetActiveLetter();
	}

	GetWord() {
		const index = Math.floor(Math.random() * this.appData.dicts.remaining.length);
		const newWord = this.appData.dicts.remaining.splice(index, 1);
		this.appData.dicts.used.push(Object.assign({}, newWord));
		if (newWord.length === 0) {
			this.EndGame('dict_empty');
			// console.warn('empty dict');
			// return new Word(['empty dictionary']);
		} else {
			console.log(newWord, this.appData.dicts);
			return newWord[0];
		}
	}

	SetActiveLetter() {
		const letter = this.NextLetter();
		if (!letter) {
			this.gameData.ScoreWord();
			if (this.gameMode === 'rush' && this.gameData.wordCount === settings.rushSize) {
				this.EndGame('rush_complete');
			} else {
				const wordTime = this.GetTime(this.timers.word);
				console.log(wordTime);
				this.SetWord();
			}
		} else {
			letter.classList.remove('inactive');
			letter.classList.add('current');
		}
	}

	CurrentLetter() {
		const current = this.appData.elements.word.querySelector('.current');
		return current;
	}

	NextLetter() {
		const current = this.appData.elements.word.querySelector('.inactive');
		return current;
	}

	CorrectLetter(letter) {
		this.gameData.Score();
		letter.classList.remove('current');
		letter.classList.add('correct');
		this.SetActiveLetter();
	}

	ErrorLetter(letter) {
		this.gameData.Error();
		letter.classList.add('error');
		setTimeout(() => {
			letter.classList.remove('error');
		}, 500);
	}

	DoKey() {
		document.addEventListener('keypress', (e) => {
			const keyTime = this.GetTime(this.timers.tick);
			this.timers.tick = window.performance.now();
			console.log('keytime', keyTime);
			if (this.appData.elements.word !== undefined) {
				if (this.CurrentLetter().innerText === e.key) {
					this.CorrectLetter(this.CurrentLetter());
				} else {
					this.ErrorLetter(this.CurrentLetter());
				}
			}
		});
	}

	CreateMainMenu() {
		const content = [];
		const title = UI.getText('TypeTitan', '', '', 'h1');
		// const dictSelect = UI.getSelect('dict', settings.dictionaries);
		const dictSelect = UI.getInput(UI.getLabel('Dictionary'), 'select', 'dict', settings.dictionaries);
		const gameMode = UI.getInput(UI.getLabel('Gamemode'), 'select', 'gamemode', settings.gameModes);
		const startGame = UI.getLink('Start game', '/', 'button', 'start');

		UI.addHandler(startGame, (e) => {
			e.preventDefault();
			this.appData.elements.mainMenu.style.display = 'none';
			this.StartGame();
		});

		content.push(title);
		content.push(dictSelect);
		content.push(gameMode);
		content.push(startGame);

		this.appData.elements.mainMenu = UI.renderIn(content, document.body, 'menu', 'main', 'section').querySelector('#main');
	}

	CreateSettings() {

	}

	CreateScorePanel() {
		const content = [];

		const pointsText = UI.getText('Score:');
		const pointsNumber = UI.getText(0);
		const points = UI.wrap([pointsText, pointsNumber]);
		content.push(points);

		const comboText = UI.getText('Combo:');
		const comboNumber = UI.getText(0);
		const combo = UI.wrap([comboText, comboNumber]);
		content.push(combo);

		const wordText = UI.getText('Words:');
		const wordNumber = UI.getText(0);
		const word = UI.wrap([wordText, wordNumber]);
		content.push(word);
		
		this.appData.elements.scorePanel = UI.renderIn(content, document.body, 'panel', 'score', 'section').querySelector('#score');
	}

	GetTime(timer) {
		return window.performance.now() - timer;
	}

	StartGame() {
		const dict = document.querySelector('[name=dict]').value;
		this.gameMode = document.querySelector('[name=gamemode]').value;
		this.GetDict(dict, this.gameMode, () => {
			console.log(this.GetTime(this.timers.appLoad));
			this.CreateScorePanel();
			this.SetWord();
		});
	}

	EndGame(type) {
		console.log('Game over', type);
		console.log(this.gameData);
		this.appData.gamesPlayed.push(this.gameData);
		appDataHelper.store(this.appData);
		this.appData.elements.word.style.display = 'none';
		const content = [];
		
		const endText = UI.getText('Game over');
		const restartGame = UI.getLink('Restart', '/', 'button', 'restart');

		UI.addHandler(restartGame, (e) => {
			e.preventDefault();
			location.reload();
		});

		content.push(endText);
		content.push(restartGame);

		this.appData.elements.gameOverPanel = UI.renderIn(content, document.body, 'panel', 'gameover', 'section').querySelector('#gameover');
	}

}

class GameData {
	constructor(scorePerTick = 10, comboPerTick = 0.1) {
		this.score = 0;
		this.combo = 0;
		this.letterCount = 0;
		this.totalLetterCount = 0;
		this.wordCount = 0;
		this.scorePerTick = scorePerTick;
		this.comboPerTick = comboPerTick;
	}

	Score() {
		this.combo += this.comboPerTick;
		this.combo = Math.round(this.combo * 10) / 10;
		this.score += this.scorePerTick * this.combo;
		this.letterCount++;
		this.Update();
	}

	ScoreWord() {
		this.wordCount++;
		this.totalLetterCount += this.letterCount;
		this.letterCount = 0;
		this.Update();
	}

	Error() {
		this.combo = 0;
		this.Update();
	}

	Update() {
		if (!this.scorePanel) {
			this.scorePanel = {
				panel: document.querySelector('#score'),
				score: document.querySelector('#score div:first-child p:last-child'),
				combo: document.querySelector('#score div:nth-of-type(2) p:last-child'),
				word: document.querySelector('#score div:last-child p:last-child')
			};
		}
		this.scorePanel.score.innerText = this.score;
		this.scorePanel.combo.innerText = this.combo;
		this.scorePanel.word.innerText = this.wordCount;
		console.log(this.scorePanel.score);

	}
}

document.addEventListener('DOMContentLoaded', function() {
	new TypeTitan();
});