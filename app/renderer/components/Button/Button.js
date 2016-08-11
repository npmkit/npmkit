import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classnames from 'classnames';

import SvgIcon from 'components/SvgIcon';
import './Button.styl';

export default class Button extends Component {
	static propTypes = {
		align: PropTypes.string,
		borderless: PropTypes.bool,
		children: PropTypes.any,
		className: PropTypes.string,
		disabled: PropTypes.bool,
		icon: PropTypes.string,
		inline: PropTypes.bool,
		onClick: PropTypes.func,
		size: PropTypes.oneOf([ 'small', 'medium', 'large' ]),
		transparent: PropTypes.bool,
		wide: PropTypes.bool
	};

	static defaultProps = {
		borderless: false,
		size: 'medium',
		transparent: false,
		inline: false,
		wide: false,
		disabled: false,
		align: 'center'
	};

	shouldComponentUpdate (nextProps) {
		return shallowCompare(this, nextProps, null);
	}

	_renderIcon () {
		if (!this.props.icon) {
			return null;
		}

		let iconSize;

		switch (this.props.size) {
			case 'small':
				iconSize = 13;
				break;

			default:
			case 'medium':
				iconSize = 24;
				break;

			case 'large':
				iconSize = 19;
				break;
		}

		return (
			<SvgIcon
				code={this.props.icon}
				height={iconSize}
				width={iconSize}
			/>
		);
	}

	_renderLabel () {
		if (this.props.children) {
			return <span className='button__label'>{this.props.children}</span>;
		}

		return null;
	}

	render () {
		const { onClick, inline, wide } = this.props;
		const isSmall = this.props.size === 'small';
		const isMedium = this.props.size === 'medium';
		const isLarge = this.props.size === 'large';
		const isTransparent = this.props.transparent === true;
		const isDisabled = this.props.disabled === true;
		const isBorderless = this.props.borderless === true;

		const classes = classnames(this.props.className, {
			button: true,
			'button--inline': inline,
			'button--small': isSmall,
			'button--medium': isMedium,
			'button--large': isLarge,
			'button--transparent': isTransparent,
			'button--borderless': isBorderless,
			'button--wide': wide,
			'button--disabled': isDisabled,
			'button--align-left': this.props.align === 'left',
			'button--align-center': this.props.align === 'center',
			'button--align-right': this.props.align === 'right'
		});

		return (
			<button
				className={classes}
				disabled={isDisabled}
				onClick={onClick}
			>
				{this._renderIcon()}
				{this._renderLabel()}
			</button>
		);
	}
}
