import { connect } from 'react-redux';

import { startScript, stopScript, toggleOutput, loadScripts } from 'actions/ScriptActions';
import { getCurrentProject, getProjectScriptsArray } from 'utils/ProjectUtils';
import { copyToClipboard } from 'actions/ClipboardActions';
import Scripts from 'components/Scripts';

const mapStateToProps = (state, props) => {
	const project = getCurrentProject(state.projects, props.params.projectCode);
	const scripts = getProjectScriptsArray(project, state.scriptsByIds);

	return { project, scripts };
};

const mapDispatchToProps = (dispatch) => ({ dispatch });

const mergeProps = ({ project, scripts }, { dispatch }) => ({
	scripts,
	onStart (script) {
		dispatch(startScript(project, script));
	},
	onStartSudo (script) {
		dispatch(startScript(project, script, { sudo: true }));
	},
	onStop (script) {
		dispatch(stopScript(project, script));
	},
	onCopyCommand (script) {
		dispatch(copyToClipboard(script.command));
	},
	onToggleOutput (script) {
		dispatch(toggleOutput(script));
	},
	onMount () {
		if (project.scripts.length === 0) {
			dispatch(loadScripts(project));
		}
	}
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(Scripts);
