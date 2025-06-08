<template>
	<view class="weighnote-page">
		<!-- 抬头 -->
		<view class="header-section">
			<view class="company-title">新疆哈密三塘湖能源开发建设有限责任公司</view>
			<view class="document-title">销售过磅单</view>
			<view class="unit">单位：吨</view>
		</view>

		<!-- 表格内容 -->
		<view class="table-container">
			<view class="table-row">
				<view class="table-cell label-cell">发货公司</view>
				<view class="table-cell content-cell">新疆哈密三塘湖能源开发建设有限责任公司</view>
			</view>
			<view class="table-row">
				<view class="table-cell label-cell">入厂时间</view>
				<view class="table-cell content-cell">{{ formatDate(weighNote.factory_entry_time) || '' }}</view>
				<!-- <input class="uni-input table-cell" placeholder="自动获得焦点" v-model='weighNote.factory_entry_time' /> -->
			</view>
			<view class="table-row">
				<view class="table-cell label-cell">出厂时间</view>
				<view class="table-cell content-cell">{{ formatDate(weighNote.factory_exit_time) || '' }}</view>
				<!-- <input class="uni-input table-cell" placeholder="自动获得焦点" v-model='weighNote.exit_time' /> -->
			</view>
			<view class="table-row">
				<view class="table-cell label-cell">货物名称</view>
				<view class="table-cell content-cell">{{ weighNote.material_info || '' }}</view>
				<!-- <input class="uni-input table-cell" placeholder="自动获得焦点" v-model='weighNote.material_info' /> -->
			</view>
			<view class="table-row">
				<view class="table-cell label-cell">磅单编号</view>
				<!-- <view class="table-cell content-cell">{{ weighNote.weigh_note_number || '' }}</view> -->
				<input class="uni-input table-cell" placeholder="自动获得焦点" v-model='weighNote.weigh_note_number' />
			</view>
			<view class="table-row">
				<view class="table-cell label-cell">车牌号码</view>
				<view class="table-cell content-cell">{{ weighNote.assignee_info.driver_license_plate || '' }}</view>
				<!-- <input class="uni-input table-cell" placeholder="自动获得焦点" v-model='weighNote.assignee_info.driver_license_plate' /> -->
			</view>
			<view class="table-row">
				<view class="table-cell label-cell">司机姓名</view>
				<view class="table-cell content-cell">{{ weighNote.assignee_info.driver_name || '' }}</view>
				<!-- <input class="uni-input table-cell" placeholder="自动获得焦点" v-model='weighNote.assignee_info.driver_name' /> -->
			</view>
			<view class="table-row">
				<view class="table-cell label-cell">收货单位</view>
				<view class="table-cell content-cell">{{ weighNote.receiver_company || '' }}</view>
				<!-- <input class="uni-input table-cell" placeholder="自动获得焦点" v-model='weighNote.receiver_company' /> -->
			</view>
			<view class="table-row">
				<view class="table-cell label-cell">承运单位</view>
				<!-- <view class="table-cell content-cell">{{ weighNote.carrier_company || '' }}</view> -->
				<input class="uni-input table-cell" placeholder="请输入承运单位" v-model='weighNote.carrier_company' />
			</view>
			<view class="table-row">
				<view class="table-cell label-cell">毛重</view>
				<!-- <view class="table-cell content-cell">{{ weighNote.gross_weight || '' }}</view> -->
				<input class="uni-input table-cell" placeholder="请输入毛重" v-model='weighNote.gross_weight' />
			</view>
			<view class="table-row">
				<view class="table-cell label-cell">皮重</view>
				<!-- <view class="table-cell content-cell">{{ weighNote.tare_weight || '' }}</view> -->
				<input class="uni-input table-cell" placeholder="请输入皮重" v-model='weighNote.tare_weight' />
			</view>
			<view class="table-row">
				<view class="table-cell label-cell">净重</view>
				<!-- <view class="table-cell content-cell">{{ weighNote.net_weight || '' }}</view> -->
				<input class="uni-input table-cell" placeholder="请输入净重" v-model='weighNote.net_weight' />
			</view>
			<view class="table-row">
				<view class="table-cell label-cell">集装箱号</view>
				<!-- <view class="table-cell content-cell">{{ weighNote.container_number || '' }}</view> -->
				<input class="uni-input table-cell" placeholder="请输入集装箱号" v-model='weighNote.container_number' />
			</view>
			<view class="table-row no-border-bottom">
				<view class="table-cell label-cell">收货地址</view>
				<view class="table-cell content-cell">{{ weighNote.receiver_address || '' }}</view>
				<!-- <input class="uni-input table-cell" placeholder="请输入收货地址" v-model='weighNote.receiver_address' /> -->
			</view>
		</view>

		<!-- 底部操作区 -->
		<view class="footer-actions">
			<text class="page-number">1-1</text>
			<view class="buttons">
				<button class="action-btn primary-btn" @tap="generateQRCode">生成二维码</button>
				<button class="action-btn secondary-btn" :disabled="!canDownload" @tap="downloadImage">下载为图片</button>
			</view>
		</view>
	</view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue'
