import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';

import IconRemove from './remove.svg';

import './list.css';

const SortableItem = SortableElement(({ value, remove }) => {
	// console.log(value);
	return (
		<li className="trackerlist-item">
			<NavLink
				to={
					value.stats
						? `/initiative/monster/${value.stats.index}`
						: `/initiative/player/${value.name.toLowerCase()}`
				}
				className="trackerlist-item__link"
			>
				<span
					className={classnames({
						'trackerlist-item__link__name': true,
						'trackerlist-item__link__name--monster': value.stats,
						'trackerlist-item__link__name--player': !value.stats,
					})}
				>
					{value.name}
				</span>
			</NavLink>
			<span className="trackerlist-item__actions">
				<button
					type="submit"
					className="trackerlist-item__actions__button"
					onClick={remove}
				>
					<img src={IconRemove} alt="-" title="Remove" height="20" width="20" />
				</button>
			</span>
		</li>
	);
});

const SortableList = SortableContainer(({ items, remove }) => {
	return (
		<ol className="trackerlist">
			{items.map((value, index) => (
				<SortableItem
					key={`item-${value.name}`}
					index={index}
					value={value}
					remove={(e) => remove(index)}
				/>
			))}
		</ol>
	);
});

export default SortableList;
export { SortableItem, SortableList };
