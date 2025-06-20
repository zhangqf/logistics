<template>
	<view class="waybill-add">
		<form @submit="handleSubmit">
			<!-- 发货信息 -->
			<view class="form-section">
				<view class="section-title">发货信息</view>
				<view class="form-item">
					<text class="label required">公司名称</text>
					<!-- <input v-model="formData.senderCompany" class="input" placeholder="请输入发货公司名称"
						placeholder-class="placeholder-style" /> -->
					<uni-data-select class="input" style="background-color: #fff;" v-model="formData.senderCompany"
						:localdata="selectList"></uni-data-select>
				</view>
				<view class="form-item">
					<text class="label required">公司地址</text>
					<input v-model="formData.senderAddress" class="input" placeholder="请输入发货公司地址"
						placeholder-class="placeholder-style" />
				</view>
			</view>

			<!-- 收货信息 -->
			<view class="form-section">
				<view class="section-title">收货信息</view>
				<view class="form-item">
					<text class="label required">公司名称</text>
					<input v-model="formData.receiverCompany" class="input" placeholder="请输入收货公司名称"
						placeholder-class="placeholder-style" />
				</view>
				<view class="form-item">
					<text class="label required">公司地址</text>
					<input v-model="formData.receiverAddress" class="input" placeholder="请输入收货公司地址"
						placeholder-class="placeholder-style" />
				</view>
			</view>
			<view class="form-section">
				<view class="section-title">派车时间</view>
				<view class="form-item">
					<text class="label required">派车时间</text>
					<!-- <textarea v-model="formData.dispatch_time" class="textarea" placeholder="请输入派车时间"
						placeholder-class="placeholder-style" /> -->
					<uni-datetime-picker style="width: 100%; " type="datetime" return-type='date'
						v-model="formData.dispatch_time" />
				</view>

			</view>
			<!-- 物料信息 -->
			<view class="form-section">
				<view class="section-title">物料信息</view>
				<view class="form-item">
					<text class="label required">所属区域</text>
					<!-- <textarea v-model="formData.materialInfo" class="textarea" placeholder="请输入物料详细信息"
						placeholder-class="placeholder-style" /> -->
					<uni-data-select style="width:100%; height:72rpx;line-height: 72rpx; font-size: 32rpx;"
						v-model="formData.region" :localdata="selectRegionsList" placeholder='请选择地区'></uni-data-select>
				</view>
				<view class="form-item">
					<text class="label required">物料详情</text>
					<textarea v-model="formData.materialInfo" class="textarea" placeholder="请输入物料详细信息"
						placeholder-class="placeholder-style" />
				</view>

			</view>


			<!-- 防伪背景图 -->
			<!-- <view class="form-section">
				<view class="section-title">防伪背景图</view>
				<view class="upload-section">
					<image 
						v-if="formData.securityImage" 
						:src="formData.securityImage" 
						mode="aspectFit" 
						class="preview-image"
						@tap="previewImage"
					/>
					<button 
						v-else 
						class="upload-btn" 
						@tap="chooseImage"
					>
						<text class="iconfont icon-upload"></text>
						<text>上传图片</text>
					</button>
				</view>
			</view> -->

			<!-- 提交按钮 -->
			<view class="foot-button">
				<button class="submit-btn" form-type="submit">
					发布运单
				</button>
			</view>

		</form>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'
	import config from '@/config'
	import {
		postWaybills
	} from "@/waybill/api/waybills.js"
	import {
		toRaw
	} from 'vue';
	import {
		useShippers
	} from '@/waybill/composables/shipper.js'
	import {
		onReady
	} from '@dcloudio/uni-app';
	import {
		useRegions
	} from '@/waybill/composables/regions.js'

	const {
		getShippers,
		selectList,
		shipperList
	} = useShippers();

	const formData = ref({
		senderCompany: '',
		senderAddress: '',
		receiverCompany: '',
		receiverAddress: '',
		materialInfo: '',
		securityImage: '',
		dispatch_time: '',
		region:''
	})
	
	// 区域
	const {
		getRegionsList,
		selectRegionsList,
		regions
	} = useRegions()
	getRegionsList()
	// 生成22位运单号（年份+18位随机码）
	const generateWaybillNumber = () => {
		const year = new Date().getFullYear()
		const randomCode = Array.from({
				length: 18
			}, () =>
			Math.floor(Math.random() * 10)
		).join('')
		return `${year}${randomCode}`
	}

	// 选择图片
	const chooseImage = async () => {
		try {
			const res = await uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera']
			})

			// 上传图片到服务器
			const uploadRes = await uploadFile(res.tempFilePaths[0])
			formData.value.securityImage = uploadRes.url
		} catch (error) {
			uni.showToast({
				title: '图片选择失败',
				icon: 'none'
			})
		}
	}

	// 上传文件到服务器
	const uploadFile = (filePath) => {
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: `${config.apiBaseUrl}/api/upload`,
				filePath: filePath,
				name: 'file',
				success: (res) => {
					const data = JSON.parse(res.data)
					if (data.code === 0) {
						resolve(data.data)
					} else {
						reject(new Error(data.message))
					}
				},
				fail: reject
			})
		})
	}

	// 预览图片
	const previewImage = () => {
		if (formData.value.securityImage) {
			uni.previewImage({
				urls: [formData.value.securityImage]
			})
		}
	}

	// 表单提交
	const handleSubmit = async () => {
		// 验证表单
		if (!formData.value.senderCompany || !formData.value.senderAddress ||
			!formData.value.receiverCompany || !formData.value.receiverAddress ||
			!formData.value.materialInfo || !formData.value.dispatch_time ||!formData.value.region) {
			uni.showToast({
				title: '请填写完整信息',
				icon: 'none'
			})
			return
		}

		try {
			uni.showLoading({
				title: '提交中...',
				mask: true
			})
			const data = toRaw(formData.value)
			const submitData = {
				sender_company: data.senderCompany,
				sender_address: data.senderAddress,
				receiver_company: data.receiverCompany,
				receiver_address: data.receiverAddress,
				material_info: data.materialInfo,
				dispatch_time: data.dispatch_time,
				region:data.region
			}
			console.log(submitData)
			const res = await postWaybills(submitData)

			uni.showToast({
				title: '发布成功',
				icon: 'success'
			})
			setTimeout(() => {
				uni.navigateBack()
			}, 1500)

		} catch (error) {
			uni.showToast({
				title: error.message || '提交失败',
				icon: 'none'
			})
		} finally {
			uni.hideLoading()
		}

	}
	onReady(() => {
		getShippers()
	})
