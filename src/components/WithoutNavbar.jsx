import React, { Component, Suspense } from 'react';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';

import profilePic from '../assets/images/users/user-1.jpg';
import TopbarTwo from './TopbarTwo';

// code splitting and lazy loading
// https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52
const RightSidebar = React.lazy(() => import('./RightSidebar'));

const loading = () => <div className='text-center'></div>;

const RightSidebarContent = (props) => {
	return (
		<div className='user-box'>
			<div className='user-img'>
				<img
					src={profilePic}
					alt='user-img'
					title='Nik Patel'
					className='rounded-circle img-fluid'
				/>
				<a href='/' className='user-edit'>
					<i className='mdi mdi-pencil'></i>
				</a>
			</div>

			<h5>{props.user && <a href='/'>{props.user.username}</a>}</h5>
			<p className='text-muted mb-0'>
				<small>Founder</small>
			</p>
		</div>
	);
};

class WithoutNavbar extends Component {
	constructor(props) {
		super(props);

		this.toggleRightSidebar = this.toggleRightSidebar.bind(this);
		this.toggleMenu = this.toggleMenu.bind(this);
		this.state = {
			isMenuOpened: false,
		};
	}

	signOut(e) {
		e.preventDefault();
		this.props.history.push('/login');
	}

	/**
	 * toggle Menu
	 */
	toggleMenu = (e) => {
		e.preventDefault();
		this.setState({ isMenuOpened: !this.state.isMenuOpened });
	};

	/**
	 * Toggle right side bar
	 */
	toggleRightSidebar = () => {
		document.body.classList.toggle('right-bar-enabled');
	};

	render() {
		// get the child view which we would like to render
		const children = this.props.children || null;
		let location = this.props.match.url;
		let id = this.props.match.params.id;
		let isPrintPage = location === '/order/print/' + id;

		return (
			<div className='app'>
				<header id='topnav' style={{ zIndex: 999 }}>
					<Suspense fallback={loading()}>
						{!isPrintPage && (
							<TopbarTwo
								rightSidebarToggle={this.toggleRightSidebar}
								{...this.props}
							/>
						)}
					</Suspense>
				</header>

				<div className='wrapperTwo'>
					<Container fluid>
						<Suspense fallback={loading()}>{children}</Suspense>
						{/* <FloatingActionButtonSize /> */}
					</Container>
				</div>

				{/* <Footer /> */}
				<RightSidebar title={'Settings'}>
					<RightSidebarContent user={this.props.user} />
				</RightSidebar>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.AuthReducers.user,
	};
};
export default connect(mapStateToProps, null)(WithoutNavbar);
