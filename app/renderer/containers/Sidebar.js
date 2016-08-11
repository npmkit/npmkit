import { connect } from 'react-redux';

import { projectsSelector } from 'selectors/ProjectsSelector';
import Sidebar from 'components/Sidebar';

const mapStateToProps = (state) => ({
	projects: projectsSelector(state)
});

export default connect(
	mapStateToProps
)(Sidebar);
