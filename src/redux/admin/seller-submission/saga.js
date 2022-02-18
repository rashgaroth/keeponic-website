import { all, takeEvery, put, select, call, fork } from 'redux-saga/effects';
import {
	GET_ALL_SUBMISSION,
	GET_ALL_SUBMISSION_FAILED,
	GET_ALL_SUBMISSION_SUCCESS,
	UPDATE_APPROVED_SUBMISSION,
	UPDATE_APPROVED_SUBMISSION_SUCCESS,
	UPDATE_APPROVED_SUBMISSION_FAILED,
	UPDATE_UNAPPROVED_SUBMISSION,
	UPDATE_UNAPPROVED_SUBMISSION_SUCCESS,
	UPDATE_UNAPPROVED_SUBMISSION_FAILED,
} from '../../../constants/actionTypes';

import * as service from '../../../services';
import { HeaderAuth } from '../../../services/header';
// import history from '../../../helpers/history';
import { API } from '../../../constants/ApiAdmin';

import { message } from 'antd';

let getAuthState = (state) => state.AuthReducers;
let getSubmissionState = (state) => state.SubmissionManagementReducers;

function* getSubmissions() {
	let authState = yield select(getAuthState);
	let submissionManagementState = yield select(getSubmissionState);
	let urlGetSubmission = API.getAllSubmissionSeller(
		authState.user.user_id,
		submissionManagementState.page,
		submissionManagementState.row,
		submissionManagementState.q,
		submissionManagementState.filterDate
	);
	try {
		let _res = yield call(service.GET, urlGetSubmission, HeaderAuth());

		if (_res.status === 200) {
			yield put({
				type: GET_ALL_SUBMISSION_SUCCESS,
				value: _res.data,
			});
		} else {
			yield put({
				type: GET_ALL_SUBMISSION_FAILED,
				value: _res.data,
			});
			message.error('Maaf, Terjadi kesalahan.');
		}
	} catch (error) {
		yield put({
			type: GET_ALL_SUBMISSION_FAILED,
			value: {
				status: 500,
			},
		});
		message.error('Maaf, terjadi kesalahan');
	}
}

function* putApprovedSubmission(action) {
	let authState = yield select(getAuthState);
	// let param = JSON.stringify(action.payload);
	let url = API.approvedSubmissionSeller(authState.user.user_id, action.id);

	try {
		let _response = yield call(service.PUT, url, null, HeaderAuth());
		if (_response.status === 200) {
			yield put({
				type: UPDATE_APPROVED_SUBMISSION_SUCCESS,
				value: _response.data,
			});
			message.success({
				content:
					'Pengguna telah berhasil diterima & Email konfirmasi berhasil dikirim',
			});
			yield* getSubmissions();
		} else {
			yield put({
				type: UPDATE_APPROVED_SUBMISSION_FAILED,
				value: _response.data,
			});
		}
	} catch (error) {
		yield put({
			type: UPDATE_APPROVED_SUBMISSION_FAILED,
			value: error,
		});
	}
}

function* putUnapprovedSubmission(action) {
	let authState = yield select(getAuthState);
	// let param = JSON.stringify(action.payload);
	let url = API.unapprovedSubmissionSeller(authState.user.user_id, action.id);

	try {
		let _response = yield call(service.PUT, url, null, HeaderAuth());
		if (_response.status === 200) {
			yield put({
				type: UPDATE_UNAPPROVED_SUBMISSION_SUCCESS,
				value: _response.data,
			});
			message.success({
				content:
					'Pengguna berhasil ditolak & Email konfirmasi berhasil dikirim.',
			});
			yield* getSubmissions();
		} else {
			yield put({
				type: UPDATE_UNAPPROVED_SUBMISSION_FAILED,
				value: _response.data,
			});
		}
	} catch (error) {
		yield put({
			type: UPDATE_UNAPPROVED_SUBMISSION_FAILED,
			value: error,
		});
	}
}

function* watchGetSubmissions() {
	yield takeEvery(GET_ALL_SUBMISSION, getSubmissions);
}

function* watchApprovedSubmissions() {
	yield takeEvery(UPDATE_APPROVED_SUBMISSION, putApprovedSubmission);
}

function* watchUnapprovedSubmissions() {
	yield takeEvery(UPDATE_UNAPPROVED_SUBMISSION, putUnapprovedSubmission);
}

function* submissionManagementSaga() {
	yield all([
		fork(watchGetSubmissions),
		fork(watchApprovedSubmissions),
		fork(watchUnapprovedSubmissions),
	]);
}

export default submissionManagementSaga;
