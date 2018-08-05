import React from 'react';
import PropTypes from 'prop-types';

import './sidebarLayout.css';

const SidebarLayout = ({ children }) => {
	return (
		<div className="sidebarlayout">
			<div className="sidebarlayout__sidebar">{children[0]}</div>
			<div className="sidebarlayout__content">{children[1]}</div>
		</div>
	);
};

SidebarLayout.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]).isRequired,
};

export default SidebarLayout;
