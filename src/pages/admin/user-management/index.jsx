//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

//  Region Import Redux Action Type and Redux Action

//  Region Import Utility/Helper Function
import i18n from '../../../i18n';

//  Region Import Components
import TitlePage from '../../../components/TitlePage';
import TableListUser from './components/TableListUser';

//  Region Import Assets

//  Region Import Style

//  Region Import Constants

class UserManagement extends Component {
	//  constructor declaration
	constructor(props) {
		super(props);
		this.state = {};
	}

	//  react lifecycle (componentDidMount, componentDidUpdate, etc)

	//  Function declaration (handle, onchange, etc)

	render() {
		return (
			<>
				<div>
					<Row>
						<Col lg={12}>
							<TitlePage
								title={`${i18n.t('list_user')}`}
								breadcrumb={
									<div className='page-title-right'>
										<ol className='breadcrumb m-0'>
											<li className='breadcrumb-item'>Master Data</li>
											<li className='breadcrumb-item active'>Pengguna</li>
										</ol>
									</div>
								}
							/>
						</Col>
					</Row>

					<Row className='mt-2'>
						<Col lg={12}>
							<TableListUser />
						</Col>
					</Row>
				</div>
			</>
		);
	}
}

export default connect()(UserManagement);
