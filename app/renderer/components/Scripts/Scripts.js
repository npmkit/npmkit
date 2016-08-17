import React, { Component, PropTypes } from 'react';

import ScriptRow from 'components/ScriptRow';
import Table from 'components/Table';
import TableHead from 'components/TableHead';
import TableBody from 'components/TableBody';
import TableCell from 'components/TableCell';
import './Scripts.styl';

export default class Scripts extends Component {
	static propTypes = {
		onCopyCommand: PropTypes.func.isRequired,
		onMount: PropTypes.func.isRequired,
		onStart: PropTypes.func.isRequired,
		onStartSudo: PropTypes.func.isRequired,
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
							onStartSudo={this.props.onStartSudo}
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
