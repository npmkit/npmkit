import React, { Component, PropTypes } from 'react';

import './Tabs.styl';

export default class Tabs extends Component {
	static propTypes = {
		children: PropTypes.array.isRequired
	};

	render () {
		const { children } = this.props;

		return (
			<div className='Tabs'>{children}</div>
		);
	}
}
