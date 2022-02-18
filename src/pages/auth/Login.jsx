//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import {
	Container,
	Row,
	Col,
	Card,
	CardBody,
	Label,
	FormGroup,
	Button,
} from 'reactstrap';
import {
	AvForm,
	AvField,
	AvGroup,
	AvInput,
	AvFeedback,
} from 'availity-reactstrap-validation';
import { Alert } from 'antd';
import { withTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
// import Recaptcha from 'react-recaptcha';

//  Region Import Redux Action Type and Redux Action
import { loginUser } from '../../redux/actions';

//  Region Import Utility/Helper Function
import { isUserAuthenticated } from '../../helpers/authUtils';

//  Region Import Components
import LoaderTwo from '../../components/LoaderTwo';

//  Region Import Assets
import LogoKeeponic from '../../assets/images/LogoKeeponic';
import Illustration from '../../assets/images/login-illustration.png';

// let recaptchaInstance;

class Login extends Component {
	_isMounted = false;
	//  constructor declaration
	constructor(props) {
		super(props);

		this.handleValidSubmit = this.handleValidSubmit.bind(this);
		this.state = {
			email: '',
			password: '',
			isVerified: null,
			token: '',
		};
	}
	//  react lifecycle (componentDidMount, componentDidUpdate, etc)
	componentDidMount() {
		this._isMounted = true;
		document.body.classList.add('login');
	}

	componentWillUnmount() {
		this._isMounted = false;
		document.body.classList.remove('authentication-bg');
		document.body.classList.remove('login');
	}

	//  onHandleFunction and onChangeFunction declaration

	// changeLanguage(lang) {
	//     store.dispatch(IntlActions.setLocale(lang));
	//     localStorage.setItem("locale-lang", lang);
	// }

	// reCaptchaLoaded = (res) => {
	// 	console.log(res);
	// };

	// verifyCallback = async (res) => {
	// 	console.log(res);
	// 	this.setState({
	// 		token: res,
	// 		isVerified: true,
	// 	});
	// };

	// resetRecaptcha = () => {
	// 	recaptchaInstance.reset();
	// };

	/**
	 * Handles the submit
	 */
	// handleValidSubmit = async (event, values) => {
	// 	const secret = '6LepZrkaAAAAAAGCf1c8u27cXV7OgGa067ZDnrkb';
	// 	const proxyurl = 'https://cors-anywhere.herokuapp.com/';
	// 	let url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${this.state.token}`;
	// 	await fetch(proxyurl + url, {
	// 		method: 'POST',
	// 		mode: 'cors',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			'Access-Control-Allow-Origin': '*',
	// 		},
	// 	})
	// 		.then((res) => res.json())
	// 		.then((data) => {
	// 			if (data.success) {
	// 				this.props.loginUser(
	// 					values.email,
	// 					values.password,
	// 					this.props.history
	// 				);
	// 			} else {
	// 				this.resetRecaptcha();
	// 				this.setState({
	// 					isVerified: false,
	// 					token: '',
	// 				});
	// 			}
	// 		});
	// };

	handleValidSubmit = async (event, values) => {
		this.props.loginUser(values.email, values.password, this.props.history);
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
			<>
				{this.renderRedirectToRoot()}

				{(this._isMounted || !isAuthTokenValid) && (
					<>
						<div
							className='account-pages'
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								minHeight: '100vh',
							}}
						>
							<Container>
								<Row className='justify-content-center'>
									<Col
										className='d-md-none d-sm-none d-none d-lg-none d-xl-block'
										lg={12}
										xl={12}
									/>
								</Row>
								<Row className='justify-content-center'>
									<Col
										className='d-md-none d-sm-none d-none d-lg-block'
										lg={4}
										xl={4}
									>
										<div className='text-center'>
											<Link to='/'>
												<span>
													<LogoKeeponic />
													Seller
												</span>
											</Link>
										</div>
										<img src={Illustration} alt='' srcSet='' />
									</Col>
									<Col
										lg={3}
										xl={3}
										className='d-md-none d-sm-none d-none d-lg-block'
									/>
									<Col md={8} lg={5} xl={5}>
										<div className='text-center'>
											<div className='d-md-none d-sm-block d-lg-none mt-3'>
												<Link to='/'>
													<span>
														<LogoKeeponic />
														Seller
													</span>
												</Link>
											</div>
											<p
												className='text-muted mt-2 mb-2'
												style={{ fontSize: 18 }}
											>
												Ingin menjadi Penjual? daftar sebagai Penjual di{' '}
												<a
													href='https://drive.google.com/drive/folders/1cSyxWhVx6aqUeO96qGuYv-hekSflvyUV?usp=sharing/'
													target='_blank'
													rel='noopener noreferrer'
													style={{ fontWeight: 500 }}
												>
													Aplikasi Mobile
												</a>{' '}
												Kami.
											</p>
										</div>
										<Card
											className='p-3 bg-white rounded'
											style={{ border: 'none', boxShadow: 'none' }}
										>
											<CardBody className='p-4 position-relative'>
												{this.props.loading && <LoaderTwo />}
												<div className='mb-3'>
													<Typography variant='h5' style={{ fontWeight: 600 }}>
														Masuk
													</Typography>
												</div>
												{this.props.error && (
													<Alert
														className='mb-2'
														type='error'
														showIcon
														message={this.props.error}
													/>
												)}
												{/* {this.props.err && this.resetRecaptcha()} */}
												<AvForm
													onValidSubmit={this.handleValidSubmit}
													data-testid='form-login'
												>
													<AvField
														type='email'
														name='email'
														id='email'
														label='Email'
														placeholder='Enter your email'
														value={this.state.email}
														required
														data-testid='email'
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

													<AvGroup className='mb-3'>
														<Label for='password'>Password</Label>
														<AvInput
															type='password'
															name='password'
															id='password'
															placeholder='Enter your password'
															value={this.state.password}
															required
															data-testid='password'
														/>
														<AvFeedback>
															Input ini tidak boleh kosong
														</AvFeedback>
													</AvGroup>
													{/* <FormGroup>
														<div style={{ width: 10 }}>
															<Recaptcha
																ref={(e) => (recaptchaInstance = e)}
																sitekey='6LepZrkaAAAAAOFk4xkw6wr1LVYj5fitDPDV1dOo'
																render='explicit'
																onloadCallback={this.reCaptchaLoaded}
																verifyCallback={this.verifyCallback}
															/>
														</div>
														{this.state.isVerified === false && (
															<Alert
																className='mt-2'
																message='Verifikasi jika kamu bukan robot.'
																type='error'
																showIcon
															/>
														)}
													</FormGroup> */}
													<FormGroup>
														<Button color='primary' className='btn-block'>
															Masuk
														</Button>
													</FormGroup>
												</AvForm>
												<div className='text-center mt-3'>
													<p>
														<Link
															to='/forget-password'
															className='text-muted ml-1'
														>
															<i className='fa fa-lock mr-1'></i>Lupa Password
															Akun Seller?
														</Link>
													</p>

													{/* <p>
														For development purpose if can't log in visit{' '}
														<a
															href='https://cors-anywhere.herokuapp.com/'
															target='_blank'
															rel='noopener noreferrer'
														>
															Cors Anywhere
														</a>{' '}
														Click the button and back log in again.
													</p> */}
												</div>
											</CardBody>
										</Card>
									</Col>
								</Row>
							</Container>
						</div>
					</>
				)}
			</>
		);
	}
}

// mapStateToProps here if needed
const mapStateToProps = (state) => {
	const { user, loading, error, err } = state.AuthReducers;
	return { user, loading, error, err };
};

export default connect(mapStateToProps, { loginUser })(
	withTranslation()(Login)
);
