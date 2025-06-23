import {
	defineStore
} from 'pinia'
import config from '@/config'

import {
	getUserInfo,
	wechatLogin
} from '@/api/user.js'

export const useUserStore = defineStore('user', {
	state: () => ({
		token: uni.getStorageSync('token') || '',
		refreshToken: uni.getStorageSync('refreshToken') || '',
		userInfo: uni.getStorageSync('userInfo') || {
			nickName: '',
			avatarUrl: '',
			phoneNumber: ''
		}
	}),

	getters: {
		isLogin: (state) => !!state.token
	},

	actions: {
		// 微信手机号登录
		async loginWithWechat(data) {
			console.log(config)
			try {
				// 这里替换为实际的登录API调用
				const res = await wechatLogin(data)
				console.log(res)
				if (res.selfErrorCode === 0) {
					const {
						access,
						refresh,
						user
					} = res.data
					// 保存登录状态
					this.token = access
					this.refreshToken = refresh
					this.userInfo = user

					// 持久化存储
					uni.setStorageSync('token', access)
					uni.setStorageSync('refreshToken', refresh)
					uni.setStorageSync('userInfo', user)

					return true
				}

				throw new Error(res.data.message || '登录失败')
			} catch (error) {
				uni.showToast({
					title: '网络错误请重试',
					icon: 'error'
				})
				console.error('登录失败:', error)
				throw error
			}
		},

		// 手机号验证码登录
		async loginWithPhone({
			phone,
			code
		}) {
			try {
				// 这里替换为实际的登录API调用
				const res = await uni.request({
					url: `${config.apiBaseUrl}/api/login/phone`,
					method: 'POST',
					data: {
						phone,
						code
					}
				})

				if (res.data.selfErrorCode === 0) {
					const {
						token,
						refreshToken,
						userInfo
					} = res.data.data


					// 保存登录状态
					this.token = token
					this.refreshToken = refreshToken
					this.userInfo = userInfo

					// 持久化存储
					uni.setStorageSync('token', token)
					uni.setStorageSync('refreshToken', refreshToken)
					uni.setStorageSync('userInfo', userInfo)

					return true
				}

				throw new Error(res.data.message || '登录失败')
			} catch (error) {
				console.error('登录失败:', error)
				uni.showToast({
					title: error + '请重试',
					icon: 'error'
				})
				throw error
			}
		},

		// 刷新token
		async refreshToken() {
			try {
				const res = await uni.request({
					url: `${config.apiBaseUrl}/api/auth/refresh`,
					method: 'POST',
					data: {
						refreshToken: this.refreshToken
					}
				})

				if (res.data.selfErrorCode === 0) {
					const {
						token,
						refreshToken
					} = res.data.data

					// 更新token
					this.token = token
					this.refreshToken = refreshToken

					// 持久化存储
					uni.setStorageSync('token', token)
					uni.setStorageSync('refreshToken', refreshToken)

					return true
				}

				throw new Error(res.data.message || '刷新token失败')
			} catch (error) {
				console.error('刷新token失败:', error)
				throw error
			}
		},

		// 退出登录
		logout() {
			this.token = ''
			this.refreshToken = ''
			this.userInfo = {
				nickName: '',
				avatarUrl: '',
				phoneNumber: ''
			}

			// 清除存储
			uni.removeStorageSync('token')
			uni.removeStorageSync('refreshToken')
			uni.removeStorageSync('userInfo')
		},

		// 更新用户信息
		updateUserInfo(info) {
			console.log(this.userInfo)
			console.log(info)
			this.userInfo = info
			console.log(this.userInfo)
			uni.setStorageSync('userInfo', info)
		},

		// 获取用户信息
		async fetchGetUserInfo() {
			try {
				const res = await getUserInfo()
				console.log(res)
				if (res.selfErrorCode === 0) {
					await this.updateUserInfo(res.data.data)
					return true
				}
				throw new Error(res.data.message || '获取用户信息失败')
			} catch (error) {
				//TODO handle the exception
				// throw new Error('获取用户信息失败')
				console.error('获取用户信息失败:', error)
				throw error
			}
		}
	}
})