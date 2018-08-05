import createPersistStateFunction from '../utils/persistState';

export const TYPE_MONSTER = 'monsters/TYPE_MONSTER';
export const MONSTERS_ADD = 'monsters/MONSTERS_ADD';

const storageKey = 'stoogeMonsters';
const initialState = JSON.parse(window.localStorage.getItem(storageKey)) || {
	items: {},
};
const persistState = createPersistStateFunction(storageKey);

function addMonster(state, id, data) {
	const newItems = { ...state.items };

	newItems[id] = data;

	const newState = { ...state, items: newItems };
	return persistState(newState);
}

export default (state = initialState, action) => {
	switch (action.type) {
		case MONSTERS_ADD:
			return addMonster(state, action.monster);
		default:
			return state;
	}
};
