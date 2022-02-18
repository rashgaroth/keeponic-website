import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import {
	LOGIN_USER,
	LOGOUT_USER,
	FORGET_PASSWORD,
	RESET_STORE,
	RESET_CAPTCHA,
} from '../../constants/actionTypes';

import {
	loginUserSuccess,
	loginUserFailed,
	forgetPasswordSuccess,
	forgetPasswordFailed,
} from './actions';
import { Cookies } from 'react-cookie';

import { getUserProfile } from '../common/actions';

import { setSession } from '../../helpers/utility';
import * as service from '../../services';
import { API } from '../../constants/ApiAuth';
/**
 * Fetch data from given url
 * @param {*} url
 * @param {*} options
 */

/**
 * Sets the session
 * @param {*} user
 */

/**
 * Login the user
 * @param {*} payload - username and password
 */
function* login({ payload: { email, password } }) {
	const options = {
		body: JSON.stringify({ email, password }),
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + localStorage.getItem('token'),
		},
	};

	try {
		let _response = yield call(service.fetchJSON, API.login, options);
		if (_response.status === 200) {
			setSession({
				user_id: _response.user_id,
				market_id: _response.market_id,
				isAdmin: _response.isAdmin,
				market_name: _response.market_name,
				name: _response.name,
				token: _response.token,
				token_validity: _response.token_validity,
			});
			yield put(
				loginUserSuccess({
					user_id: _response.user_id,
					market_id: _response.market_id,
					isAdmin: _response.isAdmin,
					market_name: _response.market_name,
					avatar: _response.avatar,
				})
			);
			localStorage.setItem('token', _response.token);
			yield put(getUserProfile());
		} else {
			yield put(loginUserFailed(_response.message));
			yield put({
				type: RESET_CAPTCHA,
			});
			setSession(null);
		}
	} catch (error) {
		let message;
		switch (error.status) {
			case 503:
				message = 'Internal Server Error';
				break;
			case 500:
				message = 'Internal Server Error';
				break;
			case 401:
				message = 'Invalid credentials';
				break;
			default:
				message = 'Gagal Login, periksa koneksi internet kamu';
		}
		yield put(loginUserFailed(message));
		yield put({
			type: RESET_CAPTCHA,
		});
		setSession(null);
	}
}

/**
 * Logout the user
 * @param {*} param0
 */
function* logout({ payload: { history } }) {
	try {
		yield call(() => {
			history.push(process.env.PUBLIC_URL + '/login');
		});
		const cookies = new Cookies();
		cookies.remove('profile');
		cookies.remove('user');
		localStorage.clear();
		// window.location.href = process.env.PUBLIC_URL + '/login';
		yield put({
			type: RESET_STORE,
		});

		// localStorage.removeItem('token');
		// localStorage.removeItem('token_validity');
	} catch (error) {
		console.log(error.message);
	}
}

/**
 * forget password
 */
function* forgetPassword({ payload: { email } }) {
	const options = {
		body: JSON.stringify({ email }),
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
	};

	try {
		const response = yield call(service.fetchJSON, API.forgotPassword, options);
		yield put(forgetPasswordSuccess(response.message));
	} catch (error) {
		let message;
		switch (error.status) {
			case 500:
				message = 'Internal Server Error';
				break;
			case 401:
				message = 'Invalid credentials';
				break;
			default:
				message = error;
		}
		yield put(forgetPasswordFailed(message));
	}
}

export function* watchLoginUser() {
	yield takeEvery(LOGIN_USER, login);
}

export function* watchLogoutUser() {
	yield takeEvery(LOGOUT_USER, logout);
}

export function* watchForgetPassword() {
	yield takeEvery(FORGET_PASSWORD, forgetPassword);
}

function* authSaga() {
	yield all([
		fork(watchLoginUser),
		fork(watchLogoutUser),
		fork(watchForgetPassword),
	]);
}

export { authSaga };
