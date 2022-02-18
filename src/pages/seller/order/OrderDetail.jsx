//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardBody } from 'reactstrap';

//  Region Import Redux Action Type and Redux Action

//  Region Import Utility/Helper Function
import { getLoggedInUser } from '../../../helpers/authUtils';

//  Region Import Components
import Loader from '../../../components/Loader';

//  Region Import Assets

//  Region Import Style

//  Region Import Constants

class DetailTransaction extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: getLoggedInUser(),
		};
	}

	render() {
		const { user } = this.state;
		// console.log(user.role);
		return (
			<>
				<div className=''>
					{/* preloader */}
					{this.props.loading && <Loader />}

					<Row>
						<Col lg={12}>
							<div className='page-title-box'>
								<div className='page-title-right'>
									<ol className='breadcrumb m-0'>
										<li className='breadcrumb-item'>
											<a href='/'>Keeponic</a>
										</li>
										<li className='breadcrumb-item active'>Detail</li>
									</ol>
								</div>
								<h4 className='page-title'>Detail Transaksi</h4>
							</div>
						</Col>
					</Row>

					<Row>
						<Col lg={12}>
							<Card>
								<CardBody>
									Hello {user.isAdmin === 1 ? 'Admin' : 'Seller'}
								</CardBody>
							</Card>
						</Col>
					</Row>
				</div>
			</>
		);
	}
}

export default connect()(DetailTransaction);
