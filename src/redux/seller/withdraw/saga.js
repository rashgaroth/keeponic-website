import { all, takeEvery, put, select, call, fork } from 'redux-saga/effects';
import {
	GET_WITHDRAW_HISTORY,
	GET_WITHDRAW_HISTORY_SUCCESS,
	GET_WITHDRAW_HISTORY_FAILED,
} from '../../../constants/actionTypes';

import * as service from '../../../services';
import { HeaderAuth } from '../../../services/header';

import { API } from '../../../constants/ApiSeller';
import { message } from 'antd';

let getAuthState = (state) => state.AuthReducers;
let getPathState = (state) => state.PathReducers;
let getWithdrawState = (state) => state.WithdrawReducers;

function* getWithdrawHistory() {
	let authState = yield select(getAuthState);
	let pathState = yield select(getPathState);
	let withdrawState = yield select(getWithdrawState);
	let url = API.withdrawHistory(
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
				type: GET_WITHDRAW_HISTORY_SUCCESS,
				value: _res.data,
			});
		} else {
			yield put({
				type: GET_WITHDRAW_HISTORY_FAILED,
				value: _res.data,
			});
			message.error('Maaf, Terjadi kesalahan.');
		}
	} catch (error) {
		yield put({
			type: GET_WITHDRAW_HISTORY_FAILED,
			value: {
				status: 500,
			},
		});
		message.error('Maaf, terjadi kesalahan');
	}
}

export function* watchGetHistoryWithdraw() {
	yield takeEvery(GET_WITHDRAW_HISTORY, getWithdrawHistory);
}

function* WithdrawSaga() {
	yield all([fork(watchGetHistoryWithdraw)]);
}

export default WithdrawSaga;
