import { all, takeEvery, put, select, call, fork } from 'redux-saga/effects';
import {
	GET_PRODUCT,
	GET_PRODUCT_SUCCESS,
	GET_PRODUCT_FAILED,
	ADD_PRODUCT_SUCCESS,
	ADD_PRODUCT_FAILED,
	ADD_PRODUCT,
	GET_PRODUCT_DETAIL,
	GET_PRODUCT_DETAIL_FAILED,
	UPDATE_PRODUCT_DETAIL_FAILED,
	UPDATE_PRODUCT_DETAIL,
	DELETE_PRODUCT_SUCCESS,
	DELETE_PRODUCT_FAILED,
	DELETE_PRODUCT,
	GET_PRODUCT_CATEGORY,
	GET_PRODUCT_CATEGORY_SUCCESS,
	GET_PRODUCT_CATEGORY_FAILED,
	GET_PRODUCT_ALL_CATEGORIES,
	GET_PRODUCT_ALL_CATEGORIES_SUCCESS,
	GET_PRODUCT_ALL_CATEGORIES_FAILED,
} from '../../../constants/actionTypes';

import * as service from '../../../services';
import { HeaderAuth } from '../../../services/header';
import history from '../../../helpers/history';
import { API } from '../../../constants/ApiSeller';
import { slugify } from '../../../helpers/utility';

import { message } from 'antd';
import { getProductDetailSuccess, updateProductDetailSuccess } from './actions';

let getAuthState = (state) => state.AuthReducers;
let getProductState = (state) => state.ProductReducers;
let getPathState = (state) => state.PathReducers;

function* getProduct() {
	let authState = yield select(getAuthState);
	let pathState = yield select(getPathState);
	let productState = yield select(getProductState);

	let urlGetProduct = API.getAllProduct(
		pathState.path,
		authState.user.market_id,
		productState.page,
		productState.row,
		productState.q,
		productState.catId,
		productState.sort
	);
	try {
		let _res = yield call(service.GET, urlGetProduct, HeaderAuth());
		if (_res.status === 200) {
			_res.data.data.product.map((obj) => {
				obj.slug = slugify(obj.name);
				return obj;
			});
			yield put({
				type: GET_PRODUCT_SUCCESS,
				value: _res.data.data,
			});
		} else {
			yield put({
				type: GET_PRODUCT_FAILED,
				value: _res.data.data,
			});
			message.error('Maaf, Terjadi kesalahan.');
		}
	} catch (error) {
		yield put({
			type: GET_PRODUCT_FAILED,
			value: {
				status: 500,
			},
		});
		message.error('Maaf, terjadi kesalahan');
	}
}

function* getProductCategory() {
	let authState = yield select(getAuthState);

	let urlGetCategory = API.getCategoryProduct(authState.user.market_id);

	try {
		let _res = yield call(service.GET, urlGetCategory, HeaderAuth());
		if (_res.status === 200) {
			yield put({
				type: GET_PRODUCT_CATEGORY_SUCCESS,
				value: _res.data,
			});
		} else {
			yield put({
				type: GET_PRODUCT_CATEGORY_FAILED,
				value: _res.data.data,
			});
		}
	} catch (error) {
		yield put({
			type: GET_PRODUCT_CATEGORY_FAILED,
			value: {
				status: 500,
			},
		});
	}
}

function* getProductAllCategories() {
	let urlGetCategories = API.getCategories;

	try {
		let _res = yield call(service.GET, urlGetCategories, HeaderAuth());
		if (_res.status === 200) {
			yield put({
				type: GET_PRODUCT_ALL_CATEGORIES_SUCCESS,
				value: _res.data,
			});
		} else {
			yield put({
				type: GET_PRODUCT_ALL_CATEGORIES_FAILED,
				value: _res.data.data,
			});
		}
	} catch (error) {
		yield put({
			type: GET_PRODUCT_CATEGORY_FAILED,
			value: {
				status: 500,
			},
		});
	}
}

function* createProduct(action) {
	let authState = yield select(getAuthState);
	let param = JSON.stringify(action.payload);
	let url = API.createProduct(authState.user.market_id);

	try {
		let _response = yield call(service.POST, url, param, HeaderAuth());
		if (_response.status === 200) {
			history.replace('/product');
			message.success({
				content: '1 Produk baru berhasil ditambahkan.',
				duration: 5,
			});
			yield put({
				type: ADD_PRODUCT_SUCCESS,
				value: _response.data,
			});
			history.goBack();
		} else {
			yield put({
				type: ADD_PRODUCT_FAILED,
				value: _response,
			});
		}
	} catch (error) {
		yield put({
			type: ADD_PRODUCT_FAILED,
			value: error,
		});
	}
}

