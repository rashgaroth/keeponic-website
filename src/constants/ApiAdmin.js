import { API_SERVICE } from './ApiService';

export const API = {
	getAllSubmissionSeller: (id, page, size, q, filterDate) =>
		`${API_SERVICE.keeponic}/admin/${id}/submission-seller?page=${page}&size=${size}&q=${q}&${filterDate}`,
	approvedSubmissionSeller: (id, uid) =>
		`${API_SERVICE.keeponic}/admin/${id}/submission-seller/approved/${uid}`,

	unapprovedSubmissionSeller: (id, uid) =>
		`${API_SERVICE.keeponic}/admin/${id}/submission-seller/unapproved/${uid}`,

	getAllUser: (id, page, size, q, filterDate) =>
		`${API_SERVICE.keeponic}/admin/${id}/all-user?page=${page}&size=${size}&q=${q}&${filterDate}`,
	getUser: (id, uid) => `${API_SERVICE.keeponic}/admin/${id}/user/${uid}`,

	getAllMarket: (id, page, size, q, filterDate) =>
		`${API_SERVICE.keeponic}/admin/${id}/all-market?page=${page}&size=${size}&q=${q}&${filterDate}`,

	getMarket: (id, mid) => `${API_SERVICE.keeponic}/admin/${id}/market/${mid}`,
	getMarketProducts: (id, mid, page, size, q) =>
		`${API_SERVICE.keeponic}/admin/${id}/market/${mid}/products?page=${page}&size=${size}&q=${q}`,
	getCategories: (page, size, q) =>
		`${API_SERVICE.keeponic}/admin/product/categories?page=${page}&size=${size}&q=${q}`,
	postCategory: (id) => `${API_SERVICE.keeponic}/admin/${id}/categories/new`,
	getCategory: (id, cid) =>
		`${API_SERVICE.keeponic}/admin/${id}/categories/${cid}`,
	putCategory: (id, cid) =>
		`${API_SERVICE.keeponic}/admin/${id}/categories/${cid}`,
	deleteCategory: (id, cid) =>
		`${API_SERVICE.keeponic}/admin/${id}/categories/${cid}`,

	postFaq: (id) => `${API_SERVICE.keeponic}/admin/${id}/faq/new`,
	getFaq: (page, size, q) =>
		`${API_SERVICE.keeponic}/faq?page=${page}&size=${size}&q=${q}`,
	getFaqDetail: (id) => `${API_SERVICE.keeponic}/faq/item?id=${id}`,
	putFaq: (id, fid) => `${API_SERVICE.keeponic}/admin/${id}/faq/update/${fid}`,
	deleteFaq: (id, fid) =>
		`${API_SERVICE.keeponic}/admin/${id}/faq/delete/${fid}`,

	getArticles: (id, path, page, size) =>
		`${API_SERVICE.keeponic}/admin/${id}/articles?status=${path}&page=${page}&size=${size}`,

	getPutArticle: (id, articleId) =>
		`${API_SERVICE.keeponic}/admin/${id}/articles/${articleId}`,

	getAllWithdraw: (id, path, page, size, q) =>
		`${API_SERVICE.keeponic}/admin/${id}/withdraw?status=${path}&page=${page}&size=${size}&q=${q}`,
};
