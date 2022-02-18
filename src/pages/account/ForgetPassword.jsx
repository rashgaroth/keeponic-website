import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

import {
	Container,
	Row,
	Col,
	Card,
	CardBody,
	FormGroup,
	Button,
	Alert,
} from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';

import { forgetPassword, onDismiss } from '../../redux/actions';

import { isUserAuthenticated } from '../../helpers/authUtils';
import Loader from '../../components/LoaderTwo';
import LogoKeeponic from '../../assets/images/LogoKeeponic';

class ForgetPassword extends Component {
	_isMounted = false;

	constructor(props) {
		super(props);

		this.handleValidSubmit = this.handleValidSubmit.bind(this);
		this.onDismiss = this.onDismiss.bind(this);
		this.state = {
			passwordResetSuccessful: false,
			isLoading: false,
		};
	}

	componentDidMount() {
		this._isMounted = true;
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
		this.props.onDismiss('passwordResetSuccessful', false);
	}

	/**
	 * Handles the submit
	 */
	handleValidSubmit = (event, values) => {
		this.props.forgetPassword(values.email);
	};

	/**
	 * Redirect to root
	 */
	renderRedirectToRoot = () => {
		const isAuthTokenValid = isUserAuthenticated();
		if (isAuthTokenValid) {
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

												<div className='text-center mb-4'>
													<h4 className='text-uppercase mt-0 mb-3'>
														Reset Password
													</h4>
													<p className='text-muted mb-0 font-13'>
														Masukkan alamat email kamu dan kami akan mengirimkan
														link untuk mengatur ulang password kamu.
													</p>
												</div>

												<Alert
													color='success'
													isOpen={this.props.passwordResetSuccessful}
													toggle={this.onDismiss}
												>
													{this.props.passwordResetStatus}
												</Alert>

												<AvForm onValidSubmit={this.handleValidSubmit}>
													<AvField
														type='email'
														name='email'
														label='Alamat email'
														placeholder='Masukkan email'
														required
														validate={{
															email: {
																value: true,
																errorMessage:
																	'Input yang dimasukkan bukan email',
															},
															required: {
																value: true,
																errorMessage: 'Input ini tidak boleh kosong',
															},
														}}
													/>

													<FormGroup className='mb-0 text-center'>
														<Button color='primary' className='btn-block'>
															Reset Password
														</Button>
													</FormGroup>
												</AvForm>
											</CardBody>
										</Card>
									</Col>
								</Row>

								<Row className='mt-1'>
									<Col className='col-12 text-center'>
										<p className='text-muted'>
											<Link to='/login' className='text-dark ml-1'>
												<b>Masuk</b>
											</Link>
										</p>
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

export default connect(mapStateToProps, { onDismiss, forgetPassword })(
	ForgetPassword
);
