import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import './TabsItem.styl';

export default class TabsItem extends Component {
	static propTypes = {
		label: PropTypes.string.isRequired,
		link: PropTypes.string.isRequired
	};

	render () {
		const { label, link } = this.props;

		return (
			<Link
				activeClassName='TabsItem--active'
				className='TabsItem'
				to={link}
			>{label}</Link>
		);
	}
}
