import { all, takeEvery, put, select, call, fork } from 'redux-saga/effects';
import {
	GET_ARTICLE,
	GET_ARTICLE_SUCCESS,
	GET_ARTICLE_FAILED,
	ADD_ARTICLE_SUCCESS,
	ADD_ARTICLE_FAILED,
	ADD_ARTICLE,
	DELETE_ARTICLE_SUCCESS,
	DELETE_ARTICLE_FAILED,
	DELETE_ARTICLE,
	GET_ARTICLE_DETAIL,
	GET_ARTICLE_DETAIL_SUCCESS,
	GET_ARTICLE_DETAIL_FAILED,
	UPDATE_ARTICLE_DETAIL_SUCCESS,
	UPDATE_ARTICLE_DETAIL_FAILED,
	UPDATE_ARTICLE_DETAIL,
} from '../../../constants/actionTypes';

import * as service from '../../../services';
import { HeaderAuth } from '../../../services/header';
import history from '../../../helpers/history';
import { API } from '../../../constants/ApiSeller';
import { message } from 'antd';

let getAuthState = (state) => state.AuthReducers;
let getArticleState = (state) => state.ArticleReducers;

function* getArticles() {
	let authState = yield select(getAuthState);
	let articleState = yield select(getArticleState);
	let urlGetArticle = API.getAllArticle(
		authState.user.user_id,
		articleState.page,
		articleState.row,
		articleState.q,
		articleState.isPublished
	);
	try {
		let _res = yield call(service.GET, urlGetArticle, HeaderAuth());

		if (_res.status === 200) {
			yield put({
				type: GET_ARTICLE_SUCCESS,
				value: _res.data,
			});
		} else {
			yield put({
				type: GET_ARTICLE_FAILED,
				value: _res.data,
			});
			message.error('Maaf, Terjadi kesalahan.');
		}
	} catch (error) {
		yield put({
			type: GET_ARTICLE_FAILED,
			value: {
				status: 500,
			},
		});
		message.error('Maaf, terjadi kesalahan');
	}
}

function* createArticle(action) {
	let authState = yield select(getAuthState);
	let param = JSON.stringify(action.payload);
	let url = API.createArticle(authState.user.user_id);

	try {
		let _response = yield call(service.POST, url, param, HeaderAuth());
		if (_response.status === 200) {
			history.replace('/article');
			message.success({
				content: '1 Artikel baru berhasil ditambahkan.',
				duration: 5,
			});
			yield put({
				type: ADD_ARTICLE_SUCCESS,
				value: _response.data,
			});
			history.goBack();
		} else {
			yield put({
				type: ADD_ARTICLE_FAILED,
				value: _response.data,
			});
			message.error('Maaf, Terjadi kesalahan.');
		}
	} catch (error) {
		yield put({
			type: ADD_ARTICLE_FAILED,
			value: error,
		});
		message.error('Maaf, Terjadi kesalahan.');
	}
}

function* deleteArticle(action) {
	let authState = yield select(getAuthState);
	let url = API.deleteArticle(authState.user.user_id, action.id);

	try {
		let _response = yield call(service.DELETE, url, HeaderAuth());
		if (_response.status === 200) {
			message.success({
				content: 'Artikel berhasil dihapus.',
				duration: 5,
			});
			yield put({
				type: DELETE_ARTICLE_SUCCESS,
				value: _response.data,
			});
			yield* getArticles();
		} else {
			yield put({
				type: DELETE_ARTICLE_FAILED,
				value: _response.data,
			});
			message.error('Maaf, Terjadi kesalahan.');
		}
	} catch (error) {
		yield put({
			type: DELETE_ARTICLE_FAILED,
			value: error,
		});
		message.error('Maaf, Terjadi kesalahan.');
	}
}

function* getArticleDetail(action) {
	let authState = yield select(getAuthState);
	let url = API.getDetailArticle(authState.user.user_id, action.id);

	try {
		let _response = yield call(service.GET, url, HeaderAuth());
		if (_response.status === 200) {
			yield put({
				type: GET_ARTICLE_DETAIL_SUCCESS,
				value: _response.data,
			});
		} else {
			yield put({
				type: GET_ARTICLE_DETAIL_FAILED,
				value: _response.data,
			});
			message.error('Maaf, Terjadi kesalahan.');
		}
	} catch (error) {
		yield put({
			type: GET_ARTICLE_DETAIL_FAILED,
			value: error,
		});
		message.error('Maaf, Terjadi kesalahan.');
	}
}

function* editArticleDetail(action) {
	let authState = yield select(getAuthState);
	let param = JSON.stringify(action.payload);
	let url = API.getDetailArticle(authState.user.user_id, action.id);

	try {
		let _response = yield call(service.PUT, url, param, HeaderAuth());
		if (_response.status === 200) {
			history.replace('/article');
			message.success({
				content: 'Artikel berhasil diubah.',
			});
			yield put({
				type: UPDATE_ARTICLE_DETAIL_SUCCESS,
				value: _response.data,
			});
			history.goBack();
		} else {
			yield put({
				type: UPDATE_ARTICLE_DETAIL_FAILED,
				value: _response.data,
			});
			message.error('Maaf, Terjadi kesalahan.');
		}
	} catch (error) {
		yield put({
			type: UPDATE_ARTICLE_DETAIL_FAILED,
			value: error,
		});
		message.error('Maaf, Terjadi kesalahan.');
	}
}

export function* watchGetArticles() {
	yield takeEvery(GET_ARTICLE, getArticles);
}
export function* watchPostArticle() {
	yield takeEvery(ADD_ARTICLE, createArticle);
}
export function* watchDeleteArticle() {
	yield takeEvery(DELETE_ARTICLE, deleteArticle);
}
export function* watchGetArticleDetail() {
	yield takeEvery(GET_ARTICLE_DETAIL, getArticleDetail);
}
export function* watchPutArticleDetail() {
	yield takeEvery(UPDATE_ARTICLE_DETAIL, editArticleDetail);
}

function* articleSaga() {
	yield all([
		fork(watchGetArticles),
		fork(watchPostArticle),
		fork(watchDeleteArticle),
		fork(watchGetArticleDetail),
		fork(watchPutArticleDetail),
	]);
}

export default articleSaga;
