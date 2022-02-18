import * as types from '../../../constants/actionTypes';

export const onChangeRowProduct = (field, value) => ({
	type: types.ON_CHANGE_ROW,
	value,
	field,
});

export const onChangePageProduct = (field, value) => ({
	type: types.ON_CHANGE_PAGE,
	value,
	field,
});

export const onChangeSearchProduct = (field, value) => ({
	type: types.ON_CHANGE_SEARCH,
	value,
	field,
});

export const onChangeCategoryProduct = (field, value) => ({
	type: types.ON_CHANGE_CATEGORY,
	value,
	field,
});

export const getProduct = () => ({
	type: types.GET_PRODUCT,
});

export const getProductCategory = () => ({
	type: types.GET_PRODUCT_CATEGORY,
});

export const getProductAllCategories = () => ({
	type: types.GET_PRODUCT_ALL_CATEGORIES,
});

export const addProduct = (data) => ({
	type: types.ADD_PRODUCT,
	payload: data,
});

export const getProductDetail = (id) => ({
	type: types.GET_PRODUCT_DETAIL,
	id,
});

export const getProductDetailSuccess = (data) => ({
	type: types.GET_PRODUCT_DETAIL_SUCCESS,
	value: data,
});

export const updateProduct = (data, id, key) => ({
	type: types.UPDATE_PRODUCT_DETAIL,
	payload: data,
	id,
	key,
});

export const updateProductDetailSuccess = (data) => ({
	type: types.UPDATE_PRODUCT_DETAIL_SUCCESS,
	value: data,
});

export const deleteProduct = (id) => ({
	type: types.DELETE_PRODUCT,
	id,
});
