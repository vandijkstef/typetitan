class Word {
	constructor(string) {
		this.string = string;
		this.word = [];
		// console.log(string);
		for (var i = 0; i < string[0].length; i++) {
			this.word.push(string[0].charAt(i));
		}
	}
}

export default Word;