/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import getColorsFromName from '../../utils/colorFromName';
import './list.css';

const PROPTYPE_ITEM = PropTypes.shape({
	name: PropTypes.string.isRequired,
});
const PROPTYPE_ITEMS = PropTypes.arrayOf(PROPTYPE_ITEM);

const colorToStyle = (colors) => {
	const style = {};

	if (colors.gradient) {
		style.borderImage = `${colors.gradient} 0 0 1 0 / 1px / 0 stretch`;
	}

	if (colors.main) {
		style.borderBottomColor = colors.main;
	}

	return style;
};

const SortableItem = SortableElement(({
	item, actions, index, linkGen,
}) => {
	// console.log(item);
	const link = linkGen(item);
	const colors = getColorsFromName(item.name);

	return (
		<li className="trackerlist-item">
			{(!!link && (
				<NavLink to={linkGen(item)} className="trackerlist-item__link">
					<span
						className={classnames({
							'trackerlist-item__link__name': true,
							'trackerlist-item__link__name--monster': item.stats,
							'trackerlist-item__link__name--player': !item.stats,
						})}
						style={colorToStyle(colors)}
					>
						{item.name}
					</span>
				</NavLink>
			)) || (
				<div className="trackerlist-item__link">
					<span
						className={classnames({
							'trackerlist-item__link__name': true,
							'trackerlist-item__link__name--monster': item.stats,
							'trackerlist-item__link__name--player': !item.stats,
						})}
						style={colorToStyle(colors)}
					>
						{item.name} {index}
					</span>
				</div>
			)}

			<span className="trackerlist-item__actions">
				{actions.map((action) => (
					<button
						key={action.key}
						type="submit"
						className="trackerlist-item__actions__button"
						onClick={() => action.onClick(item)}
						title={action.title}
					>
						<img src={action.glyph} alt="-" height="20" width="20" />
					</button>
				))}
			</span>
		</li>
	);
});

SortableItem.propTypes = {
	actions: PropTypes.arrayOf(PropTypes.shape({})),
	linkGen: PropTypes.func.isRequired,
	item: PROPTYPE_ITEM.isRequired,
};

SortableItem.defaultProps = {
	actions: [],
};

const SortableList = SortableContainer(
	({
		items, disableDragging, actions, linkGen,
	}) => {
		return (
			<ol className="trackerlist">
				{items.map((value, index) => (
					<SortableItem
						key={value.id}
						index={index}
						value={value}
						item={value}
						disabled={disableDragging}
						actions={actions}
						linkGen={linkGen}
					/>
				))}
			</ol>
		);
	},
);

SortableList.propTypes = {
	...SortableList.propTypes,
	items: PROPTYPE_ITEMS.isRequired,
	onSortEnd: PropTypes.func.isRequired,
	disableDragging: PropTypes.bool,
};

SortableList.defaultProps = {
	...SortableList.defaultProps,
	disableDragging: false,
	lockAxis: 'y',
	distance: 2,
	helperClass: 'dragging',
	linkGen: () => false,
};

export default SortableList;
