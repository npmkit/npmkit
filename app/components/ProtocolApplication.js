import React, { Component, PropTypes } from 'react';

export default class ProtocolApplication extends Component {
	static propTypes = {
		children: PropTypes.any
	};

	render () {
		return (
			<div className='protocol-application'>
				{this.props.children}
			</div>
		);
	}
}
