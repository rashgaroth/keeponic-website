import * as types from '../../../constants/actionTypes';

export const getAllMarket = () => ({
	type: types.GET_ALL_MARKET,
});

export const getMarketDetail = (id) => ({
	type: types.GET_MARKET_DETAIL,
	id,
});

export const getMarketProducts = (id) => ({
	type: types.GET_PRODUCT_MARKET,
	id,
});
