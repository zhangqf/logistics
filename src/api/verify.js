import request from '@/utils/request'

// 实名认证
export function verifyIdentity(data) {
	console.log(data)
	return request({
		url: '/api/user-auth-info/',
		method: 'POST',
		data
	})
}