<template>
	<view class="waybill-list">
		<!-- 顶部搜索区域和管理按钮 -->
		<view class="search-section" v-if="userRole==='admin'">
			<!-- <view class="search-box" @tap="handleSearch"> -->
			<view class="search-box" @tap="handleSearch">
				<text class="iconfont icon-sousuo"></text>
				<!-- <text>{{searchText}}</text> -->
				<uni-data-select style="width:100%; height:60rpx;line-height: 60rpx; font-size: 32rpx;"
					v-model="searchRegion" :localdata="selectRegionsList" placeholder='请选择地区'></uni-data-select>
			</view>
			<view  class="manage-btn" @tap="toggleEditMode">
				<text>{{ isEditMode ? '完成' : '管理' }}</text>
			</view>
		</view>
		<!-- 列表 -->
		<scroll-view scroll-y class="list-container" @scrolltoupper="loadMore">
			<view v-if="userRole==='admin'" class="" style="width: 100%; height: 130rpx;">

			</view>
			<view class="waybill-item" style="position: relative;" :class="item.isSelected ? 'active' : ''" v-for="item in waybillList"
				:key="item.id" @tap="showDetail(item)">
				<view v-if="userRole==='admin'" style="position: absolute; bottom: 0;left: 0;right: 0;width: 100%;padding: 10rpx; text-align: center; font-size: 60rpx; color: rgba(22, 56, 237, 0.2);border-radius: 8rpx;">{{item.region_name}}</view>
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
				<view style="text-align: center; color: #7f7f7f;">{{formatDate(item.detail_info?.dispatch_time)}}-9999-12-31 23:59:59</view>
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
			<view class="" style="width: 100%; height: 300rpx;">

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
	</view>
	<!-- 底部操作栏（编辑模式下显示） -->
	<view class="bottom-actions" v-if="isEditMode">
		<view class="select-all-wrapper" @tap="selectAllWaybills">
			<text class="iconfont" :class="isAllSelected ? 'icon-checkbox-selected' : 'icon-checkbox-normal'"></text>
			<text>全选</text>
		</view>
		<button class="action-btn primary-btn" :disabled="selectedWaybills.length === 0" @tap="deleteSelectedWaybills">
			删除所选({{ selectedWaybills.length }})
		</button>
	</view>
	<!-- 司机选择弹窗 -->
	<view class="popup-mask" v-if="showDriverPopup" @tap="closeDriverPopup"></view>
	<view class="driver-popup" v-if="showDriverPopup">
		<view class="popup-header">
			<text class="title">选择司机</text>
			<text class="close-btn" @tap="closeDriverPopup">×</text>
		</view>

		<view class="" style="width: 700rpx;margin:20rpx auto">
			<text>选择地区</text>
			<view style="margin: 10rpx 0;">
				<uni-data-select style="width:100%; height:100rpx;line-height: 100rpx; font-size: 32rpx;"
					v-model="selectRegion" :localdata="selectRegionsList" placeholder='请选择地区'></uni-data-select>

			</view>
		</view>
		<scroll-view scroll-y class="driver-list">
			<view v-if="drivers.length > 0" class="">
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
			</view>
			<view v-else class="driver-item empty" style="display:block;text-align: center;">
				<text class="tips">请选择或切换地区</text>
				<view class="">
					暂无数据...,
				</view>
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
	<Filter v-if="isSearch" title='搜索运单' @reset='resetSearch' @cancel='isSearch = false' @confirm='confrim' />
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed,
		watch
	} from 'vue'
	import config from '@/config'
	import Filter from '@/waybill/components/Filter.vue'

	import {
		getWaybills,
		assignWaybills,
		bulkDeleteDriver
	} from '@/waybill/api/waybills.js'
	import {
		useDirvers
	} from '@/waybill/composables/driver.js'
	import {
		useRegions
	} from '@/waybill/composables/regions.js'
	import {
		useUserStore
	} from '@/stores/user'
	import {
		onShow
	} from '@dcloudio/uni-app'

	import {
		statusMap
	} from '@/waybill/utils/utils.js'



	const {
		getDriverList,
		drivers
	} = useDirvers();

	const userStore = useUserStore()

	const userRole = ref(userStore.userInfo?.role || '')

	// 区域
	const {
		getRegionsList,
		selectRegionsList,
		regions
	} = useRegions()

	// 列表数据
	const waybillList = ref([])
	const page = ref(1)
	const pageSize = 10
	const hasMore = ref(true)
	const searchRegion = ref('')

	// 司机选择相关
	const showDriverPopup = ref(false)
	const driverList = ref([])
	const selectedDriver = ref(null)
	const currentWaybill = ref(null)
	const selectRegion = ref()

	// 格式化日期
	const formatDate = (dateString) => {
		const date = new Date(dateString)
		return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
	}

	// 显示运单详情
	const showDetail = (waybill) => {
		console.log(waybill)
		console.log('waybill')
		if (isEditMode.value) {
			toggleWaybillSelection(waybill)
			return
		}
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
	const fetchWaybillList = async (data) => {
		try {
			uni.showLoading({
				title: '获取运单列表'
			})
			const res = await getWaybills(data)
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
		if (isEditMode.value) return
		if (hasMore.value) {
			fetchWaybillList()
		}
	}

	watch(selectRegion, (newVal) => {
		const r = selectRegionsList.value.filter(v => v.value === newVal)
		if (r.length > 0) {
			getDriverList({
				region: r[0].text
			})
			return
		}
		drivers.value = []
	})
	watch(searchRegion, (newVal) => {
		const r = selectRegionsList.value.filter(v => v.value === newVal)
		if (r.length > 0) {
			fetchWaybillList({
				region: r[0].text
			})
			return
		} 
		fetchWaybillList()
	})
	
	
	// 切换司机选中状态
	const toggleWaybillSelection = (waybill) => {
		const id = waybill.id;
		if (!id) {
			console.warn("Driver item missing unique ID for selection.", driver);
			return;
		}

		const index = selectedWaybills.value.indexOf(id);
		if (index > -1) {
			selectedWaybills.value.splice(index, 1);
			waybill.isSelected = false;
		} else {
			selectedWaybills.value.push(id);
			waybill.isSelected = true;
		}
	}

	// 显示司机选择弹窗
	const showDriverSelect = (waybill) => {
		currentWaybill.value = waybill
		selectedDriver.value = null
		showDriverPopup.value = true

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


			if (res.data.selfErrorCode === 0) {
				uni.showToast({
					title: '分配成功',
					icon: 'success'
				})
				closeDriverPopup()
				fetchWaybillList()
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

	/***********搜索***************/
	const isSearch = ref(false)
	const isEditMode = ref(false)
	const selectedWaybills = ref([])
	const searchText = ref('搜索')
	const handleSearch = () => {
		// isSearch.value = true
		
	}
	// 计算属性：是否全选
	const isAllSelected = computed(() => {
		return drivers.value.length > 0 && selectedWaybills.value.length === drivers.value.length
	})
	const resetSearch = async () => {
		isSearch.value = false
		searchText.value = '搜索'
		await getDriverList()
	}
	const confrim = async (data) => {
		isSearch.value = false
		const keys = Object.keys(data)
		if (keys.length > 0) {
			let text = ''
			keys.forEach(v => {
				text += driverSearchMap[v] + ":" + data[v] + ';'
			})
			console.log(text)
			searchText.value = text
		} else {
			searchText.value = '搜索'
		}
		await getDriverList(data)
	}
	// 切换编辑模式
	const toggleEditMode = () => {
		isEditMode.value = !isEditMode.value
		// 进入编辑模式时，清除所有选中状态
		if (isEditMode.value) {
			selectedWaybills.value = []
			waybillList.value.forEach(waybill => {
				waybill.isSelected = false
			})
		}
	}

	// 全选/全不选
	const selectAllWaybills = () => {
		if (isAllSelected.value) {
			selectedWaybills.value = []
			waybillList.value.forEach(waybill => {
				waybill.isSelected = false
			})
		} else {
			selectedWaybills.value = waybillList.value.map(waybill => waybill.id);
			waybillList.value.forEach(waybill => {
				waybill.isSelected = true
			})
		}
	}




	const deleteSelectedWaybills = () => {
		bulkDeleteDriver
		if (selectedWaybills.value.length === 0) {
			uni.showToast({
				title: '请选择要删除的运单',
				icon: 'none'
			});
			return;
		}
		uni.showModal({
			title: '提示',
			content: `确定要删除选中的${selectedWaybills.value.length}个运单吗？`,
			success: async (res) => {
				if (res.confirm) {
					const idsToDelete = new Set(selectedWaybills.value);
					const initialLength = drivers.value.length;
					// drivers.value = drivers.value.filter(driver => !idsToDelete.has(driver.id || driver
					// 	.phone));
					console.log(idsToDelete)
					const r = Array.from(idsToDelete)

					uni.showLoading({
						title: '删除中...'
					})
					try {
						const data = {
							ids: r
						}
						const res = await bulkDeleteDriver(data)
						uni.showToast({
							title: "操作成功"
						})
						await fetchWaybillList()
					} catch (e) {
						//TODO handle the exception
						uni.showToast({
							title: '操作失败'
						})
					} finally {
						uni.hideLoading()
					}
					selectedWaybills.value = []; // 清空选中
					isEditMode.value = false; // 退出编辑模式
				}
			}
		});
	}




	// 页面加载
	onShow(() => {
		fetchWaybillList()
	})
	getRegionsList()
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
		overflow: hidden;
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

		&.active {
			background-color: $select-item-bg-color;
		}
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

			&.poundageok {
				// background: #E6F7FF;
				color: #240fe5;
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

			&.poundageok {
				background: #c2d0f9;
				color: #240fe5;
			}

			&.completed {
				background: #cafff5;
				color: #31c6a9;
			}
		}
	}

	.search-section {
		padding: $spacing-md;
		background-color: $bg-white;
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		z-index: 1;
		display: flex; // 使用flex布局
		align-items: center; // 垂直居中

		.search-box {
			flex: 1; // 搜索框占据剩余空间
			display: flex;
			align-items: center;
			height: 72rpx;
			background: $bg-color;
			border-radius: $radius-lg;
			padding: 0 $spacing-md;
			margin-right: $spacing-sm; // 与管理按钮的间距
			.uni-stat-box{
				background-color: #ecf4ff;
				.uni-select{
					border: none;
				}
			}
			.icon-sousuo {
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

		.manage-btn {
			padding: 0 $spacing-sm;
			font-size: $font-size-md;
			color: #ffae20;
			// 确保点击区域足够
			height: 72rpx;
			line-height: 72rpx;
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
		min-height: 550rpx;
		// padding: 0 $spacing-lg;
		max-height: 70vh;
		box-sizing: border-box;
	}

	.driver-item {
		display: flex;
		align-items: center;
		padding: $spacing-md $spacing-lg;
		border-bottom: 2rpx solid $border-color1;

		&.empty {
			height: 140rpx;
			border-bottom: 0rpx solid $border-color1;

			.tips {
				color: $danger-color;
			}
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
		bottom: 222rpx;
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

	.bottom-actions {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: $spacing-md $spacing-lg;
		background-color: $bg-white;
		border-top: 1rpx solid $border-color;
		box-shadow: $shadow-1-up; // 如果有向上阴影的变量
		padding-bottom: calc($spacing-md + constant(safe-area-inset-bottom)); // 适配底部安全区域
		padding-bottom: calc($spacing-md + env(safe-area-inset-bottom)); // 适配底部安全区域
		z-index: 10;

		.select-all-wrapper {
			display: flex;
			align-items: center;
			font-size: $font-size-md;
			color: $text-main;

			.iconfont {
				font-size: 44rpx;
				margin-right: $spacing-sm;

				&.icon-checkbox-normal {
					color: $text-light;
				}

				&.icon-checkbox-selected {
					color: $default-color;
				}
			}
		}

		.action-btn {
			height: 80rpx; // 统一按钮高度
			line-height: 80rpx;
			font-size: $font-size-lg;
			padding: 0 60rpx;
			border-radius: $radius-lg;
			color: $text-white;
			background-color: $default-color; // 删除按钮的背景色
			border: none;

			&.primary-btn {
				background-color: $primary-color; // 确保使用主题色，或者直接用$default-color
				color: $text-white;
			}

			&[disabled] {
				opacity: 0.6;
				background-color: #ccc; // 禁用按钮的背景色
				color: #ccc; // 禁用按钮的文字颜色
			}
		}
	}
</style>