import { formatDate } from '@/utils/utils.js'

const weighNote = ref({
	entry_time: '2023-10-26 10:00:00',
	exit_time: '2023-10-26 12:00:00',
	goods_name: '矿石',
	weigh_note_number: '202310260001',
	plate_number: '新A12345',
	driver_name: '张三',
	receiver_company: '天水某某公司',
	carrier_company: '某某物流',
	gross_weight: '50.00',
	tare_weight: '20.00',
	net_weight: '30.00',
	container_number: 'C1234567',
	receiver_address: '天水市秦州区某某路某某号'
})

const canDownload = ref(false)

const generateQRCode = () => {
	uni.showToast({
		title: '生成二维码功能待实现',
		icon: 'none'
	})
	// 实际项目中这里会调用生成二维码的API或库
	canDownload.value = true // 模拟生成二维码后可下载
}

const downloadImage = () => {
	uni.showToast({
		title: '下载为图片功能待实现',
		icon: 'none'
	})
	// 实际项目中这里会调用uni.canvasToTempFilePath将页面渲染为图片
}

onLoad((data)=>{
	console.log(JSON.parse(data.data))
	weighNote.value = JSON.parse(data.data) || {
	entry_time: '2023-10-26 10:00:00',
	exit_time: '2023-10-26 12:00:00',
	goods_name: '矿石',
	weigh_note_number: '202310260001',
	plate_number: '新A12345',
	driver_name: '张三',
	receiver_company: '天水某某公司',
	carrier_company: '某某物流',
	gross_weight: '50.00',
	tare_weight: '20.00',
	net_weight: '30.00',
	container_number: 'C1234567',
	receiver_address: '天水市秦州区某某路某某号'
}
})
</script>

<style lang="scss">
.weighnote-page {
	background-color: #FFFFFF;
	padding: 40rpx 30rpx;
	min-height: 100vh;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.header-section {
	text-align: center;
	margin-bottom: 40rpx;

	.company-title {
		font-size: 38rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.document-title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}

	.unit {
		text-align: right;
		font-size: 26rpx;
		color: #666;
		padding-right: 10rpx;
	}
}

.table-container {
	border: 2rpx solid #000;
	margin-bottom: 40rpx;

	.table-row {
		display: flex;
		border-bottom: 2rpx solid #000;

		&:last-child,
		&.no-border-bottom {
			border-bottom: none;
		}
		.input{
			height: 100%;
			line-height: 28rpx;
		}
		.table-cell {
			padding: 20rpx 15rpx;
			font-size: 28rpx;
			color: #333;
			border-right: 2rpx solid #000;
			display: flex;
			align-items: center;

			&:last-child {
				border-right: none;
			}
		}

		.label-cell {
			flex: 0 0 200rpx; // 固定左侧label宽度
			background-color: #F8F8F8;
			font-weight: bold;
		}

		.content-cell {
			flex: 1;
		}
	}
}

.footer-actions {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	margin-top: auto; // 将底部推到最下方

	.page-number {
		font-size: 26rpx;
		color: #666;
	}

	.buttons {
		display: flex;
		.action-btn {
			margin-left: 20rpx;
			height: 70rpx;
			line-height: 70rpx;
			font-size: 28rpx;
			padding: 0 40rpx;
			border-radius: 8rpx;
			border: 2rpx solid #D9D9D9;
			background-color: #F0F0F0;
			color: #333;
			
			&.primary-btn {
				background-color: #F7DB1C; // 黄色按钮
				border-color: #F7DB1C;
				color: #333;
			}

			&.secondary-btn {
				background-color: #FFFFFF;
				border-color: #D9D9D9;
				color: #333;
			}
			
			&:active {
				opacity: 0.8;
			}

			&[disabled] {
				opacity: 0.6;
				background-color: #F0F0F0;
				color: #999;
				border-color: #E6E6E6;
			}
		}
	}
}
</style> 