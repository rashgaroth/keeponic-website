import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import ProfileDropdown from './ProfileDropdown';

import LogoKeeponic from '../assets/images/LogoKeeponic';
import LogoSm from '../assets/images/LogoSm';

import { getLoggedInUser, isUserAuthenticated } from '../helpers/authUtils';

// const Notifications = [
// {
//   id: 1,
//   text: 'Caleb Flakelar commented on Admin',
//   subText: '1 min ago',
//   icon: 'mdi mdi-comment-account-outline',
//   bgColor: 'primary'
// },
// ];
const ProfileMenus = [
	// {
	// 	label: 'My Account',
	// 	icon: 'fe-user',
	// 	redirectTo: '/',
	// },
	// {
	// 	label: 'Settings',
	// 	icon: 'fe-settings',
	// 	redirectTo: '/',
	// },
	// {
	// 	label: 'Lock Screen',
	// 	icon: 'fe-lock',
	// 	redirectTo: '/',
	// },
	{
		label: 'Logout',
		icon: 'fe-log-out',
		redirectTo: `${process.env.PUBLIC_URL + '/logout'}`,
		hasDivider: true,
	},
];
const ProfileMenus2 = [
	{
		label: 'Keeponic ',
		icon: 'fe-corner-down-left',
		redirectTo: `${process.env.PUBLIC_URL + '/'}`,
	},
	{
		label: 'Logout',
		icon: 'fe-log-out',
		redirectTo: `${process.env.PUBLIC_URL + '/logout'}`,
		hasDivider: true,
	},
];

class TopbarTwo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: getLoggedInUser(),
			path: '',
			title: '',
			subTitle: '',
		};
	}

	componentDidMount() {
		this.path(
			this.props.match.url,
			this.props.match.params.id,
			this.props.match.params.slug
		);
	}

	path = (url, id, slug) => {
		switch (url) {
			case '/product/add':
				this.setState({
					path: '/product',
					title: 'Produk',
					subTitle: 'Tambah Produk',
				});
				break;
			case '/product/detail/' + id + '/' + slug:
				this.setState({
					path: '/product',
					title: 'Produk',
					subTitle: 'Detil Produk',
				});
				break;
			case '/article/add':
				this.setState({
					path: '/article',
					title: 'Artikel',
					subTitle: 'Tambah Artikel',
				});
				break;
			case '/article/detail/' + id:
				this.setState({
					path: '/article',
					title: 'Artikel',
					subTitle: 'Detil Artikel',
				});
				break;
			case '/faq-management/add':
				this.setState({
					path: '/faq-management',
					title: 'FAQ',
					subTitle: 'Tambah',
				});
				break;
			case '/faq-management/edit/' + id:
				this.setState({
					path: '/faq-management',
					title: 'FAQ',
					subTitle: 'Edit',
				});
				break;
			case '/recommendation':
				this.setState({
					path: '/',
					title: 'Rekomendasi',
					subTitle: 'Hasil',
				});
				break;
			default:
				break;
		}
	};

	render() {
		const isAuthTokenValid = isUserAuthenticated();
		return (
			<React.Fragment>
				{!isAuthTokenValid ? (
					<div className='navbar-custom'>
						<div className='container-fluid'>
							<ul className='list-unstyled topnav-menu float-right mb-0'>
								<li>
									<Link to='/' className='logo text-center'>
										<button className='btn btn-primary nav-link mr-0 text-white'>
											Masuk
										</button>
									</Link>
								</li>
							</ul>
							<div className='logo-box-two'>
								<Link to='/' className='logo text-center'>
									<span className='logo-lg'>
										<LogoKeeponic fill={'#fff'} width={153} height={49} />
									</span>
									<span className='logo-sm'>
										<LogoSm fill={'#fff'} width={37} height={49} />
									</span>
								</Link>
							</div>
							<div className='logo-box d-none d-lg-block d-md-block'>
								<ol
									className='breadcrumb text-center text-white'
									style={{ marginTop: 8, fontSize: 17, cursor: 'pointer' }}
								>
									Edukasi Penjual
								</ol>
							</div>
							{/* <div className='logo-box d-sm-block d-lg-none d-md-none'>
								<ol
									className='breadcrumb text-center text-white'
									style={{ marginTop: 8, fontSize: 14, cursor: 'pointer' }}
								>
									Edukasi Penjual
								</ol>
							</div> */}
						</div>
					</div>
				) : (
					<div className='navbar-custom'>
						<div className='container-fluid'>
							<ul className='list-unstyled topnav-menu float-right mb-0'>
								{/* 
              <li>
                <NotificationDropdown notifications={Notifications} />
              </li> */}

								<li>
									<ProfileDropdown
										profilePic={
											this.props.profile !== null
												? this.props.profile.avatar
												: ''
										}
										menuItems={
											this.props.match.url !== '/edu'
												? ProfileMenus
												: ProfileMenus2
										}
										username={
											!this.props.profile
												? this.state.data.name
												: this.props.profile.name
										}
									/>
								</li>

								{/* <li className="dropdown notification-list">
                <button className="btn btn-link nav-link right-bar-toggle waves-effect waves-light" onClick={this.props.rightSidebarToggle}>
                  <i className="fe-settings noti-icon"></i>
                </button>
              </li> */}
							</ul>

							<div className='logo-box-two'>
								<Link
									to={this.props.match.url === '/edu' ? '#' : '/'}
									className='logo text-center'
								>
									<span className='logo-lg'>
										<LogoKeeponic fill={'#fff'} width={153} height={49} />
									</span>
									<span className='logo-sm'>
										<LogoSm fill={'#fff'} width={37} height={49} />
									</span>
								</Link>
							</div>
							{this.props.match.url !== '/transaction' && (
								<>
									{' '}
									<div className='logo-box d-none d-lg-block d-md-block'>
										{this.props.match.url === '/edu' ? (
											<ol
												className='breadcrumb text-center text-white'
												style={{
													marginTop: 8,
													fontSize: 17,
													cursor: 'pointer',
												}}
											>
												Edukasi Penjual
											</ol>
										) : (
											<ol
												className='breadcrumb text-center '
												style={{ marginTop: 8, fontSize: 17 }}
											>
												<li className='breadcrumb-item'>
													<a
														href={this.state.path}
														style={{ color: '#D8D8D8' }}
													>
														{this.state.title}
													</a>
												</li>
												<li
													className='breadcrumb-item active'
													style={{ color: '#fff' }}
												>
													{this.state.subTitle}
												</li>
											</ol>
										)}
									</div>
									<div className='logo-box d-sm-block d-lg-none d-md-none'>
										{this.props.match.url === '/edu' ? null : (
											<ol
												className='breadcrumb text-center '
												style={{ marginTop: 8, fontSize: 14 }}
											>
												<li className='breadcrumb-item'>
													<a
														href={this.state.path}
														style={{ color: '#D8D8D8' }}
													>
														{this.state.title}
													</a>
												</li>
												<li
													className='breadcrumb-item active'
													style={{ color: '#fff' }}
												>
													{this.state.subTitle}
												</li>
											</ol>
										)}
									</div>
								</>
							)}
						</div>
					</div>
				)}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => {
	const { profile } = state.ProfileReducers;

	return {
		profile,
	};
};

export default connect(mapStateToProps, {})(TopbarTwo);
