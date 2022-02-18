import { Cookies } from 'react-cookie';
import { all, takeEvery, put, select, call, fork } from 'redux-saga/effects';

import {
	GET_USER_PROFILE,
	GET_USER_PROFILE_SUCCESS,
	GET_USER_PROFILE_FAILED,
	UPDATE_PROFILE_ACCOUNT_SUCCESS,
	UPDATE_PROFILE_ACCOUNT_FAILED,
	UPDATE_PROFILE_ACCOUNT,
	UPDATE_PROFILE_MARKET_SUCCESS,
	UPDATE_PROFILE_MARKET_FAILED,
	UPDATE_PROFILE_MARKET,
	UPDATE_PASSWORD,
	UPDATE_PASSWORD_SUCCESS,
	UPDATE_PASSWORD_FAILED,
} from '../../../constants/actionTypes';

import * as service from '../../../services';
import { HeaderAuth } from '../../../services/header';
import { API } from '../../../constants/ApiSeller';
import { message } from 'antd';

let getAuthState = (state) => state.AuthReducers;

const setSessionProfile = (profile) => {
	let cookies = new Cookies();
	if (profile) cookies.set('profile', JSON.stringify(profile), { path: '/' });
	else cookies.remove('profile');
};

function* getProfile() {
	let authState = yield select(getAuthState);
	let url = API.getProfile(authState.user.user_id);

	try {
		let _res = yield call(service.GET, url, HeaderAuth());
		setSessionProfile({
			name: _res.data.data.name,
			address: _res.data.data.address,
			email: _res.data.data.email,
			phone: _res.data.data.phone,
		});
		if (_res.status === 200) {
			yield put({
				type: GET_USER_PROFILE_SUCCESS,
				value: _res.data.data,
			});
			// localStorage.setItem('name', _res.data.data.name);
		} else {
			yield put({
				type: GET_USER_PROFILE_FAILED,
				value: _res.data.data,
			});
		}
	} catch (error) {
		yield put({
			type: GET_USER_PROFILE_FAILED,
			value: error.message,
		});
	}
}

function* updateProfileAccount(action) {
	let authState = yield select(getAuthState);
	let param = JSON.stringify(action.payload);
	let url = API.updateProfileAccount(authState.user.user_id);

	try {
		let _response = yield call(service.PUT, url, param, HeaderAuth());
		if (_response.status === 200) {
			yield put({
				type: UPDATE_PROFILE_ACCOUNT_SUCCESS,
				value: _response,
			});
			message.success({
				content: 'Informasi Akun berhasil diubah.',
			});
			yield* getProfile();
		} else {
			yield put({
				type: UPDATE_PROFILE_ACCOUNT_FAILED,
				value: _response,
			});
			message.error({
				content: 'Informasi Gagal diubah',
			});
			yield* getProfile();
		}
	} catch (error) {
		yield put({
			type: UPDATE_PROFILE_ACCOUNT_FAILED,
			value: error,
		});
	}
}

function* updateProfileMarket(action) {
	let authState = yield select(getAuthState);
	let param = JSON.stringify(action.payload);
	let url = API.updateProfileMarket(authState.user.user_id);

	try {
		let _response = yield call(service.PUT, url, param, HeaderAuth());
		if (_response.status === 200) {
			yield put({
				type: UPDATE_PROFILE_MARKET_SUCCESS,
				value: _response,
			});
			message.success({
				content: 'Informasi Toko berhasil diubah.',
			});
			yield* getProfile();
		} else {
			yield put({
				type: UPDATE_PROFILE_MARKET_FAILED,
				value: _response,
			});
			message.error({
				content: 'Informasi Gagal diubah',
			});
			yield* getProfile();
		}
	} catch (error) {
		yield put({
			type: UPDATE_PROFILE_ACCOUNT_FAILED,
			value: error,
		});
	}
}

function* updatePassword(action) {
	let authState = yield select(getAuthState);
	let param = JSON.stringify(action.payload);
	let url = API.updatePassword(authState.user.user_id);

	try {
		let _response = yield call(service.PUT, url, param, HeaderAuth());
		if (_response.status === 200) {
			yield put({
				type: UPDATE_PASSWORD_SUCCESS,
				value: _response,
			});
			message.success({
				content: 'Password berhasil diubah.',
			});
			yield* getProfile();
		} else {
			yield put({
				type: UPDATE_PASSWORD_FAILED,
				value: _response,
			});
			yield* getProfile();
		}
	} catch (error) {
		yield put({
			type: UPDATE_PASSWORD_FAILED,
			value: error,
		});
	}
}

export function* watchGetProfile() {
	yield takeEvery(GET_USER_PROFILE, getProfile);
}

export function* watchUpdateProfile() {
	yield takeEvery(UPDATE_PROFILE_ACCOUNT, updateProfileAccount);
}

export function* watchUpdateMarketProfile() {
	yield takeEvery(UPDATE_PROFILE_MARKET, updateProfileMarket);
}

export function* watchUpdatePassword() {
	yield takeEvery(UPDATE_PASSWORD, updatePassword);
}

function* profileSaga() {
	yield all([
		fork(watchGetProfile),
		fork(watchUpdateProfile),
		fork(watchUpdatePassword),
		fork(watchUpdateMarketProfile),
	]);
}

export { profileSaga, setSessionProfile };
