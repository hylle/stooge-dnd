const fs = require('fs');
const shortid = require('shortid');

const data = JSON.parse(fs.readFileSync('src/api/srd-monsters.json'));

const enhancedData = data.map((monster) => {
	return {
		id: shortid.generate('m'),
		...monster,
	};
});

fs.writeFileSync(
	'src/api/enhanced-monsters.json',
	JSON.stringify(enhancedData),
);
