//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { Avatar, Upload, Button, message, Form, Input, Modal } from 'antd';
import {
	ShopOutlined,
	UploadOutlined,
	PlusOutlined,
	LoadingOutlined,
} from '@ant-design/icons';
import Compress from 'compress.js';
//  Region Import Redux Action Type and Redux Action
import { updateProfileMarket } from '../../../../redux/actions';
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
	const isLt7M = file.size < 7340032;
	if (!isLt7M) {
		message.error('Gambar tidak boleh melebihi 7 MB');
	}
	return isJpgOrPng && isLt7M ? true : Upload.LIST_IGNORE;
};

class Akun extends Component {
	//  constructor declaration
	constructor(props) {
		super(props);
		this.state = {
			loadingAvatar: false,
			imageAvatar: this.props.profile.market.avatar,
			banner: this.props.profile.market.banner,
			marketName: this.props.profile.market.market_name,
			description: this.props.profile.market.description,
			loadingFirst: false,
		};
		this.formMarketRef = createRef();
	}

	//  react lifecycle (componentDidMount, componentDidUpdate, etc)

	// componentWillReceiveProps(nextProps) {
	// 	if (nextProps.profile !== this.props.profile) {
	// 		this.setState({
	// 			imageAvatar: nextProps.profile.avatar,
	// 			name: nextProps.profile.name,
	// 		});
	// 	}
	// }

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

	handleChangeFirst = async (info) => {
		if (info.file.status === 'uploading') {
			this.setState({ loadingFirst: true });
			return;
		}
		let compressImg = await compressImage(info.file.originFileObj);
		let getDataBase64 = compressImg[0].prefix + compressImg[0].data;

		// Get this url from response in real world.
		getBase64(info.file.originFileObj, () =>
			this.setState({
				banner: getDataBase64,
				loadingFirst: false,
			})
		);
	};

	handleChangeName = (e) => {
		this.setState({
			marketName: e.target.value,
		});
	};

	submitFormMarket = async () => {
		let formInformation = await this.formMarketRef.current
			.validateFields()
			.then((values) => {
				return values;
			});

		let data = {};
		this.props.profile.market.avatar !== this.state.imageAvatar &&
			(data['avatar'] = this.state.imageAvatar);

		this.props.profile.market.banner !== this.state.banner &&
			(data['banner'] = this.state.banner);

		data['market_name'] = formInformation.market_name;
		data['description'] = formInformation.description;

		Modal.confirm({
			title: 'Kamu yakin ingin mengubah informasi Toko?',
			centered: true,
			style: {
				fontSize: 5,
			},

			okText: 'Konfirmasi',
			cancelText: 'Batal',
			onOk: () => {
				data && this.props.updateProfileMarket(data);
			},
		});
	};

	//  render
	render() {
		const uploadDragger = (
			<>
				{this.state.loadingFirst ? (
					<div>
						<p className='ant-upload-drag-icon'>
							<LoadingOutlined />
						</p>
						<p className='ant-upload-text'>Pilih foto artikel</p>
						<p className='ant-upload-hint'></p>
					</div>
				) : (
					<div>
						<p className='ant-upload-drag-icon'>
							<PlusOutlined />
						</p>
						<p className='ant-upload-text'>Pilih foto banner toko</p>
						<p className='ant-upload-hint'>
							atau tarik dan letakkan gambar di sini
						</p>
					</div>
				)}
			</>
		);

		return (
			<>
				<Upload.Dragger
					className='mb-2'
					name='avatar'
					beforeUpload={this.beforeUpload}
					onChange={this.handleChangeFirst}
					showUploadList={false}
				>
					{this.state.banner ? (
						<img
							src={this.state.banner}
							alt='avatar'
							style={{
								maxWidth: '100%',
								padding: 5,
								maxHeight: 200,
							}}
						/>
					) : (
						uploadDragger
					)}
				</Upload.Dragger>

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
						icon={<ShopOutlined />}
					/>
				)}
				<Upload
					accept='.jpg, .jpeg, .png'
					name='avatar'
					showUploadList={false}
					beforeUpload={beforeUpload}
					onChange={this.handleChange}
				>
					<Button icon={<UploadOutlined />}>Upload Foto Toko</Button>
				</Upload>

				<Form
					className='mt-2'
					ref={this.formMarketRef}
					layout='vertical'
					initialValues={{
						market_name: this.state.marketName,
						description: this.state.description,
					}}
					scrollToFirstError={true}
					autoComplete='off'
				>
					<Form.Item
						name='market_name'
						label='Nama Toko'
						rules={[
							{ required: true, message: 'Nama Toko tidak boleh kosong.' },
							{
								min: 5,
								message: 'Nama toko minimal 5 karakter.',
							},
						]}
					>
						<Input
							onChange={(e) => this.handleChangeName(e)}
							minLength={10}
							maxLength={70}
						/>
					</Form.Item>
					<Form.Item name='description' label='Deskripsi Toko'>
						<Input.TextArea
							rows={3}
							// onChange={(e) => this.handleChangeName(e)}
							minLength={10}
							maxLength={70}
						/>
					</Form.Item>
				</Form>

				<Button
					className='float-right'
					type='primary'
					onClick={this.submitFormMarket}
				>
					Simpan
				</Button>
			</>
		);
	}
}

// mapStateToProps here if needed
const mapStateToProps = (state) => {
	const { profile } = state.ProfileReducers;

	return {
		profile,
	};
};
// mapDispatchToProps here if needed

export default connect(mapStateToProps, { updateProfileMarket })(Akun);
