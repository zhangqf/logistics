<template>
	<view class="container">
		<!-- 顶部搜索区域 -->
		<view class="search-section">
			<image class="banner-image" :src="banner" mode="aspectFill"></image>
			<view class="search-box">
				<input type="text" placeholder="海量优质资源任你选" placeholder-class="placeholder-style" />
				<text class="iconfont icon-search"></text>
			</view>
		</view>

		<!-- 通知栏 -->
		<view class="notice-bar">
			<text class="iconfont icon-notice"></text>
			<swiper class="notice-swiper" vertical autoplay circular interval="3000">
				<swiper-item>
					<text class="notice-text">千云物流祝您一路顺风</text>
				</swiper-item>
			</swiper>
		</view>

		<!-- 功能按钮组 -->
		<view class="function-group">
			<view class="function-item" v-for="(item, index) in functionItems" :key="index" @tap="handleFunctionTap(item.type)">
				<text class="iconfont function-icon" :class="'icon-' + item.type"></text>
				<text class="function-text">{{item.name}}</text>
			</view>
		</view>

		<!-- 货主列表区域 -->
		<view class="cargo-section">
			<view class="section-header">
				<text class="section-title">货主列表</text>
				<button class="add-btn" @tap="handleAddCargo">添加货主</button>
			</view>
			<view class="cargo-list">
				<!-- 这里可以添加货主列表内容 -->
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { banner } from '@/static/icons/icons.js'
import { useUserStore } from '../../stores/user';

// 功能按钮数据
const functionItems = ref([
	{ name: '消息通知', type: 'message' },
	{ name: '运单查核', type: 'waybill' },
	{ name: '实名认证', type: 'verify' },
	{ name: '货源广场', type: 'cargo' }
])

const userStore = useUserStore()

// 处理功能按钮点击
const handleFunctionTap = async (type) => {
	console.log('Function clicked:', type)
	if(type === 'verify') {
		userStore.fetchGetUserInfo()
		uni.navigateTo({
			url:'/pages/verify/verify'
		})
	}
}

// 处理添加货主
const handleAddCargo = () => {
	console.log('Add cargo owner clicked')
}
</script>

<style lang="scss">

.container {
	min-height: 100vh;
	background-color: $bg-color;
}

/* 搜索区域样式 */
.search-section {
	position: relative;
	width: 100%;
	height: 400rpx;
}

.banner-image {
	width: 100%;
	height: 100%;
}

.search-box {
	position: absolute;
	bottom: $spacing-lg;
	left: $spacing-lg;
	right: $spacing-lg;
	height: 80rpx;
	background: $bg-white;
	border-radius: $radius-lg;
	display: flex;
	align-items: center;
	padding: 0 $spacing-md;
	box-shadow: $shadow-2;

	input {
		flex: 1;
		height: 100%;
		font-size: $font-size-md;
	}

	.iconfont {
		font-size: 40rpx;
		color: $text-light;
	}
}

.placeholder-style {
	color: $text-light;
}

/* 通知栏样式 */
.notice-bar {
	margin: $spacing-sm;
	padding: $spacing-sm;
	background: rgba($primary-color, 0.05);
	border-radius: $radius-md;
	display: flex;
	align-items: center;

	.iconfont {
		font-size: 40rpx;
		color: $primary-color;
		margin-right: $spacing-sm;
	}
}

.notice-swiper {
	flex: 1;
	height: 60rpx;
}

.notice-text {
	font-size: $font-size-md;
	color: $text-main;
}

/* 功能按钮组样式 */
.function-group {
	margin: $spacing-sm;
	padding: $spacing-md;
	background: $bg-white;
	border-radius: $radius-md;
	display: flex;
	justify-content: space-between;
}

.function-item {
	display: flex;
	flex-direction: column;
	align-items: center;

	.function-icon {
		font-size: 80rpx;
		margin-bottom: 12rpx;
		
		&.icon-message {
			color: #ff6b6b;
		}
		
		&.icon-waybill {
			color: #4ecdc4;
		}
		
		&.icon-verify {
			color: #45b7af;
		}
		
		&.icon-cargo {
			color: #96c93d;
		}
	}
}

.function-text {
	font-size: $font-size-sm;
	color: $text-main;
}

/* 货主列表区域样式 */
.cargo-section {
	margin: $spacing-sm;
	padding: $spacing-md;
	background: $bg-white;
	border-radius: $radius-md;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: $spacing-sm;
}

.section-title {
	font-size: $font-size-lg;
	font-weight: bold;
	color: $text-main;
}

.add-btn {
	padding: 10rpx $spacing-md;
	background: $primary-color;
	color: $text-white;
	font-size: $font-size-md;
	border-radius: $radius-sm;
	border: none;
	line-height: 1.5;

	&:active {
		opacity: $opacity-hover;
	}
}

.cargo-list {
	min-height: 200rpx;
}
</style>
