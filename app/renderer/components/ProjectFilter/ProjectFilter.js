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
			SidebarFilter: true,
			'SidebarFilter--filled': hasKeyword
		});

		return (
			<div className={classes}>
				<input
					className='SidebarFilter-input'
					onChange={onKeywordChange}
					placeholder='Quick Filter'
					type='text'
					value={keyword}
				/>
				<SvgIcon
					className='SidebarFilter-clearButton'
					code='cancel'
					height={16}
					onClick={onClear}
					width={16}
				/>
			</div>
		);
	}
}
