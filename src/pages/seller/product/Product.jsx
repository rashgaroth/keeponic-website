//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import {
	Button,
	Menu,
	Dropdown,
	Modal,
	Empty,
	Alert,
	Tooltip,
	Input,
	Select,
	Tag,
	Card,
	Space,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {
	TableContainer,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TablePagination,
	Paper,
	ListItemText,
	Box,
} from '@material-ui/core';
import { Pagination, Skeleton } from '@material-ui/lab';

import * as Io5 from 'react-icons/io5';
import * as Ai from 'react-icons/ai';
import * as Md from 'react-icons/md';

import { withTranslation } from 'react-i18next';

//  Region Import Redux Action Type and Redux Action
import {
	getProduct,
	onChangeSort,
	deleteProduct,
	updateProduct,
	getUserProfile,
	getProductCategory,
	onChangeRowProduct,
	onChangePageProduct,
	onChangeStatePathInfo,
	onChangeSearchProduct,
	onChangeCategoryProduct,
} from '../../../redux/actions';

//  Region Import Utility/Helper Function
import { getLoggedInUser } from '../../../helpers/authUtils';
import { isLongText, idrCurrency } from '../../../helpers/utility';

import i18n from '../../../i18n';
import { COLORS } from '../../../constants/colors';

//  Region Import Components
import TabMenu from './components/TabMenuProduct';
import TitlePage from '../../../components/TitlePage';

//  Region Import Assets
import ILNoImage from '../../../assets/images/no_image.png';

//  Region Import Style

//  Region Import Constants
import { STATUS } from '../../../constants/status.enum';
import { sortProduct } from '../../../constants/sortType';

