import { handleActions } from 'redux-actions';
import {
	PROJECTS_FILTER_SET,
	PROJECTS_FILTER_CLEAR } from 'constants/ActionTypes';

export const initialState = '';

export default handleActions({
	[PROJECTS_FILTER_SET]: (state, action) => action.payload.keyword.trim(),

	[PROJECTS_FILTER_CLEAR]: () => initialState
}, initialState);
