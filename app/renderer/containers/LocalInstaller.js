import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { projectsSelector } from 'selectors/ProjectsSelector';
import LocalInstaller from 'components/LocalInstaller';
import { setPickerProject } from 'actions/ProtocolActions';

const mapStateToProps = (state, props) => ({
	projects: projectsSelector(state),
	installer: state.localInstaller,
	packages: props.location.query.packages.split(';') || []
});

const mapDispatchToProps = (dispatch) => ({
	onPick (projectCode) {
		dispatch(setPickerProject(projectCode));
	},
	onCancel () {
		dispatch(push('/'));
	}
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LocalInstaller);
