import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { hashHistory } from 'react-router';
import { persistState } from 'redux-devtools';
import thunk from 'redux-thunk';

import networkStatusMiddleware from 'middlewares/networkStatusMiddleware';
import notificationMiddleware from 'middlewares/notificationMiddleware';
import clipboardMiddleware from 'middlewares/clipboardMiddleware';
import npmMiddleware from 'middlewares/npmMiddleware';
import protocolMiddleware from 'middlewares/protocolMiddleware';
import rootReducer from 'reducers/index';
import DevTools from 'containers/DevTools';

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
	DevTools.instrument(),
	persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
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
