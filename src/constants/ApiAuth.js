import { API_SERVICE } from './ApiService';

export const API = {
	login: `${API_SERVICE.keeponic}/weblogin`,
	forgotPassword: `${API_SERVICE.keeponic}/forgot-password`,
	checkTokenPassword: (code) =>
		`${API_SERVICE.keeponic}/check-token-password/${code}`,
	updatePassword: (code) => `${API_SERVICE.keeponic}/update-password/${code}`,
};
