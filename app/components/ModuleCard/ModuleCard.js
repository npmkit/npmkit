import React, { Component, PropTypes } from 'react';

import Button from '../Button';
import './ModuleCard.styl';

export default class ModuleCard extends Component {
	static propTypes = {
		installed: PropTypes.bool,
		module: PropTypes.object.isRequired,
		onInstall: PropTypes.func.isRequired
	};

	static defaultProps = {
		installed: false
	};

	constructor (props) {
		super(props);

		this._handleInstallClick = this._handleInstallClick.bind(this);
	}

	_handleInstallClick () {
		this.props.onInstall(this.props.module);
	}

	render () {
		const { installed } = this.props;
		const { name, description, version } = this.props.module;

		return (
			<div className='module-card'>
				<div className='module-card__meta'>
					<div>
						<span className='module-card__name'>{name}</span>
						<span className='module-card__version'>{version || ''}</span>
					</div>
					<div className='module-card__description'>{description}</div>
				</div>
				<div className='module-card__actions'>
					{installed &&
						<Button
							disabled
							transparent
						>Installed</Button>
					}
					{!installed &&
						<Button
							disabled={!Boolean(version)}
							onClick={this._handleInstallClick}
							transparent
						>Install</Button>
					}
				</div>
			</div>
		);
	}
}
