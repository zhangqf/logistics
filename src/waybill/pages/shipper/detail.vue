<template>
	<view class="add-shipper-container">
		<view class="form-container">
			<!-- 公司名称 -->
			<view class="form-item">
				<text class="label required">公司名称</text>
				<input class="input" type="text" v-model="formData.company_name" placeholder="请输入公司名称"
					placeholder-class="placeholder-style" />
			</view>

			<!-- 统一社会信用代码 -->
			<view class="form-item">
				<text class="label">统一社会信用代码</text>
				<input class="input" type="text" v-model="formData.credit_code" placeholder="请输入统一社会信用代码"
					placeholder-class="placeholder-style" maxlength="18" />
			</view>
			<view class="form-item">
				<text class="label">上传防伪背景图</text> 
				<view @tap="uploadImage" class="uploadimage" v-if="!formData.bg_image_url" style="display: flex;justify-content: center;align-items: center;font-size: 38rpx;">
					请上传图片
				</view>
				<image v-else @tap="uploadImage" class="uploadimage" mode="aspectFit" :src="bgImageUrl" @error="imageError"></image>
				<!-- <input class="input" type="text" v-model="formData.bg_image" placeholder="请上传防伪背景图"
					placeholder-class="placeholder-style" maxlength="18" /> -->
			</view>

			<!-- 提示信息 -->
			<view class="tips">
				<text class="iconfont icon-info"></text>
				<text class="tips-text">请确保信息真实有效，审核通过后不可修改</text>
			</view>
		</view>

		<!-- 提交按钮 -->
		<!-- <view class="submit-section">
			<button class="submit-btn" :disabled="submitting" @tap="handleSubmit">
				{{ submitting ? '提交中...' : '提交' }}
			</button>
		</view> -->
	</view>
</template>

<script>
	import {
		ref,
		toRaw,
		computed
	} from 'vue'
	import {
		addShipper,
		getShipperById,
		putShipper,
		updateBgImage
	} from '@/waybill/api/shipper.js'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import config from '@/config'
	
	export default {
		setup() {
			const formData = ref({
				company_name: '',
				credit_code: '',
				bg_image_url: ''
			})
			const id =ref()
			const submitting = ref(false)
			const fullPath = ref()
			
			const bgImageUrl = ref('')
			
			// 表单验证
			const validateForm = () => {
				if (!formData.value.company_name) {
					uni.showToast({
						title: '请输入公司名称',
						icon: 'none'
					})
					return false
				}
				// if (!formData.value.credit_code) {
				// 	uni.showToast({
				// 		title: '请输入统一社会信用代码',
				// 		icon: 'none'
				// 	})
				// 	return false
				// }
				// if (formData.value.credit_code.length !== 18) {
				// 	uni.showToast({
				// 		title: '请输入正确的统一社会信用代码',
				// 		icon: 'none'
				// 	})
				// 	return false
				// }
				return true
			}

			// 提交表单
			const handleSubmit = async () => {
				if (!validateForm()) return
				if (submitting.value) return

				submitting.value = true
				try {
					const data = toRaw(formData.value)
					console.log(data)
					if(data.id) {
						await putShipper(data.id,
							{
								'company_name': data.company_name,
								'credit_code': data.credit_code
							}
						)
						uni.showToast({
							title: '更新成功',
							icon: 'success'
						})
					} else {
						 await addShipper({
							'company_name': data.company_name,
							'credit_code': data.credit_code
						})
						uni.showToast({
							title: '添加成功',
							icon: 'success'
						})
					}

					// 延迟返回上一页
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)

				} catch (error) {
					console.error('操作失败:', error)
					uni.showToast({
						title: '操作失败，请重试',
						icon: 'none'
					})
				} finally {
					submitting.value = false
				}
			}
			const uploadImage = () => {
				console.log('upload')
				
				uni.chooseImage({
					sizeType:'original',
					success: async (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						console.log(chooseImageRes)
						console.log(tempFilePaths)
						uni.showLoading({
							title:'上传防伪背景图'
						})
						const res = await updateBgImage(id.value, chooseImageRes.tempFiles[0])
						console.log(res)
						uni.showToast({
							title:'上传成功'
						})
						formData.value.bg_image_url = res.data.bg_image_url
						console.log(formData)
						bgImageUrl.value = config.apiBaseUrl + res.data.bg_image_url
					},
					complete: () => {
						uni.hideLoading()
					}
				});
			}
			const getDetial = async (id) => {
				uni.showLoading({
					title: '加载中...'
				})
				try {
					const res = await getShipperById(id)
					// console.log(res.data)
					formData.value = res.data
					bgImageUrl.value = config.apiBaseUrl + res.data.bg_image_url
				} catch (e) {
					//TODO handle the exception
				} finally {
					uni.hideLoading()
				}
			}
			onLoad((data) => {
				console.log(data)
				id.value = data.id
				getDetial(data.id)
			})
			const imageError = (error) => {
				console.log('图片加载失败',error)
			}
			return {
				bgImageUrl,
				formData,
				imageError,
				submitting,
				handleSubmit,
				uploadImage
			}
		},

	}
</script>

<style lang="scss">
	@use '@/styles/iconfont.scss';
	@use 'sass:color';
	@use '@/styles/index.scss' as *;

	.add-shipper-container {
		min-height: 100vh;
		background-color: $bg-color;
		padding: $spacing-sm;
	}

	.form-container {
		background: $bg-white;
		border-radius: $radius-md;
		padding: $spacing-lg;
		margin-bottom: $spacing-lg;

		.form-item {
			margin-bottom: $spacing-lg;

			.label {
				display: block;
				font-size: $font-size-md;
				color: $text-main;
				margin-bottom: $spacing-sm;

				&.required:before {
					content: '*';
					color: $danger-color;
					margin-right: 4rpx;
				}
			}
			.uploadimage {
				width: 100%;
				height: 200px;
				background-color: $bg-color;
			}

			.input {
				width: 100%;
				height: 88rpx;
				background: $bg-color;
				border-radius: $radius-sm;
				padding: 0 $spacing-md;
				font-size: $font-size-md;
				color: $text-main;

				&:focus {
					background: mix($bg-color, #000, 98%);
				}
			}
		}

		.tips {
			display: flex;
			align-items: flex-start;
			padding: $spacing-md;
			background: rgba($primary-color, 0.1);
			border-radius: $radius-sm;

			.icon-info {
				font-size: 32rpx;
				color: $primary-color;
				margin-right: $spacing-sm;
				margin-top: 4rpx;
			}

			.tips-text {
				flex: 1;
				font-size: $font-size-sm;
				color: $text-secondary;
				line-height: 1.5;
			}
		}
	}

	.placeholder-style {
		color: $text-light;
	}

	.submit-section {
		margin-top: $spacing-lg;
		padding: 0 $spacing-md;

		.submit-btn {
			width: 100%;
			height: 88rpx;
			background: $primary-gradient;
			border-radius: $radius-lg;
			color: $text-white;
			font-size: $font-size-lg;
			border: none;

			&:active {
				opacity: $opacity-hover;
			}

			&[disabled] {
				opacity: $opacity-disabled;
				background: $gray-4;
			}
		}
	}

	.textarea {
		width: 100%;
		height: 200rpx;
		background: $bg-color;
		border-radius: $radius-sm;
		padding: $spacing-md;
		font-size: $font-size-md;
		color: $text-main;

		&:focus {
			background: mix($bg-color, #000, 98%);
		}
	}
</style>