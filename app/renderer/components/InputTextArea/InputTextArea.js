import React, { Component, PropTypes } from 'react';

export default class InputTextArea extends Component {
	static propTypes = {
		onChange: PropTypes.func.isRequired,
		value: PropTypes.string
	};

	constructor (props) {
		super(props);

		this._handleChange = this._handleChange.bind(this);
	}

	_handleChange (event) {
		this.props.onChange(event.target.value, this.props.value);
	}

	render () {
		return (
			<textarea
				{...this.props}
				className='input-row__control'
				onChange={this._handleChange}
			/>
		);
	}
}