class Product extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: getLoggedInUser(),
			id: null,
			valueIndex: 0,
			pathValue: 'all-product',
			menu: '',
			visible: false,
			modalDesc: '',
			q: '',
			selectedItems: [],
			sort: 'lastCreated',
		};
	}

	componentDidMount() {
		const {
			onChangeStatePathInfo,
			getProduct,
			onChangeCategoryProduct,
			getProductCategory,
			onChangeSort,
		} = this.props;

		onChangeStatePathInfo('path', this.state.pathValue);
		this.props.onChangeRowProduct('row', 5);
		this.props.onChangePageProduct('page', 0);
		onChangeCategoryProduct('catId', []);
		getProductCategory();
		onChangeSort('sort', 'lastCreated');
		getProduct();
	}

	onRefresh = () => {
		this.props.getProduct();
	};

	handleChangePage = (event, nextPage) => {
		this.props.onChangePageProduct('page', nextPage);
		this.props.getProduct();
	};

	handleChangePagination = (e, nextPage) => {
		this.props.onChangePageProduct('page', nextPage - 1);
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

	handleOnChange = (event, valueIndex) => {
		switch (valueIndex) {
			case 0:
				if (this.props.path !== 'all-product') {
					this.setState({
						valueIndex: 0,
						selectedItems: [],
						q: '',
						sort: 'lastCreated',
					});
					this.props.onChangeStatePathInfo('path', 'all-product');
					this.props.onChangeSearchProduct('q', '');
					this.props.onChangeSort('sort', 'lastCreated');
					this.props.onChangePageProduct('page', 0);
					this.props.onChangeRowProduct('row', 5);
					this.props.onChangeCategoryProduct('catId', []);
					this.props.getProduct();
				}
				break;
			case 1:
				if (this.props.path !== 'sell') {
					this.setState({
						valueIndex: 1,
						selectedItems: [],
						q: '',
						sort: 'lastCreated',
					});
					this.props.onChangeStatePathInfo('path', 'sell');
					this.props.onChangeSearchProduct('q', '');
					this.props.onChangeSort('sort', 'lastCreated');
					this.props.onChangePageProduct('page', 0);
					this.props.onChangeRowProduct('row', 5);
					this.props.onChangeCategoryProduct('catId', []);
					this.props.getProduct();
				}
				break;
			case 2:
				if (this.props.path !== 'draft') {
					this.setState({
						valueIndex: 2,
						selectedItems: [],
						q: '',
						sort: 'lastCreated',
					});
					this.props.onChangeStatePathInfo('path', 'draft');
					this.props.onChangeSearchProduct('q', '');
					this.props.onChangeSort('sort', 'lastCreated');
					this.props.onChangePageProduct('page', 0);
					this.props.onChangeRowProduct('row', 5);
					this.props.onChangeCategoryProduct('catId', []);
					this.props.getProduct();
				}
				break;
			default:
				break;
		}
	};

	handleConfirmDelete = (id) => {
		let newId = parseInt(id);
		// eslint-disable-next-line array-callback-return
		this.props.dataProduct.map((row) => {
			if (row.id === newId) {
				Modal.confirm({
					title: 'Kamu yakin ingin menghapus produk ini?',
					centered: true,
					content: (
						<>
							<Box className='my-1' display='flex' alignItems='center'>
								<Box>
									<img
										src={row.avatar}
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
									<p
										style={{ fontSize: 13, fontWeight: 500, marginTop: 5 }}
									>{`${isLongText(row.name, 30)}`}</p>
								</Box>
							</Box>
							<Alert
								style={{
									fontSize: 13,
									fontWeight: 500,
								}}
								showIcon={false}
								message='*Produk tidak bisa dikembalikan setelah dihapus'
								banner
							/>
						</>
					),
					okText: 'Konfirmasi',
					cancelText: 'Batal',
					onOk: () => {
						this.props.deleteProduct(newId);
						if (this.props.dataProduct.length === 1)
							this.props.onChangePageProduct('page', 0);
					},
				});
			}
		});
	};

	handleMenuClick = (e) => {
		let split = e.key.split(',');
		switch (split[0]) {
			case '1':
				let id = parseInt(split[1]);
				if (split[2] === '1') {
					Modal.confirm({
						title: i18n.t('show_to_draft_confirm'),
						centered: true,
						style: {
							fontSize: 5,
						},
						content: i18n.t('show_to_draft_desc'),
						okText: 'Konfirmasi',
						cancelText: 'Batal',
						onOk: () => {
							this.props.updateProduct(
								{ status: 0 },
								id,
								'UPDATE_TO_ARCHIVE_ON_TABLE'
							);
						},
					});
				} else {
					this.props.updateProduct(
						{ status: 1 },
						id,
						'UPDATE_TO_SHOW_ON_TABLE'
					);
				}
				break;
			case '2':
				this.handleConfirmDelete(split[1]);
				break;

			default:
				break;
		}
	};

	menu = (id, status) => {
		return (
			<Menu onClick={this.handleMenuClick}>
				<Menu.Item key={['1', id, status]}>
					{status === 0 ? i18n.t('show') : i18n.t('archive')}
				</Menu.Item>
				<Menu.Item key={['2', id]}>Hapus</Menu.Item>
			</Menu>
		);
	};

	onChangeSearch = (e) => {
		this.setState({
			q: e.target.value,
		});
	};

	onChangeSort = (value) => {
		this.setState({
			sort: value,
		});
	};

	handleSearch = () => {
		if (
			this.state.q !== this.props.q ||
			this.state.selectedItems !== this.props.catId ||
			this.state.sort !== this.props.sort
		) {
			this.props.onChangeCategoryProduct('catId', this.state.selectedItems);
			this.props.onChangeSort('sort', this.state.sort);
			this.props.onChangeSearchProduct('q', this.state.q);
			this.props.onChangePageProduct('page', 0);
			this.props.onChangeRowProduct('row', 5);
			this.props.getProduct();
		}
	};
	handleReset = () => {
		if (
			this.state.q.length > 0 ||
			this.state.selectedItems.length > 0 ||
			this.props.catId.length > 0 ||
			this.state.sort !== null
		) {
			this.setState({
				q: '',
				selectedItems: [],
				sort: null,
			});
			this.props.onChangeSearchProduct('q', '');
			this.props.onChangeSort('sort', null);
			this.props.onChangeCategoryProduct('catId', []);
			this.props.getProduct();
		}
	};

	handleSelectedItem = (selectedItem) => {
		this.setState({
			selectedItems: selectedItem,
		});
	};

	handleClick = (key, id, status) => {
		switch (key) {
			case '1':
				if (status === 1) {
					Modal.confirm({
						title: i18n.t('show_to_draft_confirm'),
						centered: true,
						style: {
							fontSize: 5,
						},
						content: i18n.t('show_to_draft_desc'),
						okText: 'Konfirmasi',
						cancelText: 'Batal',
						onOk: () => {
							this.props.updateProduct(
								{ status: 0 },
								id,
								'UPDATE_TO_ARCHIVE_ON_TABLE'
							);
						},
					});
				} else {
					this.props.updateProduct(
						{ status: 1 },
						id,
						'UPDATE_TO_SHOW_ON_TABLE'
					);
				}
				break;
			case '2':
				this.handleConfirmDelete(id);
				break;

			default:
				break;
		}
	};

	render() {
		const { valueIndex, selectedItems, q, sort } = this.state;
		const {
			dataProduct,
			dataCategory,
			totalItems,
			row,
			page,
			loading,
			status,
		} = this.props;

		var categories = [];
		var children = [];
		try {
			dataCategory.length !== 0 &&
				dataCategory.map((row) => {
					row.category !== null && categories.push(row.category);
					return false;
				});

			let unique = categories.length !== 0 && [
				...new Map(categories.map((o) => [o.id, o])).values(),
			];

			unique.map((row) => {
				children.push(
					<Select.Option key={[row.name, row.id]}>{row.name}</Select.Option>
				);
				return false;
			});
		} catch (error) {
			console.log(error);
		}

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
						{i18n.t('sold')}
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
							<TitlePage
								title={`${i18n.t('shop_product')}`}
								button={
									<Link to={`${process.env.PUBLIC_URL}/product/add`}>
										<Button icon={<Io5.IoAdd />} type='primary'>
											{i18n.t('add_product')}
										</Button>
									</Link>
								}
							/>
						</Col>
					</Row>
					{this.props.profile !== null &&
						this.props.profile.address.length === 0 && (
							<Alert
								message='Kamu tidak bisa menambahkan produk sebelum melengkapi data alamat kamu'
								type='warning'
								className='mb-2'
								showIcon
								action={
									<Space>
										<Button size='small' type='link'>
											Lengkapi Data
										</Button>
									</Space>
								}
							/>
						)}
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
							<Col lg={3} md={3} xs={12}>
								<Input
									onChange={this.onChangeSearch}
									value={q}
									placeholder='Cari nama produk... '
								/>
							</Col>
							<Col lg={3} md={3} xs={12}>
								<Select
									loading={loading}
									mode='multiple'
									allowClear
									style={{ width: '100%' }}
									value={selectedItems}
									placeholder='Kategori'
									onChange={this.handleSelectedItem}
								>
									{children}
								</Select>
							</Col>
							<Col lg={3} md={3} xs={12}>
								<Select
									placeholder='Urutkan'
									style={{ width: '100%' }}
									onChange={this.onChangeSort}
									value={sort}
								>
									{sortProduct &&
										sortProduct.map((row) => (
											<Select.Option value={row.value}>
												{row.label}
											</Select.Option>
										))}
								</Select>
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
											<Row>
												<Col className='d-sm-none d-none d-md-block d-lg-block'>
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
																							image={
																								Empty.PRESENTED_IMAGE_SIMPLE
																							}
																							description={i18n.t(
																								'product_not_found'
																							)}
																						>
																							<Link
																								to='/product/add'
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
																				<picture>
																					{' '}
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
																							pointerEvents: 'none',
																						}}
																					/>
																				</picture>
																			</TableCell>
																			<TableCell scope='row'>
																				<ListItemText
																					disableTypography
																					primary={
																						<Tooltip
																							mouseEnterDelay={0.2}
																							title={row.name}
																						>
																							{`${isLongText(row.name, 35)}`}
																						</Tooltip>
																					}
																					secondary={
																						row.status === STATUS.DEACTIVE ? (
																							<>
																								<br />
																								<Tag
																									icon={
																										<Ai.AiFillLock className='mr-1' />
																									}
																									color='#FFA82F'
																								>
																									{i18n.t('archived')}
																								</Tag>
																							</>
																						) : null
																					}
																				/>
																			</TableCell>
																			<TableCell>
																				{row.category !== null
																					? row.category.name
																					: '-'}
																			</TableCell>
																			<TableCell align='justify'>{`Rp ${idrCurrency(
																				row.price
																			)}`}</TableCell>
																			<TableCell align='justify'>
																				{row.stock === 0 ? (
																					<Tag color='error'>Stok habis</Tag>
																				) : (
																					row.stock
																				)}
																			</TableCell>
																			<TableCell align='justify'>
																				{row.is_sold}
																			</TableCell>
																			<TableCell align='justify'>
																				<Link
																					to={`${process.env.PUBLIC_URL}/product/detail/${row.id}/${row.slug}`}
																				>
																					<Button type='link' block>
																						{i18n.t('update')}
																					</Button>
																				</Link>
																				<Dropdown
																					overlay={this.menu(
																						row.id,
																						row.status
																					)}
																					trigger={['click']}
																				>
																					<Button
																						type='link'
																						onClick={(e) => e.preventDefault()}
																						block
																					>
																						{i18n.t('others')}
																						<DownOutlined />
																					</Button>
																				</Dropdown>
																			</TableCell>
																		</TableRow>
																	))
																)}
															</TableBody>
														</Table>
													</TableContainer>
												</Col>
												<Col className='d-sm-block d-md-none d-lg-none'>
													{dataProduct &&
														dataProduct.map((row) => (
															<Paper key={row.id} className='mb-2'>
																<Box
																	display='flex'
																	// alignItems='center'
																	className='px-1'
																>
																	<Box>
																		<img
																			src={row.avatar}
																			className='responsive mx-1 my-1'
																			width='88'
																			height='77'
																			alt=''
																			style={{
																				borderWidth: 1,
																				borderColor: '#E9E9E9',
																				borderStyle: 'solid',
																				borderRadius: 5,
																			}}
																		/>
																	</Box>
																	<ListItemText
																		disableTypography
																		primary={
																			<>
																				<Tooltip
																					mouseEnterDelay={0.2}
																					title={row.name}
																				>
																					{`${isLongText(row.name, 50)}`}
																				</Tooltip>
																				<br />
																				{`Rp${idrCurrency(row.price)}`} <br />
																			</>
																		}
																		secondary={
																			row.status === STATUS.DEACTIVE ? (
																				<Tag
																					icon={
																						<Ai.AiFillLock className='mr-1' />
																					}
																					color='#FFA82F'
																				>
																					{i18n.t('archived')}
																				</Tag>
																			) : null
																		}
																	/>
																</Box>

																<Box>
																	<Card
																		bordered={false}
																		actions={[
																			<Button
																				key='1'
																				type='link'
																				block
																				onClick={(e) => {
																					e.stopPropagation();
																					this.handleClick(
																						'1',
																						row.id,
																						row.status
																					);
																				}}
																			>
																				{row.status === 0
																					? i18n.t('show')
																					: i18n.t('archive')}
																			</Button>,
																			<Link
																				to={`${process.env.PUBLIC_URL}/product/detail/${row.id}/${row.slug}`}
																			>
																				<Button type='link' block>
																					{i18n.t('update')}
																				</Button>
																			</Link>,
																			<Button
																				key='delete'
																				type='link'
																				block
																				onClick={(e) => {
																					e.stopPropagation();
																					this.handleClick(
																						'2',
																						row.id,
																						row.status
																					);
																				}}
																			>
																				Hapus
																			</Button>,
																		]}
																	>
																		<Card.Meta
																			description={
																				<>
																					<Row>
																						<Col>
																							<p>
																								{row.stock === 0 ? (
																									<Tag color='error'>
																										Stok habis
																									</Tag>
																								) : (
																									`Stock ${row.stock}`
																								)}
																							</p>
																							{`Terjual ${row.is_sold}`}
																						</Col>
																						<Col>
																							<p>Kategori</p>
																							{`${
																								row.category !== null
																									? row.category.name
																									: '-'
																							}`}
																						</Col>
																					</Row>
																				</>
																			}
																		/>
																	</Card>
																</Box>
															</Paper>
														))}
												</Col>
											</Row>
										)}
										{this.props.path === 'sell' && (
											<Row>
												<Col className='d-sm-none d-none d-md-block d-lg-block'>
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
																				<picture>
																					{' '}
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
																							pointerEvents: 'none',
																						}}
																					/>
																				</picture>
																			</TableCell>
																			<TableCell scope='row'>
																				<ListItemText
																					disableTypography
																					primary={
																						<Tooltip
																							mouseEnterDelay={0.2}
																							title={row.name}
																						>
																							{`${isLongText(row.name, 35)}`}
																						</Tooltip>
																					}
																					secondary={
																						row.status === STATUS.DEACTIVE ? (
																							<>
																								<br />
																								<Tag
																									icon={
																										<Ai.AiFillLock className='mr-1' />
																									}
																									color='#FFA82F'
																								>
																									{i18n.t('archived')}
																								</Tag>
																							</>
																						) : null
																					}
																				/>
																			</TableCell>
																			<TableCell>
																				{row.category !== null
																					? row.category.name
																					: '-'}
																			</TableCell>
																			<TableCell align='justify'>{`Rp ${idrCurrency(
																				row.price
																			)}`}</TableCell>
																			<TableCell align='justify'>
																				{row.stock === 0 ? (
																					<Tag color='error'>Stok habis</Tag>
																				) : (
																					row.stock
																				)}
																			</TableCell>
																			<TableCell align='justify'>
																				{row.is_sold}
																			</TableCell>
																			<TableCell align='justify'>
																				<Link
																					to={`${process.env.PUBLIC_URL}/product/detail/${row.id}/${row.slug}`}
																				>
																					<Button type='link' block>
																						{i18n.t('update')}
																					</Button>
																				</Link>
																				<Dropdown
																					overlay={this.menu(
																						row.id,
																						row.status
																					)}
																					trigger={['click']}
																				>
																					<Button
																						type='link'
																						onClick={(e) => e.preventDefault()}
																						block
																					>
																						{i18n.t('others')}
																						<DownOutlined />
																					</Button>
																				</Dropdown>
																			</TableCell>
																		</TableRow>
																	))
																)}
															</TableBody>
														</Table>
													</TableContainer>
												</Col>
												<Col className='d-sm-block d-md-none d-lg-none'>
													{dataProduct &&
														dataProduct.map((row) => (
															<Paper key={row.id} className='mb-2'>
																<Box
																	display='flex'
																	// alignItems='center'
																	className='px-1'
																>
																	<Box>
																		<img
																			src={row.avatar}
																			className='responsive mx-1 my-1'
																			width='88'
																			height='77'
																			alt=''
																			style={{
																				borderWidth: 1,
																				borderColor: '#E9E9E9',
																				borderStyle: 'solid',
																				borderRadius: 5,
																			}}
																		/>
																	</Box>
																	<ListItemText
																		disableTypography
																		primary={
																			<>
																				<Tooltip
																					mouseEnterDelay={0.2}
																					title={row.name}
																				>
																					{`${isLongText(row.name, 50)}`}
																				</Tooltip>
																				<br />
																				{`Rp${idrCurrency(row.price)}`} <br />
																			</>
																		}
																		secondary={
																			row.status === STATUS.DEACTIVE ? (
																				<Tag
																					icon={
																						<Ai.AiFillLock className='mr-1' />
																					}
																					color='#FFA82F'
																				>
																					{i18n.t('archived')}
																				</Tag>
																			) : null
																		}
																	/>
																</Box>

																<Box>
																	<Card
																		bordered={false}
																		actions={[
																			<Button
																				key='1'
																				type='link'
																				block
																				onClick={(e) => {
																					e.stopPropagation();
																					this.handleClick(
																						'1',
																						row.id,
																						row.status
																					);
																				}}
																			>
																				{row.status === 0
																					? i18n.t('show')
																					: i18n.t('archive')}
																			</Button>,
																			<Link
																				to={`${process.env.PUBLIC_URL}/product/detail/${row.id}/${row.slug}`}
																			>
																				<Button type='link' block>
																					{i18n.t('update')}
																				</Button>
																			</Link>,
																			<Button
																				key='delete'
																				type='link'
																				block
																				onClick={(e) => {
																					e.stopPropagation();
																					this.handleClick(
																						'2',
																						row.id,
																						row.status
																					);
																				}}
																			>
																				Hapus
																			</Button>,
																		]}
																	>
																		<Card.Meta
																			description={
																				<>
																					<Row>
																						<Col>
																							<p>
																								{row.stock === 0 ? (
																									<Tag color='error'>
																										Stok habis
																									</Tag>
																								) : (
																									`Stock ${row.stock}`
																								)}
																							</p>
																							{`Terjual ${row.is_sold}`}
																						</Col>
																						<Col>
																							<p>Kategori</p>
																							{`${
																								row.category !== null
																									? row.category.name
																									: '-'
																							}`}
																						</Col>
																					</Row>
																				</>
																			}
																		/>
																	</Card>
																</Box>
															</Paper>
														))}
												</Col>
											</Row>
										)}
										{this.props.path === 'draft' && (
											<Row>
												<Col className='d-sm-none d-none d-md-block d-lg-block'>
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
																			<TableCell scope='row'>
																				<ListItemText
																					disableTypography
																					primary={
																						<Tooltip
																							mouseEnterDelay={0.2}
																							title={row.name}
																						>
																							<a
																								className='text-secondary'
																								href={`${process.env.PUBLIC_URL}/product/detail/${row.id}/${row.slug}`}
																								// rel='noopener noreferrer'
																							>{`${isLongText(
																								row.name,
																								35
																							)}`}</a>
																						</Tooltip>
																					}
																				/>
																			</TableCell>
																			<TableCell>
																				{row.category !== null
																					? row.category.name
																					: '-'}
																			</TableCell>
																			<TableCell align='justify'>{`Rp ${idrCurrency(
																				row.price
																			)}`}</TableCell>
																			<TableCell align='justify'>
																				{row.stock === 0 ? (
																					<Tag color='error'>Stok habis</Tag>
																				) : (
																					row.stock
																				)}
																			</TableCell>
																			<TableCell align='justify'>
																				{row.is_sold}
																			</TableCell>
																			<TableCell align='justify'>
																				<Link
																					to={`${process.env.PUBLIC_URL}/product/detail/${row.id}/${row.slug}`}
																				>
																					<Button type='link' block>
																						{i18n.t('update')}
																					</Button>
																				</Link>
																				<Dropdown
																					overlay={this.menu(
																						row.id,
																						row.status
																					)}
																					trigger={['click']}
																				>
																					<Button
																						type='link'
																						onClick={(e) => e.preventDefault()}
																						block
																					>
																						{i18n.t('others')}
																						<DownOutlined />
																					</Button>
																				</Dropdown>
																			</TableCell>
																		</TableRow>
																	))
																)}
															</TableBody>
														</Table>
													</TableContainer>
												</Col>
												<Col className='d-sm-block d-md-none d-lg-none'>
													{dataProduct &&
														dataProduct.map((row) => (
															<Paper key={row.id} className='mb-2'>
																<Box
																	display='flex'
																	// alignItems='center'
																	className='px-1'
																>
																	<Box>
																		<img
																			src={row.avatar}
																			className='responsive mx-1 my-1'
																			width='88'
																			height='77'
																			alt=''
																			style={{
																				borderWidth: 1,
																				borderColor: '#E9E9E9',
																				borderStyle: 'solid',
																				borderRadius: 5,
																			}}
																		/>
																	</Box>
																	<ListItemText
																		disableTypography
																		primary={
																			<>
																				<Tooltip
																					mouseEnterDelay={0.2}
																					title={row.name}
																				>
																					{`${isLongText(row.name, 50)}`}
																				</Tooltip>
																				<br />
																				{`Rp${idrCurrency(row.price)}`} <br />
																			</>
																		}
																		secondary={
																			row.status === STATUS.DEACTIVE ? (
																				<Tag
																					icon={
																						<Ai.AiFillLock className='mr-1' />
																					}
																					color='#FFA82F'
																				>
																					{i18n.t('archived')}
																				</Tag>
																			) : null
																		}
																	/>
																</Box>

																<Box>
																	<Card
																		bordered={false}
																		actions={[
																			<Button
																				key='1'
																				type='link'
																				block
																				onClick={(e) => {
																					e.stopPropagation();
																					this.handleClick(
																						'1',
																						row.id,
																						row.status
																					);
																				}}
																			>
																				{row.status === 0
																					? i18n.t('show')
																					: i18n.t('archive')}
																			</Button>,
																			<Link
																				to={`${process.env.PUBLIC_URL}/product/detail/${row.id}/${row.slug}`}
																			>
																				<Button type='link' block>
																					{i18n.t('update')}
																				</Button>
																			</Link>,
																			<Button
																				key='delete'
																				type='link'
																				block
																				onClick={(e) => {
																					e.stopPropagation();
																					this.handleClick(
																						'2',
																						row.id,
																						row.status
																					);
																				}}
																			>
																				Hapus
																			</Button>,
																		]}
																	>
																		<Card.Meta
																			description={
																				<>
																					<Row>
																						<Col>
																							<p>
																								{row.stock === 0 ? (
																									<Tag color='error'>
																										Stok habis
																									</Tag>
																								) : (
																									`Stock ${row.stock}`
																								)}
																							</p>
																							{`Terjual ${row.is_sold}`}
																						</Col>
																						<Col>
																							<p>Kategori</p>
																							{`${
																								row.category !== null
																									? row.category.name
																									: '-'
																							}`}
																						</Col>
																					</Row>
																				</>
																			}
																		/>
																	</Card>
																</Box>
															</Paper>
														))}
												</Col>
											</Row>
										)}
									</>
								)}
							</Paper>
							<Paper elevation={0} className='mt-2'>
								<Row>
									<Col className='d-sm-none d-none d-md-block d-lg-block float-right'>
										<TablePagination
											className='float-right'
											count={totalItems !== undefined ? totalItems : 0}
											page={page}
											onChangePage={this.handleChangePage}
											labelRowsPerPage={i18n.t('show_data_by')}
											rowsPerPageOptions={[5, 10, 20, 100]}
											rowsPerPage={row}
											onChangeRowsPerPage={this.handleChangeRowsPerPage}
										/>
									</Col>
									<Col className='d-sm-block d-md-none d-lg-none py-2 mr-2'>
										<Pagination
											className='float-right'
											count={this.props.totalPages}
											variant='outlined'
											page={page + 1}
											shape='rounded'
											onChange={this.handleChangePagination}
										/>
									</Col>
								</Row>
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
		dataCategory,
		q,
		catId,
		totalItems,
		page,
		row,
		loading,
		status,
		totalPages,
		sort,
	} = state.ProductReducers;
	const { path } = state.PathReducers;
	const { profile } = state.ProfileReducers;

	return {
		path,
		dataProduct,
		dataCategory,
		q,
		catId,
		totalItems,
		page,
		row,
		loading,
		status,
		sort,
		totalPages,
		profile,
	};
};

export default connect(mapStateToProps, {
	getProduct,
	onChangeSort,
	deleteProduct,
	updateProduct,
	getUserProfile,
	getProductCategory,
	onChangeRowProduct,
	onChangePageProduct,
	onChangeStatePathInfo,
	onChangeSearchProduct,
	onChangeCategoryProduct,
})(withTranslation()(Product));
