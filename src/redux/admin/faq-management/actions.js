import * as types from '../../../constants/actionTypes';

export const addFaq = (data) => ({
	type: types.ADD_FAQ,
	payload: data,
});

export const getFaq = () => ({
	type: types.GET_FAQ,
});

export const getFaqDetail = (id) => ({
	type: types.GET_FAQ_DETAIL,
	id,
});

export const putFaq = (data, id) => ({
	type: types.UPDATE_FAQ,
	payload: data,
	id,
});

export const deleteFaq = (id) => ({
	type: types.DELETE_FAQ,
	id,
});
