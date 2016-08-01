import React, { Component, PropTypes } from 'react';

import { FILE_MANAGER_NAME } from '../../constants/PlatformConstants';
import { ScriptStatusEnum } from '../../constants/Enums';
import ContextMenu from '../../utils/MenuUtils';
import SidebarLink from '../SidebarLink';
import StatusBall from '../StatusBall';
import SvgIcon from '../SvgIcon';
import './SidebarProject.styl';

export default class SidebarProject extends Component {
	static propTypes = {
		actions: PropTypes.object.isRequired,
		onCopyPath: PropTypes.func.isRequired,
		onRemove: PropTypes.func.isRequired,
		onShowInFolder: PropTypes.func.isRequired,
		onStar: PropTypes.func.isRequired,
		onUnstar: PropTypes.func.isRequired,
		project: PropTypes.object.isRequired,
		scripts: PropTypes.arrayOf(PropTypes.object).isRequired
	};

	constructor (props) {
		super(props);

		this._handleContextMenu = this._handleContextMenu.bind(this);
		this._renderStatus = this._renderStatus.bind(this);
		this._renderStar = this._renderStar.bind(this);
	}

	_buildContextMenu () {
		const { stopScript, startScript } = this.props.actions;
		const {
			project,
			onCopyPath,
			onRemove,
			onUnstar,
			onShowInFolder,
			onStar
		} = this.props;

		const menu = new ContextMenu();
		const tasksMenu = new ContextMenu();

		// Show project name as label
		menu.item(project.data.name, () => null, { enabled: false });

		// Append scripts
		if (project.scripts) {
			const { scripts } = this.props;

			tasksMenu.separator();

			scripts.forEach(script => {
				const isRunning = script.status === ScriptStatusEnum.RUNNING;

				tasksMenu.item(script.name, () => {
					if (isRunning) {
						stopScript(project, script);
					} else {
						startScript(project, script);
					}
				}, { enabled: !isRunning });
			});
		}

		menu.sub('Scripts', tasksMenu);

		menu
			.separator()
			.itemIf(project.starred, 'Unstar', () => onUnstar(project))
			.itemIf(!project.starred, 'Star', () => onStar(project))
			.item('Copy Path', () => onCopyPath(project))
			.item(`Show in ${FILE_MANAGER_NAME}`, () => onShowInFolder(project))
			.separator()
			.item('Remove from list', () => onRemove(project));

		return menu.build();
	}

	_handleContextMenu (event) {
		event.preventDefault();

		this._buildContextMenu().popup();
	}

	_renderStatus () {
		const { scripts } = this.props;

		// Get active scripts
		const runningScripts = scripts.filter(script =>
			script.status === ScriptStatusEnum.RUNNING
		);

		if (runningScripts.length === 1) {
			const runningScript = runningScripts[0];

			// Do not display 'start' script name
			if (runningScript.name.toLowerCase() === 'start') {
				return <span><StatusBall active /> Running</span>;
			}

			// Display name of only running script
			return <span><StatusBall active /> Running {runningScript.name}</span>;

		} else if (runningScripts.length > 1) {

			// Display number of running scripts
			return <span><StatusBall active /> Running {runningScripts.length} scripts</span>;
		}

		return <span>Not running</span>;
	}

	_renderStar () {
		if (this.props.project.starred === true) {
			return (
				<SvgIcon
					className='project-card__star'
					code='star'
					height={12}
					width={12}
				/>
			);
		}

		return null;
	}

	render () {
		const { project } = this.props;
		const { name } = project.data;
		const { code, color } = project;
		const status = this._renderStatus();
		const star = this._renderStar();

		return (
			<SidebarLink
				activeClassName='project-card--active'
				className='project-card'
				onContextMenu={this._handleContextMenu}
				to={`projects/${code}`}
			>
				<div className='project-card__contents'>
					<div
						className='project-card__badge'
						style={{ background: color }}
					>{name.charAt(0)}</div>
					<div className='project-card__details'>
						<div className='project-card__name'>{name}</div>
						<div className='project-card__status'>{status}</div>
					</div>
					{star}
				</div>
			</SidebarLink>
		);
	}
}
