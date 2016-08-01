import React, { Component, PropTypes } from 'react';

import ScriptRow from '../ScriptRow';
import Table from '../Table';
import TableHead from '../TableHead';
import TableBody from '../TableBody';
import TableCell from '../TableCell';
import './Scripts.styl';

export default class Scripts extends Component {
	static propTypes = {
		onCopyCommand: PropTypes.func.isRequired,
		onMount: PropTypes.func.isRequired,
		onStart: PropTypes.func.isRequired,
		onStop: PropTypes.func.isRequired,
		onToggleOutput: PropTypes.func.isRequired,
		scripts: PropTypes.arrayOf(PropTypes.object)
	};

	componentWillMount () {
		this.props.onMount();
	}

	render () {
		return (
			<Table>
				<TableHead>
					<TableCell>Name</TableCell>
					<TableCell>Actions</TableCell>
					<TableCell flex={2}>Command</TableCell>
				</TableHead>
				<TableBody>
					{this.props.scripts.map(script =>
						<ScriptRow
							key={script.id}
							onCopyCommand={this.props.onCopyCommand}
							onStart={this.props.onStart}
							onStop={this.props.onStop}
							onToggleOutput={this.props.onToggleOutput}
							script={script}
						/>
					)}
				</TableBody>
			</Table>
		);
	}
}
