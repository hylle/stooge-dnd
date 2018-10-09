import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isNaN from 'lodash/isNaN';
import { prettyModifier } from '../../utils/statModifiers';

import IconDamage from './damage.svg';
import IconHeal from './heal.svg';

import './monsterstats.scss';
import {
	INITIATIVE_TAKE_DAMAGE,
	INITIATIVE_HEAL_DAMAGE,
} from '../../reducers/initiative';

/* eslint-disable no-floating-decimal */
const CR_TO_XP_TABLE = {
	0: 10,
	0.125: 25,
	0.25: 50,
	0.5: 100,
	1: 200,
	2: 450,
	3: 700,
	4: 1100,
	5: 1800,
	6: 2300,
	7: 2900,
	8: 3900,
	9: 5000,
	10: 5900,
	11: 7200,
	12: 8400,
	13: 10000,
	14: 11500,
	15: 13000,
	16: 15000,
	17: 18000,
	18: 20000,
	19: 22000,
	20: 25000,
	21: 33000,
	22: 41000,
	23: 50000,
	24: 62000,
	25: 75000,
	26: 90000,
	27: 105000,
	28: 120000,
	29: 135000,
	30: 155000,
};
/* eslint-enable no-floating-decimal */

const CR2XP = (cr) => {
	const xp = CR_TO_XP_TABLE[cr];
	return xp !== undefined ? `${cr} (${xp} XP)` : 'Unknown';
};

const SKILLS = [
	'athletics',
	'acrobatics',
	'sleight_of_hand',
	'stealth',
	'arcana',
	'history',
	'investigation',
	'nature',
	'religion',
	'animal_handling',
	'insight',
	'medicine',
	'perception',
	'survival',
	'deception',
	'intimidation',
	'performance',
	'persuasion',
];
const SKILLS_NAMES = [
	'Athletics',
	'Acrobatics',
	'Sleight of Hand',
	'Stealth',
	'Arcana',
	'History',
	'Investigation',
	'Nature',
	'Religion',
	'Animal Handling',
	'Insight',
	'Medicine',
	'Perception',
	'Survival',
	'Deception',
	'Intimidation',
	'Performance',
	'Persuasion',
];

const PLAIN_VALUE_FORMATTER = (name, value) => value;
const joinStats = (
	title,
	data,
	stats = [],
	names = [],
	formatter = (name, value) => {
		return `${name} ${prettyModifier(value)}`;
	},
) => {
	const joinedStats = stats
		.reduce((prev, curr, index) => {
			if (data[curr]) {
				const name = names[index];
				prev.push(formatter(name, data[curr]));
				return prev;
			}

			return prev;
		}, [])
		.join(', ');

	if (joinedStats.length) {
		return (
			<div>
				<strong>{title}</strong> {joinedStats}
			</div>
		);
	}

	return null;
};

const keyToNameFormatter = (key) => {
	const spacedStr = key.replace('_', ' ');
	return spacedStr.charAt(0).toUpperCase() + spacedStr.slice(1);
};

const MonsterStats = ({ monster, dispatch }) => {
	if (!monster) {
		return null;
	}

	const { stats } = monster;

	return (
		<div className="monsterstats">
			<div>
				<button
					type="submit"
					className="monsterstats__adjust-hp"
					onClick={() => {
						const damage = parseInt(prompt('Enter damage amount.'), 10);
						if (!isNaN(damage)) {
							dispatch({
								type: INITIATIVE_TAKE_DAMAGE,
								actor: monster,
								damage,
							});
						}
					}}
				>
					<img src={IconDamage} alt="Take damage" />
				</button>
				<button
					type="submit"
					className="monsterstats__adjust-hp monsterstats__adjust-hp--heal"
					onClick={() => {
						const heal = parseInt(prompt('Enter healing amount.'), 10);
						if (!isNaN(heal)) {
							dispatch({
								type: INITIATIVE_HEAL_DAMAGE,
								actor: monster,
								heal,
							});
						}
					}}
				>
					<img src={IconHeal} alt="Heal" />
				</button>
			</div>
			<h2>{monster.name}</h2>
			<strong>
				{`
					${stats.size}
					${stats.type}${stats.subtype ? ` (${stats.subtype})` : ''},
					${stats.alignment}
				`}
			</strong>
			<hr />
			<div>
				<strong>AC:</strong> {stats.armor_class}
				<br />
				<strong>HP:</strong> {stats.hit_points} ({stats.hit_dice})<br />
				<strong>Speed:</strong> {stats.speed}
				<br />
			</div>
			<hr />
			<table width="100%">
				<thead>
					<tr>
						{['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map((ability) => (
							<th key={ability}>{ability}</th>
						))}
					</tr>
				</thead>
				<tbody>
					<tr>
						{[
							'strength',
							'dexterity',
							'constitution',
							'intelligence',
							'wisdom',
							'charisma',
						].map((ability) => (
							<td key={ability}>
								{stats[ability]} ({prettyModifier(stats[ability])})
							</td>
						))}
					</tr>
				</tbody>
			</table>

			<hr />

			<div>
				{joinStats(
					'Saving throws',
					stats,
					[
						'strength_save',
						'dexterity_save',
						'constitution_save',
						'intelligence_save',
						'wisdom_save',
						'charisma_save',
					],
					['Str', 'Dex', 'Con', 'Int', 'Wis', 'Cha'],
				)}
			</div>
			<div>{joinStats('Skills', stats, SKILLS, SKILLS_NAMES)}</div>
			{[
				'damage_vulnerabilities',
				'damage_resistances',
				'damage_immunities',
				'condition_immunities',
				'senses',
				'languages',
			].map((key) => (
				<div key={key}>
					{joinStats(
						keyToNameFormatter(key),
						stats,
						[key],
						[],
						PLAIN_VALUE_FORMATTER,
					)}
				</div>
			))}

			<div>
				{joinStats(
					'Challenge',
					stats,
					['challenge_rating'],
					[],
					(name, value) => CR2XP(value),
				)}
			</div>

			{['special_abilities', 'actions', 'legendary_actions'].map((section) => {
				if (stats[section]) {
					return (
						<Fragment key={section}>
							<hr />
							<div>
								<h4>{keyToNameFormatter(section)}</h4>

								{stats[section].map((action, i) => (
									<div key={action.name}>
										<em>
											<strong>{action.name}</strong>
										</em>{' '}
										<pre>{action.desc}</pre>
									</div>
								))}
							</div>
						</Fragment>
					);
				}

				return null;
			})}
		</div>
	);
};

MonsterStats.propTypes = {
	dispatch: PropTypes.func.isRequired,
	monster: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.oneOf([false])]),
};

MonsterStats.defaultProps = {
	monster: false,
};

export default connect((state, props) => {
	const {
		match: {
			params: { id },
		},
	} = props;
	return {
		...state,
		monster: state.initiative.actors.find((monster) => {
			return monster.stats && monster.id === id;
		}),
	};
})(MonsterStats);
