import React, { Component, PropTypes } from 'react';
import { pick } from 'utils/ObjectUtils';

export default class InputTextArea extends Component {
	static propTypes = {
		disabled: PropTypes.bool,
		onChange: PropTypes.func.isRequired,
		placeholder: PropTypes.string,
		readOnly: PropTypes.bool,
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
			'autoFocus',
			'cols',
			'disabled',
			'maxLength',
			'placeholder',
			'readOnly',
			'required',
			'row'
		);

		return (
			<textarea
				{...props}
				className='input-row__control'
				onChange={this._handleChange}
				ref='input'
				value={this.props.value}
			/>
		);
	}
}
