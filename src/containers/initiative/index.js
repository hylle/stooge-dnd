import React, { Component } from 'react';
import { Switch, Route } from 'react-router'
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import {SortableContainer, SortableElement } from 'react-sortable-hoc';
import { Link } from 'react-router-dom';
import { PLAYERS_ADD, PLAYERS_REMOVE, PLAYERS_MOVE } from '../../reducers/players';
import MonsterStats from '../../components/monsterstats';

import IconMinotaur from './minotaur.svg';
import IconSwordman from './swordman.svg';

import './initiative.css';

const SortableItem = SortableElement(({ value, remove, goto }) =>
	<li className="initiative__tracker__item">
		{value.name}
		<span>
			{value.stats && (
				<button onClick={() => goto(`/initiative/${value.stats._id}`)}>i</button>
			)}
			<button onClick={remove}>-</button>
		</span>
	</li>
);

const SortableList = SortableContainer(({ items, remove, goto }) => {
	return (
		<ol className="initiative__tracker__list">
			{items.map((value, index) => (
				<SortableItem key={`item-${index}`} index={index} value={value} remove={() => remove(index)} goto={goto} />
			))}
		</ol>
	);
});

class InitiativeTracker extends Component {
	render() {
		const { players, dispatch } = this.props;
		return (
			<div className="initiative">
				<div className="initiative__tracker">
					<div className="initiative__tracker__actions">
						<button onClick={this.addPlayers} className="initiative__tracker__actions__button">
							<img src={IconSwordman} alt="" />
						</button>
						<Link to="/monsters" className="initiative__tracker__actions__button">
							<img src={IconMinotaur} alt="" />
						</Link>
					</div>
					<SortableList
						items={players.items}
						onSortEnd={this.onSortEnd}
						remove={this.removePlayer}
						goto={(url) => dispatch(push(url))}
						lockAxis="y"
						helperClass="dragging"
					/>
				</div>
				<div className="initiative__info">
					<Switch>
						<Route path="/initiative/:id" component={MonsterStats}/>
					</Switch>
				</div>
			</div>
		);
	}

	onSortEnd = ({oldIndex, newIndex}) => {
		const { dispatch } = this.props;
		dispatch({
			type: PLAYERS_MOVE,
			oldIndex,
			newIndex,
		});
	};

	addPlayers = () => {
		const { dispatch } = this.props;
		const namesStr = window.prompt('Enter player names, separate multiple names with comma.');
		if (namesStr) {
			const players = namesStr.split(',').map((name) => this.createPlayerObject(name.trim()));

			if (players.length) {
				dispatch({
					type: PLAYERS_ADD,
					players,
				});
			}
		}
	}

	removePlayer = (index = 0) => {
		const { dispatch } = this.props;

		dispatch({
			type: PLAYERS_REMOVE,
			index,
		});
	}

	createPlayerObject = (name) => ({
		name,
		stats: false,
	});
}

export default connect((state) => state)(InitiativeTracker);
