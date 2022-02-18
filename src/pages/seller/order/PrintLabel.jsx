//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Container, Table } from 'reactstrap';
import ReactToPrint from 'react-to-print';
import {
	Button,
	Grid,
	Paper,
	Divider,
	Box,
	Typography,
} from '@material-ui/core';
import * as Md from 'react-icons/md';
import * as Bi from 'react-icons/bi';

//  Region Import Redux Action Type and Redux Action
import { getDetailOrder } from '../../../redux/actions';

//  Region Import Utility/Helper Function

//  Region Import Components

//  Region Import Assets
import LogoKeeponic from '../../../assets/images/LogoKeeponic';
import { Spin } from 'antd';

//  Region Import Style

//  Region Import Constants

const loading = () => <div>Loading</div>;

class AreaToPrint extends Component {
	render() {
		let loading = this.props.loading;
		let buyer = this.props.order;
		let profile = this.props.profile;

		if (buyer === null) {
			return (
				<Spin>
					<Paper variant='outlined' style={{ width: '100%' }}></Paper>
				</Spin>
			);
		}

		return (
			<Row className='d-flex justify-content-center mt-2'>
				<Col lg={7} md={6} xs={7} className='align-center'>
					<Paper variant='outlined' style={{ width: '100%' }}>
						<Box p={2}>
							<Grid
								container
								direction='row'
								justify='space-between'
								alignItems='center'
								// className="mb-2"
							>
								<LogoKeeponic />
								{/* <h4>TODO: Logo</h4> */}
								<Paper className='px-3' variant='outlined'>
									<h4>Tunai</h4>
								</Paper>
							</Grid>
						</Box>
						<Divider variant='fullWidth' />
						<Spin spinning={loading}>
							<Box paddingX={3} paddingTop={1}>
								<dl className='row px-2'>
									<dd className='mr-1'>Nomor Invoice:</dd>
									<dt style={{ color: '#61934A' }}>{buyer.invoice_id}</dt>
								</dl>
								<Row style={{ marginTop: -10 }}>
									<Col xs={5} sm={5} lg={5}>
										<Grid
											container
											direction='row'
											alignItems='center'
											className='mb-2'
										>
											{/* <dd className='mr-1'>
												<img src={LogoJNE} alt='' srcSet='' />
											</dd> */}
											<dt>
												<h5>JNE</h5>
											</dt>
										</Grid>
									</Col>
									<Col xs={7} sm={7} lg={7}>
										<Row style={{ marginBottom: -10 }}>
											<Col xs={6} sm={6} lg={6} className='text-right'>
												<h5>{`Berat:${' '}`}</h5>
											</Col>
											<Col xs={6} sm={6} lg={6}>
												<h5>{`${
													buyer.t_product_id.weight * buyer.quantity
												} Gram`}</h5>
											</Col>
										</Row>
										<Row>
											<Col xs={6} sm={6} lg={6} className='text-right'>
												<h5>{`Estimasi Ongkir:${' '}`}</h5>
											</Col>
											<Col xs={6} sm={6} lg={6}>
												<h5>
													Rp<span> </span>
													{`${buyer.shipment_price}`}
												</h5>
											</Col>
										</Row>
									</Col>
								</Row>
							</Box>
							<Divider variant='fullWidth' />
							<Box
								paddingLeft={7}
								paddingRight={5}
								paddingTop={1}
								className='mb-3'
							>
								<Row>
									<Col xs={12} sm={12} lg={12}>
										<Row>
											<Col xs={6} sm={6} lg={6}>
												<h4>Penerima</h4>
											</Col>
											<Col xs={6} sm={6} lg={6}>
												<h4>Pengirim</h4>
											</Col>
										</Row>
									</Col>
									<Col xs={12} sm={12} lg={12}>
										<Row>
											<Col xs={6} sm={6} lg={6}>
												<h5>{buyer.buyer_id.name}</h5>
											</Col>
											<Col xs={6} sm={6} lg={6}>
												<h5>{profile.market.market_name}</h5>
											</Col>
										</Row>
									</Col>
									<Col xs={12} sm={12} lg={12}>
										<Row>
											<Col xs={6} sm={6} lg={6}>
												<Typography style={{ width: '90%', fontSize: 13 }}>
													{`${buyer.buyer_address_id.address}, ${buyer.buyer_address_id.subdistrict} ${buyer.buyer_address_id.city} ${buyer.buyer_address_id.postal_code}, ${buyer.buyer_address_id.province}`}
												</Typography>
												<Typography style={{ width: '90%', fontSize: 13 }}>
													{`${buyer.buyer_id.phone}`}
												</Typography>
											</Col>
											<Col xs={6} sm={6} lg={6}>
												<Typography style={{ fontSize: 13 }}>
													{profile.phone}
												</Typography>
											</Col>
										</Row>
									</Col>
								</Row>
								<Row className='my-2'>
									<Paper variant='outlined' className='p-1 text-center'>
										<Box fontStyle='italic' fontWeight={500}>
											Penjual diharapkan membayar Ongkos Kirim ke Kurir, sesuai
											dengan harga ongkir yang tertera
										</Box>
									</Paper>
								</Row>
							</Box>
							<p style={{ fontSize: 9, padding: 0, margin: 0 }}>
								Potong atau lipat bagian ini, untuk menjaga kerahasiaan produk
							</p>
							<div className='dashedSpace linear'></div>
							<Bi.BiCut style={{ marginTop: -15, fontSize: 24 }} />
							<Box paddingLeft={7} paddingRight={5} paddingTop={1}>
								<Row style={{ marginTop: -15 }}>
									<Table
										size='sm'
										borderless
										responsive
										style={{ fontSize: 10, padding: 0 }}
									>
										<thead>
											<tr>
												<th>Produk</th>
												<th>Jumlah</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>{buyer.t_product_id.name}</td>
												<td>{buyer.quantity}</td>
											</tr>
										</tbody>
									</Table>
								</Row>
							</Box>
						</Spin>
					</Paper>
				</Col>
			</Row>
		);
	}
}

class PrintLabel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			order_no: 234889324,
		};
	}

	componentDidMount() {
		this.props.getDetailOrder(this.props.match.params.id);
	}

	render() {
		return (
			<>
				<Suspense fallback={loading()}>
					<Container>
						<Grid
							container
							direction='row'
							justify='space-between'
							alignItems='center'
							className='mb-3'
						>
							<Link
								// to='/order'
								color='success'
								role='button'
								className='hide-on-print'
								style={{ fontSize: 20 }}
							>
								{/* <Md.MdArrowBack /> Kembali */}
							</Link>
							{!this.props.loadingDetail && (
								<ReactToPrint
									trigger={() => (
										<Button
											variant='contained'
											color='primary'
											disableElevation
											startIcon={<Md.MdPrint />}
										>
											Cetak Label
										</Button>
									)}
									content={() => this.componentRef}
									documentTitle={`keeponic-order-label-${this.state.order_no}`}
								/>
							)}
						</Grid>
						<AreaToPrint
							loading={this.props.loadingDetail}
							order={this.props.order}
							profile={this.props.profile}
							ref={(el) => (this.componentRef = el)}
						/>
					</Container>
				</Suspense>
			</>
		);
	}
}

const mapStateToProps = (state) => {
	const { profile } = state.ProfileReducers;
	const { order, loadingDetail } = state.OrderReducers;

	return {
		order,
		profile,
		loadingDetail,
	};
};

export default connect(mapStateToProps, {
	getDetailOrder,
})(PrintLabel);
