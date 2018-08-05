/* eslint-disable react/no-multi-comp */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
// import classnames from 'classnames';

const PROPTYPE_ENCOUNTER = PropTypes.shape({
	id: PropTypes.string.isRequired,
	monsters: PropTypes.arrayOf(PropTypes.shape({})),
});
const PROPTYPE_ITEMS = PropTypes.arrayOf(PROPTYPE_ENCOUNTER);

const SortableMonster = SortableElement(({ monster, index }) => {
	return <li>{monster.name}</li>;
});

const EncounterList = SortableContainer((props) => {
	const { encounter, items } = props;
	return (
		<ol key={encounter.id} className="encounter">
			{items.map((monster, index) => (
				<SortableMonster
					key={monster.id}
					index={index}
					monster={monster}
					{...props}
				/>
			))}
		</ol>
	);
});

EncounterList.defaultProps = {
	...EncounterList.defaultProps,
};

const MonsterEncounters = ({ encounters }) => {
	return (
		<Fragment>
			{encounters.map((encounter) => (
				<EncounterList
					ref={encounter.id}
					encounter={encounter}
					onSortEnd={console.log}
				/>
			))}

			<ol className="encounter">
				<li className="trackerlist-item" style={{ height: '100px' }}>
					New encounter
				</li>
			</ol>
		</Fragment>
	);
};

MonsterEncounters.propTypes = {
	encounters: PROPTYPE_ITEMS.isRequired,
	// onSortEnd: PropTypes.func.isRequired,
};

MonsterEncounters.defaultProps = {};

export default MonsterEncounters;
