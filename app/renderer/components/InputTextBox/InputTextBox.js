import React, { Component, PropTypes } from 'react';

import { pick } from 'utils/ObjectUtils';

export default class InputTextBox extends Component {
	static propTypes = {
		disabled: PropTypes.bool,
		onChange: PropTypes.func.isRequired,
		placeholder: PropTypes.string,
		readonly: PropTypes.bool,
		value: PropTypes.string
	};

	constructor (props) {
		super(props);

		this._handleChange = this._handleChange.bind(this);
	}

	_handleChange (event) {
		this.props.onChange(event.target.value, this.props.value);
	}

	focus () {
		this.refs.input.focus();
	}

	render () {
		const props = pick(
			this.props,
			'disabled',
			'maxlength',
			'pattern',
			'placeholder',
			'readonly',
			'required',
			'size',
			'value'
		);

		return (
			<input
				{...props}
				className='input-row__control'
				onChange={this._handleChange}
				ref='input'
				type='text'
				value={this.props.value}
			/>
		);
	}
}
