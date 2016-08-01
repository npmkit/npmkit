import { handleActions } from 'redux-actions';

import {
	DEPENDENCY_INSTALL_START,
	DEPENDENCY_INSTALL_FINISH,
	DEPENDENCY_UNINSTALL_START,
	DEPENDENCY_UNINSTALL_FINISH,
	DEPENDENCY_SET_WANTED_VERSION,
	DEPENDENCY_LATEST_VERSION_RECEIVE } from '../constants/ActionTypes';
import { DependencyStatusEnum } from '../constants/Enums';
import { checkUpdateAvailability } from '../utils/DependenciesUtils';

export const initialState = {
	id: -1,
	name: '',
	category: null,
	source: '',
	currentVersion: undefined,
	wantedVersion: null,
	latestVersion: undefined,
	isCurrentVersionSatisfiesWanted: null,
	hasUpdate: false,
	hasUpgrade: false, // @todo
	updateType: null,
	status: DependencyStatusEnum.IDLE
};

export default handleActions({
	[DEPENDENCY_INSTALL_START]: (state) => ({
		...state,
		status: DependencyStatusEnum.INSTALLING
	}),

	[DEPENDENCY_UNINSTALL_START]: (state) => ({
		...state,
		status: DependencyStatusEnum.UNINSTALLING
	}),

	[DEPENDENCY_INSTALL_FINISH]: (state) => ({
		...state,
		status: DependencyStatusEnum.IDLE
	}),

	[DEPENDENCY_UNINSTALL_FINISH]: (state) => ({
		...state,
		status: DependencyStatusEnum.IDLE
	}),

	[DEPENDENCY_SET_WANTED_VERSION]: (state, action) => ({
		...state,
		source: action.payload.source
	}),

	[DEPENDENCY_LATEST_VERSION_RECEIVE]: (state, action) => { // eslint-disable-line arrow-body-style
		return checkUpdateAvailability({
			...state,
			versions: action.payload.versions,
			latestVersion: action.payload.latestVersion
		});
	}
}, initialState);
