//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
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
import { Button, Empty, Modal } from 'antd';
import moment from 'moment';
//  Region Import Redux Action Type and Redux Action
import {
	getFaq,
	deleteFaq,
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

class TableCategories extends Component {
	//  constructor declaration
	constructor(props) {
		super(props);
		this.state = {
			id: null,
		};
	}

	//  react lifecycle (componentDidMount, componentDidUpdate, etc)
	componentDidMount() {
		const { getFaq, onChangeRow, onChangePage } = this.props;
		onChangePage('page', 0);
		onChangeRow('row', 5);
		getFaq();
	}
	//  Function declaration (handle, onchange, etc)
	handleChangePage = (event, nextPage) => {
		this.props.onChangePage('page', nextPage);
		this.props.getFaq();
	};

	handleChangeRowsPerPage = (event) => {
		this.props.onChangeRow(
			'row',
			parseInt(event.target.value, [5, 10, 25, 50, 100])
		);
		this.props.onChangePage('page', 0);
		this.props.getFaq();
	};

	handleDelete = (id) => {
		this.handleConfirmDelete(id);
	};

	handleConfirmDelete = (id) => {
		// eslint-disable-next-line array-callback-return
		this.props.faqs.map((row) => {
			if (row.id === id) {
				Modal.confirm({
					title: 'Hapus Item FAQ ini?',
					centered: true,
					content: (
						<>
							<Box className='my-1' display='flex' alignItems='center'>
								<Box>
									<p style={{ fontSize: 13, fontWeight: 500, marginTop: 5 }}>
										{`FAQ: ${row.title}`}
									</p>
								</Box>
							</Box>
						</>
					),
					okText: 'Konfirmasi',
					cancelText: 'Batal',
					onOk: () => {
						this.props.deleteFaq(id);
					},
				});
			}
		});
	};

	render() {
		const { totalItems, row, page, faqs } = this.props;
		return (
			<>
				<Paper className='px-3 py-3' elevation={0}>
					<Link
						to={`${process.env.PUBLIC_URL}/edu`}
						target='_blank'
						rel='noopener noreferrer'
					>
						<i className='mdi mdi-eye mr-1'></i>
						Preview FAQ
					</Link>

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
										{''}
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{faqs.length === 0 ? (
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
									faqs &&
									faqs.map((row) => (
										<TableRow key={row.id}>
											<TableCell>{`${row.title}`}</TableCell>
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
												<Link
													to={`${process.env.PUBLIC_URL}/faq-management/edit/${row.id}`}
												>
													<Button type='link'>{i18n.t('detail')}</Button>
												</Link>
												<Button
													type='link'
													onClick={(e) => {
														e.stopPropagation();
														this.handleDelete(row.id);
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
		faqs,
		q,
		totalItems,
		page,
		row,
		status,
		loading,
	} = state.FaqManagementReducers;

	return {
		faqs,
		q,
		totalItems,
		page,
		row,
		loading,
		status,
	};
};

export default connect(mapStateToProps, {
	getFaq,
	deleteFaq,
	onChangeRow,
	onChangePage,
	onChangeSearch,
})(TableCategories);
