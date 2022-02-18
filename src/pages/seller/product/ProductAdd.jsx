//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { Component, useState, useEffect, createRef } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Container } from 'reactstrap';
import {
	Upload,
	Modal,
	message,
	Card,
	Anchor,
	Button,
	Input,
	Form,
	Select,
	Tooltip,
	Divider,
	Affix,
	Space,
	Alert,
	Spin,
} from 'antd';
import {
	PlusOutlined,
	LoadingOutlined,
	InfoCircleOutlined,
} from '@ant-design/icons';
import { Box } from '@material-ui/core';
import Compress from 'compress.js';
import { Redirect } from 'react-router';

//  Region Import Redux Action Type and Redux Action
import { addProduct, getProductAllCategories } from '../../../redux/actions';

//  Region Import Utility/Helper Function

//  Region Import Components
import InputCustom from './components/InputCustom';
import CourierCost from './components/CourierCost';
//  Region Import Assets
import IconRequired from '../../../assets/images/IconRequired';
//  Region Import Style

//  Region Import Constants
import { COLORS } from '../../../constants/colors';

const compress = new Compress();

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

const { Link } = Anchor;

const AnchorList = () => {
	const [targetOffset, setTargetOffset] = useState(undefined);
	useEffect(() => {
		setTargetOffset(window.innerHeight / 3);
	}, []);
	return (
		<Anchor
			targetOffset={targetOffset}
			offsetTop={75}
			style={{ backgroundColor: '#EBEFF2' }}
			bounds={120}
		>
			<Link href='#uploadphoto' title='Upload Foto Produk' />
			<Link href='#information' title='Informasi Produk' />
			<Link href='#delivery' title='Pengiriman' />
			{/* <Link href="#save" title="Selesai" /> */}
		</Anchor>
	);
};

const ButtonSubmit = ({ onClick, loading, onClickDraft }) => {
	const [targetOffset, setTargetOffset] = useState(true);

	useEffect(() => {
		window.onscroll = () => {
			switch (window.innerHeight) {
				case 640:
					setTargetOffset(window.scrollY / 1.9 < window.innerHeight - 20);
					break;
				case 657:
					setTargetOffset(window.scrollY / 1.6 < window.innerHeight - 20);
					break;
				case 667:
					setTargetOffset(window.scrollY / 1.8 < window.innerHeight - 20);
					break;
				case 720 && 731 && 736:
					setTargetOffset(window.scrollY / 1.5 < window.innerHeight - 20);
					break;
				case 812:
					setTargetOffset(window.scrollY / 1.3 < window.innerHeight - 20);
					break;
				case 803:
					setTargetOffset(window.scrollY / 1.1 < window.innerHeight - 20);
					break;
				case 823:
					setTargetOffset(window.scrollY / 1.21 < window.innerHeight - 20);
					break;
				default:
					setTargetOffset(window.scrollY / 0.85 < window.innerHeight - 20);
					break;
			}
		};
	}, []);

	return (
		<Card
			bordered={false}
			style={{
				backgroundColor: targetOffset ? 'white' : 'transparent',
				boxShadow: targetOffset ? '0px -5px 58px -24px rgba(0,0,0,0.62)' : '',
			}}
		>
			<Box className='d-flex' flexDirection='row-reverse'>
				<Space className='justify-content-center' align='center' wrap size={8}>
					<Button
						className='d-none d-lg-block d-md-block'
						type='link'
						htmlType='button'
						href='/product'
					>
						Kembali
					</Button>
					<Button htmlType='submit' loading={loading} onClick={onClickDraft}>
						Simpan & Arsipkan
					</Button>
					<Button
						type='primary'
						onClick={onClick}
						htmlType='submit'
						loading={loading}
					>
						Simpan & Jual
					</Button>
				</Space>
			</Box>
		</Card>
	);
};

const validateMessages = {
	required: 'Kolom tidak boleh kosong.',
};

