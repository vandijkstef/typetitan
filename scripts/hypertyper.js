import debug from './debug.js';
import LoadJSON from './LoadJSON.js';
import appDataHelper from './appDataHelper.js';
import Word from './Word.js';
import UI from './UItools.js';

class HyperTyper {
	constructor() {
		debug.flow(this.constructor.name, 'Constructor', 'init');
		this.timers = {
			appLoad: window.performance.now(),
			word: window.performance.now(),
			tick: window.performance.now()
			// appLoad: window.performance.now(),
			// appLoad: window.performance.now(),
			// appLoad: window.performance.now(),

		};
		this.appData = appDataHelper.fetch();
		this.CreateMainMenu();
		this.CreateSettings();
		this.DoKey();
		this.GetDict('en', () => {
			console.log(this.GetTime(this.timers.appLoad));
			this.timers.appLoad = window.performance.now();
			this.GetTime(this.timers.appLoad);
		});
	}

	GetDict(dict, callback) {
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
			console.warn('empty dict');
			return new Word(['empty dictionary']);
		} else {
			console.log(newWord, this.appData.dicts);
			return newWord[0];
		}
	}

	SetActiveLetter() {
		const letter = this.NextLetter();
		if (!letter) {
			this.SetWord();
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
		letter.classList.remove('current');
		letter.classList.add('correct');
		this.SetActiveLetter();
	}

	ErrorLetter(letter) {
		letter.classList.add('error');
		setTimeout(() => {
			letter.classList.remove('error');
		}, 500);
	}

	DoKey() {
		document.addEventListener('keypress', (e) => {
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
		content.push(UI.getText('HyperTyper', '', '', 'h1'));
		const startGame = UI.getLink('Start game', '/', 'button', 'start');
		UI.addHandler(startGame, (e) => {
			console.log(e);
			e.preventDefault();
			this.appData.elements.mainMenu.style.display = 'none';
			this.SetWord();
		});
		content.push(startGame);

		this.appData.elements.mainMenu = UI.renderIn(content, document.body, 'menu', 'main', 'section').querySelector('#main');
	}

	CreateSettings() {

	}

	GetTime(timer) {
		return window.performance.now() - timer;
	}

}

document.addEventListener('DOMContentLoaded', function() {
	new HyperTyper();
});