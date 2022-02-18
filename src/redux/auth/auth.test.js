import { expectSaga } from 'redux-saga-test-plan';

import * as actions from './actions';
import authReducer from './reducers';

import * as service from '../../services';
import { API } from '../../constants/ApiSeller';

import { watchLoginUser, watchRegisterUser, watchForgetPassword } from './saga';

import { fireEvent, render, screen } from '@testing-library/react';

describe('login flow', () => {
	// this variable use to compare with final state
	const stateAuth = {
		status: 200,
		user: {
			email: 'bahrijar@gmail.com',
		},
	};
	it('Kondisi Success, Pass BRO Gas yang lain', () => {
		return expectSaga(watchLoginUser)
			.withReducer(authReducer)
			.provide({
				call(effect, next) {
					if (effect.fn === service.fetchJSON) {
						if (effect.args[0] === API.login) {
							return stateAuth;
						}
					}
					return next();
				},
			})
			.dispatch(actions.loginUser('bahrijar@gmail.com', 'mantap'))
			.hasFinalState({ user: stateAuth, loading: false, error: null })
			.silentRun();
	});

	it('Kondisi Error, Pass BRO Gas yang lain', () => {
		const error = new Error('Email atau password salah');

		return expectSaga(watchLoginUser)
			.withReducer(authReducer)
			.provide({
				call(effect, next) {
					if (effect.fn === service.fetchJSON) {
						if (effect.args[0] === API.login) {
							throw error;
						}
					}
					return next();
				},
			})
			.dispatch(actions.loginUser('bahrijar4@gmail.com', 'mantaps'))
			.hasFinalState({ user: null, loading: false, error: error })
			.silentRun();
	});
});

// describe('register flow', () => {
//     const user = { "id": 1, "username": "test", "password": "test", "firstName": "Test", "lastName": "User", "role": "Admin" };
//     it("success", () => {
//         return expectSaga(watchRegisterUser)
//             .withReducer(authReducer)
//             .provide({
//                 call(effect, next) {
//                     // Check for the API call to return fake value
//                     if (effect.fn === fetchJSON) {
//                         if (effect.args[0] === '/users/register') {
//                             return user;
//                         }
//                     }
//                     // Allow Redux Saga to handle other `call` effects
//                     return next();
//                 },
//             })
//             .dispatch(actions.registerUser("Test", "test", "test"))
//             .hasFinalState({ user: user, loading: false, error: null })
//             .silentRun();
//     });
// });

// describe('forget password flow', () => {
//     const successMessage = "We've sent you a link to reset password to your registered email.";
//     const error = new Error('Sorry, we could not find any registered user with entered username');

//     it("success", () => {
//         return expectSaga(watchForgetPassword)
//             .withReducer(authReducer)
//             .provide({
//                 call(effect, next) {
//                     // Check for the API call to return fake value
//                     if (effect.fn === fetchJSON) {
//                         if (effect.args[0] === '/users/password-reset') {
//                             return { message: successMessage }
//                         }
//                     }
//                     // Allow Redux Saga to handle other `call` effects
//                     return next();
//                 },
//             })
//             .dispatch(actions.forgetPassword("test"))
//             .hasFinalState({ user: null, passwordResetStatus: successMessage, loading: false, error: null })
//             .silentRun();
//     });

//     it("error", () => {
//         return expectSaga(watchForgetPassword)
//             .withReducer(authReducer)
//             .provide({
//                 call(effect, next) {
//                     // Check for the API call to return fake value
//                     if (effect.fn === fetchJSON) {
//                         if (effect.args[0] === '/users/password-reset') {
//                             throw error;
//                         }
//                     }
//                     // Allow Redux Saga to handle other `call` effects
//                     return next();
//                 },
//             })
//             .dispatch(actions.forgetPassword("test1"))
//             .hasFinalState({ user: null, error: error, loading: false })
//             .silentRun();
//     });
// });
