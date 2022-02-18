import {
	ON_CHANGE_ROW,
	ON_CHANGE_PAGE,
	ON_CHANGE_SEARCH,
	GET_ALL_NEW_ORDER,
	GET_ALL_NEW_ORDER_SUCCESS,
	GET_ALL_NEW_ORDER_FAILED,
	GET_DETAIL_ORDER,
	GET_DETAIL_ORDER_SUCCESS,
	GET_DETAIL_ORDER_FAILED,
	UPDATE_ORDER_STATUS,
	UPDATE_ORDER_STATUS_SUCCESS,
	UPDATE_ORDER_STATUS_FAILED,
	GET_SHIPPING_STATUS,
	GET_SHIPPING_STATUS_SUCCESS,
	GET_SHIPPING_STATUS_FAILED,
	GET_ALL_ORDER_RECEIVED_SUCCESS,
	GET_ALL_ORDER_IN_SHIPPING_SUCCESS,
} from '../../../constants/actionTypes';

const initialState = {
	status: '',
	msg: '',
	loading: false,
	totalItems: 0,
	q: '',
	row: 8,
	page: 0,
	orders: [],
	order: null,
	shipping: null,
	orderReceived: [],
	orderInShipping: [],
	loadingDetail: false,
	loadingShipping: false,
};

const OrderReducers = (state = initialState, action) => {
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
		case GET_ALL_NEW_ORDER:
			return {
				...state,
				loading: true,
				totalItems: 0,
			};
		case GET_ALL_NEW_ORDER_SUCCESS:
			return {
				...state,
				status: action.value.status,
				msg: action.value.message,
				orders: action.value.data.items,
				totalItems: action.value.data.totalItems,
				totalPages: action.value.data.totalPages,
				loading: false,
			};
		case GET_ALL_ORDER_RECEIVED_SUCCESS:
			return {
				...state,
				status: action.value.status,
				msg: action.value.message,
				orderReceived: action.value.data.items,
				totalItems: action.value.data.totalItems,
				totalPages: action.value.data.totalPages,
				loading: false,
			};
		case GET_ALL_ORDER_IN_SHIPPING_SUCCESS:
			return {
				...state,
				status: action.value.status,
				msg: action.value.message,
				orderInShipping: action.value.data.items,
				totalItems: action.value.data.totalItems,
				totalPages: action.value.data.totalPages,
				loading: false,
			};
		case GET_ALL_NEW_ORDER_FAILED:
			return {
				...state,
				status: action.value.status,
				loading: false,
			};
		case GET_DETAIL_ORDER:
			return {
				...state,
				loadingDetail: true,
				order: null,
			};
		case GET_DETAIL_ORDER_SUCCESS:
			return {
				...state,
				loadingDetail: false,
				order: action.value.data,
			};
		case GET_DETAIL_ORDER_FAILED:
			return {
				...state,
				loadingDetail: false,
			};

		case GET_SHIPPING_STATUS:
			return {
				...state,
				loadingShipping: true,
				shipping: null,
			};
		case GET_SHIPPING_STATUS_SUCCESS:
			return {
				...state,
				loadingShipping: false,
				shipping: action.value.data,
			};
		case GET_SHIPPING_STATUS_FAILED:
			return {
				...state,
				loadingShipping: false,
				msg: action.value.message,
			};
		case UPDATE_ORDER_STATUS:
			return {
				...state,
				loading: true,
			};
		case UPDATE_ORDER_STATUS_SUCCESS:
			return {
				...state,
				error: false,
				loading: false,
				status: action.value.status,
				msg: action.value.message,
			};
		case UPDATE_ORDER_STATUS_FAILED:
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

export default OrderReducers;
