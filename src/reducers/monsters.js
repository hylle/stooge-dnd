import { arrayMove } from 'react-sortable-hoc';

export const MONSTERS_ADD = 'MONSTERS_ADD';
export const MONSTERS_REMOVE = 'MONSTERS_REMOVE';
export const MONSTERS_MOVE = 'MONSTERS_MOVE';


const storageKey = 'stoogeInitiative';
const initialState = (JSON.parse(window.localStorage.getItem(storageKey))) || {
	items: [],
};

export default (state = initialState, action) => {
	switch (action.type) {
		case MONSTERS_ADD:
			return addPlayers(state, action.players);
		case MONSTERS_REMOVE:
			return removePlayer(state, action.index);
		case MONSTERS_MOVE:
			return movePlayers(state, action.oldIndex, action.newIndex);
		default:
			return state
	}
};

function persistState(newState) {
	window.localStorage.setItem(storageKey, JSON.stringify(newState));

	return newState;
}

function addPlayers(state, players) {
	const newPlayers = [...state.items, ...players];
	if (state.items.length !== newPlayers.length) {
		const newState = {
			...state,
			items: newPlayers,
		};

		return persistState(newState);
	}

	return state;
};

function removePlayer(state, playerIndex) {
	let players = [...state.items];
	console.log({ playerIndex });
	if (playerIndex > -1 && playerIndex < state.items.length) {
		players.splice(playerIndex, 1);

		const newState = {
			...state,
			items: players,
		};

		return persistState(newState);
	}

	return state;
};

function movePlayers(state, oldIndex, newIndex) {
	const newState = {
		...state,
		items: arrayMove(state.items, oldIndex, newIndex),
	};

	return persistState(newState);
}
