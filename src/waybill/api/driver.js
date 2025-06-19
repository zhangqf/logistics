import request from '@/utils/request'
import {safeQueryString} from '@/waybill/utils/utils.js'

// 实名认证
export function getDriverInfo(data) {
	console.log(data)
	let url = '/api/driver-info/'
	if(data){
		const r = safeQueryString(data)
		 url = url + "?" + r
		console.log(url)
	}
	return request({
		url: url,
		method:'get',
	})
}

export function deleteDriver(id){
	return request({
		url:`/api/driver-info/${id}/`,
		method:'delete'
	})
}

export function bulkDeleteDriver(data){
	return request({
		url:`/api/driver-info/bulk-delete/`,
		method:'post',
		data
	})
}

