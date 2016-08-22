import React, { PropTypes } from 'react';
import TableRow from 'components/TableRow';
import './TableHead.styl';

const TableHead = ({ children }) => (
	<div className='table__head'>
		<TableRow>{children}</TableRow>
	</div>
);

TableHead.propTypes = {
	children: PropTypes.arrayOf(PropTypes.element).isRequired
};

export default TableHead;
