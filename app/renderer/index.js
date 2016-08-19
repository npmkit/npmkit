/* eslint-disable react/jsx-sort-props */
import 'babel-polyfill';

import React from 'react';
import { webFrame } from 'electron';
import { hashHistory, Router, Route, IndexRoute, IndexRedirect } from 'react-router';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';

import { fixPath } from 'utils/ShellUtils';
import { setCurrentProject } from 'actions/ProjectActions';
import configureStore from 'store/store';
import Root from 'containers/Root';
import Application from 'components/Application';
import HomeView from 'containers/HomeView';
import SettingsView from 'containers/SettingsView';
import ProjectView from 'containers/ProjectView';
import ProjectInfo from 'containers/ProjectInfo';
import Scripts from 'containers/Scripts';
import Dependencies from 'containers/Dependencies';
import ProtocolApplication from 'containers/ProtocolApplication';
import LocalInstaller from 'containers/LocalInstaller';

import 'app.html';
import 'styles/root.styl';

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

// Prevent page zoom
webFrame.setZoomLevelLimits(1, 1);

// Fix PATH on OS X
fixPath();

// Handle project change
const handleProjectEnter = ({ params }) => store.dispatch(setCurrentProject(params.projectCode));
const handleProjectLeave = () => store.dispatch(setCurrentProject(null));

render(
	<Provider store={store}>
		<Router history={history}>
			<Route path='/' component={Root}>

				{/* Fix empty initial route */}
				<IndexRedirect to='main' />

				{/* Protocol app */}
				<Route path='protocol' component={ProtocolApplication}>
					<Route path='install' component={LocalInstaller} />
					<Route path='install-dev' component={LocalInstaller} />
					<Route path='install-optional' component={LocalInstaller} />
					{/* <Route path='install-global' component={GlobalInstaller} /> */}
				</Route>

				{/* Main app */}
				<Route path='main' component={Application}>

					{/* Home view */}
					<IndexRedirect to='/projects' />

					{/* Project view */}
					<Route path='/projects'>
						<IndexRoute component={HomeView} />
						<Route
							path=':projectCode'
							component={ProjectView}
							onEnter={handleProjectEnter}
							onLeave={handleProjectLeave}
						>
							<IndexRedirect to='info' />

							{/* Package project info */}
							<Route path='info' component={ProjectInfo} />

							{/* Project's npm scripts */}
							<Route path='tasks' component={Scripts} />

							{/* Project deps */}
							<Route path='dependencies' component={Dependencies} />
						</Route>
					</Route>

					{/* Global modules view */}
					<Route path='/modules' component={SettingsView} />

					{/* Settings view */}
					<Route path='/settings' component={SettingsView} />
				</Route>

			</Route>
		</Router>
	</Provider>,
	document.querySelector('main')
);
