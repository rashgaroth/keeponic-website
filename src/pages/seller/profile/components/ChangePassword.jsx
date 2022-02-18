//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Input, Modal, Alert } from 'antd';

//  Region Import Redux Action Type and Redux Action
import { updatePassword } from '../../../../redux/actions';
//  Region Import Utility/Helper Function

//  Region Import Components

//  Region Import Assets

//  Region Import Style

//  Region Import Constants

class ChangePassword extends Component {
	//  constructor declaration
	constructor(props) {
		super(props);
		this.state = {
			message: '',
		};
		this.formChangePassword = createRef();
	}

	//  react lifecycle (componentDidMount, componentDidUpdate, etc)

	//  Function declaration (handle, onchange, etc)

	onReset = () => {
		this.formChangePassword.current.resetFields();
	};

	handleValidSubmit = async (values) => {
		console.log(values);
		Modal.confirm({
			title: 'Kamu yakin ingin mengubah informasi akun?',
			centered: true,
			style: {
				fontSize: 5,
			},

			okText: 'Konfirmasi',
			cancelText: 'Batal',
			onOk: () => {
				this.props.updatePassword(values);
				this.onReset();
			},
		});
	};

	//  render
	render() {
		return (
			<>
				{this.props.error !== 0 && (
					<Alert
						className='mb-2'
						message={this.props.message}
						type='error'
						showIcon
						closable
					/>
				)}
				<Form
					name='update-password'
					layout='vertical'
					ref={this.formChangePassword}
					onFinish={this.handleValidSubmit}
					scrollToFirstError
				>
					<Form.Item
						name='password'
						label='Password Lama'
						rules={[
							{
								required: true,
								message: 'Input ini tidak boleh kosong.',
							},
							{
								min: 6,
								message: 'Password minimal 6 karakter',
							},
						]}
						hasFeedback
					>
						<Input.Password />
					</Form.Item>
					<Form.Item
						name='new_password'
						label='Password Baru'
						rules={[
							{
								required: true,
								message: 'Input ini tidak boleh kosong.',
							},
							{
								min: 6,
								message: 'Password minimal 6 karakter',
							},
						]}
						hasFeedback
					>
						<Input.Password />
					</Form.Item>

					<Form.Item
						name='re_new_password'
						label='Konfirmasi Password Baru'
						dependencies={['new_password']}
						hasFeedback
						rules={[
							{
								required: true,
								message: 'Input ini tidak boleh kosong.',
							},
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue('new_password') === value) {
										return Promise.resolve();
									}
									return Promise.reject(
										new Error('Password yang dimasukkan tidak sama.')
									);
								},
							}),
						]}
					>
						<Input.Password />
					</Form.Item>
					<Form.Item>
						<Button type='primary' htmlType='submit' className='float-right'>
							Simpan Password
						</Button>
					</Form.Item>
				</Form>
			</>
		);
	}
}

// mapStateToProps here if needed
const mapStateToProps = (state) => {
	const { profile, loading, error, message } = state.ProfileReducers;

	return {
		profile,
		loading,
		error,
		message,
	};
};
// mapDispatchToProps here if needed

export default connect(mapStateToProps, { updatePassword })(ChangePassword);
