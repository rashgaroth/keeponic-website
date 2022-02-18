import {
	GET_USER_PROFILE,
	GET_USER_PROFILE_SUCCESS,
	GET_USER_PROFILE_FAILED,
	RESET_STORE,
	UPDATE_PROFILE_ACCOUNT,
	UPDATE_PROFILE_ACCOUNT_SUCCESS,
	UPDATE_PROFILE_ACCOUNT_FAILED,
	UPDATE_PROFILE_MARKET,
	UPDATE_PROFILE_MARKET_SUCCESS,
	UPDATE_PROFILE_MARKET_FAILED,
	UPDATE_PASSWORD,
	UPDATE_PASSWORD_SUCCESS,
	UPDATE_PASSWORD_FAILED,
} from '../../../constants/actionTypes';
import { getProfileUser } from '../../../helpers/authUtils';

const initialState = {
	profile: getProfileUser(),
	loading: false,
	message: '',
	error: 0,
};

const ProfileReducers = (state = initialState, action) => {
	switch (action.type) {
		case GET_USER_PROFILE:
			return {
				...state,
				loading: true,
				// profile: {},
			};
		case GET_USER_PROFILE_SUCCESS:
			return {
				...state,
				loading: false,
				profile: action.value,
			};
		case GET_USER_PROFILE_FAILED:
			return {
				...state,
				profile: action.value,
			};

		case UPDATE_PROFILE_ACCOUNT:
			return {
				...state,
				loading: true,
			};
		case UPDATE_PROFILE_ACCOUNT_SUCCESS:
			return {
				...state,
				loading: false,
			};
		case UPDATE_PROFILE_ACCOUNT_FAILED:
			return {
				...state,
				loading: false,
			};

		case UPDATE_PROFILE_MARKET:
			return {
				...state,
				loading: true,
			};
		case UPDATE_PROFILE_MARKET_SUCCESS:
			return {
				...state,
				loading: false,
			};
		case UPDATE_PROFILE_MARKET_FAILED:
			return {
				...state,
				loading: false,
			};

		case UPDATE_PASSWORD:
			return {
				...state,
				error: 0,
				loading: true,
			};
		case UPDATE_PASSWORD_SUCCESS:
			return {
				...state,
				error: 0,
				loading: false,
			};
		case UPDATE_PASSWORD_FAILED:
			return {
				...state,
				error: 1,
				loading: false,
				message: action.value.data.message,
			};
		case RESET_STORE:
			return {
				...state,
				profile: null,
			};
		default:
			return { ...state };
	}
};

export default ProfileReducers;
