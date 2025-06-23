import request from '@/utils/request'

// 实名认证
export function verifyIdentity(data) {
	return request({
		url: '/api/user-auth-info/',
		method: 'POST',
		data
	})
}

export function putVerifyIdentity(id,data) {
	return request({
		url: `/api/user-auth-info/${id}/`,
		method: 'put',
		data
	})
}