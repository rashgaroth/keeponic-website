import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Input, Modal, Radio, Typography } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

import { toRupiah } from '../../../../helpers/utility';
import { API_SERVICE } from '../../../../constants/ApiService';

import {
	getWithdrawHistory,
	onChangeStatePathInfo,
	onChangePage,
	onChangeRow,
	onChangeSearchWithdraw,
} from '../../../../redux/actions';
import { TablePagination } from '@material-ui/core';
import { Col } from 'reactstrap';
import i18n from '../../../../i18n';

const WithdrawHistory = () => {
	const dispatch = useDispatch();
	const data = useSelector((state) => state.WithdrawReducers);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [dataNote, setNote] = useState({
		note: '',
		withdraw_id: '',
	});
	const fetchData = async () => {
		await dispatch(getWithdrawHistory());
	};

	const isMount = async () => {
		await dispatch(onChangePage('page', 0));
		await dispatch(onChangeRow('row', 5));
	};

	const onRadioChange = async (e) => {
		await dispatch(onChangeStatePathInfo('path', e.target.value));
		await dispatch(onChangePage('page', 0));
		fetchData();
	};

	const handleChangePage = async (e, nextPage) => {
		await dispatch(onChangePage('page', nextPage));
		fetchData();
	};

	const handleChangeRowsPerPage = async (event) => {
		await dispatch(
			onChangeRow('row', parseInt(event.target.value, [5, 10, 20, 100]))
		);
		await dispatch(onChangePage('page', 0));
		fetchData();
	};

	const onRefresh = () => {
		fetchData();
	};

	useEffect(() => {
		isMount();
		let timeOut = setTimeout(() => {
			fetchData();
		}, 500);

		return () => clearInterval(timeOut);
	}, [data.q]);

	const handleModalNote = (withdraw_id, note) => {
		setNote({
			note: note,
			withdraw_id: withdraw_id,
		});
		setIsModalVisible(true);
	};

	const handleModalNoteCancel = () => {
		setIsModalVisible(false);
	};

	return (
		<>
			<Radio.Group
				defaultValue='all'
				buttonStyle='outline'
				onChange={onRadioChange}
				className='mb-2'
			>
				<Radio.Button value='all'>Semua</Radio.Button>
				<Radio.Button value='onprocess'>Dalam proses</Radio.Button>
				<Radio.Button value='done'>Selesai</Radio.Button>
				<Radio.Button value='canceled'>Ditolak</Radio.Button>
			</Radio.Group>
			<br />
			<Input
				onChange={async (e) => {
					await dispatch(onChangeSearchWithdraw('q', e.target.value));
				}}
				placeholder='Cari nomor pencairan dana...'
			/>

			<Button
				className='mb-2 mt-2 float-right'
				type='link'
				icon={<ReloadOutlined />}
				onClick={onRefresh}
			>
				Perbarui Data
			</Button>

			<div className='table-responsive'>
				<table className='table table-hover mb-0'>
					<thead>
						<tr>
							<th>Tanggal</th>
							<th>Deskripsi</th>
							<th>Jumlah</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{data.historyWithdraw !== null && (
							<>
								{data.historyWithdraw.length !== 0 ? (
									data.historyWithdraw.map((row, index) => (
										<tr key={row.id}>
											<td>
												{
													<>
														{`${moment(row.created_date).format(
															'DD-MMMM-YYYY, HH:mm'
														)}`}
														{row.status === 1 && (
															<>
																<br />
																<Button
																	type='link'
																	href={`${API_SERVICE.keeponic}${row.location_file}`}
																	target='_blank'
																	rel='noopener noreferrer'
																>
																	Bukti Transfer
																</Button>
															</>
														)}
														{row.status === -1 && (
															<>
																<br />
																<Button
																	type='link'
																	onClick={(e) => {
																		e.stopPropagation();
																		handleModalNote(row.withdraw_id, row.note);
																	}}
																>
																	Catatan Penolakan
																</Button>
															</>
														)}
													</>
												}
											</td>
											<td>
												{
													<>
														Pencairan Dana No.{' '}
														<strong>{row.withdraw_id}</strong>
														<br />
														<Typography>
															{' '}
															Ke rek: {row.bank_name} (
															{`*${row.account_number.substr(
																row.account_number.length - 4
															)}`}
															)
														</Typography>
													</>
												}
											</td>
											<td>
												{toRupiah(row.amount, {
													dot: '.',
													formal: false,
													floatingPoint: 0,
												})}
											</td>
											<td>
												{' '}
												{row.status === 0 && (
													<span
														style={{ fontWeight: 'normal', fontSize: 13 }}
														className='badge badge-warning'
													>
														Dalam Proses
													</span>
												)}
												{row.status === 1 && (
													<span
														style={{ fontWeight: 'normal', fontSize: 13 }}
														className='badge badge-success text-center px-3'
													>
														Selesai
													</span>
												)}
												{row.status === -1 && (
													<span
														style={{ fontWeight: 'normal', fontSize: 13 }}
														className='badge badge-danger text-center px-3'
													>
														Ditolak
													</span>
												)}
											</td>
										</tr>
									))
								) : (
									<>
										<tr
											style={{ verticalAlign: 'middle', textAlign: 'center' }}
										>
											<td colSpan={4}>Tidak ada pencairan dana</td>
										</tr>
									</>
								)}
							</>
						)}
					</tbody>
				</table>
				<Col className='float-right'>
					<TablePagination
						component='div'
						count={data.totalItems}
						page={data.page}
						onChangePage={handleChangePage}
						labelRowsPerPage={i18n.t('show_data_by')}
						rowsPerPageOptions={[5, 10, 20, 100]}
						rowsPerPage={data.row}
						onChangeRowsPerPage={handleChangeRowsPerPage}
					/>
				</Col>
			</div>

			<Modal
				centered
				closable={false}
				title='Catatan Penolakan Pencairan Dana'
				visible={isModalVisible}
				footer={[
					<Button key='back' onClick={handleModalNoteCancel}>
						Tutup
					</Button>,
				]}
			>
				<Typography.Text>
					Pencairan Dana Nomor <strong>{dataNote.withdraw_id}</strong> Ditolak
					dengan Alasan:
				</Typography.Text>
				<Alert
					className='mt-2'
					style={{
						fontSize: 14,
						fontWeight: 500,
					}}
					showIcon={false}
					message={`${dataNote.note}`}
					banner
				/>
			</Modal>
		</>
	);
};

export default WithdrawHistory;