const placeholder = `MEDIA TANAM TANAH SUBUR ORGANIK (HIJAU) KEEPONIC
Manfaat :
Merangsang pertumbuhan daun
Bunga buah
Memperbaiki ekosistem

Komposisi :
Daun teh
Tanah subur
Pupuk kandang
Kompos
Bakteri penyubur

Bebas jamur dan kimia
Menanam dengan aman dan subur

Dapat dipakai langsung dengan menggunakan pot
`;

class ProductAdd extends Component {
	constructor(props) {
		super(props);
		this.state = {
			previewImage: '',
			previewTitle: '',
			previewVisible: false,
			loadingFirst: false,
			loadingSecond: false,
			loadingThird: false,
			loadingFourth: false,
			imageFirst: '',
			imageSecond: '',
			imageThird: '',
			imageFourth: '',
			nameProduct: '',
			categoryProduct: '',
			descProduct: '',
			isProductNew: 1,
			priceProduct: 0,
			stockProduct: 0,
			weightProduct: 0,
			lengthProduct: 0,
			widthProduct: 0,
			heightProduct: 0,
			weight: 0,
			checkedWeight: 0,
		};

		this.formInformationRef = createRef();
		this.formDeliveryRef = createRef();
		this.timer = null;
	}

	componentDidMount() {
		const { getProductAllCategories } = this.props;
		getProductAllCategories();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.weight !== this.state.weight) {
			this.handleCheck();
		}
	}

	beforeUpload = (file) => {
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

	// Handle OnChange Start

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

	handleChangeSecond = async (info) => {
		if (info.file.status === 'uploading') {
			this.setState({ loadingSecond: true });
			return;
		}
		let compressImg = await compressImage(info.file.originFileObj);
		let getDataBase64 = compressImg[0].prefix + compressImg[0].data;
		if (
			getDataBase64 === this.state.imageFirst ||
			getDataBase64 === this.state.imageThird ||
			getDataBase64 === this.state.imageFourth
		) {
			message.error('Gambar tidak boleh sama dalam 1 produk');
			this.setState({ loadingSecond: false });
		} else {
			getBase64(info.file.originFileObj, () => {
				this.setState({
					imageSecond: getDataBase64,
					loadingSecond: false,
					imageNameSecond: info.file.name,
				});
			});
		}
	};

	handleChangeThird = async (info) => {
		if (info.file.status === 'uploading') {
			this.setState({ loadingThird: true });
			return;
		}
		let compressImg = await compressImage(info.file.originFileObj);
		let getDataBase64 = compressImg[0].prefix + compressImg[0].data;
		if (
			getDataBase64 === this.state.imageFirst ||
			getDataBase64 === this.state.imageSecond ||
			getDataBase64 === this.state.imageFourth
		) {
			message.error('Gambar tidak boleh sama dalam 1 produk');
			this.setState({ loadingThird: false });
		} else {
			getBase64(info.file.originFileObj, (imageUrl) =>
				this.setState({
					imageThird: getDataBase64,
					loadingThird: false,
					imageNameThird: info.file.name,
				})
			);
		}
	};

	handleChangeFourth = async (info) => {
		if (info.file.status === 'uploading') {
			this.setState({ loadingFourth: true });
			return;
		}
		let compressImg = await compressImage(info.file.originFileObj);
		let getDataBase64 = compressImg[0].prefix + compressImg[0].data;

		if (
			getDataBase64 === this.state.imageFirst ||
			getDataBase64 === this.state.imageSecond ||
			getDataBase64 === this.state.imageThird
		) {
			message.error('Gambar tidak boleh sama dalam 1 produk');
			this.setState({ loadingFourth: false });
		} else {
			getBase64(info.file.originFileObj, (imageUrl) =>
				this.setState({
					imageFourth: getDataBase64,
					loadingFourth: false,
					imageNameFourth: info.file.name,
				})
			);
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

	handleChangeName = (e) => {
		this.setState({
			nameProduct: e.target.value,
		});
	};

	handleChangeCategory = (value) => {
		let category = parseInt(value);
		this.setState({
			categoryProduct: category,
		});
	};

	handleChangeTextArea = (e) => {
		this.setState({
			descProduct: e.target.value,
		});
	};

	handleChangeIsProductNew = (e) => {
		this.setState({
			isProductNew: e.target.value,
		});
	};

	// Handle OnChange End

	// Validator Input Start
	checkPrice = (_, value) => {
		if (value.number > 99 && value.number < 500000000) {
			this.setState({
				priceProduct: value.number,
			});
			return Promise.resolve();
		} else if (value.number < 100) {
			return Promise.reject(new Error('Harga minimum produk adalah Rp 100'));
		}
		if (value.number > 500000000) {
			return Promise.reject(
				new Error('Harga produk telah melebihi batas maksimal Rp 500.000.000')
			);
		}
	};

	checkStock = (_, value) => {
		if (value.number < 0 || value.number > 999999) {
			return Promise.reject(
				new Error('Stok yang diperbolehkan hanya sampai 999.999')
			);
		} else {
			this.setState({
				stockProduct: value.number,
			});
			return Promise.resolve();
		}
	};

	checkWeight = (_, value) => {
		this.setState({
			weight: value.number,
		});

		if (value.number < 1 || value.number > 30000) {
			return Promise.reject(
				new Error('Berat produk yang diperbolehkan antara 1 sampai 30000 gram')
			);
		} else {
			this.setState({
				weightProduct: value.number,
			});
			return Promise.resolve();
		}
	};

	handleCheck = () => {
		clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			this.setState((prevState) => ({ checkedWeight: prevState.weight }));
		}, 100);
	};

	checkLength = (_, value) => {
		if (value.number < 0 || value.number > 1000000) {
			return Promise.reject(new Error('Hanya antara 1 sampai 1000000'));
		} else {
			this.setState({
				lengthProduct: value.number,
			});
			return Promise.resolve();
		}
	};

	checkWidth = (_, value) => {
		if (value.number < 0 || value.number > 1000000) {
			return Promise.reject(new Error('Hanya antara 1 sampai 1000000'));
		} else {
			this.setState({
				widthProduct: value.number,
			});
			return Promise.resolve();
		}
	};

	checkHeight = (_, value) => {
		if (value.number < 0 || value.number > 1000000) {
			return Promise.reject(new Error('Hanya antara 1 sampai 1000000'));
		} else {
			this.setState({
				heightProduct: value.number,
			});
			return Promise.resolve();
		}
	};

	// Validator Input End

	// Submit Form
	submitAllForm = async () => {
		const { imageFirst } = this.state;
		if (imageFirst === '') {
			message.error({
				content: 'Foto Utama tidak boleh kosong',
				style: {
					marginTop: '0',
				},
			});
			window.scrollTo({
				top: 0,
				behavior: 'smooth',
			});
		} else {
			let formInformation = await this.formInformationRef.current
				.validateFields()
				.then((values) => {
					return values;
				});

			let formDelivery = await this.formDeliveryRef.current
				.validateFields()
				.then((values) => {
					return values;
				});
			let data = {};
			data = {
				avatar: this.state.imageFirst,
				second_avatar: this.state.imageSecond,
				third_avatar: this.state.imageThird,
				fourth_avatar: this.state.imageFourth,
				name: formInformation.name.trim(),
				t_category_id: parseInt(formInformation.category),
				description: formInformation.description.trim(),
				price: formInformation.price.number,
				stock: formInformation.stock.number,
				weight: formDelivery.weight.number,
				lengths: formDelivery.length.number,
				width: formDelivery.width.number,
				height: formDelivery.height.number,
				status: 1,
			};
			data && this.props.addProduct(data);
		}
	};

	submitAllFormDraft = async () => {
		const { imageFirst } = this.state;
		if (imageFirst === '') {
			message.error({
				content: 'Foto Utama tidak boleh kosong',
				style: {
					marginTop: '0',
				},
			});
			window.scrollTo({
				top: 0,
				behavior: 'smooth',
			});
		} else {
			let formInformation = await this.formInformationRef.current
				.validateFields()
				.then((values) => {
					return values;
				});

			let formDelivery = await this.formDeliveryRef.current
				.validateFields()
				.then((values) => {
					return values;
				});
			let data = {};
			data = {
				avatar: this.state.imageFirst,
				second_avatar: this.state.imageSecond,
				third_avatar: this.state.imageThird,
				fourth_avatar: this.state.imageFourth,
				name: formInformation.name,
				t_category_id: parseInt(formInformation.category),
				description: formInformation.description,
				price: formInformation.price.number,
				stock: formInformation.stock.number,
				weight: formDelivery.weight.number,
				length: formDelivery.length.number,
				width: formDelivery.width.number,
				height: formDelivery.height.number,
				status: 0,
			};
			data && this.props.addProduct(data);
		}
	};

	renderRedirectBack = () => {
		if (this.props.profile.address.length === 0) {
			return <Redirect to='/product' />;
		}
	};

	render() {
		const {
			loadingFirst,
			loadingSecond,
			loadingThird,
			loadingFourth,
			imageFirst,
			imageSecond,
			imageThird,
			imageFourth,
			previewImage,
			previewTitle,
			previewVisible,
			nameProduct,
			descProduct,
			lengthProduct,
			widthProduct,
			heightProduct,
		} = this.state;

		const { loading, categories } = this.props;

		let volumetrikPrice =
			((lengthProduct * widthProduct * heightProduct) / 6000) * 1000;

		const { Option } = Select;

		const uploadButtonFirst = (
			<div>
				{loadingFirst ? <LoadingOutlined /> : <PlusOutlined />}
				<div style={{ marginTop: 8 }}>Utama</div>
			</div>
		);

		const uploadButtonSecond = (
			<div>
				{loadingSecond ? <LoadingOutlined /> : <PlusOutlined />}
				<div style={{ marginTop: 8 }}>Samping</div>
			</div>
		);

		const uploadButtonThird = (
			<div>
				{loadingThird ? <LoadingOutlined /> : <PlusOutlined />}
				<div style={{ marginTop: 8 }}>Belakang</div>
			</div>
		);

		const uploadButtonFourth = (
			<div>
				{loadingFourth ? <LoadingOutlined /> : <PlusOutlined />}
				<div style={{ marginTop: 8 }}>Lainnya</div>
			</div>
		);

		return (
			<>
				{this.renderRedirectBack()}
				{this.props.profile.address.length !== 0 && (
					<Spin spinning={loading} delay={200}>
						<Container>
							<Row className='mt-3'>
								<Col lg={10} md={9}>
									<Row id='uploadphoto'>
										<Col lg={12}>
											<Card title='Foto Produk' bordered={false}>
												<Card
													bordered={false}
													style={{ border: 'dashed 2px #BEBEBE' }}
												>
													<Row className='justify-content-center'>
														<Alert
															showIcon
															style={{ fontSize: 12 }}
															message='Format gambar .jpg, .jpeg, .png dan ukuran minimum
														300 x 300 piksel (Untuk gambar yang optimal gunakan
														ukuran 500 x 500 piksel'
															type='info'
														/>
													</Row>
													<Row className='justify-content-center mb-3 mt-3'>
														<Col xs={6} lg={2} md={6}>
															<Upload
																accept='.jpg, .jpeg, .png'
																name='avatar'
																listType='picture-card'
																className='avatar-uploader'
																showUploadList={false}
																beforeUpload={this.beforeUpload}
																onChange={this.handleChangeFirst}
															>
																{imageFirst ? (
																	<img
																		src={imageFirst}
																		alt='avatar'
																		style={{
																			maxWidth: '100%',
																			maxHeight: '100%',
																			padding: 5,
																		}}
																	/>
																) : (
																	uploadButtonFirst
																)}
															</Upload>
															{imageFirst === '' ? null : (
																<Row className='mb-2'>
																	<Col xs={5} lg={5}>
																		<Button
																			size='small'
																			type='text'
																			style={{ fontSize: 11 }}
																			onClick={() =>
																				this.handlePreview(imageFirst, 'Utama')
																			}
																		>
																			Preview
																		</Button>
																	</Col>
																	<Col xs={5} lg={5}>
																		<Button
																			size='small'
																			type='text'
																			danger
																			style={{ fontSize: 11 }}
																			onClick={() =>
																				this.setState({ imageFirst: '' })
																			}
																		>
																			Hapus
																		</Button>
																	</Col>
																</Row>
															)}
														</Col>
														<Col xs={6} lg={2} md={6}>
															<Upload
																accept='.jpg, .jpeg, .png'
																name='avatar'
																listType='picture-card'
																className='avatar-uploader'
																showUploadList={false}
																beforeUpload={this.beforeUpload}
																onChange={this.handleChangeSecond}
																disabled={!imageFirst ? true : false}
															>
																{imageSecond ? (
																	<img
																		src={imageSecond}
																		alt='avatar'
																		style={{
																			maxWidth: '100%',
																			maxHeight: '100%',
																			padding: 5,
																		}}
																	/>
																) : (
																	uploadButtonSecond
																)}
															</Upload>
															{imageSecond === '' ? null : (
																<Row className='mb-2'>
																	<Col xs={5} lg={5}>
																		<Button
																			size='small'
																			type='text'
																			style={{ fontSize: 11 }}
																			onClick={() =>
																				this.handlePreview(
																					imageSecond,
																					'Samping'
																				)
																			}
																		>
																			Preview
																		</Button>
																	</Col>
																	<Col xs={5} lg={5}>
																		<Button
																			size='small'
																			type='text'
																			danger
																			style={{ fontSize: 11 }}
																			onClick={() =>
																				this.setState({ imageSecond: '' })
																			}
																		>
																			Hapus
																		</Button>
																	</Col>
																</Row>
															)}
														</Col>
														<Col xs={6} lg={2} md={6}>
															<Upload
																accept='.jpg, .jpeg, .png'
																name='avatar'
																listType='picture-card'
																className='avatar-uploader'
																showUploadList={false}
																beforeUpload={this.beforeUpload}
																onChange={this.handleChangeThird}
																disabled={!imageSecond ? true : false}
															>
																{imageThird ? (
																	<img
																		src={imageThird}
																		alt='avatar'
																		style={{
																			maxWidth: '100%',
																			maxHeight: '100%',
																			padding: 5,
																		}}
																	/>
																) : (
																	uploadButtonThird
																)}
															</Upload>
															{imageThird === '' ? null : (
																<Row className='mb-2'>
																	<Col xs={5} lg={5}>
																		<Button
																			size='small'
																			type='text'
																			style={{ fontSize: 11 }}
																			onClick={() =>
																				this.handlePreview(
																					imageThird,
																					'Belakang'
																				)
																			}
																		>
																			Preview
																		</Button>
																	</Col>
																	<Col xs={5} lg={5}>
																		<Button
																			size='small'
																			type='text'
																			danger
																			style={{ fontSize: 11 }}
																			onClick={() =>
																				this.setState({ imageThird: '' })
																			}
																		>
																			Hapus
																		</Button>
																	</Col>
																</Row>
															)}
														</Col>
														<Col xs={6} lg={2} md={6}>
															<Upload
																accept='.jpg, .jpeg, .png'
																name='avatar'
																listType='picture-card'
																className='avatar-uploader'
																showUploadList={false}
																beforeUpload={this.beforeUpload}
																onChange={this.handleChangeFourth}
																disabled={!imageThird ? true : false}
															>
																{imageFourth ? (
																	<img
																		src={imageFourth}
																		alt='avatar'
																		style={{
																			maxWidth: '100%',
																			maxHeight: '100%',
																			padding: 5,
																		}}
																	/>
																) : (
																	uploadButtonFourth
																)}
															</Upload>
															{imageFourth === '' ? null : (
																<Row className='mb-2'>
																	<Col xs={5} lg={5}>
																		<Button
																			size='small'
																			type='text'
																			style={{ fontSize: 11 }}
																			onClick={() =>
																				this.handlePreview(
																					imageFourth,
																					'Lainnya'
																				)
																			}
																		>
																			Preview
																		</Button>
																	</Col>
																	<Col xs={5} lg={5}>
																		<Button
																			size='small'
																			type='text'
																			danger
																			style={{ fontSize: 11 }}
																			onClick={() =>
																				this.setState({ imageFourth: '' })
																			}
																		>
																			Hapus
																		</Button>
																	</Col>
																</Row>
															)}
														</Col>
													</Row>
												</Card>
											</Card>
										</Col>
									</Row>
									<Row className='mt-2'>
										<Col lg={12}>
											<Card
												id='information'
												title='Informasi Produk'
												bordered={false}
												style={{ width: '100%' }}
											>
												<Form
													ref={this.formInformationRef}
													layout='vertical'
													validateMessages={validateMessages}
													initialValues={{
														condition: this.state.isProductNew,
														price: {
															number: 0,
														},
														stock: {
															number: 0,
														},
														description: '',
													}}
													scrollToFirstError={true}
													autoComplete='off'
												>
													<Form.Item
														name='name'
														label='Nama'
														tooltip={{
															title: '',
															icon: <IconRequired />,
														}}
														rules={[
															{ required: true },
															{
																min: 10,
																message:
																	'Nama produk terlalu singkat. Masukkan minimal 10 karakter.',
															},
														]}
													>
														<Input
															placeholder='contoh: pipa hidroponik diameter 32 mm'
															onChange={(e) => this.handleChangeName(e)}
															minLength={10}
															maxLength={70}
															suffix={
																<>
																	<Tooltip>
																		<div
																			className=''
																			style={{ color: COLORS.gray }}
																		>{`${nameProduct.length} / 70`}</div>
																	</Tooltip>
																	<Divider type='vertical' />
																	<Tooltip>
																		<div
																			className='px-1'
																			style={{
																				color: COLORS.gray,
																				fontSize: 12,
																			}}
																		>
																			Tips
																		</div>
																	</Tooltip>
																	<Tooltip
																		title='Nama minimal 10 karakter, terdiri dari nama produk, jenis, ukuran dan sebagainya'
																		style={{ fontSize: 11 }}
																	>
																		<InfoCircleOutlined
																			style={{ color: 'rgba(0,0,0,.45)' }}
																		/>
																	</Tooltip>
																</>
															}
														/>
													</Form.Item>
													<Form.Item
														name='category'
														label='Kategori'
														rules={[{ required: true }]}
													>
														<Select
															placeholder='Pilih Kategori'
															onChange={(value) =>
																this.handleChangeCategory(value)
															}
														>
															{categories &&
																categories.map((row) => (
																	<Option key={row.id} value={`${row.id}`}>
																		{row.name}
																	</Option>
																))}
														</Select>
													</Form.Item>
													<Form.Item
														name='description'
														label='Deskripsi'
														tooltip={{
															title: '',
															icon: <IconRequired />,
														}}
														rules={[
															{ required: true },
															{
																min: 20,
																message:
																	'Deskripsi produk terlalu singkat. Masukkan minimal 20 karakter.',
															},
														]}
													>
														<Row>
															<Col xs={11}>
																<Input.TextArea
																	value={descProduct}
																	onChange={this.handleChangeTextArea}
																	autoSize={{ minRows: 10, maxRows: 12 }}
																	showCount
																	placeholder={placeholder}
																	maxLength={2000}
																	minLength={20}
																/>
															</Col>
															<Col xs={1}>
																<Tooltip
																	title='Jelaskan cara penggunaan, spesifikasi, manfaat, garansi produk dan lainnya.'
																	style={{ fontSize: 11 }}
																>
																	<p
																		className='d-inline mr-1'
																		style={{ color: COLORS.gray, fontSize: 12 }}
																	>
																		Tips
																	</p>
																	<InfoCircleOutlined
																		style={{ color: 'rgba(0,0,0,.45)' }}
																	/>
																</Tooltip>
															</Col>
														</Row>
													</Form.Item>
													{/* <Form.Item name='condition' label='Kondisi'>
													<Radio.Group
														size='middle'
														options={options}
														onChange={this.handleChangeIsProductNew}
														value={this.state.isProductNew}
													/>
												</Form.Item> */}
													<Form.Item
														name='price'
														label='Harga'
														tooltip={{
															title: '',
															icon: <IconRequired />,
														}}
														rules={[{ validator: this.checkPrice }]}
													>
														<InputCustom
															prefix={'Rp'}
															suffix={
																<>
																	<Tooltip>
																		<div
																			className='px-1'
																			style={{
																				color: COLORS.gray,
																				fontSize: 12,
																			}}
																		>
																			Tips
																		</div>
																	</Tooltip>
																	<Tooltip
																		title='Berikan harga yang sesuai dan kompetitif, jika harga tidak sesuai, produk dapat dihapus oleh Admin.'
																		style={{ fontSize: 11 }}
																	>
																		<InfoCircleOutlined
																			style={{ color: 'rgba(0,0,0,.45)' }}
																		/>
																	</Tooltip>
																</>
															}
														/>
													</Form.Item>
													<Form.Item
														name='stock'
														label='Stok'
														tooltip={{
															title: '',
															icon: <IconRequired />,
														}}
														rules={[{ validator: this.checkStock }]}
													>
														<InputCustom
															suffix={
																<>
																	<Tooltip>
																		<div
																			className='px-1'
																			style={{
																				color: COLORS.gray,
																				fontSize: 12,
																			}}
																		>
																			Tips
																		</div>
																	</Tooltip>
																	<Tooltip
																		title='Stok hanya diperbolehkan mulai 1 sampai 999.999 saja.'
																		style={{ fontSize: 11 }}
																	>
																		<InfoCircleOutlined
																			style={{ color: 'rgba(0,0,0,.45)' }}
																		/>
																	</Tooltip>
																</>
															}
														/>
													</Form.Item>
												</Form>
											</Card>
										</Col>
									</Row>
									<Row className='mt-2'>
										<Col lg={12}>
											<Card
												id='delivery'
												title='Pengiriman'
												bordered={false}
												style={{ width: '100%' }}
											>
												<Form
													ref={this.formDeliveryRef}
													layout='vertical'
													validateMessages={validateMessages}
													initialValues={{
														weight: {
															number: 0,
														},
														length: {
															number: 0,
														},
														width: {
															number: 0,
														},
														height: {
															number: 0,
														},
													}}
													autoComplete='off'
												>
													<Form.Item
														name='weight'
														label='Perkiraan Berat'
														tooltip={{
															title: '',
															icon: <IconRequired />,
														}}
														rules={[{ validator: this.checkWeight }]}
														style={{ width: '80%' }}
													>
														<InputCustom
															suffix={
																<>
																	<Tooltip>
																		<div
																			className=''
																			style={{ color: COLORS.gray }}
																		>{`gram`}</div>
																	</Tooltip>
																	<Divider type='vertical' />
																	<Tooltip>
																		<div
																			className='pr-1'
																			style={{
																				color: COLORS.gray,
																				fontSize: 12,
																			}}
																		>
																			Tips
																		</div>
																	</Tooltip>
																	<Tooltip
																		title='Masukkan berat produk setelah dikemas untuk kalkulasi ongkos kirim yang akurat'
																		style={{ fontSize: 11 }}
																	>
																		<InfoCircleOutlined
																			style={{ color: 'rgba(0,0,0,.45)' }}
																		/>
																	</Tooltip>
																</>
															}
														/>
													</Form.Item>
													<Form.Item
														label='Ukuran Paket'
														style={{ marginBottom: 0 }}
													>
														<Row>
															<Col lg={3} xs={12}>
																<Form.Item
																	name='length'
																	rules={[{ validator: this.checkLength }]}
																>
																	<InputCustom
																		addonBefore='Panjang'
																		suffix={
																			<>
																				<Tooltip>
																					<div
																						className=''
																						style={{ color: COLORS.gray }}
																					>{`cm`}</div>
																				</Tooltip>
																			</>
																		}
																	/>
																</Form.Item>
															</Col>
															<Col lg={3} xs={12}>
																<Form.Item
																	name='width'
																	rules={[{ validator: this.checkWidth }]}
																>
																	<InputCustom
																		addonBefore='Lebar'
																		suffix={
																			<>
																				<Tooltip>
																					<div
																						className=''
																						style={{ color: COLORS.gray }}
																					>{`cm`}</div>
																				</Tooltip>
																			</>
																		}
																	/>
																</Form.Item>
															</Col>
															<Col lg={3} xs={12}>
																<Form.Item
																	name='height'
																	rules={[{ validator: this.checkHeight }]}
																>
																	<InputCustom
																		addonBefore='Tinggi'
																		suffix={
																			<>
																				<Tooltip>
																					<div
																						className=''
																						style={{ color: COLORS.gray }}
																					>{`cm`}</div>
																				</Tooltip>
																			</>
																		}
																	/>
																</Form.Item>
															</Col>
															<Tooltip
																title='Masukkan dimensi produk setelah dikemas untuk kalkulasi ongkos kirim yang akurat'
																style={{ fontSize: 11 }}
															>
																<p
																	className='d-inline mx-1'
																	style={{ color: COLORS.gray, fontSize: 12 }}
																>
																	Tips
																</p>
																<InfoCircleOutlined
																	style={{ color: 'rgba(0,0,0,.45)' }}
																/>
															</Tooltip>
														</Row>
													</Form.Item>

													<Form.Item
														label='Ongkos Kirim'
														style={{ width: '80%' }}
													>
														<CourierCost
															weight={
																parseInt(volumetrikPrice) >
																this.state.checkedWeight
																	? parseInt(volumetrikPrice)
																	: this.state.checkedWeight
															}
														/>
														<Card
															size={'small'}
															style={{ fontSize: 13, padding: 0 }}
														>
															Pengaturan jasa kirim hanya akan diterapkan pada
															produk ini. Ongkos Kirim yang dimunculkan adalah
															tarif dasar yang dapat berubah berdasarkan berat &
															lokasi Pembeli
														</Card>
													</Form.Item>
												</Form>
											</Card>
										</Col>
									</Row>
									<Affix offsetBottom={0}>
										<ButtonSubmit
											onClick={this.submitAllForm}
											onClickDraft={this.submitAllFormDraft}
											loading={loading}
										/>
									</Affix>
								</Col>
								<Col
									lg={2}
									md={3}
									className=' d-none d-xs-none d-sm-none d-md-block d-lg-block'
								>
									<AnchorList />
								</Col>
							</Row>
						</Container>

						<Modal
							visible={previewVisible}
							title={previewTitle}
							footer={null}
							onCancel={this.handleCancel}
						>
							<img alt='example' style={{ width: '100%' }} src={previewImage} />
						</Modal>
					</Spin>
				)}
			</>
		);
	}
}

const mapStateToProps = (state) => {
	const { loading, categories } = state.ProductReducers;
	const { profile } = state.ProfileReducers;

	return {
		loading,
		profile,
		categories,
	};
};

export default connect(mapStateToProps, {
	addProduct,
	getProductAllCategories,
})(ProductAdd);
