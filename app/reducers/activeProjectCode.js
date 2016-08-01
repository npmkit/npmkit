import { handleActions } from 'redux-actions';

import { PROJECT_SET_ACTIVE } from '../constants/ActionTypes';

export const initialState = null;

export default handleActions({
	[PROJECT_SET_ACTIVE]: (state, action) => action.payload.projectCode
}, initialState);
