import React, { Component, PropTypes } from 'react';
import SidebarSection from 'components/SidebarSection';
import SidebarProject from 'containers/SidebarProject';
import ProjectFilter from 'containers/ProjectFilter';
import './Sidebar.styl';

export default class Sidebar extends Component {
	static propTypes = {
		projects: PropTypes.array.isRequired,
		totalProjectsCount: PropTypes.number.isRequired
	};

	render () {
		return (
			<aside className='Sidebar'>
				<SidebarSection
					icon='list'
					label='Projects'
					link='/projects'
				>
					{this.props.totalProjectsCount > 5 && <ProjectFilter />}
					<div className='Sidebar-projects'>
						{this.props.projects.map(project =>
							<SidebarProject
								key={project.code}
								project={project}
							/>
						)}
					</div>
				</SidebarSection>
				<SidebarSection
					icon='extension'
					label='Versions'
					link='/modules'
				/>
				{/*
				<SidebarSection
					icon='extension'
					label='Modules'
					link='/modules'
				/>
				<SidebarSection
					icon='settings'
					label='Settings'
					link='/settings'
				/>
				*/}
			</aside>
		);
	}
}
