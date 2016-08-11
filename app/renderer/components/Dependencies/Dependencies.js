import React, { Component, PropTypes } from 'react';
import firstBy from 'thenby';

import { canAutoUpdate } from 'utils/DependenciesUtils';
import { DependencyStatusEnum } from 'constants/Enums';
import Spacer from 'components/Spacer';
import Button from 'components/Button';
import Table from 'components/Table';
import TableHead from 'components/TableHead';
import TableBody from 'components/TableBody';
import TableCell from 'components/TableCell';
import DependencyRow from 'components/DependencyRow';
import TableFooter from 'components/TableFooter';
import ModuleExplorer from 'containers/ModuleExplorer';
import './Dependencies.styl';

export default class Dependencies extends Component {
	static propTypes = {
		actions: PropTypes.object.isRequired,
		children: PropTypes.any,
		dependencies: PropTypes.arrayOf(PropTypes.object).isRequired,
		isSearchActive: PropTypes.bool.isRequired,
		networkStatus: PropTypes.object.isRequired,
		onInstallAll: PropTypes.func.isRequired,
		onMount: PropTypes.func.isRequired,
		onUpdateAll: PropTypes.func.isRequired,
		project: PropTypes.object
	};

	componentWillMount () {
		this.props.onMount();
	}

	_createInstallDependencyHandler (project, dependency) {
		return () => {
			this.props.actions.installDependency(project, dependency);
		};
	}

	_createRemoveDependencyHandler (project, dependency) {
		return () => {
			this.props.actions.removeDependency(project, dependency);
		};
	}

	_createUninstallDependencyHandler (project, dependency) {
		return () => {
			this.props.actions.uninstallDependency(project, dependency);
		};
	}

	_createUpdateDependencyHandler (project, dependency) {
		return () => {
			this.props.actions.updateDependency(project, dependency);
		};
	}

	_createViewDependencyHandler (dependency) {
		return () => {
			this.props.actions.viewDependencyPage(dependency);
		};
	}

	_createCopyDependencyNameHandler (dependency) {
		return () => {
			this.props.actions.copyToClipboard(dependency.name);
		};
	}

	render () {
		const {
			networkStatus,
			dependencies,
			project,
			onInstallAll,
			onUpdateAll,
			isSearchActive
		} = this.props;

		const isOnline = networkStatus.online === true;

		const sortedDependencies = dependencies.sort(firstBy(dependency =>
			dependency.name
		));

		const hasDependenciesToUpdate = dependencies.filter(canAutoUpdate).length > 0;

		const hasDependenciesToInstall = dependencies.filter(dependency =>
			dependency.status === DependencyStatusEnum.IDLE &&
			dependency.currentVersion === null
		).length > 0;

		const isDoneFetchingVersions = dependencies.filter(dependency =>
			dependency.currentVersion === undefined
		).length === 0;

		return (
			<div>
				<ModuleExplorer />
				{!isSearchActive &&
					<Table>
						<TableHead>
							<TableCell flex={3}>Name</TableCell>
							<TableCell flex={2}>Category</TableCell>
							<TableCell>Current</TableCell>
							<TableCell>Wanted</TableCell>
							<TableCell>Latest</TableCell>
							<TableCell />
						</TableHead>
						<TableBody>
							{sortedDependencies.map(dependency =>
								<DependencyRow
									dependency={dependency}
									isNetworkOnline={isOnline}
									key={dependency.id}
									onCopyName={this._createCopyDependencyNameHandler(dependency)}
									onInstall={this._createInstallDependencyHandler(project, dependency)}
									onRemove={this._createRemoveDependencyHandler(project, dependency)}
									onUninstall={this._createUninstallDependencyHandler(project, dependency)}
									onUpdate={this._createUpdateDependencyHandler(project, dependency)}
									onViewPage={this._createViewDependencyHandler(dependency)}
								/>
							)}
						</TableBody>
						<TableFooter sticky>
							<Spacer />
							{hasDependenciesToUpdate && isDoneFetchingVersions &&
								<Button
									disabled={!networkStatus.online}
									onClick={onUpdateAll}
									transparent
								>Update All</Button>
							}
							<span>&nbsp;</span>
							{hasDependenciesToInstall &&
								<Button
									disabled={!networkStatus.online}
									onClick={onInstallAll}
									transparent
								>Install All</Button>
							}
						</TableFooter>
					</Table>
				}
			</div>
		);
	}
}
