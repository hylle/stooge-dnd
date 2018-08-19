import without from 'lodash/without';
import createPersistStateFunction, {
	getInitialStateFromStorage,
} from '../utils/persistState';
import arrayMove from '../utils/arrayMove';

export const TYPE_PLAYER = 'players/TYPE_PLAYER';
export const PLAYERS_ADD = 'players/PLAYERS_ADD';
export const PLAYERS_REMOVE = 'players/PLAYERS_REMOVE';
export const PLAYERS_MOVE = 'players/PLAYERS_MOVE';

const storageKey = 'stoogePlayers';
const storageVersion = 2;
const defaultState = {
	items: [],
};
const initialState = getInitialStateFromStorage(
	defaultState,
	storageKey,
	storageVersion,
);
const persistState = createPersistStateFunction(storageKey);

function addPlayer(state, player) {
	const newState = {
		...state,
		items: [...state.items, player],
	};

	return persistState(newState);
}

function removePlayer(state, player) {
	const players = without([...state.items], player);
	if (players.length < state.items.length) {
		const newState = {
			...state,
			items: players,
		};

		return persistState(newState);
	}

	return state;
}

function movePlayers(state, oldIndex, newIndex) {
	const newState = {
		...state,
		items: arrayMove(state.items, oldIndex, newIndex),
	};

	return persistState(newState);
}

export default (state = initialState, action) => {
	switch (action.type) {
		case PLAYERS_ADD:
			return addPlayer(state, action.player);
		case PLAYERS_REMOVE:
			return removePlayer(state, action.player);
		case PLAYERS_MOVE:
			return movePlayers(state, action.oldIndex, action.newIndex);
		default:
			return state;
	}
};
