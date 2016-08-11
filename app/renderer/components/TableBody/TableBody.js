import React, { PropTypes } from 'react';

const TableBody = ({ children }) => (
	<div className='table__body'>{children}</div>
);

TableBody.propTypes = {
	children: PropTypes.any
};

export default TableBody;
