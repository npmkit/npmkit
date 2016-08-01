import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import networkStatusReducer from './networkStatus';
import activeProjectReducer from './activeProjectCode';
import projectsFilterReducer from './projectsFilter';
import projectsReducer from './projects';
import scriptsReducer from './scripts';
import dependenciesReducer from './dependencies';
import npmReducer from './npm';
import nodeReducer from './node';
import moduleExplorerReducer from './moduleExplorer';
import localInstallerReducer from './localInstaller';

const rootReducer = combineReducers({

	// Common reducers
	routing: routerReducer,
	node: nodeReducer,
	npm: npmReducer,
	networkStatus: networkStatusReducer,
	projects: projectsReducer,
	projectsFilter: projectsFilterReducer,
	scriptsByIds: scriptsReducer,
	dependenciesByIds: dependenciesReducer,

	// Main app reducers
	activeProjectCode: activeProjectReducer,
	moduleExplorer: moduleExplorerReducer,

	// Protocol app reducers
	localInstaller: localInstallerReducer
});

export default rootReducer;
