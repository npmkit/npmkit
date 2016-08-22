import React, { Component, PropTypes, createElement } from 'react';
import combine from 'classnames';
import { v4 } from 'node-uuid';
import './InputRow.styl';

export default class FormRow extends Component {
	static propTypes = {
		children: PropTypes.any,
		component: PropTypes.any,
		disabled: PropTypes.bool,
		label: PropTypes.string.isRequired,
		onChange: PropTypes.func,
		readOnly: PropTypes.bool,
		required: PropTypes.bool,
		width: PropTypes.number
	};

	static defaultProps = {
		disabled: false,
		readOnly: false
	};

	componentWillMount () {
		this._id = v4();
	}

	render () {
		const {
			label,
			disabled,
			readOnly,
			required
		} = this.props;

		const classes = combine({
			'input-row': true,
			'input-row--disabled': disabled,
			'input-row--readonly': readOnly,
			'input-row--required': required
		});

		const { component, ...rest } = this.props;

		return (
			<div className={classes}>
				<label
					className='input-row__label'
					htmlFor={this._id}
					onClick={this._handleLabelClick}
				>{label}</label>
				{createElement(component, { ...rest, id: this._id })}
			</div>
		);
	}
}
