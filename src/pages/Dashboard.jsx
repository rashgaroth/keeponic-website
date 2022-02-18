import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getLoggedInUser } from '../helpers/authUtils';

// Components Admin
const DashboardAdmin = React.lazy(() => import('./admin/Dashboard'));

// Components User
const DashboardSupplier = React.lazy(() => import('./seller/Dashboard'));

class DefaultDashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: getLoggedInUser(),
		};
	}

	render() {
		const { user } = this.state;
		return (
			<>
				{user.isAdmin === 'Admin' && <DashboardAdmin />}
				{user.isAdmin === 'Seller' && <DashboardSupplier />}
			</>
		);
	}
}

export default connect()(DefaultDashboard);
