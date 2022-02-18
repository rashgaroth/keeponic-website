import React, { lazy } from 'react';
import { Route, Redirect } from 'react-router-dom';
import NotFound from './components/NotFound';

import { isUserAuthenticated, getLoggedInUser } from './helpers/authUtils';
import ProductAdd from './pages/seller/product/ProductAdd';

const Dashboard = lazy(() => import('./pages/Dashboard'));

const Product = lazy(() => import('./pages/seller/product/Product'));
const ProductDetail = lazy(() =>
	import('./pages/seller/product/ProductDetail')
);

const Transaction = lazy(() => import('./pages/seller/transaction'));
const Profile = lazy(() => import('./pages/seller/profile/Profile'));

const Order = lazy(() => import('./pages/seller/order/Order'));
const OrderDetail = lazy(() => import('./pages/seller/order/OrderDetail'));
const PrintLabel = lazy(() => import('./pages/seller/order/PrintLabel'));

const Article = lazy(() => import('./pages/seller/article/Article'));
const ArticleAdd = lazy(() => import('./pages/seller/article/ArticleAdd'));
const ArticleDetail = lazy(() =>
	import('./pages/seller/article/ArticleDetail')
);

// Admin
const WithdrawManagement = lazy(() =>
	import('./pages/admin/withdraw-management')
);
const UserManagement = lazy(() => import('./pages/admin/user-management'));
const MarketManagement = lazy(() => import('./pages/admin/market-management'));
const ArticleManagement = lazy(() =>
	import('./pages/admin/article-management')
);
const DetailMarket = lazy(() =>
	import('./pages/admin/market-management/DetailMarket')
);
const CategoriesManagement = lazy(() =>
	import('./pages/admin/category-management')
);

const FaqManagement = lazy(() => import('./pages/admin/faq-management'));
const FaqAdd = lazy(() => import('./pages/admin/faq-management/FaqAdd'));
const FaqEdit = lazy(() => import('./pages/admin/faq-management/FaqEdit'));

const SellerSubmission = lazy(() => import('./pages/admin/seller-submission'));

// auth
const Login = lazy(() => import('./pages/auth/Login'));
const Logout = lazy(() => import('./pages/auth/Logout'));
const ForgetPassword = lazy(() => import('./pages/account/ForgetPassword'));
const UpdatePassword = lazy(() => import('./pages/account/UpdatePassword'));
const Register = lazy(() => import('./pages/account/Register'));

// Common
const Edu = lazy(() => import('./pages/edu'));
const Recommendation = lazy(() => import('./pages/recommendation'));

const Finish = lazy(() => import('./pages/finish'));
// handle auth and authorization

const PrivateRoute = ({ component: Component, roles, ...rest }) => (
	<Route
		{...rest}
		render={(props) => {
			const isAuthTokenValid = isUserAuthenticated();
			if (!isAuthTokenValid) {
				// not logged in so redirect to login page with the return url
				return (
					<Redirect
						to={{ pathname: '/login', state: { from: props.location } }}
					/>
				);
			}

			const loggedInUser = getLoggedInUser();
			// check if route is restricted by role
			if (roles && roles.indexOf(loggedInUser.isAdmin) === -1) {
				// role not authorised so redirect to home page
				return <Redirect to={{ pathname: '/404' }} />;
			}

			// authorised so return component
			return <Component {...props} />;
		}}
	/>
);

