import request from '@/utils/request'

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/api/users/me',
    method: 'get'
  })
}

export function wechatLogin(data) {
	return request({
		url: '/api/wechat/login/',
		method: 'post',
		data
	})
}


// 退出登录
export function logout() {
  return request({
    url: '/api/user/logout',
    method: 'post'
  })
} 