import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';

import SvgIcon from 'components/SvgIcon';
import './ProjectFilter.styl';

export default class SidebarFilter extends Component {
	static propTypes = {
		keyword: PropTypes.string.isRequired,
		onClear: PropTypes.func.isRequired,
		onKeywordChange: PropTypes.func.isRequired
	};

	render () {
		const { keyword, onKeywordChange, onClear } = this.props;
		const hasKeyword = keyword.length > 0;
		const classes = classnames({
			'sidebar-filter': true,
			'sidebar-filter--filled': hasKeyword
		});

		return (
			<div className={classes}>
				<input
					className='sidebar-filter__input'
					onChange={onKeywordChange}
					placeholder='Quick Filter'
					type='text'
					value={keyword}
				/>
				<SvgIcon
					className='sidebar-filter__clear-button'
					code='cancel'
					height={16}
					onClick={onClear}
					width={16}
				/>
			</div>
		);
	}
}
