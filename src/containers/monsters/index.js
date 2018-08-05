import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import filter from 'lodash/filter';
import find from 'lodash/find';

import SidebarLayout from '../../components/sidebarLayout';
import SortableList from '../../components/list';
import MonsterEncounters from './encounterList';
import { PLAYERS_ADD } from '../../reducers/players';
import { MONSTERS_ADD } from '../../reducers/monsters';

import './monsters.css';

class MonsterLookup extends Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
		monsters: PropTypes.shape({
			encounters: PropTypes.arrayOf(
				PropTypes.shape({
					id: PropTypes.string.isRequired,
				}),
			).isRequired,
		}).isRequired,
	};

	state = {
		search: '',
		monsters: [],
		selectedEncounter: null,
	};

	componentWillMount() {
		import(/* webpackChunkName: "monsters" */ '../../api/srd-monsters.json').then(
			(monsters) => {
				this.setState({ monsters });
			},
		);
	}

	render() {
		const { search } = this.state;
		const {
			monsters: { encounters },
		} = this.props;
		return (
			<SidebarLayout>
				<Fragment>
					<div>
						<input
							className="monstersearch"
							name="monstersearch"
							placeholder="Search for monsters..."
							value={search}
							onInput={this.onInput}
						/>
					</div>
					<SortableList
						listName="monsters"
						items={this.filterMonsters()}
						onSortEnd={() => {}}
						disableDragging
					/>
				</Fragment>
				<Fragment>
					<MonsterEncounters encounters={encounters} onSortEnd={console.log} />
				</Fragment>
			</SidebarLayout>
		);
	}

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

			// dispatch(this.createMonsterAddPlayerAction(monster));
		}
	};
}

export default connect((state) => state)(MonsterLookup);
