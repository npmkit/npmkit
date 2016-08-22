import React, { PropTypes } from 'react';
import combine from 'classnames';
import './TableRow.styl';

const TableRow = ({ className, static: isStatic, ...props }) => (
	<div
		{...props}
		className={combine(className, 'table__row', {
			'table__row--static': isStatic === true
		})}
	>{props.children}</div>
);

TableRow.propTypes = {
	children: PropTypes.any,
	className: PropTypes.string,
	static: PropTypes.bool
};

export default TableRow;
