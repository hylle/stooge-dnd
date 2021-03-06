/* eslint-disable no-param-reassign */
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import find from 'lodash/find';
import produce from 'immer';

import createPersistStateFunction, {
	getInitialStateFromStorage,
} from '../utils/persistState';
import arrayMove from '../utils/arrayMove';
import { TYPE_PLAYER } from './players';
import { getAffix, resetAffix } from '../utils/affixes';

export const INITIATIVE_MOVE = 'initiative/MOVE';
export const INITIATIVE_ADD = 'initiative/ADD';
export const INITIATIVE_REMOVE = 'initiative/REMOVE';
export const INITIATIVE_TRANSFER_ENCOUNTER = 'initiative/TRANSFER_ENCOUNTER';
export const INITIATIVE_INIT_ROLL = 'initiative/INIT_ROLL';
export const INITIATIVE_CLEAR_MONSTERS = 'initiative/CLEAR_MONSTERS';
export const INITIATIVE_SET_INITIATIVE = 'initiative/SET_INITIATIVE';
export const INITIATIVE_TAKE_DAMAGE = 'initiative/TAKE_DAMAGE';
export const INITIATIVE_HEAL_DAMAGE = 'initiative/HEAL_DAMAGE';
export const INITIATIVE_STEP_FORWARD = 'initiative/STEP_FORWARD';
export const INITIATIVE_STEP_BACK = 'initiative/STEP_BACK';

const storageKey = 'stoogeInitiative';
const storageVersion = 4;
const defaultState = {
	actors: [],
	currentActor: 0,
};
const initialState = getInitialStateFromStorage(
	defaultState,
	storageKey,
	storageVersion,
);
const persistState = createPersistStateFunction(storageKey);

function moveActors(state, oldIndex, newIndex) {
	const newState = {
		...state,
		actors: arrayMove(state.actors, oldIndex, newIndex),
	};

	return persistState(newState);
}

function addActor(state, actor) {
	if (actor) {
		const existingActor = find(state.actors, ['name', actor.name]);
		let enhancedActor = actor;
		if (existingActor) {
			enhancedActor = {
				...actor,
				affix: getAffix(),
			};
		}

		return persistState({
			...state,
			actors: sortBy(
				[...state.actors, enhancedActor],
				['initiative'],
			).reverse(),
		});
	}

	return state;
}

function removeActor(state, actor) {
	const actors = filter(
		[...state.actors],
		(stateActor) => stateActor.id !== actor.id,
	);
	if (actors.length < state.actors.length) {
		const newState = {
			...state,
			actors,
		};

		return persistState(newState);
	}

	return state;
}

function clearMonsters(state) {
	const newState = { ...state };
	const actorsWithoutMonster = filter(
		state.actors,
		(actor) => actor.type === TYPE_PLAYER,
	);

	newState.actors = actorsWithoutMonster;
	resetAffix();

	return persistState(newState);
}

function setActorInitiative(state, actor, initiative) {
	const actorIndex = state.actors.indexOf(actor);
	if (actorIndex !== -1) {
		const newActors = filter(
			state.actors,
			(stateActor) => stateActor.id !== actor.id,
		);

		newActors.push({
			...actor,
			initiative,
		});

		const newState = {
			...state,
			actors: sortBy(newActors, ['initiative']).reverse(),
		};

		return persistState(newState);
	}

	return state;
}

function takeDamage(state, actor, damage) {
	const actorIndex = state.actors.indexOf(actor);
	if (actorIndex !== -1 && damage) {
		const damagedActor = {
			...actor,
			currentHP: actor.currentHP - damage,
		};

		const newState = { ...state };
		newState.actors[actorIndex] = damagedActor;

		return persistState(newState);
	}

	return state;
}

function healDamage(state, actor, heal) {
	return takeDamage(state, actor, -heal);
}

function stepForwardInitiative(state) {
	return produce(state, (draft) => {
		const nextActor = draft.currentActor + 1;
		draft.currentActor = nextActor >= draft.actors.length ? 0 : nextActor;

		return draft;
	});
}

function stepBackInitiative(state) {
	return produce(state, (draft) => {
		const prevActor = draft.currentActor - 1;
		draft.currentActor = prevActor < 0 ? draft.actors.length - 1 : prevActor;

		return draft;
	});
}

export default (state = initialState, action) => {
	switch (action.type) {
		case INITIATIVE_ADD:
			return addActor(state, action.actor);
		case INITIATIVE_REMOVE:
			return removeActor(state, action.actor);
		case INITIATIVE_MOVE:
			return moveActors(state, action.oldIndex, action.newIndex);
		case INITIATIVE_CLEAR_MONSTERS:
			return clearMonsters(state);
		case INITIATIVE_SET_INITIATIVE:
			return setActorInitiative(state, action.actor, action.initiative);
		case INITIATIVE_TAKE_DAMAGE:
			return takeDamage(state, action.actor, Math.abs(action.damage));
		case INITIATIVE_HEAL_DAMAGE:
			return healDamage(state, action.actor, Math.abs(action.heal));
		case INITIATIVE_STEP_FORWARD:
			return stepForwardInitiative(state);
		case INITIATIVE_STEP_BACK:
			return stepBackInitiative(state);
		default:
			return state;
	}
};
