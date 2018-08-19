import React from 'react';
// import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const OptionalNavLink = (props) => {
	const { to } = props;

	if (to) {
		return <NavLink {...props} />;
	}

	return <span {...props} to={undefined} />;
};

export default OptionalNavLink;
