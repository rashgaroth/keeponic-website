//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
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
import { Button, Empty, Avatar, Input, DatePicker } from 'antd';
import { ShopOutlined } from '@ant-design/icons';
import moment from 'moment';
//  Region Import Redux Action Type and Redux Action
import {
	getAllMarket,
	onChangeDate,
	onChangeRow,
	onChangePage,
	onChangeSearch,
} from '../../../../redux/actions';
//  Region Import Utility/Helper Function
import i18n from '../../../../i18n';
import { COLORS } from '../../../../constants/colors';
import { isLongText } from '../../../../helpers/utility';

//  Region Import Components
import TableSkeleton from './TableSkeleton';

//  Region Import Assets

//  Region Import Style

//  Region Import Constants

class TableListMarket extends Component {
	//  constructor declaration
	constructor(props) {
		super(props);
		this.state = {
			q: '',
			filterDate: 'startDate=&endDate=',
			date: [],
		};
	}

	//  react lifecycle (componentDidMount, componentDidUpdate, etc)
	componentDidMount() {
		const { getAllMarket, onChangeRow, onChangePage } = this.props;
		onChangePage('page', 0);
		onChangeRow('row', 5);
		getAllMarket();
	}
	//  Function declaration (handle, onchange, etc)
	handleChangePage = (event, nextPage) => {
		this.props.onChangePage('page', nextPage);
		this.props.getAllMarket();
	};

	handleChangeRowsPerPage = (event) => {
		this.props.onChangeRow(
			'row',
			parseInt(event.target.value, [5, 10, 25, 50, 100])
		);
		this.props.onChangePage('page', 0);
		this.props.getAllMarket();
	};

	onChangeSearch = (e) => {
		this.setState({
			q: e.target.value,
		});
	};

	onDateChange = (value, dateString) => {
		console.log(dateString);
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
			this.props.onChangeRow('row', 5);
			this.props.getAllMarket();
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
			this.props.onChangeRow('row', 5);
			this.props.getAllMarket();
		}
	};

	render() {
		const { totalItems, row, page, markets, loading } = this.props;
		return (
			<>
				<Paper className='px-3 py-3' elevation={0}>
					<Row className='mb-2'>
						<Col lg={4} md={4} xs={12}>
							<Input
								onChange={this.onChangeSearch}
								value={this.state.q}
								placeholder='Cari nama, deskripsi, penjual '
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
											{`ID - Nama Toko`}
										</TableCell>
										<TableCell style={{ backgroundColor: COLORS.LightGray }}>
											{i18n.t('description')}
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
											{i18n.t('owner')}
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
									{markets.length === 0 ? (
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
										markets &&
										markets.map((row) => (
											<TableRow key={row.id}>
												<TableCell scope='row' style={{ width: '5%' }}>
													<Avatar
														size='large'
														src={row.avatar !== null ? row.avatar : ''}
														icon={<ShopOutlined />}
													/>
												</TableCell>
												<TableCell>
													{`${row.id} - ${row.market_name}`}
												</TableCell>
												<TableCell>
													{`${
														row.description !== null
															? isLongText(row.description, 30)
															: '-'
													}`}
												</TableCell>
												<TableCell>
													{`${moment(row.created_date).format(
														'DD-MMMM-YYYY HH:mm'
													)}`}
												</TableCell>
												<TableCell>{`${row.sec_user_model.email}`}</TableCell>
												<TableCell>
													<Link
														to={`${process.env.PUBLIC_URL}/market-management/market/${row.id}`}
													>
														<Button type='link' block>
															{i18n.t('detail')}
														</Button>
													</Link>
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
		markets,
		q,
		totalItems,
		page,
		row,
		loading,
		status,
	} = state.MarketManagementReducers;

	return {
		markets,
		q,
		totalItems,
		page,
		row,
		loading,
		status,
	};
};

export default connect(mapStateToProps, {
	onChangeDate,
	onChangeRow,
	onChangePage,
	getAllMarket,
	onChangeSearch,
})(TableListMarket);
