import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import {
	onChangeStatePathInfo,
	onChangeRow,
	onChangePage,
	onChangeSearch,
	getAllWithdraw,
} from '../../../redux/actions';

import TitlePage from '../../../components/TitlePage';
import TabMenuWithdraw from './components/TabMenuWithdraw';
import { Paper, TablePagination } from '@material-ui/core';
import WithdrawNew from './components/WithdrawNew';
import WithdrawFinish from './components/WithdrawFinish';
import i18n from '../../../i18n';
import { Button, Input } from 'antd';

const paths = {
	0: {
		path: 'new',
	},
	1: {
		path: 'finish',
	},
};

const slug = {
	new: 0,
	finish: 1,
};

class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			valueIndex: slug['new'],
			pathValue: paths[slug['new']],
			id: null,
			q: '',
		};
	}

	componentDidMount() {
		this.props.onChangeStatePathInfo('path', 'new');
		this.props.onChangeRow('row', 5);
		this.props.onChangePage('page', 0);
	}

	handleOnChange = (event, valueIndex) => {
		switch (valueIndex) {
			case slug['new']:
				if (this.props.path !== 'new') {
					this.setState({ valueIndex: slug['new'], q: '' });
					this.props.onChangeStatePathInfo('path', 'new');
					this.props.onChangeSearch('q', '');
					this.props.onChangeRow('row', 5);
					this.props.onChangePage('page', 0);
				}
				break;
			case slug['finish']:
				if (this.props.path !== 'finish') {
					this.setState({ valueIndex: slug['finish'], q: '' });
					this.props.onChangeStatePathInfo('path', 'finish');
					this.props.onChangeSearch('q', '');
					this.props.onChangeRow('row', 5);
					this.props.onChangePage('page', 0);
				}
				break;
			default:
				break;
		}
	};

	handleChangePage = (e, nextPage) => {
		this.props.onChangePage('page', nextPage);
		this.props.getAllWithdraw();
	};

	handleChangeRowsPerPage = (event) => {
		this.props.onChangeRow(
			'row',
			parseInt(event.target.value, [5, 10, 20, 100])
		);
		this.props.onChangePage('page', 0);
		this.props.getAllWithdraw();
	};

	onChangeSearch = (e) => {
		this.setState({
			q: e.target.value,
		});
	};

	handleSearch = () => {
		if (this.state.q !== this.props.q) {
			this.props.onChangeSearch('q', this.state.q);
			this.props.onChangePage('page', 0);
			this.props.onChangeRow('row', 5);
			this.props.getAllWithdraw();
		}
	};
	handleReset = () => {
		if (this.state.q.length > 0) {
			this.setState({
				q: '',
			});
			this.props.onChangeSearch('q', '');
			this.props.getAllWithdraw();
		}
	};

	render() {
		const { valueIndex, q } = this.state;
		const { path } = this.props;
		console.log(this.props.page);
		return (
			<>
				<TitlePage title='Daftar Pencairan Dana' />
				<Paper elevation={0}>
					<Row className='mt-2'>
						<Col lg={12}>
							<TabMenuWithdraw
								value={valueIndex}
								handleOnChange={this.handleOnChange}
							/>
						</Col>
					</Row>

					<Row className='p-3'>
						<Col lg={4} md={6} xs={12}>
							<Input
								onChange={this.onChangeSearch}
								value={q}
								placeholder='Cari no pencairan'
							/>
						</Col>
						<Col lg={1} md={2} xs={12}>
							<Button type='primary' onClick={this.handleSearch}>
								{i18n.t('search')}
							</Button>
						</Col>
						<Col lg={1} md={2} xs={12}>
							<Button type='secondary' onClick={this.handleReset}>
								Reset
							</Button>
						</Col>
					</Row>
				</Paper>
				<Row className='mt-2'>
					<Col>
						{path === 'new' && (
							<Paper elevation={0} className='px-3 py-3'>
								<WithdrawNew />
							</Paper>
						)}
						{path === 'finish' && (
							<Paper elevation={0} className='px-3 py-3'>
								<WithdrawFinish />
							</Paper>
						)}
					</Col>
				</Row>
				<Paper elevation={0} className='mt-2'>
					<Row>
						<Col className='float-right'>
							<TablePagination
								component='div'
								count={
									this.props.totalItems !== undefined
										? this.props.totalItems
										: 0
								}
								page={this.props.page}
								onChangePage={this.handleChangePage}
								labelRowsPerPage={i18n.t('show_data_by')}
								rowsPerPageOptions={[5, 10, 20, 100]}
								rowsPerPage={this.props.row}
								onChangeRowsPerPage={this.handleChangeRowsPerPage}
							/>
						</Col>
					</Row>
				</Paper>
			</>
		);
	}
}

const mapStateToProps = (state) => {
	const { totalItems, page, row, q } = state.WithdrawManagementReducers;
	const { path } = state.PathReducers;

	return {
		totalItems,
		q,
		page,
		row,
		path,
	};
};

export default connect(mapStateToProps, {
	onChangeStatePathInfo,
	onChangeRow,
	onChangePage,
	onChangeSearch,
	getAllWithdraw,
})(index);
