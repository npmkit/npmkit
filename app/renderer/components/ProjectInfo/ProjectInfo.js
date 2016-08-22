import React, { Component, PropTypes } from 'react';
import InputRow from 'components/InputRow';
import InputTextBox from 'components/InputTextBox';
import InputTextArea from 'components/InputTextArea';
import InputCheckBox from 'components/InputCheckBox';
import './ProjectInfo.styl';

export default class ProjectInfo extends Component {
	static propTypes = {
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
					onChange={this.props.onNameChange}
					value={name || ''}
					maxlength={214}
					size={20}
					required
					width={30}
				/>
				<InputRow
					component={InputTextBox}
					label='Version'
					onChange={this.props.onVersionChange}
					value={version || ''}
					size={10}
					required
					width={10}
				/>
				<InputRow
					cols={50}
					component={InputTextArea}
					placeholder='No description provided'
					onChange={this.props.onDescriptionChange}
					label='Description'
					rows={3}
					value={description || ''}
				/>
				<InputRow
					component={InputTextBox}
					placeholder='No author provided'
					label='Author'
					onChange={this.props.onAuthorChange}
					value={author || ''}
					size={40}
				/>
				<InputRow
					component={InputTextBox}
					label='Main'
					onChange={this.props.onMainFileChange}
					placeholder='No main file specified'
					value={main || ''}
					size={20}
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
