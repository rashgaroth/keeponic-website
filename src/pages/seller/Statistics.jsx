//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from 'reactstrap';
import {
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Label,
	AreaChart,
	Area,
} from 'recharts';
import { Box, Typography } from '@material-ui/core';
import * as FA from 'react-icons/fa';
import * as AI from 'react-icons/ai';
import * as MD from 'react-icons/md';
import { Card, Col, Row as RowAnt, Statistic, Button as ANButton } from 'antd';
import moment from 'moment';
//  Region Import Redux Action Type and Redux Action

//  Region Import Utility/Helper Function
import * as service from '../../services';
import { HeaderAuth } from '../../services/header';
import { idrCurrency, toRupiah } from '../../helpers/utility';
//  Region Import Components

//  Region Import Assets
import eduIllustration from '../../assets/images/edu-illustration.png';
//  Region Import Style

//  Region Import Constants
import { COLORS } from '../../constants/colors';
import { API_SERVICE } from '../../constants/ApiService';

const CustomTooltip = ({ active, payload, label }) => {
	if (active) {
		return (
			<div
				style={{
					borderRadius: '0.25rem',
					background: '#fff',
					color: '#474747',
					padding: '1rem',
					boxShadow: '8px 10px 42px -4px rgba(97, 147, 74, 0.41)',
					textAlign: 'center',
				}}
			>
				<h4>{moment(label).format('MMMM')}</h4>
				<p style={{ margin: 0, padding: 0 }}>{`${
					payload !== null
						? `Stok terjual: ${payload[0].payload.product_sold}`
						: '-'
				}`}</p>
				<p style={{ margin: 0, padding: 0 }}>{`${
					payload !== null
						? `Pendapatan: Rp. ${idrCurrency(payload[0].payload.income)}`
						: '-'
				}`}</p>
			</div>
		);
	}
	return null;
};

