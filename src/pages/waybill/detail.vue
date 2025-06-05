<template>
	<view class="waybill-detail">
		<!-- 运单号和状态 -->
		<view class="header">
			<text class="waybill-number">{{waybillDetail.waybill_number}}</text>
			<text class="status">录入实收</text>
		</view>

		<!-- 运单信息 -->
		<view class="info-card">
			<view class="card-title">
				<text class="iconfont">&#xe676;</text>
				<text>运单信息</text>
			</view>
			<view class="info-item">
				<text class="label">预载重量</text>
				<input class="uni-input input" type="number" placeholder="请输入预载重量" v-model="waybillDetail.plan_weight" />
				<text style="margin-left:20rpx;"> 吨</text>
			</view>
			<view class="info-item">
				<text class="label">派车人</text>
				<input class="uni-input input" placeholder="请输入派车人" v-model="waybillDetail.dispatcher_name" />
			</view>
			<view class="info-item">
				<text class="label">装货地点</text>
				<!-- <text class="value">{{waybillDetail.loading_location}}</text> -->
				<input class="uni-input input" placeholder="请输入装货地点" v-model="waybillDetail.loading_location" />
			</view>
			<view class="info-item">
				<text class="label">收货地址</text>
				<!-- <text class="value">{{waybillDetail.delivery_address}}</text> -->
				<input class="uni-input input" placeholder="请输入收货地址" v-model="waybillDetail.delivery_address" />
			</view>
			<view class="info-item">
				<text class="label">派车时间</text>
				<text class="value">{{formatDate(waybillDetail.dispatch_time)}}</text>
			</view>
		</view>

		<!-- 发货方信息 -->
		<view class="info-card">
			<view class="card-title">
				<text class="iconfont">&#xe676;</text>
				<text>发货方信息</text>
			</view>
			<view class="info-item">
				<text class="label">发货公司</text>
				<text class="value">{{waybillDetail.sender_company}}</text>
			</view>
			<view class="info-item">
				<text class="label">发货地址</text>
				<text class="value">{{waybillDetail.sender_address}}</text>
			</view>
			<view class="info-item">
				<text class="label">联系人</text>
				<!-- <text class="value">{{waybillDetail.sender_contact}}</text> -->
				<input class="uni-input input" placeholder="请输入联系人" v-model="waybillDetail.sender_contact" />
				
			</view>
			<view class="info-item">
				<text class="label">联系电话</text>
				<!-- <text class="value">{{waybillDetail.sender_phone}}</text> -->
				<input class="uni-input input" placeholder="请输入联系电话" v-model="waybillDetailsender_phone" />
				
			</view>
			<view class="info-item">
				<text class="label">装货仓库</text>
				<!-- <text class="value">{{waybillDetail.loading_warehouse}}</text> -->
				<input class="uni-input input" placeholder="请输入装货仓库" v-model="waybillDetailloading_warehouse" />
				
			</view>
			<view class="info-item">
				<text class="label">装货要求</text>
				<!-- <text class="value">{{waybillDetail.loading_requirements}}</text> -->
				<input class="uni-input input" placeholder="请输入装货要求" v-model="waybillDetail.loading_requirements" />
				
			</view>
		</view>

		<!-- 收货方信息 -->
		<view class="info-card">
			<view class="card-title">
				<text class="iconfont">&#xe676;</text>
				<text>收货方信息</text>
			</view>
			<view class="info-item">
				<text class="label">收货公司</text>
				<text class="value">{{waybillDetail.receiver_company}}</text>
			</view>
			<view class="info-item">
				<text class="label">收货地址</text>
				<text class="value">{{waybillDetail.receiver_address}}</text>
			</view>
			<view class="info-item">
				<text class="label">联系人</text>
				<!-- <text class="value">{{waybillDetail.receiver_contact}}</text> -->
				<input class="uni-input input" placeholder="请输入联系人" v-model="waybillDetail.receiver_contact" />
				
			</view>
			<view class="info-item">
				<text class="label">联系电话</text>
				<!-- <text class="value">{{waybillDetail.receiver_phone}}</text> -->
				<input class="uni-input input" placeholder="请输入联系电话" v-model="waybillDetail.receiver_phone" />
				
			</view>
			<view class="info-item">
				<text class="label">卸载仓库</text>
				<!-- <text class="value">{{waybillDetail.unloading_warehouse}}</text> -->
				<input class="uni-input input" placeholder="请输入卸载仓库" v-model="waybillDetail.unloading_warehouse" />
				
			</view>
			<view class="info-item">
				<text class="label">卸载要求</text>
				<!-- <text class="value">{{waybillDetail.unloading_requirements}}</text> -->
				<input class="uni-input input" placeholder="请输入卸载要求" v-model="waybillDetail.unloading_requirements" />
				
			</view>
		</view>

		<!-- 承运信息 -->
		<view class="info-card">
			<view class="card-title">
				<text class="iconfont">&#xe676;</text>
				<text>承运信息</text>
			</view>
			<view class="info-item">
				<text class="label">承运商</text>
				<text class="value">{{waybillDetail.carrier_name}}</text>
				<input class="uni-input input" placeholder="请输入卸载要求" v-model="waybillDetail.unloading_requirements" />
				
			</view>
			<view class="info-item">
				<text class="label">车牌号</text>
				<text class="value">{{waybillDetail.plate_number}}</text>
				<!-- <input class="uni-input input" placeholder="请输入卸载要求" v-model="waybillDetail.unloading_requirements" /> -->
				
			</view>
			<view class="info-item">
				<text class="label">卸货方式</text>
				<text class="value">{{waybillDetail.unloading_method}}</text>
				<input class="uni-input input" placeholder="请输入卸货方式" v-model="waybillDetail.unloading_method" />
				
			</view>
			<view class="info-item">
				<text class="label">货箱类型</text>
				<!-- <text class="value">{{waybillDetail.container_type}}</text> -->
				<input class="uni-input input" placeholder="请输入货箱类型" v-model="waybillDetail.container_type" />
				
			</view>
			<view class="info-item">
				<text class="label">货箱长度</text>
				<!-- <text class="value">{{waybillDetail.container_length}}米</text> -->
				<input class="uni-input input" placeholder="请输入货箱长度" v-model="waybillDetail.container_length" /> 米
				
			</view>
			<view class="info-item">
				<text class="label">车辆轴数</text>
				<!-- <text class="value">{{waybillDetail.vehicle_axles}}轴</text> -->
				<input class="uni-input input" placeholder="请输入车辆轴数" v-model="waybillDetail.vehicle_axles" /> 轴
				
			</view>
			<view class="info-item">
				<text class="label">司机姓名</text>
				<text class="value">{{waybillDetail.driver_name}}</text>
				
			</view>
			<view class="info-item">
				<text class="label">手机号</text>
				<text class="value">{{waybillDetail.driver_phone}}</text>
			</view>
			<view class="info-item">
				<text class="label">身份证号</text>
				<text class="value">{{waybillDetail.driver_id_number}}</text>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="bottom-buttons">
			<!-- 司机角色 -->
			<template v-if="userRole === 'driver'">
				<template v-if="waybillDetail.status === 'assigned'">
					<button class="primary-btn" @tap="handleAudit">审核</button>
				</template>
				<template v-else>
					<button class="primary-btn" @tap="handleDownloadWeighNote">下载电子磅单</button>
					<button class="secondary-btn" @tap="handleViewWeighNote">查看磅单</button>
				</template>
			</template>

			<!-- 管理员角色 -->
			<template v-if="userRole === 'admin' && waybillDetail.status === 'auditing'">
				<template v-if="!waybillDetail.weigh_note">
					<button class="primary-btn" @tap="handleViewTrack">查看轨迹</button>
					<button class="secondary-btn" @tap="handleGenerateWeighNote">生成磅单</button>
				</template>
				<template v-else>
					<button class="primary-btn" @tap="handleViewTrack">查看轨迹</button>
					<button class="secondary-btn" @tap="handleViewWeighNote">查看磅单</button>
					<button class="success-btn" @tap="handleApproveAudit">通过审核</button>
				</template>
			</template>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		useUserStore
	} from '@/stores/user'
	import {
		getWaybillDetail,
		approveWaybill
	} from '@/api/waybills'
	import {
		formatDate
	} from '@/utils/utils.js'

	const userStore = useUserStore()
	const waybillDetail = ref({})
	const userRole = ref(userStore.userInfo.role)

	// 状态映射
	const statusMap = {
		created: '已创建',
		assigned: '已分配',
		auditing: '审核中',
		approved: '已审核',
		completed: '已完成'
	}

	// 获取运单详情
	const getDetail = async (id) => {
		console.log(id)
		try {
			uni.showLoading({
				title: '加载中...'
			})
			const res = await getWaybillDetail(id)
			waybillDetail.value = res.data
		} catch (error) {
			uni.showToast({
				title: '获取运单详情失败',
				icon: 'none'
			})
		} finally {
			uni.hideLoading()
		}
	}

	// 司机 - 提交审核
	const handleAudit = () => {
		uni.showModal({
			title: '提示',
			content: '确认提交审核？',
			success: async (res) => {
				if (res.confirm) {
					try {
						uni.showLoading({
							title: '提交中...'
						})
						const res = await submitAudit(waybillDetail.value.id)
						if (res.selfErrorCode === 0) {
							uni.showToast({
								title: '提交成功',
								icon: 'success'
							})
							getDetail(waybillDetail.value.id)
						}
					} catch (error) {
						uni.showToast({
							title: '提交失败',
							icon: 'none'
						})
					} finally {
						uni.hideLoading()
					}
				}
			}
		})
	}

	// 下载电子磅单
	const handleDownloadWeighNote = () => {
		uni.downloadFile({
			url: waybillDetail.value.weigh_note_url,
			success: (res) => {
				if (res.statusCode === 200) {
					uni.saveFile({
						tempFilePath: res.tempFilePath,
						success: function(res) {
							uni.showToast({
								title: '下载成功',
								icon: 'success'
							})
						}
					})
				}
			},
			fail: () => {
				uni.showToast({
					title: '下载失败',
					icon: 'none'
				})
			}
		})
	}

	// 查看磅单
	const handleViewWeighNote = () => {
		uni.previewImage({
			urls: [waybillDetail.value.weigh_note_url]
		})
	}

	// 查看轨迹
	const handleViewTrack = () => {
		uni.navigateTo({
			url: `/pages/waybill/track?id=${waybillDetail.value.id}`
		})
	}

	// 生成磅单
	const handleGenerateWeighNote = async () => {
		try {
			uni.showLoading({
				title: '生成中...'
			})
			const res = await generateWeighNote(waybillDetail.value.id)
			if (res.selfErrorCode === 0) {
				uni.showToast({
					title: '生成成功',
					icon: 'success'
				})
				getDetail(waybillDetail.value.id)
			}
		} catch (error) {
			uni.showToast({
				title: '生成失败',
				icon: 'none'
			})
		} finally {
			uni.hideLoading()
		}
	}

	// 通过审核
	const handleApproveAudit = () => {
		uni.showModal({
			title: '提示',
			content: '确认通过审核？',
			success: async (res) => {
				if (res.confirm) {
					try {
						uni.showLoading({
							title: '处理中...'
						})
						const res = await approveWaybill(waybillDetail.value.id)
						if (res.selfErrorCode === 0) {
							uni.showToast({
								title: '审核通过',
								icon: 'success'
							})
							getDetail(waybillDetail.value.id)
						}
					} catch (error) {
						uni.showToast({
							title: '操作失败',
							icon: 'none'
						})
					} finally {
						uni.hideLoading()
					}
				}
			}
		})
	}

	onMounted(() => {
		const pages = getCurrentPages()
		const currentPage = pages[pages.length - 1]
		const id = currentPage.options.id
		if (id) {
			getDetail(id)
		}
	})
