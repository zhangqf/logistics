<template>
	<view class="verify-container">
		<view class="form-container">
			
			<view class="form-item">
				<text class="label required">姓名</text>
				<input class="input" type="text" v-model="formData.name" placeholder="请输入真实姓名" :disabled="isApproved" />
			</view>
			<view class="form-item">
				<text class="label required">身份证号</text>
				<input class="input" type="idcard" v-model="formData.idCard" placeholder="请输入身份证号码"
					:disabled="isApproved" />
			</view>

			<view class="form-item" v-if="userRole === 'driver'">
				<text class="label required">车牌号</text>
				<input class="input" type="text" v-model="formData.licensePlate" placeholder="请输入车牌号"
					:disabled="isApproved" />
			</view>

			<view v-if="userRole === 'driver'" class="form-item">
				<text class="label required">区域</text>
				<input readonly @tap="handlePopup" class="input" type="text" v-model="formData.region_name" placeholder="请选择区域"
					:disabled="isApproved" />
			</view>

			<!-- 认证状态提示 -->
			<view v-if="isApproved" class="status-tip approved">
				<text class="iconfont icon-success"></text>
				<text>已完成实名认证</text>
			</view>

			<!-- 只有未认证时显示提交按钮 -->
			<button v-if="!isApproved" class="submit-btn" @click="handleSubmit">提交认证</button>
		</view>
	</view>
	<Popup v-if='showPopup' @confirm='confirm' @cancel='showPopup = false' title='选择区域' :data='regions'/>
</template>

<script>
	import {
		ref
	} from 'vue'
	import {
		verifyIdentity
	} from '@/waybill/api/verify'
	import {
		useUserStore
	} from '@/stores/user'
	import Popup from '@/waybill/components/Popup'
	import {
		useRegions
	} from '@/waybill/composables/regions.js'


	export default {
		 components: {
		    Popup
		  },
		setup() {
			const userStore = useUserStore()
			const userRole = ref(userStore.userInfo?.role || '')
			const isApproved = ref(userStore.userInfo?.is_approved || false)
			const formData = ref({
				name: userStore.userInfo?.auth_info?.real_name || '',
				idCard: userStore.userInfo?.auth_info?.id_card || '',
				licensePlate: userStore.userInfo?.auth_info?.license_plate || '',
				region: '',
				region_name:userStore?.region_name||''
			})
			const showPopup = ref(false)
			const selectedRegion = ref()
			const {
				getRegionsList,
				regions
			} = useRegions()

			const validateIdCard = (idCard) => {
				const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
				return reg.test(idCard)
			}

			const validateLicensePlate = (licensePlate) => {
				const reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-Z0-9]{4,5}[A-Z0-9挂学警港澳]$/
				return reg.test(licensePlate)
			}
			const popup = ref()
			const handlePopup = () => {
				if(!isApproved) return
				showPopup.value = true
			}
			const confirm = (data) => {
				console.log(data.value.id)
				formData.value.region = data.value.id
				formData.value.region_name = data.value.name
				showPopup.value = false
			}
			const handleSubmit = async () => {
				// 如果已认证，不允许提交
				if (isApproved.value) {
					uni.showToast({
						title: '您已完成实名认证',
						icon: 'none'
					})
					return
				}

				// 表单验证
				if (!formData.value.name) {
					uni.showToast({
						title: '请输入姓名',
						icon: 'none'
					})
					return
				}
				if (!formData.value.idCard) {
					uni.showToast({
						title: '请输入身份证号',
						icon: 'none'
					})
					return
				}
				if (!validateIdCard(formData.value.idCard)) {
					uni.showToast({
						title: '请输入正确的身份证号',
						icon: 'none'
					})
					return
				}

				// 仅当角色为司机时验证车牌号
				if (userRole.value === 'driver') {
					if (!formData.value.licensePlate) {
						uni.showToast({
							title: '请输入车牌号',
							icon: 'none'
						})
						return
					}
					if (!validateLicensePlate(formData.value.licensePlate)) {
						uni.showToast({
							title: '请输入正确的车牌号',
							icon: 'none'
						})
						return
					}
					if(!formData.value.region){
						uni.showToast({
							title: '请选择地区',
							icon: 'none'
						})
						return
					}
				}

				try {
					// 根据角色过滤提交数据
					const submitData = {
						real_name: formData.value.name,
						id_card: formData.value.idCard,
						...(userRole.value === 'driver' ? {
							license_plate: formData.value.licensePlate,
							region:  formData.value.region,
						} : {})
					}
					console.log(submitData)
					const res = await verifyIdentity(submitData)
					console.log(res)
					if (res.selfErrorCode === 0) {
						// 更新用户信息中的认证状态
						userStore.updateUserInfo({
							...userStore.userInfo,
							is_approved: true,
							auth_info: {
								real_name: formData.value.name,
								id_card: formData.value.idCard,
								license_plate: formData.value.licensePlate
							}

						})

						uni.showToast({
							title: '认证成功',
							icon: 'success'
						})
						// 延迟跳转
						setTimeout(() => {
							uni.navigateBack()
						}, 1500)
					} else {
						uni.showToast({
							title: res.message || '认证失败',
							icon: 'none'
						})
					}
				} catch (error) {
					uni.showToast({
						title: '认证失败，请重试',
						icon: 'none'
					})
				}
			}

			getRegionsList()

			return {
				showPopup,
				regions,
				formData,
				userRole,
				isApproved,
				handleSubmit,
				getRegionsList,
				handlePopup,
				confirm
			}
		}
	}
</script>

<style lang="scss" scoped>
	@use '@/styles/index.scss';

	.verify-container {
		padding: $spacing-sm;
		min-height: 100vh;
		background-color: $bg-color;

		.form-container {
			background: $bg-white;
			border-radius: $radius-md;
			padding: $spacing-lg;
			box-shadow: $shadow-1;

			.form-item {
				margin-bottom: $spacing-lg;
				box-sizing:content-box;
				.label {
					display: block;
					font-size: $font-size-md;
					color: $text-main;
					margin-bottom: $spacing-sm;

					&.required::before {
						content: '*';
						color: $danger-color;
						margin-right: 4rpx;
					}
				}

				.input {
					// width: 100%;
					height: 88rpx;
					border: 2rpx solid $border-color;
					border-radius: $radius-sm;
					padding: 0 $spacing-md;
					font-size: $font-size-md;
					color: $text-main;
					background-color: $bg-white;

					&:focus {
						border-color: $primary-color;
					}

					&::placeholder {
						color: $text-light;
					}

					&:disabled {
						background-color: $bg-color;
						color: $text-secondary;
					}
				}
			}

			.status-tip {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: $spacing-md;
				margin-bottom: $spacing-lg;
				border-radius: $radius-sm;

				&.approved {
					background: rgba($success-color, 0.1);
					color: $success-color;

					.iconfont {
						font-size: 40rpx;
						margin-right: $spacing-sm;
					}
				}
			}

			.submit-btn {
				width: 100%;
				height: 88rpx;
				background: $primary-color;
				color: $text-white;
				border-radius: $radius-lg;
				font-size: $font-size-lg;
				margin-top: $spacing-lg;
				border: none;

				&:active {
					opacity: $opacity-hover;
				}
			}
		}
	}
	
</style>