function* getDetailProduct(action) {
	let authState = yield select(getAuthState);
	let pathState = yield select(getPathState);
	let url = API.getDetailProduct(authState.user.market_id, action.id);
	try {
		let _response = yield call(service.GET, url, HeaderAuth());
		_response.data.data.slug = slugify(_response.data.data.name);
		let slug = _response.data.data.slug;
		if (_response.status === 200 && slug === pathState.path) {
			yield put(getProductDetailSuccess(_response.data));
		} else {
			message.error({
				content: 'Produk tidak ada',
			});
			yield put({
				type: GET_PRODUCT_DETAIL_FAILED,
			});
		}
	} catch (error) {
		yield put({
			type: GET_PRODUCT_DETAIL_FAILED,
			value: error,
		});
	}
}

function* updateProduct(action) {
	let authState = yield select(getAuthState);
	let param = JSON.stringify(action.payload);
	let url = API.updateDetailProduct(authState.user.market_id, action.id);

	try {
		let _response = yield call(service.PUT, url, param, HeaderAuth());
		if (_response.status === 200) {
			yield put(updateProductDetailSuccess(_response.data));
			switch (action.key) {
				case 'NORMAL_UPDATE':
					history.replace('/product');
					yield call(() => {
						message.success({
							content: 'Produk berhasil diubah.',
						});
						history.goBack();
					});
					break;
				case 'UPDATE_TO_ARCHIVE':
					history.replace('/product');
					yield call(() => {
						message.success({
							content: 'Produk berhasil diarsipkan.',
						});
						history.goBack();
					});
					break;
				case 'UPDATE_TO_SHOW':
					history.replace('/product');
					yield call(() => {
						message.success({
							content: 'Produk berhasil ditampilkan.',
						});
						history.goBack();
					});
					break;
				case 'UPDATE_TO_SHOW_ON_TABLE':
					message.success({
						content: 'Produk berhasil ditampilkan.',
					});
					yield* getProduct();
					break;
				case 'UPDATE_TO_ARCHIVE_ON_TABLE':
					message.success({
						content: 'Produk berhasil diarsipkan.',
					});
					yield* getProduct();
					break;
				default:
					break;
			}
		} else {
			yield put({
				type: UPDATE_PRODUCT_DETAIL_FAILED,
				value: _response,
			});
		}
	} catch (error) {
		yield put({
			type: UPDATE_PRODUCT_DETAIL_FAILED,
			value: error,
		});
	}
}

function* deleteProduct(action) {
	let authState = yield select(getAuthState);
	let url = API.deleteProduct(authState.user.market_id, action.id);

	try {
		let _response = yield call(service.DELETE, url, HeaderAuth());
		if (_response.status === 200) {
			message.success({
				content: 'Produk berhasil dihapus.',
			});
			yield put({
				type: DELETE_PRODUCT_SUCCESS,
				value: _response.data,
			});

			yield* getProduct();
		} else {
			yield put({
				type: DELETE_PRODUCT_FAILED,
				value: _response.data,
			});
		}
	} catch (error) {
		yield put({
			type: DELETE_PRODUCT_FAILED,
			value: error.message,
		});
	}
}

export function* watchGetProduct() {
	yield takeEvery(GET_PRODUCT, getProduct);
}

export function* watchGetProductCategory() {
	yield takeEvery(GET_PRODUCT_CATEGORY, getProductCategory);
}

export function* watchGetProductAllCategories() {
	yield takeEvery(GET_PRODUCT_ALL_CATEGORIES, getProductAllCategories);
}

export function* watchCreateProduct() {
	yield takeEvery(ADD_PRODUCT, createProduct);
}

export function* watchGetProductDetail() {
	yield takeEvery(GET_PRODUCT_DETAIL, getDetailProduct);
}

export function* watchUpdateProductDetail() {
	yield takeEvery(UPDATE_PRODUCT_DETAIL, updateProduct);
}

export function* watchDeleteProduct() {
	yield takeEvery(DELETE_PRODUCT, deleteProduct);
}

function* productSaga() {
	yield all([
		fork(watchGetProduct),
		fork(watchGetProductCategory),
		fork(watchDeleteProduct),
		fork(watchCreateProduct),
		fork(watchGetProductAllCategories),
		fork(watchGetProductDetail),
		fork(watchUpdateProductDetail),
	]);
}

export default productSaga;
