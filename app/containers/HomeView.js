import { connect } from 'react-redux';

import HomeView from '../components/HomeView';

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
