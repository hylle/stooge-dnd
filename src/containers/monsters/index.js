import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import filter from 'lodash/filter';
import find from 'lodash/find';

import { PLAYERS_ADD } from '../../reducers/players';
import { MONSTERS_ADD } from '../../reducers/monsters';

import './monsters.css';

const RAINBOW =	'linear-gradient(to top left, #e81123, #e81123 17%, #f7941d 17%, #f7941d 34%, #fff100 34%, #fff100 51%, #00a650 51%, #00a650 68%, #0054a5 68%, #0054a5 85%, #672d93 85%, #672d93)';
const colors = {
	blue: null,
	red: null,
	green: null,
	gold: null,
	silver: null,
	black: null,
	brown: { background: '#4c270c', color: '#fff' },
	zombie: { background: '#a6bd4f', color: '#fff' },
	goblin: { background: '#41924B', color: '#fff' },
	unicorn: { background: RAINBOW, color: '#000' },
	blood: { background: '#8a0707', color: '#fff' },
	copper: { background: '#b87333', color: '#fff' },
	bronze: { background: '#cd7f32', color: '#fff' },
	brass: { background: '#b5a642', color: '#fff' },
};

class MonsterLookup extends Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
	};

	state = { search: '', monsters: [] };

	componentDidMount() {
		import(/* webpackChunkName: "monsters" */ '../../api/srd-monsters.json').then(
			(monsters) => {
				this.setState({ monsters });
			},
		);
	}

	render() {
		const { search } = this.state;

		return (
			<div className="monsterlookup">
				<div className="monsterlookup__search">
					<input
						name="monstersearch"
						placeholder="Search for monster"
						value={search}
						onInput={this.onInput}
					/>
				</div>
				<div className="monsterlookup__monsterlist">
					{this.filterMonsters().map((monster, i) => (
						<div
							key={monster.index}
							className="monsterlookup__monsterlist__item"
						>
							<button
								type="submit"
								className="monsterlookup__monsterlist__item__content"
								style={this.getColorFromName(monster.name)}
								onClick={this.createAddPlayers(monster.index)}
							>
								{monster.name}
							</button>
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
	};

	filterMonsters = () => {
		const { search, monsters } = this.state;
		let filteredMonsters = monsters;
		if (search) {
			filteredMonsters = filter(filteredMonsters, (monster) => {
				return monster.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
			});
		}

		return filteredMonsters;
	};

	onInput = (e) => {
		this.setState({
			search: e.target.value,
		});
	};

	createMonsterAddPlayerAction = (monsterData) => ({
		type: PLAYERS_ADD,
		players: [
			{
				name: monsterData.name,
				stats: monsterData,
			},
		],
	});

	createAddPlayers = (monsterIndex) => () => {
		const { dispatch } = this.props;
		const { monsters } = this.state;

		const monster = find(monsters, ['index', monsterIndex]);

		if (monster && monster.name) {
			dispatch({
				type: MONSTERS_ADD,
				id: monster.index,
				data: monster,
			});

			dispatch(this.createMonsterAddPlayerAction(monster));
		}
	};
}

export default connect((state) => state)(MonsterLookup);
