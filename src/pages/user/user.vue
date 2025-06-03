<template>
	<view class="user-container">
		<!-- 用户信息区域 -->
		<view class="user-info-section">
			<view class="user-info" v-if="isLogin">
				<image class="avatar" :src="userInfo.avatarUrl || '/static/images/default-avatar.png'" mode="aspectFill"></image>
				<view class="info">
					<text class="nickname">{{userInfo.nickName || '未设置昵称'}}</text>
					<text class="phone">{{userInfo.phone || '未绑定手机号'}}</text>
				</view>
			</view>
			<view class="login-section" v-else>
				<image class="default-avatar" src="/static/images/default-avatar.png" mode="aspectFill"></image>
				<button class="login-btn" @tap="handleLoginClick">
					<text class="iconfont icon-wechat"></text>
					立即登录
				</button>
			</view>
		</view>

		<!-- 菜单列表 -->
		<view class="menu-list">
			<view class="menu-item" v-for="(item, index) in menuItems" :key="index" @tap="handleMenuClick(item)">
				<view class="left">
					<text class="iconfont" :class="item.icon" :style="{color: item.color}"></text>
					<text class="title">{{item.title}}</text>
				</view>
				<text class="iconfont icon-arrow-right"></text>
			</view>
		</view>

		<!-- 退出登录 -->
		<view class="logout-section" v-if="isLogin">
			<button class="logout-btn" @tap="handleLogout">退出登录</button>
		</view>
	</view>
</template>

<script>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

export default {
	setup() {
		const userStore = useUserStore()
		
		// 登录状态
		const isLogin = computed(() => userStore.isLogin)
		
		// 用户信息
		const userInfo = computed(() => userStore.userInfo)
		
		// 菜单项
		const menuItems = ref([
			{
				title: '货主信息',
				icon: 'icon-shipper',
				color: '#4080FF',
				path: '/pages/shipper/info'
			},
			{
				title: '司机信息',
				icon: 'icon-driver',
				color: '#9FDB1D',
				path: '/pages/driver/info'
			},
			{
				title: '运单信息',
				icon: 'icon-order',
				color: '#F7BA1E',
				path: '/pages/waybill/list'
			},
			{
				title: '客服服务',
				icon: 'icon-service',
				color: '#FF7D00',
				path: '/pages/service/index'
			},
			{
				title: '关于我们',
				icon: 'icon-about',
				color: '#00B42A',
				path: '/pages/about/index'
			}
		])

		// 处理登录按钮点击
		const handleLoginClick = () => {
			uni.navigateTo({
				url: '/pages/login/index'
			})
		}

		// 处理菜单点击
		const handleMenuClick = (item) => {
			if (!isLogin.value && item.path !== '/pages/login/index') {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				})
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/login/index'
					})
				}, 1500)
				return
			} else {
				uni.navigateTo({
					url: item.path
				})
			}
			
		}

		// 处理退出登录
		const handleLogout = () => {
			uni.showModal({
				title: '提示',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						userStore.logout()
						uni.showToast({
							title: '已退出登录',
							icon: 'success'
						})
					}
				}
			})
		}

		return {
			isLogin,
			userInfo,
			menuItems,
			handleLoginClick,
			handleMenuClick,
			handleLogout
		}
	}
}
</script>

<style lang="scss">
@use '../../styles/index.scss' as *;

.user-container {
	min-height: 100vh;
	background-color: $bg-color;
	padding-bottom: env(safe-area-inset-bottom);
}

.user-info-section {
	background: $bg-white;
	padding: $spacing-lg;
	margin-bottom: $spacing-md;
	
	.user-info {
		display: flex;
		align-items: center;
		
		.avatar {
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			margin-right: $spacing-lg;
		}
		
		.info {
			flex: 1;
			
			.nickname {
				font-size: $font-size-lg;
				color: $text-main;
				font-weight: 500;
				margin-bottom: $spacing-sm;
			}
			
			.phone {
				font-size: $font-size-md;
				color: $text-secondary;
			}
		}
	}
	
	.login-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: $spacing-lg 0;
		
		.default-avatar {
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			margin-bottom: $spacing-lg;
		}
		
		.login-btn {
			background: $primary-gradient;
			border: none;
			border-radius: $radius-lg;
			color: $text-white;
			font-size: $font-size-lg;
			padding: 0 $spacing-xl;
			height: 88rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			
			.icon-wechat {
				font-size: 40rpx;
				margin-right: $spacing-sm;
			}
			
			&:active {
				opacity: $opacity-hover;
			}
		}
	}
}

.menu-list {
	background: $bg-white;
	
	.menu-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: $spacing-lg;
		border-bottom: 1rpx solid $border-color;
		
		&:last-child {
			border-bottom: none;
		}
		
		.left {
			display: flex;
			align-items: center;
			
			.iconfont {
				font-size: 40rpx;
				margin-right: $spacing-md;
			}
			
			.title {
				font-size: $font-size-md;
				color: $text-main;
			}
		}
		
		.icon-arrow-right {
			font-size: 32rpx;
			color: $text-light;
		}
		
		&:active {
			background: $bg-color;
		}
	}
}

.logout-section {
	padding: $spacing-xl $spacing-lg;
	
	.logout-btn {
		width: 100%;
		height: 88rpx;
		background: $bg-white;
		border: 1rpx solid $border-color;
		border-radius: $radius-lg;
		color: $danger-color;
		font-size: $font-size-lg;
		
		&:active {
			opacity: $opacity-hover;
		}
	}
}
</style>
