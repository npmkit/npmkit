import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import './VersionCard.styl';

export default class VersionCard extends Component {
	static propTypes = {
		name: PropTypes.string.isRequired,
		version: PropTypes.string
	};

	render () {
		const isInstalled = this.props.version !== null;
		const classes = classnames({
			'version-card': true,
			'version-card--installed': isInstalled
		});

		return (
			<div className={classes}>
				<div className='version-card__name'>{this.props.name}</div>
				<div className='version-card__version'>
					{this.props.version ? `v${this.props.version}` : 'Not installed'}
				</div>
			</div>
		);
	}
}
