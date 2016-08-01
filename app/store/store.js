/* eslint-disable global-require */
export default (
	process.env.NODE_ENV === 'development' ?
	require('./store.development') :
	require('./store.production')
);
