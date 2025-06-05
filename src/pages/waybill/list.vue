<template>
	<view class="waybill-list">
		<!-- 列表 -->
		<scroll-view scroll-y class="list-container" @scrolltolower="loadMore">
			<view class="waybill-item" v-for="item in waybillList" :key="item.id" @tap="showDetail(item)">
				<view class="waybill-header">
					<text class="waybill-number">{{item.waybill_number}}</text>
					<text class="waybill-status" :class="item.status">
						{{statusMap[item.status]}}
					</text>
				</view>

				<view class="route-info">
					<text class="company">{{item.sender_company}}</text>
					<text class="iconfont function-icon">&#xe676;</text>
					<text class="company">{{item.receiver_company}}</text>
				</view>

				<view class="bottom-info">
					<text class="create-time">{{formatDate(item.issue_time)}}</text>
					
					<button class="assign-btn" @tap.stop="showDriverSelect(item)" :disabled="item.status !== 'created'">
						分配
					</button>
				</view>
			</view>

			<!-- 加载更多 -->
			<view class="loading-more" v-if="waybillList.length < 1">
				<text>暂无数据...</text>
			</view>
		</scroll-view>

		<!-- 添加按钮 -->
		<view class="add-btn" @tap="goToAdd">
			<text class="iconfont">&#xe6da;</text>
		</view>

		<!-- 司机选择弹窗 -->
		<view class="popup-mask" v-if="showDriverPopup" @tap="closeDriverPopup"></view>
		<view class="driver-popup" v-if="showDriverPopup">
			<view class="popup-header">
				<text class="title">选择司机</text>
				<text class="close-btn" @tap="closeDriverPopup">×</text>
			</view>

			<scroll-view scroll-y class="driver-list">
				<view class="driver-item" v-for="driver in drivers" :key="driver.id"
					:class="{ active: selectedDriver?.u_id === driver.u_id }" @tap="selectDriver(driver)">
					<image class="avatar" :src="driver.avatar" mode="aspectFill"></image>
					<view class="driver-info">
						<text class="name">{{driver.driver_name}}</text>
						<text class="phone">{{driver.driver_phone}}</text>
					</view>
					<text class="select-icon" v-if="selectedDriver?.id === driver.id">✓</text>
				</view>
			</scroll-view>

			<view class="popup-footer">
				<button class="cancel-btn" @tap="closeDriverPopup">
					取消
				</button>
				<button class="confirm-btn" @tap="handleAssignDriver" :disabled="!selectedDriver">
					确认分配
				</button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import config from '@/config'

	import {
		getWaybills,
		assignWaybills
	} from '@/api/waybills.js'
	import {
		useDirvers
	} from '@/composables/driver.js'
	
	
	const {
		getDriverList,
		drivers
	} = useDirvers();

	// 状态映射
	const statusMap = {
		created: '已创建',
		assigned: '已分配',
		auditing: '审核中',
		approved: '已审核',
		completed: '已完成'
	}

	// 列表数据
	const waybillList = ref([])
	const page = ref(1)
	const pageSize = 10
	const hasMore = ref(true)

	// 司机选择相关
	const showDriverPopup = ref(false)
	const driverList = ref([])
	const selectedDriver = ref(null)
	const currentWaybill = ref(null)

	// 格式化日期
	const formatDate = (dateString) => {
		const date = new Date(dateString)
		return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
	}

	// 显示运单详情
	const showDetail = (waybill) => {
		uni.navigateTo({
			url: `/pages/waybill/detail?id=${waybill.id}`
		})
	}

	// 获取运单列表
	const fetchWaybillList = async (isRefresh = false) => {
		try {
			uni.showLoading({
				title:'获取运单列表'
			})
			const res = await getWaybills()
			waybillList.value = res.data
			uni.hideLoading()
		} catch (error) {
			uni.showToast({
				title: '获取运单列表失败',
				icon: 'none'
			})
		}
	}

	// 加载更多
	const loadMore = () => {
		if (hasMore.value) {
			fetchWaybillList()
		}
	}

	// 显示司机选择弹窗
	const showDriverSelect = (waybill) => {
		currentWaybill.value = waybill
		selectedDriver.value = null
		showDriverPopup.value = true
		getDriverList()
	}

	// 关闭司机选择弹窗
	const closeDriverPopup = () => {
		showDriverPopup.value = false
		selectedDriver.value = null
		currentWaybill.value = null
	}

	// 选择司机
	const selectDriver = (driver) => {
		console.log(driver)
		selectedDriver.value = driver
	}

	// 分配司机
	const handleAssignDriver = async () => {
		if (!selectedDriver.value || !currentWaybill.value) return
		console.log(selectedDriver.value)
		console.log(currentWaybill.value)
		try {
			uni.showLoading({
				title: '分配中...',
				mask: true
			})
			const res = await assignWaybills({
					waybill_id: currentWaybill.value.id,
					driver_id: selectedDriver.value.u_id
				})
			// const res = await uni.request({
			// 	url: `${config.apiBaseUrl}/api/waybill/assign`,
			// 	method: 'POST',
			// 	data: {
			// 		waybillId: currentWaybill.value.id,
			// 		driverId: selectedDriver.value.id
			// 	}
			// })
			

			// if (res.statusCode === 200 && res.data.code === 0) {
			// 	uni.showToast({
			// 		title: '分配成功',
			// 		icon: 'success'
			// 	})
				closeDriverPopup()
				fetchWaybillList(true)
			// } else {
			// 	throw new Error(res.data.message || '分配失败')
			// }
		} catch (error) {
			uni.showToast({
				title: error.message || '分配失败',
				icon: 'none'
			})
		} finally {
			uni.hideLoading()
		}
	}

	// 跳转到添加运单页面
	const goToAdd = () => {
		uni.navigateTo({
			url: '/pages/waybill/add'
		})
	}

	// 页面加载
	onMounted(() => {
		fetchWaybillList(true)
	})
