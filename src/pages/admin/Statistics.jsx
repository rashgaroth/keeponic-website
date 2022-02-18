import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Col, Row, Statistic } from 'antd';
import { Typography } from '@material-ui/core';
import * as AI from 'react-icons/ai';
import * as HI from 'react-icons/hi';
import * as IO from 'react-icons/io5';
import moment from 'moment';
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

import * as service from '../../services';
import { HeaderAuth } from '../../services/header';

import { API_SERVICE } from '../../constants/ApiService';

const data2 = [];

for (let num = 30; num >= 0; num--) {
	data2.push({
		date: '2021-05',
		value: 1 + Math.random(),
	});
}

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
				<p style={{ margin: 0, padding: 0 }}>
					{payload !== null ? `${payload[0].value} Pendaftar` : ''}
				</p>
			</div>
		);
	}
	return null;
};

const Statistics = () => {
	const [data, setData] = useState({});
	const auth = useSelector((state) => state.AuthReducers);

	let url = `${API_SERVICE.keeponic}/admin/${auth.user.user_id}/statistics`;

	useEffect(() => {
		const getData = async () => {
			const _response = await service.GET(url, HeaderAuth());
			setData(_response.data.data);
		};
		getData();
		// const interval = setInterval(() => {
		// 	getData();
		// }, 20000);

		// return () => clearInterval(interval);
	}, []);

	return (
		<>
			<Row gutter={[16, 16]} className='mb-2'>
				<Col xs={12} sm={12} md={6} lg={6} xl={6}>
					<Card>
						<Typography className='mb-1'>Total Pengajuan Seller</Typography>
						<Statistic
							value={
								data !== undefined &&
								data.total !== undefined &&
								data.total.waiting_admin_approval
									? data.total.waiting_admin_approval
									: 0
							}
							formatter={(value) => (
								<Link to='/seller-submission'>{value}</Link>
							)}
							valueStyle={{ fontSize: 24 }}
							prefix={
								<AI.AiOutlineForm
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
						<Typography className='mb-1'>Total Pengguna</Typography>
						<Statistic
							value={
								data !== undefined &&
								data.total !== undefined &&
								data.total.users
									? data.total.users
									: 0
							}
							formatter={(value) => <Link to='/user-management'>{value}</Link>}
							valueStyle={{ fontSize: 24 }}
							prefix={
								<HI.HiUserGroup size={32} className='mr-2' color={'#A8AAAC'} />
							}
						/>
					</Card>
				</Col>
				<Col xs={12} sm={12} md={6} lg={6} xl={6}>
					<Card>
						<Typography className='mb-1'>Total Seller</Typography>
						<Statistic
							value={
								data !== undefined &&
								data.total !== undefined &&
								data.total.seller
									? data.total.seller
									: 0
							}
							formatter={(value) => (
								<Link to='/market-management'>{value}</Link>
							)}
							valueStyle={{ fontSize: 24 }}
							prefix={
								<IO.IoStorefront size={32} className='mr-2' color={'#A8AAAC'} />
							}
						/>
					</Card>
				</Col>
				<Col xs={12} sm={12} md={6} lg={6} xl={6}>
					<Card>
						<Typography className='mb-1'>Total Artikel</Typography>
						<Statistic
							value={
								data !== undefined &&
								data.total !== undefined &&
								data.total.article
									? data.total.article
									: 0
							}
							formatter={(value) => (
								<Link to='/article-management'>{value}</Link>
							)}
							valueStyle={{ fontSize: 24 }}
							prefix={
								<IO.IoNewspaper size={32} className='mr-2' color={'#A8AAAC'} />
							}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={24} md={24} lg={24} xl={24}>
					<Card>
						<Typography className='mb-1'>Statistik Pengguna</Typography>
						<ResponsiveContainer width='100%' height={200}>
							<AreaChart
								data={
									data !== undefined &&
									data.statisticsUser !== undefined &&
									data.statisticsUser
								}
								margin={{
									top: 5,
									right: 0,
									left: 10,
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

								<Area dataKey='users' stroke='#61934A' fill='url(#color)' />

								<XAxis
									dataKey='month'
									axisLine={false}
									tickLine={false}
									dx={-15}
									tickFormatter={(str) => {
										if (str !== 0 && str !== 'auto') {
											return moment(str).format('MMMM');
										}
										return '';
									}}
								/>
								<YAxis
									dataKey='users'
									axisLine={false}
									tickLine={false}
									tickCount={8}
									type='number'
									allowDecimals={false}
									domain={[
										0,
										data !== undefined &&
											data.total !== undefined &&
											data.total.users,
									]}
								>
									<Label
										value='Jumlah Pengguna'
										angle='-90'
										position='insideLeft'
										dy={70}
									/>
								</YAxis>

								<Tooltip content={<CustomTooltip />} />
								<CartesianGrid opacity={0.2} vertical={false} />
							</AreaChart>
						</ResponsiveContainer>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default Statistics;
