import without from 'lodash/without';
import sample from 'lodash/sample';

let usedAffixes = [];
const affixes = [
	'grumpy',
	'happy',
	'sleepy',
	'dopey',
	'bashful',
	'sneezy',
	'wimpy',
	'large nose',
	'large ears',
	'pointy ears',
	'bald',
	'beautiful',
	'scarred',
	'one eyed',
	'strong',
	'burly',
	'shaggy',
	'bearded',
	'moustached',
	'short',
	'tall',
	'bejeweled',
	'nice',
	'foul',
	'foul-mouthed',
	'snickering',
	'sad',
	'angry',
	'swift',
	'mad',
	'poor',
	'colorful',
	'ugly',
	'smelly',
	'limps',
];
function resetAffix() {
	usedAffixes = [];
}
function getAffix() {
	const affix = sample(without(affixes, ...usedAffixes));
	// console.log(usedAffixes);
	usedAffixes.push(affix);
	return affix;
}

export { getAffix, resetAffix };
