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
import IconStepNext from './step-next.svg';
import IconStepPrev from './step-prev.svg';

import './initiative.scss';
import SidebarLayout from '../../components/sidebarLayout';
import {
	INITIATIVE_MOVE,
	INITIATIVE_INIT_ROLL,
	INITIATIVE_STEP_FORWARD,
	INITIATIVE_STEP_BACK,
} from '../../reducers/initiative';
import SidebarActions from '../../components/sidebarActions';
import HPGauge from './hpGauge';
import TurnMarker from './turnMarker';

const Extra = connect((state) => ({
	currentActor: state.initiative.currentActor,
}))(({ item, currentActor, position }) => {
	return (
		<>
			<HPGauge item={item} id={item.id} />
			<TurnMarker currentActor={currentActor} position={position} />
		</>
	);
});

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
							{
								key: 'step-prev',
								onClick: this.stepBackInitiative,
								glyph: IconStepPrev,
								title: 'Next initiative',
							},
							{
								key: 'step-next',
								onClick: this.stepForwardInitiative,
								glyph: IconStepNext,
								title: 'Next initiative',
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
						extraComponent={Extra}
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

	stepForwardInitiative = () => {
		const { dispatch } = this.props;

		dispatch({
			type: INITIATIVE_STEP_FORWARD,
		});
	};

	stepBackInitiative = () => {
		const { dispatch } = this.props;

		dispatch({
			type: INITIATIVE_STEP_BACK,
		});
	};
}

export default connect((state) => ({
	dispatch: state.dispatch,
	actors: state.initiative.actors,
}))(InitiativeTracker);
