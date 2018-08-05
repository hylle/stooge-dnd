import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { NavLink } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import classnames from 'classnames';

import './list.css';

// item.stats
// 	? `/initiative/monster/${item.stats.index}`
// 	: `/initiative/player/${item.name.toLowerCase()}`

const SortableItem = ({
	item, actions, index, linkGen,
}) => {
	// console.log(item);
	const link = linkGen(item);

	return (
		<Draggable draggableId={item.id} key={item.id} index={index}>
			{(provided, snapshot) => (
				<li
					className="trackerlist-item"
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					// style={getItemStyle(
					// 	snapshot.isDragging,
					// 	provided.draggableProps.style
					// )}
				>
					{(!!link && (
						<NavLink to={linkGen(item)} className="trackerlist-item__link">
							<span
								className={classnames({
									'trackerlist-item__link__name': true,
									'trackerlist-item__link__name--monster': item.stats,
									'trackerlist-item__link__name--player': !item.stats,
								})}
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
							>
								{item.name}
							</span>
						</div>
					)}

					<span className="trackerlist-item__actions">
						{actions.map((action) => (
							<button
								key={action.key}
								type="submit"
								className="trackerlist-item__actions__button"
								onClick={() => action.onClick(index)}
								title={action.title}
							>
								<img src={action.glyph} alt="-" height="20" width="20" />
							</button>
						))}
					</span>
				</li>
			)}
		</Draggable>
	);
};

SortableItem.propTypes = {
	actions: PropTypes.arrayOf(PropTypes.shape({})),
	linkGen: PropTypes.func,
};

SortableItem.defaultProps = {
	actions: [],
	linkGen: () => false,
};

export default class SortableList extends Component {
	static propTypes = {
		items: PropTypes.arrayOf(
			PropTypes.shape({
				name: PropTypes.string.isRequired,
			}),
		).isRequired,
		onSortEnd: PropTypes.func.isRequired,
	};

	static defaultProps = {};

	render() {
		const { items } = this.props;
		return (
			<DragDropContext
				onDragStart={this.onDragStart}
				onDragUpdate={this.onDragUpdate}
				onDragEnd={this.onDragEnd}
			>
				<Droppable droppableId="list">
					{(provided, snapshot) => (
						<ol
							className="trackerlist"
							ref={provided.innerRef}
							// style={{
							// 	backgroundColor: snapshot.isDraggingOver ? 'blue' : 'grey',
							// }}
							{...provided.droppableProps}
						>
							{items.map((item, index) => (
								<SortableItem
									key={item.id}
									index={index}
									item={item}
									{...this.props}
								/>
							))}
							{provided.placeholder}
						</ol>
					)}
				</Droppable>
			</DragDropContext>
		);
	}

	onDragStart = () => {
		/* ... */
	};

	onDragUpdate = () => {
		/* ... */
	};

	onDragEnd = (result) => {
		const { onSortEnd } = this.props;
		// console.log(result.source.index, result.destination.index);
		if (typeof result.source.index === 'number' && typeof result.destination.index === 'number') {
			onSortEnd({
				oldIndex: result.source.index,
				newIndex: result.destination.index,
			});
		}
	};
}