</script>

<style lang="scss">
	.waybill-list {
		min-height: 100vh;
		background-color: #F8F8F8;
		padding: 0;
	}

	.list-container {
		height: 100vh;
	}

	.waybill-item {
		background: #FFFFFF;
		border-radius: 0;
		padding: 24rpx 32rpx;
		margin-bottom: 2rpx;
	}

	.waybill-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16rpx;

		.waybill-number {
			font-size: 36rpx;
			color: #1890FF;
			font-weight: 700;
		}

		.waybill-status {
			font-size: 24rpx;
			padding: 4rpx 12rpx;
			border-radius: 4rpx;

			&.created {
				background: #FFF7E6;
				color: #FA9D3B;
			}

			&.assigned {
				background: #E6F7FF;
				color: #1890FF;
			}

			&.auditing {
				background: #E6F7FF;
				color: #1890FF;
			}

			&.approved {
				background: #E6F7FF;
				color: #1890FF;
			}

			&.completed {
				background: #F6FFED;
				color: #52C41A;
			}
		}
	}


	.route-info {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;

		.company {
			font-size: 28rpx;
			color: #333333;
			flex: 1;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.iconfont {
			font-size: 80rpx;
			color: $primary-color;
			margin: 0 20rpx
			// width: 180rpx;
			// height: 110rpx;
		}

		.arrow {
			font-size: 28rpx;
			color: #999999;
			margin: 0 16rpx;
		}
	}

	.bottom-info {
		display: flex;
		justify-content: space-between; 
		align-items: center;

		.create-time {
			font-size: 24rpx;
			color: #999999;
			display: inline-block;
		}

		.assign-btn {
			padding: 8rpx 24rpx;
			background: #F7DB1C;
			color: #333333;
			font-size: 24rpx;
			border-radius: 4rpx;
			border: none;
			min-width: 100rpx;
			text-align: center;
			margin: 0;
			&[disabled] {
				opacity: 0.5;
				background: #CCCCCC;
			}

			&:active {
				opacity: 0.8;
			}
		}
	}

	/* 司机选择弹窗 */
	.popup-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 100;
	}

	.driver-popup {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background: $bg-white;
		border-radius: $radius-lg $radius-lg 0 0;
		z-index: 101;
		max-height: 70vh;
		display: flex;
		flex-direction: column;
	}

	.popup-header {
		padding: $spacing-lg;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 2rpx solid $border-color;

		.title {
			font-size: $font-size-lg;
			font-weight: bold;
			color: $text-main;
		}

		.close-btn {
			font-size: 48rpx;
			color: $text-light;
			line-height: 1;
		}
	}

	.driver-list {
		flex: 1;
		padding: 0 $spacing-lg;
		max-height: 60vh;
	}

	.driver-item {
		display: flex;
		align-items: center;
		padding: $spacing-md 0;
		border-bottom: 2rpx solid $border-color;

		&.active {
			background: rgba($primary-color, 0.05);
		}

		.avatar {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			margin-right: $spacing-md;
		}

		.driver-info {
			flex: 1;

			.name {
				font-size: $font-size-md;
				color: $text-main;
				margin-bottom: 4rpx;
			}

			.phone {
				font-size: $font-size-sm;
				color: $text-secondary;
			}
		}

		.select-icon {
			font-size: 40rpx;
			color: $primary-color;
			margin-left: $spacing-md;
		}
	}

	.popup-footer {
		padding: $spacing-lg;
		display: flex;
		justify-content: space-between;
		border-top: 2rpx solid $border-color;

		button {
			flex: 1;
			height: 80rpx;
			border-radius: $radius-lg;
			font-size: $font-size-md;
			border: none;

			&.cancel-btn {
				background: $bg-color;
				color: $text-main;
				margin-right: $spacing-md;
			}

			&.confirm-btn {
				background: $primary-gradient;
				color: $text-white;

				&[disabled] {
					opacity: $opacity-disabled;
					background: $gray-4;
				}
			}

			&:active {
				opacity: $opacity-hover;
			}
		}
	}

	.loading-more {
		text-align: center;
		padding: $spacing-md;
		color: $text-light;
		font-size: $font-size-sm;
	}

	/* 添加按钮 */
	.add-btn {
		position: fixed;
		right: 32rpx;
		bottom: 32rpx;
		width: 100rpx;
		height: 100rpx;
		background: $primary-color;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
		z-index: 99;

		.iconfont {
			font-size: 48rpx;
			color: #FFFFFF;
		}

		&:active {
			opacity: 0.8;
		}
	}
</style>