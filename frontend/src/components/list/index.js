/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import classnames from 'classnames';
import getColorsFromName from '../../utils/colorFromName';
import OptionalNavLink from '../optionalLink';

import './list.scss';

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

const SortableItem = SortableElement(
	({
		item,
		actions,
		position,
		linkGen,
		colorNames,
		extraComponent: ExtraComponent,
	}) => {
		// console.log(item);
		const colors = getColorsFromName(item.name);
		const colorStyles = colorNames ? colorToStyle(colors) : {};

		return (
			<li className="trackerlist-item">
				<OptionalNavLink
					to={linkGen(item)}
					className={classnames({
						'trackerlist-item__link': true,
						'trackerlist-item__link--dead': item.stats && item.currentHP <= 0,
						'trackerlist-item__link--player': !item.stats,
					})}
				>
					<span
						className={classnames({
							'trackerlist-item__link__name': true,
							'trackerlist-item__link__name--monster': item.stats,
							'trackerlist-item__link__name--player': !item.stats,
						})}
						style={colorStyles}
					>
						{item.name}
						{!!item.affix && (
							<span className="trackerlist-item__link__name__affix">
								{' '}
								({item.affix})
							</span>
						)}
					</span>
					{!!ExtraComponent && (
						<ExtraComponent item={item} id={item.id} position={position} />
					)}
				</OptionalNavLink>

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
	},
);

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
		items,
		disableDragging,
		actions,
		linkGen,
		colorNames,
		extraComponent,
	}) => {
		return (
			<ol className="trackerlist">
				{items.map((item, index) => (
					<SortableItem
						key={item.id}
						index={index}
						position={index}
						value={item}
						item={item}
						disabled={disableDragging}
						actions={actions}
						linkGen={linkGen}
						colorNames={colorNames}
						extraComponent={extraComponent}
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
	colorNames: PropTypes.bool,
	extraComponent: PropTypes.func,
};

SortableList.defaultProps = {
	...SortableList.defaultProps,
	disableDragging: false,
	lockAxis: 'y',
	distance: 2,
	helperClass: 'dragging',
	linkGen: () => false,
	colorNames: false,
	extraComponent: null,
};

export default SortableList;
