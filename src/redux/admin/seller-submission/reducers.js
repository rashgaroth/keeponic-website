import {
	ON_CHANGE_ROW,
	ON_CHANGE_PAGE,
	ON_CHANGE_SEARCH,
	ON_CHANGE_DATE,
	GET_ALL_SUBMISSION,
	GET_ALL_SUBMISSION_SUCCESS,
	GET_ALL_SUBMISSION_FAILED,
	UPDATE_APPROVED_SUBMISSION,
	UPDATE_APPROVED_SUBMISSION_SUCCESS,
	UPDATE_APPROVED_SUBMISSION_FAILED,
	UPDATE_UNAPPROVED_SUBMISSION,
	UPDATE_UNAPPROVED_SUBMISSION_SUCCESS,
	UPDATE_UNAPPROVED_SUBMISSION_FAILED,
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
	submissions: [],
	submission: {},
	loadingSubmission: false,
};

const SubmissionManagementReducers = (state = initialState, action) => {
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
		case GET_ALL_SUBMISSION:
			return {
				...state,
				loading: true,
				totalItems: 0,
				submissions: [],
			};
		case GET_ALL_SUBMISSION_SUCCESS:
			return {
				...state,
				status: action.value.status,
				msg: action.value.message,
				loading: false,
				totalItems: action.value.data.totalItems,
				totalPages: action.value.data.totalPages,
				submissions: action.value.data.items,
			};
		case GET_ALL_SUBMISSION_FAILED:
			return {
				...state,
				status: action.value.status,
				msg: action.value.message,
				loading: false,
			};
		case UPDATE_APPROVED_SUBMISSION:
			return {
				...state,
				loading: true,
			};
		case UPDATE_APPROVED_SUBMISSION_SUCCESS:
			return {
				...state,
				error: false,
				loading: false,
				status: action.value.status,
				msg: action.value.message,
			};
		case UPDATE_APPROVED_SUBMISSION_FAILED:
			return {
				...state,
				error: false,
				loading: false,
				status: action.value.status,
				msg: action.value.message,
			};
		case UPDATE_UNAPPROVED_SUBMISSION:
			return {
				...state,
				loading: true,
			};
		case UPDATE_UNAPPROVED_SUBMISSION_SUCCESS:
			return {
				...state,
				error: false,
				loading: false,
				status: action.value.status,
				msg: action.value.message,
			};
		case UPDATE_UNAPPROVED_SUBMISSION_FAILED:
			return {
				...state,
				error: false,
				loading: false,
				status: action.value.status,
				msg: action.value.message,
			};
		default:
			return { ...state };
	}
};

export default SubmissionManagementReducers;
