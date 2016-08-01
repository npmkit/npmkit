import { connect } from 'react-redux';

import SettingsView from '../components/SettingsView';

const mapStateToProps = (state) => ({
	node: state.node,
	npm: state.npm
});

export default connect(mapStateToProps)(SettingsView);
