import React, { Component, PropTypes } from 'react';
import combine from 'classnames';
import { remote } from 'electron';

import TitleBarControl from 'components/TitleBarControl';
import './TitleBar.styl';

const currentWindow = remote.getCurrentWindow();

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

	constructor (props) {
		super(props);

		this._handleClose = this._handleClose.bind(this);
		this._handleMinimize = this._handleMinimize.bind(this);
		this._handleMaximize = this._handleMaximize.bind(this);
	}

	_handleClose () {
		if (process.platform === 'darwin') {
			currentWindow.hide();
		} else {
			currentWindow.close();
		}
	}

	_handleMinimize () {
		currentWindow.minimize();
	}

	_handleMaximize () {
		if (currentWindow.isMaximized()) {
			currentWindow.unmaximize();
		} else {
			currentWindow.maximize();
		}

	}

	render () {
		const theme = getCurrentTheme();
		const className = combine(
			'TitleBar',
			`TitleBar--${theme}`
		);

		return (
			<div className={className}>
				<div className='TitleBar-controls'>
					<TitleBarControl
						onClick={this._handleClose}
						theme={theme}
						type='close'
					/>
					<TitleBarControl
						onClick={this._handleMinimize}
						theme={theme}
						type='minimize'
					/>
					<TitleBarControl
						onClick={this._handleMaximize}
						theme={theme}
						type='maximize'
					/>
				</div>
				<div className='TitleBar-label'>
					{this.props.children}
				</div>
			</div>
		);
	}
}
