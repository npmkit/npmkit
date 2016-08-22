import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import networkStatusReducer from 'reducers/networkStatus';
import activeProjectReducer from 'reducers/activeProjectCode';
import projectsFilterReducer from 'reducers/projectsFilter';
import projectsReducer from 'reducers/projects';
import scriptsReducer from 'reducers/scripts';
import dependenciesReducer from 'reducers/dependencies';
import npmReducer from 'reducers/npm';
import nodeReducer from 'reducers/node';
import moduleExplorerReducer from 'reducers/moduleExplorer';
import localInstallerReducer from 'reducers/localInstaller';

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
