import { handleActions } from 'redux-actions';

import { NETWORK_STATUS_CHANGE } from 'constants/ActionTypes';

export const initialState = {
	online: null
};

export default handleActions({
	[NETWORK_STATUS_CHANGE]: (state, action) => ({
		online: action.payload.online
	})
}, initialState);
