/* eslint-disable global-require */
export default (
	process.env.NODE_ENV === 'development' ?
	require('store/store.development') :
	require('store/store.production')
);
