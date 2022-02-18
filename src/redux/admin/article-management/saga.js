import { all, takeEvery, put, select, call, fork } from 'redux-saga/effects';
import {
	GET_DETAIL_ARTICLE_SUCCESS,
	GET_DETAIL_ARTICLE_FAILED,
	GET_DETAIL_ARTICLE,
	GET_ALL_ARTICLE_SUCCESS,
	GET_ALL_ARTICLE_FAILED,
	GET_ALL_ARTICLE,
	UPDATE_DETAIL_ARTICLE_SUCCESS,
	UPDATE_DETAIL_ARTICLE_FAILED,
	UPDATE_DETAIL_ARTICLE,
} from '../../../constants/actionTypes';

import * as service from '../../../services';
import { HeaderAuth } from '../../../services/header';
// import history from '../../../helpers/history';
import { API } from '../../../constants/ApiAdmin';

import { message } from 'antd';

// let getAuthState = (state) => state.AuthReducers;
let getAuthState = (state) => state.AuthReducers;
let getPathState = (state) => state.PathReducers;
let getArticleManagementState = (state) => state.ArticleManagementReducers;

function* getAllArticle() {
	let authState = yield select(getAuthState);
	let pathState = yield select(getPathState);
	let articleManagementState = yield select(getArticleManagementState);

	let urlGetMarket = API.getArticles(
		authState.user.user_id,
		pathState.path,
		articleManagementState.page,
		articleManagementState.row
	);
	try {
		let _res = yield call(service.GET, urlGetMarket, HeaderAuth());

		if (_res.status === 200) {
			yield put({
				type: GET_ALL_ARTICLE_SUCCESS,
				value: _res.data,
			});
		} else {
			yield put({
				type: GET_ALL_ARTICLE_FAILED,
				value: _res.data,
			});
			message.error('Maaf, Terjadi kesalahan.');
		}
	} catch (error) {
		yield put({
			type: GET_ALL_ARTICLE_FAILED,
			value: {
				status: 500,
			},
		});
		message.error('Maaf, terjadi kesalahan');
	}
}

function* getArticleDetail(action) {
	let authState = yield select(getAuthState);
	let url = API.getPutArticle(authState.user.user_id, action.id);

	try {
		let _response = yield call(service.GET, url, HeaderAuth());
		if (_response.status === 200) {
			yield put({
				type: GET_DETAIL_ARTICLE_SUCCESS,
				value: _response.data,
			});
		} else {
			yield put({
				type: GET_DETAIL_ARTICLE_FAILED,
				value: _response.data,
			});
			message.error('Maaf, Terjadi kesalahan.');
		}
	} catch (error) {
		yield put({
			type: GET_DETAIL_ARTICLE_FAILED,
			value: error,
		});
		message.error('Maaf, Terjadi kesalahan.');
	}
}

function* updateStatusArticle(action) {
	let authState = yield select(getAuthState);
	let param = JSON.stringify(action.payload);
	let url = API.getPutArticle(authState.user.user_id, action.id);

	try {
		let _response = yield call(service.PUT, url, param, HeaderAuth());
		if (_response.status === 200) {
			yield put({
				type: UPDATE_DETAIL_ARTICLE_SUCCESS,
				value: _response.data,
			});
			switch (action.key) {
				case 'UPDATE':
					message.success({
						content: 'Status Artikel berhasil diubah.',
					});
					break;
				case 'DELETE':
					message.success({
						content: 'Artikel berhasil dihapus.',
					});
					break;
				default:
					break;
			}
			yield* getAllArticle();
		} else {
			yield put({
				type: UPDATE_DETAIL_ARTICLE_FAILED,
				value: _response.data,
			});
			message.error('Maaf, Terjadi kesalahan.');
		}
	} catch (error) {
		yield put({
			type: UPDATE_DETAIL_ARTICLE_FAILED,
			value: error,
		});
		message.error('Maaf, Terjadi kesalahan.');
	}
}

export function* watchGetAllArticle() {
	yield takeEvery(GET_ALL_ARTICLE, getAllArticle);
}

export function* watchGetArticleDetail() {
	yield takeEvery(GET_DETAIL_ARTICLE, getArticleDetail);
}

export function* watchUpdateStatusArticle() {
	yield takeEvery(UPDATE_DETAIL_ARTICLE, updateStatusArticle);
}

function* articleManagementSaga() {
	yield all([
		fork(watchGetAllArticle),
		fork(watchGetArticleDetail),
		fork(watchUpdateStatusArticle),
	]);
}

export default articleManagementSaga;
