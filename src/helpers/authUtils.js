// import jwtDecode from 'jwt-decode';
import { Cookies } from 'react-cookie';

/**
 * Checks if user is authenticated
 */
const isUserAuthenticated = () => {
	const user = getLoggedInUser();
	if (!user) {
		return false;
	}
	const token = user.token;
	const exp = user.token_validity;
	const currentTime = new Date().toISOString();

	// console.log(exp);
	if (token === null || exp < currentTime) {
		console.warn('access token expired');
		localStorage.clear();
		return false;
	} else {
		return true;
	}
	// if (exp) {
	//     return true;
	// }
};

/**
 * Returns the logged in user
 */
const getLoggedInUser = () => {
	const cookies = new Cookies();
	const user = cookies.get('user');
	return user ? (typeof user == 'object' ? user : JSON.parse(user)) : null;
};

const getProfileUser = () => {
	const cookies = new Cookies();
	const profile = cookies.get('profile');
	return profile
		? typeof profile == 'object'
			? profile
			: JSON.parse(profile)
		: null;
};

export { isUserAuthenticated, getLoggedInUser, getProfileUser };
