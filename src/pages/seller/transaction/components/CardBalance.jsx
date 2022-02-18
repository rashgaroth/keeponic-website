import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Paper } from '@material-ui/core';
import {
	Typography,
	Button,
	Modal,
	Form,
	Input,
	Select,
	message,
	Row,
	Col,
	Alert,
} from 'antd';
import * as IO from 'react-icons/io5';

import * as service from '../../../../services';
import { HeaderAuth } from '../../../../services/header';
import { toRupiah } from '../../../../helpers/utility';
import { API_SERVICE } from '../../../../constants/ApiService';
import { Skeleton } from '@material-ui/lab';
import { BANKS } from '../../../../constants/Banks';
import InputCustom from '../../product/components/InputCustom';
import { getWithdrawHistory } from '../../../../redux/actions';
const { Option } = Select;
const LoadingSkeleton = () => {
	return (
		<>
			{' '}
			<Skeleton className='d-block mx-auto' variant='text' width={70} />
			<Skeleton
				variant='text'
				className='d-block mt-2 mx-auto'
				width={90}
				height={40}
			/>
			<Skeleton
				variant='text'
				className='d-block mx-auto'
				width={130}
				height={50}
			/>
			<Skeleton className='d-block mx-auto' variant='text' width={140} />
		</>
	);
};

