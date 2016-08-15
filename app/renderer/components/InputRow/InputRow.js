import React, { Component, PropTypes, createElement } from 'react';
import classnames from 'classnames';

import './InputRow.styl';

export default class FormRow extends Component {
	static propTypes = {
		children: PropTypes.any,
		component: PropTypes.any,
		disabled: PropTypes.bool,
		hint: PropTypes.string,
		hintOnHover: PropTypes.bool,
		label: PropTypes.string.isRequired,
		onChange: PropTypes.func,
		readOnly: PropTypes.bool,
		required: PropTypes.bool,
		width: PropTypes.number
	};

	static defaultProps = {
		hintOnHover: false,
		disabled: false,
		readOnly: false
	};

	constructor (props) {
		super(props);

		this._handleLabelClick = this._handleLabelClick.bind(this);
	}

	_handleLabelClick () {
		this.refs.input.focus();
	}

	render () {
		const {
			label,
			disabled,
			readOnly,
			required,
			hintOnHover
		} = this.props;

		const classes = classnames({
			'input-row': true,
			'input-row--disabled': disabled,
			'input-row--readonly': readOnly,
			'input-row--required': required,
			'input-row--hint-on-hover': hintOnHover
		});

		const { component, ...rest } = this.props;

		return (
			<div className={classes}>
				<label
					className='input-row__label'
					onClick={this._handleLabelClick}
				>{label}</label>
				{createElement(component, { ...rest, ref: 'input' })}
				{this.props.hint &&
					<div className='input-row__hint'>{this.props.hint}</div>
				}
			</div>
		);
	}
}
