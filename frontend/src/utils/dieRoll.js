import random from 'lodash/random';
import { calcModifier } from './statModifiers';

const dieRoll = (dieNotation = '', dieModifier = 0) => {
	const match = /^(\d+)?d(\d+)([+-]\d+)?$/.exec(dieNotation);
	if (!match) {
		throw new Error(`Invalid dice notation: ${dieNotation}`);
	}

	const howMany = typeof match[1] === 'undefined' ? 1 : parseInt(match[1], 10);
	const dieSize = parseInt(match[2], 10);
	const modifier = typeof match[3] === 'undefined' ? 0 : parseInt(match[3], 10);

	// console.log({
	// 	howMany,
	// 	dieSize,
	// 	dieModifier,
	// 	modifier,
	// });

	let rollSum = 0;
	for (let rollCount = 0; rollCount < howMany; rollCount++) {
		rollSum += random(1, dieSize) + dieModifier;
	}

	return rollSum + modifier;
};

const hitDieRoll = (dieNotation, constitution) => {
	const hitDieModifier = calcModifier(constitution);
	return dieRoll(dieNotation, hitDieModifier);
};

export { hitDieRoll, dieRoll };
export default dieRoll;
