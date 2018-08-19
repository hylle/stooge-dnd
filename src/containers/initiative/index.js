import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router';
import { connect } from 'react-redux';
// import forEach from 'lodash/forEach';
// import { Link } from 'react-router-dom';
import MonsterStats from '../../components/monsterstats';
import SortableList from '../../components/list';

// import IconMinotaur from './minotaur.svg';
// import IconSwordman from './swordman.svg';
import IconRoll from './roll.svg';

import './initiative.css';
import SidebarLayout from '../../components/sidebarLayout';
import {
	INITIATIVE_MOVE,
	INITIATIVE_INIT_ROLL,
} from '../../reducers/initiative';
import SidebarActions from '../../components/sidebarActions';
import HPGauge from './hpGauge';

class InitiativeTracker extends Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
		actors: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
	};

	render() {
		const { actors } = this.props;
		return (
			<SidebarLayout>
				<Fragment>
					<SidebarActions
						buttons={[
							{
								key: 'roll-initiative',
								onClick: this.rollInitiative,
								glyph: IconRoll,
								title: 'Input initiative',
							},
						]}
					/>
					<SortableList
						items={actors}
						onSortEnd={this.onSortEnd}
						linkGen={(item) => (item.stats
							? `/initiative/monster/${item.id}`
							: `/initiative/player/${item.id}`)
						}
						extraComponent={HPGauge}
					/>
				</Fragment>
				<Fragment>
					<Switch>
						<Route path="/initiative/monster/:id" component={MonsterStats} />
						<Route
							path="/initiative/player/:id"
							component={() => <div>Nothing to see here</div>}
						/>
					</Switch>
				</Fragment>
			</SidebarLayout>
		);
	}

	onSortEnd = ({ oldIndex, newIndex }) => {
		const { dispatch } = this.props;
		dispatch({
			type: INITIATIVE_MOVE,
			oldIndex,
			newIndex,
		});
	};

	rollInitiative = () => {
		const { dispatch, actors } = this.props;

		dispatch({
			type: INITIATIVE_INIT_ROLL,
			actors,
		});
	};
}

export default connect((state) => ({
	dispatch: state.dispatch,
	actors: state.initiative.actors,
}))(InitiativeTracker);
