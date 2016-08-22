import React, { Component, PropTypes } from 'react';
import './ButtonGroup.styl';

export default class ButtonGroup extends Component {
	static propTypes = {
		children: PropTypes.any // @todo add explicit Button check
	};

	render () {
		return (
			<div className='button-group'>{this.props.children}</div>
		);
	}
}
