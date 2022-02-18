// @flow
import {
	LOGIN_USER,
	LOGIN_USER_SUCCESS,
	LOGIN_USER_FAILED,
	LOGOUT_USER,
	REGISTER_USER,
	REGISTER_USER_SUCCESS,
	REGISTER_USER_FAILED,
	FORGET_PASSWORD,
	FORGET_PASSWORD_SUCCESS,
	FORGET_PASSWORD_FAILED,
	RESET_STORE,
	RESET_CAPTCHA,
	ON_DISMISS,
} from '../../constants/actionTypes';

import { getLoggedInUser } from '../../helpers/authUtils';

const initialState = {
	user: getLoggedInUser(),
	loading: false,
	err: false,
	passwordResetSuccessful: false,
};

const AuthReducers = (state = initialState, action) => {
	switch (action.type) {
		case LOGIN_USER:
			return { ...state, loading: true, err: false };
		case LOGIN_USER_SUCCESS:
			return {
				...state,
				user: action.payload,
				loading: false,
				error: null,
				err: false,
			};
		case LOGIN_USER_FAILED:
			return { ...state, error: action.payload, loading: false, err: true };
		case RESET_CAPTCHA:
			return { ...state, err: false };
		case REGISTER_USER:
			return { ...state, loading: true };
		case REGISTER_USER_SUCCESS:
			return { ...state, user: action.payload, loading: false, error: null };
		case REGISTER_USER_FAILED:
			return { ...state, error: action.payload, loading: false };
		case LOGOUT_USER:
			return { ...state, user: null, dataProduct: null };
		case FORGET_PASSWORD:
			return { ...state, loading: true, passwordResetSuccessful: false };
		case FORGET_PASSWORD_SUCCESS:
			return {
				...state,
				passwordResetStatus: action.payload,
				loading: false,
				error: null,
				passwordResetSuccessful: true,
			};
		case ON_DISMISS:
			return { ...state, passwordResetSuccessful: action.value };
		case FORGET_PASSWORD_FAILED:
			return { ...state, passwordResetStatus: action.payload, loading: false };
		case RESET_STORE:
			return {
				...state,
				user: null,
			};
		default:
			return { ...state };
	}
};

export default AuthReducers;
