import { shell } from 'electron';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { startScript, stopScript } from 'actions/ScriptActions';
import { starProject, unstarProject, forgetProject } from 'actions/ProjectActions';
import { getProjectScriptsArray } from 'utils/ProjectUtils';
import { copyToClipboard } from 'actions/ClipboardActions';
import SidebarProject from 'components/SidebarProject';

const mapStateToProps = (state, props) => ({
	scripts: getProjectScriptsArray(props.project, state.scriptsByIds)
});

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		stopScript,
		startScript
	}, dispatch),
	onCopyPath: (project) => {
		dispatch(copyToClipboard(project.path));
	},
	onRemove: (project) => {
		dispatch(forgetProject(project));
	},
	onShowInFolder: (project) => {
		shell.showItemInFolder(project.path);
	},
	onStar: (project) => {
		dispatch(starProject(project));
	},
	onUnstar: (project) => {
		dispatch(unstarProject(project));
	}
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SidebarProject);
