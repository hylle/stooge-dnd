import shortid from 'shortid';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import without from 'lodash/without';
import createPersistStateFunction, {
	getInitialStateFromStorage,
} from '../utils/persistState';

export const TYPE_MONSTER = 'monsters/TYPE_MONSTER';
export const MONSTERS_ADD = 'monsters/MONSTERS_ADD';
export const MONSTERS_ADD_ENCOUNTER = 'monsters/MONSTERS_ADD_ENCOUNTER';
export const MONSTERS_REMOVE_ENCOUNTER = 'monsters/MONSTERS_REMOVE_ENCOUNTER';
export const MONSTERS_SELECT_ENCOUNTER = 'monsters/MONSTERS_SELECT_ENCOUNTER';

const storageKey = 'stoogeMonsters';
const storageVersion = 2;
const defaultState = {
	encounters: [],
	selectedEncounter: false,
};
const initialState = getInitialStateFromStorage(
	defaultState,
	storageKey,
	storageVersion,
);
const persistState = createPersistStateFunction(storageKey);

function addMonster(state, encounterId, monster) {
	const encounterIndex = findIndex(state.encounters, ['id', encounterId]);
	if (encounterIndex !== -1) {
		const newEncounters = [...state.encounters];
		newEncounters[encounterIndex].monsters.push({
			id: shortid.generate(),
			name: monster.name,
			type: TYPE_MONSTER,
			stats: monster,
		});

		return persistState({
			...state,
			encounters: newEncounters,
		});
	}

	return state;
}

function addEncounter(state) {
	const id = shortid.generate();
	return persistState({
		...state,
		encounters: [
			...state.encounters,
			{
				id,
				monsters: [],
			},
		],
		selectedEncounter:
			state.encounters.length === 0 ? id : state.selectedEncounter,
	});
}

function removeEncounter(state, encounterId) {
	const encounter = find(state.encounters, ['id', encounterId]);
	if (encounter) {
		const newState = { ...state };
		newState.encounters = without(state.encounters, encounter);
		return persistState(newState);
	}

	return state;
}

function selectedEncounter(state, encounterId) {
	const encounter = find(state.encounters, ['id', encounterId]);
	if (encounter) {
		return persistState({
			...state,
			selectedEncounter: encounterId,
		});
	}

	return state;
}

export default (state = initialState, action) => {
	switch (action.type) {
		case MONSTERS_ADD:
			return addMonster(state, action.encounterId, action.monster);
		case MONSTERS_ADD_ENCOUNTER:
			return addEncounter(state);
		case MONSTERS_REMOVE_ENCOUNTER:
			return removeEncounter(state, action.encounterId);
		case MONSTERS_SELECT_ENCOUNTER:
			return selectedEncounter(state, action.encounterId);
		default:
			return state;
	}
};