const CardBalance = () => {
	const dispatch = useDispatch();
	const [state, setState] = useState({
		dataBalance: null,
		loading: true,
		dataBank: null,
		msg: null,
		msgAlert: false,
		loadingBtn: false,
		error: 0,
		msgAlertWithdraw: false,
	});
	const [isModalAddVisible, setIsModalAddVisible] = useState(false);
	const [isModalDetailVisible, setIsModalDetailVisible] = useState(false);
	const [isModalWithdrawVisible, setisModalWithdrawVisible] = useState(false);
	const [form] = Form.useForm();
	const [form2] = Form.useForm();
	const [formWithdraw] = Form.useForm();

	const [totalAmount, setTotalAmount] = useState('0');

	const auth = useSelector((state) => state.AuthReducers);
	// const withdraw = useSelector((state) => state.WithdrawReducers);
	// Add
	const onClickAddBank = () => {
		setIsModalAddVisible(true);
	};

	const handleAdd = (values) => {
		let urlAddBank = `${API_SERVICE.keeponic}/seller/${auth.user.user_id}/add-bank`;
		// setIsModalAddVisible(false);
		Modal.confirm({
			title: 'Simpan rekening ini?',
			centered: true,
			okText: 'Konfirmasi',
			cancelText: 'Batal',
			onOk: async () => {
				const _response = await service.POST(urlAddBank, values, HeaderAuth());
				if (_response.status === 200) {
					getDataBank();
					setIsModalAddVisible(false);
					message.success({
						content: 'Rekening berhasil ditambahkan',
						duration: 5,
					});
				}
			},
		});
	};

	const handleAddCancel = () => {
		setIsModalAddVisible(false);
	};

	// Detail
	const onClickDetailBank = () => {
		setIsModalDetailVisible(true);
	};

	const handleDetail = (values) => {
		let urlUpdateBank = `${API_SERVICE.keeponic}/seller/${auth.user.user_id}/update-bank`;
		Modal.confirm({
			title: 'Simpan dan Ubah rekening ini?',
			centered: true,
			okText: 'Konfirmasi',
			cancelText: 'Batal',
			onOk: async () => {
				const _response = await service.PUT(
					urlUpdateBank,
					values,
					HeaderAuth()
				);
				if (_response.status === 200) {
					getDataBank();
					setIsModalDetailVisible(false);
					message.success({
						content: 'Rekening berhasil diubah',
						duration: 5,
					});
				}
			},
		});
	};

	const handleDetailCancel = () => {
		form2.resetFields();
		setIsModalDetailVisible(false);
	};

	// Withdraw
	const onClickWithdraw = () => {
		getDataBalance();
		setisModalWithdrawVisible(true);
	};

	const handleWithdraw = (values) => {
		let data = {
			account_name: values.account_name,
			bank_name: values.bank_name,
			account_number: values.account_number,
			amount: values.withdraw_amount.number,
			code: values.code,
		};
		let urlWithdraw = `${API_SERVICE.keeponic}/seller/${auth.user.user_id}/withdraw`;

		Modal.confirm({
			title: 'Anda yakin ingin melakukan pencairan dana?',
			centered: true,
			okText: 'Konfirmasi',
			cancelText: 'Batal',
			onOk: async () => {
				const _response = await service.POST(urlWithdraw, data, HeaderAuth());
				if (_response.status === 200) {
					getDataBalance();
					await dispatch(getWithdrawHistory());
					setisModalWithdrawVisible(false);
					setState((prevState) => ({
						...prevState,
						error: 0,
						msgAlert: false,
						msgAlertWithdraw: true,
					}));
					formWithdraw.resetFields();
				}
				if (_response.status === 404) {
					setState((prevState) => ({
						...prevState,
						error: 1,
						msgAlert: true,
						msg: _response.data.message,
					}));
				}
			},
		});
	};

	const handleWithdrawCancel = () => {
		formWithdraw.resetFields();
		setisModalWithdrawVisible(false);
		setTotalAmount('0');
	};

	const getDataBank = async () => {
		let urlBank = `${API_SERVICE.keeponic}/seller/${auth.user.user_id}/get-bank`;
		try {
			const _response = await service.GET(urlBank, HeaderAuth());
			if (_response.status === 200) {
				setState((prevState) => ({
					...prevState,
					loading: false,
					dataBank: _response.data.data,
				}));
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const getDataBalance = async () => {
		let urlBalance = `${API_SERVICE.keeponic}/seller/${auth.user.user_id}/balance`;
		try {
			const _response = await service.GET(urlBalance, HeaderAuth());
			if (_response.status === 200) {
				setState((prevState) => ({
					...prevState,
					loading: false,
					dataBalance: _response.data.data,
				}));
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const onChangeAccountNumber = (_, value) => {
		const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;

		if (value !== undefined && value !== '') {
			if ((!Number.isNaN(value) && reg.test(value)) || value === '') {
				return Promise.resolve();
			}
			if (reg.test(value) === false) {
				return Promise.reject(new Error('Tidak boleh mengandung karakter'));
			}
		} else {
			return Promise.reject(new Error('Kolom tidak boleh kosong.'));
		}
	};

	const checkWithdraw = (_, value) => {
		setTotalAmount(value.number.toString());
		if (state.dataBalance !== null && value !== undefined) {
			if (value.number >= 10000 && value.number <= state.dataBalance.balance) {
				return Promise.resolve();
			}
			if (value.number > state.dataBalance.balance) {
				return Promise.reject(new Error('Tidak boleh melebihi dana aktif'));
			}
			if (value.number < 10000) {
				return Promise.reject(new Error('Minimum Pencairan adalah Rp 10.000'));
			}
		}
		if (value === undefined) {
			return Promise.reject(new Error('Minimum Pencairan adalah Rp 10.000'));
		}
	};

	const sendCodeToEmail = async () => {
		let urlSendCode = `${API_SERVICE.keeponic}/seller/${auth.user.user_id}/generate-code`;
		setState((prevState) => ({
			...prevState,
			loadingBtn: true,
		}));
		try {
			const _response = await service.POST(urlSendCode, {}, HeaderAuth());
			console.log(_response.data);
			if (_response.status === 200) {
				setState((prevState) => ({
					...prevState,
					msg: _response.data.message,
					msgAlert: true,
					loadingBtn: false,
					error: 0,
				}));
			}

			if (_response.status === 400) {
				setState((prevState) => ({
					...prevState,
					msg: _response.data.message,
					msgAlert: true,
					loadingBtn: false,
					error: 1,
				}));
			}
		} catch (error) {
			setState((prevState) => ({
				...prevState,
				msg: error.message,
				msgAlert: true,
				loadingBtn: false,
				error: 1,
			}));
		}
	};

	useEffect(() => {
		getDataBalance();
		getDataBank();
	}, []);

	console.log(totalAmount);

	return (
		<>
			<Paper className='pt-3 text-center' elevation={0}>
				{state.loading ? (
					<LoadingSkeleton />
				) : (
					<>
						<Typography.Text className='d-block '>Dana Aktif</Typography.Text>
						<Typography.Title level={4} className='d-block'>
							{state.dataBalance !== null
								? toRupiah(state.dataBalance.balance, {
										replaceZeroDecimals: true,
										formal: false,
								  })
								: toRupiah(0, {
										replaceZeroDecimals: true,
										formal: false,
								  })}
						</Typography.Title>
						{state.dataBank === null ? (
							<Typography.Text className='d-block'>
								Rekening Belum Ditambahkan
							</Typography.Text>
						) : (
							<Button
								type='primary'
								className='mt-2'
								onClick={onClickWithdraw}
								disabled={
									state.dataBalance !== null && state.dataBalance.balance < 5000
										? true
										: false
								}
							>
								{' '}
								Cairkan Dana
							</Button>
						)}
						<div className='mt-2 text-center'>
							<Link
								style={{
									fontSize: 13,
									fontWeight: 'normal',
									color: '#787A7B',
								}}
							>
								<i className='mdi mdi-help-circle mr-1'></i>
								Informasi Pencairan
							</Link>
						</div>
					</>
				)}
				<Paper
					className='mt-3 p-2'
					elevation={0}
					style={{ background: '#FAFAFA' }}
				>
					<div className='d-flex justify-content-between  align-items-center'>
						<Typography.Text strong>Rekening</Typography.Text>
						{state.loading ? (
							<Skeleton variant='text' width={70} />
						) : state.dataBank !== null ? (
							<div>
								{`${state.dataBank.bank_name} `}
								<Link onClick={onClickDetailBank}>
									{`*** ${state.dataBank.account_number.substr(
										state.dataBank.account_number.length - 4
									)}`}
									<IO.IoChevronForwardOutline />
								</Link>
							</div>
						) : (
							<Link onClick={onClickAddBank}>+ Tambah Rekening</Link>
						)}
					</div>
				</Paper>
			</Paper>

			{state.msgAlertWithdraw && (
				<Alert
					type={'success'}
					closable
					className='mt-1'
					message='Permintaan Pencairan Dana Berhasil Diajukan.'
					showIcon
					onClose={() =>
						setState((prevState) => ({
							...prevState,
							msgAlertWithdraw: false,
						}))
					}
				/>
			)}

			{/* Modal Add Bank */}
			<Modal
				centered
				closable={false}
				title='Rekening Bank'
				visible={isModalAddVisible}
				footer={[
					<Button key='back' onClick={handleAddCancel}>
						Tutup
					</Button>,
					<Button
						key='confirm'
						type='primary'
						onClick={(e) => {
							e.stopPropagation();
							form.submit();
						}}
					>
						Simpan
					</Button>,
				]}
			>
				<Form
					form={form}
					// ref={this.formInformationRef}
					layout='vertical'
					// validateMessages={validateMessages}
					scrollToFirstError={true}
					autoComplete='off'
					onFinish={handleAdd}
				>
					<Form.Item
						name='bank_name'
						label='Nama Bank'
						rules={[{ required: true, message: 'Kolom tidak boleh kosong.' }]}
					>
						<Select
							placeholder='Pilih Bank'
							showSearch
							// onChange={(value) =>
							// 	this.handleChangeCategory(value)
							// }
						>
							{BANKS &&
								BANKS.map((row) => (
									<Option key={row.name} value={`${row.name}`}>
										{row.name}
									</Option>
								))}
						</Select>
					</Form.Item>
					<Form.Item
						name='account_name'
						label='Nama Pemilik Rekening (Harus sesuai dengan rekening)'
						normalize={(value) => (value || '').toUpperCase()}
						rules={[{ required: true, message: 'Kolom tidak boleh kosong.' }]}
					>
						<Input
							placeholder='Harus diisi'
							// onChange={(e) => this.handleChangeName(e)}
							minLength={10}
							maxLength={70}
						/>
					</Form.Item>
					<Form.Item
						name='account_number'
						label='Nomor Rekening Bank (Harus sesuai dengan rekening)'
						rules={[{ validator: onChangeAccountNumber }]}
					>
						<Input placeholder='Harus diisi' minLength={10} maxLength={70} />
					</Form.Item>
				</Form>
			</Modal>

			{/* Modal Detail Bank */}
			<Modal
				centered
				closable={false}
				title='Rekening Bank'
				visible={isModalDetailVisible}
				footer={[
					<Button key='back' onClick={handleDetailCancel}>
						Tutup
					</Button>,
					<Button
						key='confirm'
						type='primary'
						onClick={(e) => {
							e.stopPropagation();
							form2.submit();
						}}
					>
						Ubah
					</Button>,
				]}
			>
				<Form
					form={form2}
					// ref={this.formInformationRef}
					layout='vertical'
					// validateMessages={validateMessages}
					initialValues={{
						bank_name: state.dataBank !== null && state.dataBank.bank_name,
						account_name:
							state.dataBank !== null && state.dataBank.account_name,
						account_number:
							state.dataBank !== null && state.dataBank.account_number,
					}}
					scrollToFirstError={true}
					autoComplete='off'
					onFinish={handleDetail}
				>
					<Form.Item
						name='bank_name'
						label='Nama Bank'
						rules={[{ required: true, message: 'Kolom tidak boleh kosong.' }]}
					>
						<Select
							placeholder='Pilih Bank'
							showSearch
							// onChange={(value) =>
							// 	this.handleChangeCategory(value)
							// }
						>
							{BANKS &&
								BANKS.map((row) => (
									<Option key={row.name} value={`${row.name}`}>
										{row.name}
									</Option>
								))}
						</Select>
					</Form.Item>
					<Form.Item
						name='account_name'
						label='Nama Pemilik Rekening (Harus sesuai dengan rekening)'
						normalize={(value) => (value || '').toUpperCase()}
						rules={[{ required: true, message: 'Kolom tidak boleh kosong.' }]}
					>
						<Input
							placeholder='Harus diisi'
							// onChange={(e) => this.handleChangeName(e)}
							minLength={10}
							maxLength={70}
						/>
					</Form.Item>
					<Form.Item
						name='account_number'
						label='Nomor Rekening Bank (Harus sesuai dengan rekening)'
						rules={[{ validator: onChangeAccountNumber }]}
					>
						<Input placeholder='Harus diisi' minLength={10} maxLength={70} />
					</Form.Item>
				</Form>
			</Modal>

			{/* Modal Withdraw */}
			<Modal
				centered
				closable={false}
				title='Cairkan Dana'
				visible={isModalWithdrawVisible}
				footer={[
					<Button key='back' onClick={handleWithdrawCancel}>
						Tutup
					</Button>,
					<Button
						key='confirm'
						type='primary'
						onClick={(e) => {
							e.stopPropagation();
							formWithdraw.submit();
						}}
					>
						Konfirmasi
					</Button>,
				]}
			>
				<Form
					form={formWithdraw}
					// ref={this.formInformationRef}
					layout='vertical'
					// validateMessages={validateMessages}
					initialValues={{
						bank_name: state.dataBank !== null && state.dataBank.bank_name,
						account_name:
							state.dataBank !== null && state.dataBank.account_name,
						account_number:
							state.dataBank !== null && state.dataBank.account_number,
					}}
					scrollToFirstError={true}
					autoComplete='off'
					onFinish={handleWithdraw}
				>
					<Form.Item
						name='bank_name'
						label='Bank'
						rules={[{ required: true, message: 'Kolom tidak boleh kosong.' }]}
					>
						<Input disabled />
					</Form.Item>
					<Form.Item
						name='account_name'
						label='Pemilik Rekening'
						normalize={(value) => (value || '').toUpperCase()}
						rules={[{ required: true, message: 'Kolom tidak boleh kosong.' }]}
					>
						<Input disabled />
					</Form.Item>
					<Form.Item name='account_number' label='Nomor Rekening'>
						<Input disabled />
					</Form.Item>

					<Form.Item
						name='withdraw_amount'
						label='Nominal Pencairan'
						rules={[{ validator: checkWithdraw }]}
						extra={
							<div className='mt-1'>
								Dana aktif kamu saat ini
								<strong>
									{' '}
									{state.dataBalance !== null &&
										toRupiah(state.dataBalance.balance, {
											replaceZeroDecimals: true,
											formal: false,
										})}{' '}
								</strong>
							</div>
						}
					>
						<InputCustom prefix={'Rp'} />
					</Form.Item>

					<Form.Item
						label='Kode'
						extra={
							<>
								<br />
								Untuk memastikan bahwa Anda pemilik akun ini, tekan
								<br />
								<strong> Dapatkan Kode </strong>
								dan Kami akan mengirimkan kode verifikasi ke email Kamu.
							</>
						}
					>
						<Row gutter={8}>
							<Col span={12}>
								<Form.Item
									name='code'
									noStyle
									rules={[
										{
											required: true,
											message:
												'Mohon masukkan kode verifikasi yang kami kirimkan ke Email Kamu',
										},
									]}
								>
									<Input placeholder='Masukkan kode verifikasi' />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Button
									type='link'
									onClick={sendCodeToEmail}
									loading={state.loadingBtn}
								>
									Dapatkan Kode
								</Button>
							</Col>
						</Row>
						{state.msgAlert && (
							<Alert
								closable
								className='mt-1'
								message={state.msg}
								type={state.error ? 'error' : 'success'}
								showIcon
								onClose={() =>
									setState((prevState) => ({
										...prevState,
										msgAlert: false,
									}))
								}
							/>
						)}
					</Form.Item>
				</Form>
				<Typography.Text className='mr-1'>Nominal Pencairan</Typography.Text>
				<strong style={{ fontSize: 16, color: '#61934A' }}>
					{toRupiah(totalAmount, {
						replaceZeroDecimals: true,
						formal: false,
					})}
				</strong>
			</Modal>
		</>
	);
};

export default CardBalance;
