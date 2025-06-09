<template>
	<view class="login-container">
		<!-- Logo区域 -->
		<view class="logo-section">
			<image class="logo" :src="/static/images/logo.png" mode="aspectFit"></image>
			<text class="app-name">司机端</text>
		</view>

		<!-- 登录选项 -->
		<view class="login-options">
			<!-- 微信手机号登录 -->
			<button class="login-btn wechat-btn" open-type="getPhoneNumber" @getphonenumber="handleGetPhoneNumber">
				<text class="iconfont icon-wechat"></text>
				微信手机号一键登录
			</button>

			<!-- 手机号密码登录 -->
			<!-- <button class="login-btn phone-btn" @tap="handlePhoneLogin">
				<text class="iconfont icon-phone"></text>
				手机号密码登录
			</button> -->
		</view>

		<!-- 用户协议 -->
		<view class="agreement">
			<checkbox :checked="agreed" @tap="toggleAgreement"></checkbox>
			<text class="agreement-text">
				登录即代表您已同意
				<text class="link" @tap="showUserAgreement">《用户协议》</text>
				和
				<text class="link" @tap="showPrivacyPolicy">《隐私政策》</text>
			</text>
		</view>
	</view>
</template>

<script>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

export default {
	setup() {
		const userStore = useUserStore()
		const agreed = ref(false)

		// 切换协议同意状态
		const toggleAgreement = () => {
			agreed.value = !agreed.value
		}

		// 处理微信手机号登录
		const handleGetPhoneNumber = async (e) => {
			console.log(e)
			if (!agreed.value) {
				uni.showToast({
					title: '请先同意用户协议和隐私政策',
					icon: 'none'
				})
				return
			}

			if (e.detail.errMsg !== 'getPhoneNumber:ok') {
				uni.showToast({
					title: '获取手机号失败',
					icon: 'none'
				})
				return
			}

			try {
				uni.showLoading({
					title: '登录中...',
					mask: true
				})

				const loginResult = await userStore.loginWithWechat({
					code: await getLoginCode(),
					// phoneCode: e.detail.code,
					encryptedData:e.detail.encryptedData, 
					iv:e.detail.iv
				})

				if (loginResult) {
					uni.showToast({
						title: '登录成功',
						icon: 'success'
					})
					
					// 延迟返回上一页
					setTimeout(() => {
						// Check if there's a redirect path stored
						const redirectPath = uni.getStorageSync('loginRedirectPath')
						if (redirectPath) {
							uni.removeStorageSync('loginRedirectPath')
							// If it's a tabbar page, use switchTab
							if (['/pages/index/index', '/pages/user/user'].includes(redirectPath)) {
								uni.switchTab({
									url: redirectPath
								})
							} else {
								// For other pages, use redirectTo
								uni.redirectTo({
									url: redirectPath
								})
							}
						} else {
							// Default to index page if no redirect path
							uni.switchTab({
								url: '/pages/index/index'
							})
						}
					}, 1500)
				}
			} catch (error) {
				console.error('登录失败:', error)
				uni.showToast({
					title: '登录失败，请重试',
					icon: 'none'
				})
			} finally {
				uni.hideLoading()
			}
		}

		// 获取登录code
		const getLoginCode = () => {
			return new Promise((resolve, reject) => {
				uni.login({
					provider: 'weixin',
					success: (res) => {
						resolve(res.code)
					},
					fail: (err) => {
						reject(err)
					}
				})
			})
		}

		// 手机号密码登录
		const handlePhoneLogin = () => {
			if (!agreed.value) {
				uni.showToast({
					title: '请先同意用户协议和隐私政策',
					icon: 'none'
				})
				return
			}
			
			uni.navigateTo({
				url: '/pages/login/phone'
			})
		}

		// 查看用户协议
		const showUserAgreement = () => {
			uni.navigateTo({
				url: '/pages/agreement/user'
			})
		}

		// 查看隐私政策
		const showPrivacyPolicy = () => {
			uni.navigateTo({
				url: '/pages/agreement/privacy'
			})
		}

		return {
			agreed,
			toggleAgreement,
			handleGetPhoneNumber,
			handlePhoneLogin,
			showUserAgreement,
			showPrivacyPolicy
		}
	}
}
</script>

<style lang="scss">
@use '../../styles/index.scss' as *;

.login-container {
	min-height: 100vh;
	background-color: $bg-white;
	padding: $spacing-xl;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.logo-section {
	margin-top: 160rpx;
	margin-bottom: 120rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	
	.logo {
		width: 180rpx;
		height: 180rpx;
		margin-bottom: $spacing-lg;
	}
	
	.app-name {
		font-size: 48rpx;
		color: $text-main;
		font-weight: 600;
	}
}

.login-options {
	width: 100%;
	
	.login-btn {
		width: 100%;
		height: 88rpx;
		border-radius: $radius-lg;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: $spacing-lg;
		border: none;
		
		.iconfont {
			font-size: 40rpx;
			margin-right: $spacing-sm;
		}
		
		&.wechat-btn {
			background: $primary-gradient;
			color: $text-white;
			
			&:active {
				opacity: $opacity-hover;
			}
		}
		
		&.phone-btn {
			background: $bg-white;
			color: $text-main;
			border: 2rpx solid $border-color;
			
			&:active {
				background: $bg-color;
			}
		}
	}
}

.agreement {
	// position: fixed;
	// bottom: calc(env(safe-area-inset-bottom) + 180rpx);
	// left: 0;
	// right: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 $spacing-lg;
	
	checkbox {
		// margin-right: $spacing-sm;
		
		// 使用缩小尺寸的替代方案
		// width: 32rpx;
		// height: 32rpx;
		
		// 或者使用 transform 的完整写法
		transform: scale3d(0.8, 0.8, 1);
	}
	
	.agreement-text {
		font-size: $font-size-sm;
		color: $text-secondary;
		
		.link {
			color: $primary-color;
			
			&:active {
				opacity: $opacity-hover;
			}
		}
	}
}
</style> 