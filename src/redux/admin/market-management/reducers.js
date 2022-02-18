import {
	GET_ALL_MARKET,
	GET_ALL_MARKET_SUCCESS,
	GET_ALL_MARKET_FAILED,
	ON_CHANGE_ROW,
	ON_CHANGE_PAGE,
	ON_CHANGE_SEARCH,
	GET_MARKET_DETAIL_SUCCESS,
	GET_MARKET_DETAIL,
	GET_PRODUCT_MARKET,
	GET_PRODUCT_MARKET_SUCCESS,
	GET_PRODUCT_MARKET_FAILED,
	ON_CHANGE_DATE,
} from '../../../constants/actionTypes';

const initialState = {
	status: '',
	msg: '',
	loading: false,
	loadingTwo: false,
	totalItems: 0,
	q: '',
	row: 5,
	page: 0,
	filterDate: 'startDate=&endDate=',
	markets: [],
	market: {},
	address: {},
	products: [],
};

const MarketManagementReducers = (state = initialState, action) => {
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
		case GET_ALL_MARKET:
			return {
				...state,
				loading: true,
				totalItems: 0,
				users: [],
			};
		case GET_ALL_MARKET_SUCCESS:
			return {
				...state,
				status: action.value.status,
				msg: action.value.message,
				loading: false,
				totalItems: action.value.data.totalItems,
				markets: action.value.data.items,
			};
		case GET_ALL_MARKET_FAILED:
			return {
				...state,
				status: action.value.status,
				msg: action.value.message,
				loading: false,
			};
		case GET_MARKET_DETAIL:
			return {
				...state,
				loading: true,
				market: {},
				address: {},
			};
		case GET_MARKET_DETAIL_SUCCESS:
			return {
				...state,
				status: action.value.status,
				msg: action.value.message,
				loading: false,
				market: action.value.data,
				address: action.value.data.sec_user_model.address,
			};
		case GET_PRODUCT_MARKET:
			return {
				...state,
				products: [],
				totalItems: 0,
				loadingTwo: true,
			};
		case GET_PRODUCT_MARKET_SUCCESS:
			return {
				...state,
				status: action.value.status,
				msg: action.value.message,
				totalItems: action.value.data.totalItems,
				products: action.value.data.items,
				loadingTwo: false,
			};
		case GET_PRODUCT_MARKET_FAILED:
			return {
				...state,
				status: action.value.status,
				msg: action.value.message,
				loadingTwo: false,
			};
		default:
			return { ...state };
	}
};

export default MarketManagementReducers;
