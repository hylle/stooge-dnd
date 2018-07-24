export const MONSTERS_ADD = 'MONSTERS_ADD';

const storageKey = 'stoogeMonsters';
const initialState = (JSON.parse(window.localStorage.getItem(storageKey))) || {
	items: {},
};

export default (state = initialState, action) => {
	switch (action.type) {
		case MONSTERS_ADD:
			return addMonster(state, action.id, action.data);
		default:
			return state
	}
};

function persistState(newState) {
	window.localStorage.setItem(storageKey, JSON.stringify(newState));

	return newState;
}

function addMonster(state, id, data) {
	const newItems = {...state.items};

	newItems[id] = data;

	const newState = {...state, items: newItems};
	return persistState(newState);
}
