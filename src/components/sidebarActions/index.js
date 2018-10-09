import React from 'react';
import PropTypes from 'prop-types';

import './sidebarActions.scss';

const SidebarActions = ({ buttons }) => (
	<div className="sidebar-actions">
		{buttons.map((button) => (
			<button
				key={button.key}
				type="submit"
				onClick={button.onClick}
				title={button.title}
				className="sidebar-actions__button"
			>
				<img src={button.glyph} alt="" />
			</button>
		))}
	</div>
);

SidebarActions.propTypes = {
	buttons: PropTypes.arrayOf(
		PropTypes.shape({
			key: PropTypes.string.isRequired,
			onClick: PropTypes.func.isRequired,
			title: PropTypes.string.isRequired,
			glyph: PropTypes.string.isRequired,
		}),
	).isRequired,
};

export default SidebarActions;
