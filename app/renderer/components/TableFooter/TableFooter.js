import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import './TableFooter.styl';

export default class TableFooter extends Component {
	static propTypes = {
		children: PropTypes.any,
		sticky: PropTypes.bool
	};

	static defaultProps = {
		sticky: false
	};

	render () {
		const { children, sticky } = this.props;
		const classes = classnames({
			'table__footer': true, // eslint-disable-line quote-props
			'table__footer--sticky': sticky
		});

		return (
			<div className={classes}>{children}</div>
		);
	}
}
