import React, { Component, PropTypes } from 'react';

export default class InstallerRadioGroup extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
		onChange: PropTypes.func.isRequired,
		options: PropTypes.arrayOf(PropTypes.object).isRequired
	};

	render () {
		return (
			<div className='installer-field'>
				<div className='installer-field__heading'>Category</div>
				{this.props.options.map(option =>
					<label
						className='installer-field__option'
						htmlFor={this.id}
					>
						<input
							id={this.id}
							name={option.name}
							onChange={this.props.onChange}
							type='radio'
							value={option.value}
						/>
						<span>{option.name}</span>
					</label>
				)}
			</div>
		);
	}
}
