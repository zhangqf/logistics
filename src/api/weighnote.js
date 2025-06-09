import request from "../utils/request";

export const postWeighnote = (data) => {
	return request({
		url: '/api/poundage-bills/',
		method: 'put',
		data
	});
};




export const getWeighnote = (id) => {
	return request({
		url: `/api/poundage-bills/${id}/`,
		method: 'get'
	});
};