import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Row, Col, Button as RSButton, ButtonGroup } from 'reactstrap';
import {
	TableContainer,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TablePagination,
	Paper,
	Button,
	Menu,
	MenuItem,
	Chip,
	ListItemText,
	TextField,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

import * as Io5 from 'react-icons/io5';
import * as Ai from 'react-icons/ai';
import * as Md from 'react-icons/md';

import ILNoImage from '../../../assets/images/no_image.png';
import { Empty } from 'antd';
import TabMenu from './components/TabMenuProduct';

// Utils
import { getLoggedInUser } from '../../../helpers/authUtils';
import { isLongText, idrCurrency } from '../../../helpers/utility';
import { withTranslation } from 'react-i18next';
import i18n from '../../../i18n';
import { COLORS } from '../../../constants/colors';
import queryString from 'query-string';
// Enum
import { STATUS } from '../../../constants/status.enum';

// Actions
import {
	onChangeStatePathInfo,
	onChangeRowProduct,
	onChangePageProduct,
	getProduct,
	getUserProfile,
} from '../../../redux/actions';

class ProductBackup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: getLoggedInUser(),
			id: null,
			valueIndex: 0,
			pathValue: 'all-product',
			achorEl: null,
			menu: '',
			page: 0,
			totalPages: 0,
		};
	}

	componentWillMount() {
		const values = queryString.parse(this.props.location.search);

		if (values.page <= 0 || values.page === undefined) {
			this.props.history.push(`?page=${1}`);
			this.props.onChangePageProduct('page', 0);
			this.setState({
				page: 1,
				totalPages: this.props.totalPages,
			});
		} else {
			this.props.history.push(`?page=${values.page}`);
			this.props.onChangePageProduct('page', values.page - 1);
			this.setState({
				// keyword: values.page,
				page: values.page,
				totalPages: this.props.totalPages,
			});
		}
	}

	componentDidMount() {
		const { onChangeStatePathInfo, getProduct, getUserProfile } = this.props;
		onChangeStatePathInfo('path', this.state.pathValue);
		getProduct();
		getUserProfile();
	}

	onRefresh = () => {
		this.props.onChangePageProduct('page', 0);
		this.props.getProduct();
	};

	handleChangePage = (event, nextPage) => {
		this.props.onChangePageProduct('page', nextPage);
		this.props.history.push(`?page=${++nextPage}`);
		this.props.getProduct();
	};

	handleChangeRowsPerPage = (event) => {
		this.props.onChangeRowProduct(
			'row',
			parseInt(event.target.value, [5, 10, 25, 50, 100])
		);
		this.props.onChangePageProduct('page', 0);
		this.props.getProduct();
	};

	handleClick = (event, row) => {
		this.setState({
			anchorEl: event,
			menu: row === 0 ? i18n.t('archived') : i18n.t('show'),
		});
	};
	handleClose = () => {
		this.setState({
			anchorEl: null,
		});
	};

	handleOnChange = (event, valueIndex) => {
		switch (valueIndex) {
			case 0:
				if (this.props.path !== 'all-product') {
					this.setState({ valueIndex: 0, page: 1 });
					this.props.history.push(`?page=${1}`);
					this.props.onChangeStatePathInfo('path', 'all-product');
					this.props.onChangePageProduct('page', 0);
					this.props.onChangeRowProduct('row', 5);
					this.props.getProduct();
				}
				break;
			case 1:
				if (this.props.path !== 'sell') {
					this.setState({ valueIndex: 1, page: 1 });
					this.props.history.push(`?page=${1}`);
					this.props.onChangeStatePathInfo('path', 'sell');
					this.props.onChangePageProduct('page', 0);
					this.props.onChangeRowProduct('row', 5);
					this.props.getProduct();
				}
				break;
			case 2:
				if (this.props.path !== 'draft') {
					this.setState({ valueIndex: 2, page: 1 });
					this.props.history.push(`?page=${1}`);
					this.props.onChangeStatePathInfo('path', 'draft');
					this.props.onChangePageProduct('page', 0);
					this.props.onChangeRowProduct('row', 5);
					this.props.getProduct();
				}
				break;
			default:
				break;
		}
	};

	render() {
		const { valueIndex, anchorEl, user } = this.state;
		const { dataProduct, totalItems, row, page, loading, status } = this.props;

		const tableHead = (
			<TableHead>
				<TableRow>
					<TableCell style={{ backgroundColor: COLORS.LightGray }}>#</TableCell>
					<TableCell style={{ backgroundColor: COLORS.LightGray }}>
						{i18n.t('name')}
					</TableCell>
					<TableCell style={{ backgroundColor: COLORS.LightGray }}>
						{i18n.t('category')}
					</TableCell>
					<TableCell
						align='justify'
						style={{ backgroundColor: COLORS.LightGray }}
					>
						{i18n.t('price')}
					</TableCell>
					<TableCell
						align='justify'
						style={{ backgroundColor: COLORS.LightGray }}
					>
						{i18n.t('stock')}
					</TableCell>
					<TableCell
						align='justify'
						style={{ backgroundColor: COLORS.LightGray }}
					>
						{''}
					</TableCell>
				</TableRow>
			</TableHead>
		);

		return (
			<>
				<div>
					<Row>
						<Col lg={12}>
							<div className='page-title-box'>
								<div className='float-right page-title'>
									<Link to={`${process.env.PUBLIC_URL}/product/add-product`}>
										<RSButton color='success'>
											<Io5.IoAdd size={'1.5em'} />
											{i18n.t('add_product')}
										</RSButton>
									</Link>
								</div>
								<h4 className='page-title'>
									{`${i18n.t('shop_product')} ${user.market_name}`}
									<span className='ml-3'></span>
								</h4>
							</div>
						</Col>
					</Row>

					<Paper elevation={0}>
						<Row>
							<Col lg={12}>
								<TabMenu
									value={valueIndex}
									handleOnChange={this.handleOnChange}
								/>
							</Col>
						</Row>
						<Row className='p-3'>
							<Col lg={4} md={4} xs={12}>
								<TextField
									id='outlined-basic'
									variant='outlined'
									placeholder='Cari nama produk... '
									size='small'
									fullWidth
								/>
							</Col>
							<Col lg={4} md={4} xs={12}>
								<TextField
									id='outlined-basic'
									variant='outlined'
									placeholder='Kategori'
									size='small'
									fullWidth
								/>
							</Col>
							<Col lg={12} className='mt-2'>
								<RSButton color='success' className='px-3'>
									{i18n.t('search')}
								</RSButton>
							</Col>
						</Row>
					</Paper>

					<Row className='mt-2'>
						<Col lg={12}>
							<Paper className='px-3 py-3' elevation={0}>
								{loading ? (
									<Skeleton
										className='mb-3'
										variant='rect'
										height={'15px'}
										width='7%'
										style={{ borderRadius: 5 }}
									/>
								) : (
									<p>
										{`${i18n.t('total')} ${
											totalItems === undefined ? 0 : totalItems
										}`}{' '}
										{i18n.t('product')}
									</p>
								)}
								{loading ? (
									<TableContainer>
										<Table aria-label='simple table' size='small'>
											<TableHead>
												<TableRow>
													<TableCell
														style={{
															backgroundColor: COLORS.LightGray,
															height: 36,
														}}
													>
														{''}
													</TableCell>
													<TableCell
														style={{ backgroundColor: COLORS.LightGray }}
													>
														{''}
													</TableCell>
													<TableCell
														style={{ backgroundColor: COLORS.LightGray }}
													>
														{''}
													</TableCell>
													<TableCell
														align='justify'
														style={{ backgroundColor: COLORS.LightGray }}
													>
														{''}
													</TableCell>
													<TableCell
														align='justify'
														style={{ backgroundColor: COLORS.LightGray }}
													>
														{''}
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
												<TableRow>
													<TableCell
														colSpan='6'
														style={{ alignContent: 'center' }}
													>
														<Row className='mt-2 '>
															<Col lg={1} sm={3} xs={4}>
																<Skeleton
																	variant='rect'
																	height={'45px'}
																	style={{ borderRadius: 5 }}
																/>
															</Col>
															<Col lg={11} sm={8} xs={7}>
																<Skeleton
																	variant='rect'
																	height={'15px'}
																	style={{ borderRadius: 5 }}
																/>
																<Skeleton
																	variant='rect'
																	height={'15px'}
																	width='20%'
																	style={{ borderRadius: 5 }}
																	className='mt-2'
																/>
															</Col>
														</Row>
														<Row className='mt-4  '>
															<Col lg={1} sm={3} xs={4}>
																<Skeleton
																	variant='rect'
																	height={'45px'}
																	style={{ borderRadius: 5 }}
																/>
															</Col>
															<Col lg={11} sm={8} xs={7}>
																<Skeleton
																	variant='rect'
																	height={'15px'}
																	style={{ borderRadius: 5 }}
																/>
																<Skeleton
																	variant='rect'
																	height={'15px'}
																	width='20%'
																	style={{ borderRadius: 5 }}
																	className='mt-2'
																/>
															</Col>
														</Row>
														<Row className='my-4 '>
															<Col lg={1} sm={3} xs={4}>
																<Skeleton
																	variant='rect'
																	height={'45px'}
																	style={{ borderRadius: 5 }}
																/>
															</Col>
															<Col lg={11} sm={8} xs={7}>
																<Skeleton
																	variant='rect'
																	height={'15px'}
																	style={{ borderRadius: 5 }}
																/>
																<Skeleton
																	variant='rect'
																	height={'15px'}
																	width='20%'
																	style={{ borderRadius: 5 }}
																	className='mt-2'
																/>
															</Col>
														</Row>
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</TableContainer>
								) : (
									<>
										{this.props.path === 'all-product' && (
											<TableContainer>
												<Table aria-label='simple table' size='small'>
													{tableHead}
													<TableBody>
														{dataProduct.length === 0 ? (
															<>
																{status === 500 ? (
																	<TableRow>
																		<TableCell
																			colSpan='6'
																			style={{ alignContent: 'center' }}
																		>
																			<Row
																				style={{ justifyContent: 'center' }}
																				className='my-4'
																			>
																				<Empty
																					image={false}
																					imageStyle={{ height: 10 }}
																					description={
																						'Maaf, terjadi kesalahan.'
																					}
																				>
																					<Link
																						onClick={this.onRefresh}
																						role='button'
																					>
																						<span>
																							<Md.MdRefresh />
																						</span>{' '}
																						Refresh
																					</Link>
																				</Empty>
																			</Row>
																		</TableCell>
																	</TableRow>
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
																				<Empty
																					image={Empty.PRESENTED_IMAGE_SIMPLE}
																					description={i18n.t(
																						'product_not_found'
																					)}
																				>
																					<Link
																						to='/product/add-product'
																						role='button'
																					>
																						{i18n.t('add_product')}
																					</Link>
																				</Empty>
																			</Row>
																		</TableCell>
																	</TableRow>
																)}
															</>
														) : (
															dataProduct &&
															dataProduct.map((row) => (
																<TableRow key={row.id}>
																	<TableCell
																		scope='row'
																		style={{ width: '10%' }}
																	>
																		<img
																			src={
																				row.avatar !== ''
																					? row.avatar
																					: ILNoImage
																			}
																			className='responsive p-1 mx-1 my-1'
																			width='88'
																			height='77'
																			alt=''
																			style={{
																				borderWidth: 1,
																				borderColor: '#E9E9E9',
																				borderStyle: 'solid',
																				borderRadius: 5,
																			}}
																		></img>
																	</TableCell>
																	<TableCell
																		scope='row'
																		style={{ width: '20%' }}
																	>
																		<ListItemText
																			disableTypography
																			primary={`${isLongText(row.name, 35)}`}
																			secondary={
																				row.m_product_model.status ===
																				STATUS.DEACTIVE ? (
																					<Chip
																						size='small'
																						label={i18n.t('archived')}
																						style={{
																							backgroundColor: COLORS.orange,
																							color: COLORS.white,
																							marginTop: 5,
																						}}
																						icon={
																							<Ai.AiFillLock
																								style={{ color: COLORS.white }}
																							/>
																						}
																					/>
																				) : null
																			}
																		/>
																	</TableCell>
																	<TableCell style={{ width: '20%' }}>
																		{}
																	</TableCell>
																	<TableCell
																		align='justify'
																		style={{ width: '15%' }}
																	>{`Rp ${idrCurrency(row.price)}`}</TableCell>
																	<TableCell
																		align='justify'
																		style={{ width: '15%' }}
																	>{`${row.stock}`}</TableCell>
																	<TableCell
																		align='justify'
																		style={{ width: '30%' }}
																	>
																		<ButtonGroup vertical>
																			<Link
																				to={`${process.env.PUBLIC_URL}/product/detail/${row.id}`}
																			>
																				<Button
																					startIcon={<Md.MdRemoveRedEye />}
																					color='primary'
																					style={{ textTransform: 'none' }}
																				>
																					{i18n.t('detail')}
																				</Button>
																			</Link>
																			<Button
																				color='primary'
																				style={{ textTransform: 'none' }}
																				aria-haspopup='true'
																				onClick={(event) =>
																					this.handleClick(
																						event.currentTarget,
																						row.m_product_model.status
																					)
																				}
																			>
																				{i18n.t('others')}
																			</Button>
																			<Menu
																				id='simple-menu'
																				anchorEl={anchorEl}
																				keepMounted
																				open={Boolean(anchorEl)}
																				onClose={this.handleClose}
																				elevation={0}
																			>
																				<Paper variant='outlined'>
																					<MenuItem onClick={this.handleClose}>
																						{this.state.menu}
																					</MenuItem>
																					<MenuItem onClick={this.handleClose}>
																						{i18n.t('delete')}
																					</MenuItem>
																				</Paper>
																			</Menu>
																		</ButtonGroup>
																	</TableCell>
																</TableRow>
															))
														)}
													</TableBody>
												</Table>
											</TableContainer>
										)}
										{this.props.path === 'sell' && (
											<TableContainer>
												<Table aria-label='simple table' size='small'>
													{tableHead}
													<TableBody>
														{dataProduct.length === 0 ? (
															<>
																<TableRow>
																	<TableCell
																		colSpan='6'
																		style={{ alignContent: 'center' }}
																	>
																		<Row
																			style={{ justifyContent: 'center' }}
																			className='my-4'
																		>
																			<Empty
																				image={Empty.PRESENTED_IMAGE_SIMPLE}
																				description={i18n.t(
																					'product_not_found'
																				)}
																			/>
																		</Row>
																	</TableCell>
																</TableRow>
															</>
														) : (
															dataProduct &&
															dataProduct.map((row) => (
																<TableRow key={row.id}>
																	<TableCell
																		scope='row'
																		style={{ width: '10%' }}
																	>
																		<img
																			src={
																				row.avatar !== ''
																					? row.avatar
																					: ILNoImage
																			}
																			className='responsive p-1 mx-1 my-1'
																			width='88'
																			height='77'
																			alt=''
																			style={{
																				borderWidth: 1,
																				borderColor: '#E9E9E9',
																				borderStyle: 'solid',
																				borderRadius: 5,
																			}}
																		></img>
																	</TableCell>
																	<TableCell
																		scope='row'
																		style={{ width: '20%' }}
																	>
																		{isLongText(row.name, 50)}
																	</TableCell>
																	<TableCell style={{ width: '20%' }}>
																		{}
																	</TableCell>
																	<TableCell
																		align='justify'
																		style={{ width: '15%' }}
																	>{`Rp ${idrCurrency(row.price)}`}</TableCell>
																	<TableCell
																		align='justify'
																		style={{ width: '15%' }}
																	>{`${row.stock}`}</TableCell>
																	<TableCell
																		align='justify'
																		style={{ width: '30%' }}
																	>
																		<ButtonGroup vertical>
																			<Button
																				color='primary'
																				style={{ textTransform: 'none' }}
																			>
																				{i18n.t('detail')}
																			</Button>
																			<Button
																				color='primary'
																				style={{ textTransform: 'none' }}
																				aria-haspopup='true'
																				onClick={(event) =>
																					this.handleClick(
																						event.currentTarget,
																						row.m_product_model.status
																					)
																				}
																			>
																				{i18n.t('others')}
																			</Button>
																			<Menu
																				id='simple-menu'
																				anchorEl={anchorEl}
																				keepMounted
																				open={Boolean(anchorEl)}
																				onClose={this.handleClose}
																				elevation={0}
																			>
																				<Paper variant='outlined'>
																					<MenuItem onClick={this.handleClose}>
																						{i18n.t('archive')}
																					</MenuItem>
																					<MenuItem onClick={this.handleClose}>
																						{i18n.t('delete')}
																					</MenuItem>
																				</Paper>
																			</Menu>
																		</ButtonGroup>
																	</TableCell>
																</TableRow>
															))
														)}
													</TableBody>
												</Table>
											</TableContainer>
										)}
										{this.props.path === 'draft' && (
											<TableContainer>
												<Table aria-label='simple table' size='small'>
													{tableHead}
													<TableBody>
														{totalItems === 0 ? (
															<>
																<TableRow>
																	<TableCell
																		colSpan='6'
																		style={{ alignContent: 'center' }}
																	>
																		<Row
																			style={{ justifyContent: 'center' }}
																			className='my-4'
																		>
																			<Empty
																				image={Empty.PRESENTED_IMAGE_SIMPLE}
																				description={i18n.t(
																					'product_not_found'
																				)}
																			/>
																		</Row>
																	</TableCell>
																</TableRow>
															</>
														) : (
															dataProduct &&
															dataProduct.map((row) => (
																<TableRow key={row.id}>
																	<TableCell
																		scope='row'
																		style={{ width: '10%' }}
																	>
																		<img
																			src={
																				row.avatar !== ''
																					? row.avatar
																					: ILNoImage
																			}
																			className='responsive p-1 mx-1 my-1'
																			width='88'
																			height='77'
																			alt=''
																			style={{
																				borderWidth: 1,
																				borderColor: '#E9E9E9',
																				borderStyle: 'solid',
																				borderRadius: 5,
																			}}
																		></img>
																	</TableCell>
																	<TableCell
																		scope='row'
																		style={{ width: '20%' }}
																	>
																		{isLongText(row.name, 50)}
																	</TableCell>
																	<TableCell style={{ width: '20%' }}>
																		{}
																	</TableCell>
																	<TableCell
																		align='justify'
																		style={{ width: '15%' }}
																	>{`Rp ${idrCurrency(row.price)}`}</TableCell>
																	<TableCell
																		align='justify'
																		style={{ width: '15%' }}
																	>{`${row.stock}`}</TableCell>
																	<TableCell
																		align='justify'
																		style={{ width: '30%' }}
																	>
																		<ButtonGroup vertical>
																			<Button
																				color='primary'
																				style={{ textTransform: 'none' }}
																			>
																				{i18n.t('detail')}
																			</Button>
																			<Button
																				color='primary'
																				style={{ textTransform: 'none' }}
																				aria-haspopup='true'
																				onClick={(event) =>
																					this.handleClick(
																						event.currentTarget,
																						row.m_product_model.status
																					)
																				}
																			>
																				{i18n.t('others')}
																			</Button>
																			<Menu
																				id='simple-menu'
																				anchorEl={anchorEl}
																				keepMounted
																				open={Boolean(anchorEl)}
																				onClose={this.handleClose}
																				elevation={0}
																			>
																				<Paper variant='outlined'>
																					<MenuItem onClick={this.handleClose}>
																						{i18n.t('show')}
																					</MenuItem>
																					<MenuItem onClick={this.handleClose}>
																						{i18n.t('delete')}
																					</MenuItem>
																				</Paper>
																			</Menu>
																		</ButtonGroup>
																	</TableCell>
																</TableRow>
															))
														)}
													</TableBody>
												</Table>
											</TableContainer>
										)}
									</>
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
						</Col>
					</Row>
				</div>
			</>
		);
	}
}

const mapStateToProps = (state) => {
	const {
		dataProduct,
		q,
		totalItems,
		totalPages,
		page,
		row,
		loading,
		status,
	} = state.ProductReducers;
	const { path } = state.PathReducers;

	return {
		path,
		dataProduct,
		q,
		totalItems,
		totalPages,
		page,
		row,
		loading,
		status,
	};
};

export default connect(mapStateToProps, {
	onChangeStatePathInfo,
	onChangeRowProduct,
	onChangePageProduct,
	getProduct,
	getUserProfile,
})(withTranslation()(ProductBackup));