</script>

<style>
	v-deep .uni-select__input-placeholder {
		font-size: 30rpx;
	}
</style>
<style lang="scss">
	@use '@/styles/index.scss';

	.text {
		font-size: 28rpx;
		color: #666;
		margin-top: 5px;
	}

	.uni-px-5 {
		padding-left: 10px;
		padding-right: 10px;
	}

	.uni-pb-5 {
		padding-bottom: 10px;
	}

	.waybill-add {
		min-height: 100vh;
		background-color: $gray-2;
		padding-bottom: calc(140rpx + env(safe-area-inset-bottom));
	}

	.form-section {
		background: $bg-white;
		border-radius: $radius-lg;
		padding: $spacing-lg;
		margin-bottom: $spacing-lg;

		.section-title {
			font-size: $font-size-lg;
			font-weight: bold;
			color: $text-main;
			margin-bottom: $spacing-md;
		}
	}

	.form-item {
		margin-bottom: $spacing-md;

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

		.input {
			width: 100%;
			box-sizing: border-box;
			height: 80rpx;
			background: $gray-2;
			border-radius: $radius-sm;
			padding: 0 $spacing-md;
			font-size: $font-size-md;
		}

		.textarea {
			width: 100%;
			height: 200rpx;
			box-sizing: border-box;
			background: $gray-2;
			border-radius: $radius-sm;
			padding: $spacing-md;
			font-size: $font-size-md;
		}
	}

	.upload-section {
		.preview-image {
			width: 100%;
			height: 300rpx;
			border-radius: $radius-sm;
		}

		.upload-btn {
			width: 100%;
			height: 300rpx;
			background: $gray-2;
			border-radius: $radius-sm;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			border: 2rpx dashed $border-color;

			.iconfont {
				font-size: 80rpx;
				color: $text-light;
				margin-bottom: $spacing-sm;
			}

			text {
				font-size: $font-size-md;
				color: $text-light;
			}
		}
	}

	.foot-button {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding-bottom: calc(env(safe-area-inset-bottom));
		background-color: $gray-2;
		display: flex;
		align-items: center;
	}

	.submit-btn {
		width: 700rpx;
		height: 88rpx;
		background: $primary-gradient;
		color: $text-white;
		border-radius: $radius-lg;
		font-size: $font-size-lg;
		margin-top: $spacing-xl;
		border: none;

		&:active {
			opacity: $opacity-hover;
		}
	}

	.placeholder-style {
		color: $text-light;
	}

	.uni-date-x {
		background-color: $bg-color;
		height: 60rpx;

		.uni-date-editor--x {
			border: none !important;
		}

		.icon-calendar {
			display: none;
		}

		.uni-date__x-input {
			font-size: 28rpx;
			height: 60rpx;
			padding-left: 10rpx;
		}

	}
</style>