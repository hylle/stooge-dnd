import {
	take, all, fork, put,
} from 'redux-saga/effects';
import uniqueId from 'lodash/uniqueId';
import { ADD_ACTOR, REMOVE_ACTOR } from '../actions';
import { TYPE_PLAYER, PLAYERS_ADD, PLAYERS_REMOVE } from '../reducers/players';
import { INITIATIVE_ADD, INITIATIVE_REMOVE } from '../reducers/initiative';
import { TYPE_MONSTER, MONSTERS_ADD } from '../reducers/monsters';

function* watchAddActor() {
	while (true) {
		const { actor } = yield take(ADD_ACTOR);
		const enhancedActor = {
			id: uniqueId('act'),
			...actor,
		};

		if (enhancedActor.type === TYPE_PLAYER) {
			yield put({ type: PLAYERS_ADD, player: enhancedActor });
			yield put({ type: INITIATIVE_ADD, actor: enhancedActor });
		}

		if (enhancedActor.type === TYPE_MONSTER) {
			yield put({ type: MONSTERS_ADD, monster: enhancedActor });
			// yield put({ type: INITIATIVE_ADD, actor: enhancedActor });
		}
	}
}

function* watchRemoveActor() {
	while (true) {
		const { actor } = yield take(REMOVE_ACTOR);

		if (actor.type === TYPE_PLAYER) {
			yield put({ type: PLAYERS_REMOVE, player: actor });
			yield put({ type: INITIATIVE_REMOVE, actor });
		}

		if (actor.type === TYPE_MONSTER) {
			// yield put({ type: MONSTERS_REMOVE, monster: actor });
			// yield put({ type: INITIATIVE_REMOVE, actor: actor });
		}
	}
}

export default function* watchInitiative() {
	yield all([fork(watchAddActor), fork(watchRemoveActor)]);
}
