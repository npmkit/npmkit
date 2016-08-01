import { connect } from 'react-redux';

import { loadProjects } from '../actions/ProjectActions';
import { loadNpmInfo, loadNodeInfo } from '../actions/NodeActions';
import { setNetworkOffline, setNetworkOnline } from '../actions/NetworkStatusActions';
import Root from '../components/Root';

const mapDispatchToProps = (dispatch) => ({
	onMount: () => {
		dispatch(loadProjects());
		dispatch(loadNodeInfo());
		dispatch(loadNpmInfo());
		dispatch(navigator.onLine ? setNetworkOnline() : setNetworkOffline());
	}
});

export default connect(
	null,
	mapDispatchToProps
)(Root);
