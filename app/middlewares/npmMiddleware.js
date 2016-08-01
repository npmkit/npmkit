import { DEPENDENCY_VIEW_PAGE } from '../constants/ActionTypes';
import { shell } from 'electron';

/**
 * @return {Function}
 */
export default function npmMiddleware () {
	return (next) => (action) => {
		switch (action.type) {
			case DEPENDENCY_VIEW_PAGE:
				shell.openExternal(`https://www.npmjs.com/package/${action.payload.dependency.name}`);
				break;

			default:
				break;
		}

		return next(action);
	};
}
