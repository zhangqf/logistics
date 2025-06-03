import request from '@/utils/request'

// 添加货主
export function addShipper(data) {
	return request({
		url: '/api/cargo-owner-info/',
		method: 'POST',
		data
	})
}

// 获取货主列表

export function getShipper() {
	return request({
		url: '/api/cargo-owner-info/',
		method: 'get',
	})
}
