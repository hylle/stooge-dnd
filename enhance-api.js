const fs = require('fs');
const uniqueId = require('lodash/uniqueId');

const data = JSON.parse(fs.readFileSync('src/api/srd-monsters.json'));

const enhancedData = data.map((monster) => {
	return {
		id: uniqueId('m'),
		...monster,
	};
});

fs.writeFileSync(
	'src/api/enhanced-monsters.json',
	JSON.stringify(enhancedData),
);
