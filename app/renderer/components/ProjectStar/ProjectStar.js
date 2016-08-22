import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import SvgIcon from 'components/SvgIcon';
import './ProjectStar.styl';

export default class ProjectStar extends Component {
	static propTypes = {
		checked: PropTypes.bool,
		onClick: PropTypes.func.isRequired
	};

	static defaultProps = {
		checked: false
	};

	render () {
		const classes = classnames({
			'project-star': true,
			'project-star--starred': this.props.checked
		});

		return (
			<span
				className={classes}
				onClick={this.props.onClick}
				title={`${this.props.checked ? 'Unstar' : 'Star'} project`}
			>
				<SvgIcon
					code={this.props.checked ? 'star' : 'star-border'}
					height={16}
					width={16}
				/>
			</span>
		);
	}
}
