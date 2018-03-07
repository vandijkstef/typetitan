// App settings
const settings = {
	debug: true,
	flow: true,
	dictionaries: [
		{
			label: 'English large',
			file: 'en_full'
		},
		{
			label: 'Test small',
			file: 'en'
		}
	],
	gameModes: [
		{
			label: 'All the words! Finish the complete dictionary',
			file: 'all'
		},
		{
			label: `Rush! Do XX words as quick as possible`,
			file: 'rush'
		}
	],
};

export default settings;