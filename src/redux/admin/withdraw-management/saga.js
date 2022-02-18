import { all, takeEvery, put, select, call, fork } from 'redux-saga/effects';
import {
	GET_ALL_WITHDRAW,
	GET_ALL_WITHDRAW_FAILED,
	GET_ALL_WITHDRAW_SUCCESS,
} from '../../../constants/actionTypes';

import * as service from '../../../services';
import { HeaderAuth } from '../../../services/header';
import { API } from '../../../constants/ApiAdmin';

import { message } from 'antd';

let getAuthState = (state) => state.AuthReducers;
let getWithdrawState = (state) => state.WithdrawManagementReducers;
let getPathState = (state) => state.PathReducers;

function* getWithdrawItems() {
	let authState = yield select(getAuthState);
	let pathState = yield select(getPathState);
	let withdrawState = yield select(getWithdrawState);
	let url = API.getAllWithdraw(
		authState.user.user_id,
		pathState.path,
		withdrawState.page,
		withdrawState.row,
		withdrawState.q
	);
	try {
		let _res = yield call(service.GET, url, HeaderAuth());
		if (_res.status === 200) {
			yield put({
				type: GET_ALL_WITHDRAW_SUCCESS,
				value: _res.data,
			});
		} else {
			yield put({
				type: GET_ALL_WITHDRAW_FAILED,
				value: _res.data,
			});
			message.error('Maaf, Terjadi kesalahan.');
		}
	} catch (error) {
		yield put({
			type: GET_ALL_WITHDRAW_FAILED,
			value: {
				status: 500,
			},
		});
		message.error('Maaf, terjadi kesalahan');
	}
}

export function* watchGetWithdrawItems() {
	yield takeEvery(GET_ALL_WITHDRAW, getWithdrawItems);
}

function* withdrawManagementSaga() {
	yield all([fork(watchGetWithdrawItems)]);
}

export default withdrawManagementSaga;
