// utils/request.js

import config from '@/config'

// 是否正在刷新token
let isRefreshing = false
// 重试队列
let retryQueue = []


// 刷新token的方法
const refreshToken = () => {
	return new Promise((resolve, reject) => {
		const refreshToken = uni.getStorageSync('refreshToken')
		if (!refreshToken) {
			reject(new Error('No refresh token available'))
			return
		}
		const token = uni.getStorageSync('token')
		uni.request({
			url: `${config.apiBaseUrl}/api/token/refresh/`,
			method: 'POST',
			header: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			data: {
				refresh: refreshToken
			},
			success: (res) => {
				if (res.statusCode === 200) {
					// 保存新的token和refreshToken
					uni.setStorageSync('token', res.data.access)
					uni.setStorageSync('refreshToken', res.data.refresh)
					resolve(res.data.access)
				} else {
					reject(new Error('Token refresh failed'))
				}
			},
			fail: (error) => {
				reject(error)
			}
		})
	})
}

// 创建请求实例
const request = (options) => {
	console.log(options)
	return new Promise((resolve, reject) => {
		// 拼接完整请求地址
		const url = /^(http|https):\/\//.test(options.url) 
			? options.url 
			: `${config.apiBaseUrl}${options.url}`
		
		// 获取本地存储的token
		const token = uni.getStorageSync('token')
		
		// 请求配置
		const requestOptions = {
			url: url,
			method: options.method || 'GET',
			header: {
				'Content-Type': 'application/json',
				...options.header,
				// 如果有token，添加到header
				...(token ? { 'Authorization': `Bearer ${token}` } : {})
			},
			data: options.data,
			timeout: config.timeout || 60000,
			
			success: async (res) => {
				const { data, statusCode } = res
				console.log(res)
				// 处理401未授权的情况
				if (statusCode === 401) {
					try {
						let newToken
						if (!isRefreshing) {
							console.log(234)
							isRefreshing = true
							newToken = await refreshToken()
							isRefreshing = false
							
							// 执行队列中的请求
							retryQueue.forEach(cb => cb(newToken))
							retryQueue = []
						} else {
							console.log('23423555')
							// 将请求加入队列
							newToken = await new Promise(resolve => {
								retryQueue.push((token) => {
									resolve(token)
								})
							})
						}
						
						// 使用新token重试当前请求
						options.header = {
							...options.header,
							'Authorization': `Bearer ${newToken}`
						}
						const retryRes = await request(options)
						resolve(retryRes)
					} catch (error) {
						console.log(error)
						console.log('catch')
						isRefreshing = false
						
						// 添加调试日志
						console.log('准备清除存储...')
						console.log('当前token:', uni.getStorageSync('token'))
						console.log('当前refreshToken:', uni.getStorageSync('refreshToken'))
						console.log('当前userInfo:', uni.getStorageSync('userInfo'))
						
						// 清除本地token
						uni.removeStorageSync('token')
						uni.removeStorageSync('refreshToken')
						uni.removeStorageSync('userInfo')
						
						// 验证是否清除成功
						console.log('清除后token:', uni.getStorageSync('token'))
						console.log('清除后refreshToken:', uni.getStorageSync('refreshToken'))
						console.log('清除后userInfo:', uni.getStorageSync('userInfo'))
						
						// Store current page path for redirect after login
						const pages = getCurrentPages()
						const currentPage = pages[pages.length - 1]
						if (currentPage) {
							const currentPath = `/${currentPage.route}`
							console.log('当前页面路径:', currentPath)
							// Don't store the login page itself
							if (!currentPath.includes('/pages/login/')) {
								uni.setStorageSync('loginRedirectPath', currentPath)
								console.log('已保存重定向路径:', currentPath)
							}
						}
						
						uni.showToast({
							title: '请重新登录',
							icon: 'none'
						})
						
						setTimeout(() => {
							console.log('准备跳转到登录页...')
							uni.reLaunch({
								url: '/pages/login/index'
							})
						}, 1500)
						reject(new Error('未登录或登录已过期'))
					}
					return
				}

				// 请求成功
				if (statusCode === 200 || statusCode === 201) {
					// 业务状态码判断
					if (data.selfErrorCode === 0) {
						resolve(data)
					} else {
						console.log(data)
						console.log('hahhahhahah')
						// 其他业务错误
						uni.showToast({
							title: data.message || '请求失败',
							icon: 'none'
						})
						reject(new Error(data.message || '请求失败'))
					}
				} else {
					// 其他HTTP状态码错误
					uni.showToast({
						title: `请求失败：${statusCode}`,
						icon: 'none'
					})
					reject(new Error(`HTTP错误：${statusCode}`))
				}
			},
			
			fail: (error) => {
				// 网络错误等
				uni.showToast({
					title: '网络异常，请检查网络设置',
					icon: 'none',
					duration:3000
				})
				reject(error)
			},
			
			complete: () => {
				// 请求完成的回调（可选）
			}
		}
		
		// 发起请求
		uni.request(requestOptions)
	})
}

export default request  