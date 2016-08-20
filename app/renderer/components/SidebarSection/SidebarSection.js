import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

import './SidebarSection.styl';

export default class SidebarSection extends Component {
	static propTypes = {
		children: PropTypes.any,
		icon: PropTypes.string,
		label: PropTypes.string.isRequired,
		link: PropTypes.string.isRequired
	};

	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	render () {
		const { link, label, children } = this.props;
		const isExpanded = this.context.router.isActive(link);

		const classes = classnames({
			'sidebar-section': true,
			'sidebar-section--expanded': isExpanded
		});

		return (
			<div className={classes}>
				<Link className='sidebar-section__label' to={link}>
					<span className='sidebar-section__label-text'>{label}</span>
				</Link>
				<div className='sidebar-section__contents'>{children}</div>
			</div>
		);
	}
}
