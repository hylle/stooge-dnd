import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';

import SidebarLayout from '../../components/sidebarLayout';
import SortableList from '../../components/list';
import MonsterEncounters from './encounterList';
import { ADD_ACTOR } from '../../actions';
import { PLAYERS_ADD } from '../../reducers/players';
import { MONSTERS_ADD, enhanceMonster } from '../../reducers/monsters';
import IconAdd from '../../svg/add.svg';
import IconLightning from '../../svg/lightning.svg';

import './monsters.scss';

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
	};

	componentWillMount() {
		import(/* webpackChunkName: "monsters" */ '../../api/srd-monsters.json').then(
			(module) => {
				this.setState({ monsters: module.default });
			},
		);
	}

	render() {
		const { search } = this.state;
		const {
			monsters: { encounters, selectedEncounter },
		} = this.props;

		const hasSelectedEncounter = findIndex(encounters, ['id', selectedEncounter]) !== -1;
		const actions = [{
			key: 'quickAdd',
			onClick: this.quickAddMonsterToInitiative,
			title: 'Add to initiative',
			glyph: IconLightning,
		}];



		if (hasSelectedEncounter) {
			actions.push({
				key: 'addToEncounter',
				onClick: this.addMonsterToEncounter,
				title: 'Add to encounter',
				glyph: IconAdd,
			});
		}


		return (
			<SidebarLayout>
				<Fragment>
					<div>
						<input
							className="monstersearch"
							name="monstersearch"
							autoComplete="off"
							placeholder="Search for monsters..."
							value={search}
							onInput={this.onInput}
						/>
					</div>
					<SortableList
						listName="monsters"
						items={this.filterMonsters()}
						onSortEnd={() => {}}
						colorNames
						actions={actions}
						disableDragging
					/>
				</Fragment>
				<Fragment>
					<MonsterEncounters />
				</Fragment>
			</SidebarLayout>
		);
	}

	filterMonsters = () => {
		const { search, monsters } = this.state;
		const { monsters: { customMonsters } } = this.props;

		let filteredMonsters = [...monsters, ...customMonsters];
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

	addMonsterToEncounter = (monster) => {
		const {
			dispatch,
			monsters: { selectedEncounter },
		} = this.props;

		if (selectedEncounter && monster && monster.id) {
			dispatch({
				type: MONSTERS_ADD,
				encounterId: selectedEncounter,
				monster,
			});
			// dispatch(this.createMonsterAddPlayerAction(monster));
		}
	};

	quickAddMonsterToInitiative = (monster) => {
		const {
			dispatch,
		} = this.props;

		dispatch({
			type: ADD_ACTOR,
			actor: enhanceMonster(monster),
		})
	};
}

export default connect((state) => state)(MonsterLookup);
