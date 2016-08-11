import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classnames from 'classnames';

import { DependencyStatusEnum, DependencyUpdateTypeEnum } from 'constants/Enums';
import { PACKAGE_JSON_FILE } from 'constants/PathConstants';
import { isNpmDependency } from 'utils/DependenciesUtils';
import ContextMenu from 'utils/MenuUtils';
import TableRow from 'components/TableRow';
import TableCell from 'components/TableCell';
import Button from 'components/Button';
import './DependencyRow.styl';

export default class DependencyRow extends Component {
	static propTypes = {
		dependency: PropTypes.object.isRequired,
		isNetworkOnline: PropTypes.bool,
		onCopyName: PropTypes.func.isRequired,
		onInstall: PropTypes.func.isRequired,
		onRemove: PropTypes.func.isRequired,
		onUninstall: PropTypes.func.isRequired,
		onUpdate: PropTypes.func.isRequired,
		onViewPage: PropTypes.func.isRequired
	};

	constructor (props) {
		super(props);

		this._handleContextMenu = this._handleContextMenu.bind(this);
	}

	shouldComponentUpdate (nextProps) {
		return shallowCompare(this, nextProps, null);
	}

	_handleContextMenu (event) {
		event.preventDefault();

		this._buildContextMenu().popup();
	}

	_buildContextMenu () {
		const {
			dependency,
			onCopyName,
			onViewPage,
			onUpdate,
			onInstall,
			onUninstall,
			onRemove,
			isNetworkOnline
		} = this.props;

		const menu = new ContextMenu();
		const isInstalled = dependency.currentVersion !== null;
		const hasUpdate = dependency.hasUpdate === true;
		const hasMajorUpdate = hasUpdate && dependency.updateType === DependencyUpdateTypeEnum.MAJOR;
		const disableThenOffline = { enabled: isNetworkOnline };

		return menu
			.item(
				dependency.name,
				() => null,
				{ enabled: false }
			)
			.item(
				'Copy name',
				onCopyName
			)
			.itemIf(
				isNpmDependency(dependency),
				'View on npmjs.com',
				onViewPage,
				disableThenOffline
			)
			.separator()
			.itemIf(
				isInstalled && hasUpdate,
				hasMajorUpdate ? 'Major update' : 'Update',
				onUpdate,
				disableThenOffline
			)
			/* .itemIf(
				isInstalled && dependency.isCurrentVersionSatisfiesWanted === false,
				'Install wanted',
				onInstall,
				disableThenOffline
			) */
			.separator()
			.itemIf(isInstalled, 'Uninstall', onUninstall)
			.itemIf(!isInstalled, 'Install', onInstall, disableThenOffline)
			.item(`Remove from ${PACKAGE_JSON_FILE}`, onRemove)
			.build();
	}

	renderStatus () {
		switch (this.props.dependency.status) {
			default:
			case DependencyStatusEnum.IDLE:
				return null;

			case DependencyStatusEnum.INSTALLING:
				return <span>Installing&hellip;</span>;

			case DependencyStatusEnum.UNINSTALLING:
				return <span>Uninstalling&hellip;</span>;
		}
	}

	renderUpdateButton () {
		const { dependency, onUpdate, isNetworkOnline } = this.props;

		if (dependency.currentVersion !== null &&
			dependency.status === DependencyStatusEnum.IDLE &&
			dependency.hasUpdate) {
			return (
				<Button
					disabled={!isNetworkOnline}
					inline
					onClick={onUpdate}
					size='small'
					transparent
				>Update</Button>
			);
		}

		return null;
	}

	renderInstallButton () {
		const { dependency, onInstall } = this.props;

		if (dependency.status === DependencyStatusEnum.IDLE &&
			!dependency.hasUpdate &&
			(dependency.currentVersion === null ||
			dependency.isCurrentVersionSatisfiesWanted === false)) {
			return (
				<Button
					inline
					onClick={onInstall}
					size='small'
					transparent
				>Install</Button>
			);
		}

		return null;
	}

	render () {
		const {
			name,
			category,
			source,
			currentVersion,
			wantedVersion,
			latestVersion,
			hasUpdate,
			status
		} = this.props.dependency;

		const classes = classnames({
			'dependencies-list__item': true,
			'dependency-card': true,
			'dependency-card--has-update': hasUpdate === true
		});

		return (
			<TableRow
				aria-busy={status !== DependencyStatusEnum.IDLE}
				className={classes}
				onContextMenu={this._handleContextMenu}
			>
				<TableCell className='dependency-card__name' flex={3}>{name}</TableCell>
				<TableCell className='dependency-card__category' flex={2}>{category}</TableCell>
				<TableCell>{currentVersion === null ? (<span>&mdash;</span>) : currentVersion}</TableCell>
				<TableCell>{wantedVersion || source}</TableCell>
				<TableCell>{latestVersion}</TableCell>
				<TableCell align='right'>
					{this.renderStatus()}
					{this.renderUpdateButton()}
					{this.renderInstallButton()}
				</TableCell>
			</TableRow>
		);
	}
}
