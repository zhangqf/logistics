<template>
	<view class="driver-container">
		<!-- 顶部搜索区域 -->
		<view class="search-section">
			<view class="search-box">
				<text class="iconfont icon-search"></text>
				<input type="text" v-model="searchText" placeholder="搜索司机姓名/电话" placeholder-class="placeholder-style" />
			</view>
		</view>

		<!-- 司机列表 -->
		<view class="driver-list" v-if="drivers.length > 0">
			<view class="driver-item" v-for="(item, index) in drivers" :key="index" @tap="handleDriverTap(item)">
				<view class="driver-info">
					<view class="main-info">
						<text class="name">{{item.driver_name}}</text>
						<text class="phone">{{item.phone}}</text>
					</view>
					<view class="plate-number">
						<text class="label">车牌号：</text>
						<text class="value">{{item.driver_license_plate}}</text>
					</view>
				</view>
				<text class="iconfont icon-arrow-right"></text>
			</view>
		</view>

		<!-- 空状态 -->
		<view class="empty-state" v-else>
			<text class="iconfont icon-empty"></text>
			<text class="empty-text">暂无司机信息</text>
		</view>

		<!-- 添加按钮 -->
		<!-- <view class="add-btn" @tap="handleAddDriver">
			<text class="iconfont icon-add"></text>
			<text>添加司机</text>
		</view> -->
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		getDriverInfo
	} from '@/waybill/api/driver.js'
	import {
		useDirvers
	} from '@/waybill/composables/driver.js'


	const {
		getDriverList,
		drivers
	} = useDirvers();

	const searchText = ref('')

	const handleDriverTap = (driver) => {
		console.log('点击司机:', driver)
		// 可以跳转到司机详情页
	}

	// const fetchDiriverList = async () => {
	// 	try {
	// 		const res = await getDriverInfo()
	// 		console.log(res)
	// 		drivers.value = res.data

	// 	} catch (e) {
	// 		uni.showToast({
	// 			title: '获取司机列表失败',
	// 			icon: 'none'
	// 		})
	// 	}
	// }

	const handleAddDriver = () => {
		uni.navigateTo({
			url: '/pages/driver/add'
		})
	}
	getDriverList()
</script>

<style lang="scss">
	@use '@/styles/iconfont.scss';
	@use '@/styles/index.scss';

	.driver-container {
		min-height: 100vh;
		background-color: $bg-color;
		padding-bottom: 120rpx; // 为悬浮按钮留出空间
	}

	.search-section {
		padding: $spacing-md;
		background-color: $bg-white;
		position: sticky;
		top: 0;
		z-index: 1;

		.search-box {
			display: flex;
			align-items: center;
			height: 72rpx;
			background: $bg-color;
			border-radius: $radius-lg;
			padding: 0 $spacing-md;

			.icon-search {
				font-size: 36rpx;
				color: $text-light;
				margin-right: $spacing-sm;
			}

			input {
				flex: 1;
				height: 100%;
				font-size: $font-size-md;
			}
		}
	}

	.placeholder-style {
		color: $text-light;
	}

	.driver-list {
		margin-top: $spacing-sm;
		background-color: $bg-white;

		.driver-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: $spacing-lg;
			border-bottom: 1rpx solid $border-color;

			.driver-info {
				flex: 1;
				margin-right: $spacing-md;

				.main-info {
					display: flex;
					align-items: center;
					margin-bottom: $spacing-sm;

					.name {
						font-size: $font-size-lg;
						color: $text-main;
						font-weight: 500;
						margin-right: $spacing-md;
					}

					.phone {
						font-size: $font-size-md;
						color: $text-secondary;
					}
				}

				.plate-number {
					display: flex;
					align-items: center;

					.label {
						font-size: $font-size-sm;
						color: $text-light;
					}

					.value {
						font-size: $font-size-md;
						color: $default-color;
						font-weight: 500;
					}
				}
			}

			.icon-arrow-right {
				font-size: 32rpx;
				color: $text-light;
			}

			&:active {
				background-color: $bg-color;
			}
		}
	}

	.empty-state {
		margin-top: 200rpx;
		display: flex;
		flex-direction: column;
		align-items: center;

		.icon-empty {
			font-size: 120rpx;
			color: $text-light;
			margin-bottom: $spacing-md;
		}

		.empty-text {
			font-size: $font-size-md;
			color: $text-light;
		}
	}

	.add-btn {
		position: fixed;
		bottom: $spacing-lg;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 90%;
		height: 88rpx;
		background: $primary-gradient;
		border-radius: $radius-lg;
		box-shadow: 0 4rpx 16rpx rgba($primary-color, 0.3);

		.icon-add {
			font-size: 40rpx;
			color: $text-white;
			margin-right: $spacing-sm;
		}

		text {
			color: $text-white;
			font-size: $font-size-lg;
		}

		&:active {
			opacity: $opacity-hover;
		}
	}
</style>