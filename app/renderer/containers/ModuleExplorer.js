import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { getCurrentProject, getProjectDependenciesArray } from 'utils/ProjectUtils';
import { searchModules, clearModuleSearch } from 'actions/ModuleExplorerActions';
import { addDependency } from 'actions/DependencyActions';
import ModuleExplorer from 'components/ModuleExplorer';

const mapStateToProps = (state) => {
	const project = getCurrentProject(state.projects, state.activeProjectCode);
	const projectDependencies = getProjectDependenciesArray(project, state.dependenciesByIds);
	const installedDependencies = projectDependencies.filter(dependency =>
		dependency.currentVersion !== null
	);

	return {
		...state.moduleExplorer,
		installedDependencies,
		project
	};
};

const mapDispatchToProps = (dispatch) => ({ dispatch });

const mergeProps = (stateProps, { dispatch }) => ({
	...stateProps,
	onInstall (module) {
		dispatch(addDependency(stateProps.project, module));
		dispatch(push(`/projects/${stateProps.project.code}/dependencies`));
	},
	onCancel () {
		dispatch(clearModuleSearch());
	},
	onSearch (keyword) {
		dispatch(searchModules(keyword));
	}
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(ModuleExplorer);
