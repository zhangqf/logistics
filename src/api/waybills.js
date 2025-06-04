import request from '@/utils/request'

// 获取运单
export function getWaybills(data) {
	console.log(data)
	return request({
		url: '/api/waybills/',
		method: 'get',
		data
	})
}

// 分配运单
export function assignWaybills(data) {
	return request({
		url: '/api/waybills/assign/',
		method: 'post',
		data
	})
}