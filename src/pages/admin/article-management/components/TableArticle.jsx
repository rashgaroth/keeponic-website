//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
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
import { Button, Empty, Image, Modal, Spin, Tag, Typography } from 'antd';
import PerfectScrollbar from 'react-perfect-scrollbar';
import moment from 'moment';
//  Region Import Redux Action Type and Redux Action
import {
	getAllArticle,
	getDetailArticle,
	updateDetailArticle,
	onChangeRow,
	onChangePage,
	onChangeSearch,
} from '../../../../redux/actions';
//  Region Import Utility/Helper Function
import i18n from '../../../../i18n';
import { COLORS } from '../../../../constants/colors';

//  Region Import Components

//  Region Import Assets

//  Region Import Style

//  Region Import Constants

class TableArticle extends Component {
	//  constructor declaration
	constructor(props) {
		super(props);
		this.state = {
			id: null,
			modalDetail: false,
			status: null,
		};
	}

	//  react lifecycle (componentDidMount, componentDidUpdate, etc)
	componentDidMount() {
		const { getAllArticle, onChangeRow, onChangePage } = this.props;
		onChangePage('page', 0);
		onChangeRow('row', 5);
		getAllArticle();
	}
	//  Function declaration (handle, onchange, etc)
	handleChangePage = (event, nextPage) => {
		this.props.onChangePage('page', nextPage);
		this.props.getAllArticle();
	};

	handleChangeRowsPerPage = (event) => {
		this.props.onChangeRow(
			'row',
			parseInt(event.target.value, [1, 5, 10, 25, 50, 100])
		);
		this.props.onChangePage('page', 0);
		this.props.getAllArticle();
	};

	handleModalDetail = (id, status) => {
		this.setState({
			modalDetail: true,
			id: id,
			status: status,
		});
		this.props.getDetailArticle(id);
	};

	handleChangeStatus = (id, status) => {
		let body = {};
		switch (status) {
			case 0:
				body = {
					...body,
					status: 1,
				};
				this.props.updateDetailArticle(body, id, 'UPDATE');
				this.setState({
					modalDetail: false,
				});
				break;
			case 1:
				body = {
					...body,
					status: 0,
				};
				this.props.updateDetailArticle(body, id, 'UPDATE');
				this.setState({
					modalDetail: false,
				});
				break;

			default:
				break;
		}
	};

	handleConfirmDelete = (id) => {
		// eslint-disable-next-line array-callback-return
		this.props.articles.map((row) => {
			if (row.id === id) {
				Modal.confirm({
					title: 'Hapus Artikel ini?',
					centered: true,
					content: (
						<>
							<Box className='my-1' display='flex' alignItems='center'>
								<Box>
									<p style={{ fontSize: 13, fontWeight: 500, marginTop: 5 }}>
										{`Artikel: ${row.title}`}
									</p>
								</Box>
							</Box>
						</>
					),
					okText: 'Konfirmasi',
					cancelText: 'Batal',
					onOk: () => {
						this.props.updateDetailArticle({ status: -1 }, id, 'DELETE');
					},
				});
			}
		});
	};

