<template>
	<view class="add-driver-container">
		<view class="form-container">
			<!-- 姓名 -->
			<view class="form-item">
				<text class="label required">姓名</text>
				<input 
					class="input" 
					type="text" 
					v-model="formData.name" 
					placeholder="请输入司机姓名"
					placeholder-class="placeholder-style"
					maxlength="10"
				/>
			</view>
			
			<!-- 手机号 -->
			<view class="form-item">
				<text class="label required">手机号</text>
				<input 
					class="input" 
					type="number" 
					v-model="formData.phone" 
					placeholder="请输入手机号"
					placeholder-class="placeholder-style"
					maxlength="11"
				/>
			</view>
			
			<!-- 车牌号 -->
			<view class="form-item">
				<text class="label required">车牌号</text>
				<input 
					class="input" 
					type="text" 
					v-model="formData.plateNumber" 
					placeholder="请输入车牌号"
					placeholder-class="placeholder-style"
					maxlength="8"
					style="text-transform: uppercase;"
				/>
			</view>

			<!-- 提示信息 -->
			<view class="tips">
				<text class="iconfont icon-info"></text>
				<text class="tips-text">请确保信息真实有效，信息提交后需要审核</text>
			</view>
		</view>

		<!-- 提交按钮 -->
		<view class="submit-section">
			<button class="submit-btn" :disabled="submitting" @tap="handleSubmit">
				{{ submitting ? '提交中...' : '提交' }}
			</button>
		</view>
	</view>
</template>

<script>
import { ref } from 'vue'

export default {
	setup() {
		const formData = ref({
			name: '',
			phone: '',
			plateNumber: ''
		})
		
		const submitting = ref(false)

		// 验证手机号
		const validatePhone = (phone) => {
			const reg = /^1[3-9]\d{9}$/
			return reg.test(phone)
		}

		// 验证车牌号
		const validatePlateNumber = (plateNumber) => {
			const reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-Z0-9]{4,5}[A-Z0-9挂学警港澳]$/
			return reg.test(plateNumber)
		}

		// 表单验证
		const validateForm = () => {
			if (!formData.value.name) {
				uni.showToast({
					title: '请输入司机姓名',
					icon: 'none'
				})
				return false
			}
			if (!formData.value.phone) {
				uni.showToast({
					title: '请输入手机号',
					icon: 'none'
				})
				return false
			}
			if (!validatePhone(formData.value.phone)) {
				uni.showToast({
					title: '请输入正确的手机号',
					icon: 'none'
				})
				return false
			}
			if (!formData.value.plateNumber) {
				uni.showToast({
					title: '请输入车牌号',
					icon: 'none'
				})
				return false
			}
			if (!validatePlateNumber(formData.value.plateNumber)) {
				uni.showToast({
					title: '请输入正确的车牌号',
					icon: 'none'
				})
				return false
			}
			return true
		}

		// 提交表单
		const handleSubmit = async () => {
			if (!validateForm()) return
			if (submitting.value) return

			submitting.value = true
			try {
				// 这里添加实际的API调用
				await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用
				
				uni.showToast({
					title: '添加成功',
					icon: 'success'
				})
				
				// 延迟返回上一页
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
				
			} catch (error) {
				console.error('添加司机失败:', error)
				uni.showToast({
					title: '添加失败，请重试',
					icon: 'none'
				})
			} finally {
				submitting.value = false
			}
		}

		return {
			formData,
			submitting,
			handleSubmit
		}
	}
}
</script>

<style lang="scss">
@use 'sass:color';
@use '@/styles/iconfont.scss';
@use '@/styles/index.scss';
.add-driver-container {
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
		
		.input {
			width: 100%;
			height: 88rpx;
			background: $bg-color;
			border-radius: $radius-sm;
			padding: 0 $spacing-md;
			font-size: $font-size-md;
			color: $text-main;
			
			&:focus {
				background: color.adjust($bg-color, $lightness: -2%);
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
</style> 