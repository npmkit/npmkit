import { handleActions } from 'redux-actions';

import { NPM_VERSION_RECEIVE } from 'constants/ActionTypes';

const initialState = {
	installed: false,
	version: '0.0.0'
};

export default handleActions({
	[NPM_VERSION_RECEIVE]: (state, action) => ({
		...initialState,
		installed: action.payload.version !== null,
		version: action.payload.version
	})
}, initialState);
