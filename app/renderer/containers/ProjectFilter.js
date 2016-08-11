import { connect } from 'react-redux';

import ProjectFilter from 'components/ProjectFilter';
import { setProjectFilter, clearProjectsFilter } from 'actions/ProjectActions';

const mapStateToProps = (state) => ({
	keyword: state.projectsFilter
});

const mapDispatchToProps = (dispatch) => ({
	onKeywordChange: (event) => dispatch(setProjectFilter(event.target.value)),
	onClear: () => dispatch(clearProjectsFilter())
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectFilter);
