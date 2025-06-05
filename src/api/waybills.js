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

// 提交审核

export function aubmitAudit() {
	console.log("submitAudit")
}

// 获取运单信息

export function getWaybillDetail(id) {
	console.log('getWaybillDetail')
	return request({
		url:`api/waybill-details/`,
		method:'get',
		params:id
	})
}



// 生成榜单

export function generateWeighNote() {
	console.log('generateWeighNote')
}

// 审核通过

export function approveWaybill() {
	console.log('approveWaybill')
}