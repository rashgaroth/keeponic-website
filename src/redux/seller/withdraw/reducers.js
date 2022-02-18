import {
	ON_CHANGE_ROW,
	ON_CHANGE_PAGE,
	ON_CHANGE_SEARCH_WITHDRAW,
	GET_WITHDRAW_HISTORY,
	GET_WITHDRAW_HISTORY_SUCCESS,
	GET_WITHDRAW_HISTORY_FAILED,
} from '../../../constants/actionTypes';

const initialState = {
	status: '',
	msg: '',
	loading: false,
	totalItems: 0,
	q: '',
	row: 5,
	page: 0,
	historyWithdraw: null,
};

const WithdrawReducers = (state = initialState, action) => {
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
		case ON_CHANGE_SEARCH_WITHDRAW:
			return {
				...state,
				q: action.value,
			};
		case GET_WITHDRAW_HISTORY:
			return {
				...state,
				loading: true,
				historyWithdraw: null,
			};
		case GET_WITHDRAW_HISTORY_SUCCESS:
			return {
				...state,
				status: action.value.status,
				msg: action.value.message,
				historyWithdraw: action.value.data.items,
				totalItems: action.value.data.totalItems,
				totalPages: action.value.data.totalPages,
				loading: false,
			};
		case GET_WITHDRAW_HISTORY_FAILED:
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

export default WithdrawReducers;
