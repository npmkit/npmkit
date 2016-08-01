import React, { Component, PropTypes } from 'react';

import ViewHeader from '../ViewHeader';
import ViewBody from '../ViewBody';
import Tabs from '../Tabs';
import TabsItem from '../TabsItem';
import ProjectStar from '../ProjectStar';
import './ProjectView.styl';

export default class ProjectView extends Component {
	static propTypes = {
		children: PropTypes.any.isRequired,
		onToggleStar: PropTypes.func.isRequired,
		project: PropTypes.object.isRequired
	};

	_renderStar () {
		return (
			<ProjectStar
				checked={this.props.project.starred}
				onClick={this.props.onToggleStar}
			/>
		);
	}

	render () {
		const { project } = this.props;
		const { name /* , description */ } = project.data;
		const prefix = `/projects/${project.code}`;

		return (
			<section className='project-view view'>
				<ViewHeader>
					<h1>{name} {this._renderStar()}</h1>
					{/* <p>{description || 'No description'}</p> */}
					<Tabs>
						<TabsItem label='Info' link={`${prefix}/info`} />
						<TabsItem label='Tasks' link={`${prefix}/tasks`} />
						<TabsItem label='Dependencies' link={`${prefix}/dependencies`} />
					</Tabs>
				</ViewHeader>
				<ViewBody>{this.props.children}</ViewBody>
			</section>
		);
	}
}
