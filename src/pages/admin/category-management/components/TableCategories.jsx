//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { Component, createRef } from 'react';
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
import { Button, Empty, Modal, Input, Form } from 'antd';
import * as Io5 from 'react-icons/io5';
import moment from 'moment';
//  Region Import Redux Action Type and Redux Action
import {
	addCategory,
	getCategories,
	deleteCategory,
	updateCategory,
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

class TableFaq extends Component {
	//  constructor declaration
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			modalAddVisible: false,
			id: null,
			category: '',
		};

		this.formChangeCategory = createRef();
	}

	//  react lifecycle (componentDidMount, componentDidUpdate, etc)
	componentDidMount() {
		const { getCategories, onChangeRow, onChangePage } = this.props;
		onChangePage('page', 0);
		onChangeRow('row', 5);
		getCategories();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.category !== this.state.category) {
			this.formChangeCategory.current.setFieldsValue({
				name: this.state.category,
			});
		}
	}

	//  Function declaration (handle, onchange, etc)
	handleChangePage = (event, nextPage) => {
		this.props.onChangePage('page', nextPage);
		this.props.getCategories();
	};

	handleChangeRowsPerPage = (event) => {
		this.props.onChangeRow(
			'row',
			parseInt(event.target.value, [5, 10, 25, 50, 100])
		);
		this.props.onChangePage('page', 0);
		this.props.getCategories();
	};

	handleModalAdd = () => {
		this.setState({
			modalAddVisible: true,
		});
	};

	handleModal = (id, category) => {
		this.setState({
			modalVisible: true,
			category: category,
			id: id,
		});
	};

	handleCancel = () => {
		this.setState({
			modalVisible: false,
			modalAddVisible: false,
		});
	};

	handleFinish = (values) => {
		Modal.confirm({
			title: 'Ubah Kategori?',
			centered: true,
			okText: 'Konfirmasi',
			cancelText: 'Batal',
			onOk: () => {
				this.props.updateCategory(values, this.state.id);
				this.setState({
					modalVisible: false,
					category: '',
					id: '',
				});
			},
		});
	};

	handleFinishAddCategory = (values) => {
		Modal.confirm({
			title: 'Sudah Yakin?',
			centered: true,
			okText: 'Konfirmasi',
			cancelText: 'Batal',
			onOk: () => {
				this.props.addCategory(values);
				this.setState({
					modalAddVisible: false,
				});
			},
		});
	};

	handleConfirmDelete = (id) => {
		// eslint-disable-next-line array-callback-return
		this.props.categories.map((row) => {
			if (row.id === id) {
				Modal.confirm({
					title: 'Hapus Item Kategori ini?',
					centered: true,
					content: (
						<>
							<Box className='my-1' display='flex' alignItems='center'>
								<Box>
									<p style={{ fontSize: 13, fontWeight: 500, marginTop: 5 }}>
										{`Kategori: ${row.name}`}
									</p>
								</Box>
							</Box>
						</>
					),
					okText: 'Konfirmasi',
					cancelText: 'Batal',
					onOk: () => {
						this.props.deleteCategory(id);
					},
				});
			}
		});
	};

	render() {
		const { modalVisible, modalAddVisible } = this.state;
		const { totalItems, row, page, categories } = this.props;
		return (
			<>
				<Button
					type='primary'
					className='mb-2'
					icon={<Io5.IoAdd />}
					onClick={this.handleModalAdd}
				>
					Tambah Kategori
				</Button>

				<Paper className='px-3 py-3' elevation={0}>
					<TableContainer>
						<Table aria-label='simple table' size='small'>
							<TableHead>
								<TableRow>
									<TableCell style={{ backgroundColor: COLORS.LightGray }}>
										{`${i18n.t('category')}`}
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
								{categories.length === 0 ? (
									<TableRow>
										<TableCell colSpan='6' style={{ alignContent: 'center' }}>
											<Row
												style={{ justifyContent: 'center' }}
												className='my-4'
											>
												<Empty description={i18n.t('categories_not_found')} />
											</Row>
										</TableCell>
									</TableRow>
								) : (
									categories &&
									categories.map((row) => (
										<TableRow key={row.id}>
											<TableCell>{`${row.name}`}</TableCell>
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
												<Button
													type='link'
													onClick={(e) => {
														e.stopPropagation();
														this.handleModal(row.id, row.name);
													}}
												>
													{i18n.t('update')}
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
						rowsPerPageOptions={[5, 10, 20, 100]}
						rowsPerPage={row}
						onChangeRowsPerPage={this.handleChangeRowsPerPage}
					/>
				</Paper>

				{/* Modal Add */}
				<Modal
					visible={modalAddVisible}
					footer={null}
					title='Tambah Kategori'
					onCancel={this.handleCancel}
				>
					<Form
						layout='vertical'
						initialValues={{
							name: '',
						}}
						onFinish={this.handleFinishAddCategory}
						scrollToFirstError={true}
						autoComplete='off'
					>
						<Form.Item
							name='name'
							rules={[
								{ required: true, message: 'Kolom tidak boleh kosong.' },
								{
									min: 3,
									message: 'Masukkan minimal 3 karakter.',
								},
							]}
						>
							<Input
								minLength={3}
								maxLength={70}
								placeholder='masukan nama kategori'
							/>
						</Form.Item>
						<Form.Item>
							<Button
								className='mr-2'
								htmlType='button'
								onClick={this.handleCancel}
							>
								Batal
							</Button>
							<Button type='primary' htmlType='submit'>
								Simpan
							</Button>
						</Form.Item>
					</Form>
				</Modal>

				{/* Modal Edit */}
				<Modal
					visible={modalVisible}
					footer={null}
					title='Ubah Kategori'
					onCancel={this.handleCancel}
				>
					<Form
						layout='vertical'
						ref={this.formChangeCategory}
						initialValues={{
							name: this.state.category,
						}}
						onFinish={this.handleFinish}
						scrollToFirstError={true}
						autoComplete='off'
					>
						<Form.Item
							name='name'
							rules={[
								{ required: true, message: 'Kolom tidak boleh kosong.' },
								{
									min: 3,
									message: 'Masukkan minimal 3 karakter.',
								},
							]}
						>
							<Input
								minLength={3}
								maxLength={70}
								placeholder='masukan nama kategori'
							/>
						</Form.Item>
						<Form.Item>
							<Button
								className='mr-2'
								htmlType='button'
								onClick={this.handleCancel}
							>
								Batal
							</Button>
							<Button type='primary' htmlType='submit'>
								Ubah
							</Button>
						</Form.Item>
					</Form>
				</Modal>
			</>
		);
	}
}

const mapStateToProps = (state) => {
	const {
		categories,
		q,
		totalItems,
		page,
		row,
		status,
		loading,
	} = state.CategoriesManagementReducers;

	return {
		categories,
		q,
		totalItems,
		page,
		row,
		loading,
		status,
	};
};

export default connect(mapStateToProps, {
	onChangeRow,
	onChangePage,
	getCategories,
	onChangeSearch,
	updateCategory,
	addCategory,
	deleteCategory,
})(TableFaq);
