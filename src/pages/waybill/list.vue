<template>
	<view class="waybill-list">
		<!-- 列表 -->
		<scroll-view 
			scroll-y 
			class="list-container"
			@scrolltolower="loadMore"
		>
			<view 
				class="waybill-item"
				v-for="item in waybillList"
				:key="item.id"
			>
				<view class="waybill-header">
					<text class="waybill-number">运单号：{{item.waybillNumber}}</text>
					<text class="waybill-status" :class="item.status">
						{{statusMap[item.status]}}
					</text>
				</view>

				<view class="company-info">
					<view class="info-row">
						<text class="label">发货方：</text>
						<text class="value">{{item.senderCompany}}</text>
					</view>
					<view class="info-row">
						<text class="label">发货地址：</text>
						<text class="value">{{item.senderAddress}}</text>
					</view>
					<view class="info-row">
						<text class="label">收货方：</text>
						<text class="value">{{item.receiverCompany}}</text>
					</view>
					<view class="info-row">
						<text class="label">收货地址：</text>
						<text class="value">{{item.receiverAddress}}</text>
					</view>
				</view>

				<view class="material-info">
					<text class="label">物料信息：</text>
					<text class="value">{{item.materialInfo}}</text>
				</view>

				<view class="waybill-footer">
					<text class="create-time">{{formatDate(item.createTime)}}</text>
					<button 
						class="assign-btn"
						@tap="showDriverSelect(item)"
						:disabled="item.status !== 'pending'"
					>
						分配司机
					</button>
				</view>
			</view>

			<!-- 加载更多 -->
			<view class="loading-more" v-if="hasMore">
				<text>加载中...</text>
			</view>
		</scroll-view>

		<!-- 司机选择弹窗 -->
		<view class="popup-mask" v-if="showDriverPopup" @tap="closeDriverPopup"></view>
		<view class="driver-popup" v-if="showDriverPopup">
			<view class="popup-header">
				<text class="title">选择司机</text>
				<text class="close-btn" @tap="closeDriverPopup">×</text>
			</view>

			<scroll-view scroll-y class="driver-list">
				<view 
					class="driver-item"
					v-for="driver in driverList"
					:key="driver.id"
					:class="{ active: selectedDriver?.id === driver.id }"
					@tap="selectDriver(driver)"
				>
					<image class="avatar" :src="driver.avatar" mode="aspectFill"></image>
					<view class="driver-info">
						<text class="name">{{driver.name}}</text>
						<text class="phone">{{driver.phone}}</text>
					</view>
					<text class="select-icon" v-if="selectedDriver?.id === driver.id">✓</text>
				</view>
			</scroll-view>

			<view class="popup-footer">
				<button 
					class="cancel-btn"
					@tap="closeDriverPopup"
				>
					取消
				</button>
				<button 
					class="confirm-btn"
					@tap="handleAssignDriver"
					:disabled="!selectedDriver"
				>
					确认分配
				</button>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import config from '@/config'

import {getWaybills} from '@/api/waybills.js'

// 状态映射
const statusMap = {
	pending: '待分配',
	assigned: '已分配',
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

// 获取运单列表
const fetchWaybillList = async (isRefresh = false) => {
	try {
		if (isRefresh) {
			page.value = 1
			hasMore.value = true
		}

		const res = await getWaybills()
		console.log(res)
		if (res.statusCode === 200 && res.errMsg === 'request:ok') {
			const { list, total } = res.data.data
			if (isRefresh) {
				waybillList.value = list
			} else {
				waybillList.value = [...waybillList.value, ...list]
			}
			hasMore.value = waybillList.value.length < total
			page.value++
		}
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

// 获取司机列表
const fetchDriverList = async () => {
	try {
		const res = await uni.request({
			url: `${config.apiBaseUrl}/api/driver/list`,
			method: 'GET'
		})

		if (res.statusCode === 200 && res.data.code === 0) {
			driverList.value = res.data.data
		}
	} catch (error) {
		uni.showToast({
			title: '获取司机列表失败',
			icon: 'none'
		})
	}
}

// 显示司机选择弹窗
const showDriverSelect = (waybill) => {
	currentWaybill.value = waybill
	selectedDriver.value = null
	showDriverPopup.value = true
	fetchDriverList()
}

// 关闭司机选择弹窗
const closeDriverPopup = () => {
	showDriverPopup.value = false
	selectedDriver.value = null
	currentWaybill.value = null
}

// 选择司机
const selectDriver = (driver) => {
	selectedDriver.value = driver
}

// 分配司机
const handleAssignDriver = async () => {
	if (!selectedDriver.value || !currentWaybill.value) return

	try {
		uni.showLoading({
			title: '分配中...',
			mask: true
		})

		const res = await uni.request({
			url: `${config.apiBaseUrl}/api/waybill/assign`,
			method: 'POST',
			data: {
				waybillId: currentWaybill.value.id,
				driverId: selectedDriver.value.id
			}
		})

		if (res.statusCode === 200 && res.data.code === 0) {
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

// 页面加载
onMounted(() => {
	fetchWaybillList(true)
})
</script>

<style lang="scss">
.waybill-list {
	min-height: 100vh;
	background-color: $bg-color;
	padding: $spacing-md;
}

.list-container {
	height: 100vh;
}

.waybill-item {
	background: $bg-white;
	border-radius: $radius-lg;
	padding: $spacing-lg;
	margin-bottom: $spacing-md;
}

.waybill-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: $spacing-md;

	.waybill-number {
		font-size: $font-size-md;
		color: $text-main;
		font-weight: bold;
	}

	.waybill-status {
		font-size: $font-size-sm;
		padding: 4rpx $spacing-sm;
		border-radius: $radius-sm;

		&.pending {
			background: rgba($warning-color, 0.1);
			color: $warning-color;
		}

		&.assigned {
			background: rgba($primary-color, 0.1);
			color: $primary-color;
		}

		&.completed {
			background: rgba($success-color, 0.1);
			color: $success-color;
		}
	}
}

.company-info, .material-info {
	margin-bottom: $spacing-md;

	.info-row {
		display: flex;
		margin-bottom: $spacing-sm;
	}

	.label {
		font-size: $font-size-sm;
		color: $text-secondary;
		width: 160rpx;
		flex-shrink: 0;
	}

	.value {
		font-size: $font-size-sm;
		color: $text-main;
		flex: 1;
	}
}

.waybill-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: $spacing-lg;
	padding-top: $spacing-md;
	border-top: 2rpx solid $border-color;

	.create-time {
		font-size: $font-size-sm;
		color: $text-light;
	}

	.assign-btn {
		padding: 12rpx $spacing-lg;
		background: $primary-gradient;
		color: $text-white;
		font-size: $font-size-sm;
		border-radius: $radius-sm;
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
</style> 