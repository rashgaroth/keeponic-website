//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Carousel, Menu, Card, Affix, Divider } from 'antd';
import { Row, Col } from 'reactstrap';
import moment from 'moment';
//  Region Import Redux Action Type and Redux Action
import { getFaq, getFaqDetail } from '../../redux/actions';
//  Region Import Utility/Helper Function

//  Region Import Components

//  Region Import Assets
import GradIll from '../../assets/images/grad-illustration.svg';
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

class Edu extends Component {
	//  constructor declaration
	constructor(props) {
		super(props);
		this.state = {
			id: '1',
		};
	}
	//  react lifecycle (componentDidMount, componentDidUpdate, etc)
	componentDidMount() {
		const { getFaq, getFaqDetail } = this.props;
		getFaq();
		getFaqDetail(this.state.id);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.faqs !== this.props.faqs) {
			this.setState({
				id: nextProps.faqs[0] !== undefined ? nextProps.faqs[0].id : '',
			});
		}
	}
	componentDidUpdate(prevProps, prevState) {
		if (prevState.id !== this.state.id) {
			this.props.getFaqDetail(this.state.id);
		}
	}
	//  Function declaration (handle, onchange, etc)

	handleClick = (e) => {
		this.setState({
			id: e.key,
		});
		if (this.state.id !== e.key) {
			this.props.getFaqDetail(e.key);
		}
	};

	//  render
	render() {
		const { faqs, faq } = this.props;
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
							<img
								className='illustrationGrad'
								src={GradIll}
								alt='illustration-grad'
							/>
							<h3 style={contentStyle}>Hal yang sering ditanya (FAQ)</h3>
						</div>
					</Carousel>
				</div>
				<Row style={{ marginTop: 200 }}>
					<Col lg={3}>
						<Affix offsetTop={60}>
							<Card>
								{faqs.length === 0 ? (
									<p>Data tidak ada</p>
								) : (
									<Menu
										defaultSelectedKeys={[`${faqs[0].id}`]}
										mode='inline'
										theme='light'
										onClick={this.handleClick}
									>
										{faqs &&
											faqs.map((row) => (
												<>
													<Menu.Item key={row.id}>{row.title}</Menu.Item>
												</>
											))}
									</Menu>
								)}
							</Card>
						</Affix>
					</Col>
					<Col lg={9}>
						<Card className='mb-5'>
							{faq && faq.created_date !== null && (
								<>
									<p style={{ fontWeight: '400' }}>
										{faq.updated_date !== null
											? `Diperbarui ${moment(faq.updated_date).format('LL')}`
											: `Dibuat ${moment(faq.created_date).format('LL')}`}
									</p>
									<Divider dashed />
								</>
							)}
							<div
								dangerouslySetInnerHTML={{
									__html: faq && faq.content !== null && faq.content,
								}}
								style={{
									overflowWrap: 'break-word',
									wordWrap: 'break-word',
									maxWidth: '100%',
									maxHeight: '100%',
									overflow: 'hidden',
								}}
							/>
						</Card>
					</Col>
				</Row>
			</>
		);
	}
}

// mapStateToProps here if needed

const mapStateToProps = (state) => {
	const {
		faqs,
		faq,
		q,
		totalItems,
		page,
		row,
		status,
		loading,
	} = state.FaqManagementReducers;

	return {
		faqs,
		faq,
		q,
		totalItems,
		page,
		row,
		loading,
		status,
	};
};
// mapDispatchToProps here if needed

export default connect(mapStateToProps, { getFaq, getFaqDetail })(Edu);
