// @flow
import {
	GET_PRODUCT,
	GET_PRODUCT_SUCCESS,
	GET_PRODUCT_FAILED,
	GET_PRODUCT_CATEGORY_SUCCESS,
	ON_CHANGE_ROW,
	ON_CHANGE_PAGE,
	ADD_PRODUCT,
	ADD_PRODUCT_SUCCESS,
	ADD_PRODUCT_FAILED,
	GET_PRODUCT_DETAIL,
	GET_PRODUCT_DETAIL_SUCCESS,
	GET_PRODUCT_DETAIL_FAILED,
	GET_PRODUCT_ALL_CATEGORIES_SUCCESS,
	UPDATE_PRODUCT_DETAIL,
	UPDATE_PRODUCT_DETAIL_SUCCESS,
	UPDATE_PRODUCT_DETAIL_FAILED,
	DELETE_PRODUCT,
	DELETE_PRODUCT_SUCCESS,
	DELETE_PRODUCT_FAILED,
	ON_CHANGE_SEARCH,
	ON_CHANGE_CATEGORY,
	ON_CHANGE_SORT,
} from '../../../constants/actionTypes';

const initialState = {
	status: '',
	msg: '',
	error: false,
	loading: false,
	totalItems: 0,
	totalPages: 0,
	q: '',
	row: 5,
	page: 0,
	catId: [],
	dataCategory: [],
	categories: [],
	dataProduct: [],
	detailProduct: {
		imageFirst: '',
		imageSecond: '',
		imageThird: '',
		imageFourth: '',
		nameProduct: '',
		categoryProduct: {},
		descProduct: '',
		priceProduct: 0,
		stockProduct: 0,
		status: 0,
		weightProduct: 0,
		lengthProduct: 0,
		widthProduct: 0,
		heightProduct: 0,
		createdDate: '',
	},
	sort: null,
};

const ProductReducers = (state = initialState, action) => {
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
		case ON_CHANGE_SORT:
			return {
				...state,
				sort: action.value,
			};
		case ON_CHANGE_CATEGORY:
			return {
				...state,
				catId: action.value,
			};
		case GET_PRODUCT:
			return {
				...state,
				loading: true,
				totalItems: 0,
				dataProduct: [],
			};
		case GET_PRODUCT_SUCCESS:
			return {
				...state,
				dataProduct: action.value.product,
				totalItems: action.value.totalItems,
				totalPages: action.value.totalPages,
				loading: false,
			};
		case GET_PRODUCT_FAILED:
			return {
				...state,
				status: action.value.status,
				loading: false,
			};
		case GET_PRODUCT_CATEGORY_SUCCESS:
			return {
				...state,
				dataCategory: action.value.data,
			};
		case GET_PRODUCT_ALL_CATEGORIES_SUCCESS:
			return {
				...state,
				categories: action.value.data,
			};
		case ADD_PRODUCT:
			return {
				...state,
				loading: true,
			};
		case ADD_PRODUCT_SUCCESS:
			return {
				...state,
				loading: false,
				status: action.value.status,
				msg: action.value.message,
			};
		case ADD_PRODUCT_FAILED:
			return {
				...state,
				loading: false,
				status: action.value.status,
				msg: action.value.data.message,
			};
		case GET_PRODUCT_DETAIL:
			return {
				...state,
				loading: true,
			};
		case GET_PRODUCT_DETAIL_SUCCESS:
			return {
				...state,
				error: false,
				loading: false,
				status: action.value.status,
				msg: action.value.message,
				detailProduct: {
					...state.detailProduct,
					imageFirst: action.value.data.avatar,
					imageSecond: action.value.data.second_avatar,
					imageThird: action.value.data.third_avatar,
					imageFourth: action.value.data.fourth_avatar,
					nameProduct: action.value.data.name,
					categoryProduct: action.value.data.category,
					descProduct: action.value.data.description,
					priceProduct: action.value.data.price,
					stockProduct: action.value.data.stock,
					weightProduct: action.value.data.weight,
					lengthProduct: action.value.data.length,
					widthProduct: action.value.data.width,
					heightProduct: action.value.data.height,
					status: action.value.data.status,
					createdDate: action.value.data.created_date,
				},
			};
		case GET_PRODUCT_DETAIL_FAILED:
			return {
				...state,
				loading: false,
				error: true,
				// status: action.value.status,
				// msg: action.value.data.message,
			};
		case UPDATE_PRODUCT_DETAIL:
			return {
				...state,
				loading: true,
			};
		case UPDATE_PRODUCT_DETAIL_SUCCESS:
			return {
				...state,
				error: false,
				loading: false,
				status: action.value.status,
				msg: action.value.message,
			};
		case UPDATE_PRODUCT_DETAIL_FAILED:
			return {
				...state,
				error: true,
				loading: false,
				status: action.value.status,
				msg: action.value.message,
			};
		case DELETE_PRODUCT:
			return {
				...state,
				loading: true,
			};
		case DELETE_PRODUCT_SUCCESS:
			return {
				...state,
				loading: false,
				status: action.value.status,
				msg: action.value.message,
			};
		case DELETE_PRODUCT_FAILED:
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

export default ProductReducers;
