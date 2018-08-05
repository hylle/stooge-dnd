import uniqueId from 'lodash/uniqueId';
import createPersistStateFunction from '../utils/persistState';

export const TYPE_MONSTER = 'monsters/TYPE_MONSTER';
export const MONSTERS_ADD = 'monsters/MONSTERS_ADD';

const storageKey = 'stoogeMonstersV2';
const initialState = JSON.parse(window.localStorage.getItem(storageKey)) || {
	encounters: [],
};
const persistState = createPersistStateFunction(storageKey);

function addMonster(state, encounter, monster) {
	const newEncounters = [...state.encounters];
	if (encounter === 'new') {
		newEncounters.push({
			id: uniqueId('e'),
			monsters: [monster],
		});
	} else if (state.encounters[encounter]) {
		newEncounters[encounter].monsters.push(monster);

		return persistState({
			...state,
			encounters: newEncounters,
		});
	}

	return state;
}

export default (state = initialState, action) => {
	switch (action.type) {
		case MONSTERS_ADD:
			return addMonster(state, action.encounter, action.monster);
		default:
			return state;
	}
};
