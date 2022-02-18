import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import { getLoggedInUser } from '../../helpers/authUtils';
import Statistics from './Statistics';

class DefaultDashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: getLoggedInUser(),
		};
	}

	render() {
		// console.log(user.role);
		return (
			<>
				<div className='mb-4'>
					<Row>
						<Col lg={12}>
							<div className='page-title-box'>
								<h4 className='page-title'>Dashboard</h4>
							</div>
						</Col>
					</Row>
					<Statistics />
				</div>
			</>
		);
	}
}

export default connect()(DefaultDashboard);
