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
			SidebarSection: true,
			'SidebarSection--expanded': isExpanded
		});

		return (
			<div className={classes}>
				<Link className='SidebarSection-label' to={link}>
					<span className='SidebarSection-labelText'>{label}</span>
				</Link>
				<div className='SidebarSection-contents'>{children}</div>
			</div>
		);
	}
}
