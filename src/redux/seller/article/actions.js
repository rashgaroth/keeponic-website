import * as types from '../../../constants/actionTypes';

export const getArticles = () => ({
	type: types.GET_ARTICLE,
});

export const addArticle = (data) => ({
	type: types.ADD_ARTICLE,
	payload: data,
});

export const filterArticle = (field, value) => ({
	type: types.FILTER_ARTICLE,
	value,
	field,
});

export const deleteArticle = (id) => ({
	type: types.DELETE_ARTICLE,
	id,
});

export const getArticleDetail = (id) => ({
	type: types.GET_ARTICLE_DETAIL,
	id,
});

export const updateArticleDetail = (data, id) => ({
	type: types.UPDATE_ARTICLE_DETAIL,
	payload: data,
	id,
});
