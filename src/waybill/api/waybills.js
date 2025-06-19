import request from '@/utils/request'
import {safeQueryString} from '@/waybill/utils/utils.js'
// 获取运单
export function getWaybills(data) {
	let url = '/api/waybills/'
	if(data){
		const r = safeQueryString(data)
		 url = url + "?" + r
		console.log(url)
	}
	return request({
		url: url,
		method: 'get',
	})
}

// 添加运单
export function postWaybills(data) {
	console.log(data)
	return request({
		url: '/api/waybills/',
		method: 'post',
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


// 提交审核
export function aubmitAudit(data) {
	console.log("submitAudit")
	return request({
		url:`/api/waybill-details/${data.id}/`,
		method: 'put',
		data
	})
}

// 获取运单信息

export function getWaybillDetail(id) {
	console.log('getWaybillDetail')
	return request({
		url:`/api/waybill-details/${id}`,
		method:'get',
	})
}



// 生成榜单

export function generateWeighNote() {
	console.log('generateWeighNote')
}

// 审核通过

export function approveWaybill(id, data) {
	return request({
		url:`/api/waybill-details/${id}/review/`,
		method: 'post',
		data
	})
}



export function bulkDeleteDriver(data) {
	return request({
		url:`/api/waybills/bulk-delete/`,
		method: 'post',
		data
	})
}
