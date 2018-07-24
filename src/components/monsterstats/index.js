import React from 'react';
import { connect } from 'react-redux';

import './monsterstats.css';

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
]
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
]

const transformModifier = (modifier) => modifier >= 0 ? `+${modifier}` : modifier

const calcModifier = (stat = 10) => {
	const modifier = Math.floor((stat - 10) / 2);

	return transformModifier(modifier);
};

const joinStats = (title, data, stats = [], names = []) => {
	const joinedStats = stats.reduce((prev, curr, index) => {
		if (data[curr]) {
			const name = names[index];
			prev.push(`${name} ${transformModifier(data[curr])}`);
			return prev;
		}

		return prev;
	}, []).join(', ');

	if (joinedStats.length) {
		return (
			<div>
				<strong>{title}:</strong>
				{' '}
				{joinedStats}
			</div>
		);
	}

	return null;
};

const MonsterStats = ({ monster }) => {
	if (!monster) {
		return null;
	}

	const { stats } = monster;

	return (
		<div className="monsterstats">
			<h2>{monster.name}</h2>
			<strong>
				{`
					${stats.size}
					${stats.type}${stats.subtype ? ` (${stats.subtype})` : ''},
					${stats.alignment}
				`}
			</strong>
			<hr/>
			<div>
				<strong>AC:</strong> {stats.armor_class}<br/>
				<strong>HP:</strong> {stats.hit_points} ({stats.hit_dice})<br/>
				<strong>Speed:</strong> {stats.speed}<br/>
			</div>
			<hr/>
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
								'strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma',
							].map((ability) => (
								<td key={ability}>
									{stats[ability]} ({calcModifier(stats[ability])})
								</td>
							))}
						</tr>
					</tbody>
				</table>

				<hr/>

				<div>
					{joinStats('Saving throws', stats, [
						'strength_save',
						'dexterity_save',
						'constitution_save',
						'intelligence_save',
						'wisdom_save',
						'charisma_save',
					], [
						'Str',
						'Dex',
						'Con',
						'Int',
						'Wis',
						'Cha',
					])}
				</div>
				<div>
					{joinStats('Skills', stats, SKILLS, SKILLS_NAMES)}
				</div>
		</div>
	);
};

export default connect((state, props) => {
	const { match: { params: { id }}} = props;
	return {
		...state,
		monster: state.players.items.find((monster) => {
			return (monster.stats && monster.stats._id === id)
		}),
	}
})(MonsterStats);
