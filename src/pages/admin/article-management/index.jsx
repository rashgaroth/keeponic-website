//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

//  Region Import Redux Action Type and Redux Action

//  Region Import Utility/Helper Function
import i18n from '../../../i18n';

//  Region Import Components
import TitlePage from '../../../components/TitlePage';
import TableArticle from './components/TableArticle';

//  Region Import Assets

//  Region Import Style

//  Region Import Constants

class ArticleManagement extends Component {
	//  constructor declaration

	//  react lifecycle (componentDidMount, componentDidUpdate, etc)

	//  Function declaration (handle, onchange, etc)

	//  render
	render() {
		return (
			<>
				{' '}
				<div>
					<Row>
						<Col lg={12}>
							<TitlePage
								title={`${i18n.t('list_article')}`}
								// button={
								// 	<Link to={`${process.env.PUBLIC_URL}/article-management/add`}>
								// 		<Button icon={<Io5.IoAdd />} type='primary'>
								// 			{i18n.t('add_article')}
								// 		</Button>
								// 	</Link>
								// }
							/>
						</Col>
					</Row>

					<Row className='mt-2'>
						<Col lg={12}>
							<TableArticle />
						</Col>
					</Row>
				</div>
			</>
		);
	}
}

// mapStateToProps here if needed

// mapDispatchToProps here if needed

export default connect()(ArticleManagement);
