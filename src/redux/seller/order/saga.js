import { all, takeEvery, put, select, call, fork } from 'redux-saga/effects';
import {
	GET_ALL_NEW_ORDER,
	GET_ALL_NEW_ORDER_SUCCESS,
	GET_ALL_NEW_ORDER_FAILED,
	GET_DETAIL_ORDER,
	GET_DETAIL_ORDER_SUCCESS,
	GET_DETAIL_ORDER_FAILED,
	UPDATE_ORDER_STATUS_SUCCESS,
	UPDATE_ORDER_STATUS_FAILED,
	UPDATE_ORDER_STATUS,
	GET_SHIPPING_STATUS_SUCCESS,
	GET_SHIPPING_STATUS_FAILED,
	GET_SHIPPING_STATUS,
	GET_ALL_ORDER_RECEIVED_SUCCESS,
	GET_ALL_ORDER_IN_SHIPPING_SUCCESS,
} from '../../../constants/actionTypes';

import * as service from '../../../services';
import { HeaderAuth } from '../../../services/header';
import { API } from '../../../constants/ApiSeller';
import { message } from 'antd';

let getAuthState = (state) => state.AuthReducers;
let getPathState = (state) => state.PathReducers;
let getOrderState = (state) => state.OrderReducers;

function* getOrder() {
	let authState = yield select(getAuthState);
	let pathState = yield select(getPathState);
	let orderState = yield select(getOrderState);
	let url = API.getOrder(
		authState.user.market_id,
		pathState.path,
		orderState.page,
		orderState.row,
		orderState.q
	);
	try {
		let _res = yield call(service.GET, url, HeaderAuth());

		if (_res.status === 200) {
			switch (pathState.path) {
				case 'unpaid':
					yield put({
						type: GET_ALL_NEW_ORDER_SUCCESS,
						value: _res.data,
					});
					break;
				case 'received':
					yield put({
						type: GET_ALL_ORDER_RECEIVED_SUCCESS,
						value: _res.data,
					});
					break;
				case 'in-shipping':
					yield put({
						type: GET_ALL_ORDER_IN_SHIPPING_SUCCESS,
						value: _res.data,
					});
					break;
				default:
					break;
			}
		} else {
			yield put({
				type: GET_ALL_NEW_ORDER_FAILED,
				value: _res.data,
			});
			message.error('Maaf, Terjadi kesalahan.');
		}
	} catch (error) {
		yield put({
			type: GET_ALL_NEW_ORDER_FAILED,
			value: {
				status: 500,
			},
		});
		message.error('Maaf, terjadi kesalahan');
	}
}

function* getOrderDetail(action) {
	let authState = yield select(getAuthState);
	let url = API.getDetailOrder(authState.user.market_id, action.id);
	try {
		let _res = yield call(service.GET, url, HeaderAuth());

		if (_res.status === 200) {
			yield put({
				type: GET_DETAIL_ORDER_SUCCESS,
				value: _res.data,
			});
		} else {
			yield put({
				type: GET_DETAIL_ORDER_FAILED,
				value: _res.data,
			});
			message.error('Maaf, Terjadi kesalahan.');
		}
	} catch (error) {
		yield put({
			type: GET_DETAIL_ORDER_FAILED,
			value: {
				status: 500,
			},
		});
		message.error('Maaf, terjadi kesalahan');
	}
}

function* updateOrderStatus(action) {
	let authState = yield select(getAuthState);
	let param = JSON.stringify(action.payload);
	let url = API.updateOrder(authState.user.market_id, action.id);

	try {
		let _response = yield call(service.PUT, url, param, HeaderAuth());
		if (_response.status === 200) {
			message.success({
				content: 'Status Produk Berhasil Diubah',
			});
			yield put({
				type: UPDATE_ORDER_STATUS_SUCCESS,
				value: _response.data,
			});
			yield* getOrder();
		} else {
			yield put({
				type: UPDATE_ORDER_STATUS_FAILED,
				value: _response.data,
			});
			message.error('Maaf, Terjadi kesalahan.');
		}
	} catch (error) {
		yield put({
			type: UPDATE_ORDER_STATUS_FAILED,
			value: error,
		});
		message.error('Maaf, Terjadi kesalahan.');
	}
}

function* shippingStatus(action) {
	let url = API.trackingOrder(action.shipment_type, action.shipment_code);
	try {
		let _res = yield call(service.GET, url, HeaderAuth());

		if (_res.status === 200) {
			yield put({
				type: GET_SHIPPING_STATUS_SUCCESS,
				value: _res.data,
			});
		} else {
			yield put({
				type: GET_SHIPPING_STATUS_FAILED,
				value: _res.data,
			});
		}
	} catch (error) {
		yield put({
			type: GET_SHIPPING_STATUS_FAILED,
			value: {
				status: 500,
			},
		});
	}
}

export function* watchGetOrder() {
	yield takeEvery(GET_ALL_NEW_ORDER, getOrder);
}

export function* watchGetOrderDetail() {
	yield takeEvery(GET_DETAIL_ORDER, getOrderDetail);
}

export function* watchUpdateOrderStatus() {
	yield takeEvery(UPDATE_ORDER_STATUS, updateOrderStatus);
}

export function* watchGetShippingStatus() {
	yield takeEvery(GET_SHIPPING_STATUS, shippingStatus);
}

function* orderSaga() {
	yield all([
		fork(watchGetOrder),
		fork(watchGetOrderDetail),
		fork(watchUpdateOrderStatus),
		fork(watchGetShippingStatus),
	]);
}

export default orderSaga;
