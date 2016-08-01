import { connect } from 'react-redux';

import { getCurrentProject } from '../utils/ProjectUtils';
import { updateProjectData } from '../actions/ProjectActions';
import ProjectInfo from '../components/ProjectInfo';

const mapStateToProps = (state, props) => ({
	project: getCurrentProject(state.projects, props.params.projectCode)
});

const mapDispatchToProps = (dispatch) => ({ dispatch });

const mergeProps = ({ project }, { dispatch }) => ({
	project,
	onNameChange (value) {
		dispatch(updateProjectData(project, 'name', value));
	},
	onVersionChange (value) {
		dispatch(updateProjectData(project, 'version', value));
	},
	onDescriptionChange (value) {
		dispatch(updateProjectData(project, 'description', value));
	},
	onAuthorChange (value) {
		dispatch(updateProjectData(project, 'author', value));
	},
	onMainFileChange (value) {
		dispatch(updateProjectData(project, 'main', value));
	},
	onIsPrivateChange (value) {
		dispatch(updateProjectData(project, 'private', value));
	},
	onPreferGlobalChange (value) {
		dispatch(updateProjectData(project, 'preferGlobal', value));
	}
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(ProjectInfo);
