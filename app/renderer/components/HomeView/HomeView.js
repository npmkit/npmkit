import React, { Component, PropTypes } from 'react';
import { APP_NAME, APP_VERSION } from 'constants/AppConstants';
import { createProject, openProject, cloneProject } from 'actions/ProjectActions';
import Button from 'components/Button';
import logoPath from 'assets/npmkit-logo.svg';
import './HomeView.styl';

export default class HomeView extends Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired
	};

	constructor (props) {
		super(props);

		this._handleCreateProjectClick = this._handleCreateProjectClick.bind(this);
		this._handleOpenProjectClick = this._handleOpenProjectClick.bind(this);
		this._handleCloneProjectClick = this._handleCloneProjectClick.bind(this);
	}

	_handleCreateProjectClick () {
		const { dispatch } = this.props;

		dispatch(createProject());
	}

	_handleOpenProjectClick () {
		const { dispatch } = this.props;

		dispatch(openProject());
	}

	_handleCloneProjectClick () {
		const { dispatch } = this.props;

		dispatch(cloneProject());
	}

	render () {
		return (
			<section className='home-view view'>
				<img
					alt='npmkit'
					height={42}
					src={logoPath}
					width={82}
				/>
				<h1 className='home-view__logotype'>{APP_NAME}</h1>
				<div className='home-view__version'>v{APP_VERSION}</div>
				<div className='home-view__actions'>
					<Button
						borderless
						icon='create-new-folder'
						onClick={this._handleCreateProjectClick}
						wide
					>Create new project</Button>
					<Button
						borderless
						icon='folder-open'
						onClick={this._handleOpenProjectClick}
						wide
					>Open existing</Button>
					<Button
						borderless
						icon='get-app'
						onClick={this._handleCloneProjectClick}
						wide
					>Check out from Git</Button>
				</div>
			</section>
		);
	}
}
