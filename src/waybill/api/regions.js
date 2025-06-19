import request from "@/utils/request";

export const getRegions = () => {
	return request({
		url: '/api/regions/',
		method: 'get',
	});
};


