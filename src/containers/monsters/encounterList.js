/* eslint-disable react/no-multi-comp */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';

import './encounterList.scss';
import {
	MONSTERS_ADD_ENCOUNTER,
	MONSTERS_REMOVE_ENCOUNTER,
	MONSTERS_SELECT_ENCOUNTER,
	MONSTERS_REMOVE,
} from '../../reducers/monsters';
import { INITIATIVE_TRANSFER_ENCOUNTER } from '../../reducers/initiative';

const PROPTYPE_ENCOUNTER = PropTypes.shape({
	id: PropTypes.string.isRequired,
	monsters: PropTypes.arrayOf(PropTypes.shape({})),
});
const PROPTYPE_ITEMS = PropTypes.arrayOf(PROPTYPE_ENCOUNTER);

const addEncounter = (dispatch) => {
	dispatch({
		type: MONSTERS_ADD_ENCOUNTER,
	});
};

const removeEncounter = (dispatch, encounterId) => {
	if (encounterId) {
		dispatch({
			type: MONSTERS_REMOVE_ENCOUNTER,
			encounterId,
		});
	}
};

const selectEncounter = (dispatch, newSelectedEncounter, selectedEncounter) => {
	if (selectedEncounter !== newSelectedEncounter) {
		dispatch({
			type: MONSTERS_SELECT_ENCOUNTER,
			encounterId: newSelectedEncounter,
		});
	}
};

const transferMonsters = (dispatch, monsters) => {
	dispatch({
		type: INITIATIVE_TRANSFER_ENCOUNTER,
		monsters,
	});
};

const removeMonster = (dispatch, encounterId, monsterId) => {
	dispatch({
		type: MONSTERS_REMOVE,
		encounterId,
		monsterId,
	});
};

const MonsterItem = ({ dispatch, encounter, monster, index }) => {
	return (
		<li>
			{monster.name}
			<button
				className="encounter-list__encounter__monster__button"
				onClick={() => removeMonster(dispatch, encounter.id, monster.id)}>
				-
			</button>
		</li>
	);
};

const EncounterList = (props) => {
	const { dispatch, encounter, selectedEncounter } = props;
	const { monsters } = encounter;
	return (
		<div
			className={classnames({
				'encounter-list__encounter': true,
				'encounter-list__encounter--selected':
					selectedEncounter === encounter.id,
			})}
			onClick={() => selectEncounter(dispatch, encounter.id, selectedEncounter)}
			onKeyDown={(e) => {
				const SPACE = 32;
				const ENTER = 13;
				if (e.keyCode === SPACE || e.keyCode === ENTER) {
					selectEncounter(dispatch, encounter.id, selectedEncounter);
				}
			}}
			role="tab"
			tabIndex={0}
		>
			<div>
				<button
					type="submit"
					onClick={(e) => {
						e.stopPropagation();
						removeEncounter(dispatch, encounter.id);
					}}
				>
					delete
				</button>
				<button
					type="submit"
					onClick={(e) => {
						e.stopPropagation();
						transferMonsters(dispatch, monsters);
					}}
				>
					transfer to initiative
				</button>
			</div>

			<ol className="encounter-list__encounter__monsters">
				{monsters.map((monster, index) => (
					<MonsterItem
						key={monster.id + index}
						index={index}
						monster={monster}
						{...props}
					/>
				))}
			</ol>
		</div>
	);
};

EncounterList.defaultProps = {
	...EncounterList.defaultProps,
};

const MonsterEncounters = ({ dispatch, encounters, selectedEncounter }) => {
	return (
		<Fragment>
			<div className="encounter-list">
				<div className="encounter-list__actions">
					<button type="submit" onClick={() => addEncounter(dispatch)}>
						New encounter
					</button>
				</div>

				{encounters.map((encounter) => (
					<EncounterList
						key={encounter.id}
						dispatch={dispatch}
						encounter={encounter}
						selectedEncounter={selectedEncounter}
					/>
				))}
			</div>
		</Fragment>
	);
};

MonsterEncounters.propTypes = {
	encounters: PROPTYPE_ITEMS.isRequired,
	selectedEncounter: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.oneOf([false]),
	]).isRequired,
	dispatch: PropTypes.func.isRequired,
	// onSortEnd: PropTypes.func.isRequired,
};

MonsterEncounters.defaultProps = {};

export default connect((state) => {
	const { monsters } = state;
	const { encounters, selectedEncounter } = monsters;

	return {
		dispatch: state.dispatch,
		encounters,
		selectedEncounter,
	};
})(MonsterEncounters);
