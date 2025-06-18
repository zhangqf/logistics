<template>
	<view class="container">
		<!-- 顶部搜索区域 -->
		<view class="search-section">
			<!-- <image class="banner-image" :src="banner" mode="aspectFill"></image> -->
			<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
				:duration="duration">
				<swiper-item>
					<view class="swiper-item uni-bg-red">
						<image class="banner-image" :src="banner11" mode="aspectFill"></image>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item uni-bg-green">
						<image class="banner-image" :src="banner21" mode="aspectFill"></image>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item uni-bg-blue">
						<image class="banner-image" :src="banner31" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
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
					<text class="notice-text">干云物流祝您一路顺风</text>
				</swiper-item>
			</swiper>
		</view>

		<!-- 功能按钮组 -->
		<view class="function-group">
			<view class="function-item" v-for="(item, index) in functionItems" :key="index"
				@tap="handleFunctionTap(item.type)">
				<!-- <text class="iconfont function-icon" :class="'icon-' + item.type"></text> -->
				<image class="icon-image" :src="item.icon" mode="aspectFill"></image>
				<text class="function-text">{{item.name}}</text>
			</view>
		</view>

		<!-- 货主列表区域 -->
		<view class="cargo-section">
			<view class="section-header">
				<text class="section-title">货主列表</text>
				<button v-if="userStore.userInfo.role !== 'driver'" class="add-btn" @tap="handleAddCargo">添加货主</button>
			</view>
			<view class="cargo-list">
				<!-- 这里可以添加货主列表内容 -->
				<!-- <uni-grid :column="3" :square="true" :highlight="false" @change="change">
					<uni-grid-item v-for="(item, index) in shipperList" :index="index" :key="index">
						<view class="grid-item-box">

							<text class="text">{{ item.company_name }}</text>
						</view>
					</uni-grid-item>
				</uni-grid> -->
				<uni-grid :column="3" :highlight="true" @change="change">
					<uni-grid-item v-for="(item, index) in shipperList" :index="index" :key="index">
						<view class="grid-item-box" style="background-color: #fff;border-radius: 10rpx;">
							<!-- <uni-icons type="image" :size="30" color="#777" /> -->
							<text class="text">{{item.company_name}}</text>
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		watchEffect
	} from 'vue'

	import {
		useUserStore
	} from '../../stores/user';

	import {
		useShippers
	} from '@/utils/shipper.js'


	import banner1 from '@/static/banner/1.jpg'
	import banner2 from '@/static/banner/12.jpg'
	import banner3 from '@/static/banner/123.jpg'
	import dj from '@/static/icon/dj.jpg'
	import lb from '@/static/icon/lb.jpg'
	import r from '@/static/icon/r.jpg'
	import xc from '@/static/icon/xc.jpg'

	const {
		getShippers,
		shipperList
	} = useShippers();


	// 功能按钮数据
	const functionItems = ref([{
			name: '消息通知',
			type: 'message',
			icon: lb
		},
		{
			name: '运单查核',
			type: 'waybill',
			icon: xc
		},
		{
			name: '实名认证',
			type: 'verify',
			icon: r
		},
		{
			name: '货源广场',
			type: 'cargo',
			icon: dj
		}
	])

	const userStore = useUserStore()
	const background = ['color1', 'color2', 'color3']
	const indicatorDots = true
	const autoplay = true
	const interval = 2000
	const duration = 500
	const banner11 = banner1
	const banner21 = banner2
	const banner31 = banner3

	// 处理功能按钮点击
	const handleFunctionTap = async (type) => {
		console.log('Function clicked:', type)
		if (type === 'verify') {
			await userStore.fetchGetUserInfo()
			uni.navigateTo({
				url: '/waybill/pages/verify/verify'
			})
		}
		if(!userStore.userInfo.is_approved) {
			uni.showToast({
				title: '请先实名认证',
				icon: 'none'
			})
			return
		}
		if (type === 'waybill') {
			// await userStore.fetchGetUserInfo()
			uni.navigateTo({
				url: '/waybill/pages/waybill/list'
			})
		}

	}
	const token = ref(uni.getStorageSync('token') || null)
	// 监听token变化
	watchEffect(() => {
		if (token.value) {
			getShippers()
		}
	})


	// 处理添加货主
	const handleAddCargo = () => {
		console.log('Add cargo owner clicked')
		if(!userStore.userInfo.is_approved) {
			uni.showToast({
				title: '请先实名认证',
				icon: 'none'
			})
			return
		}
		uni.navigateTo({
			url: '/waybill/pages/shipper/add'
		})
	}
</script>

<style lang="scss">
	@use '@/styles/index.scss';

	.grid-item-box {
		flex: 1;
		// position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		height: 150rpx;
		padding: 10rpx;

		.text {
			text-align: center;
		}
	}

	.container {
		min-height: 100vh;
		background-color: $bg-color;
	}

	/* 搜索区域样式 */
	.search-section {
		position: relative;
		width: 100%;
		height: 400rpx;

		.swiper {
			width: 100%;
			height: 300rpx;
		}

		.swiper-item {
			display: block;
			height: 300rpx;
			line-height: 300rpx;
			width: 100%;
			text-align: center;

			.banner-image {
				width: 100%;
				height: 100%;
			}
		}

	}

	// .banner-image {
	// 	width: 100%;
	// 	height: 100%;
	// }

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

		.icon-image {
			width: 80rpx;
			height: 80rpx;
		}

		.function-icon {
			font-size: 80rpx;
			margin-bottom: 12rpx;

			&.icon-message {
				// color: #ff6b6b;
				color: #fff122;
			}

			&.icon-waybill {
				// color: #4ecdc4;
				color: #fff122;
			}

			&.icon-verify {
				// color: #45b7af;
				color: #fff122;
			}

			&.icon-cargo {
				// color: #96c93d;
				color: #fff122;
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