</script>

<style lang="scss">
	.waybill-detail {
		min-height: 100vh;
		background-color: #F8F8F8;
		padding-bottom: calc(140rpx + env(safe-area-inset-bottom));
	}

	.header {
		background: #FFFFFF;
		padding: 32rpx;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.waybill-number {
			font-size: 36rpx;
			color: #1890FF;
			font-weight: 700;
		}

		.status {
			font-size: 24rpx;
			padding: 4rpx 12rpx;
			border-radius: 4rpx;
			background: #E6F7FF;
			color: #1890FF;
		}
	}

	.info-card {
		background: #FFFFFF;
		margin-bottom: 20rpx;
		padding: 32rpx;

		.card-title {
			display: flex;
			align-items: center;
			margin-bottom: 24rpx;
			border-bottom: 2rpx solid #F5F5F5;
			padding-bottom: 16rpx;

			.iconfont {
				font-size: 32rpx;
				color: #F7DB1C;
				margin-right: 12rpx;
			}

			text {
				font-size: 32rpx;
				color: #333333;
				font-weight: 500;
			}
		}

		.info-item {
			display: flex;
			margin-bottom: 16rpx;
			align-items: center;
			&:last-child {
				margin-bottom: 0;
			}

			.label {
				width: 160rpx;
				font-size: 28rpx;
				color: #999999;
				flex-shrink: 0;
			}

			.value {
				flex: 1;
				font-size: 28rpx;
				color: #333333;
			}
			.input {
				width: 100%;
				box-sizing: border-box;
				height: 80rpx;
				background: $bg-color;
				border-radius: $radius-sm;
				padding: 0 $spacing-md;
				font-size: $font-size-md;
			}
			
			.textarea-value {
				width: 100%;
				height: 200rpx;
				box-sizing: border-box;
				background: $bg-color;
				border-radius: $radius-sm;
				padding: $spacing-md;
				font-size: $font-size-md;
			}
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
		z-index: 1000;
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
				color: #333333;
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