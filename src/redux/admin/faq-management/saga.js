import { all, takeEvery, put, select, call, fork } from 'redux-saga/effects';
import {
	ADD_FAQ,
	ADD_FAQ_FAILED,
	ADD_FAQ_SUCCESS,
	DELETE_FAQ,
	DELETE_FAQ_FAILED,
	DELETE_FAQ_SUCCESS,
	GET_FAQ,
	GET_FAQ_DETAIL,
	GET_FAQ_DETAIL_FAILED,
	GET_FAQ_DETAIL_SUCCESS,
	GET_FAQ_FAILED,
	GET_FAQ_SUCCESS,
	UPDATE_FAQ,
	UPDATE_FAQ_FAILED,
	UPDATE_FAQ_SUCCESS,
} from '../../../constants/actionTypes';

import * as service from '../../../services';
import { HeaderAuth } from '../../../services/header';
import history from '../../../helpers/history';
import { API } from '../../../constants/ApiAdmin';

import { message } from 'antd';

let getAuthState = (state) => state.AuthReducers;
let getFaqState = (state) => state.FaqManagementReducers;

function* createFaq(action) {
	let authState = yield select(getAuthState);
	let param = JSON.stringify(action.payload);
	let url = API.postFaq(authState.user.user_id);

	try {
		let _response = yield call(service.POST, url, param, HeaderAuth());
		if (_response.status === 200) {
			history.replace('/faq-management');
			message.success({
				content: '1 FAQ berhasil ditambahkan.',
				duration: 5,
			});
			yield put({
				type: ADD_FAQ_SUCCESS,
				value: _response.data,
			});
			history.goBack();
		} else {
			yield put({
				type: ADD_FAQ_FAILED,
				value: _response,
			});
		}
	} catch (error) {
		yield put({
			type: ADD_FAQ_FAILED,
			value: error,
		});
	}
}

function* getFaqs() {
	let faqManagementState = yield select(getFaqState);
	let urlGetFaq = API.getFaq(
		faqManagementState.page,
		faqManagementState.row,
		faqManagementState.q
	);
	try {
		let _res = yield call(service.GET, urlGetFaq);
		if (_res.status === 200) {
			yield put({
				type: GET_FAQ_SUCCESS,
				value: _res.data,
			});
		} else {
			yield put({
				type: GET_FAQ_FAILED,
				value: _res.data,
			});
			message.error('Maaf, Terjadi kesalahan.');
		}
	} catch (error) {
		yield put({
			type: GET_FAQ_FAILED,
			value: {
				status: 500,
			},
		});
		message.error('Maaf, terjadi kesalahan');
	}
}

function* getFaq(action) {
	let urlGetFaq = API.getFaqDetail(action.id);
	try {
		let _res = yield call(service.GET, urlGetFaq);

		if (_res.status === 200) {
			yield put({
				type: GET_FAQ_DETAIL_SUCCESS,
				value: _res.data,
			});
		} else {
			yield put({
				type: GET_FAQ_DETAIL_FAILED,
				value: _res.data,
			});
		}
	} catch (error) {
		yield put({
			type: GET_FAQ_DETAIL_FAILED,
			value: {
				status: 500,
			},
		});
	}
}

function* putFaq(action) {
	let authState = yield select(getAuthState);
	let param = JSON.stringify(action.payload);
	let url = API.putFaq(authState.user.user_id, action.id);

	try {
		let _response = yield call(service.PUT, url, param, HeaderAuth());
		if (_response.status === 200) {
			history.replace('/faq-management');
			yield put({
				type: UPDATE_FAQ_SUCCESS,
				value: _response.data,
			});
			message.success({
				content: 'FAQ berhasil diubah.',
			});
			history.goBack();
		} else {
			yield put({
				type: UPDATE_FAQ_FAILED,
				value: _response.data,
			});
		}
	} catch (error) {
		yield put({
			type: UPDATE_FAQ_FAILED,
			value: error,
		});
	}
}

function* deleteFaq(action) {
	let authState = yield select(getAuthState);
	let url = API.deleteFaq(authState.user.user_id, action.id);

	try {
		let _response = yield call(service.DELETE, url, HeaderAuth());
		if (_response.status === 200) {
			yield put({
				type: DELETE_FAQ_SUCCESS,
				value: _response.data,
			});
			message.success({
				content: 'FAQ berhasil dihapus.',
			});
			yield* getFaqs();
		} else {
			yield put({
				type: DELETE_FAQ_FAILED,
				value: _response.data,
			});
		}
	} catch (error) {
		yield put({
			type: DELETE_FAQ_FAILED,
			value: error,
		});
	}
}

export function* watchCreateFaq() {
	yield takeEvery(ADD_FAQ, createFaq);
}

export function* watchGetFaqs() {
	yield takeEvery(GET_FAQ, getFaqs);
}

export function* watchGetFaq() {
	yield takeEvery(GET_FAQ_DETAIL, getFaq);
}

export function* watchPutFaq() {
	yield takeEvery(UPDATE_FAQ, putFaq);
}

export function* watchDeleteFaq() {
	yield takeEvery(DELETE_FAQ, deleteFaq);
}

function* faqManagementSaga() {
	yield all([
		fork(watchGetFaq),
		fork(watchPutFaq),
		fork(watchGetFaqs),
		fork(watchCreateFaq),
		fork(watchDeleteFaq),
	]);
}

export default faqManagementSaga;
