<template>
	<view class="waybill-add">
		<form @submit="handleSubmit">
			<!-- 发货信息 -->
			<view class="form-section">
				<view class="section-title">发货信息</view>
				<view class="form-item">
					<text class="label">公司名称</text>
					<input 
						v-model="formData.senderCompany" 
						class="input" 
						placeholder="请输入发货公司名称"
						placeholder-class="placeholder-style"
					/>
				</view>
				<view class="form-item">
					<text class="label">公司地址</text>
					<input 
						v-model="formData.senderAddress" 
						class="input" 
						placeholder="请输入发货公司地址"
						placeholder-class="placeholder-style"
					/>
				</view>
			</view>

			<!-- 收货信息 -->
			<view class="form-section">
				<view class="section-title">收货信息</view>
				<view class="form-item">
					<text class="label">公司名称</text>
					<input 
						v-model="formData.receiverCompany" 
						class="input" 
						placeholder="请输入收货公司名称"
						placeholder-class="placeholder-style"
					/>
				</view>
				<view class="form-item">
					<text class="label">公司地址</text>
					<input 
						v-model="formData.receiverAddress" 
						class="input" 
						placeholder="请输入收货公司地址"
						placeholder-class="placeholder-style"
					/>
				</view>
			</view>

			<!-- 物料信息 -->
			<view class="form-section">
				<view class="section-title">物料信息</view>
				<view class="form-item">
					<text class="label">物料详情</text>
					<textarea 
						v-model="formData.materialInfo" 
						class="textarea" 
						placeholder="请输入物料详细信息"
						placeholder-class="placeholder-style"
					/>
				</view>
			</view>

			<!-- 防伪背景图 -->
			<view class="form-section">
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
			</view>

			<!-- 提交按钮 -->
			<button 
				class="submit-btn" 
				form-type="submit"
			>
				发布运单
			</button>
		</form>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import config from '@/config'

const formData = ref({
	senderCompany: '',
	senderAddress: '',
	receiverCompany: '',
	receiverAddress: '',
	materialInfo: '',
	securityImage: ''
})

// 生成22位运单号（年份+18位随机码）
const generateWaybillNumber = () => {
	const year = new Date().getFullYear()
	const randomCode = Array.from({ length: 18 }, () => 
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
		!formData.value.materialInfo || !formData.value.securityImage) {
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

		const submitData = {
			...formData.value,
			waybillNumber: generateWaybillNumber(),
			validUntil: '9999-12-31 23:59:59',
			createTime: new Date().toISOString()
		}

		const res = await uni.request({
			url: `${config.apiBaseUrl}/api/waybill`,
			method: 'POST',
			data: submitData
		})

		if (res.statusCode === 200 && res.data.code === 0) {
			uni.showToast({
				title: '发布成功',
				icon: 'success'
			})
			setTimeout(() => {
				uni.navigateBack()
			}, 1500)
		} else {
			throw new Error(res.data.message || '提交失败')
		}
	} catch (error) {
		uni.showToast({
			title: error.message || '提交失败',
			icon: 'none'
		})
	} finally {
		uni.hideLoading()
	}
}
</script>

<style lang="scss">
.waybill-add {
	min-height: 100vh;
	background-color: $bg-color;
	padding: $spacing-lg;
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
	}

	.input {
		width: 100%;
		height: 80rpx;
		background: $bg-color;
		border-radius: $radius-sm;
		padding: 0 $spacing-md;
		font-size: $font-size-md;
	}

	.textarea {
		width: 100%;
		height: 200rpx;
		background: $bg-color;
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
		background: $bg-color;
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

.submit-btn {
	width: 100%;
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
</style> 