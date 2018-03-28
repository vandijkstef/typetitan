(function () {
	'use strict'; // This ain't a module right now

	var gameDivs, form;
	var currentWord = 0;
	var ws;
	
	if ('addEventListener' in document) {
		document.addEventListener('DOMContentLoaded', function() {
			if ('classList' in document.body && 'querySelector' in document.body) {
				document.body.classList.add('js');
				SetGame();
				if ('WebSocket' in window) {
					console.log('websocket');
					ws = new WebSocket('ws://localhost:13375');
					ws.onopen = function() {
						console.log('WS Connected');
						ws.send('Hi Mr. Server');
						ws.send('wantScores'); // TODO: Send this on postgame, along with the gameID and show other players score lists
					};
		
					ws.onmessage = function(e) {
						console.log(e.data);
					};
				}
			}
		});
	}

	var SetGame = function() {
		form = document.querySelector('form[action="/game"]');
		if (form) {
			gameDivs = form.querySelectorAll('div');
			if (gameDivs) {
				for (var i = 0; i < gameDivs.length; i++) {
					var input = gameDivs[i].querySelector('input');
					input.addEventListener('keyup', TestField);
				}
				SetWord(currentWord);
				var submit = document.querySelector('input[type=submit]');
				submit.classList.add('hidden');
				form.addEventListener('submit', function(e) {
					e.preventDefault();
				});
			}
		}
	};

	var SetWord = function(index) {
		if (index === gameDivs.length) {
			form.submit();
			return;
		}
		for (var i = 0; i < gameDivs.length; i++) {
			gameDivs[i].classList.add('hidden');
		}
		gameDivs[index].classList.remove('hidden');
		gameDivs[index].querySelector('input').focus();
	};

	var TestField = function(e) {
		// TODO: Test individual letters
		var answer = document.querySelector('label[for=' + e.target.id + ']').innerText;
		if (answer === e.target.value) {
			currentWord++;
			SetWord(currentWord);
		}
	};

}());