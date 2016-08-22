import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import './SidebarLink.styl';

export default class SidebarSection extends Component {
	static propTypes = {
		activeStyle: PropTypes.object,
		children: PropTypes.any.isRequired,
		className: PropTypes.string,
		to: PropTypes.string.isRequired
	};

	render () {
		const { children } = this.props;
		const classes = classnames('sidebar-item', this.props.className);

		return (
			<Link{...this.props} className={classes}>{children}</Link>
		);
	}
}
