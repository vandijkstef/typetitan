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
	rushSize: 10,
	gameModes: [
		{
			label: 'All the words! Finish the complete dictionary',
			file: 'all'
		},
		{
			label: `Rush! Do 50 words as quick as possible`,
			file: 'rush'
		}
	],
};

export default settings;