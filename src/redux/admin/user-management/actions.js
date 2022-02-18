import * as types from '../../../constants/actionTypes';

export const getAllUser = () => ({
	type: types.GET_ALL_USER,
});

export const getUser = (id) => ({
	type: types.GET_USER,
	id,
});
