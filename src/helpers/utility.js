import { Cookies } from 'react-cookie';

const setSession = (user) => {
	let cookies = new Cookies();
	if (user) cookies.set('user', JSON.stringify(user), { path: '/' });
	else cookies.remove('user');
};

const getLoggedInUser = () => {
	const cookies = new Cookies();
	const user = cookies.get('user');
	return user ? (typeof user == 'object' ? user : JSON.parse(user)) : null;
};

const isLongText = (string, max) => {
	return string.substr(0, max - 1) + (string.length > max ? ' ...' : '');
};

const idrCurrency = (number) => {
	let reverse = number.toString().split('').reverse().join('');
	let ribuan = reverse.match(/\d{1,3}/g);
	ribuan = ribuan.join('.').split('').reverse().join('');

	return ribuan;
};

const slugify = (text) => {
	text = text.toString().toLowerCase().trim();

	const sets = [
		{ to: 'a', from: '[ÀÁÂÃÄÅÆĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶἀ]' },
		{ to: 'c', from: '[ÇĆĈČ]' },
		{ to: 'd', from: '[ÐĎĐÞ]' },
		{ to: 'e', from: '[ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ]' },
		{ to: 'g', from: '[ĜĞĢǴ]' },
		{ to: 'h', from: '[ĤḦ]' },
		{ to: 'i', from: '[ÌÍÎÏĨĪĮİỈỊ]' },
		{ to: 'j', from: '[Ĵ]' },
		{ to: 'ij', from: '[Ĳ]' },
		{ to: 'k', from: '[Ķ]' },
		{ to: 'l', from: '[ĹĻĽŁ]' },
		{ to: 'm', from: '[Ḿ]' },
		{ to: 'n', from: '[ÑŃŅŇ]' },
		{ to: 'o', from: '[ÒÓÔÕÖØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ]' },
		{ to: 'oe', from: '[Œ]' },
		{ to: 'p', from: '[ṕ]' },
		{ to: 'r', from: '[ŔŖŘ]' },
		{ to: 's', from: '[ßŚŜŞŠȘ]' },
		{ to: 't', from: '[ŢŤ]' },
		{ to: 'u', from: '[ÙÚÛÜŨŪŬŮŰŲỤỦỨỪỬỮỰƯ]' },
		{ to: 'w', from: '[ẂŴẀẄ]' },
		{ to: 'x', from: '[ẍ]' },
		{ to: 'y', from: '[ÝŶŸỲỴỶỸ]' },
		{ to: 'z', from: '[ŹŻŽ]' },
		{ to: '-', from: "[·/_,:;']" },
	];

	sets.forEach((set) => {
		text = text.replace(new RegExp(set.from, 'gi'), set.to);
	});

	return text
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(/[^-a-zа-я-0-9\u03ff\u1f00-\u1fff]+/g, '') // Remove all non-word chars
		.replace(/--+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, ''); // Trim - from end of text
};

/* Setup comma and leading zeros */

const commaFormatter = (nominal, settings) => {
	if (!nominal) {
		nominal = settings.replaceZeroDecimals ? '-' : '00';
	} else {
		const diffLength = settings.floatingPoint - nominal.length;
		if (diffLength > 0) {
			for (let i = 0; i < settings.floatingPoint - nominal.length; i++) {
				nominal += '0';
			}
		} else if (diffLength < 0) {
			nominal = nominal.slice(0, diffLength);
		}
	}
	return nominal;
};

/* Place dots every three digit start from the most right */

const dotsFormatter = (target, settings) => {
	const angka = target.split('.');
	const size = angka[0].length;
	let result = angka[0].split('');

	for (let i = size - 1; i >= 0; i--) {
		if ((size - i) % 3 === 0 && i > 0) {
			result[i] = settings.dot + result[i];
		}
	}

	const angkaDepan = result.join('');

	if (settings.removeZeroDecimals && !angka[1]) {
		return angkaDepan;
	} else {
		const angkaBelakang = commaFormatter(angka[1] || null, settings);
		return settings.floatingPoint > 0
			? angkaDepan + settings.decimal + angkaBelakang
			: angkaDepan;
	}
};

/* Append or prepend currency symbol based on formal / informal use */

const symbolFormatter = (nominal, settings) => {
	if (settings.symbol === 'Rp') {
		nominal = settings.formal ? 'Rp' + nominal : 'Rp ' + nominal;
	} else if (settings.symbol === 'IDR') {
		nominal = settings.formal ? nominal + ' IDR' : 'IDR ' + nominal;
	}
	return nominal;
};

/* Take 1-3 digit from the left, round the rest with comma, append the unit name */

const unitFormatter = (target, settings) => {
	const units = settings.longUnit
		? ['ribu', 'juta', 'milyar', 'triliun']
		: [settings.k ? 'k' : 'rb', 'jt', 'M', 'T'];
	const unitIndex = Math.ceil(target.length / 3) - 2;

	let nominal = null;

	if (unitIndex >= 0 && unitIndex < 4) {
		let unit = units[unitIndex];
		if (settings.spaceBeforeUnit) unit = ' ' + unit;

		const modDigit = target.length % 3;
		const sliceIndex = modDigit === 0 ? 3 : modDigit;

		nominal = target.substr(0, sliceIndex);
		nominal +=
			(unitIndex >= 0 && settings.floatingPoint > 0 ? settings.decimal : '') +
			target.substr(sliceIndex, settings.floatingPoint) +
			unit;
	} else {
		nominal = dotsFormatter(target, settings);
	}

	return nominal;
};

const defaultSettings = {
	symbol: 'Rp', // ['Rp', 'IDR', null]
	formal: true,
	dot: '.',
	decimal: ',',
	floatingPoint: 2,
	replaceZeroDecimals: false, // Rp100.000,-
	removeZeroDecimals: false,
	k: false, // k
	useUnit: false, // rb, jt, M, T
	longUnit: false, // ribu, juta, milyar, triliun
	spaceBeforeUnit: false,
};

const toRupiah = (target, settings = {}) => {
	target = typeof target !== 'string' ? target.toString() : target;
	settings = Object.assign({}, defaultSettings, settings);

	return settings.useUnit
		? symbolFormatter(unitFormatter(target, settings), settings)
		: symbolFormatter(dotsFormatter(target, settings), settings);
};

export {
	setSession,
	getLoggedInUser,
	isLongText,
	idrCurrency,
	slugify,
	toRupiah,
};
