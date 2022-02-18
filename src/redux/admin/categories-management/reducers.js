import {
	ON_CHANGE_ROW,
	ON_CHANGE_PAGE,
	ON_CHANGE_SEARCH,
	GET_CATEGORIES,
	GET_CATEGORIES_SUCCESS,
	GET_CATEGORIES_FAILED,
} from '../../../constants/actionTypes';

const initialState = {
	status: '',
	msg: '',
	loading: false,
	totalItems: 0,
	q: '',
	row: 5,
	page: 0,
	categories: [],
};

const CategoriesManagementReducers = (state = initialState, action) => {
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
		case GET_CATEGORIES:
			return {
				...state,
				loading: true,
				totalItems: 0,
				categories: [],
			};
		case GET_CATEGORIES_SUCCESS:
			return {
				...state,
				status: action.value.status,
				msg: action.value.message,
				loading: false,
				totalItems: action.value.data.totalItems,
				categories: action.value.data.items,
			};
		case GET_CATEGORIES_FAILED:
			return {
				...state,
				status: action.value.status,
				msg: action.value.message,
				loading: false,
			};
		default:
			return { ...state };
	}
};

export default CategoriesManagementReducers;
