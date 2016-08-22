import React, { Component, PropTypes } from 'react';
import ViewHeader from 'components/ViewHeader';
import ViewBody from 'components/ViewBody';
import VersionCard from 'components/VersionCard';
import './SettingsView.styl';

export default class SettingsView extends Component {
	static propTypes = {
		node: PropTypes.object.isRequired,
		npm: PropTypes.object.isRequired
	};

	render () {
		const { node, npm } = this.props;

		return (
			<section className='npm-view view'>
				<ViewHeader>
					<h1>Versions</h1>
				</ViewHeader>
				<ViewBody>
					<div className='module-versions'>
						<VersionCard name='Node' version={node.version} />
						<VersionCard name='npm' version={npm.version} />
						<VersionCard name='nvm' version={null} />
					</div>
				</ViewBody>
			</section>
		);
	}
}
