import createPersistStateFunction from '../utils/persistState';
import arrayMove from '../utils/arrayMove';

export const TYPE_PLAYER = 'players/TYPE_PLAYER';
export const PLAYERS_ADD = 'players/PLAYERS_ADD';
export const PLAYERS_REMOVE = 'players/PLAYERS_REMOVE';
export const PLAYERS_MOVE = 'players/PLAYERS_MOVE';

const storageKey = 'stoogePlayers';
const initialState = JSON.parse(window.localStorage.getItem(storageKey)) || {
	items: [],
};
const persistState = createPersistStateFunction(storageKey);

function addPlayer(state, player) {
	const newState = {
		...state,
		items: [...state.items, player],
	};

	return persistState(newState);
}

function removePlayer(state, playerIndex) {
	const players = [...state.items];
	if (playerIndex > -1 && playerIndex < state.items.length) {
		players.splice(playerIndex, 1);

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
			return removePlayer(state, action.index);
		case PLAYERS_MOVE:
			return movePlayers(state, action.oldIndex, action.newIndex);
		default:
			return state;
	}
};
