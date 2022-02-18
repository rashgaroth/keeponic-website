//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'reactstrap';
import {
	Alert,
	Button,
	Empty,
	Form,
	Input,
	Modal,
	Spin,
	Tag,
	Typography,
	Card,
} from 'antd';
import moment from 'moment';
import {
	TableContainer,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Paper,
	ListItemText,
	Box,
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';

import * as Fa from 'react-icons/fa';
//  Region Import Redux Action Type and Redux Action
import {
	getOrder,
	getDetailOrder,
	updateOrderStatus,
} from '../../../../redux/actions';

//  Region Import Utility/Helper Function
import i18n from '../../../../i18n';
import { isLongText, toRupiah } from '../../../../helpers/utility';

//  Region Import Components

//  Region Import Assets

//  Region Import Style

//  Region Import Constants

const OrderPaid = () => {
	const dispatch = useDispatch();
	const [form] = Form.useForm();
	const OrderSelector = useSelector((state) => state.OrderReducers);
	const orders = OrderSelector.orderReceived;
	const order = OrderSelector.order;

	const [visible, setVisible] = useState(false);
	const [visible2, setVisible2] = useState(false);
	const [id, setId] = useState(null);
	//  react lifecycle (componentDidMount, componentDidUpdate, etc)

	const fetchData = async () => {
		await dispatch(getOrder());
	};

	const fetchDetail = async () => {
		await dispatch(getDetailOrder(id));
	};

	useEffect(() => {
		fetchData();
		if (visible === true) {
			fetchDetail();
		}
		if (visible2 === true) {
			fetchDetail();
		}
		const interval = setInterval(() => {
			fetchData();
		}, 10000);

		return () => clearInterval(interval);
	}, [id]);
	//  Function declaration (handle, onchange, etc)

	const handleFinish = (values) => {
		// setValue(values);
		// console.log(values);
		Modal.confirm({
			title: 'Apakah nomor resi sudah benar?',
			centered: true,
			okText: 'Konfirmasi',
			cancelText: 'Batal',
			onOk: async () => {
				await dispatch(updateOrderStatus(values, id));
				setVisible2(false);
				form.resetFields();
			},
		});
	};

	//  render

	return (
		<>
			<Row>
				<Col className='d-sm-none d-none d-md-block d-lg-block'>
					<TableContainer>
						<Table aria-label='simple table' size='small'>
							<TableHead>
								<TableRow>
									<TableCell style={{ backgroundColor: '#E9E9E9' }}>
										No Pesanan
									</TableCell>
									<TableCell style={{ backgroundColor: '#E9E9E9' }}>
										Pembeli
									</TableCell>
									<TableCell style={{ backgroundColor: '#E9E9E9' }}>
										Total Pembayaran
									</TableCell>
									<TableCell style={{ backgroundColor: '#E9E9E9' }}>
										Pengiriman
									</TableCell>
									<TableCell style={{ backgroundColor: '#E9E9E9' }}>
										{''}
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{orders.length === 0 ? (
									<TableRow>
										<TableCell colSpan='6' style={{ alignContent: 'center' }}>
											<Row
												style={{ justifyContent: 'center' }}
												className='my-4'
											>
												<Empty description={i18n.t('order_not_found')} />
											</Row>
										</TableCell>
									</TableRow>
								) : (
									orders &&
									orders.map((row) => (
										<TableRow key={row.id}>
											<TableCell scope='row'>
												<ListItemText
													disableTypography
													primary={
														<>
															<Link
																onClick={(e) => {
																	e.stopPropagation();
																	setVisible(true);
																	setId(row.id);
																	// handleDetailInvoice(row.id);
																}}
															>
																{row.invoice_id}
															</Link>
														</>
													}
													secondary={
														<>
															<br />
															{`${moment(row.created_date).format(
																'DD-MMMM-YYYY, HH:mm A'
															)}`}
														</>
													}
												/>
											</TableCell>

											<TableCell scope='row'>
												{isLongText(row.sec_user_model.name, 35)}
											</TableCell>
											<TableCell scope='row'>
												{toRupiah(row.total_price, {
													replaceZeroDecimals: true,
													formal: false,
												})}
											</TableCell>
											<TableCell scope='row'>
												{row.shipment_type.toUpperCase()}
											</TableCell>
											<TableCell align='justify'>
												<Button
													icon={<Fa.FaTruck className='mr-1' />}
													onClick={(e) => {
														e.stopPropagation();
														setVisible2(true);
														setId(row.id);
													}}
													type='link'
												>
													Konfirmasi Pengiriman
												</Button>
												<br />
												<Link
													to={`${process.env.PUBLIC_URL}/order/print/${row.id}`}
													target='_blank'
													rel='noopener noreferrer'
												>
													<Button
														type='link'
														icon={<Fa.FaPrint className='mr-1' />}
													>
														Cetak Label
													</Button>
												</Link>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</Col>
				<Col className='d-sm-block d-md-none d-lg-none'>
					{orders.length === 0 ? (
						<Row style={{ justifyContent: 'center' }} className='my-4'>
							<Empty description={i18n.t('order_not_found')} />
						</Row>
					) : (
						orders &&
						orders.map((row) => (
							<Paper className='mb-2'>
								<Card
									bordered={false}
									actions={[
										<Link
											to={`${process.env.PUBLIC_URL}/order/print/${row.id}`}
											target='_blank'
											rel='noopener noreferrer'
										>
											<Button
												key='1'
												type='link'
												block
												style={{
													marginTop: 7,
												}}
											>
												Cetak Label
											</Button>
										</Link>,
										<Button
											key='2'
											type='link'
											style={{
												whiteSpace: 'normal',
												height: 'auto',
											}}
											block
											onClick={(e) => {
												e.stopPropagation();
												setVisible2(true);
												setId(row.id);
											}}
										>
											Konfirmasi Pengiriman
										</Button>,
									]}
								>
									<Card.Meta
										description={
											<Row>
												<Col lg={7}>
													<ListItemText
														disableTypography
														primary={
															<>
																<Link
																	style={{ fontSize: 15 }}
																	onClick={(e) => {
																		e.stopPropagation();
																		setVisible(true);
																		setId(row.id);
																		// handleDetailInvoice(row.id);
																	}}
																>
																	{`${row.invoice_id} | ${isLongText(
																		row.sec_user_model.name,
																		35
																	)}`}
																</Link>
															</>
														}
														secondary={
															<>
																<br />
																<Typography.Text
																	style={{ fontSize: 14, color: '#474747' }}
																>
																	{' '}
																	{`${moment(row.created_date).format(
																		'DD-MMMM-YYYY, HH:mm A'
																	)}`}
																</Typography.Text>
																<br />
																<Typography.Text
																	style={{ fontSize: 14, color: '#474747' }}
																>
																	Pengiriman: {row.shipment_type.toUpperCase()}
																</Typography.Text>
																<br />
																<Typography.Text
																	style={{ fontSize: 14, color: '#474747' }}
																>
																	Total Pembayaran:{' '}
																	<strong>{`${toRupiah(row.total_price, {
																		replaceZeroDecimals: true,
																		formal: false,
																	})}`}</strong>
																</Typography.Text>
															</>
														}
													/>
												</Col>
											</Row>
										}
									/>
								</Card>
							</Paper>
						))
					)}
				</Col>
			</Row>

			{/* Modal Detail Pesanan */}
			<Modal
				title='Detail Pesanan'
				centered
				// closable={false}
				onOk={() => setVisible(false)}
				onCancel={() => setVisible(false)}
				visible={visible}
				width={800}
				footer={[
					<Button key='back' type='primary' onClick={() => setVisible(false)}>
						Tutup
					</Button>,
				]}
			>
				{' '}
				<Spin spinning={OrderSelector.loadingDetail}>
					<PerfectScrollbar
						style={{ maxHeight: 500 }}
						onScrollY={(container) =>
							console.log(container.scrollTop < 50 && 'true')
						}
					>
						<div style={{ maxHeight: 500 }}>
							{order !== null && (
								<>
									<Typography.Text style={{ color: '#979797' }}>
										Nomor Invoice
									</Typography.Text>
									<p
										style={{
											borderBottom: 'none',
											color: '#61934A',
											fontSize: 16,
										}}
									>
										{order.invoice_id}
									</p>
									<Typography.Text style={{ color: '#979797' }}>
										Status
									</Typography.Text>
									<p
										style={{
											borderBottom: 'none',
											fontSize: 16,
										}}
									>
										<Tag
											color='success'
											style={{ fontWeight: 600 }}
										>{`Pesanan Dibayar`}</Tag>
									</p>
									<Typography.Text style={{ color: '#979797' }}>
										Pembeli
									</Typography.Text>
									<p
										style={{
											borderBottom: 'none',
											fontSize: 16,
										}}
									>
										{order.buyer_id.name}
									</p>
									<Typography.Text style={{ color: '#979797' }}>
										Tanggal Pemesanan
									</Typography.Text>
									<p
										style={{
											borderBottom: 'none',
											fontSize: 16,
										}}
									>
										{`${moment(order.created_date).format('LLLL')}`}
									</p>
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
															<TableCell
																style={{ borderBottom: 'none' }}
															>{`Rp ${order.sub_total}`}</TableCell>
														</TableRow>
														<TableRow>
															<TableCell style={{ borderBottom: 'none' }}>
																{`Total Ongkos Kirim (${
																	order.t_product_id.weight * order.quantity
																} Gr)`}
															</TableCell>
															<TableCell
																style={{ borderBottom: 'none' }}
															>{`Rp ${order.shipment_price}`}</TableCell>
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
															>{`Rp ${order.total_price}`}</TableCell>
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

			{/* Modal Konfirmasi Resi */}
			<Modal
				title='Detail Pesanan'
				centered
				onOk={() => setVisible2(false)}
				onCancel={() => {
					setVisible2(false);
					form.resetFields();
				}}
				visible={visible2}
				width={800}
				footer={[
					<Button
						key='back'
						onClick={() => {
							setVisible2(false);
							form.resetFields();
						}}
					>
						Tutup
					</Button>,
					<Button
						key='submit'
						type='primary'
						onClick={() => form.submit()}
						// loading={loading}
						// onClick={this.handleOk}
					>
						Konfirmasi Pengiriman
					</Button>,
				]}
			>
				{' '}
				<Spin spinning={OrderSelector.loadingDetail}>
					<PerfectScrollbar
						style={{ maxHeight: 500 }}
						onScrollY={(container) =>
							console.log(container.scrollTop < 50 && 'true')
						}
					>
						<div style={{ maxHeight: 500 }}>
							{order !== null && (
								<>
									<Typography.Text style={{ color: '#979797' }}>
										Nomor Invoice
									</Typography.Text>
									<p
										style={{
											borderBottom: 'none',
											color: '#61934A',
											fontSize: 16,
										}}
									>
										{order.invoice_id}
									</p>

									<Alert
										message={
											<>
												<Typography.Text
													style={{ color: '#979797', fontSize: 12 }}
												>
													Untuk tujuan pengujian copy nomor resi dibawah ini
												</Typography.Text>
												<Typography.Paragraph
													copyable={{
														icon: ['Copy'],
													}}
												>
													030200010250720
												</Typography.Paragraph>
											</>
										}
										type='info'
										style={{ width: '70%', margin: 0 }}
									/>
									<Typography.Text style={{ color: '#979797' }}>
										Masukkan Nomor Resi
									</Typography.Text>
									<Form
										form={form}
										layout='vertical'
										initialValues={{
											shipment_code: '',
										}}
										scrollToFirstError={true}
										autoComplete='off'
										onFinish={handleFinish}
									>
										<Form.Item
											name='shipment_code'
											normalize={(value) => (value || '').toUpperCase()}
											rules={[
												{
													required: true,
													message: 'Kolom tidak boleh kosong.',
												},
											]}
										>
											<Input
												size='large'
												style={{ width: '70%' }}
												minLength={3}
												maxLength={70}
												placeholder='Masukkan nomor resi dengan benar'
											/>
										</Form.Item>
									</Form>
									<Typography.Text style={{ color: '#979797' }}>
										Pembeli
									</Typography.Text>
									<p
										style={{
											borderBottom: 'none',
											fontSize: 14,
										}}
									>
										{order.buyer_id.name}
									</p>
									<Typography.Text style={{ color: '#979797' }}>
										Tanggal Pemesanan
									</Typography.Text>
									<p
										style={{
											borderBottom: 'none',
											fontSize: 14,
										}}
									>
										{`${moment(order.created_date).format('LLLL')}`}
									</p>

									<Typography.Text style={{ color: '#979797' }}>
										Tujuan Pengiriman
									</Typography.Text>
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
												secondary={`${order.quantity} Produk (${order.t_product_id.weight} gr) x Rp ${order.t_product_id.price}`}
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
															<TableCell
																style={{ borderBottom: 'none' }}
															>{`Rp ${order.sub_total}`}</TableCell>
														</TableRow>
														<TableRow>
															<TableCell style={{ borderBottom: 'none' }}>
																{`Total Ongkos Kirim (${
																	order.t_product_id.weight * order.quantity
																} Gr)`}
															</TableCell>
															<TableCell
																style={{ borderBottom: 'none' }}
															>{`Rp ${order.shipment_price}`}</TableCell>
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
															>{`Rp ${order.total_price}`}</TableCell>
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
		</>
	);
};

// mapStateToProps here if needed

// mapDispatchToProps here if needed

export default OrderPaid;
