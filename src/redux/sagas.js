import { all } from 'redux-saga/effects';
import { authSaga } from './auth/saga';
import productSaga from './seller/product/saga';
import articleSaga from './seller/article/saga';
import orderSaga from './seller/order/saga';
import WithdrawSaga from './seller/withdraw/saga';

import userManagementSaga from './admin/user-management/saga';
import submissionManagementSaga from './admin/seller-submission/saga';
import marketManagementSaga from './admin/market-management/saga';
import categoriesManagementSaga from './admin/categories-management/saga';
import faqManagementSaga from './admin/faq-management/saga';
import articleManagementSaga from './admin/article-management/saga';
import withdrawManagementSaga from './admin/withdraw-management/saga';
import { profileSaga } from './common/sagas/profile';

export default function* rootSaga(getState) {
	yield all([
		authSaga(),
		/* Seller */
		orderSaga(),
		productSaga(),
		articleSaga(),
		WithdrawSaga(),
		/* Admin */
		faqManagementSaga(),
		userManagementSaga(),
		marketManagementSaga(),
		articleManagementSaga(),
		withdrawManagementSaga(),
		submissionManagementSaga(),
		categoriesManagementSaga(),
		/* Common */
		profileSaga(),
	]);
}
