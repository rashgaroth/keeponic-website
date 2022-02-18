import * as types from '../../../constants/actionTypes';

export const getOrder = () => ({
	type: types.GET_ALL_NEW_ORDER,
});

export const getDetailOrder = (id) => ({
	type: types.GET_DETAIL_ORDER,
	id,
});

export const updateOrderStatus = (data, id) => ({
	type: types.UPDATE_ORDER_STATUS,
	payload: data,
	id,
});

export const shippingOrderStatus = (shipment_type, shipment_code) => ({
	type: types.GET_SHIPPING_STATUS,
	shipment_type,
	shipment_code,
});
