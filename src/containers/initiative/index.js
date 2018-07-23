import React, { Component } from 'react';
import { connect } from 'react-redux';
import {SortableContainer, SortableElement } from 'react-sortable-hoc';
import { PLAYERS_ADD, PLAYERS_REMOVE, PLAYERS_MOVE } from '../../reducers/players';

import Monsters from '../../monsters.json';
import IconMinotaur from './minotaur.svg';
import IconSwordman from './swordman.svg';

import './initiative.css';

const SortableItem = SortableElement(({ value, remove }) =>
	<li className="initiative__tracker__item">
		{value.name} <button onClick={remove}>-</button>
	</li>
);

const SortableList = SortableContainer(({ items, remove }) => {
	return (
		<ol className="initiative__tracker__list">
			{items.map((value, index) => (
				<SortableItem key={`item-${index}`} index={index} value={value} remove={() => remove(index)} />
			))}
		</ol>
	);
});

class InitiativeTracker extends Component {
	render() {
		const { players } = this.props;
		return (
			<div className="initiative">
				<div className="initiative__tracker">
					<div className="initiative__tracker__actions">
						<button onClick={this.addPlayers}>
							<img src={IconSwordman} alt="" />
						</button>
						<button onClick={this.addPlayers}>
							<img src={IconMinotaur} alt="" />
						</button>
					</div>
					<SortableList items={players.items} onSortEnd={this.onSortEnd} remove={this.removePlayer} lockAxis="y" helperClass="dragging" />
				</div>
				<div className="initiative__info">
					Monster stats
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
