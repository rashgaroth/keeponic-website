//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Container } from 'reactstrap';
import {
	Upload,
	message,
	Button,
	Modal,
	Descriptions,
	Card,
	Input,
	Form,
} from 'antd';
import {
	PlusOutlined,
	LoadingOutlined,
	EyeOutlined,
	DeleteOutlined,
} from '@ant-design/icons';
import Compress from 'compress.js';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from '@looop/quill-image-resize-module-react';
//  Region Import Redux Action Type and Redux Action
import { addArticle } from '../../../redux/actions';
//  Region Import Utility/Helper Function

//  Region Import Components

//  Region Import Assets
import IconRequired from '../../../assets/images/IconRequired';
//  Region Import Style
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

//  Region Import Constants
import { COLORS } from '../../../constants/colors';
const compress = new Compress();
const validateMessages = {
	required: 'Kolom tidak boleh kosong.',
};

Quill.register('modules/imageResize', ImageResize);

const quillContainerData = [
	[{ header: ['0', '2', '3'] }],
	['bold', 'italic', 'underline', 'strike', 'blockquote'],
	[
		{ align: '' },
		{ align: 'center' },
		{ align: 'right' },
		{ align: 'justify' },
	],
	[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
	['link', 'image', 'video'],
	['clean'],
];

const quillFormats = [
	'header',
	'bold',
	'italic',
	'underline',
	'strike',
	'blockquote',
	'align',
	'list',
	'bullet',
	'indent',
	'link',
	'image',
	'clean',
	'video',
];

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

class ArticleAdd extends Component {
	//  constructor declaration
	constructor(props) {
		super(props);
		this.state = {
			previewImage: '',
			previewTitle: '',
			previewVisible: false,
			loadingFirst: false,
			imageFirst: '',
			title: '',
			content: undefined,
		};
		this.formInformationRef = createRef();
	}

	//  react lifecycle (componentDidMount, componentDidUpdate, etc)

	//  Function declaration (handle, onchange, etc)

	beforeUpload = (file) => {
		const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

		if (!isJpgOrPng) {
			message.error({
				content: 'File yang dimasukkan bukan .jpg atau .png',
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

	handleChangeFirst = async (info) => {
		if (info.file.status === 'uploading') {
			this.setState({ loadingFirst: true });
			return;
		}
		let compressImg = await compressImage(info.file.originFileObj);
		let getDataBase64 = compressImg[0].prefix + compressImg[0].data;
		if (
			getDataBase64 === this.state.imageSecond ||
			getDataBase64 === this.state.imageThird ||
			getDataBase64 === this.state.imageFourth
		) {
			message.error('Gambar tidak boleh sama dalam 1 produk');
			this.setState({ loadingFirst: false });
		} else {
			getBase64(info.file.originFileObj, () => {
				this.setState({
					imageFirst: getDataBase64,
					loadingFirst: false,
					imageNameFirst: info.file.name,
				});
			});
		}
	};

	handlePreview = (image, name) => {
		this.setState({
			previewImage: image,
			previewTitle: name,
			previewVisible: true,
		});
	};

	handleCancel = () => {
		this.setState({
			previewVisible: false,
		});
	};

	handleChangeTitle = (e) => {
		this.setState({
			title: e.target.value.trim(),
		});
	};
	handleChangeContent = (e) => {
		this.setState({
			content: e,
		});
	};

	submitAllForm = async () => {
		const { imageFirst } = this.state;
		let formInformation = await this.formInformationRef.current
			.validateFields()
			.then((values) => {
				return values;
			});
		let data = {
			title: formInformation.title.trim(),
			image: imageFirst,
			content: formInformation.content.trim(),
		};

		data && this.props.addArticle(data);
	};

	//  render
	render() {
		const {
			loadingFirst,
			imageFirst,
			previewImage,
			previewTitle,
			previewVisible,
			title,
			content,
		} = this.state;

		// console.log(title);
		// console.log(content);

		const uploadDragger = (
			<>
				{loadingFirst ? (
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
						<p className='ant-upload-text'>Pilih foto artikel</p>
						<p className='ant-upload-hint'>
							atau tarik dan letakkan gambar di sini
						</p>
					</div>
				)}
			</>
		);

		return (
			<>
				<Container className='mt-3'>
					<Row>
						<Col lg={4} xs={12} md={12}>
							<Upload.Dragger
								name='avatar'
								beforeUpload={this.beforeUpload}
								onChange={this.handleChangeFirst}
								showUploadList={false}
							>
								{imageFirst ? (
									<img
										src={imageFirst}
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
							{imageFirst === '' ? null : (
								<Row className='mt-1 justify-content-center'>
									<Button
										size='middle'
										// type='text'
										icon={<EyeOutlined />}
										onClick={() => this.handlePreview(imageFirst, 'Utama')}
									>
										Preview
									</Button>
									<span className='mx-1' />
									<Button
										size='middle'
										type='primary'
										icon={<DeleteOutlined />}
										danger
										onClick={() => this.setState({ imageFirst: '' })}
									>
										Hapus
									</Button>
								</Row>
							)}
							<Descriptions className='mt-3' title='Upload foto' size='small'>
								<Descriptions.Item>
									Format gambar .jpg .jpeg .png ukuran maksimal 7 MB{' '}
								</Descriptions.Item>
							</Descriptions>
						</Col>
						<Col>
							<Card id='information' bordered={false} style={{ width: '100%' }}>
								<Form
									ref={this.formInformationRef}
									layout='vertical'
									validateMessages={validateMessages}
									scrollToFirstError={true}
									autoComplete='off'
									initialValues={{
										title: '',
										content: '',
									}}
								>
									<Form.Item
										name='title'
										label='Judul'
										tooltip={{
											title: '',
											icon: <IconRequired />,
										}}
										rules={[
											{ required: true },
											{
												min: 10,
												message:
													'Judul artikel terlalu singkat. Masukkan minimal 10 karakter.',
											},
										]}
									>
										<Input
											placeholder='contoh: Cara budidaya tanaman dengan teknik hidroponik'
											onChange={(e) => this.handleChangeTitle(e)}
											minLength={10}
											maxLength={70}
											suffix={
												<>
													<div
														className=''
														style={{ color: COLORS.gray }}
													>{`${title.length} / 70`}</div>
												</>
											}
										/>
									</Form.Item>
									<Form.Item
										name='content'
										label='Isi'
										tooltip={{
											title: '',
											icon: <IconRequired />,
										}}
										rules={[
											{ required: true },
											{
												min: 40,
												message:
													'Isi terlalu singkat. Masukkan minimal 40 karakter',
											},
										]}
									>
										<ReactQuill
											theme='snow'
											modules={{
												toolbar: {
													container: quillContainerData,
												},
												imageResize: {
													parchment: Quill.import('parchment'),
													modules: ['Resize', 'DisplaySize', 'Toolbar'],
												},
											}}
											formats={quillFormats}
											preserveWhitespace={true}
											value={content}
											onChange={(e) => this.handleChangeContent(e)}
										/>
									</Form.Item>
								</Form>
							</Card>
							<Button
								className='mt-3 mb-3 float-right'
								type='primary'
								onClick={this.submitAllForm}
								htmlType='submit'
								// loading={loading}
							>
								Publish
							</Button>
						</Col>
					</Row>
					<Modal
						visible={previewVisible}
						title={previewTitle}
						footer={null}
						onCancel={this.handleCancel}
					>
						<img alt='example' style={{ width: '100%' }} src={previewImage} />
					</Modal>
				</Container>
			</>
		);
	}
}

// mapStateToProps here if needed
const mapStateToProps = (state) => {
	const { loading } = state.ArticleReducers;

	return {
		loading,
	};
};
// mapDispatchToProps here if needed

export default connect(mapStateToProps, {
	addArticle,
})(ArticleAdd);
