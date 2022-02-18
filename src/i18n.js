import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import dictionary from './constants/dictionary';

var lang = localStorage.getItem('locale-lang');

i18n.use(initReactI18next).init({
	resources: dictionary,
	lng: lang,
	fallbackLng: 'id',
	debug: true,

	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
