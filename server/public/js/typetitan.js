(function () {
	'use strict'; // This ain't a module right now

	var gameDivs, form;
	var currentWord = 0;

	if ('addEventListener' in document) {
		document.addEventListener('DOMContentLoaded', function() {
			if ('classList' in document.body && 'querySelector' in document.body) {
				document.body.classList.add('js');
				SetGame();
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