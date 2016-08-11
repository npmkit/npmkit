import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
	loadDependencies,
	updateAllDependencies,
	installDependency,
	uninstallDependency,
	updateDependency,
	viewDependencyPage,
	removeDependency } from 'actions/DependencyActions';
import { copyToClipboard } from 'actions/ClipboardActions';
import { getCurrentProject, getProjectDependenciesArray } from 'utils/ProjectUtils';
import Dependencies from 'components/Dependencies';

const mapStateToProps = (state) => {
	const project = getCurrentProject(state.projects, state.activeProjectCode);
	const dependencies = getProjectDependenciesArray(project, state.dependenciesByIds);

	return {
		project,
		dependencies,
		networkStatus: state.networkStatus,
		isSearchActive: state.moduleExplorer.query.length > 0
	};
};

const mapDispatchToProps = (dispatch) => ({
	dispatch,
	actions: bindActionCreators({
		loadDependencies,
		installDependency,
		uninstallDependency,
		updateDependency,
		viewDependencyPage,
		removeDependency,
		copyToClipboard
	}, dispatch)
});

const mergeProps = (stateProps, { dispatch, actions }) => ({
	...stateProps,
	actions,
	onUpdateAll () {
		dispatch(updateAllDependencies(stateProps.project));
	},
	onInstallAll () {
		// dispatch(installMissingDependencies(stateProps.project));
	},
	onMount () {
		if (stateProps.dependencies.length === 0) {
			dispatch(loadDependencies(stateProps.project));
		}
	}
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(Dependencies);
