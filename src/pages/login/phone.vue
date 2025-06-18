<template>
	<view class="phone-login-container">
		<view class="form-container">
			<!-- 手机号输入 -->
			<view class="form-item">
				<text class="label">手机号</text>
				<view class="input-group">
					<text class="prefix">+86</text>
					<input 
						class="input" 
						type="number" 
						v-model="phone" 
						placeholder="请输入手机号"
						placeholder-class="placeholder-style"
						maxlength="11"
					/>
				</view>
			</view>

			<!-- 验证码输入 -->
			<view class="form-item">
				<text class="label">验证码</text>
				<view class="input-group">
					<input 
						class="input" 
						type="number" 
						v-model="code" 
						placeholder="请输入验证码"
						placeholder-class="placeholder-style"
						maxlength="6"
					/>
					<button 
						class="code-btn" 
						:disabled="counting || !canSendCode" 
						@tap="handleSendCode"
					>
						{{ counting ? `${countdown}s后重发` : '获取验证码' }}
					</button>
				</view>
			</view>
		</view>

		<!-- 登录按钮 -->
		<view class="submit-section">
			<button class="submit-btn" :disabled="!canSubmit" @tap="handleSubmit">
				登录
			</button>
		</view>
	</view>
</template>

<script>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

export default {
	setup() {
		const userStore = useUserStore()
		const phone = ref('')
		const code = ref('')
		const counting = ref(false)
		const countdown = ref(60)

		// 是否可以发送验证码
		const canSendCode = computed(() => {
			return /^1[3-9]\d{9}$/.test(phone.value)
		})

		// 是否可以提交
		const canSubmit = computed(() => {
			return canSendCode.value && code.value.length === 6
		})

		// 发送验证码
		const handleSendCode = async () => {
			if (!canSendCode.value || counting.value) return

			try {
				// 这里添加发送验证码的API调用
				await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用

				uni.showToast({
					title: '验证码已发送',
					icon: 'success'
				})

				// 开始倒计时
				counting.value = true
				countdown.value = 60
				const timer = setInterval(() => {
					if (countdown.value > 0) {
						countdown.value--
					} else {
						counting.value = false
						clearInterval(timer)
					}
				}, 1000)

			} catch (error) {
				console.error('发送验证码失败:', error)
				uni.showToast({
					title: '发送失败，请重试',
					icon: 'none'
				})
			}
		}

		// 提交登录
		const handleSubmit = async () => {
			if (!canSubmit.value) return

			try {
				uni.showLoading({
					title: '登录中...',
					mask: true
				})

				// 这里添加手机号登录的API调用
				const loginResult = await userStore.loginWithPhone({
					phone: phone.value,
					code: code.value
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

		return {
			phone,
			code,
			counting,
			countdown,
			canSendCode,
			canSubmit,
			handleSendCode,
			handleSubmit
		}
	}
}
</script>

<style lang="scss">
@use '@/styles/index.scss';

.phone-login-container {
	min-height: 100vh;
	background-color: $bg-white;
	padding: $spacing-xl;
}

.form-container {
	margin-top: $spacing-xl;
	
	.form-item {
		margin-bottom: $spacing-xl;
		
		.label {
			display: block;
			font-size: $font-size-md;
			color: $text-main;
			margin-bottom: $spacing-sm;
		}
		
		.input-group {
			display: flex;
			align-items: center;
			background: $bg-color;
			border-radius: $radius-sm;
			padding: 0 $spacing-md;
			height: 88rpx;
			
			.prefix {
				font-size: $font-size-md;
				color: $text-main;
				margin-right: $spacing-md;
			}
			
			.input {
				flex: 1;
				height: 100%;
				font-size: $font-size-md;
				color: $text-main;
			}
			
			.code-btn {
				min-width: 200rpx;
				height: 60rpx;
				line-height: 60rpx;
				background: $primary-gradient;
				border-radius: $radius-sm;
				color: $text-white;
				font-size: $font-size-sm;
				padding: 0 $spacing-sm;
				margin: 0;
				border: none;
				
				&[disabled] {
					opacity: $opacity-disabled;
					background: $gray-4;
				}
				
				&:active {
					opacity: $opacity-hover;
				}
			}
		}
	}
}

.submit-section {
	margin-top: 80rpx;
	
	.submit-btn {
		width: 100%;
		height: 88rpx;
		background: $primary-gradient;
		border-radius: $radius-lg;
		color: $text-white;
		font-size: $font-size-lg;
		border: none;
		
		&[disabled] {
			opacity: $opacity-disabled;
			background: $gray-4;
		}
		
		&:active {
			opacity: $opacity-hover;
		}
	}
}

.placeholder-style {
	color: $text-light;
}
</style> 