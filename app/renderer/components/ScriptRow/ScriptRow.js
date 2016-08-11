import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import { ScriptStatusEnum } from 'constants/Enums';
import ContextMenu from 'utils/MenuUtils';
import TableRow from 'components/TableRow';
import TableCell from 'components/TableCell';
import ConsoleOutput from 'components/ConsoleOutput';
import ButtonGroup from 'components/ButtonGroup';
import Button from 'components/Button';
import './ScriptRow.styl';

export default class ScriptCard extends Component {
	static propTypes = {
		onCopyCommand: PropTypes.func.isRequired,
		onStart: PropTypes.func.isRequired,
		onStop: PropTypes.func.isRequired,
		onToggleOutput: PropTypes.func.isRequired,
		script: PropTypes.object.isRequired
	};

	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	constructor (props) {
		super(props);

		this._handleContextMenu = this._handleContextMenu.bind(this);
	}

	buildContextMenu () {
		const { script } = this.props;
		const menu = new ContextMenu();
		const isRunning = script.status === ScriptStatusEnum.RUNNING;

		menu.itemIf(!isRunning, 'Run', () => this.props.onStart(script));
		menu.itemIf(isRunning, 'Stop', () => this.props.onStop(script));
		menu.item('Copy command', () => this.props.onCopyCommand(script));

		return menu.build();
	}

	_handleContextMenu (event) {
		event.preventDefault();

		this.buildContextMenu().popup();
	}

	_renderRunAction () {
		const { script } = this.props;
		const handleStartScript = () => this.props.onStart(script);
		const handleStopScript = () => this.props.onStop(script);

		if (script.status === ScriptStatusEnum.IDLE) {
			return (
				<Button
					icon='play-arrow'
					onClick={handleStartScript}
					size='small'
					transparent
				>Run</Button>
			);
		}

		return (
			<Button
				icon='stop'
				onClick={handleStopScript}
				size='small'
			>Stop</Button>
		);
	}

	_renderOutputAction () {
		return (
			<Button
				onClick={() => this.props.onToggleOutput(this.props.script)}
				size='small'
				transparent
			>Output</Button>
		);
	}

	render () {
		const { name, command, status, showOutput, output } = this.props.script;
		const isIdling = status === ScriptStatusEnum.IDLE;
		const hasOutput = output.length > 0;
		const classes = classnames({
			'script-row': true,
			'script-row--idle': isIdling,
			'script-row--running': !isIdling,
			'script-row--has-output': hasOutput
		});

		return (
			<div>
				<TableRow
					className={classes}
					onContextMenu={this._handleContextMenu}
					static={!isIdling}
				>
					<TableCell className='script-row__name'>{name}</TableCell>
					<TableCell className='script-row__actions'>
						<ButtonGroup>
							{this._renderRunAction()}
							{hasOutput && this._renderOutputAction()}
						</ButtonGroup>
					</TableCell>
					<TableCell className='script-row__command' flex={2}>
						<code>{command}</code>
					</TableCell>
				</TableRow>
				{hasOutput && showOutput &&
					<ConsoleOutput lines={output} />
				}
			</div>
		);
	}
}
