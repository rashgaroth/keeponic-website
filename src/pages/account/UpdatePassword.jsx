import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import qs from 'query-string';

import { Container, Row, Col, Card, CardBody, Alert } from 'reactstrap';

import { Button, Form, Input } from 'antd';

import { onDismiss } from '../../redux/actions';

import { isUserAuthenticated } from '../../helpers/authUtils';
import Loader from '../../components/LoaderTwo';
import LogoKeeponic from '../../assets/images/LogoKeeponic';
import * as service from '../../services';
import { API } from '../../constants/ApiAuth';

class UpdatePassword extends Component {
	_isMounted = false;

	constructor(props) {
		super(props);

		this.handleValidSubmit = this.handleValidSubmit.bind(this);
		this.onDismiss = this.onDismiss.bind(this);
		this.state = {
			passwordResetSuccessful: false,
			isLoading: false,
			tokenValid: true,
			code: null,
			message: '',
		};
	}

	componentDidMount() {
		this._isMounted = true;
		this.checkToken();
		document.body.classList.add('authentication-bg');
	}

	componentWillUnmount() {
		this._isMounted = false;
		document.body.classList.remove('authentication-bg');
	}

	/**
	 * On error dismiss
	 */
	onDismiss() {
		this.setState({
			passwordResetSuccessful: false,
		});
	}

	checkToken = async () => {
		let code = qs.parse(this.props.location.search);
		await service.GET(API.checkTokenPassword(code.code)).then((res) => {
			if (res.status === 401) {
				this.setState({
					tokenValid: false,
				});
			}
			if (res.status === 200) {
				this.setState({
					tokenValid: true,
					code: code.code,
				});
			}
		});
	};

	/**
	 * Handles the submit
	 */
	handleValidSubmit = async (values) => {
		let body = {
			password: values.password,
		};
		await service
			.POST(API.updatePassword(this.state.code), body)
			.then((res) => {
				if (res.status === 200) {
					this.setState({
						passwordResetSuccessful: true,
						message: res.data.message,
					});
					setTimeout(() => {
						this.props.history.push('/login');
					}, 3000);
				}
			});
	};

	/**
	 * Redirect to root
	 */
	renderRedirectToRoot = () => {
		const isAuthTokenValid = isUserAuthenticated();
		if (isAuthTokenValid) {
			return <Redirect to='/' />;
		}
		if (this.state.tokenValid === false) {
			return <Redirect to='/' />;
		}
	};

	render() {
		const isAuthTokenValid = isUserAuthenticated();
		return (
			<React.Fragment>
				{this.renderRedirectToRoot()}

				{(this._isMounted || !isAuthTokenValid) && (
					<React.Fragment>
						{/* <div className="home-btn d-none d-sm-block">
                        <Link to="/"><i className="fas fa-home h2 text-dark"></i></Link>
                    </div> */}

						<div className='account-pages mt-5 mb-5'>
							<Container>
								<Row className='justify-content-center'>
									<Col md={8} lg={6} xl={5}>
										<div className='text-center mb-4'>
											<Link to='/'>
												<LogoKeeponic />
											</Link>
										</div>
										<Card>
											<CardBody className='p-4 position-relative'>
												{/* preloader */}
												{this.props.loading && <Loader />}
												<Alert
													color='success'
													isOpen={this.state.passwordResetSuccessful}
													toggle={this.onDismiss}
												>
													{`${this.state.message} Website akan menuju ke halaman login`}
												</Alert>
												<Form
													name='register'
													layout='vertical'
													onFinish={this.handleValidSubmit}
													scrollToFirstError
												>
													<Form.Item
														name='password'
														label='Password'
														rules={[
															{
																required: true,
																message: 'Input ini tidak boleh kosong.',
															},
															{
																min: 5,
																message: 'Password minimal 5 karakter',
															},
														]}
														hasFeedback
													>
														<Input.Password />
													</Form.Item>

													<Form.Item
														name='confirm'
														label='Konfirmasi Password'
														dependencies={['password']}
														hasFeedback
														rules={[
															{
																required: true,
																message: 'Input ini tidak boleh kosong.',
															},
															({ getFieldValue }) => ({
																validator(_, value) {
																	if (
																		!value ||
																		getFieldValue('password') === value
																	) {
																		return Promise.resolve();
																	}
																	return Promise.reject(
																		new Error(
																			'Password yang dimasukkan tidak sama.'
																		)
																	);
																},
															}),
														]}
													>
														<Input.Password />
													</Form.Item>
													<Form.Item>
														<Button
															type='primary'
															htmlType='submit'
															block
															size='large'
														>
															Simpan Password
														</Button>
													</Form.Item>
												</Form>
											</CardBody>
										</Card>
									</Col>
								</Row>
							</Container>
						</div>
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => {
	const {
		passwordResetStatus,
		passwordResetSuccessful,
		loading,
		error,
		err,
	} = state.AuthReducers;
	return { passwordResetStatus, passwordResetSuccessful, loading, error, err };
};

export default connect(mapStateToProps, { onDismiss })(UpdatePassword);