	render() {
		const { totalItems, row, page, articles } = this.props;
		return (
			<>
				<Paper className='px-3 py-3' elevation={0}>
					<TableContainer className='mt-2'>
						<Table aria-label='simple table' size='small'>
							<TableHead>
								<TableRow>
									<TableCell style={{ backgroundColor: COLORS.LightGray }}>
										{`${i18n.t('title')}`}
									</TableCell>
									<TableCell
										align='justify'
										style={{ backgroundColor: COLORS.LightGray }}
									>
										Penulis
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
										{i18n.t('updated_date')}
									</TableCell>
									<TableCell
										align='justify'
										style={{ backgroundColor: COLORS.LightGray }}
									>
										Status
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
								{articles.length === 0 ? (
									<TableRow>
										<TableCell colSpan='6' style={{ alignContent: 'center' }}>
											<Row
												style={{ justifyContent: 'center' }}
												className='my-4'
											>
												<Empty description={i18n.t('faq_not_found')} />
											</Row>
										</TableCell>
									</TableRow>
								) : (
									articles &&
									articles.map((row) => (
										<TableRow key={row.id}>
											<TableCell>{`${row.title}`}</TableCell>
											<TableCell>{`${row.sec_user_model.email}`}</TableCell>
											<TableCell>
												{`${moment(row.created_date).format(
													'DD-MMMM-YYYY HH:mm'
												)}`}
											</TableCell>
											<TableCell>
												{`${
													row.updated_date !== null
														? moment(row.updated_date).format(
																'DD-MMMM-YYYY HH:mm'
														  )
														: '-'
												}`}
											</TableCell>
											<TableCell>
												<Tag
													color={row.status === 0 ? 'warning' : 'success'}
													style={{ fontWeight: 600 }}
												>
													{row.status === 0 ? 'INACTIVE' : 'ACTIVE'}
												</Tag>
											</TableCell>
											<TableCell>
												<Button
													type='link'
													onClick={(e) => {
														e.stopPropagation();
														this.handleModalDetail(row.id, row.status);
													}}
												>
													Detail
												</Button>
												<Button
													type='link'
													onClick={(e) => {
														e.stopPropagation();
														this.handleConfirmDelete(row.id);
													}}
												>
													{i18n.t('delete')}
												</Button>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</Paper>
				<Paper elevation={0} className='mt-2'>
					<TablePagination
						component='div'
						count={totalItems !== undefined ? totalItems : 0}
						page={page}
						onChangePage={this.handleChangePage}
						labelRowsPerPage={i18n.t('show_data_by')}
						rowsPerPageOptions={[1, 5, 10, 20, 100]}
						rowsPerPage={row}
						onChangeRowsPerPage={this.handleChangeRowsPerPage}
					/>
				</Paper>

				<Modal
					title={this.props.article !== null ? this.props.article.title : null}
					centered
					closable={false}
					visible={this.state.modalDetail}
					width={1000}
					footer={[
						<Button
							loading={this.props.loading}
							key='back'
							onClick={() => {
								this.setState({
									modalDetail: false,
								});
							}}
						>
							Tutup
						</Button>,
						<Button
							loading={this.props.loading}
							key='back'
							type={
								this.props.article !== null && this.props.article.status === 0
									? 'primary'
									: 'danger'
							}
							onClick={(e) => {
								e.stopPropagation();
								this.handleChangeStatus(this.state.id, this.state.status);
							}}
						>
							{this.props.article !== null && this.props.article.status === 0
								? 'Aktifkan'
								: 'Matikan'}
						</Button>,
					]}
				>
					<Spin spinning={this.props.loading}>
						<PerfectScrollbar
							style={{ maxHeight: 600 }}
							onScrollY={(container) =>
								console.log(container.scrollTop < 50 && 'true')
							}
							options={{ suppressScrollX: true, useBothWheelAxes: false }}
						>
							<div style={{ minHeight: 500, maxHeight: 600 }}>
								{this.props.article !== null && (
									<>
										<Row
											className='d-flex justify-content-center mb-1'
											style={{ background: '#EAECED' }}
										>
											<Image height={250} src={this.props.article.image} />
										</Row>
										<Typography.Title level={4}>
											{this.props.article.title}
										</Typography.Title>
										<div
											dangerouslySetInnerHTML={{
												__html: this.props.article.content,
											}}
											style={{
												overflowWrap: 'break-word',
												wordWrap: 'break-word',
												maxWidth: '97%',
												maxHeight: '100%',
												overflow: 'hidden',
											}}
										/>
									</>
								)}
							</div>
						</PerfectScrollbar>
					</Spin>
				</Modal>
			</>
		);
	}
}

const mapStateToProps = (state) => {
	const {
		articles,
		article,
		q,
		totalItems,
		page,
		row,
		status,
		loading,
	} = state.ArticleManagementReducers;

	return {
		articles,
		article,
		q,
		totalItems,
		page,
		row,
		loading,
		status,
	};
};

export default connect(mapStateToProps, {
	getAllArticle,
	getDetailArticle,
	updateDetailArticle,
	onChangeRow,
	onChangePage,
	onChangeSearch,
})(TableArticle);
