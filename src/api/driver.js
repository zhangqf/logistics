import request from '@/utils/request'

// 实名认证
export function getDriverInfo() {
	return request({
		url: '/api/driver-info/'
	})
}