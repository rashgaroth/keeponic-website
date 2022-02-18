//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import {
	TableContainer,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TablePagination,
	Paper,
} from '@material-ui/core';
import {
	Button,
	Empty,
	Modal,
	Avatar,
	Descriptions,
	Spin,
	DatePicker,
	Input,
} from 'antd';

import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
//  Region Import Redux Action Type and Redux Action
import {
	getUser,
	getAllUser,
	onChangeRow,
	onChangeDate,
	onChangePage,
	onChangeSearch,
} from '../../../../redux/actions';
//  Region Import Utility/Helper Function
import i18n from '../../../../i18n';
import { COLORS } from '../../../../constants/colors';
import TableSkeleton from './TableSkeleton';
//  Region Import Components

//  Region Import Assets

//  Region Import Style

//  Region Import Constants

class TableListUser extends Component {
	//  constructor declaration
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			q: '',
			filterDate: 'startDate=&endDate=',
			date: [],
		};
	}

	//  react lifecycle (componentDidMount, componentDidUpdate, etc)
	componentDidMount() {
		const { getAllUser, onChangeRow } = this.props;
		onChangeRow('row', 10);
		getAllUser();
	}
	//  Function declaration (handle, onchange, etc)
	handleChangePage = (event, nextPage) => {
		this.props.onChangePage('page', nextPage);
		this.props.getAllUser();
	};

	handleChangeRowsPerPage = (event) => {
		this.props.onChangeRow(
			'row',
			parseInt(event.target.value, [5, 10, 25, 50, 100])
		);
		this.props.onChangePage('page', 0);
		this.props.getAllUser();
	};

	handleModal = (id) => {
		this.props.getUser(id);
		this.setState({
			modalVisible: true,
			// id: id,
		});
	};

	handleCancel = () => {
		this.setState({
			modalVisible: false,
			modalAddVisible: false,
		});
	};

	onChangeSearch = (e) => {
		this.setState({
			q: e.target.value,
		});
	};

	onDateChange = (value, dateString) => {
		this.setState({
			filterDate: `startDate=${dateString[0]}&endDate=${dateString[1]}`,
			date: value,
		});
	};

	handleSearch = () => {
		if (
			this.state.q !== this.props.q ||
			this.state.filterDate !== this.props.filterDate
		) {
			this.props.onChangeSearch('q', this.state.q);
			this.props.onChangeDate('filterDate', this.state.filterDate);
			this.props.onChangePage('page', 0);
			this.props.onChangeRow('row', 10);
			this.props.getAllUser();
		}
	};

	handleReset = () => {
		if (
			this.state.q.length > 0 ||
			this.state.filterDate !== 'startDate=&endDate='
		) {
			this.setState({
				q: '',
				filterDate: 'startDate=&endDate=',
				date: [],
			});
			this.props.onChangeSearch('q', '');
			this.props.onChangeDate('filterDate', 'startDate=&endDate=');
			this.props.onChangePage('page', 0);
			this.props.onChangeRow('row', 10);
			this.props.getAllUser();
		}
	};

	render() {
		const { modalVisible, q } = this.state;
		const {
			totalItems,
			row,
			page,
			users,
			loading,
			user,
			loadingUser,
		} = this.props;
		return (
			<>
				<Paper className='px-3 py-3' elevation={0}>
					<Row className='mb-3'>
						<Col lg={4} md={4} xs={12}>
							<Input
								onChange={this.onChangeSearch}
								value={q}
								placeholder='Cari nama atau email pengguna...'
							/>
						</Col>
						<Col lg={4} md={4} xs={12}>
							{' '}
							<DatePicker.RangePicker
								placeholder={['dari', 'ke']}
								value={this.state.date}
								onChange={this.onDateChange}
							/>
						</Col>
						<Col lg={4} md={4} xs={12}></Col>
						<Col lg={12} className='mt-2'>
							<Button
								type='primary'
								className='px-3'
								onClick={this.handleSearch}
							>
								{i18n.t('search')}
							</Button>
							<Button
								type='secondary'
								className='px-3 ml-2'
								onClick={this.handleReset}
							>
								Reset
							</Button>
						</Col>
					</Row>
					{loading ? (
						<TableSkeleton />
					) : (
						<TableContainer>
							<Table aria-label='simple table' size='small'>
								<TableHead>
									<TableRow>
										<TableCell style={{ backgroundColor: COLORS.LightGray }}>
											{''}
										</TableCell>
										<TableCell style={{ backgroundColor: COLORS.LightGray }}>
											{i18n.t('name')}
										</TableCell>
										<TableCell style={{ backgroundColor: COLORS.LightGray }}>
											{i18n.t('email')}
										</TableCell>
										<TableCell
											align='justify'
											style={{ backgroundColor: COLORS.LightGray }}
										>
											{i18n.t('created_date')}
										</TableCell>
										<TableCell
											align='justify'
											style={{ backgroundColor: COLORS.LightGray }}
										>
											{''}
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{users.length === 0 ? (
										<TableRow>
											<TableCell colSpan='6' style={{ alignContent: 'center' }}>
												<Row
													style={{ justifyContent: 'center' }}
													className='my-4'
												>
													<Empty description={i18n.t('user_not_found')} />
												</Row>
											</TableCell>
										</TableRow>
									) : (
										users &&
										users.map((row) => (
											<TableRow key={row.id}>
												<TableCell scope='row' style={{ width: '5%' }}>
													<Avatar
														size='large'
														src={row.avatar !== null ? row.avatar : ''}
														icon={<UserOutlined />}
													/>
												</TableCell>
												<TableCell style={{ width: '20%' }}>
													{`${row.name}`}
												</TableCell>
												<TableCell style={{ width: '20%' }}>
													{`${row.email}`}
												</TableCell>
												<TableCell style={{ width: '20%' }}>
													{`${moment(row.created_date).format(
														'DD-MMMM-YYYY HH:mm'
													)}`}
												</TableCell>
												<TableCell style={{ width: '20%' }}>
													<Button
														type='link'
														block
														onClick={(e) => {
															e.stopPropagation();
															this.handleModal(row.id);
														}}
													>
														{i18n.t('detail')}
													</Button>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</TableContainer>
					)}
				</Paper>
				<Paper elevation={0} className='mt-2'>
					<TablePagination
						component='div'
						count={totalItems !== undefined ? totalItems : 0}
						page={page}
						onChangePage={this.handleChangePage}
						labelRowsPerPage={i18n.t('show_data_by')}
						rowsPerPageOptions={[5, 10, 20, 100]}
						rowsPerPage={row}
						onChangeRowsPerPage={this.handleChangeRowsPerPage}
					/>
				</Paper>

				<Modal
					visible={modalVisible}
					footer={null}
					title={`${user.name}`}
					onCancel={this.handleCancel}
				>
					{loadingUser ? (
						<div className='text-center mb-3'>
							<Spin />
						</div>
					) : (
						<>
							{' '}
							<div className='text-center mt-3 mb-3'>
								<Avatar
									size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 120 }}
									src={user.avatar !== null ? user.avatar : ''}
									icon={<UserOutlined />}
								/>
							</div>
							<Descriptions title='Informasi Pengguna'>
								<Descriptions.Item label='Nama' span={3}>
									{user.name}
								</Descriptions.Item>
								<Descriptions.Item label='Email' span={3}>
									{user.email}
								</Descriptions.Item>
								<Descriptions.Item label='Alamat' span={3}>
									{user.address && user.address.detail !== null
										? `${user.address.detail}, ${user.address.subdistrict}, ${user.address.city}, ${user.address.province} ${user.address.postal_code}`
										: 'Belum ditambahkan'}
								</Descriptions.Item>
							</Descriptions>
						</>
					)}
				</Modal>
			</>
		);
	}
}

const mapStateToProps = (state) => {
	const {
		users,
		user,
		q,
		filterDate,
		totalItems,
		page,
		row,
		loading,
		loadingUser,
		status,
	} = state.UserManagementReducers;

	return {
		users,
		user,
		q,
		filterDate,
		totalItems,
		page,
		row,
		loading,
		loadingUser,
		status,
	};
};

export default connect(mapStateToProps, {
	getUser,
	getAllUser,
	onChangeRow,
	onChangeDate,
	onChangePage,
	onChangeSearch,
})(TableListUser);
