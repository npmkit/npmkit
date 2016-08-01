import React, { Component, PropTypes } from 'react';

import { pick } from '../../utils/ObjectUtils';
import SvgIcon from '../../components/SvgIcon';
import './InputCheckBox.styl';

export default class InputCheckBox extends Component {
	static propTypes = {
		checked: PropTypes.bool,
		disabled: PropTypes.bool,
		onChange: PropTypes.func.isRequired,
		placeholder: PropTypes.string,
		readonly: PropTypes.bool
	};

	constructor (props) {
		super(props);

		this._handleChange = this._handleChange.bind(this);
	}

	_handleChange (event) {
		this.props.onChange(event.target.checked, this.props.checked);
	}

	focus () {
		this.props.onChange(!this.props.checked, this.props.checked);
	}

	render () {
		const props = pick(
			this.props,
			'disabled',
			'readonly',
			'checked'
		);

		return (
			<label className='checkbox'>
				<input
					{...props}
					checked={this.props.checked}
					className='checkbox__control'
					onChange={this._handleChange}
					ref='input'
					type='checkbox'
				/>
				<SvgIcon
					className='checkbox__icon'
					code='checkbox'
					hidden={!this.props.checked}
				/>
				<SvgIcon
					className='checkbox__icon'
					code='checkbox-outline'
					hidden={this.props.checked}
				/>
			</label>
		);
	}
}
