export {
	loginUser,
	loginUserSuccess,
	loginUserFailed,
	registerUser,
	registerUserSuccess,
	registerUserFailed,
	logoutUser,
	forgetPassword,
	forgetPasswordSuccess,
	forgetPasswordFailed,
	onDismiss,
} from './auth/actions';

// Region Seller
export {
	onChangeRowProduct,
	onChangePageProduct,
	onChangeSearchProduct,
	onChangeCategoryProduct,
	getProduct,
	getProductCategory,
	getProductAllCategories,
	addProduct,
	getProductDetail,
	getProductDetailSuccess,
	updateProduct,
	updateProductDetailSuccess,
	deleteProduct,
} from './seller/product/actions';
export {
	addArticle,
	getArticles,
	filterArticle,
	deleteArticle,
	getArticleDetail,
	updateArticleDetail,
} from './seller/article/actions';
export {
	getOrder,
	getDetailOrder,
	updateOrderStatus,
	shippingOrderStatus,
} from './seller/order/actions';
export {
	getIncomeHistory,
	getWithdrawHistory,
	onChangeSearchWithdraw,
} from './seller/withdraw/actions';

// Region Admin
export { getAllUser, getUser } from './admin/user-management/actions';
export {
	getAllMarket,
	getMarketDetail,
	getMarketProducts,
} from './admin/market-management/actions';
export {
	addCategory,
	getCategories,
	deleteCategory,
	updateCategory,
} from './admin/categories-management/actions';

export {
	addFaq,
	getFaq,
	putFaq,
	deleteFaq,
	getFaqDetail,
} from './admin/faq-management/actions';

export {
	getAllSubmission,
	putApprovedSubmission,
	putUnapprovedSubmission,
} from './admin/seller-submission/actions';

export {
	getAllArticle,
	getDetailArticle,
	updateDetailArticle,
} from './admin/article-management/actions';

export { getAllWithdraw } from './admin/withdraw-management/actions';

// Region Common
export {
	getUserProfile,
	updatePassword,
	updateProfileAccount,
	updateProfileMarket,
	onChangeStatePathInfo,
	onChangeRow,
	onChangeDate,
	onChangePage,
	onChangeSearch,
	onChangeSort,
} from './common/actions';
