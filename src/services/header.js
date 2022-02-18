import { getLoggedInUser } from '../helpers/utility';

export function HeaderAuth() {
	return {
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + getLoggedInUser().token,
		},
	};
}

export function HeaderFile() {
	return {
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + getLoggedInUser().token,
			Accept: '*/*',
		},
	};
}

export function Header() {
	return {
		headers: {
			'Content-Type': 'application/json',
		},
	};
}
