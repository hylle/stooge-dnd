import React from 'react';
import PropTypes from 'prop-types';

import './turnMarker.scss';

const TurnMarker = ({ currentActor, position }) => {
	if (currentActor === position) {
		return <div className="turnmarker" />;
	}

	return null;
};

TurnMarker.propTypes = {
	currentActor: PropTypes.number.isRequired,
	position: PropTypes.number.isRequired,
};
TurnMarker.defaultProps = {};

export default TurnMarker;
