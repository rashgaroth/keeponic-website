import * as types from '../../../constants/actionTypes';

export const getCategories = () => ({
	type: types.GET_CATEGORIES,
});

export const addCategory = (data) => ({
	type: types.ADD_CATEGORY,
	payload: data,
});

export const updateCategory = (data, id) => ({
	type: types.UPDATE_CATEGORY,
	payload: data,
	id,
});

export const deleteCategory = (id) => ({
	type: types.DELETE_CATEGORY,
	id,
});
