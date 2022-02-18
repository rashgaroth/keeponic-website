import * as types from '../../../constants/actionTypes';

export const getAllSubmission = () => ({
	type: types.GET_ALL_SUBMISSION,
});

export const putApprovedSubmission = (id) => ({
	type: types.UPDATE_APPROVED_SUBMISSION,
	id,
});

export const putUnapprovedSubmission = (id) => ({
	type: types.UPDATE_UNAPPROVED_SUBMISSION,
	id,
});
