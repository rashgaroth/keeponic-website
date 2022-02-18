import React, { Component, Suspense } from 'react';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';
import { Layout } from 'antd';
// import FloatingActionButtonSize from './FloatingAction';

const { Footer } = Layout;

// code splitting and lazy loading
// https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52
const Topbar = React.lazy(() => import('./Topbar'));
const Navbar = React.lazy(() => import('./Navbar'));

const loading = () => <div className='text-center'></div>;

class AuthLayout extends Component {
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
		return (
			<>
				<header id='topnav' style={{ zIndex: 999 }}>
					<Suspense fallback={loading()}>
						<Topbar
							rightSidebarToggle={this.toggleRightSidebar}
							menuToggle={this.toggleMenu}
							isMenuOpened={this.state.isMenuOpened}
							{...this.props}
						/>
						<Navbar isMenuOpened={this.state.isMenuOpened} {...this.props} />
					</Suspense>
				</header>
				<Suspense fallback={loading()}>
					<div className='wrapper mb-3'>
						<Container>{children}</Container>
						{/* <FloatingActionButtonSize /> */}
					</div>
					<Footer>
						<div className='container'>
							<div className='row'>
								<div className='col-md-6'>&copy; Keeponic</div>
							</div>
						</div>
					</Footer>
				</Suspense>
			</>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.AuthReducers.user,
	};
};
export default connect(mapStateToProps, null)(AuthLayout);
