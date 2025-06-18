<template>
	<view class="shipper-container">
		<!-- 顶部搜索区域 -->
		<!-- <view class="search-section">
			<view class="search-box">
				<text class="iconfont icon-search"></text>
				<input type="text" v-model="searchText" placeholder="搜索公司名称" placeholder-class="placeholder-style" />
			</view>
		</view> -->

		<!-- 公司列表 -->
		<view class="company-list" v-if="companies.length > 0">
			<view class="company-item" v-for="(item, index) in companies" :key="index" @tap="handleCompanyTap(item)">
				<view class="company-info">
					<view class="company-name">{{item.company_name}}</view>
					<view class="company-code">统一社会信用代码：{{item.credit_code}}</view>
				</view>
				<text class="iconfont icon-arrow-right"></text>
			</view>
		</view>

		<!-- 空状态 -->
		<view class="empty-state" v-else>
			<text class="iconfont icon-empty"></text>
			<text class="empty-text">暂无货主信息</text>
		</view>

		<!-- 添加按钮 -->
		<view class="bottom-buttons">
			<!-- 	<text class="iconfont icon-add"></text>
			<text>添加货主</text> -->
			<button class="primary-btn" @tap="handleAddShipper">添加货主</button>
		</view>
	</view>
</template>

<script>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		getShipper
	} from '@/waybill/api/shipper.js'
	import {
		onShow
	} from '@dcloudio/uni-app'
	export default {
		setup() {
			const searchText = ref('')
			const companies = ref([

			])

			const handleCompanyTap = (company) => {
				console.log('点击公司:', company)
				const id = company.id
				// 可以跳转到公司详情页
				uni.navigateTo({
					url: '/waybill/pages/shipper/detail?id=' + id
				})
			}

			const handleAddShipper = () => {
				uni.navigateTo({
					url: '/waybill/pages/shipper/add'
				})
			}
			const getList = async () => {
				uni.showLoading({
					title: '加载中...'
				})
				try {
					const {
						data
					} = await getShipper()
					companies.value = data
				} catch (e) {
					//TODO handle the exception
				} finally {
					uni.hideLoading()
				}

			}
			onShow(() => {
				getList()
			})
			return {
				searchText,
				companies,
				handleCompanyTap,
				handleAddShipper
			}
		},

	}
</script>

<style lang="scss">
	@use '@/styles/iconfont.scss';
	@use '@/styles/index.scss';

	.shipper-container {
		min-height: 100vh;
		background-color: $bg-color;
		padding-bottom: 120rpx; // 为悬浮按钮留出空间
	}

	.search-section {
		padding: $spacing-md;
		background-color: $bg-white;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;

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

	.company-list {
		margin-top: $spacing-sm;
		padding-bottom: $list-content-middle;

		// padding-top: $list-content-middle;
		.company-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: $spacing-lg;
			border-bottom: 1rpx solid $border-color;
			margin-bottom: 20rpx;
			background-color: $bg-white;

			.company-info {
				flex: 1;
				margin-right: $spacing-md;

				.company-name {
					font-size: $font-size-lg;
					color: $text-main;
					margin-bottom: $spacing-sm;
					font-weight: 500;
				}

				.company-code {
					font-size: $font-size-sm;
					color: $text-light;
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

	.bottom-buttons {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background: #FFFFFF;
		padding: 20rpx 32rpx;
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		display: flex;
		justify-content: space-between;
		box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.05);
		z-index: 1;

		button {
			flex: 1;
			height: 80rpx;
			line-height: 80rpx;
			font-size: 28rpx;
			border-radius: 4rpx;
			margin: 0;

			&+button {
				margin-left: 20rpx;
			}

			&.primary-btn {
				background: #F7DB1C;
				border-radius: 50rpx;
				color: #fff;
				height: 88rpx;
				line-height: 88rpx;
			}

			&.secondary-btn {
				background: #FFFFFF;
				color: #333333;
				border: 2rpx solid #DDDDDD;
			}

			&.success-btn {
				background: #52C41A;
				color: #FFFFFF;
			}

			&:active {
				opacity: 0.8;
			}
		}
	}
</style>