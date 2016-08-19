import { connect } from 'react-redux';

import { projectsSelector } from 'selectors/ProjectsSelector';
import Sidebar from 'components/Sidebar';

const mapStateToProps = (state) => ({
	projects: projectsSelector(state),
	totalProjectsCount: state.projects.length
});

export default connect(
	mapStateToProps
)(Sidebar);
