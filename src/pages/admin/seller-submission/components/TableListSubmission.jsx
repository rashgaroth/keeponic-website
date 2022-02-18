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
	Box,
} from '@material-ui/core';
import { Button, Empty, Modal, Avatar, DatePicker, Input } from 'antd';

import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
//  Region Import Redux Action Type and Redux Action
import {
	onChangeRow,
	onChangeDate,
	onChangePage,
	onChangeSearch,
	getAllSubmission,
	putApprovedSubmission,
	putUnapprovedSubmission,
} from '../../../../redux/actions';
//  Region Import Utility/Helper Function
import i18n from '../../../../i18n';
import { COLORS } from '../../../../constants/colors';
import TableSkeleton from './TableSkeleton';
//  Region Import Components

//  Region Import Assets

//  Region Import Style

//  Region Import Constants

class TableListSubmission extends Component {
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
		const { getAllSubmission, onChangeRow } = this.props;
		onChangeRow('row', 10);
		getAllSubmission();
	}
	//  Function declaration (handle, onchange, etc)
	handleChangePage = (event, nextPage) => {
		this.props.onChangePage('page', nextPage);
		this.props.getAllSubmission();
	};

	handleChangeRowsPerPage = (event) => {
		this.props.onChangeRow(
			'row',
			parseInt(event.target.value, [5, 10, 25, 50, 100])
		);
		this.props.onChangePage('page', 0);
		this.props.getAllSubmission();
	};

	handleApprove = (id) => {
		this.handleConfirmApprove(id);
	};

	handleConfirmApprove = (id) => {
		// eslint-disable-next-line array-callback-return
		this.props.submissions.map((row) => {
			if (row.sec_user_model.id === id) {
				Modal.confirm({
					title: 'Setujui pengguna ini?',
					centered: true,
					content: (
						<>
							<Box className='my-1' display='flex' alignItems='center'>
								<Box>
									<p style={{ fontSize: 13, fontWeight: 500, marginTop: 5 }}>
										{`Nama: ${row.sec_user_model.name}`}
									</p>
								</Box>
							</Box>
						</>
					),
					okText: 'Konfirmasi',
					cancelText: 'Batal',
					onOk: () => {
						this.props.putApprovedSubmission(id);
					},
				});
			}
		});
	};

	handleUnApprove = (id) => {
		this.handleConfirmUnapprove(id);
	};

	handleConfirmUnapprove = (id) => {
		// eslint-disable-next-line array-callback-return
		this.props.submissions.map((row) => {
			if (row.sec_user_model.id === id) {
				Modal.confirm({
					title: 'Tolak pengguna ini?',
					centered: true,
					content: (
						<>
							<Box className='my-1' display='flex' alignItems='center'>
								<Box>
									<p style={{ fontSize: 13, fontWeight: 500, marginTop: 5 }}>
										{`Nama: ${row.sec_user_model.name}`}
									</p>
								</Box>
							</Box>
						</>
					),
					okText: 'Konfirmasi',
					cancelText: 'Batal',
					onOk: () => {
						this.props.putUnapprovedSubmission(id);
					},
				});
			}
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
			this.props.getAllSubmission();
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
			this.props.getAllSubmission();
		}
	};

	render() {
		const { q } = this.state;
		const { totalItems, row, page, submissions, loading } = this.props;
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
											Tanggal Pengajuan
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
									{submissions.length === 0 ? (
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
										submissions &&
										submissions.map((row) => (
											<TableRow key={row.sec_user_model.id}>
												<TableCell scope='row' style={{ width: '5%' }}>
													<Avatar
														size='large'
														src={row.avatar !== null ? row.avatar : ''}
														icon={<UserOutlined />}
													/>
												</TableCell>
												<TableCell style={{ width: '20%' }}>
													{`${row.sec_user_model.name}`}
												</TableCell>
												<TableCell style={{ width: '20%' }}>
													{`${row.sec_user_model.email}`}
												</TableCell>
												<TableCell style={{ width: '20%' }}>
													{`${moment(row.created_date).format(
														'DD-MMMM-YYYY HH:mm'
													)}`}
												</TableCell>
												<TableCell style={{ width: '20%' }}>
													<Button
														type='link'
														onClick={(e) => {
															e.stopPropagation();
															this.handleApprove(row.sec_user_model.id);
														}}
													>
														Setujui
													</Button>
													<Button
														type='link'
														onClick={(e) => {
															e.stopPropagation();
															this.handleUnApprove(row.sec_user_model.id);
														}}
													>
														Tolak
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
			</>
		);
	}
}

const mapStateToProps = (state) => {
	const {
		submissions,
		submission,
		q,
		filterDate,
		totalItems,
		page,
		row,
		loading,
		status,
	} = state.SubmissionManagementReducers;

	return {
		submissions,
		submission,
		q,
		filterDate,
		totalItems,
		page,
		row,
		loading,
		status,
	};
};

export default connect(mapStateToProps, {
	onChangeRow,
	onChangeDate,
	onChangePage,
	onChangeSearch,
	getAllSubmission,
	putApprovedSubmission,
	putUnapprovedSubmission,
})(TableListSubmission);
