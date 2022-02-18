//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { Avatar, Upload, Button, message, Form, Input, Modal } from 'antd';

import Compress from 'compress.js';
import {
	UserOutlined,
	UploadOutlined,
	LoadingOutlined,
} from '@ant-design/icons';

//  Region Import Redux Action Type and Redux Action
import { updateProfileAccount } from '../../../../redux/actions';
//  Region Import Utility/Helper Function

//  Region Import Components

//  Region Import Assets

//  Region Import Style

//  Region Import Constants
const compress = new Compress();

const compressImage = async (file) => {
	let data;
	await compress
		.compress([file], {
			size: 4, // the max size in MB, defaults to 2MB
			quality: 0.75, // the quality of the image, max is 1,
			maxWidth: 1920, // the max width of the output image, defaults to 1920px
			maxHeight: 1920, // the max height of the output image, defaults to 1920px
			resize: true, // defaults to true, set false if you do not want to resize the image width and height
		})
		.then((res) => {
			data = res;
		});

	return data;
};

const getBase64 = (file, cb) => {
	return new Promise((resolve, rejects) => {
		const fileReader = new FileReader();
		fileReader.onload = () => {
			resolve(cb(fileReader.result));
		};
		fileReader.onerror = (error) => {
			rejects(error);
		};
		fileReader.onabort = () => {
			message.error({
				content: 'File was aborted',
				style: {
					marginTop: '0',
				},
			});
		};

		fileReader.readAsDataURL(file);
	});
};

const beforeUpload = (file) => {
	const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

	if (!isJpgOrPng) {
		message.error({
			content: 'File yang dimasukkan bukan Gambar',
			style: {
				marginTop: '0',
			},
		});
	}
	const isLt4M = file.size < 4194304;
	if (!isLt4M) {
		message.error('Gambar tidak boleh melebihi 4 MB');
	}
	return isJpgOrPng && isLt4M ? true : Upload.LIST_IGNORE;
};

class Akun extends Component {
	//  constructor declaration
	constructor(props) {
		super(props);
		this.state = {
			loadingAvatar: false,
			imageAvatar: this.props.profile.avatar,
			name: this.props.profile.name,
			email: this.props.profile.email,
			phone: this.props.profile.phone,
		};
		this.formAccountRef = createRef();
	}

	//  react lifecycle (componentDidMount, componentDidUpdate, etc)
	componentWillReceiveProps(nextProps) {
		if (nextProps.profile !== this.props.profile) {
			this.setState({
				imageAvatar: nextProps.profile.avatar,
				name: nextProps.profile.name,
			});
		}
	}

	//  Function declaration (handle, onchange, etc)
	handleChange = async (info) => {
		if (info.file.status === 'uploading') {
			this.setState({ loadingAvatar: true });
			return;
		}
		let compressImg = await compressImage(info.file.originFileObj);
		let getDataBase64 = compressImg[0].prefix + compressImg[0].data;
		// Get this url from response in real world.
		getBase64(info.file.originFileObj, () =>
			this.setState({
				imageAvatar: getDataBase64,
				loadingAvatar: false,
			})
		);
	};

	handleChangeName = (e) => {
		this.setState({
			name: e.target.value,
		});
	};

	submitFormAccount = async () => {
		let formInformation = await this.formAccountRef.current
			.validateFields()
			.then((values) => {
				return values;
			});

		let data = {};
		this.props.profile.avatar !== this.state.imageAvatar &&
			(data['avatar'] = this.state.imageAvatar);
		data['name'] = formInformation.name;
		data['phone'] = formInformation.phone;
		Modal.confirm({
			title: 'Kamu yakin ingin mengubah informasi Akun?',
			centered: true,
			style: {
				fontSize: 5,
			},

			okText: 'Konfirmasi',
			cancelText: 'Batal',
			onOk: () => {
				data && this.props.updateProfileAccount(data);
			},
		});
	};

	//  render
	render() {
		return (
			<>
				{this.state.loadingAvatar ? (
					<Avatar
						className='mr-2'
						style={{ verticalAlign: 'middle' }}
						size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 130 }}
						src=''
						icon={<LoadingOutlined />}
					/>
				) : (
					<Avatar
						className='mr-2'
						style={{ verticalAlign: 'middle' }}
						size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 130 }}
						src={this.state.imageAvatar}
						icon={<UserOutlined />}
					/>
				)}
				<Upload
					accept='.jpg, .jpeg, .png'
					name='avatar'
					showUploadList={false}
					beforeUpload={beforeUpload}
					onChange={this.handleChange}
				>
					<Button icon={<UploadOutlined />}>Upload Foto</Button>
				</Upload>

				<Form
					className='mt-2'
					ref={this.formAccountRef}
					layout='vertical'
					initialValues={{
						name: this.state.name,
						email: this.state.email,
						phone: this.state.phone,
					}}
					scrollToFirstError={true}
					autoComplete='off'
				>
					<Form.Item
						name='name'
						label='Nama'
						rules={[{ required: true, message: 'Nama tidak boleh kosong' }]}
					>
						<Input
							onChange={(e) => this.handleChangeName(e)}
							minLength={10}
							maxLength={70}
						/>
					</Form.Item>

					<Form.Item name='email' label='Email'>
						<Input disabled />
					</Form.Item>
					<Form.Item name='phone' label='Nomor Telepon'>
						<Input
							onChange={(e) => this.handleChangeName(e)}
							minLength={10}
							maxLength={70}
						/>
					</Form.Item>
				</Form>

				<Button
					className='float-right'
					type='primary'
					onClick={this.submitFormAccount}
				>
					Simpan
				</Button>
			</>
		);
	}
}

// mapStateToProps here if needed
const mapStateToProps = (state) => {
	const { profile, loading } = state.ProfileReducers;

	return {
		profile,
		loading,
	};
};
// mapDispatchToProps here if needed

export default connect(mapStateToProps, { updateProfileAccount })(Akun);
