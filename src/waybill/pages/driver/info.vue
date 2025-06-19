<template>
	<view class="driver-container">
		<!-- 顶部搜索区域和管理按钮 -->
		<view class="search-section">
			<view class="search-box" @tap="handleSearch">
				<text class="iconfont icon-search"></text>
				<text>{{searchText}}</text>
			</view>
			<view class="manage-btn" @tap="toggleEditMode">
				<text>{{ isEditMode ? '完成' : '管理' }}</text>
			</view>
		</view>

		<!-- 司机列表 -->
		<view class="driver-list" v-if="drivers.length > 0">
			<view class="driver-item" :class="item.isSelected ? 'active' : ''" v-for=" (item, index) in drivers"
				:key="item.id || index" @tap="handleDriverTap(item)">
				<!-- <movable-area class="movable-area"> -->
				<!-- 编辑模式下的复选框 -->
				<view class="checkbox-wrapper" v-if="isEditMode" @tap.stop="toggleDriverSelection(item)">
					<text class="iconfont"
						:class="item.isSelected ? 'icon-checkbox-selected' : 'icon-checkbox-normal'"></text>
				</view>

				<view class="driver-info">
					<view class=" main-info">
						<text class="name">{{item.driver_name}}</text>
						<text class="phone">{{item.phone}}</text>
					</view>
					<view class="plate-number">
						<text class="label">车牌号：</text>
						<text class="value">{{item.driver_license_plate}}</text>
					</view>
				</view>
				<!-- 非编辑模式下的单个删除按钮 -->
				<view class="delete-btn" v-if="!isEditMode" @tap.stop="handleDelete(item.id)">
					<text>删除</text>
				</view>
				<!-- 非编辑模式下的右箭头 -->
				<text class="iconfont icon-arrow-right" v-if="!isEditMode"></text>
				<!-- </movable-area> -->
			</view>

		</view>

		<!-- 空状态 -->
		<view class="empty-state" v-else>
			<text class="iconfont icon-empty"></text>
			<text class="empty-text">暂无司机信息</text>
		</view>

		<!-- 底部操作栏（编辑模式下显示） -->
		<view class="bottom-actions" v-if="isEditMode">
			<view class="select-all-wrapper" @tap="selectAllDrivers">
				<text class="iconfont"
					:class="isAllSelected ? 'icon-checkbox-selected' : 'icon-checkbox-normal'"></text>
				<text>全选</text>
			</view>
			<button class="action-btn primary-btn" :disabled="selectedDriverIds.length === 0"
				@tap="deleteSelectedDrivers">
				删除所选({{ selectedDriverIds.length }})
			</button>
		</view>

		<!-- 添加按钮 (保持注释状态，如果你需要取消注释，请注意其fixed定位可能与底部操作栏冲突) -->
		<!-- <view class="add-btn" @tap="handleAddDriver">
			<text class="iconfont icon-add"></text>
			<text>添加司机</text>
		</view> -->
	</view>
	<Filter v-if="isSearch" title='搜索司机' @reset='resetSearch' @cancel='isSearch = false' @confirm='confrim' />
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed
	} from 'vue'
	import {
		deleteDriver,
		bulkDeleteDriver
	} from '@/waybill/api/driver.js'

	import Filter from '@/waybill/components/Filter.vue'

	import {
		useDirvers
	} from '@/waybill/composables/driver.js'
	import {
		driverSearchMap
	} from '@/waybill/utils/utils.js'

	const {
		getDriverList,
		drivers
	} = useDirvers();

	const searchText = ref('搜索')
	const isEditMode = ref(false) // 是否处于编辑模式
	const selectedDriverIds = ref([]) // 存储选中司机的ID

	// 计算属性：是否全选
	const isAllSelected = computed(() => {
		return drivers.value.length > 0 && selectedDriverIds.value.length === drivers.value.length
	})
	const isSearch = ref(false)

	const handleSearch = () => {
		isSearch.value = true
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

	const resetSearch = async () => {
		isSearch.value = false
		searchText.value = '搜索'
		await getDriverList()
	}

	const handleDriverTap = (driver) => {
		if (isEditMode.value) {
			toggleDriverSelection(driver)
		} else {
			console.log('点击司机:', driver)
			// 可以跳转到司机详情页
		}
	}

	// 切换编辑模式
	const toggleEditMode = () => {
		isEditMode.value = !isEditMode.value
		// 进入编辑模式时，清除所有选中状态
		if (isEditMode.value) {
			selectedDriverIds.value = []
			drivers.value.forEach(driver => {
				driver.isSelected = false
			})
		}
	}

	// 切换司机选中状态
	const toggleDriverSelection = (driver) => {
		const id = driver.id || driver.phone; // 使用id或phone作为唯一标识，如果后端返回id则优先使用
		if (!id) {
			console.warn("Driver item missing unique ID for selection.", driver);
			return;
		}

		const index = selectedDriverIds.value.indexOf(id);
		if (index > -1) {
			selectedDriverIds.value.splice(index, 1);
			driver.isSelected = false;
		} else {
			selectedDriverIds.value.push(id);
			driver.isSelected = true;
		}
	}

	// 全选/全不选
	const selectAllDrivers = () => {
		if (isAllSelected.value) {
			selectedDriverIds.value = []
			drivers.value.forEach(driver => {
				driver.isSelected = false
			})
		} else {
			selectedDriverIds.value = drivers.value.map(driver => driver.id || driver.phone);
			drivers.value.forEach(driver => {
				driver.isSelected = true
			})
		}
	}

	// 删除单个司机
	const handleDelete = (id) => {
		uni.showModal({
			title: '提示',
			content: '确定要删除该司机吗？',
			success: async (res) => {
				if (res.confirm) {
					// 假设idOrIndex是唯一的司机ID
					console.log(id)
					uni.showLoading({
						title: '删除中...'
					})
					try {
						const res = await deleteDriver(id)
						console.log(res)
						uni.showToast({
							title: "操作成功"
						})
						await getDriverList()
					} catch (e) {
						//TODO handle the exception
						uni.showToast({
							title: '操作失败'
						})
					} finally {
						uni.hideLoading()
					}

					// const initialLength = drivers.value.length;
					// drivers.value = drivers.value.filter(driver => (driver.id || driver.phone) !==
					// 	idOrIndex);
					// if (drivers.value.length < initialLength) {
					// 	uni.showToast({
					// 		title: '删除成功',
					// 		icon: 'success'
					// 	});
					// } else {
					// 	uni.showToast({
					// 		title: '未找到匹配项或删除失败',
					// 		icon: 'none'
					// 	});
					// }
					// TODO: 调用后端API删除
				}
			}
		});
	}

	// 删除所选司机
	const deleteSelectedDrivers = () => {
		if (selectedDriverIds.value.length === 0) {
			uni.showToast({
				title: '请选择要删除的司机',
				icon: 'none'
			});
			return;
		}
		uni.showModal({
			title: '提示',
			content: `确定要删除选中的${selectedDriverIds.value.length}位司机吗？`,
			success: async (res) => {
				if (res.confirm) {
					const idsToDelete = new Set(selectedDriverIds.value);
					const initialLength = drivers.value.length;
					// drivers.value = drivers.value.filter(driver => !idsToDelete.has(driver.id || driver
					// 	.phone));
					console.log(idsToDelete)
					const r = Array.from(idsToDelete)
					
					uni.showLoading({
						title: '删除中...'
					})
					try {
						const data = {ids: r}
						const res = await bulkDeleteDriver(data)
						uni.showToast({
							title: "操作成功"
						})
						await getDriverList()
					} catch (e) {
						//TODO handle the exception
						uni.showToast({
							title: '操作失败'
						})
					} finally {
						uni.hideLoading()
					}

					selectedDriverIds.value = []; // 清空选中
					isEditMode.value = false; // 退出编辑模式
				}
			}
		});
	}

	// 模拟数据初始化时给每个司机添加一个id和isSelected属性
	onMounted(async () => {
		await getDriverList(); // 获取司机列表
	})

	const handleAddDriver = () => {
		uni.navigateTo({
			url: '/pages/driver/add'
		})
	}
</script>

<style lang="scss">
	@use '@/styles/iconfont.scss';
	@use '@/styles/index.scss';

	.driver-container {
		min-height: 100vh;
		background-color: $bg-color;
		padding-bottom: 0; // 底部操作栏会覆盖，所以这里不用留出空间
	}

	.search-section {
		padding: $spacing-md;
		background-color: $bg-white;
		position: sticky;
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

		.manage-btn {
			padding: 0 $spacing-sm;
			font-size: $font-size-md;
			color: $default-color;
			// 确保点击区域足够
			height: 72rpx;
			line-height: 72rpx;
		}
	}

	.placeholder-style {
		color: $text-light;
	}

	.driver-list {
		margin-top: $spacing-sm;
		padding-bottom: calc($list-content-middle + constant(safe-area-inset-bottom)); // 适配底部安全区域
		padding-bottom: calc($list-content-middle + env(safe-area-inset-bottom)); // 适配底部安全区域

		.driver-item {
			display: flex;

			background-color: $bg-white;
			margin-top: $spacing-sm;
			align-items: center;
			padding: $spacing-lg;
			border-bottom: 1rpx solid $border-color;
			width: 100%; // 确保占满宽度，解决“叠在一起”问题
			box-sizing: border-box; // 包含padding在内

			&.active {
				background-color: $select-item-bg-color;
			}

			.movable-area {
				width: 100%;
				height: 100%;
			}

			.checkbox-wrapper {
				padding-right: $spacing-md; // 复选框与内容的间距

				.icon-checkbox-normal {
					font-size: 44rpx; // 假设iconfont大小
					color: $text-light;
				}

				.icon-checkbox-selected {
					font-size: 44rpx;
					color: $default-color; // 选中颜色
				}
			}

			.driver-info {
				flex: 1; // 信息区域占据剩余空间
				margin-right: $spacing-md; // 与删除按钮的间距

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

			.delete-btn {
				background-color: $default-color; // 使用你的默认主题色作为删除按钮背景
				color: white;
				padding: 10rpx 20rpx;
				border-radius: $radius-sm;
				font-size: $font-size-sm;
				flex-shrink: 0; // 不会缩小
			}

			.icon-arrow-right {
				font-size: 32rpx;
				color: $text-light;
				margin-left: $spacing-sm; // 与删除按钮或内容间距
				flex-shrink: 0; // 不会缩小
			}

			&:active {
				background-color: $select-item-bg-color;
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