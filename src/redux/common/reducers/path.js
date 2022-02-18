// @flow
import { ON_CHANGE_PATH_INFO } from '../../../constants/actionTypes';

const initialState = {
	path: '',
};

const PathReducers = (state = initialState, action) => {
	switch (action.type) {
		case ON_CHANGE_PATH_INFO:
			return {
				...state,
				path: action.value,
			};
		default:
			return { ...state };
	}
};

export default PathReducers;
