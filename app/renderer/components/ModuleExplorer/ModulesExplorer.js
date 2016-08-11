import React, { Component, PropTypes } from 'react';
import debounce from 'lodash/debounce';

import ModuleCard from 'components/ModuleCard';
import Button from 'components/Button';
import './ModuleExplorer.styl';

export default class ModulesExplorer extends Component {
	static propTypes = {
		installedDependencies: PropTypes.array.isRequired,
		onCancel: PropTypes.func.isRequired,
		onInstall: PropTypes.func.isRequired,
		onSearch: PropTypes.func.isRequired,
		query: PropTypes.string.isRequired,
		result: PropTypes.array.isRequired
	};

	constructor (props) {
		super(props);

		this._renderModule = this._renderModule.bind(this);
		this._handleKeywordChange = this._handleKeywordChange.bind(this);
		this._handleCancel = this._handleCancel.bind(this);
		this._search = debounce(this._search.bind(this), 500);
	}

	componentWillMount () {
		this.setState({ query: '' });
	}

	componentDidMount () {
		this.refs.input.focus();
	}

	_handleKeywordChange (event) {
		this.setState({
			query: event.target.value.trim()
		});

		this._search();
	}

	_handleCancel () {
		this._search.cancel();
		this.refs.input.value = '';
		this.props.onCancel();
	}

	_search () {
		if (this.state.query.length === 0) {
			this._handleCancel();
		} else {
			this.props.onSearch(this.state.query);
		}
	}

	_renderModule (module) {
		const { installedDependencies } = this.props;
		const isInstalled = installedDependencies.find(dependency =>
			dependency.name === module.name
		) !== undefined;

		return (
			<ModuleCard
				installed={isInstalled}
				key={module.name}
				module={module}
				onInstall={this.props.onInstall}
			/>
		);
	}

	render () {
		return (
			<div className='module-explorer'>
				<div className='module-explorer__container'>
					<div className='module-explorer__controls'>
						{this.props.query.length > 0 &&
							<Button
								className='module-explorer__cancel'
								icon='arrow-back'
								inline
								onClick={this._handleCancel}
								size='small'
								transparent
							>Back</Button>
						}
						<input
							className='module-explorer__input'
							onChange={this._handleKeywordChange}
							placeholder='Search packages'
							ref='input'
							type='text'
						/>
					</div>
					<div className='module-explorer__result'>
						{this.props.result.map(this._renderModule)}
					</div>
				</div>
			</div>
		);
	}
}
