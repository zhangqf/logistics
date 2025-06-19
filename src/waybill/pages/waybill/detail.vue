<template>
	<view class="waybill-detail">
		<!-- 运单号和状态 -->
		<view class="header">
			<text class="waybill-number" :class="waybillDetail.status">{{waybillDetail.waybill_number}}</text>
			<text class="status" :class="waybillDetail.status">{{statusMap[waybillDetail.status]}}</text>
		</view>

		<!-- 运单信息 -->
		<view class="info-card">
			<view class="card-title">
				<text class="iconfont">&#xe676;</text>
				<text>运单信息</text>
			</view>
			<view class="info-item">
				<text class="label">预载重量</text>
				<input v-if="waybillDetail.status==='assigned'" class="uni-input input" placeholder="请输入预载重量"
					v-model="waybillDetail.preload_weight" />
				<text v-else class="value">{{waybillDetail.preload_weight}}</text>
				<text style="margin-left:20rpx;"> 吨</text>
			</view>
			<view class="info-item">
				<text class="label required">派车人</text>
				<input v-if="waybillDetail.status==='assigned'" class="uni-input input" placeholder="请输入派车人"
					v-model="waybillDetail.dispatcher" />
				<text v-else class="value">{{waybillDetail.dispatcher}}</text>
			</view>
			<view class="info-item">
				<text class="label required">装货地点</text>

				<input v-if="waybillDetail.status==='assigned'" class="uni-input input" placeholder="请输入装货地点"
					v-model="waybillDetail.loading_place" />
				<text v-else class="value">{{waybillDetail.loading_place}}</text>
			</view>
			<view class="info-item">
				<text class="label required">收货地址</text>

				<input v-if="waybillDetail.status==='assigned'" class="uni-input input" placeholder="请输入收货地址"
					v-model="waybillDetail.delivery_address" />
				<text v-else class="value">{{waybillDetail.delivery_address}}</text>
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

				<input v-if="waybillDetail.status==='assigned'" class="uni-input input" placeholder="请输入联系人"
					v-model="waybillDetail.sender_contact" />
				<text v-else class="value">{{waybillDetail.sender_contact}}</text>
			</view>
			<view class="info-item">
				<text class="label">联系电话</text>

				<input v-if="waybillDetail.status==='assigned'" class="uni-input input" placeholder="请输入联系电话"
					v-model="waybillDetail.sender_phone" />
				<text v-else class="value">{{waybillDetail.sender_phone}}</text>
			</view>
			<view class="info-item">
				<text class="label">装货仓库</text>

				<input v-if="waybillDetail.status==='assigned'" class="uni-input input" placeholder="请输入装货仓库"
					v-model="waybillDetail.loading_warehouse" />
				<text v-else class="value">{{waybillDetail.loading_warehouse}}</text>
			</view>
			<view class="info-item">
				<text class="label">装货要求</text>

				<input v-if="waybillDetail.status==='assigned'" class="uni-input input" placeholder="请输入装货要求"
					v-model="waybillDetail.loading_requirements" />
				<text v-else class="value">{{waybillDetail.loading_requirements}}</text>
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

				<input v-if="waybillDetail.status==='assigned'" class="uni-input input" placeholder="请输入联系人"
					v-model="waybillDetail.receiver_contact" />
				<text v-else class="value">{{waybillDetail.receiver_contact}}</text>
			</view>
			<view class="info-item">
				<text class="label">联系电话</text>

				<input v-if="waybillDetail.status==='assigned'" class="uni-input input" placeholder="请输入联系电话"
					v-model="waybillDetail.receiver_phone" />
				<text v-else class="value">{{waybillDetail.receiver_phone}}</text>
			</view>
			<view class="info-item">
				<text class="label">卸载仓库</text>

				<input v-if="waybillDetail.status==='assigned'" class="uni-input input" placeholder="请输入卸载仓库"
					v-model="waybillDetail.unloading_warehouse" />
				<text v-else class="value">{{waybillDetail.unloading_warehouse}}</text>
			</view>
			<view class="info-item">
				<text class="label">卸载要求</text>

				<input v-if="waybillDetail.status==='assigned'" class="uni-input input" placeholder="请输入卸载要求"
					v-model="waybillDetail.unloading_requirements" />
				<text v-else class="value">{{waybillDetail.unloading_requirements}}</text>
			</view>
		</view>

		<!-- 承运信息 -->
		<view class="info-card">
			<view class="card-title">
				<text class="iconfont">&#xe676;</text>
				<text>承运信息</text>
			</view>
			<!-- <view class="info-item">
				<text class="label">承运商</text>
				<text class="value">{{waybillDetail.carrier_name}}</text>
				<input class="uni-input input" placeholder="请输入承运商" v-model="waybillDetail.carrier_name" />
				
			</view> -->
			<view class="info-item">
				<text class="label">车牌号</text>
				<text class="value">{{waybillDetail?.assignee_info?.driver_license_plate}}</text>
				<!-- <input class="uni-input input" placeholder="请输入卸载要求" v-model="waybillDetail.unloading_requirements" /> -->

			</view>
			<view class="info-item">
				<text class="label">卸货方式</text>

				<input v-if="waybillDetail.status==='assigned'" class="uni-input input" placeholder="请输入卸货方式"
					v-model="waybillDetail.carrier" />
				<text v-else class="value">{{waybillDetail.carrier}}</text>
			</view>
			<view class="info-item">
				<text class="label">货箱类型</text>

				<input v-if="waybillDetail.status==='assigned'" class="uni-input input" placeholder="请输入货箱类型"
					v-model="waybillDetail.vehicle_type" />
				<text v-else class="value">{{waybillDetail.vehicle_type}}</text>
			</view>
			<view class="info-item">
				<text class="label">货箱长度</text>

				<input v-if="waybillDetail.status==='assigned'" class="uni-input input" placeholder="请输入货箱长度"
					v-model="waybillDetail.vehicle_length" />
				<text v-else class="value">{{waybillDetail.vehicle_length}}</text> 米
			</view>
			<view class="info-item">
				<text class="label">车辆轴数</text>

				<input v-if="waybillDetail.status==='assigned'" class="uni-input input" placeholder="请输入车辆轴数"
					v-model="waybillDetail.axle_count" />
				<text v-else class="value">{{waybillDetail.axle_count}}</text> 轴
			</view>
			<view class="info-item" v-if="waybillDetail.status==='auditing' && userRole === 'admin'">
				<text class="label required">出发时间</text>

				<uni-datetime-picker type="datetime" v-model="waybillDetail.delivery_time" return-type='date' />
			</view>
			<view class="info-item" v-if="waybillDetail.status!=='assigned'  && waybillDetail.status!=='auditing'">
				<text class="label">出发时间</text>
				<text class="value">{{formatDate(waybillDetail.delivery_time)}}</text>
			</view>
			<view class="info-item" v-if="waybillDetail.status==='auditing' && userRole === 'admin'">
				<text class="label required">到达时间</text>
				<uni-datetime-picker style="width: 100%; height: 80rpx;" type="datetime" return-type='date'
					v-model="waybillDetail.receiver_time" />
			</view>
			<view class="info-item" v-if="waybillDetail.status!=='assigned' && waybillDetail.status!=='auditing'">
				<text class="label">到达时间</text>
				<text class="value">{{formatDate(waybillDetail.receiver_time)}}</text>
			</view>
			<view class="info-item">
				<text class="label">司机姓名</text>
				<text class="value">{{waybillDetail.assignee_info?.driver_name}}</text>

			</view>
			<view class="info-item">
				<text class="label">手机号</text>
				<text class="value">{{waybillDetail.assignee_info?.phone}}</text>
			</view>
			<view class="info-item">
				<text class="label">身份证号</text>
				<text class="value">{{waybillDetail.assignee_info?.id_card}}</text>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="bottom-buttons">
			<!-- 司机角色 -->
			<template v-if="userRole === 'driver'">
				<template v-if="waybillDetail.status === 'assigned'">
					<button class="primary-btn" @tap="handleAudit">提交审核</button>
				</template>
				<template v-if="waybillDetail.status === 'completed'">
					<!-- <button class="primary-btn" @tap="handleDownloadWeighNote">下载电子磅单</button> -->
					<button class="primary-btn" @tap="handleViewTrack">查看轨迹</button>
					<button class="primary-btn" @tap="handleViewWeighNote">查看磅单</button>
				</template>
			</template>

			<!-- 管理员角色 -->
			<template v-if="userRole === 'admin'">
				<template v-if="waybillDetail.status === 'auditing'||waybillDetail.status === 'approved'">
					<template v-if="waybillDetail.status === 'auditing'">
						<button class="success-btn" @tap="handleApproveAudit">通过审核</button>
					</template>

					<template v-else>
						<!-- <button class="primary-btn" @tap="handleViewTrack">查看轨迹</button> -->
						<button class="secondary-btn" @tap="handleGenerateWeighNote">生成磅单</button>
					</template>
				</template>
				<template v-else>
					<button v-if='userRole === "admin" && waybillDetail.status !== "completed"' class="secondary-btn"
						@tap="handleGeneratorTrack">生成轨迹</button>
					<button v-if='waybillDetail.status === "completed"' class="primary-btn"
						@tap="handleViewTrack">查看轨迹</button>
					<button class="primary-btn" @tap="handleViewWeighNote">查看磅单</button>
				</template>
			</template>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		toRaw
	} from 'vue'
	import {
		useUserStore
	} from '@/stores/user'
	import {
		getWaybillDetail,
		approveWaybill,
		aubmitAudit,
	} from '@/waybill/api/waybills'
	import {
		formatDate,
		statusMap
	} from '@/waybill/utils/utils.js'
	import {
		onShow
	} from '@dcloudio/uni-app';

	const userStore = useUserStore()
	const waybillDetail = ref({})
	const userRole = ref(userStore.userInfo.role)

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
	const getvalidate = () => {
		// 表单验证
		if (!waybillDetail.value.dispatcher) {
			uni.showToast({
				title: '请输入派车人',
				icon: 'none'
			})
			return false
		}
		if (!waybillDetail.value.loading_place) {
			uni.showToast({
				title: '请输入装货地址',
				icon: 'none'
			})
			return false
		}
		if (!waybillDetail.value.delivery_address) {
			uni.showToast({
				title: '请输入收货地址',
				icon: 'none'
			})
			return false
		}

		return true
	}
	// 司机 - 提交审核
	const handleAudit = () => {
		if (!getvalidate()) {
			return
		}
		uni.showModal({
			title: '提示',
			content: '确认提交审核？',
			success: async (res) => {
				const tempObj = JSON.parse(JSON.stringify(toRaw(waybillDetail.value)))
				console.log(waybillDetail.value)
				tempObj.waybill_id = tempObj.waybill
				delete tempObj.waybill
				console.log(tempObj)
				if (res.confirm) {
					try {
						uni.showLoading({
							title: '提交中...'
						})
						const res = await aubmitAudit(tempObj)
						if (res.selfErrorCode === 0) {
							uni.showToast({
								title: '提交成功',
								icon: 'success'
							})
							getDetail(waybillDetail.value.id)
							uni.navigateBack()
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
		// uni.previewImage({
		// 	urls: [waybillDetail.value.weigh_note_url]
		// })
		uni.navigateTo({
			url: `/waybill/pages/weighnote/index?data=${JSON.stringify(toRaw(waybillDetail.value))}&bgid=${bgid.value}`
		})
	}

	const handleGeneratorTrack = () => {
		uni.navigateTo({
			url: `/waybill/pages/map/map?startCity=${waybillDetail.value.loading_place}&endCity=${waybillDetail.value.delivery_address}&departureTime=${formatDate(waybillDetail.value.delivery_time)}&arrivalTime=${formatDate(waybillDetail.value.receiver_time)}&id=${waybillDetail.value.waybill}&generator=${true}&driver_license_plate=${waybillDetail.value.assignee_info.driver_license_plate}`
		})
	}
	// 查看轨迹
	const handleViewTrack = () => {
		uni.navigateTo({
			url: `/waybill/pages/map/map?startCity=${waybillDetail.value.loading_place}&endCity=${waybillDetail.value.delivery_address}&departureTime=${formatDate(waybillDetail.value.delivery_time)}&arrivalTime=${formatDate(waybillDetail.value.receiver_time)}&id=${waybillDetail.value.waybill}&generator=${false}&guiji_distance=${waybillDetail.value.guiji_distance}&guiji_speed=${waybillDetail.value.guiji_speed}&guiji_time=${waybillDetail.value.guiji_time}&status=${waybillDetail.value.status}&driver_license_plate=${waybillDetail.value.assignee_info.driver_license_plate}`
		})
	}

	// 生成磅单
	const handleGenerateWeighNote = async () => {
		uni.navigateTo({
			url: `/waybill/pages/weighnote/index?data=${JSON.stringify(toRaw(waybillDetail.value))}&bgid=${bgid.value}`
		})
		// try {
		// 	uni.showLoading({
		// 		title: '生成中...'
		// 	})
		// 	const res = await generateWeighNote(waybillDetail.value.id)
		// 	if (res.selfErrorCode === 0) {
		// 		uni.showToast({
		// 			title: '生成成功',
		// 			icon: 'success'
		// 		})
		// 		getDetail(waybillDetail.value.id)
		// 	}
		// } catch (error) {
		// 	uni.showToast({
		// 		title: '生成失败',
		// 		icon: 'none'
		// 	})
		// } finally {
		// 	uni.hideLoading()
		// }
	}

	// 通过审核
	const handleApproveAudit = () => {
		if (!waybillDetail.value.delivery_time) {
			uni.showToast({
				title: '请输入出发时间',
				icon: 'none'
			})
			return false
		}
		if (!waybillDetail.value.receiver_time) {
			uni.showToast({
				title: '请输入到达时间',
				icon: 'none'
			})
			return false
		}
		uni.showModal({
			title: '提示',
			content: '确认通过审核？',
			success: async (res) => {
				if (res.confirm) {
					try {
						uni.showLoading({
							title: '处理中...'
						})
						console.log(waybillDetail.value)
						const r = {
							delivery_time: waybillDetail.value.delivery_time,
							receiver_time: waybillDetail.value.receiver_time
						}
						const res = await approveWaybill(waybillDetail.value.id, r)
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
	const bgid = ref()
	onShow(() => {
		const pages = getCurrentPages()
		const currentPage = pages[pages.length - 1]
		console.log('currentPage', currentPage)
		const id = currentPage.options.id
		if (id) {
			uni.setStorageSync('detailId', id)
			uni.setStorageSync('bgid', currentPage.options.bgid)
			bgid.value = currentPage.options.bgid
			getDetail(id)
		} else {
			const id = uni.getStorageSync('detailId')
			bgid.value = uni.getStorageSync('bgid')
			getDetail(id)
		}
	})
</script>

<style lang="scss">
	@use '@/styles/index.scss';

	.waybill-detail {
		min-height: 100vh;
		background-color: $bg-color;
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

			&.created {
				// background: #FFF7E6;
				color: #FA9D3B;
			}

			&.assigned {
				// background: #E6F7FF;
				color: #1890FF;
			}

			&.auditing {
				// background: #d3ffd9;
				color: #24be29;
			}

			&.approved {
				// background: #ffe3f7;
				color: #a61dff;
			}

			&.poundageok {
				color: #240fe5;
			}

			&.completed {
				// background: #cafff5;
				color: #31c6a9;
			}
		}

		.status {
			font-size: 24rpx;
			padding: 4rpx 12rpx;
			border-radius: 4rpx;
			background: #E6F7FF;
			color: #1890FF;

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

				&.required::before {
					content: '*';
					color: $danger-color;
					margin-right: 4rpx;
				}
			}

			.value {
				flex: 1;
				font-size: 28rpx;
				color: #333333;
				height: 80rpx;
				line-height: 80rpx;
				white-space: nowrap;
				overflow: hidden; //文本超出隐藏
				text-overflow: ellipsis;
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
		z-index: 10;
		

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
				background: #fff6c0;
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