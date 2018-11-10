const RAINBOW =	'linear-gradient(to left, #e81123, #e81123 17%, #f7941d 17%, #f7941d 34%, #fff100 34%, #fff100 51%, #00a650 51%, #00a650 68%, #0054a5 68%, #0054a5 85%, #672d93 85%, #672d93)';
const colors = {
	blue: { main: 'blue', complement: '#fff' },
	red: { main: 'red', complement: '#fff' },
	green: { main: 'green', complement: '#fff' },
	gold: { main: 'gold', complement: '#fff' },
	silver: { main: 'silver', complement: '#fff' },
	black: { main: 'black', complement: '#fff' },
	brown: { main: '#4c270c', complement: '#fff' },
	zombie: { main: '#a6bd4f', complement: '#fff' },
	goblin: { main: '#41924B', complement: '#fff' },
	unicorn: { main: 'pink', complement: '#000', gradient: RAINBOW },
	blood: { main: '#8a0707', complement: '#fff' },
	copper: { main: '#b87333', complement: '#fff' },
	bronze: { main: '#cd7f32', complement: '#fff' },
	brass: { main: '#b5a642', complement: '#fff' },
};

const getColorsFromName = (name) => {
	const lcName = name.toLowerCase();
	const colorNames = Object.keys(colors);

	for (let index = 0; index < colorNames.length; index++) {
		const colorName = colorNames[index];
		if (lcName.indexOf(colorName) !== -1) {
			const styleObj = colors[colorName];
			if (styleObj && typeof styleObj === 'object') {
				return styleObj;
			}
		}
	}

	return {};
};

export default getColorsFromName;
