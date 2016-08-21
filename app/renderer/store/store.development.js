import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { hashHistory } from 'react-router';
import thunk from 'redux-thunk';

import networkStatusMiddleware from 'middlewares/networkStatusMiddleware';
import notificationMiddleware from 'middlewares/notificationMiddleware';
import clipboardMiddleware from 'middlewares/clipboardMiddleware';
import npmMiddleware from 'middlewares/npmMiddleware';
import protocolMiddleware from 'middlewares/protocolMiddleware';
import rootReducer from 'reducers/index';

const composedStore = compose(
	applyMiddleware(
		thunk,
		routerMiddleware(hashHistory),
		clipboardMiddleware,
		npmMiddleware,
		protocolMiddleware,
		networkStatusMiddleware,
		notificationMiddleware
	),
	window.devToolsExtension ? window.devToolsExtension() : (f) => f
);

const finalCreateStore = composedStore(createStore);

export default function configureStore (initialState) {
	const store = finalCreateStore(rootReducer, initialState);

	if (module.hot) {
		module.hot.accept('reducers/index', () =>
			store.replaceReducer(require('reducers/index')) // eslint-disable-line global-require
		);
	}

	return store;
}
