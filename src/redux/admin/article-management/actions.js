import * as types from '../../../constants/actionTypes';

export const getAllArticle = () => ({
	type: types.GET_ALL_ARTICLE,
});

export const getDetailArticle = (id) => ({
	type: types.GET_DETAIL_ARTICLE,
	id,
});

export const updateDetailArticle = (data, id, key) => ({
	type: types.UPDATE_DETAIL_ARTICLE,
	payload: data,
	id,
	key,
});
