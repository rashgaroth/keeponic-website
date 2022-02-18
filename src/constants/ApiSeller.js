import { API_SERVICE } from './ApiService';

export const API = {
	// Product
	getAllProduct: (path, market_id, page, size, q, cid, sort) =>
		`${API_SERVICE.keeponic}/seller/${path}/${market_id}?page=${page}&size=${size}&q=${q}&category=${cid}&sort=${sort}`,
	createProduct: (market_id) => `${API_SERVICE.keeponic}/seller/${market_id}`,
	getDetailProduct: (market_id, id) =>
		`${API_SERVICE.keeponic}/seller/${market_id}/product/${id}`,
	updateDetailProduct: (market_id, id) =>
		`${API_SERVICE.keeponic}/seller/${market_id}/product/${id}`,
	deleteProduct: (market_id, id) =>
		`${API_SERVICE.keeponic}/seller/${market_id}/product/${id}`,
	getCategoryProduct: (market_id) =>
		`${API_SERVICE.keeponic}/seller/${market_id}/categories`,

	getCategories: `${API_SERVICE.keeponic}/seller/categories`,

	getAllArticle: (uid, page, size, q, isPublished) =>
		`${API_SERVICE.keeponic}/seller/${uid}/articles?page=${page}&size=${size}&q=${q}&ispublished=${isPublished}`,
	createArticle: (uid) => `${API_SERVICE.keeponic}/seller/${uid}/article/add`,
	getDetailArticle: (uid, articleId) =>
		`${API_SERVICE.keeponic}/seller/${uid}/article/${articleId}`,
	deleteArticle: (uid, articleId) =>
		`${API_SERVICE.keeponic}/seller/${uid}/article/${articleId}`,

	profile: (id) => `${API_SERVICE.keeponic}/profile/${id}`,
	getProfile: (uid) => `${API_SERVICE.keeponic}/seller/${uid}/profile`,

	updateProfileAccount: (uid) =>
		`${API_SERVICE.keeponic}/seller/${uid}/profile`,
	updateProfileMarket: (uid) =>
		`${API_SERVICE.keeponic}/seller/${uid}/market/profile`,

	updatePassword: (uid) =>
		`${API_SERVICE.keeponic}/seller/${uid}/market/profile/change-password`,

	getOrder: (market_id, path, page, size, q) =>
		`${API_SERVICE.keeponic}/seller/${market_id}/order?status=${path}&page=${page}&size=${size}&q=${q}`,

	getDetailOrder: (market_id, order_id) =>
		`${API_SERVICE.keeponic}/seller/${market_id}/order/${order_id}`,

	updateOrder: (market_id, order_id) =>
		`${API_SERVICE.keeponic}/seller/${market_id}/order/${order_id}`,

	trackingOrder: (shipment_type, shipment_code) =>
		`${API_SERVICE.keeponic}/tracking?kurir=${shipment_type}&awb=${shipment_code}`,

	withdrawHistory: (uid, path, page, size, q) =>
		`${API_SERVICE.keeponic}/seller/${uid}/history-withdraw?status=${path}&page=${page}&size=${size}&q=${q}`,
};
