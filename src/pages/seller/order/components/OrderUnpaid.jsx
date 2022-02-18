//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { Button, Empty, Modal, Spin, Tag, Typography } from 'antd';

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
//  Region Import Redux Action Type and Redux Action
import { getOrder, getDetailOrder } from '../../../../redux/actions';

//  Region Import Utility/Helper Function
import i18n from '../../../../i18n';
import { isLongText, toRupiah } from '../../../../helpers/utility';

//  Region Import Components

//  Region Import Assets

//  Region Import Style

//  Region Import Constants

const OrderUnpaid = () => {
	const dispatch = useDispatch();
	const OrderSelector = useSelector((state) => state.OrderReducers);
	const orders = OrderSelector.orders;
	const order = OrderSelector.order;

	const [visible, setVisible] = useState(false);
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
		// const interval = setInterval(() => {
		// 	fetchData();
		// }, 10000);

		// return () => clearInterval(interval);
	}, [id]);
	//  Function declaration (handle, onchange, etc)
	return (
		<>
			<Row>
				<Col className='d-sm-none d-none d-md-block d-lg-block'>
					<TableContainer>
						<Table aria-label='simple table' size='small'>
							<TableHead>
								<TableRow>
									<TableCell style={{ backgroundColor: '#E9E9E9' }}>
										{i18n.t('order_no')}
									</TableCell>
									<TableCell style={{ backgroundColor: '#E9E9E9' }}>
										{i18n.t('buyer')}
									</TableCell>
									<TableCell
										align='justify'
										style={{ backgroundColor: '#E9E9E9' }}
									>
										Total Pembayaran
									</TableCell>
									<TableCell
										align='justify'
										style={{ backgroundColor: '#E9E9E9' }}
									>
										Pengiriman
									</TableCell>
									<TableCell
										align='justify'
										style={{ backgroundColor: '#E9E9E9' }}
									>
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
											<TableCell scope='row'>
												<Tag
													color='warning'
													style={{ fontWeight: 600 }}
												>{`Belum Dibayar`}</Tag>
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
							<Paper>
								<Row className='px-2 py-2'>
									<Col lg={7}>
										<ListItemText
											disableTypography
											primary={
												<>
													<Link
														style={{ fontSize: 17 }}
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
													<br />
													<Tag
														className='mt-2'
														color='warning'
														style={{ fontWeight: 600 }}
													>{`Belum Dibayar`}</Tag>
												</>
											}
										/>
									</Col>
								</Row>
							</Paper>
						))
					)}
				</Col>
			</Row>

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
											color='warning'
											style={{ fontWeight: 600 }}
										>{`Belum Dibayar`}</Tag>
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
												})}
												`}
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
		</>
	);
};

// mapStateToProps here if needed

// mapDispatchToProps here if needed

export default OrderUnpaid;
