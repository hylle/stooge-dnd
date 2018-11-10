const calcModifier = (stat = 10) => {
	return Math.floor((stat - 10) / 2);
};

const prettyModifier = (stat) => {
	const modifier = calcModifier(stat);
	return modifier >= 0 ? `+${modifier}` : modifier;
};

export { calcModifier, prettyModifier };
export default calcModifier;
