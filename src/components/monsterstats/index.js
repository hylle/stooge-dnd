import React from 'react';
import { connect } from 'react-redux';

const calcModifier = (stat = 10) => {
	const modifier = Math.floor((stat - 10) / 2);

	return modifier >= 0 ? `+${modifier}` : modifier;
};

const MonsterStats = ({ monster }) => {
	if (!monster) {
		return null;
	}

	const { stats } = monster;

	return (
		<div className="monsterstats">
			<h2>{monster.name}</h2>
			<h4>
				{`
					${stats.size}
					${stats.type}${stats.subtype ? ` (${stats.subtype})` : ''},
					${stats.alignment}
				`}
			</h4>
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
							<th>STR</th>
							<th>DEX</th>
							<th>CON</th>
							<th>INT</th>
							<th>WIS</th>
							<th>CHA</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								{stats.strength} ({calcModifier(stats.strength)})
							</td>
							<td>
								{stats.dexterity} ({calcModifier(stats.dexterity)})
							</td>
							<td>
								{stats.constitution} ({calcModifier(stats.constitution)})
							</td>
							<td>
								{stats.intelligence} ({calcModifier(stats.intelligence)})
							</td>
							<td>
								{stats.wisdom} ({calcModifier(stats.wisdom)})
							</td>
							<td>
								{stats.charisma} ({calcModifier(stats.charisma)})
							</td>
						</tr>
					</tbody>
				</table>
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
