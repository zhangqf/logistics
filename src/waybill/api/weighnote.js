import request from "@/utils/request";

export const postWeighnote = (data) => {
	return request({
		url: '/api/poundage-bills/',
		method: 'post',
		data
	});
};




export const getWeighnote = (id) => {
	return request({
		url: `/api/poundage-bills/${id}/`,
		method: 'get'
	});
};


export const getBgImage = (id) => {
	return request({
		url: `/api/cargo-owner-info/${id}/bg-image/`,
		method: 'get'
	});
};


