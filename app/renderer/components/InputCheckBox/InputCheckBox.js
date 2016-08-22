import React, { Component, PropTypes } from 'react';
import { v4 } from 'node-uuid';
import SvgIcon from 'components/SvgIcon';
import './InputCheckBox.styl';

export default class InputCheckBox extends Component {
	static propTypes = {
		checked: PropTypes.bool,
		disabled: PropTypes.bool,
		onChange: PropTypes.func.isRequired,
		placeholder: PropTypes.string,
		readOnly: PropTypes.bool
	};

	constructor (props) {
		super(props);

		this._handleChange = this._handleChange.bind(this);
	}

	componentWillMount () {
		this.id = v4();
	}

	_handleChange (event) {
		this.props.onChange(event.target.checked, this.props.checked);
	}

	focus () {
		this.props.onChange(!this.props.checked, this.props.checked);
	}

	render () {
		const { disabled, readOnly, checked } = this.props;
		const props = { disabled, readOnly, checked };

		return (
			<label
				className='checkbox'
				htmlFor={this.id}
			>
				<input
					{...props}
					checked={this.props.checked}
					className='checkbox__control'
					id={this.id}
					onChange={this._handleChange}
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
