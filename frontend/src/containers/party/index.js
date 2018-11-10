import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
// import { Switch, Route } from 'react-router';
// import { push } from 'connected-react-router';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import forEach from 'lodash/forEach';
import {
	// PLAYERS_ADD,
	PLAYERS_MOVE,
	TYPE_PLAYER,
} from '../../reducers/players';
import SortableList from '../../components/list';
import SidebarLayout from '../../components/sidebarLayout';
import SidebarActions from '../../components/sidebarActions';

import IconSwordman from './swordman.svg';
import IconRemove from '../../svg/remove.svg';
import './party.scss';
import { ADD_ACTOR, REMOVE_ACTOR } from '../../actions';

class PartyManager extends Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
		players: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
	};

	render() {
		const { players } = this.props;
		return (
			<SidebarLayout>
				<Fragment>
					<SidebarActions
						buttons={[
							{
								key: 'addplayer',
								onClick: this.addPlayers,
								glyph: IconSwordman,
								title: 'Add players',
							},
						]}
					/>
					<SortableList
						items={players}
						onSortEnd={this.onSortEnd}
						actions={[
							{
								key: 'remove',
								onClick: this.removePlayer,
								glyph: IconRemove,
								title: 'Remove player',
							},
						]}
					/>
				</Fragment>
				<Fragment>
					<div />
				</Fragment>
			</SidebarLayout>
		);
	}

	onSortEnd = ({ oldIndex, newIndex }) => {
		const { dispatch } = this.props;

		if (oldIndex !== newIndex) {
			dispatch({
				type: PLAYERS_MOVE,
				oldIndex,
				newIndex,
			});
		}
	};

	addPlayers = () => {
		const { dispatch } = this.props;
		// eslint-disable-next-line no-alert
		const namesStr = window.prompt(
			'Enter player names, separate multiple names with comma.',
		);
		if (namesStr) {
			const playerNames = namesStr
				.split(',')
				.map((name) => this.createPlayerObject(name.trim()));

			if (playerNames.length) {
				forEach(playerNames, (player) => {
					dispatch({
						type: ADD_ACTOR,
						actor: player,
					});
				});
			}
		}
	};

	removePlayer = (item) => {
		const { dispatch } = this.props;

		if (
			item
			&& window.confirm(` Are you sure you want to remove "${item.name}"?`)
		) {
			dispatch({
				type: REMOVE_ACTOR,
				actor: item,
			});
		}
	};

	createPlayerObject = (name) => ({
		name,
		type: TYPE_PLAYER,
	});
}

export default connect((state) => ({
	players: state.players.items,
}))(PartyManager);
