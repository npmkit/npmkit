import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import './StatusBall.styl';

export default class StatusBall extends Component {
	static propTypes = {
		active: PropTypes.bool
	};

	static defaultProps = {
		active: false
	};

	render () {
		const classNames = classnames({
			'status-ball': true,
			'status-ball--active': this.props.active === true
		});

		return (
			<span className={classNames} />
		);
	}
}
