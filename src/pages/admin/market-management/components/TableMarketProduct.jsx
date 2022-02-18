//  Region Import External Lib (e.g React, Reactstrap, etc)
import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { Button, Empty, Tooltip, Tag, Card, Spin, Typography } from 'antd';
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
} from '@material-ui/core';

import * as Ai from 'react-icons/ai';

//  Region Import Redux Action Type and Redux Action

//  Region Import Utility/Helper Function
import i18n from '../../../../i18n';
import { isLongText, idrCurrency } from '../../../../helpers/utility';
//  Region Import Components

//  Region Import Assets
import ILNoImage from '../../../../assets/images/no_image.png';
//  Region Import Style

//  Region Import Constants
import { COLORS } from '../../../../constants/colors';
import { STATUS } from '../../../../constants/status.enum';

function TableMarketProduct(props) {
	let data = props.data;
	let page = props.page;
	let totalItems = props.totalItems;
	let row = props.row;
	let handleChangePage = props.handleChangePage;
	let handleChangeRowsPerPage = props.handleChangeRowsPerPage;
	let onRefresh = props.onRefresh;
	let loading = props.loading;
	return (
		<>
			<Typography.Title className='mt-3' level={4}>
				<span>
					{' '}
					List Produk{' '}
					<Button type='primary' shape='round' onClick={onRefresh}>
						Refresh
					</Button>
				</span>
			</Typography.Title>
			<Row className='mt-2'>
				<Col lg={12}>
					<Card bordered={false}>
						<Typography.Text
							style={{ fontSize: 14 }}
						>{`Total ${totalItems} Produk`}</Typography.Text>
						<TableContainer className='mt-2'>
							<Table aria-label='simple table' size='small'>
								<TableHead>
									<TableRow>
										<TableCell style={{ backgroundColor: COLORS.LightGray }}>
											{''}
										</TableCell>
										<TableCell style={{ backgroundColor: COLORS.LightGray }}>
											{`${i18n.t('name')}`}
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
								<TableBody>
									{loading ? (
										<TableRow>
											<TableCell colSpan='6' style={{ alignContent: 'center' }}>
												<Row
													style={{ justifyContent: 'center' }}
													className='my-4'
												>
													<Spin></Spin>
												</Row>
											</TableCell>
										</TableRow>
									) : data.length === 0 ? (
										<TableRow>
											<TableCell colSpan='6' style={{ alignContent: 'center' }}>
												<Row
													style={{ justifyContent: 'center' }}
													className='my-4'
												>
													<Empty description={i18n.t('product_not_found')} />
												</Row>
											</TableCell>
										</TableRow>
									) : (
										data &&
										data.map((row) => (
											<TableRow key={row.id}>
												<TableCell scope='row' style={{ width: '10%' }}>
													<img
														src={row.avatar !== '' ? row.avatar : ILNoImage}
														className='responsive'
														width='50'
														height='50'
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
															<Tooltip mouseEnterDelay={0.2} title={row.name}>
																<Typography.Text className='text-secondary'>{`${isLongText(
																	row.name,
																	35
																)}`}</Typography.Text>
															</Tooltip>
														}
														secondary={
															row.status === STATUS.DEACTIVE ? (
																<>
																	<br />
																	<Tag
																		icon={<Ai.AiFillLock className='mr-1' />}
																		color='#FFA82F'
																	>
																		{i18n.t('archived')}
																	</Tag>
																</>
															) : null
														}
													/>
												</TableCell>
												<TableCell style={{ width: '20%' }}>
													{row.category !== null ? row.category.name : '-'}
												</TableCell>
												<TableCell
													align='justify'
													style={{ width: '15%' }}
												>{`Rp ${idrCurrency(row.price)}`}</TableCell>
												<TableCell align='justify'>
													{row.stock === 0 ? (
														<Tag color='error'>Stok habis</Tag>
													) : (
														row.stock
													)}
												</TableCell>
												<TableCell align='justify'>
													<Link to={`#`}>
														<Button type='link' block>
															Review
														</Button>
													</Link>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</TableContainer>
					</Card>
					<Paper elevation={0} className='mt-2'>
						<TablePagination
							component='div'
							count={totalItems !== undefined ? totalItems : 0}
							page={page}
							onChangePage={handleChangePage}
							labelRowsPerPage={i18n.t('show_data_by')}
							rowsPerPageOptions={[5, 10, 20, 100]}
							rowsPerPage={row}
							onChangeRowsPerPage={handleChangeRowsPerPage}
						/>
					</Paper>
				</Col>
			</Row>
		</>
	);
}

// mapStateToProps here if needed

// mapDispatchToProps here if needed

export default TableMarketProduct;
