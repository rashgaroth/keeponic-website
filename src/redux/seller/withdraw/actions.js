import * as types from '../../../constants/actionTypes';

export const getWithdrawHistory = () => ({
	type: types.GET_WITHDRAW_HISTORY,
});

export const getIncomeHistory = () => ({
	type: types.GET_INCOME_HISTORY,
});

export const onChangeSearchWithdraw = (field, value) => ({
	type: types.ON_CHANGE_SEARCH_WITHDRAW,
	value,
	field,
});
