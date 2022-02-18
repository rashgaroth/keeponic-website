import {
	GET_ALL_WITHDRAW,
	GET_ALL_WITHDRAW_SUCCESS,
	GET_ALL_WITHDRAW_FAILED,
	ON_CHANGE_ROW,
	ON_CHANGE_PAGE,
	ON_CHANGE_SEARCH,
} from '../../../constants/actionTypes';

const initialState = {
	status: '',
	msg: '',
	loading: false,
	totalItems: 0,
	q: '',
	row: 5,
	page: 0,
	withdrawItems: null,
};

const WithdrawManagementReducers = (state = initialState, action) => {
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
		case GET_ALL_WITHDRAW:
			return {
				...state,
				loading: true,
				withdrawItems: null,
			};
		case GET_ALL_WITHDRAW_SUCCESS:
			return {
				...state,
				loading: false,
				withdrawItems: action.value.data.items,
				status: action.value.status,
				totalItems: action.value.data.totalItems,
				totalPages: action.value.data.totalPages,
				msg: action.value.message,
			};
		case GET_ALL_WITHDRAW_FAILED:
			return {
				...state,
				loading: false,
				status: action.value.status,
				msg: action.value.data.message,
			};
		default:
			return { ...state };
	}
};

export default WithdrawManagementReducers;
