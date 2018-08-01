/* eslint-disable no-console */
const fetch = require('node-fetch-json');
const fs = require('fs');
const queue = require('queue');

const q = queue();
q.concurrency = 2;
q.timeout = 5000;

q.on('timeout', (next, job) => {
	console.log('job timed out:', job.toString().replace(/\n/g, ''));
	next();
});

const MONSTERS_API = 'http://www.dnd5eapi.co/api/monsters/';

fetch(MONSTERS_API).then((json) => {
	fs.writeFileSync(
		'src/api/monsters.json',
		JSON.stringify(json)
			.replace('http://www.dnd5eapi.co/api/monsters/', ''),
	);

	console.log('Monster count: ', json.count);

	json.results.forEach((monster) => {
		q.push((cb) => {
			return new Promise(((resolve, reject) => {
				console.log(`Fetching: ${monster.url}`);
				fetch(monster.url)
					.then((monsterData) => {
						fs.writeFileSync(`src/api/monsters/${monsterData.index}.json`, JSON.stringify(monsterData));
						console.log(`Done: ${monsterData.name}`);
						resolve();
					})
					.catch((e) => {
						console.log('Error: ', e);
						reject();
					});
			}));
		})
	});

	q.start((err) => {
		if (err) throw err;
		console.log('All done');
	});
})
