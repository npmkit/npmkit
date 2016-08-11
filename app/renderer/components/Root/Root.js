import { Component, PropTypes } from 'react';

const keys = new Set;

export default class Root extends Component {
	static propTypes = {
		children: PropTypes.any,
		onMount: PropTypes.func.isRequired
	};

	componentWillMount () {

		// Fire initial events
		this.props.onMount();

		// Prevent page refresh
		document.addEventListener('keydown', event => {
			keys.add(event.keyCode);

			// (Ctrl|Cmd) + R
			if ((keys.has(17) || keys.has(91)) && keys.has(82)) {
				event.preventDefault();
				event.stopPropagation();
			}
		});

		document.addEventListener('keyup', event => {
			if (keys.has(event.keyCode)) {
				keys.delete(event.keyCode);
			}
		});
	}

	render () {
		return this.props.children;
	}
}
