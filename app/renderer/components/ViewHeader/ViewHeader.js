import React, { Component, PropTypes } from 'react';
import './ViewHeader.styl';

export default class ViewHeader extends Component {
	static propTypes = {
		children: PropTypes.any.isRequired
	};

	render () {
		return <header className='view-header'>{this.props.children}</header>;
	}
}
