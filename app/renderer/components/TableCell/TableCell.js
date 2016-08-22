import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import './TableCell.styl';

export default class TableCell extends Component {
	static propTypes = {
		align: PropTypes.string,
		children: PropTypes.any,
		className: PropTypes.string,
		flex: PropTypes.number,
		hidden: PropTypes.bool,
		width: PropTypes.number
	};

	static defaultProps = {
		align: 'left'
	};

	render () {
		const { className, align, hidden, children, flex } = this.props;
		const classes = classnames(className, 'table__cell', {
			'table__cell--left': align === 'left',
			'table__cell--center': align === 'center',
			'table__cell--right': align === 'right'
		});

		return (
			<div
				className={classes}
				hidden={hidden}
				style={{ flex }}
			>{children}</div>
		);
	}
}
