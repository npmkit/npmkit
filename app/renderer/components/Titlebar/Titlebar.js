import React, { Component, PropTypes } from 'react';
import combine from 'classnames';

import TitleBarControl from 'components/TitleBarControl';
import './TitleBar.styl';

function getCurrentTheme () {
	switch (process.platform) {
		case 'win32':
			return 'windows';

		case 'darwin':
			return 'macos';

		default:
			return 'linux';
	}
}

export default class TitleBar extends Component {
	static propTypes = {
		children: PropTypes.string
	};

	render () {
		const theme = getCurrentTheme();
		const className = combine(
			'TitleBar',
			`TitleBar--${theme}`
		);

		return (
			<div className={className}>
				<div className='TitleBar-controls'>
					<TitleBarControl theme={theme} type='close' />
					<TitleBarControl theme={theme} type='minimize' />
					<TitleBarControl theme={theme} type='maximize' />
				</div>
				<div className='TitleBar-label'>
					{this.props.children}
				</div>
			</div>
		);
	}
}
