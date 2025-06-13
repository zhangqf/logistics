<template>
	<view class="waybill-list">

		<!-- 列表 -->
		<scroll-view scroll-y class="list-container" @scrolltoupper="loadMore">
			<view class="waybill-item" v-for="item in waybillList" :key="item.id" @tap="showDetail(item)">
				<view class="waybill-header">
					<view style="display: flex; align-items: center;"><text class="iconfont"
							style="font-size: 48rpx;margin-right: 18rpx; color: #1623ad;">&#xe672;</text><text
							class="waybill-number" :class="item.status">{{item.waybill_number}}</text>
					</view>
					<text class="waybill-status" :class="item.status">
						{{statusMap[item.status]}}
					</text>
				</view>

				<view class="route-info">
					<text class="company">{{item.sender_company_name}}</text>
					<text class="iconfont">&#xe676;</text>
					<text class="company">{{item.receiver_company}}</text>
				</view>
				<view class="materialInfo">
					<text>{{item.material_info}}</text>
					<!-- <text class="company">{{item.receiver_company}}</text> -->
				</view>
				<view style="text-align: center; color: #7f7f7f;">{{formatDate(item.issue_time)}}</view>
				<view class="bottom-info">


					<button v-if="userRole!=='driver'" class="assign-btn" @tap.stop="showDriverSelect(item)"
						:disabled="item.status !== 'created'">
						分配
					</button>
					<text class="license-plate">
						<text>{{item.license_plate}}</text>
					</text>
				</view>
			</view>
			<view class="" style="width: 100%; height: 150rpx;">

			</view>
			<!-- 加载更多 -->
			<view class="loading-more" v-if="waybillList.length < 1">
				<text>暂无数据...</text>
			</view>
		</scroll-view>

		<!-- 添加按钮 -->
		<view v-if="userRole!=='driver'" class="add-btn" @tap="goToAdd">
			<text class="icon iconfont">&#xe727;</text>
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
					:class="{ active: selectedDriver?.id === driver.id }" @tap="selectDriver(driver)">
					<!-- <image class="avatar" :src="driver.avatar" mode="aspectFill"></image> -->
					<view class="driver-info">
						<view style="display: flex;justify-content: space-between;">
							<text class="name">{{driver.driver_name}}</text>
							<text class="plate">{{driver.driver_license_plate}}</text>
						</view>
						<text class="phone">{{driver.phone}}</text>
					</view>
					<!-- <text class="select-icon" v-if="selectedDriver?.id === driver.id">✓</text> -->
				</view>
				<view class="driver-item empty">
				</view>
			</scroll-view>

			<view class="footer">
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
	} from '@/waybill/api/waybills.js'
	import {
		useDirvers
	} from '@/waybill/composables/driver.js'
	import {
		useUserStore
	} from '@/stores/user'
	import {
		onShow
	} from '@dcloudio/uni-app'



	const {
		getDriverList,
		drivers
	} = useDirvers();

	const userStore = useUserStore()

	const userRole = ref(userStore.userInfo?.role || '')

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
		console.log(waybill)
		console.log('waybill')
		if (!waybill.detail_info) {
			return
		}
		if (userStore.userInfo?.role === 'admin' && waybill.status === 'assigned') {
			uni.showToast({
				title: '等待司机提交审核',
				icon: 'none'
			})
			return
		}
		if (userStore.userInfo?.role === 'admin' && waybill.status === 'created') {
			uni.showToast({
				title: '待分配给司机',
				icon: 'none'
			})
			return
		}
		uni.navigateTo({
			url: `/waybill/pages/waybill/detail?id=${waybill.detail_info.id}&bgid=${waybill.sender_company}`
		})
	}

	// 获取运单列表
	const fetchWaybillList = async (isRefresh = false) => {
		try {
			uni.showLoading({
				title: '获取运单列表'
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
		console.log("阿萨德噶傻大个")
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
		console.log(currentWaybill.value.detail_info)
		try {
			uni.showLoading({
				title: '分配中...',
				mask: true
			})
			const res = await assignWaybills({
				waybill_id: currentWaybill.value.id,
				driver_id: selectedDriver.value.id
			})
			// const res = await uni.request({
			// 	url: `${config.apiBaseUrl}/api/waybill/assign`,
			// 	method: 'POST',
			// 	data: {
			// 		waybillId: currentWaybill.value.id,
			// 		driverId: selectedDriver.value.id
			// 	}
			// })


			if (res.data.selfErrorCode === 0) {
				uni.showToast({
					title: '分配成功',
					icon: 'success'
				})
				closeDriverPopup()
				fetchWaybillList(true)
			} else {
				throw new Error(res.data.message || '分配失败')
			}
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
			url: '/waybill/pages/waybill/add'
		})
	}

	// 页面加载
	onShow(() => {
		fetchWaybillList(true)
	})
</script>

<style lang="scss">
	@use '@/styles/index.scss';

	@font-face {
		font-family: iconfont;
		src: url('@/static/font/iconfont.ttf');
	}

	// .warpper{
	// 	padding-bottom: calc(80rpx + env(safe-area-inset-bottom));
	// }
	.waybill-list {
		min-height: 100vh;
		background-color: $bg-color;

	}

	.list-container {
		height: 100vh;
		padding-bottom: 0;
	}

	.waybill-item {
		background: #FFFFFF;
		border-radius: 0;
		padding: 24rpx 32rpx;
		margin-bottom: 20rpx;

	}

	.waybill-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16rpx;

		.waybill-number {
			font-size: 28rpx;
			color: #1890FF;
			// font-weight: 700;

			&.created {
				// background: #FFF7E6;
				color: #FA9D3B;
			}

			&.assigned {
				// background: #E6F7FF;
				color: #1890FF;
			}

			&.auditing {
				// background: #E6F7FF;
				color: #24be29;
			}

			&.approved {
				// background: #E6F7FF;
				color: #a61dff;
			}

			&.completed {
				// background: #F6FFED;
				color: #31c6a9;
			}
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
				background: #d3ffd9;
				color: #24be29;
			}

			&.approved {
				background: #ffe3f7;
				color: #a61dff;
			}

			&.completed {
				background: #cafff5;
				color: #31c6a9;
			}
		}
	}

	.materialInfo {
		text-align: center;
		font-size: 40rpx;
		color: #555555;
	}

	.route-info {
		display: flex;
		align-items: center;

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
			margin: 0 20rpx // width: 180rpx;
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

		.license-plate {
			font-size: 28rpx;
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
				opacity: 1;
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
		padding-bottom: calc(env(safe-area-inset-bottom));
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
		// padding: 0 $spacing-lg;
		max-height: 60vh;
		box-sizing: border-box;
	}

	.driver-item {
		display: flex;
		align-items: center;
		padding: $spacing-md $spacing-lg;
		border-bottom: 2rpx solid $border-color1;
		
		&.empty {
			height: 140rpx;
		}

		&.active {
			background: rgba($success-color, 0.15);
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

			.plate {
				color: $text-main;
				border: 2rpx solid $default-color;
				border-radius: 8rpx;
				padding: 10rpx;
				background-color: $default-color;
			}
		}

		.select-icon {
			font-size: 40rpx;
			color: $primary-color;
			margin-left: $spacing-md;

		}
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding-bottom: calc(env(safe-area-inset-bottom));
		background-color: #fff;
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
			line-height: 80rpx;
			&.cancel-btn {
				background: $bg-color;
				color: $text-main;
				margin-right: $spacing-md;
			}

			&.confirm-btn {
				background: $primary-gradient;
				color: $text-main;

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
		bottom: 112rpx;
		width: 100rpx;
		height: 100rpx;
		background: $primary-color;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
		z-index: 99;
		padding: 10rpx;

		.iconfont {
			font-size: 48rpx;
			color: #FFFFFF;
		}

		&:active {
			opacity: 0.8;
		}
	}
</style>