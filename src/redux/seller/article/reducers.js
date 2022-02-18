import {
	ON_CHANGE_ROW,
	ON_CHANGE_PAGE,
	ON_CHANGE_SEARCH,
	GET_ARTICLE,
	GET_ARTICLE_SUCCESS,
	GET_ARTICLE_FAILED,
	ADD_ARTICLE,
	ADD_ARTICLE_SUCCESS,
	ADD_ARTICLE_FAILED,
	FILTER_ARTICLE,
	DELETE_ARTICLE,
	DELETE_ARTICLE_SUCCESS,
	DELETE_ARTICLE_FAILED,
	GET_ARTICLE_DETAIL_SUCCESS,
	GET_ARTICLE_DETAIL,
	GET_ARTICLE_DETAIL_FAILED,
} from '../../../constants/actionTypes';

const initialState = {
	status: '',
	msg: '',
	loading: false,
	totalItems: 0,
	q: '',
	row: 8,
	page: 0,
	articles: [],
	article: {},
	isPublished: '',
};

const ArticleReducers = (state = initialState, action) => {
	switch (action.type) {
		case ON_CHANGE_ROW:
			return {
				...state,
				row: action.value,
			};
		case ON_CHANGE_PAGE:
			return {
				...state,
				page: action.value,
			};
		case ON_CHANGE_SEARCH:
			return {
				...state,
				q: action.value,
			};
		case FILTER_ARTICLE:
			return {
				...state,
				isPublished: action.value,
			};
		case ADD_ARTICLE:
			return {
				...state,
				loading: true,
			};
		case ADD_ARTICLE_SUCCESS:
			return {
				...state,
				loading: false,
				status: action.value.status,
				msg: action.value.message,
			};
		case ADD_ARTICLE_FAILED:
			return {
				...state,
				loading: false,
				status: action.value.status,
				msg: action.value.data.message,
			};
		case GET_ARTICLE:
			return {
				...state,
				loading: true,
				totalItems: 0,
				articles: [],
			};
		case GET_ARTICLE_SUCCESS:
			return {
				...state,
				status: action.value.status,
				msg: action.value.message,
				articles: action.value.data.items,
				totalItems: action.value.data.totalItems,
				totalPages: action.value.data.totalPages,
				loading: false,
			};
		case GET_ARTICLE_FAILED:
			return {
				...state,
				status: action.value.status,
				loading: false,
			};
		case DELETE_ARTICLE:
			return {
				...state,
				loading: true,
			};
		case DELETE_ARTICLE_SUCCESS:
			return {
				...state,
				loading: false,
				status: action.value.status,
				msg: action.value.message,
			};
		case DELETE_ARTICLE_FAILED:
			return {
				...state,
				loading: false,
				status: action.value.status,
				msg: action.value.message,
			};
		case GET_ARTICLE_DETAIL:
			return {
				...state,
				loading: true,
			};
		case GET_ARTICLE_DETAIL_SUCCESS:
			return {
				...state,
				loading: false,
				status: action.value.status,
				msg: action.value.message,
				article: action.value.data,
			};
		case GET_ARTICLE_DETAIL_FAILED:
			return {
				...state,
				loading: false,
				status: action.value.status,
				msg: action.value.message,
			};
		default:
			return { ...state };
	}
};

export default ArticleReducers;
