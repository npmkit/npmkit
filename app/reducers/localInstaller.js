import { handleActions } from 'redux-actions';

import { DependencyCategoryEnum } from '../constants/Enums';
import {
	PROJECT_PICKER_SET_PACKAGES,
	PROJECT_PICKER_SET_PROJECT,
	PROJECT_PICKER_SET_CATEGORY } from '../constants/ActionTypes';

const initialState = {
	projectCode: null,
	packages: [],
	targetCategory: DependencyCategoryEnum.PROD
};

export default handleActions({
	[PROJECT_PICKER_SET_PACKAGES]: (state, action) => ({
		...state,
		packages: action.payload.packages
	}),
	[PROJECT_PICKER_SET_PROJECT]: (state, action) => ({
		...state,
		projectCode: action.payload.projectCode
	}),
	[PROJECT_PICKER_SET_CATEGORY]: (state, action) => ({
		...state,
		targetCategory: action.payload.category
	})
}, initialState);
