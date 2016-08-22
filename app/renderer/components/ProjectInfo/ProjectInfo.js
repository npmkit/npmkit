import React, { Component, PropTypes } from 'react';
import InputRow from 'components/InputRow';
import InputTextBox from 'components/InputTextBox';
import InputTextArea from 'components/InputTextArea';
import InputCheckBox from 'components/InputCheckBox';
import './ProjectInfo.styl';

export default class ProjectInfo extends Component {
	static propTypes = {
		onAuthorChange: PropTypes.func.isRequired,
		onDescriptionChange: PropTypes.func.isRequired,
		onIsPrivateChange: PropTypes.func.isRequired,
		onMainFileChange: PropTypes.func.isRequired,
		onNameChange: PropTypes.func.isRequired,
		onPreferGlobalChange: PropTypes.func.isRequired,
		onVersionChange: PropTypes.func.isRequired,
		project: PropTypes.object
	};

	render () {
		const {
			name,
			version,
			description,
			main,
			private: isPrivate,
			preferGlobal
		} = this.props.project.data;

		let { author } = this.props.project.data;

		// @todo support object author property
		if (typeof author === 'object') {
			const { email = '', url = '' } = author;

			author = author.name || '';
			author += email ? ` <${email}>` : '';
			author += url ? ` (${url})` : '';
		}

		return (
			<div className='project-info'>
				<InputRow
					component={InputTextBox}
					label='Name'
					maxlength={214}
					onChange={this.props.onNameChange}
					required
					size={20}
					value={name || ''}
					width={30}
				/>
				<InputRow
					component={InputTextBox}
					label='Version'
					onChange={this.props.onVersionChange}
					required
					size={10}
					value={version || ''}
					width={10}
				/>
				<InputRow
					cols={50}
					component={InputTextArea}
					label='Description'
					onChange={this.props.onDescriptionChange}
					placeholder='No description provided'
					rows={3}
					value={description || ''}
				/>
				<InputRow
					component={InputTextBox}
					label='Author'
					onChange={this.props.onAuthorChange}
					placeholder='No author provided'
					size={40}
					value={author || ''}
				/>
				<InputRow
					component={InputTextBox}
					label='Main'
					onChange={this.props.onMainFileChange}
					placeholder='No main file specified'
					size={20}
					value={main || ''}
					width={30}
				/>
				<InputRow
					checked={isPrivate || false}
					component={InputCheckBox}
					label='Private'
					onChange={this.props.onIsPrivateChange}
				/>
				<InputRow
					checked={preferGlobal || false}
					component={InputCheckBox}
					label='Prefer Global'
					onChange={this.props.onPreferGlobalChange}
				/>
			</div>
		);
	}
}
