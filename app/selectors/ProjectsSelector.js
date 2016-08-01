import firstBy from 'thenby';

/**
 * Select sorted and filtered projects
 *
 * @param {Object} state
 * @return {Array<Object>}
 */
export function projectsSelector (state) {
	return state
		.projects
		.sort(firstBy('starred', -1).thenBy(project =>
			project.data.name
		))
		.filter(project =>
			project.data.name.toLowerCase().indexOf(state.projectsFilter) > -1
		);
}
