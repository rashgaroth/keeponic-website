import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import store from './redux/store';
import { ConfigProvider } from 'antd';
import 'moment/locale/id';

let lang = localStorage.getItem('locale-lang');

ReactDOM.render(
	<Provider store={store}>
		<ConfigProvider locale={lang}>
			<App key={lang ? lang : 'id'} />
		</ConfigProvider>
	</Provider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA

// if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
// dev code
serviceWorker.unregister();
// } else {
// 	// production code
// 	serviceWorker.register();
// }
