import { toast } from 'react-toastify';

export function fail(message) {
	toast.error(message, {
		position: toast.POSITION.BOTTOM_RIGHT,
	});
}

export function success(message) {
	toast.success(message, {
		position: toast.POSITION.BOTTOM_RIGHT,
	});
}
