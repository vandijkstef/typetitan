(function () {
'use strict'; // This ain't a module right now

	document.addEventListener('DOMContentLoaded', function() {
		if ('classList' in document.body && 'querySelector' in document.body) {
			document.body.classList.add('js');
		}
	});

}());