const Statistics = () => {
	// Declare var object data for save response
	const [data, setData] = useState({});
	// Get current Auth data from reducers
	const auth = useSelector((state) => state.AuthReducers);
	// Endpoint
	let url = `${API_SERVICE.keeponic}/seller/statistics/${auth.user.market_id}`;
	// React hooks for lifecycle
	useEffect(() => {
		// HIT API Statistics
		const getData = async () => {
			const _response = await service.GET(url, HeaderAuth());
			// set response into local state
			setData(_response.data.data);
		};
		// Call Function HIT API
		getData();
		// Refresh hit API interval 20 seconds
		const interval = setInterval(() => {
			getData();
		}, 20000);
		// After 20 seconds reset the interval back to 0
		return () => clearInterval(interval);
	}, []);
	//  Function declaration (handle, onchange, etc)
	return (
		<>
			{' '}
			<RowAnt gutter={[16, 16]} className='mb-2'>
				<Col xs={12} sm={12} md={6} lg={6} xl={6}>
					<Card>
						<Typography className='mb-1'>Pesanan Perlu Dikirim</Typography>
						<Statistic
							value={
								data !== undefined &&
								data.total !== undefined &&
								data.total.paid
									? data.total.paid
									: 0
							}
							formatter={(value) => <Link to='/order'>{value}</Link>}
							valueStyle={{ fontSize: 24 }}
							prefix={<FA.FaBox size={32} className='mr-2' color={'#A8AAAC'} />}
						/>
					</Card>
				</Col>
				<Col xs={12} sm={12} md={6} lg={6} xl={6}>
					<Card>
						<Typography className='mb-1'>Total Pesanan Dikirim</Typography>
						<Statistic
							value={
								data !== undefined &&
								data.total !== undefined &&
								data.total.in_shipping
									? data.total.in_shipping
									: 0
							}
							valueStyle={{ fontSize: 24 }}
							prefix={
								<FA.FaShippingFast
									size={36}
									className='mr-2'
									color={'#A8AAAC'}
								/>
							}
						/>
					</Card>
				</Col>
				<Col xs={12} sm={12} md={6} lg={6} xl={6}>
					<Card>
						<Typography className='mb-1'>Total Pesanan Selesai</Typography>
						<Statistic
							value={
								data !== undefined &&
								data.total !== undefined &&
								data.total.finish
									? data.total.finish
									: 0
							}
							valueStyle={{ fontSize: 24 }}
							prefix={
								<AI.AiOutlineFileDone
									size={32}
									className='mr-2'
									color={'#A8AAAC'}
								/>
							}
						/>
					</Card>
				</Col>
				<Col xs={12} sm={12} md={6} lg={6} xl={6}>
					<Card>
						<Typography className='mb-1'>Total Produk Habis</Typography>
						<Statistic
							value={
								data !== undefined &&
								data.total !== undefined &&
								data.total.out_of_stock
									? data.total.out_of_stock
									: 0
							}
							valueStyle={{ fontSize: 24 }}
							prefix={
								<FA.FaInbox size={32} className='mr-2' color={'#A8AAAC'} />
							}
						/>
					</Card>
				</Col>

				<Col xs={24} sm={24} md={24} lg={18} xl={18}>
					<Card>
						<Typography className='mb-1'>
							Statistik Pendapatan Bulanan
						</Typography>
						<ResponsiveContainer className='mt-2' width='100%' height={200}>
							<AreaChart
								data={
									data !== undefined &&
									data.statisticProductSold !== undefined &&
									data.statisticProductSold
								}
								margin={{
									top: 5,
									right: 0,
									left: 15,
									bottom: 5,
								}}
							>
								<defs>
									<linearGradient id='color' x1='0' y1='0' x2='0' y2='1'>
										<stop
											offset='0%'
											stopColor='#61934A'
											stopOpacity={0.7}
										></stop>
										<stop
											offset='75%'
											stopColor='#61934A'
											stopOpacity={0.05}
										></stop>
									</linearGradient>
								</defs>

								<Area dataKey='income' stroke='#61934A' fill='url(#color)' />

								<XAxis
									dataKey='month'
									axisLine={false}
									tickLine={false}
									dx={-15}
									tickFormatter={(str) => {
										if (str !== 0 && str !== 'auto') {
											return moment(str).format('MMMM-YYYY');
										}
										return 'Belum ada produk yang terjual';
									}}
								/>

								<YAxis
									dataKey='income'
									axisLine={false}
									tickLine={false}
									tickCount={8}
									type='number'
									allowDecimals={false}
									domain={[
										0,
										data !== undefined &&
											data.max_product_sold !== undefined &&
											data.max_product_sold,
									]}
									tickFormatter={(number) =>
										`${toRupiah(number, {
											symbol: false,
											useUnit: true,
											spaceBeforeUnit: true,
											floatingPoint: 0,
										})}`
									}
								>
									{' '}
									<Label
										value='Pendapatan'
										angle='-90'
										position='insideLeft'
										dy={40}
										dx={-15}
									/>
								</YAxis>

								<Tooltip content={<CustomTooltip />} />

								<CartesianGrid opacity={0.2} vertical={false} />
							</AreaChart>
						</ResponsiveContainer>
					</Card>
				</Col>

				<div className='col-xl-3'>
					<Card style={{ backgroundColor: '#61934A' }}>
						<Box>
							<Box display='flex' justifyContent='center'>
								<img src={eduIllustration} alt=''></img>
							</Box>
							<Box className='mt-2' display='flex' justifyContent='center'>
								<Typography
									style={{
										textTransform: 'none',
										color: COLORS.white,
										fontSize: 12,
									}}
									variant='subtitle2'
									className='text-center'
								>
									Temukan informasi terkait Penjual di Edukasi Penjual
								</Typography>
							</Box>
							<Box className='mt-1' display='flex' justifyContent='center'>
								<Link
									to='/edu'
									target='_blank'
									rel='noopener noreferrer'
									role='button'
								>
									<Button
										color='light'
										style={{ color: COLORS.primary, fontWeight: 500 }}
									>
										Edukasi Penjual
									</Button>
								</Link>
							</Box>
						</Box>
					</Card>
				</div>

				<Col xs={24} sm={24} md={16} lg={16} xl={16}>
					<Card>
						<Typography className='mb-1'>Transaksi Terakhir</Typography>

						<div className='table-responsive'>
							<table className='table table-hover mb-0'>
								<thead>
									<tr>
										<th>Tanggal</th>
										<th>Invoice</th>
										<th>Pembeli</th>
										<th>Total Pembayaran Masuk</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
									{data !== undefined &&
									data.recent_transaction !== undefined &&
									data.recent_transaction.length !== 0 ? (
										data.recent_transaction.map((row) => (
											<tr key={row.invoice_id}>
												<td>{row.date}</td>
												<td>{row.invoice_id}</td>
												<td>{row.name}</td>
												<td> {`Rp ${idrCurrency(row.total_price)}`}</td>
												<td>
													{row.status === -2 && (
														<span
															style={{ fontWeight: 'normal', fontSize: 13 }}
															className='badge badge-danger'
														>
															Dibatalkan
														</span>
													)}
													{row.status === 0 && (
														<span
															style={{ fontWeight: 'normal', fontSize: 13 }}
															className='badge badge-warning'
														>
															Belum Dibayar
														</span>
													)}
													{row.status === 1 && (
														<span
															style={{ fontWeight: 'normal', fontSize: 13 }}
															className='badge badge-success'
														>
															Berhasil
														</span>
													)}
													{row.status === 2 && (
														<span
															style={{ fontWeight: 'normal', fontSize: 13 }}
															className='badge badge-success'
														>
															Berhasil
														</span>
													)}
													{row.status === 3 && (
														<span
															style={{ fontWeight: 'normal', fontSize: 13 }}
															className='badge badge-success'
														>
															Berhasil
														</span>
													)}
												</td>
											</tr>
										))
									) : (
										<tr
											style={{ verticalAlign: 'middle', textAlign: 'center' }}
										>
											<td colSpan={5}>Data Tidak ada</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</Card>
				</Col>

				<Col xs={24} sm={24} md={8} lg={8} xl={8}>
					<Card>
						<Typography className='mb-1'>Dompet Keeponic</Typography>
						<Statistic
							value={
								data !== undefined && data.remaining_balance !== undefined
									? `Rp ${idrCurrency(data.remaining_balance)}`
									: 0
							}
							valueStyle={{ fontSize: 24 }}
							prefix={
								<MD.MdAccountBalanceWallet
									size={36}
									className='mr-2'
									color={'#A8AAAC'}
								/>
							}
						/>
						<ANButton
							style={{ marginTop: 16 }}
							type='primary'
							href='/transaction'
						>
							Cairkan Dana
						</ANButton>
					</Card>
				</Col>
			</RowAnt>
		</>
	);
};

// mapStateToProps here if needed

// mapDispatchToProps here if needed

export default Statistics;
