import React, { Component, PropTypes } from 'react';
import combine from 'classnames';
import './TitleBarControl.styl';

export default class TitleBarControl extends Component {
	static propTypes = {
		onClick: PropTypes.func.isRequired,
		theme: PropTypes.oneOf([ 'windows', 'macos', 'linux' ]).isRequired,
		type: PropTypes.oneOf([ 'close', 'minimize', 'maximize' ]).isRequired
	};

	render () {
		const className = combine(
			'TitleBarControl',
			`TitleBarControl--${this.props.theme}`,
			`TitleBarControl--${this.props.type}`
		);

		return (
			<button
				className={className}
				onClick={this.props.onClick}
			/>
		);
	}
}
