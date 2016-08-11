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
					hint='The unique name of your package, should be down in lowercase. This property is required and your package will not install without it.' // eslint-disable-line max-len
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
					hint='The version of the package is specified by SemVer. Which assumes that a version number is written as MAJOR.MINOR.PATCH.' // eslint-disable-line max-len
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
					hint='The description of the project. Try to keep it short and concise.' // eslint-disable-line max-len
					placeholder='No description provided'
					onChange={this.props.onDescriptionChange}
					label='Description'
					rows={3}
					value={description || ''}
				/>
				<InputRow
					component={InputTextBox}
					hint='The author of this package. Prefer `%firstname% %lastname% <%email%>` format.' // eslint-disable-line max-len
					placeholder='No author provided'
					label='Author'
					onChange={this.props.onAuthorChange}
					value={author || ''}
					size={40}
				/>
				<InputRow
					component={InputTextBox}
					hint={"Main entry point file for package when require()'d"}
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
					hint='By setting private to true, npm will refuse to publish it. This prevents accidental publishes to the public npm registry.' // eslint-disable-line max-len
					hintOnHover
					label='Private'
					onChange={this.props.onIsPrivateChange}
				/>
				<InputRow
					checked={preferGlobal || false}
					component={InputCheckBox}
					hint='A property that indicates that this package prefers to be installed globally using npm install -g {module-name}. This property is used by packages that contain a CLI.' // eslint-disable-line max-len
					hintOnHover
					label='Prefer Global'
					onChange={this.props.onPreferGlobalChange}
				/>
			</div>
		);
	}
}
