import React, { PropTypes } from 'react';
import classnames from 'classnames';
import './Table.styl';

const Table = ({ className = '', children }) => (
	<div className={classnames('table', className)}>{children}</div>
);

Table.propTypes = {
	children: PropTypes.any,
	className: PropTypes.string
};

export default Table;
