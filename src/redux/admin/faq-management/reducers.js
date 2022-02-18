import {
	ADD_FAQ,
	ADD_FAQ_SUCCESS,
	ADD_FAQ_FAILED,
	GET_FAQ,
	GET_FAQ_SUCCESS,
	GET_FAQ_FAILED,
	ON_CHANGE_ROW,
	ON_CHANGE_PAGE,
	ON_CHANGE_SEARCH,
	GET_FAQ_DETAIL_SUCCESS,
	GET_FAQ_DETAIL,
	GET_FAQ_DETAIL_FAILED,
	UPDATE_FAQ,
	UPDATE_FAQ_SUCCESS,
	UPDATE_FAQ_FAILED,
	DELETE_FAQ,
	DELETE_FAQ_SUCCESS,
	DELETE_FAQ_FAILED,
} from '../../../constants/actionTypes';

const initialState = {
	status: '',
	msg: '',
	loading: false,
	totalItems: 0,
	q: '',
	row: 5,
	page: 0,
	faqs: [],
	faq: {},
};

const FaqManagementReducers = (state = initialState, action) => {
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
		case ADD_FAQ:
			return {
				...state,
				loading: true,
			};
		case ADD_FAQ_SUCCESS:
			return {
				...state,
				loading: false,
				status: action.value.status,
				msg: action.value.message,
			};
		case ADD_FAQ_FAILED:
			return {
				...state,
				loading: false,
				status: action.value.status,
				msg: action.value.data.message,
			};
		case GET_FAQ:
			return {
				...state,
				loading: true,
				totalItems: 0,
				faqs: [],
			};
		case GET_FAQ_SUCCESS:
			return {
				...state,
				status: action.value.status,
				msg: action.value.message,
				faqs: action.value.data.items,
				totalItems: action.value.data.totalItems,
				totalPages: action.value.data.totalPages,
				loading: false,
			};
		case GET_FAQ_FAILED:
			return {
				...state,
				status: action.value.status,
				loading: false,
			};
		case GET_FAQ_DETAIL:
			return {
				...state,
				loading: true,
			};
		case GET_FAQ_DETAIL_SUCCESS:
			return {
				...state,
				status: action.value.status,
				msg: action.value.message,
				faq: action.value.data,
				loading: false,
			};
		case GET_FAQ_DETAIL_FAILED:
			return {
				...state,
				status: action.value.status,
				msg: action.value.message,
				loading: false,
			};
		case UPDATE_FAQ:
			return {
				...state,
				loading: true,
			};
		case UPDATE_FAQ_SUCCESS:
			return {
				...state,
				error: false,
				loading: false,
				status: action.value.status,
				msg: action.value.message,
			};
		case UPDATE_FAQ_FAILED:
			return {
				...state,
				error: true,
				loading: false,
				status: action.value.status,
				msg: action.value.message,
			};
		case DELETE_FAQ:
			return {
				...state,
				loading: true,
			};
		case DELETE_FAQ_SUCCESS:
			return {
				...state,
				error: false,
				loading: false,
				status: action.value.status,
				msg: action.value.message,
			};
		case DELETE_FAQ_FAILED:
			return {
				...state,
				error: true,
				loading: false,
				status: action.value.status,
				msg: action.value.message,
			};
		default:
			return { ...state };
	}
};

export default FaqManagementReducers;
