import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import filter from 'lodash/filter';

import monstersData from '../../monsters.json';
import './monsters.css';
import { PLAYERS_ADD } from '../../reducers/players';
import { MONSTERS_ADD } from '../../reducers/monsters';

const RAINBOW = 'linear-gradient(to top left, #e81123, #e81123 17%, #f7941d 17%, #f7941d 34%, #fff100 34%, #fff100 51%, #00a650 51%, #00a650 68%, #0054a5 68%, #0054a5 85%, #672d93 85%, #672d93)';
const colors = {
	'blue': null,
	'red': null,
	'green': null,
	'gold': null,
	'silver': null,
	'black': null,
	'brown': { background: '#4c270c', color: '#fff' },
	'zombie': { background: '#a6bd4f', color: '#fff' },
	'goblin': { background: '#41924B', color: '#fff' },
	'unicorn': { background: RAINBOW, color: '#000' },
	'blood': { background: '#8a0707', color: '#fff' },
	'copper': { background: '#b87333', color: '#fff' },
	'bronze': { background: '#cd7f32', color: '#fff' },
	'brass': { background: '#b5a642', color: '#fff' },
};

class MonsterLookup extends Component {
	state = { search: '' };

	render() {
		return (
			<div className="monsterlookup">
				<div className="monsterlookup__search">
					<input
						name="monstersearch"
						placeholder="Search for monster"
						value={this.state.search}
						onInput={this.onInput}
					/>
				</div>
				<div className="monsterlookup__monsterlist">
					{this.filterMonsters().map((monster, i) => (
						<div key={i} className="monsterlookup__monsterlist__item">
							<div
								className="monsterlookup__monsterlist__item__content"
								style={this.getColorFromName(monster.name)}
								onClick={this.createAddPlayers(monster.url)}
							>
								{monster.name}
								{/* {monster.name.split(' ').map((namePart, i) => (
									<Fragment key={i}>
										{namePart}<br/>
									</Fragment>
								))} */}
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	getColorFromName = (name) => {
		const lcName = name.toLowerCase();
		const colorNames = Object.keys(colors);
		let style = {};
		for (let index = 0; index < colorNames.length; index++) {
			const colorName = colorNames[index];
			if (lcName.indexOf(colorName) !== -1) {
				style.backgroundColor = colorName;
				style.color = '#fff';

				const styleObj = colors[colorName];
				if (styleObj && typeof styleObj === 'object') {
					style = styleObj;
				}
			}

		}

		return style;
	}

	filterMonsters = () => {
		const { search } = this.state;
		let filteredMonsters = monstersData.results;
		if (search) {
			filteredMonsters = filter(filteredMonsters, (monster) => {
				return monster.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
			});
		}


		return filteredMonsters;
	}

	onInput = (e) => {
		this.setState({
			search: e.target.value,
		})
	}

	createMonsterAddPlayerAction = (monsterData) => ({
			type: PLAYERS_ADD,
			players: [
				{
					name: monsterData.name,
					stats: monsterData,
				},
			],
	});

	createAddPlayers = (monsterUrl) => () => {
		const { dispatch, monsters } = this.props;

		const cachedMonster = monsters.items[monsterUrl];
		if (cachedMonster && cachedMonster._id) {
			dispatch(this.createMonsterAddPlayerAction(cachedMonster));
		} else {
			fetch(monsterUrl).then((res) => {
				res.json().then((data) => {
					if (data && data.name) {
						dispatch({
							type: MONSTERS_ADD,
							id: data._id,
							data,
						});
						dispatch(this.createMonsterAddPlayerAction(data));
					}
				});
			});
		}

	}
}

export default connect((state) => state)(MonsterLookup);
