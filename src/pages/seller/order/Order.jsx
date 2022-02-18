//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
	Typography,
	Paper,
	Box,
	TablePagination,
	ListItemText,
} from '@material-ui/core';
import {
	Empty,
	Tag,
	Badge,
	Button,
	Modal,
	Spin,
	Typography as TyAntd,
	List,
	Timeline,
	Form,
	Input,
	Rate,
	Radio,
} from 'antd';
import { withTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';
//  Region Import Redux Action Type and Redux Action
import {
	onChangeStatePathInfo,
	onChangeRow,
	onChangePage,
	getOrder,
	getDetailOrder,
	shippingOrderStatus,
	updateOrderStatus,
	onChangeSearch,
} from '../../../redux/actions';

//  Region Import Utility/Helper Function
import { getLoggedInUser } from '../../../helpers/authUtils';
import { toRupiah } from '../../../helpers/utility';
import i18n from '../../../i18n';

//  Region Import Components
import TabMenuOrder from './components/TabMenuOrder';
import TitlePage from '../../../components/TitlePage';
import OrderUnpaid from './components/OrderUnpaid';
import OrderPaid from './components/OrderPaid';
import { ExportToExcel } from './components/ExportToExcel';

//  Region Import Constants
import { COLORS } from '../../../constants/colors';
import moment from 'moment';
import { Pagination } from '@material-ui/lab';

const paths = {
	0: {
		path: 'order-new',
	},
	1: {
		path: 'order-received',
	},
	2: {
		path: 'order-in-shipping',
	},
	3: {
		path: 'order-finished',
	},
};

const slug = {
	unpaid: 0,
	received: 1,
	'in-shipping': 2,
	finished: 3,
};

class Order extends Component {
	//  constructor declaration
	constructor(props) {
		super(props);
		this.state = {
			user: getLoggedInUser(),
			valueIndex: slug['received'],
			pathValue: paths[slug['received']],
			modalVisible: false,
			modalTrackingVisible: false,
			modalChangeResi: false,
			shipment_code: '',
			id: null,
		};
		this.formChangeResi = createRef();
	}
	//  react lifecycle (componentDidMount, componentDidUpdate, etc)
	componentDidMount() {
		this.props.onChangeStatePathInfo('path', 'received');
		this.props.onChangeRow('row', 5);
		this.props.onChangePage('page', 0);
		this.props.onChangeSearch('q', '');
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.shipment_code !== this.state.shipment_code) {
			this.formChangeResi.current.setFieldsValue({
				shipment_code: this.state.shipment_code,
			});
		}
	}

	//  Function declaration (handle, onchange, etc)
	handleOnChange = (event, valueIndex) => {
		switch (valueIndex) {
			case slug['unpaid']:
				this.setState({ valueIndex: slug['unpaid'] });
				this.props.onChangeStatePathInfo('path', 'unpaid');
				this.props.onChangeRow('row', 5);
				this.props.onChangePage('page', 0);
				break;
			case slug['received']:
				this.setState({ valueIndex: slug['received'] });
				this.props.onChangeStatePathInfo('path', 'received');
				this.props.onChangeRow('row', 5);
				this.props.onChangePage('page', 0);
				break;
			case slug['in-shipping']:
				this.setState({ valueIndex: slug['in-shipping'] });
				this.props.onChangeStatePathInfo('path', 'in-shipping');
				this.props.onChangeRow('row', 5);
				this.props.onChangePage('page', 0);
				this.props.onChangeSearch('q', 'progress');
				this.props.getOrder();
				break;
			case slug['finished']:
				this.setState({ valueIndex: slug['finished'] });
				this.props.onChangeStatePathInfo('path', 'finished');
				this.props.onChangeRow('row', 5);
				this.props.onChangePage('page', 0);
				break;
			default:
				break;
		}
	};

	renderShippingStatus = (status) => {
		switch (status) {
			case 'IN PROGRESS':
				return (
					<Tag
						color='warning'
						style={{ fontWeight: 600 }}
					>{`Sedang Diproses`}</Tag>
				);
			case 'DELIVERED':
				return (
					<Tag color='success' style={{ fontWeight: 600 }}>{`Terkirim`}</Tag>
				);
			case undefined:
				return <Tag color='red' style={{ fontWeight: 600 }}>{`Menunggu`}</Tag>;
			default:
				break;
		}
	};

	renderShippingDesc = (status, desc) => {
		switch (status) {
			case 'IN PROGRESS':
				return (
					<div className='mt-2 mb-1'>
						<Badge
							status='processing'
							color='orange'
							text={
								<Typography
									variant='button'
									gutterBottom
								>{`${desc}`}</Typography>
							}
						/>
					</div>
				);
			case 'DELIVERED':
				return (
					<div className='mt-2 mb-1'>
						<Badge
							status='success'
							text={
								<Typography
									variant='button'
									gutterBottom
								>{`${desc}`}</Typography>
							}
						/>
					</div>
				);
			case undefined:
				return (
					<div className='mt-2 mb-1'>
						<Badge
							status='error'
							text={
								<Typography
									variant='button'
									gutterBottom
								>{`Menunggu status pengiriman oleh kurir.`}</Typography>
							}
						/>
					</div>
				);
			default:
				break;
		}
	};

	handleChangePage = (event, nextPage) => {
		this.props.onChangePage('page', nextPage);
		this.props.getOrder();
	};

	handleChangePagination = (e, nextPage) => {
		this.props.onChangePage('page', nextPage - 1);
		this.props.getOrder();
	};

	handleChangeRowsPerPage = (event) => {
		this.props.onChangeRow(
			'row',
			parseInt(event.target.value, [5, 10, 25, 50, 100])
		);
		this.props.onChangePage('page', 0);
		this.props.getOrder();
	};

	handleModalDetail = (id) => {
		this.setState({
			modalVisible: true,
			// id: id,
		});
		this.handleGetOrder(id);
	};

	handleGetOrder = (id) => {
		this.props.getDetailOrder(id);
	};

	handleCloseModal = () => {
		this.setState({
			modalVisible: false,
			// id: id,
		});
	};

	handleModalTracking = (id, shipment_type, shipment_code) => {
		this.setState({
			modalTrackingVisible: true,
			// id: id,
		});
		this.handleGetTracking(id, shipment_type, shipment_code);
	};

	handleGetTracking = (id, shipment_type, shipment_code) => {
		this.props.getDetailOrder(id);
		this.props.shippingOrderStatus(shipment_type, shipment_code);
	};

	handleCloseModalTracking = () => {
		this.setState({
			modalTrackingVisible: false,
			// id: id,
		});
	};

	handleModalChangeResi = (id, shipment_code) => {
		this.setState({
			modalChangeResi: true,
			shipment_code: shipment_code,
			id: id,
		});
	};

	handleFinish = (values) => {
		Modal.confirm({
			title: 'Apakah nomor resi sudah benar?',
			centered: true,
			okText: 'Konfirmasi',
			cancelText: 'Batal',
			onOk: () => {
				this.props.updateOrderStatus(values, this.state.id);
				this.setState({
					modalChangeResi: false,
					id: null,
				});
			},
		});
	};

	handleCloseModalChangeResi = () => {
		this.setState({
			modalChangeResi: false,
			id: null,
			shipment_code: '',
		});
	};

	onRadioChange = (e) => {
		this.props.onChangePage('page', 0);
		this.props.onChangeSearch('q', e.target.value);
		this.props.getOrder();
	};

	//  render
	render() {
		const { valueIndex } = this.state;
		const { path, loadingDetail, order, shipping } = this.props;
		return (
			<>
				<div>
					<Row>
						<Col lg={12}>
							<TitlePage
								title={i18n.t('list_order')}
								button={<ExportToExcel />}
							/>
						</Col>
					</Row>

					<Row>
						<Col lg={12}>
							<TabMenuOrder
								value={valueIndex}
								handleOnChange={this.handleOnChange}
							/>
						</Col>
					</Row>

					<Row className='mt-2'>
						<Col lg={12}>
							{path === 'unpaid' && (
								<Paper elevation={0} className='px-3 py-3'>
									<OrderUnpaid />
								</Paper>
							)}
							{path === 'received' && (
								<Paper elevation={0} className='px-3 py-3'>
									<OrderPaid />
								</Paper>
							)}
							{path === 'in-shipping' && (
								<>
									<Radio.Group
										defaultValue='progress'
										buttonStyle='solid'
										onChange={this.onRadioChange}
										className='mb-2'
									>
										<Radio.Button value='progress'>
											Dalam Pengiriman
										</Radio.Button>
										<Radio.Button value='finish'>Selesai</Radio.Button>
									</Radio.Group>
									{this.props.orderInShipping.length === 0 ? (
										<Paper elevation={0} className='px-3 py-3 mb-2'>
											<Empty description={i18n.t('order_not_found')} />
										</Paper>
									) : (
										this.props.orderInShipping &&
										this.props.orderInShipping.map((row) => (
											<Paper
												elevation={0}
												className='px-3 py-3 mb-2'
												key={row.id}
											>
												<Box display='flex'>
													<Box flexGrow={1} display='flex' flexWrap='wrap'>
														<Link
															onClick={(e) => {
																e.stopPropagation();
																this.handleModalDetail(row.id);
															}}
															role='button'
															className='mr-2'
														>
															<Typography
																style={{ textTransform: 'none' }}
																className='mr-1'
																variant='button'
																gutterBottom
															>{`${row.invoice_id} - ${row.sec_user_model.name} `}</Typography>
														</Link>
													</Box>
													<Box display='flex' flexWrap='wrap'>
														<Typography
															className='mr-1'
															variant='button'
															style={{ fontSize: 14 }}
															gutterBottom
														>
															Resi{' '}
															<Tag color='default'>{`${row.shipment_code}`}</Tag>
														</Typography>
													</Box>
												</Box>

												<Typography
													style={{
														fontSize: 13,
														color: COLORS.semiBold,
														fontWeight: 'lighter',
													}}
													gutterBottom
												>{`Tanggal Pengiriman: ${moment(
													row.updated_date
												).format('LLLL')}`}</Typography>

												<Typography
													style={{ fontSize: 18 }}
													className='mt-2'
													gutterBottom
												>
													{
														<Tag color='default'>{`Total: ${toRupiah(
															row.total_price,
															{
																replaceZeroDecimals: true,
																formal: false,
															}
														)}`}</Tag>
													}
												</Typography>
												{row.status === 3 && row.rating > 0 && (
													<Rate disabled defaultValue={row.rating} />
												)}
												<Box display='flex' justifyContent='center'>
													<Link
														onClick={(e) => {
															e.stopPropagation();
															this.handleModalTracking(
																row.id,
																row.shipment_type,
																row.shipment_code
															);
														}}
														role='button'
														className='mr-2'
													>
														<Typography
															style={{ textTransform: 'none' }}
															variant='button'
															gutterBottom
														>
															Status Pengiriman
														</Typography>
													</Link>
													<Link
														onClick={(e) => {
															e.stopPropagation();
															this.handleModalChangeResi(
																row.id,
																row.shipment_code
															);
														}}
														role='button'
													>
														{row.status !== 3 && (
															<Typography
																style={{ textTransform: 'none' }}
																variant='button'
																gutterBottom
															>
																Ubah Nomor Resi
															</Typography>
														)}
													</Link>
												</Box>
											</Paper>
										))
									)}
								</>
							)}
							{path === 'finished' && (
								<Paper elevation={0} className='px-3 py-3 mb-2'>
									<Empty description={i18n.t('order_not_found')} />
								</Paper>
							)}
							<Paper elevation={0}>
								<Row>
									<Col className='d-sm-none d-none d-md-block d-lg-block float-right'>
										<TablePagination
											className='mt-2'
											component='div'
											count={
												this.props.totalItems !== undefined
													? this.props.totalItems
													: 0
											}
											page={this.props.page}
											onChangePage={this.handleChangePage}
											labelRowsPerPage={i18n.t('show_data_by')}
											rowsPerPageOptions={[5, 10, 25, 50, 100]}
											rowsPerPage={this.props.row}
											onChangeRowsPerPage={this.handleChangeRowsPerPage}
										/>
									</Col>
									<Col className='d-sm-block d-md-none d-lg-none py-2 mr-2'>
										<Pagination
											className='float-right'
											count={this.props.totalPages}
											variant='outlined'
											page={this.props.page + 1}
											shape='rounded'
											onChange={this.handleChangePagination}
										/>
									</Col>
								</Row>
							</Paper>
						</Col>
					</Row>
				</div>

				{/* Modal Konfirmasi Resi */}
				<Modal
					title='Detail Pesanan'
					centered
					onOk={this.handleCloseModal}
					onCancel={this.handleCloseModal}
					visible={this.state.modalVisible}
					width={800}
					footer={[
						<Button key='back' onClick={this.handleCloseModal}>
							Tutup
						</Button>,
					]}
				>
					{' '}
					<Spin spinning={loadingDetail}>
						<PerfectScrollbar
							style={{ maxHeight: 500 }}
							onScrollY={(container) =>
								console.log(container.scrollTop < 50 && 'true')
							}
						>
							<div style={{ maxHeight: 500 }}>
								{order && order !== null && (
									<>
										<TyAntd.Text style={{ color: '#979797' }}>
											Nomor Invoice
										</TyAntd.Text>
										<p
											style={{
												borderBottom: 'none',
												color: '#61934A',
												fontSize: 16,
											}}
										>
											{order.invoice_id}
										</p>
										<TyAntd.Text style={{ color: '#979797' }}>
											Pembeli
										</TyAntd.Text>
										<p
											style={{
												borderBottom: 'none',
												fontSize: 14,
											}}
										>
											{order.buyer_id.name}
										</p>
										<TyAntd.Text style={{ color: '#979797' }}>
											Tanggal Pemesanan
										</TyAntd.Text>
										<p
											style={{
												borderBottom: 'none',
												fontSize: 14,
											}}
										>
											{`${moment(order.created_date).format('LLLL')}`}
										</p>

										<TyAntd.Text style={{ color: '#979797' }}>
											Tujuan Pengiriman
										</TyAntd.Text>
										<div
											style={{
												borderBottom: 'none',
												fontSize: 14,
												width: '60%',
											}}
										>
											{`${order.buyer_address_id.address}, ${order.buyer_address_id.subdistrict} ${order.buyer_address_id.city} ${order.buyer_address_id.postal_code}, ${order.buyer_address_id.province} ${order.buyer_id.phone}`}
										</div>

										<hr />
										<Box className='my-1' display='flex' alignItems='center'>
											<Box>
												<img
													src={order.t_product_id.avatar}
													className='responsive mr-1'
													width='68'
													height='57'
													alt=''
													style={{
														borderWidth: 1,
														borderColor: '#E9E9E9',
														borderStyle: 'solid',
														borderRadius: 5,
													}}
												/>
											</Box>
											<Box>
												<ListItemText
													primary={order.t_product_id.name}
													secondary={`${order.quantity} Produk (${
														order.t_product_id.weight
													} gr) x ${toRupiah(order.t_product_id.price, {
														replaceZeroDecimals: true,
														formal: false,
													})}`}
												/>
											</Box>
										</Box>
										<hr />
										<ListItemText
											primary='Rincian Pembayaran'
											secondary={
												<div className='mt-1'>
													<Table size='small' aria-label='a dense table'>
														<TableBody>
															<TableRow>
																<TableCell style={{ borderBottom: 'none' }}>
																	{`Total Harga (${order.quantity} Barang)`}
																</TableCell>
																<TableCell style={{ borderBottom: 'none' }}>
																	{toRupiah(order.sub_total, {
																		replaceZeroDecimals: true,
																		formal: false,
																	})}
																</TableCell>
															</TableRow>
															<TableRow>
																<TableCell style={{ borderBottom: 'none' }}>
																	{`Total Ongkos Kirim (${
																		order.t_product_id.weight * order.quantity
																	} Gr)`}
																</TableCell>
																<TableCell style={{ borderBottom: 'none' }}>
																	{toRupiah(order.shipment_price, {
																		replaceZeroDecimals: true,
																		formal: false,
																	})}
																</TableCell>
															</TableRow>
															<TableRow>
																<TableCell style={{ borderBottom: 'none' }}>
																	{`Total Pembayaran`}
																</TableCell>
																<TableCell
																	style={{
																		borderBottom: 'none',
																		color: '#61934A',
																	}}
																>
																	{toRupiah(order.total_price, {
																		replaceZeroDecimals: true,
																		formal: false,
																	})}
																</TableCell>
															</TableRow>
														</TableBody>
													</Table>
												</div>
											}
										/>
									</>
								)}
							</div>
						</PerfectScrollbar>
					</Spin>
				</Modal>

				{/* Modal Lacak Paket */}
				<Modal
					title='Lacak'
					centered
					onOk={this.handleCloseModalTracking}
					onCancel={this.handleCloseModalTracking}
					visible={this.state.modalTrackingVisible}
					width={800}
					bodyStyle={{ padding: 0, background: '#EAECED' }}
					footer={[
						<Button key='back' onClick={this.handleCloseModalTracking}>
							Tutup
						</Button>,
					]}
				>
					<Spin spinning={loadingDetail}>
						<Row>
							<Col
								lg={5}
								style={{ background: '#FFF' }}
								className='ml-2 pl-3 mr-2'
							>
								<List.Item style={{ width: '70%' }}>
									<List.Item.Meta description='Kurir:' />
									<div>
										{shipping !== null && shipping.summary !== undefined
											? shipping.summary.courier
											: order !== null
											? order.shipment_type.toUpperCase()
											: '-'}
									</div>
								</List.Item>
								<List.Item style={{ width: '70%' }}>
									<List.Item.Meta description='Layanan:' />
									<div>
										{shipping !== null && shipping.summary !== undefined
											? shipping.summary.service
											: '-'}
									</div>
								</List.Item>
								<hr />
								<TyAntd.Text style={{ color: '#979797' }}>
									Nomor Resi
								</TyAntd.Text>
								<p
									style={{
										borderBottom: 'none',
										color: '#61934A',
										fontSize: 16,
									}}
								>
									{shipping !== null && shipping.summary !== undefined
										? shipping.summary.awb
										: order !== null
										? order.shipment_code
										: '-'}
								</p>
								<hr />

								{order && order !== null && (
									<>
										<TyAntd.Text style={{ color: '#979797' }}>
											Tujuan Pengiriman
										</TyAntd.Text>
										<div
											style={{
												borderBottom: 'none',
												fontSize: 14,
											}}
										>
											{`${order.buyer_address_id.address}, ${order.buyer_address_id.subdistrict} ${order.buyer_address_id.city} ${order.buyer_address_id.postal_code}, ${order.buyer_address_id.province} ${order.buyer_id.phone}`}
										</div>
									</>
								)}
							</Col>
							<Col className='pt-2 mr-2'>
								<PerfectScrollbar
									style={{ maxHeight: 500 }}
									onScrollY={(container) =>
										console.log(container.scrollTop < 50 && 'true')
									}
									options={{ suppressScrollX: true, useBothWheelAxes: false }}
								>
									<div style={{ minHeight: 500, maxHeight: 500 }}>
										<TyAntd.Text className='ml-2' style={{ color: '#979797' }}>
											Status Pesanan
										</TyAntd.Text>
										<p
											className='ml-2'
											style={{
												borderBottom: 'none',
												color: '#61934A',
												fontSize: 16,
												fontWeight: 500,
											}}
										>
											{shipping !== null && shipping.summary !== undefined
												? shipping.summary.status
												: 'Menunggu Status Dari Kurir'}
										</p>

										<Paper className='mr-2 pt-3 pr-4 ml-2'>
											{shipping && shipping !== null && (
												<Timeline mode='left'>
													{shipping &&
														shipping.history !== undefined &&
														shipping.history &&
														shipping.history.map((row, i) => (
															<Timeline.Item
																color={i === 0 ? 'green' : 'gray'}
																label={
																	row.date && (
																		<>
																			{moment(row.date).format('HH:mm')}
																			<br />
																			{moment(row.date).format('ll')}
																		</>
																	)
																}
															>
																{row.desc}
															</Timeline.Item>
														))}
												</Timeline>
											)}
										</Paper>
										<div style={{ minHeight: 20 }}></div>
									</div>
								</PerfectScrollbar>
							</Col>
						</Row>
					</Spin>
				</Modal>

				{/* Ubah Resi */}

				<Modal
					visible={this.state.modalChangeResi}
					footer={null}
					title='Ubah Resi'
					onCancel={this.handleCloseModalChangeResi}
				>
					{/* <TyAntd.Text>Resi Saat ini: {this.state.shipment_code}</TyAntd.Text> */}
					<Form
						layout='vertical'
						ref={this.formChangeResi}
						onFinish={this.handleFinish}
						initialValues={{
							shipment_code: this.state.shipment_code,
						}}
						scrollToFirstError={true}
						autoComplete='off'
					>
						<Form.Item
							name='shipment_code'
							normalize={(value) => (value || '').toUpperCase()}
							rules={[{ required: true, message: 'Kolom tidak boleh kosong.' }]}
						>
							<Input
								size='large'
								style={{ width: '50%' }}
								minLength={3}
								maxLength={70}
								placeholder='Masukkan nomor resi dengan benar'
							/>
						</Form.Item>
						<Form.Item>
							<Button
								className='mr-2'
								htmlType='button'
								onClick={this.handleCloseModalChangeResi}
							>
								Batal
							</Button>
							<Button type='primary' htmlType='submit'>
								Ubah
							</Button>
						</Form.Item>
					</Form>
				</Modal>
			</>
		);
	}
}

const mapStateToProps = (state) => {
	const {
		totalItems,
		page,
		row,
		orderInShipping,
		order,
		totalPages,
		shipping,
		loadingDetail,
	} = state.OrderReducers;
	const { path } = state.PathReducers;

	return {
		totalItems,
		loadingDetail,
		orderInShipping,
		order,
		totalPages,
		shipping,
		page,
		row,
		path,
	};
};

export default connect(mapStateToProps, {
	onChangeRow,
	onChangePage,
	getOrder,
	getDetailOrder,
	shippingOrderStatus,
	onChangeStatePathInfo,
	updateOrderStatus,
	onChangeSearch,
})(withTranslation()(Order));
