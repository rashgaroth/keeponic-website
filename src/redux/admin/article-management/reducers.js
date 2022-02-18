import {
	ON_CHANGE_ROW,
	ON_CHANGE_PAGE,
	ON_CHANGE_SEARCH,
	GET_ALL_ARTICLE,
	GET_ALL_ARTICLE_SUCCESS,
	GET_ALL_ARTICLE_FAILED,
	GET_DETAIL_ARTICLE,
	GET_DETAIL_ARTICLE_SUCCESS,
	GET_DETAIL_ARTICLE_FAILED,
	UPDATE_DETAIL_ARTICLE,
	UPDATE_DETAIL_ARTICLE_SUCCESS,
	UPDATE_DETAIL_ARTICLE_FAILED,
} from '../../../constants/actionTypes';

const initialState = {
	status: '',
	msg: '',
	loading: false,
	totalItems: 0,
	q: '',
	row: 5,
	page: 0,
	articles: [],
	article: null,
};

const ArticleManagementReducers = (state = initialState, action) => {
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
		case GET_ALL_ARTICLE:
			return {
				...state,
				loading: true,
				totalItems: 0,
				articles: [],
			};
		case GET_ALL_ARTICLE_SUCCESS:
			return {
				...state,
				status: action.value.status,
				msg: action.value.message,
				loading: false,
				totalItems: action.value.data.totalItems,
				articles: action.value.data.items,
			};
		case GET_ALL_ARTICLE_FAILED:
			return {
				...state,
				status: action.value.status,
				msg: action.value.message,
				loading: false,
			};

		case GET_DETAIL_ARTICLE:
			return {
				...state,
				loading: true,
			};
		case GET_DETAIL_ARTICLE_SUCCESS:
			return {
				...state,
				loading: false,
				status: action.value.status,
				msg: action.value.message,
				article: action.value.data,
			};
		case GET_DETAIL_ARTICLE_FAILED:
			return {
				...state,
				loading: false,
				status: action.value.status,
				msg: action.value.message,
			};
		case UPDATE_DETAIL_ARTICLE:
			return {
				...state,
				loading: true,
			};
		case UPDATE_DETAIL_ARTICLE_SUCCESS:
			return {
				...state,
				loading: false,
			};
		case UPDATE_DETAIL_ARTICLE_FAILED:
			return {
				...state,
				loading: false,
			};
		default:
			return { ...state };
	}
};

export default ArticleManagementReducers;
