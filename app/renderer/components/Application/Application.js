import React, { Component, PropTypes } from 'react';
import { remote } from 'electron';

import Sidebar from 'containers/Sidebar';
import TitleBar from 'components/TitleBar';
import './Application.styl';

export default class Application extends Component {
	/**
	 * propTypes
	 *
	 * @property {*} Component children
	 * @property {Function} Callback to call once app is mounted
	 */
	static propTypes = {
		children: PropTypes.node.isRequired
	};

	componentWillMount () {
		const mainWindow = remote.getCurrentWindow();
		const [ width, height ] = [ 870, 580 ];
		const [ maxWidth, maxHeight ] = [ 800, 500 ];

		mainWindow.setMinimumSize(maxWidth, maxHeight);
		mainWindow.setSize(width, height);
		mainWindow.setMaximizable(true);
		mainWindow.setResizable(true);
		mainWindow.setAlwaysOnTop(false);
	}

	_renderDevTools () {
		return (
			process.env.NODE_ENV === 'development' ?
			(() => {
				const DevTools = require('containers/DevTools'); // eslint-disable-line global-require

				return <DevTools />;
			})() :
			null
		);
	}

	render () {
		return (
			<div className='Application'>
				<TitleBar />
				<div className='Application-layout'>
					<Sidebar />
					{this.props.children}
					{this._renderDevTools()}
				</div>
			</div>
		);
	}
}
