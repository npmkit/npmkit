import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classnames from 'classnames';
import iconsPath from 'assets/icons.svg';
import './SvgIcon.styl';

export default class SvgIcon extends Component {
	static propTypes = {
		className: PropTypes.string,
		code: PropTypes.string.isRequired,
		fill: PropTypes.string,
		height: PropTypes.number,
		width: PropTypes.number
	};

	static defaultProps = {
		fill: null,
		height: 24,
		width: 24
	};

	shouldComponentUpdate (nextProps) {
		return shallowCompare(this, nextProps, null);
	}

	render () {
		const { code, fill, ...props } = this.props;

		const classes = classnames(
			this.props.className,
			'svg-icon',
			{
				'svg-icon--no-fill': fill !== null
			}
		);

		return (
			<svg {...props} className={classes}>
				<use xlinkHref={`${iconsPath}#${code}`} />
			</svg>
		);
	}
}
