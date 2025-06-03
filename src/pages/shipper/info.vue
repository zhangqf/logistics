<template>
	<view class="shipper-container">
		<!-- 顶部搜索区域 -->
		<view class="search-section">
			<view class="search-box">
				<text class="iconfont icon-search"></text>
				<input type="text" v-model="searchText" placeholder="搜索公司名称" placeholder-class="placeholder-style" />
			</view>
		</view>

		<!-- 公司列表 -->
		<view class="company-list" v-if="companies.length > 0">
			<view class="company-item" v-for="(item, index) in companies" :key="index" @tap="handleCompanyTap(item)">
				<view class="company-info">
					<view class="company-name">{{item.company_name}}</view>
					<view class="company-code">统一社会信用代码：{{item.credit_code}}</view>
				</view>
				<text class="iconfont icon-arrow-right"></text>
			</view>
		</view>

		<!-- 空状态 -->
		<view class="empty-state" v-else>
			<text class="iconfont icon-empty"></text>
			<text class="empty-text">暂无货主信息</text>
		</view>

		<!-- 添加按钮 -->
		<view class="add-btn" @tap="handleAddShipper">
			<text class="iconfont icon-add"></text>
			<text>添加货主</text>
		</view>
	</view>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getShipper} from '@/api/shipper.js'
export default {
	setup() {
		const searchText = ref('')
		const companies = ref([
			
		])

		const handleCompanyTap = (company) => {
			console.log('点击公司:', company)
			// 可以跳转到公司详情页
		}

		const handleAddShipper = () => {
			uni.navigateTo({
				url: '/pages/shipper/add'
			})
		}
		const getList = async() => {
			const {data} = await getShipper()
			companies.value = data
			
		}
		onMounted(() => {
			getList()
		})
		return {
			searchText,
			companies,
			handleCompanyTap,
			handleAddShipper
		}
	},

}
</script>

<style lang="scss">
@use '@/styles/iconfont.scss';

.shipper-container {
	min-height: 100vh;
	background-color: $bg-color;
	padding-bottom: 120rpx; // 为悬浮按钮留出空间
}

.search-section {
	padding: $spacing-md;
	background-color: $bg-white;
	
	.search-box {
		display: flex;
		align-items: center;
		height: 72rpx;
		background: $bg-color;
		border-radius: $radius-lg;
		padding: 0 $spacing-md;
		
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
}

.placeholder-style {
	color: $text-light;
}

.company-list {
	margin-top: $spacing-sm;
	
	
	.company-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: $spacing-lg;
		border-bottom: 1rpx solid $border-color;
		margin-bottom: 20rpx;
		background-color: $bg-white;
		.company-info {
			flex: 1;
			margin-right: $spacing-md;
			
			.company-name {
				font-size: $font-size-lg;
				color: $text-main;
				margin-bottom: $spacing-sm;
				font-weight: 500;
			}
			
			.company-code {
				font-size: $font-size-sm;
				color: $text-light;
			}
		}
		
		.icon-arrow-right {
			font-size: 32rpx;
			color: $text-light;
		}
		
		&:active {
			background-color: $bg-color;
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

.add-btn {
	position: fixed;
	bottom: $spacing-lg;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	align-items: center;
	justify-content: center;
	width: 90%;
	height: 88rpx;
	background: $primary-gradient;
	border-radius: $radius-lg;
	box-shadow: 0 4rpx 16rpx rgba($primary-color, 0.3);
	
	.icon-add {
		font-size: 40rpx;
		color: $text-white;
		margin-right: $spacing-sm;
	}
	
	text {
		color: $text-white;
		font-size: $font-size-lg;
	}
	
	&:active {
		opacity: $opacity-hover;
	}
}
</style> 