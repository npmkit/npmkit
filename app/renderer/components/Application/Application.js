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

	render () {
		return (
			<div className='Application'>
				<TitleBar />
				<div className='Application-layout'>
					<Sidebar />
					{this.props.children}
				</div>
			</div>
		);
	}
}
