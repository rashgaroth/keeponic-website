import { combineReducers } from 'redux';
import AuthReducers from './auth/reducers';

import ProductReducers from './seller/product/reducers';
import ArticleReducers from './seller/article/reducers';
import OrderReducers from './seller/order/reducers';
import WithdrawReducers from './seller/withdraw/reducers';

import UserManagementReducers from './admin/user-management/reducers';
import MarketManagementReducers from './admin/market-management/reducers';
import SubmissionManagementReducers from './admin/seller-submission/reducers';
import CategoriesManagementReducers from './admin/categories-management/reducers';
import FaqManagementReducers from './admin/faq-management/reducers';
import ArticleManagementReducers from './admin/article-management/reducers';
import WithdrawManagementReducers from './admin/withdraw-management/reducers';
import ProfileReducers from './common/reducers/profile';
import PathReducers from './common/reducers/path';

import { RESET_STORE } from '../constants/actionTypes';

const appReducer = combineReducers({
	AuthReducers,
	// Seller
	OrderReducers,
	ProductReducers,
	ArticleReducers,
	WithdrawReducers,
	// Admin
	FaqManagementReducers,
	UserManagementReducers,
	ArticleManagementReducers,
	MarketManagementReducers,
	WithdrawManagementReducers,
	SubmissionManagementReducers,
	CategoriesManagementReducers,
	// Common
	ProfileReducers,
	PathReducers,
});

// reset the state of a redux store
const rootReducer = (state, action) => {
	if (action.type === RESET_STORE) {
		state = undefined;
	}
	return appReducer(state, action);
};

export default rootReducer;