const routes = [
	// auth and account pages
	{ path: '/finish', name: 'Finish', component: Finish, route: Route },
	{ path: '/login', name: 'Login', component: Login, route: Route },
	{ path: '/logout', name: 'Logout', component: Logout, route: Route },
	{
		path: '/forget-password',
		name: 'Forget Password',
		component: ForgetPassword,
		route: Route,
	},
	{
		path: '/confirmation',
		name: 'Update Password',
		component: UpdatePassword,
		route: Route,
	},
	{ path: '/register', name: 'Register', component: Register, route: Route },

	/* Pages */
	{
		path: '/edu',
		name: 'Educational',
		component: Edu,
		route: Route,
		exact: true,
		// roles: ['Admin', 'Seller'],
		title: 'Educational',
		navbar: 'No',
	},

	// Dashboard
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: Dashboard,
		route: PrivateRoute,
		title: 'Dashboard',
	},

	// Order
	{
		path: '/order/:id',
		exact: true,
		name: 'Order',
		component: OrderDetail,
		route: PrivateRoute,
		title: 'Order',
	},
	{
		path: '/order',
		exact: true,
		name: 'Order',
		component: Order,
		roles: ['Seller'],
		route: PrivateRoute,
		title: 'Order',
	},
	{
		path: '/order/print/:id',
		name: 'Print',
		component: PrintLabel,
		route: PrivateRoute,
		roles: ['Seller'],
		title: 'Print',
		navbar: 'No',
	},
	// Product
	{
		path: '/product',
		exact: true,
		name: 'Product',
		component: Product,
		route: PrivateRoute,
		roles: ['Seller'],
		title: 'Product',
	},
	{
		path: '/product/add',
		name: 'Product',
		component: ProductAdd,
		route: PrivateRoute,
		roles: ['Seller'],
		title: 'Product',
		navbar: 'No',
	},
	{
		path: '/product/detail/:id/:slug',
		name: 'Product Detail',
		component: ProductDetail,
		route: PrivateRoute,
		roles: ['Seller'],
		title: 'Product Detail',
		navbar: 'No',
	},
	// Article
	{
		path: '/article',
		name: 'Article',
		exact: true,
		component: Article,
		route: PrivateRoute,
		// roles: ['Supplier'],
		title: 'Article',
	},
	{
		path: '/article/add',
		name: 'Article',
		component: ArticleAdd,
		route: PrivateRoute,
		// roles: ['Supplier'],
		title: 'Article',
		navbar: 'No',
	},
	{
		path: '/article/detail/:id',
		name: 'Article',
		component: ArticleDetail,
		route: PrivateRoute,
		// roles: ['Supplier'],
		title: 'Article',
		navbar: 'No',
	},
	// Setting
	{
		path: '/setting/profile',
		name: 'Setting Profile',
		component: Profile,
		route: PrivateRoute,
		roles: ['Seller'],
		title: 'Setting Profile',
	},

	{
		path: '/transaction',
		name: 'Transaction',
		component: Transaction,
		route: PrivateRoute,
		roles: ['Seller'],
		title: 'Transaction',
		navbar: 'No',
	},

	/* Admin Page */
	{
		path: '/user-management',
		name: 'User Management',
		exact: true,
		component: UserManagement,
		route: PrivateRoute,
		roles: ['Admin'],
		title: 'User Management',
	},
	{
		path: '/market-management',
		name: 'Market Management',
		exact: true,
		component: MarketManagement,
		route: PrivateRoute,
		roles: ['Admin'],
		title: 'Market Management',
	},
	{
		path: '/market-management/market/:id',
		name: 'Detail Market',
		component: DetailMarket,
		route: PrivateRoute,
		roles: ['Admin'],
		title: 'Detail Market',
	},
	{
		path: '/categories-management',
		name: 'Categories',
		component: CategoriesManagement,
		route: PrivateRoute,
		roles: ['Admin'],
		title: 'Categories',
	},
	{
		path: '/faq-management',
		name: 'Faq Management',
		exact: true,
		component: FaqManagement,
		route: PrivateRoute,
		roles: ['Admin'],
		title: 'Faq Management',
	},
	{
		path: '/faq-management/add',
		name: 'Faq Management',
		component: FaqAdd,
		route: PrivateRoute,
		roles: ['Admin'],
		title: 'Faq Management',
		navbar: 'No',
	},
	{
		path: '/faq-management/edit/:id',
		name: 'Faq Management',
		component: FaqEdit,
		route: PrivateRoute,
		roles: ['Admin'],
		title: 'Faq Management',
		navbar: 'No',
	},
	{
		path: '/article-management',
		name: 'Article Management',
		component: ArticleManagement,
		route: PrivateRoute,
		roles: ['Admin'],
		title: 'Article Management',
	},

	{
		path: '/seller-submission',
		name: 'Seller Submission',
		component: SellerSubmission,
		route: PrivateRoute,
		roles: ['Admin'],
		title: 'Seller Submission',
	},
	{
		path: '/recommendation',
		name: 'User Recommendation',
		exact: true,
		component: Recommendation,
		route: PrivateRoute,
		roles: ['Admin'],
		title: 'User Recommendation',
		navbar: 'No',
	},
	{
		path: '/withdraw-management',
		name: 'Withdraw Management',
		exact: true,
		component: WithdrawManagement,
		route: PrivateRoute,
		roles: ['Admin'],
		title: 'Withdraw Management',
	},

	// Others

	{
		path: '/',
		exact: true,
		component: () => <Redirect to='/dashboard' />,
		route: PrivateRoute,
	},

	{ path: '/404', name: 'NotFound', component: NotFound, route: PrivateRoute },
	{
		path: '*',
		component: () => <Redirect to='/404' />,
		route: PrivateRoute,
	},
	{
		path: '*/*',
		component: () => <Redirect to='/404' />,
		route: PrivateRoute,
	},
];

export { routes, PrivateRoute };
