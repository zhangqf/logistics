import request from '@/utils/request'

// 实名认证
export function getWaybills(data) {
	console.log(data)
	return request({
		url: '/api/waybills/',
		method: 'get',
		data
	})
}