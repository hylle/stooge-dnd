import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
	PLAYERS_ADD,
	PLAYERS_REMOVE,
	PLAYERS_MOVE,
} from '../../reducers/players';
import MonsterStats from '../../components/monsterstats';
import SortableList from './list';

import IconMinotaur from './minotaur.svg';
import IconSwordman from './swordman.svg';

import './initiative.css';

class InitiativeTracker extends Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
		players: PropTypes.shape({}).isRequired,
	};

	render() {
		const { players, dispatch } = this.props;
		return (
			<div className="initiative">
				<div className="initiative__tracker">
					<div className="initiative__tracker__actions">
						<button
							type="submit"
							onClick={this.addPlayers}
							className="initiative__tracker__actions__button"
						>
							<img src={IconSwordman} alt="" />
						</button>
						<Link
							to="/monsters"
							className="initiative__tracker__actions__button"
						>
							<img src={IconMinotaur} alt="" />
						</Link>
					</div>
					<SortableList
						items={players.items}
						onSortEnd={this.onSortEnd}
						distance={2}
						remove={this.removePlayer}
						goto={(url) => dispatch(push(url))}
						lockAxis="y"
						helperClass="dragging"
					/>
				</div>
				<div className="initiative__info">
					<Switch>
						<Route path="/initiative/monster/:id" component={MonsterStats} />
						<Route
							path="/initiative/player/:id"
							component={() => <div>Nothing to see here</div>}
						/>
					</Switch>
				</div>
			</div>
		);
	}

	onSortEnd = ({ oldIndex, newIndex }) => {
		const { dispatch } = this.props;
		dispatch({
			type: PLAYERS_MOVE,
			oldIndex,
			newIndex,
		});
	};

	addPlayers = () => {
		const { dispatch } = this.props;
		// eslint-disable-next-line no-alert
		const namesStr = window.prompt(
			'Enter player names, separate multiple names with comma.',
		);
		if (namesStr) {
			const players = namesStr
				.split(',')
				.map((name) => this.createPlayerObject(name.trim()));

			if (players.length) {
				dispatch({
					type: PLAYERS_ADD,
					players,
				});
			}
		}
	};

	removePlayer = (index = 0) => {
		const { dispatch, players } = this.props;
		const player = players.items[index];

		if (window.confirm(` Are you sure you want to remove "${player.name}"?`)) {
			dispatch({
				type: PLAYERS_REMOVE,
				index,
			});
		}
	};

	createPlayerObject = (name) => ({
		name,
		stats: false,
	});
}

export default connect((state) => state)(InitiativeTracker);
