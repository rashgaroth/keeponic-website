//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';

//  Region Import Redux Action Type and Redux Action

//  Region Import Utility/Helper Function

//  Region Import Components
import TitlePage from '../../../components/TitlePage';
import TableListSubmission from './components/TableListSubmission';

//  Region Import Assets

//  Region Import Style

//  Region Import Constants

class Example extends Component {
	//  constructor declaration

	//  react lifecycle (componentDidMount, componentDidUpdate, etc)

	//  Function declaration (handle, onchange, etc)

	//  render
	render() {
		return (
			<>
				<div>
					<Row>
						<Col lg={12}>
							<TitlePage title='Daftar Pengajuan Seller' />
						</Col>
					</Row>

					<Row className='mt-2'>
						<Col lg={12}>
							<TableListSubmission />
						</Col>
					</Row>
				</div>
			</>
		);
	}
}

// mapStateToProps here if needed

// mapDispatchToProps here if needed

export default Example;
