import { all, takeEvery, put, select, call, fork } from 'redux-saga/effects';
import {
	GET_ALL_MARKET_SUCCESS,
	GET_ALL_MARKET_FAILED,
	GET_ALL_MARKET,
	GET_MARKET_DETAIL_SUCCESS,
	GET_MARKET_DETAIL_FAILED,
	GET_MARKET_DETAIL,
	GET_PRODUCT_MARKET,
	GET_PRODUCT_MARKET_SUCCESS,
	GET_PRODUCT_MARKET_FAILED,
} from '../../../constants/actionTypes';

import * as service from '../../../services';
import { HeaderAuth } from '../../../services/header';
import history from '../../../helpers/history';
import { API } from '../../../constants/ApiAdmin';

import { message } from 'antd';

let getAuthState = (state) => state.AuthReducers;
let getMarketManagementState = (state) => state.MarketManagementReducers;

function* getMarkets() {
	let authState = yield select(getAuthState);
	let marketManagementState = yield select(getMarketManagementState);
	let urlGetMarket = API.getAllMarket(
		authState.user.user_id,
		marketManagementState.page,
		marketManagementState.row,
		marketManagementState.q,
		marketManagementState.filterDate
	);
	try {
		let _res = yield call(service.GET, urlGetMarket, HeaderAuth());

		if (_res.status === 200) {
			yield put({
				type: GET_ALL_MARKET_SUCCESS,
				value: _res.data,
			});
		} else {
			yield put({
				type: GET_ALL_MARKET_FAILED,
				value: _res.data,
			});
			message.error('Maaf, Terjadi kesalahan.');
		}
	} catch (error) {
		yield put({
			type: GET_ALL_MARKET_FAILED,
			value: {
				status: 500,
			},
		});
		message.error('Maaf, terjadi kesalahan');
	}
}

function* getMarketDetail(action) {
	let authState = yield select(getAuthState);
	let urlGetMarket = API.getMarket(authState.user.user_id, action.id);
	try {
		let _res = yield call(service.GET, urlGetMarket, HeaderAuth());

		if (_res.status === 200) {
			yield put({
				type: GET_MARKET_DETAIL_SUCCESS,
				value: _res.data,
			});
		} else {
			message.error('Maaf, Terjadi kesalahan.');
			yield put({
				type: GET_MARKET_DETAIL_FAILED,
				value: _res.data,
			});
			history.goBack();
		}
	} catch (error) {
		message.error('Maaf, terjadi kesalahan');
		yield put({
			type: GET_MARKET_DETAIL_FAILED,
			value: {
				status: 500,
			},
		});
		history.goBack();
	}
}

function* getMarketProducts(action) {
	let authState = yield select(getAuthState);
	let marketManagementState = yield select(getMarketManagementState);
	let urlGetMarketProducts = API.getMarketProducts(
		authState.user.user_id,
		action.id,
		marketManagementState.page,
		marketManagementState.row,
		marketManagementState.q
	);
	try {
		let _res = yield call(service.GET, urlGetMarketProducts, HeaderAuth());
		console.log(_res.data);
		if (_res.status === 200) {
			yield put({
				type: GET_PRODUCT_MARKET_SUCCESS,
				value: _res.data,
			});
		} else {
			yield put({
				type: GET_MARKET_DETAIL_FAILED,
				value: _res.data,
			});
			message.error('Maaf, Terjadi kesalahan.');
		}
	} catch (error) {
		yield put({
			type: GET_PRODUCT_MARKET_FAILED,
			value: {
				status: 500,
			},
		});
		message.error('Maaf, terjadi kesalahan');
	}
}

export function* watchGetMarkets() {
	yield takeEvery(GET_ALL_MARKET, getMarkets);
}

export function* watchGetMarketDetail() {
	yield takeEvery(GET_MARKET_DETAIL, getMarketDetail);
}

export function* watchGetMarketProducts() {
	yield takeEvery(GET_PRODUCT_MARKET, getMarketProducts);
}

function* marketManagementSaga() {
	yield all([
		fork(watchGetMarkets),
		fork(watchGetMarketDetail),
		fork(watchGetMarketProducts),
	]);
}

export default marketManagementSaga;
