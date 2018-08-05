import without from 'lodash/without';
import createPersistStateFunction from '../utils/persistState';
import arrayMove from '../utils/arrayMove';

export const INITIATIVE_MOVE = 'initiative/INITIATIVE_MOVE';
export const INITIATIVE_ADD = 'initiative/INITIATIVE_ADD';
export const INITIATIVE_REMOVE = 'initiative/INITIATIVE_REMOVE';

const storageKey = 'stoogeInitiative';
const initialState = JSON.parse(window.localStorage.getItem(storageKey)) || {
	actors: [],
};

const persistState = createPersistStateFunction(storageKey);

// const actorTemplate = {
// 	type: TYPE_MONSTER,
// 	id: null,
// };

function moveActors(state, oldIndex, newIndex) {
	console.log({ oldIndex, newIndex });
	const newState = {
		...state,
		actors: arrayMove(state.actors, oldIndex, newIndex),
	};

	return persistState(newState);
}

function addActor(state, actor) {
	if (actor) {
		return {
			...state,
			actors: [...state.actors, actor],
		};
	}

	return state;
}

function removeActor(state, actor) {
	const actors = without([...state.actors], actor);
	if (actors.length < state.actors.length) {
		const newState = {
			...state,
			actors,
		};

		return persistState(newState);
	}

	return state;
}

export default (state = initialState, action) => {
	switch (action.type) {
		case INITIATIVE_ADD:
			return addActor(state, action.actor);
		case INITIATIVE_REMOVE:
			return removeActor(state, action.actor);
		case INITIATIVE_MOVE:
			return moveActors(state, action.oldIndex, action.newIndex);
		default:
			return state;
	}
};
