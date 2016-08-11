import React, { Component, PropTypes } from 'react';

export default class ViewProperty extends Component {
	static propTypes = {
		name: PropTypes.string.isRequired,
		value: PropTypes.any.isRequired
	};

	render () {
		const { name, value } = this.props;

		return (
			<div className='view__property property'>
				<span className='property__name'>{name}</span>
				<span className='property__value'>{value}</span>
			</div>
		);
	}
}
