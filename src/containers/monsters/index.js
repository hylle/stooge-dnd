import React, { Component, Fragment } from 'react';
import filter from 'lodash/filter';

import monsters from '../../monsters.json';
import './monsters.css';

const RAINBOW = 'linear-gradient(to top left, #e81123, #e81123 17%, #f7941d 17%, #f7941d 34%, #fff100 34%, #fff100 51%, #00a650 51%, #00a650 68%, #0054a5 68%, #0054a5 85%, #672d93 85%, #672d93)';
const colors = {
	'blue': null,
	'red': null,
	'green': null,
	'gold': null,
	'silver': null,
	'black': null,
	'brown': { bg: '#4c270c' },
	'zombie': { bg: '#a6bd4f' },
	'goblin': { bg: '#41924B' },
	'white': { border: '1px solid black', color: '#000' },
	'unicorn': { bg: RAINBOW },
	'chimera': { bg: RAINBOW },
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
							>
								{monster.name.split(' ').map((namePart, i) => (
									<Fragment key={i}>
										{namePart}<br/>
									</Fragment>
								))}
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
		const style = {};
		for (let index = 0; index < colorNames.length; index++) {
			const colorName = colorNames[index];
			if (lcName.indexOf(colorName) !== -1) {
				style.backgroundColor = colorName;

				const colorObj = colors[colorName];
				if (colorObj && typeof colorObj === 'object') {
					if (colorObj.bg) {
						style.background = colorObj.bg;
					}

					if (colorObj.border) {
						style.border = colorObj.border;
					}

					if (colorObj.color) {
						style.color = colorObj.color;
					}
				}
			}

		}

		return style;
	}

	filterMonsters = () => {
		const { search } = this.state;
		let filteredMonsters = monsters.results;
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
}

export default MonsterLookup;
