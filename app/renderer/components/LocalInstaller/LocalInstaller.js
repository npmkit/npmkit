import React, { Component, PropTypes } from 'react';
import { remote } from 'electron';
import classnames from 'classnames';
import Button from 'components/Button';
import logoPath from 'assets/npmkit-logo.svg';
import './LocalInstaller.styl';

/**
 * @todo(sbekrin) add keyboard control support
 */
export default class ProjectPicker extends Component {
	static propTypes = {
		installer: PropTypes.object.isRequired,
		onCancel: PropTypes.func.isRequired,
		onInstall: PropTypes.func.isRequired,
		onPick: PropTypes.func.isRequired,
		packages: PropTypes.arrayOf(PropTypes.string).isRequired,
		projects: PropTypes.arrayOf(PropTypes.object).isRequired
	};

	constructor (props) {
		super(props);

		this._renderProject = this._renderProject.bind(this);
		this._handleProjectSelect = this._handleProjectSelect.bind(this);
	}

	componentWillMount () {
		const mainWindow = remote.getCurrentWindow();
		const [ width, height ] = [ 300, 500 ];

		mainWindow.setMinimumSize(width, height);
		mainWindow.setSize(width, height);
		mainWindow.setMaximizable(false);
		mainWindow.setResizable(false);
		mainWindow.setAlwaysOnTop(true);
		mainWindow.center();
	}

	_handleProjectSelect (event) {
		this.props.onPick(event.target.value);
	}

	_renderProject (project) {
		const isSelected = this.props.installer.projectCode === project.code;
		const classes = classnames({
			'picker-option': true,
			'picker-option--selected': isSelected
		});

		return (
			<label
				className={classes}
				key={project.code}
			>
				<input
					checked={isSelected}
					className='picker-option__input'
					name='picker-option'
					onChange={this._handleProjectSelect}
					type='radio'
					value={project.code}
				/>
				<span
					className='picker-option__badge'
					style={{ backgroundColor: project.color }}
				>{project.data.name.charAt(0)}</span>
				<span className='picker-option__label'>{project.data.name}</span>
			</label>
		);
	}

	render () {
		return (
			<div className='installer'>
				<div className='installer__header'>
					<img
						alt=''
						height={42}
						src={logoPath}
						width={84}
					/>
					<p className='installer__title'>Install Dependency</p>
				</div>
				<div className='installer__content'>
					<div className='installer-field'>
						<div className='installer-field__heading'>Category</div>
						<label className='installer-field__option'>
							<input name='category' type='radio' value='dependencies' />
							<span>dependencies</span>
						</label>
						<label className='installer-field__option'>
							<input name='category' type='radio' value='devDependencies' />
							<span>devDependencies</span>
						</label>
						<label className='installer-field__option'>
							<input name='category' type='radio' value='optionalDependencies' />
							<span>optionalDependencies</span>
						</label>
					</div>
					<div className='installer-field'>
						<div className='installer-field__heading'>Install to</div>
						<select className='installer-field__control'>
							{this.props.projects.map(project =>
								<option key={project.code}>{project.data.name}</option>
							)}
						</select>
					</div>
				</div>
				<div className='installer__footer'>
					<Button onClick={this.props.onCancel} transparent>Cancel</Button>
					<Button onClick={this.props.onInstall}>Install</Button>
				</div>
			</div>
		);
	}
}
