const arrayMove = (arr, previousIndex, newIndex) => {
	const array = arr.slice(0);
	if (newIndex >= array.length) {
		let k = newIndex - array.length;
		// eslint-disable-next-line no-plusplus
		while (k-- + 1) {
			array.push(undefined);
		}
	}
	array.splice(newIndex, 0, array.splice(previousIndex, 1)[0]);
	return array;
};

export default arrayMove;
