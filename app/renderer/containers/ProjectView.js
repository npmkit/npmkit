import { connect } from 'react-redux';
import { getCurrentProject } from 'utils/ProjectUtils';
import { starProject, unstarProject } from 'actions/ProjectActions';
import ProjectView from 'components/ProjectView';

const mapStateToProps = (state, props) => ({
	project: getCurrentProject(state.projects, props.params.projectCode),
	children: props.children
});

const mapDispatchToProps = (dispatch) => ({ dispatch });

const mergeProps = ({ project, children }, { dispatch }) => ({
	project,
	children,
	onToggleStar () {
		if (project.starred) {
			dispatch(unstarProject(project));
		} else {
			dispatch(starProject(project));
		}
	}
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(ProjectView);
