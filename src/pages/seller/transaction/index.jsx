import React, { Component } from 'react';
import { Row, Col, Container } from 'reactstrap';
import { Link } from 'react-router-dom';

import TitlePage from '../../../components/TitlePage';
import HistoryTransaction from './components/HistoryTransaction';
import CardBalance from './components/CardBalance';
import { onChangeStatePathInfo } from '../../../redux/actions';
import { connect } from 'react-redux';

class index extends Component {
	componentDidMount() {
		this.props.onChangeStatePathInfo('path', 'all');
	}

	render() {
		return (
			<Container>
				<TitlePage
					title={
						<>
							<Link
								to={`/`}
								style={{
									fontSize: 24,
									fontWeight: 'normal',
									color: '#787A7B',
								}}
							>
								<i className='mdi mdi-arrow-left-bold-circle mr-1'></i>
							</Link>
							Informasi Dompet
						</>
					}
				/>

				<Row className='mt-2'>
					<Col lg={4} className='mb-2'>
						<CardBalance />
					</Col>
					<Col lg={8} className='mb-4'>
						<HistoryTransaction />
					</Col>
				</Row>
			</Container>
		);
	}
}

export default connect(null, { onChangeStatePathInfo })(index);
