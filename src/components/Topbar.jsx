import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

// import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
// import profilePic from '../assets/images/users/user-1.jpg';

import LogoKeeponic from '../assets/images/LogoKeeponic';
import LogoSm from '../assets/images/LogoSm';
// import store from '../redux/store';
// import { IntlActions } from "react-redux-multilingual";

// import { Radio } from "antd";

import { getLoggedInUser } from '../helpers/authUtils';

// const Notifications = [
// 	{
// 		id: 1,
// 		text: 'Caleb Flakelar commented on Admin',
// 		subText: '1 min ago',
// 		icon: 'mdi mdi-comment-account-outline',
// 		bgColor: 'primary',
// 		isRead: false,
// 	},
// 	{
// 		id: 2,
// 		text: 'New user registered.',
// 		subText: '5 min ago',
// 		icon: 'mdi mdi-account-plus',
// 		bgColor: 'info',
// 		isRead: true,
// 	},
// 	{
// 		id: 3,
// 		text: 'Cristina Pride',
// 		subText: 'Hi, How are you? What about our next meeting',
// 		icon: 'mdi mdi-comment-account-outline',
// 		bgColor: 'success',
// 		isRead: false,
// 	},
// 	{
// 		id: 4,
// 		text: 'Caleb Flakelar commented on Admin',
// 		subText: '2 days ago',
// 		icon: 'mdi mdi-comment-account-outline',
// 		bgColor: 'danger',
// 		isRead: false,
// 	},
// ];

const MenuAdmin = [
	// {
	//   label: 'My Account',
	//   icon: 'fe-user',
	//   redirectTo: "/",
	// },
	// {
	//   label: 'Lock Screen',
	//   icon: 'fe-lock',
	//   redirectTo: "/"
	// },
	{
		label: 'Logout',
		icon: 'fe-log-out',
		redirectTo: `${process.env.PUBLIC_URL + '/logout'}`,
		hasDivider: true,
	},
];

const MenuSeller = [
	// {
	//   label: 'My Account',
	//   icon: 'fe-user',
	//   redirectTo: "/",
	// },
	{
		label: 'Pengaturan',
		icon: 'fe-settings',
		redirectTo: '/setting/profile',
	},
	// {
	//   label: 'Lock Screen',
	//   icon: 'fe-lock',
	//   redirectTo: "/"
	// },
	{
		label: 'Keluar',
		icon: 'fe-log-out',
		redirectTo: `${process.env.PUBLIC_URL + '/logout'}`,
		hasDivider: true,
	},
];

class Topbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: getLoggedInUser(),
			locale: '',
		};
	}

	// changeLocale = e => {
	//   const localeValue = e.target.value;
	//   this.setState({ locale: localeValue });
	//     store.dispatch(IntlActions.setLocale(localeValue));
	//   localStorage.setItem("locale-lang", localeValue);
	//    window.location.reload()
	// };

	render() {
		// const { locale } = this.state
		return (
			<React.Fragment>
				<div className='navbar-custom'>
					<div className='container-fluid'>
						<ul className='list-unstyled topnav-menu float-right mb-0'>
							<li className='dropdown notification-list'>
								<Link
									className={classNames('navbar-toggle', 'nav-link', {
										open: this.props.isMenuOpened,
									})}
									to='#'
									onClick={this.props.menuToggle}
								>
									<div className='lines'>
										<span style={{ backgroundColor: '#fff' }}></span>
										<span style={{ backgroundColor: '#fff' }}></span>
										<span style={{ backgroundColor: '#fff' }}></span>
									</div>
								</Link>
							</li>

							{/* <li style={{ marginTop: 18, marginRight: 20 }}>
                <Radio.Group value={locale} onChange={this.changeLocale}>
                  <Radio.Button key="en" value={'en'}>
                    EN
                  </Radio.Button>
                  <Radio.Button key="id" value={'id'}>
                    ID
                  </Radio.Button>
                </Radio.Group>
              </li> */}

							{/* <li>
								<NotificationDropdown notifications={Notifications} />
							</li> */}

							<li>
								<ProfileDropdown
									profilePic={
										this.props.profile !== null ? this.props.profile.avatar : ''
									}
									menuItems={
										this.props.user && this.props.user.isAdmin === 'Admin'
											? MenuAdmin
											: MenuSeller
									}
									username={
										this.props.profile !== null
											? this.props.profile.name
											: this.props.user.name
										// : this.props.profile.name
									}
								/>
							</li>
						</ul>

						<div className='logo-box'>
							<Link to='/' className='logo text-center'>
								<span className='logo-lg'>
									<LogoKeeponic fill={'#fff'} width={153} height={49} />
								</span>
								<span className='logo-sm'>
									<LogoSm fill={'#fff'} width={37} height={49} />
								</span>
							</Link>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => {
	const { profile } = state.ProfileReducers;
	const { user } = state.AuthReducers;
	return {
		user,
		profile,
	};
};

export default connect(mapStateToProps, {})(Topbar);
