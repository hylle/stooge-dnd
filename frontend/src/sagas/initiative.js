import {
	take, all, fork, put,
} from 'redux-saga/effects';
import shortid from 'shortid';
// import forEach from 'lodash/forEach';
import isNaN from 'lodash/isNaN';
import random from 'lodash/random';
import filter from 'lodash/filter';
import { ADD_ACTOR, REMOVE_ACTOR } from '../actions';
import { TYPE_PLAYER, PLAYERS_ADD, PLAYERS_REMOVE } from '../reducers/players';
import {
	INITIATIVE_ADD,
	INITIATIVE_REMOVE,
	INITIATIVE_TRANSFER_ENCOUNTER,
	INITIATIVE_CLEAR_MONSTERS,
	INITIATIVE_INIT_ROLL,
	INITIATIVE_SET_INITIATIVE,
} from '../reducers/initiative';
import { TYPE_MONSTER } from '../reducers/monsters';
import { calcModifier } from '../utils/statModifiers';
import { hitDieRoll } from '../utils/dieRoll';

function* watchTransferMonsters() {
	while (true) {
		const { monsters } = yield take(INITIATIVE_TRANSFER_ENCOUNTER);
		yield put({ type: INITIATIVE_CLEAR_MONSTERS });

		for (let index = 0; index < monsters.length; index++) {
			const monster = monsters[index];
			yield put({
				type: ADD_ACTOR,
				actor: monster,
			});
		}
	}
}

function getInitiativeForActor(actor) {
	if (actor.type === TYPE_MONSTER) {
		return random(1, 20) + calcModifier(actor.stats.dexterity);
	}

	return 0;
}

function getHPforActor(actor) {
	if (actor.type === TYPE_MONSTER) {
		return hitDieRoll(actor.stats.hit_dice, actor.stats.constitution);
	}

	return null;
}

function* watchAddActor() {
	while (true) {
		const { actor } = yield take(ADD_ACTOR);
		const maxHP = getHPforActor(actor);
		const enhancedActor = {
			id: shortid.generate(),
			initiative: getInitiativeForActor(actor),
			affix: '',
			currentHP: maxHP,
			maxHP,
			...actor,
		};

		if (enhancedActor.type === TYPE_PLAYER) {
			yield put({ type: PLAYERS_ADD, player: enhancedActor });
			yield put({ type: INITIATIVE_ADD, actor: enhancedActor });
		}

		if (enhancedActor.type === TYPE_MONSTER) {
			// yield put({ type: MONSTERS_ADD, monster: enhancedActor });
			yield put({ type: INITIATIVE_ADD, actor: enhancedActor });
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

function* watchRollInitiative() {
	while (true) {
		const { actors } = yield take(INITIATIVE_INIT_ROLL);
		const actorsWithoutMonster = filter(
			actors,
			(actor) => actor.type === TYPE_PLAYER,
		);

		for (let index = 0; index < actorsWithoutMonster.length; index++) {
			const actor = actorsWithoutMonster[index];
			const initiative = parseInt(
				prompt(`Enter initiative for ${actor.name}.`),
				10,
			);

			if (!isNaN(initiative)) {
				yield put({
					type: INITIATIVE_SET_INITIATIVE,
					actor,
					initiative,
				});
			}
		}
	}
}

export default function* watchInitiative() {
	yield all([
		fork(watchAddActor),
		fork(watchRemoveActor),
		fork(watchTransferMonsters),
		fork(watchRollInitiative),
	]);
}
