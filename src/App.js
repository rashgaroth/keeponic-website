import React, { Component, Suspense } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import { IntlActions } from 'react-redux-multilingual';

import { routes } from './routes';

import store from './redux/store';
// setup fake backend
import { isUserAuthenticated } from './helpers/authUtils';
import history from './helpers/history';

// Themes
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import 'antd/dist/antd.css';
import './assets/scss/DefaultTheme.scss';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './assets/style.css';
import Loader from './components/Loader';

var lang = localStorage.getItem('locale-lang');

// Lazy loading and code splitting -
// Derieved idea from https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52
const loading = () => <Loader />;

const theme = createMuiTheme({
	typography: {
		fontFamily: ['Poppins', 'sans-serif'].join(','),
	},
});

// All layouts/containers
const NonAuthLayout = Loadable({
	loader: () => import('./components/NonAuthLayout'),
	render(loaded, props) {
		let Component = loaded.default;
		return <Component {...props} />;
	},
	loading,
});

const AuthLayout = Loadable({
	loader: () => import('./components/AuthLayout'),
	render(loaded, props) {
		let Component = loaded.default;
		return <Component {...props} />;
	},
	loading,
});

const AuthLayoutWithoutNavbar = Loadable({
	loader: () => import('./components/WithoutNavbar'),
	render(loaded, props) {
		let Component = loaded.default;
		return <Component {...props} />;
	},
	loading,
});

/**
 * Exports the component with layout wrapped to it
 * @param {} WrappedComponent
 */
const withLayout = (WrappedComponent) => {
	const HOC = class extends Component {
		render() {
			return <WrappedComponent {...this.props} />;
		}
	};

	return connect()(HOC);
};

/**
 * Main app component
 */
class App extends Component {
	/**
	 * Returns the layout component based on different properties
	 * @param {*} props
	 */
	getLayout = () => {
		return isUserAuthenticated() ? AuthLayout : NonAuthLayout;
	};

	render() {
		store.dispatch(IntlActions.setLocale(lang));
		return (
			// rendering the router with layout
			<MuiThemeProvider theme={theme}>
				<Router history={history}>
					<Switch>
						{routes.map((route, index) => {
							return (
								<route.route
									key={index}
									path={route.path}
									exact={route.exact}
									roles={route.roles}
									component={withLayout((props) => {
										const Layout = this.getLayout();
										const LayoutWithoutNavbar = AuthLayoutWithoutNavbar;

										return route.navbar !== 'No' ? (
											<Suspense fallback={loading()}>
												<Layout {...props} title={route.title}>
													<route.component {...props} />
												</Layout>
											</Suspense>
										) : (
											<Suspense fallback={loading()}>
												<LayoutWithoutNavbar {...props} title={route.title}>
													<route.component {...props} />
												</LayoutWithoutNavbar>
											</Suspense>
										);
									})}
								/>
							);
						})}
					</Switch>
				</Router>
			</MuiThemeProvider>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.AuthReducers.isAuthenticated,
	};
};

export default connect(mapStateToProps, null)(App);
