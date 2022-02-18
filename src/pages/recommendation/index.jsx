//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Carousel, Card } from 'antd';
import { Row } from 'reactstrap';
import moment from 'moment';
//  Region Import Redux Action Type and Redux Action

//  Region Import Utility/Helper Function

//  Region Import Components

//  Region Import Assets

//  Region Import Style

//  Region Import Constants
const contentStyle = {
	maxHeight: '160px',
	color: '#fff',
	lineHeight: '160px',
	textAlign: 'center',
	background: '#61934A',
	borderRadius: '10px',
};

moment.locale();

class Recommendation extends Component {
	//  constructor declaration

	//  react lifecycle (componentDidMount, componentDidUpdate, etc)

	//  Function declaration (handle, onchange, etc)

	//  render
	render() {
		return (
			<>
				<div
					style={{
						marginLeft: '0px',
						marginRight: '0px',
						left: 0,
						right: 0,
						top: 50,
						position: 'absolute',
						background: '#61934A',
						boxShadow: '0px 0px 50px -24px rgba(0,0,0,0.62)',
					}}
				>
					<Carousel>
						<div>
							<h3 style={contentStyle}>Hasil Rekomendasi</h3>
						</div>
					</Carousel>
				</div>
				<Row style={{ marginTop: 200 }}>
					<Card className='mb-5'></Card>
				</Row>
			</>
		);
	}
}

// mapStateToProps here if needed

// mapDispatchToProps here if needed

export default connect()(Recommendation);
