import React, { PropTypes } from 'react';
import classnames from 'classnames';
import './TableRow.styl';

const TableRow = (props) => (
	<div
		{...Object.assign({}, props, {
			className: classnames(props.className, {
				table__row: true,
				'table__row--static': props.static === true
			})
		})}
	>{props.children}</div>
);

TableRow.propTypes = {
	children: PropTypes.any,
	className: PropTypes.string,
	static: PropTypes.bool
};

export default TableRow;
