//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
//  Region Import Redux Action Type and Redux Action

//  Region Import Utility/Helper Function

//  Region Import Components
import TitlePage from '../../../components/TitlePage';
import CardMarketProfile from './components/CardMarketProfile';
import TableMarketProduct from './components/TableMarketProduct';
import {
	getMarketDetail,
	getMarketProducts,
	onChangeRow,
	onChangePage,
} from '../../../redux/actions';

//  Region Import Assets

//  Region Import Style

//  Region Import Constants

class DetailMarket extends Component {
	//  constructor declaration
	constructor(props) {
		super(props);
		this.state = {};
	}

	//  react lifecycle (componentDidMount, componentDidUpdate, etc)
	componentDidMount() {
		this.props.onChangeRow('row', 5);
		this.props.getMarketDetail(this.props.match.params.id);
		this.props.getMarketProducts(this.props.match.params.id);
	}
	//  Function declaration (handle, onchange, etc)
	handleChangePage = (event, nextPage) => {
		this.props.onChangePage('page', nextPage);
		this.props.getMarketProducts(this.props.match.params.id);
	};

	handleChangeRowsPerPage = (event) => {
		this.props.onChangeRow(
			'row',
			parseInt(event.target.value, [5, 10, 25, 50, 100])
		);
		this.props.onChangePage('page', 0);
		this.props.getMarketProducts(this.props.match.params.id);
	};
	handleRefresh = () => {
		this.props.getMarketProducts(this.props.match.params.id);
	};

	render() {
		return (
			<>
				<div>
					<Row>
						<Col lg={12}>
							<TitlePage
								title={
									<Link
										to={`/market-management`}
										style={{
											fontSize: 20,
											fontWeight: 'normal',
											color: '#787A7B',
										}}
									>
										<i className='mdi mdi-arrow-left-bold-circle mr-1'></i>
										Kembali
									</Link>
								}
								breadcrumb={
									<div className='page-title-right'>
										<ol className='breadcrumb m-0'>
											<li className='breadcrumb-item'>
												<a href='/market-management'>Toko</a>
											</li>
											<li className='breadcrumb-item active'>
												{this.props.market.market_name}
											</li>
										</ol>
									</div>
								}
							/>
						</Col>
					</Row>
					<CardMarketProfile
						data={this.props.market}
						loading={this.props.loading}
						address={this.props.address}
					/>
					<TableMarketProduct
						data={this.props.products}
						totalItems={
							this.props.totalItems !== undefined ? this.props.totalItems : 0
						}
						page={this.props.page}
						row={this.props.row}
						handleChangePage={this.handleChangePage}
						handleChangeRowsPerPage={this.handleChangeRowsPerPage}
						onRefresh={this.handleRefresh}
						loading={this.props.loadingTwo}
					/>
				</div>
			</>
		);
	}
}

const mapStateToProps = (state) => {
	const {
		loading,
		market,
		address,
		products,
		totalItems,
		row,
		page,
		loadingTwo,
	} = state.MarketManagementReducers;

	return {
		loading,
		market,
		address,
		products,
		totalItems,
		row,
		page,
		loadingTwo,
	};
};
export default connect(mapStateToProps, {
	getMarketDetail,
	getMarketProducts,
	onChangeRow,
	onChangePage,
})(DetailMarket);
