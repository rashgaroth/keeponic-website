//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { Button } from 'antd';
import * as Io5 from 'react-icons/io5';

//  Region Import Redux Action Type and Redux Action

//  Region Import Utility/Helper Function
import i18n from '../../../i18n';

//  Region Import Components
import TitlePage from '../../../components/TitlePage';
import TableFaq from './components/TableFaq';

//  Region Import Assets

//  Region Import Style

//  Region Import Constants

class FaqManagement extends Component {
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
								title={`${i18n.t('list_faq')}`}
								button={
									<Link to={`${process.env.PUBLIC_URL}/faq-management/add`}>
										<Button icon={<Io5.IoAdd />} type='primary'>
											{i18n.t('add_faq')}
										</Button>
									</Link>
								}
							/>
						</Col>
					</Row>

					<Row className='mt-2'>
						<Col lg={12}>
							<TableFaq />
						</Col>
					</Row>
				</div>
			</>
		);
	}
}

export default connect()(FaqManagement);
