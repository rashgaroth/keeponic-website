import {
	GET_ALL_USER,
	GET_ALL_USER_SUCCESS,
	GET_ALL_USER_FAILED,
	ON_CHANGE_ROW,
	ON_CHANGE_PAGE,
	ON_CHANGE_SEARCH,
	GET_USER,
	GET_USER_SUCCESS,
	GET_USER_FAILED,
	ON_CHANGE_DATE,
} from '../../../constants/actionTypes';

const initialState = {
	status: '',
	msg: '',
	loading: false,
	totalItems: 0,
	totalPages: 0,
	q: '',
	filterDate: 'startDate=&endDate=',
	row: 5,
	page: 0,
	users: [],
	markets: [],
	user: {},
	loadingUser: false,
};

const UserManagementReducers = (state = initialState, action) => {
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
		case ON_CHANGE_DATE:
			return {
				...state,
				filterDate: action.value,
			};
		case GET_ALL_USER:
			return {
				...state,
				loading: true,
				totalItems: 0,
				users: [],
			};
		case GET_ALL_USER_SUCCESS:
			return {
				...state,
				status: action.value.status,
				msg: action.value.message,
				loading: false,
				totalItems: action.value.data.totalItems,
				totalPages: action.value.data.totalPages,
				users: action.value.data.items,
			};
		case GET_ALL_USER_FAILED:
			return {
				...state,
				status: action.value.status,
				msg: action.value.message,
				loading: false,
			};
		case GET_USER:
			return {
				...state,
				user: {},
				loadingUser: true,
			};
		case GET_USER_SUCCESS:
			return {
				...state,
				loadingUser: false,
				status: action.value.status,
				msg: action.value.message,
				user: action.value.data,
			};
		case GET_USER_FAILED:
			return {
				...state,
				loading: false,
				loadingUser: false,
				status: action.value.status,
				msg: action.value.message,
			};
		default:
			return { ...state };
	}
};

export default UserManagementReducers;
