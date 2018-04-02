(function () {
	'use strict'; // This ain't a module right now TODO: Create browerified ES6

	/// VARIABLES ///
	var gameDivs, form;
	var currentWord = 0;
	var ws;
	
	/// INIT ///
	if ('addEventListener' in document) {
		document.addEventListener('DOMContentLoaded', function() {
			document.body.classList.add('js');
			if ('querySelector' in document.body) {
				if ('localStorage' in window) {
					PersistantGameOptions();
				}
				if ('classList' in document.body) {
					document.body.classList.add('rich');
					SetGame();
					GameSocket();
				}
			}
		});
	}

	/// JS ENABLED GAME ///
	var SetGame = function() {
		var game = document.querySelector('#main.game');
		if (game) {
			form = document.querySelector('form[action="/game"]');
			if (form) {
				gameDivs = form.querySelectorAll('div');
				if (gameDivs) {
					for (var i = 0; i < gameDivs.length; i++) {
						// TODO: Expand labels into span per letter
						var input = gameDivs[i].querySelector('input');
						input.addEventListener('keydown', TestField);
						input.addEventListener('keyup', LateTestField);
						SpanText(gameDivs[i].querySelector('label'));
					}
					StageNextWord(currentWord);
					var submit = document.querySelector('input[type=submit]');
					submit.classList.add('hidden');
					form.addEventListener('submit', function(e) {
						e.preventDefault();
					});
				}
			} else {
				console.warn('Game form element not found');
			}
		}
	};

	// Stage the next word
	var StageNextWord = function(index) {
		// Submit the game if there are no more words
		if (index === gameDivs.length) {
			form.submit();
			return;
		}
		// Swap to the next word
		for (var i = 0; i < gameDivs.length; i++) {
			gameDivs[i].classList.add('hidden');
		}
		gameDivs[index].classList.remove('hidden');
		gameDivs[index].querySelector('input').focus();
	};

	var SpanText = function(label) {
		if (label) {
			var textArray = label.innerText.split('');
			label.innerHTML = '';
			for (var i = 0; i < textArray.length; i++) {
				label.innerHTML += '<span>' + textArray[i] + '</span>';
			}
		} else {
			console.warn('SpanText: No label');
		}
	};

	// Fired on every keyUp on the textfield
	var TestField = function(e) {
		var answer = document.querySelector('label[for=' + e.target.id + ']');
		if (UpdateInput(answer, e)) {
			console.log('correct input');
		} else {
			console.log('preventing');
			e.preventDefault();
		}
		
	};
	
	var LateTestField = function(e) {
		var answer = document.querySelector('label[for=' + e.target.id + ']');
		if (answer.innerText === e.target.value) {
			currentWord++;
			StageNextWord(currentWord);
		}
	};

	// Update the styling of individual letters
	// Also, Do something with score
	var UpdateInput = function(answer, e) {
		// TODO: Update coloring of label (answer)
		var value = e.target.value; // Form field total value
		var curIndex = value.length;
		var lastInput = e.key; // TODO: What is the key input?

		// TODO: How about hooking up scoring here?
		// console.log('UpdateInput:', e, answer.innerText, value, lastInput, curIndex);

		if (answer.innerText[curIndex] === lastInput) {
			return true;
		} else {
			return false;
		}
	};

	/// Caching / Persistance ///

	// Cache the game options / reset them
	var PersistantGameOptions = function() {
		var menu = document.querySelector('#main.menu');
		if (menu) {
			form = document.querySelector('form[action="/"]');
			if (form) {
				var playerName = form.querySelector('[name=playerName]');
				if (localStorage.getItem('playerName')) {
					playerName.value = localStorage.getItem('playerName');
				}
				form.addEventListener('submit', function(e) {
					var playerName = e.target.querySelector('[name=playerName]');
					localStorage.setItem('playerName', playerName.value);
				});
			} else {
				console.warn('Menu form element not found');
			}
		}
	};

	/// WEBSOCKET ///
	// Add Websocket to the game
	var GameSocket = function() {
		if ('WebSocket' in window) {
			document.body.classList.add('websocket');
			ws = new WebSocket('ws://' + window.location.hostname + ':13375');
			ws.onopen = function() {
				// TODO: Decide what is the current page
				// TODO: If game or postgame: setup listening to updates
				// TODO: Get Game ID
				ws.send(GameSocketMessages.hi());
				if (document.querySelector('section#main.postgame')) {
					ws.send(GameSocketMessages.pollScore()); // TODO: Send this on postgame, along with the gameID and show other players score lists
				}
			};
			ws.onmessage = function(e) {
				console.log(e.data);
			};
		}
	};

	var GameSocketMessages = {
		sessionID: function() {
			return 'we get this from our headers';
		},
		hi: function() {
			return 'Hi Mr. Server';
		},
		pollScore: function() {
			return 'wantScores';
		}
	};

}());