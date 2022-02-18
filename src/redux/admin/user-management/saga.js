import { all, takeEvery, put, select, call, fork } from 'redux-saga/effects';
import {
	GET_ALL_USER,
	GET_ALL_USER_SUCCESS,
	GET_ALL_USER_FAILED,
	GET_USER_SUCCESS,
	GET_USER_FAILED,
	GET_USER,
} from '../../../constants/actionTypes';

import * as service from '../../../services';
import { HeaderAuth } from '../../../services/header';
// import history from '../../../helpers/history';
import { API } from '../../../constants/ApiAdmin';

import { message } from 'antd';

let getAuthState = (state) => state.AuthReducers;
let getUserManagementState = (state) => state.UserManagementReducers;

function* getUsers() {
	let authState = yield select(getAuthState);
	let userManagementState = yield select(getUserManagementState);
	let urlGetUser = API.getAllUser(
		authState.user.user_id,
		userManagementState.page,
		userManagementState.row,
		userManagementState.q,
		userManagementState.filterDate
	);
	try {
		let _res = yield call(service.GET, urlGetUser, HeaderAuth());

		if (_res.status === 200) {
			yield put({
				type: GET_ALL_USER_SUCCESS,
				value: _res.data,
			});
		} else {
			yield put({
				type: GET_ALL_USER_FAILED,
				value: _res.data,
			});
			message.error('Maaf, Terjadi kesalahan.');
		}
	} catch (error) {
		yield put({
			type: GET_ALL_USER_FAILED,
			value: {
				status: 500,
			},
		});
		message.error('Maaf, terjadi kesalahan');
	}
}

function* getUser(action) {
	let authState = yield select(getAuthState);
	let urlGetUser = API.getUser(authState.user.user_id, action.id);
	try {
		let _res = yield call(service.GET, urlGetUser, HeaderAuth());

		if (_res.status === 200) {
			yield put({
				type: GET_USER_SUCCESS,
				value: _res.data,
			});
		} else {
			yield put({
				type: GET_USER_FAILED,
				value: _res.data,
			});
			message.error('Maaf, Terjadi kesalahan.');
		}
	} catch (error) {
		yield put({
			type: GET_USER_FAILED,
			value: {
				status: 500,
			},
		});
		message.error('Maaf, terjadi kesalahan');
	}
}

export function* watchGetUsers() {
	yield takeEvery(GET_ALL_USER, getUsers);
}

export function* watchGetUser() {
	yield takeEvery(GET_USER, getUser);
}

function* userManagementSaga() {
	yield all([fork(watchGetUsers), fork(watchGetUser)]);
}

export default userManagementSaga;
