import React, { Component, PropTypes } from 'react';

import './ConsoleOutput.styl';

export default class ConsoleOutput extends Component {
	static propTypes = {
		lines: PropTypes.arrayOf(PropTypes.string).isRequired
	};

	render () {
		return (
			<div className='console-output'>
				{this.props.lines.map((line, index) =>
					<div key={index}>{line || ' '}</div>
				)}
			</div>
		);
	}
}
