import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Collapse } from 'reactstrap';
import { MdStoreMallDirectory } from 'react-icons/md';
import { getLoggedInUser } from '../helpers/authUtils';

const NavMenuContent = (props) => {
	const onMenuClickCallback = props.onMenuClickCallback;
	const user = props.isRole;
	const paramId = props.paramId;

	return (
		<>
			<div className='container'>
				<ul className='navigation-menu'>
					<li className='has-submenu'>
						<Link to='/dashboard' className='side-nav-link-ref'>
							<i className='mdi mdi-view-dashboard'></i>
							Dashboard
						</Link>
					</li>

					{user === 'Admin' && (
						<>
							<li className='has-submenu'>
								<Link to='/seller-submission' className='side-nav-link-ref'>
									<i className='mdi mdi-account-edit'></i>
									Pengajuan Seller
								</Link>
							</li>
							<li className='has-submenu'>
								<Link to='/' onClick={onMenuClickCallback}>
									<MdStoreMallDirectory />
									{'  '}
									Master Data
									<div className='ml-1 arrow-down'></div>
								</Link>
								<ul className='submenu'>
									<li>
										<Link to='/user-management' className='side-nav-link-ref'>
											<i className='mdi mdi-account-multiple mr-1'></i>
											Pengguna
										</Link>
									</li>
									<li>
										<Link
											to={
												!paramId
													? `/market-management`
													: `/market-management/market/${paramId}`
											}
											className='side-nav-link-ref'
										>
											<MdStoreMallDirectory className='mr-1' />
											Seller
										</Link>
									</li>
									<li>
										<Link
											to='/article-management'
											className='side-nav-link-ref'
										>
											<i className='mdi mdi-newspaper mr-1'></i>
											Artikel
										</Link>
									</li>
									<li>
										<Link
											to='/categories-management'
											className='side-nav-link-ref'
										>
											<i className='mdi mdi-view-list mr-1'></i>
											Kategori
										</Link>
									</li>
								</ul>
							</li>
							<li className='has-submenu'>
								<Link to='/faq-management' className='side-nav-link-ref'>
									<i className='mdi mdi-message'></i>
									FAQ
								</Link>
							</li>
							<li className='has-submenu'>
								<Link to='/withdraw-management' className='side-nav-link-ref'>
									<i
										style={{ fontSize: 22 }}
										className='mdi mdi-bank-transfer-out mr-1'
									></i>
									Pencairan Dana Seller
								</Link>
							</li>
						</>
					)}
					{user === 'Seller' && (
						<>
							<li className='has-submenu'>
								<Link
									to={`${process.env.PUBLIC_URL}/order`}
									className='side-nav-link-ref'
								>
									<i className='mdi mdi-bank-transfer'></i>
									Pesanan
								</Link>
							</li>
							<li className='has-submenu'>
								<Link
									to={`${process.env.PUBLIC_URL}/product`}
									className='side-nav-link-ref'
								>
									<i className='mdi mdi-pencil'></i>
									Produk
								</Link>
							</li>
							<li className='has-submenu'>
								<Link to='/article' className='side-nav-link-ref'>
									<i className='mdi mdi-newspaper'></i>
									Artikel
								</Link>
							</li>
							{/* <li className='has-submenu'>
								<Link to='/' onClick={onMenuClickCallback}>
									<MdStoreMallDirectory />
									{'  '}
									Toko
									<div className='ml-1 arrow-down'></div>
								</Link>
								<ul className='submenu'>
									<li>
										<Link to='/store/rate' className='side-nav-link-ref'>
											Penilaian Toko{' '}
										</Link>
									</li>
									<li>
										<Link to='/store/profile' className='side-nav-link-ref'>
											Profil Toko
										</Link>
									</li>
								</ul>
							</li> */}
							<li className='has-submenu mt-2 mb-2 mr-2 ml-2 float-right'>
								<Link
									to='/edu'
									color='success'
									className='btn btn-outline-success pt-1 pb-1 pl-2 pr-2'
									target='_blank'
									rel='noopener noreferrer'
									role='button'
								>
									Edukasi Penjual
									<span className='ml-1'>
										<i className='fe-external-link'></i>
									</span>
								</Link>
							</li>
						</>
					)}
				</ul>
			</div>
		</>
	);
};

class Navbar extends Component {
	constructor(props) {
		super(props);

		this.initMenu = this.initMenu.bind(this);
		this.state = {
			user: getLoggedInUser(),
		};
	}

	/**
	 *
	 */
	componentDidMount = () => {
		this.initMenu();
	};

	/**
	 * Init the menu
	 */
	initMenu = () => {
		var links = document.getElementsByClassName('side-nav-link-ref');
		var matchingMenuItem = null;
		for (var i = 0; i < links.length; i++) {
			if (this.props.location.pathname === links[i].pathname) {
				matchingMenuItem = links[i];
				break;
			}
		}

		if (matchingMenuItem) {
			matchingMenuItem.classList.add('active');
			var parent = matchingMenuItem.parentElement;

			/**
			 * TODO: This is hard coded way of expading/activating parent menu dropdown and working till level 3.
			 * We should come up with non hard coded approach
			 */
			if (parent) {
				parent.classList.add('active');
				const parent2 = parent.parentElement;
				if (parent2) {
					parent2.classList.add('in');
				}
				const parent3 = parent2.parentElement;
				if (parent3) {
					parent3.classList.add('active');
					var childAnchor = parent3.querySelector('.has-dropdown');
					if (childAnchor) childAnchor.classList.add('active');
				}

				const parent4 = parent3.parentElement;
				if (parent4) parent4.classList.add('in');
				const parent5 = parent4.parentElement;
				if (parent5) parent5.classList.add('active');
			}
		}
	};

	/**
	 * On menu clicked event
	 * @param {*} event
	 */
	onMenuClick(event) {
		event.preventDefault();
		const nextEl = event.target.nextSibling;
		try {
			if (nextEl && !nextEl.classList.contains('open')) {
				const parentEl = event.target.parentNode;
				if (parentEl) {
					parentEl.classList.remove('open');
				}

				nextEl.classList.add('open');
			} else if (nextEl) {
				nextEl.classList.remove('open');
			}
			return false;
		} catch (error) {
			return false;
		}
	}

	render() {
		const { user } = this.state;
		return (
			<>
				<div className='topbar-menu'>
					<div className='container-fluid'>
						<Collapse isOpen={this.props.isMenuOpened} id='navigation'>
							<NavMenuContent
								onMenuClickCallback={this.onMenuClick}
								isRole={user.isAdmin}
								paramId={this.props.match.params.id}
							/>
							<div className='clearfix'></div>
						</Collapse>
					</div>
				</div>
			</>
		);
	}
}

export default withRouter(connect()(Navbar));
