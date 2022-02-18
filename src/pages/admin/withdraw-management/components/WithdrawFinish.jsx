import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
	TableContainer,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	ListItemText,
} from '@material-ui/core';
import moment from 'moment';

import * as service from '../../../../services';
import { HeaderAuth } from '../../../../services/header';
import { API_SERVICE } from '../../../../constants/ApiService';

import { getAllWithdraw } from '../../../../redux/actions';

import { toRupiah } from '../../../../helpers/utility';
import { Button, Empty, Modal, Form, Typography, Upload, message } from 'antd';

const WithdrawFinish = () => {
	const dispatch = useDispatch();
	const data = useSelector((state) => state.WithdrawManagementReducers);
	const auth = useSelector((state) => state.AuthReducers);
	const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false);
	const [formDetailWithdraw] = Form.useForm();
	const [id, setId] = useState(null);
	const [dataWithdraw, setDataWithdraw] = useState(null);
	const [state, setState] = useState({
		uploading: false,
		isSuccess: 0,
		disabled: true,
		fileList: [],
	});

	const fetchData = async () => {
		await dispatch(getAllWithdraw());
	};

	const onClickModalConfirm = (id) => {
		setIsModalConfirmVisible(true);
		data.withdrawItems &&
			// eslint-disable-next-line array-callback-return
			data.withdrawItems.map((row) => {
				if (row.id === id) {
					setDataWithdraw(row);
					setId(row.id);
				}
			});
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleConfirmCancel = () => {
		formDetailWithdraw.resetFields();
		setIsModalConfirmVisible(false);
		setDataWithdraw(null);
		setId(null);
		setState({
			fileList: [],
			uploading: false,
			isSuccess: 0,
			disabled: true,
		});
	};

	const handleConfirmWithdraw = async () => {
		let urlSuccess = `${API_SERVICE.keeponic}/admin/${auth.user.user_id}/withdraw/${id}/success?isSuccess=1`;

		Modal.confirm({
			title: 'Perbarui status pencairan?',
			centered: true,
			okText: 'Konfirmasi',
			cancelText: 'Batal',
			onOk: async () => {
				const formData = new FormData();
				state.fileList.forEach((file) => {
					formData.append('files', file);
				});

				setState((prevState) => ({
					...prevState,
					uploading: true,
				}));

				await service
					.PUT(urlSuccess, formData, HeaderAuth())
					.then(() => {
						setState((prevState) => ({
							...prevState,
							uploading: false,
							fileList: [],
						}));
						fetchData();
						setIsModalConfirmVisible(false);
						setDataWithdraw(null);
						setId(null);
						message.success('Status Pencairan Berhasil Diubah');
					})
					.catch((error) => {
						message.error(error.message);
					});
			},
		});
	};

	const props = {
		multiple: false,
		onRemove: (file) => {
			setState((state) => {
				const index = state.fileList.indexOf(file);
				const newFileList = state.fileList.slice();
				newFileList.splice(index, 1);
				return {
					...state,
					disabled: true,
					fileList: newFileList,
				};
			});
		},
		beforeUpload: (file) => {
			setState((prevState) => ({
				...prevState,
				disabled: false,
				fileList: [file],
			}));
			return false;
		},
		fileList: state.fileList,
	};

	return (
		<>
			<Row>
				<Col lg={12}>
					<TableContainer>
						<Table aria-label='simple table' size='small'>
							<TableHead>
								<TableRow>
									<TableCell style={{ backgroundColor: '#E9E9E9' }}>
										Nomor
									</TableCell>
									<TableCell style={{ backgroundColor: '#E9E9E9' }}>
										Nama
									</TableCell>
									<TableCell style={{ backgroundColor: '#E9E9E9' }}>
										Bank
									</TableCell>
									<TableCell style={{ backgroundColor: '#E9E9E9' }}>
										Nomor Rekening
									</TableCell>
									<TableCell style={{ backgroundColor: '#E9E9E9' }}>
										Jumlah Pencairan
									</TableCell>
									<TableCell style={{ backgroundColor: '#E9E9E9' }}></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{data.withdrawItems !== null ? (
									<>
										{data.withdrawItems.length !== 0 ? (
											data.withdrawItems.map((row) => (
												<TableRow key={row.id}>
													<TableCell scope='row'>
														<ListItemText
															disableTypography
															primary={
																<>
																	<Link
																	// onClick={(e) => {
																	// 	e.stopPropagation();
																	// 	setVisible(true);
																	// 	setId(row.id);
																	// 	// handleDetailInvoice(row.id);
																	// }}
																	>
																		{row.withdraw_id}
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
														{row.sec_user_model.email}
													</TableCell>
													<TableCell scope='row'>{row.bank_name}</TableCell>
													<TableCell scope='row'>
														{row.account_number}
													</TableCell>
													<TableCell scope='row'>
														{toRupiah(row.amount, {
															dot: '.',
															formal: false,
															floatingPoint: 0,
														})}
													</TableCell>
													<TableCell>
														<Button
															type='link'
															onClick={(e) => {
																e.stopPropagation();
																onClickModalConfirm(row.id);
																setState({
																	...state,
																	fileList: [
																		{
																			name: row.file_name,
																			status: 'done',
																			url: `${API_SERVICE.keeponic}${row.location_file}`,
																			thumbUrl: `${API_SERVICE.keeponic}${row.location_file}`,
																		},
																	],
																});
															}}
														>
															Lihat Detail
														</Button>
													</TableCell>
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell
													colSpan='6'
													style={{ alignContent: 'center' }}
												>
													<Row
														style={{ justifyContent: 'center' }}
														className='my-4'
													>
														<Empty description={'Tidak ada data.'} />
													</Row>
												</TableCell>
											</TableRow>
										)}
									</>
								) : (
									<TableRow>
										<TableCell colSpan='6' style={{ alignContent: 'center' }}>
											<Row
												style={{ justifyContent: 'center' }}
												className='my-4'
											>
												<Empty description={'Tidak ada data.'} />
											</Row>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</Col>
			</Row>

			{/* Modal Confirm */}

			<Modal
				centered
				closable={false}
				title='Rincian Pencairan Dana'
				visible={isModalConfirmVisible}
				footer={[
					<Button key='back' onClick={handleConfirmCancel}>
						Tutup
					</Button>,
					<Button
						key='confirm'
						type='primary'
						loading={state.uploading}
						disabled={state.fileList.length === 0 && true}
						onClick={(e) => {
							e.stopPropagation();
							handleConfirmWithdraw();
						}}
					>
						Konfirmasi
					</Button>,
				]}
			>
				<Typography.Text style={{ color: '#979797' }}>
					Nomor Pencairan Dana
				</Typography.Text>
				<p
					style={{
						borderBottom: 'none',
						color: '#61934A',
						fontSize: 18,
					}}
				>
					{dataWithdraw !== null && dataWithdraw.withdraw_id}
				</p>
				<Typography.Text style={{ color: '#979797' }}>
					Bank Tujuan
				</Typography.Text>
				<p
					style={{
						borderBottom: 'none',
						fontSize: 16,
					}}
				>
					{dataWithdraw !== null && dataWithdraw.bank_name}
				</p>
				<Typography.Text style={{ color: '#979797' }}>
					Nama Pemilik Rekening
				</Typography.Text>
				<p
					style={{
						borderBottom: 'none',
						fontSize: 16,
					}}
				>
					{dataWithdraw !== null && dataWithdraw.account_name}
				</p>
				<Typography.Text style={{ color: '#979797' }}>
					Nomor Rekening Bank
				</Typography.Text>
				<Typography.Paragraph
					style={{ fontSize: 16 }}
					copyable={{
						icon: ['Salin'],
					}}
				>
					{dataWithdraw !== null && dataWithdraw.account_number}
				</Typography.Paragraph>
				<Typography.Text style={{ color: '#979797' }}>
					Jumlah Pencairan Dana
				</Typography.Text>
				<p style={{ fontSize: 16, borderBottom: 'none' }}>
					{dataWithdraw !== null &&
						toRupiah(dataWithdraw.amount, {
							dot: '.',
							formal: false,
							floatingPoint: 0,
						})}
				</p>

				<Typography.Text className='mr-2' style={{ color: '#979797' }}>
					Ubah Bukti Transfer
				</Typography.Text>
				<Upload {...props} listType='picture' maxCount={1}>
					<Button>Upload</Button>
				</Upload>
			</Modal>
		</>
	);
};

export default WithdrawFinish;
