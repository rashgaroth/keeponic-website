import * as types from '../../constants/actionTypes';
//
export const getUserProfile = () => ({
	type: types.GET_USER_PROFILE,
});

export const updateProfileAccount = (data) => ({
	type: types.UPDATE_PROFILE_ACCOUNT,
	payload: data,
});

export const updateProfileMarket = (data) => ({
	type: types.UPDATE_PROFILE_MARKET,
	payload: data,
});

export const updatePassword = (data) => ({
	type: types.UPDATE_PASSWORD,
	payload: data,
});

export const onChangeStatePathInfo = (field, value) => ({
	type: types.ON_CHANGE_PATH_INFO,
	value,
	field,
});

export const onChangeRow = (field, value) => ({
	type: types.ON_CHANGE_ROW,
	value,
	field,
});

export const onChangePage = (field, value) => ({
	type: types.ON_CHANGE_PAGE,
	value,
	field,
});

export const onChangeSearch = (field, value) => ({
	type: types.ON_CHANGE_SEARCH,
	value,
	field,
});

export const onChangeDate = (field, value) => ({
	type: types.ON_CHANGE_DATE,
	value,
	field,
});

export const onChangeSort = (field, value) => ({
	type: types.ON_CHANGE_SORT,
	value,
	field,
});
