// App settings
const settings = {
	debug: true,
	flow: true,
	dictionaries: [
		{
			label: 'English large',
			file: 'en_full'
		},
		// {
		// 	label: 'English small',
		// 	file: 'en'
		// }
	],
	gameModes: [
		// {
		// 	label: 'All the words! Finish the complete dictionary',
		// 	mode: 'all'
		// },
		{
			label: `Rush! Do XX words as quick as possible`,
			mode: 'rush',
			modifier: true
		}
	],
};

module.exports = settings;