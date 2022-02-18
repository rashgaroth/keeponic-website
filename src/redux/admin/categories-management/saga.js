import { all, takeEvery, put, select, call, fork } from 'redux-saga/effects';
import {
	GET_CATEGORIES_SUCCESS,
	GET_CATEGORIES_FAILED,
	GET_CATEGORIES,
	UPDATE_CATEGORY_SUCCESS,
	UPDATE_CATEGORY_FAILED,
	UPDATE_CATEGORY,
	ADD_CATEGORY_SUCCESS,
	ADD_CATEGORY_FAILED,
	ADD_CATEGORY,
	DELETE_CATEGORY_SUCCESS,
	DELETE_CATEGORY_FAILED,
	DELETE_CATEGORY,
} from '../../../constants/actionTypes';

import * as service from '../../../services';
import { HeaderAuth } from '../../../services/header';
// import history from '../../../helpers/history';
import { API } from '../../../constants/ApiAdmin';

import { message } from 'antd';

// let getAuthState = (state) => state.AuthReducers;
let getCategoriesManagementState = (state) =>
	state.CategoriesManagementReducers;
let getAuthState = (state) => state.AuthReducers;

function* getCategories() {
	let categoriesManagementState = yield select(getCategoriesManagementState);
	let urlGetMarket = API.getCategories(
		categoriesManagementState.page,
		categoriesManagementState.row,
		categoriesManagementState.q
	);
	try {
		let _res = yield call(service.GET, urlGetMarket, HeaderAuth());

		if (_res.status === 200) {
			yield put({
				type: GET_CATEGORIES_SUCCESS,
				value: _res.data,
			});
		} else {
			yield put({
				type: GET_CATEGORIES_FAILED,
				value: _res.data,
			});
			message.error('Maaf, Terjadi kesalahan.');
		}
	} catch (error) {
		yield put({
			type: GET_CATEGORIES_FAILED,
			value: {
				status: 500,
			},
		});
		message.error('Maaf, terjadi kesalahan');
	}
}

function* createCategory(action) {
	let authState = yield select(getAuthState);
	let param = JSON.stringify(action.payload);
	let url = API.postCategory(authState.user.user_id);

	try {
		let _response = yield call(service.POST, url, param, HeaderAuth());
		if (_response.status === 200) {
			yield put({
				type: ADD_CATEGORY_SUCCESS,
				value: _response.data,
			});
			message.success({
				content: '1 Kategori berhasil ditambahkan.',
				duration: 5,
			});
			yield* getCategories();
		} else {
			yield put({
				type: ADD_CATEGORY_FAILED,
				value: _response,
			});
		}
	} catch (error) {
		yield put({
			type: ADD_CATEGORY_FAILED,
			value: error,
		});
	}
}

function* updateCategory(action) {
	let authState = yield select(getAuthState);
	let param = JSON.stringify(action.payload);
	let url = API.putCategory(authState.user.user_id, action.id);

	try {
		let _response = yield call(service.PUT, url, param, HeaderAuth());
		if (_response.status === 200) {
			yield put({
				type: UPDATE_CATEGORY_SUCCESS,
				value: _response.data,
			});
			message.success({
				content: 'Kategori berhasil diubah.',
			});
			yield* getCategories();
		} else {
			yield put({
				type: UPDATE_CATEGORY_FAILED,
				value: _response.data,
			});
		}
	} catch (error) {
		yield put({
			type: UPDATE_CATEGORY_FAILED,
			value: error,
		});
	}
}

function* deleteCategory(action) {
	let authState = yield select(getAuthState);
	let url = API.putCategory(authState.user.user_id, action.id);

	try {
		let _response = yield call(service.DELETE, url, HeaderAuth());
		if (_response.status === 200) {
			yield put({
				type: DELETE_CATEGORY_SUCCESS,
				value: _response.data,
			});
			message.success({
				content: 'Kategori berhasil dihapus.',
			});
			yield* getCategories();
		} else {
			yield put({
				type: DELETE_CATEGORY_FAILED,
				value: _response.data,
			});
		}
	} catch (error) {
		yield put({
			type: DELETE_CATEGORY_FAILED,
			value: error,
		});
	}
}

export function* watchGetCategories() {
	yield takeEvery(GET_CATEGORIES, getCategories);
}

export function* watchPostCategory() {
	yield takeEvery(ADD_CATEGORY, createCategory);
}

export function* watchUpdateCategory() {
	yield takeEvery(UPDATE_CATEGORY, updateCategory);
}

export function* watchDeleteCategory() {
	yield takeEvery(DELETE_CATEGORY, deleteCategory);
}

function* categoriesManagementSaga() {
	yield all([
		fork(watchGetCategories),
		fork(watchPostCategory),
		fork(watchUpdateCategory),
		fork(watchDeleteCategory),
	]);
}

export default categoriesManagementSaga;
