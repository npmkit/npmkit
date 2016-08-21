import React, { Component, PropTypes } from 'react';

import Button from 'components/Button';
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
			<div className='ModuleCard'>
				<div className='ModuleCard-meta'>
					<div>
						<span className='ModuleCard-name'>{name}</span>
						<span className='ModuleCard-version'>{version || ''}</span>
					</div>
					<div className='ModuleCard-description'>{description}</div>
				</div>
				<div className='ModuleCard-actions'>
					{installed &&
						<Button
							disabled
							transparent
						>Installed</Button>
					}
					{!installed &&
						<Button
							disabled={!!version}
							onClick={this._handleInstallClick}
							transparent
						>Install</Button>
					}
				</div>
			</div>
		);
	}
}
