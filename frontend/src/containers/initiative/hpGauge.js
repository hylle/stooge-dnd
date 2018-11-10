import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import find from 'lodash/find';
import classnames from 'classnames';

const HPGauge = ({ maxHP, currentHP, initiative }) => {
	const skull = '☠';
	const isAlive = currentHP > 0;
	return (
		<Fragment>
			<span className="trackerlist-item__link__initiative">{initiative}</span>
			{!!maxHP && (
				<span className="trackerlist-item__link__hp">
					<span
						className="trackerlist-item__link__hp__current"
						style={{
							height: `${(100 / maxHP) * Math.max(currentHP, 0)}%`,
						}}
					/>
					<span className={classnames({
						'trackerlist-item__link__hp__display': true,
						'trackerlist-item__link__hp__display--dead': true,
					})}>
						{!isAlive && <Fragment>{skull} </Fragment>}
						{isAlive && <Fragment>{currentHP} / {maxHP}</Fragment>}
					</span>
				</span>
			)}
		</Fragment>
	);
};

HPGauge.propTypes = {
	maxHP: PropTypes.number,
	currentHP: PropTypes.number,
	initiative: PropTypes.number.isRequired,
};

HPGauge.defaultProps = {
	maxHP: null,
	currentHP: null,
};

export default connect((state, props) => {
	const { id } = props;
	const {
		initiative: { actors },
	} = state;
	const currentActor = find(actors, ['id', id]);
	const { maxHP, currentHP, initiative } = currentActor;

	return { maxHP, currentHP, initiative };
})(HPGauge);
