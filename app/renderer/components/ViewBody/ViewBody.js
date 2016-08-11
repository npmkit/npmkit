import React, { Component, PropTypes } from 'react';

import './ViewBody.styl';

export default class ViewBody extends Component {
	static propTypes = {
		children: PropTypes.any.isRequired
	};

	render () {
		return <div className='view-body'>{this.props.children}</div>;
	}
}
