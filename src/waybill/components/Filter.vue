<template>
	<view class="popup-mask" @tap="closeDriverPopup"></view>
	<view class="driver-popup">
		<view class="popup-header">
			<text class="title">{{title}}</text>
			<button @click="reset" class='reset' size="mini">重置</button>
			<text class="close-btn" @tap="closeDriverPopup">×</text>
		</view>
		<view class="popup-title">
			<checkbox-group @change="checkboxChange" class="ui-checkbox">
				<label v-for="item in itemLabel" :key="item.id">
					<checkbox :value="item.id" :checked="item.checked" />{{item.label}}
				</label>
			</checkbox-group>
		</view>
		<view class="popup-content">
			<view class="uni-form-item uni-column " v-for="item in itemLabel" :key="item.id" >
				<template v-if="activeCheckbox.includes(item.id)">
					<view class="input-popup">
						<view class="title">{{item.label}}</view>
						<input v-if="item.id !== '4'"  class="uni-input input-text" v-model="item.value" :placeholder="'请输入'+item.label" />
						<view v-else @tap='handleRegion' class="uni-input input-text"> {{item.value}}</view>
					</view>
				</template>
			</view>
		</view>
		<view class="footer">
			<view class="popup-footer">
				<button class="cancel-btn" @tap="closeDriverPopup">
					{{cancelText}}
				</button>
				<button class="confirm-btn" @tap="handleConfirm" :disabled="activeCheckbox.length===0">
					{{confirmText}}
				</button>
			</view>
		</view>
		<Popup v-if='showPopup' @confirm='confirm' @cancel='showPopup = false' title='选择区域' :data='regions'/>
	</view>
</template>

<script setup>
	import {
		ref, toRaw
	} from "vue"
	import Popup from '@/waybill/components/Popup'
	import {
		useRegions
	} from '@/waybill/composables/regions.js'
	
	const emit = defineEmits(['confirm', 'cancel','reset'])
	defineProps({
		title: {
			type: String,
			default: ''
		},
		data: {
			type: Array,
			default: []
		},
		confirmText: {
			type: String,
			default: '确定'
		},
		cancelText: {
			type: String,
			default: '取消'
		}
	})
	const itemLabel = ref([{
			label: '司机姓名',
			id: '1',
			name:'driver_name',
			checked: false,
			value:''
		},
		{
			label: '手机号',
			id: '2',
			name:'phone',
			checked: false,
			value:''
		},
		{
			label: '车牌号',
			name:'driver_license_plate',
			id: '3',
			checked: false,
			value:''
		},
		{
			label: '区域',
			name: 'region',
			id: '4',
			checked: false,
			value:''
		},
	])
	
	const {
		getRegionsList,
		regions
	} = useRegions()
	
	const searchDriver = ref({
		
	})
	
	const activeCheckbox = ref([])

	const checkboxChange = (e) => {
		// var items = itemLabel.value
		// values = e.detail.value;
		console.log(e)
		activeCheckbox.value = e.detail.value
	}
	
	const handleRegion = (item) => {
		console.log('23')
		showPopup.value = true
		
	}
	
	const selectedRegion = ref(null)
	const selectRegion = (data) => {
		selectedRegion.value = data
	}

	const closeDriverPopup = () => {
		emit('cancel')
	}
	const showPopup = ref(false)
	const confirm = (data) => {
		itemLabel.value[3].value = data.value.name
		showPopup.value = false
	}
	const handleConfirm = () => {
		const item = toRaw(itemLabel.value)
		const obj = {}
		item.map(v => {
			if(activeCheckbox.value.includes(v.id)){
				obj[v.name] = v.value
			}
		})
		console.log(obj)
		emit('confirm', obj)
	}
	const reset = () => {
		emit('reset')
	}
	getRegionsList()
</script>

<style lang="scss">
	@use '@/styles/index.scss';
	.reset{
		background-color: $primary-color;
	}
	/* 司机选择弹窗 */
	.popup-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 100;
	}

	.driver-popup {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		background: $bg-white;
		border-radius: 0 0 $radius-lg $radius-lg;
		z-index: 101;
		max-height: 70vh;
		display: flex;
		flex-direction: column;

		// padding-bottom: calc(env(safe-area-inset-bottom));
		.popup-title {
			padding: 30rpx 50rpx 0 ;
			.ui-checkbox {
				display: flex;
				justify-content: space-around;
				align-items: center;
			}
		}
		.popup-content{
			padding: 0 50rpx 50rpx 50rpx;
			margin-top: 40rpx;
			.input-popup{
				margin-top: 40rpx;
				height: 80rpx;
				line-height: 80rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.title{
					width: 150rpx;
					font-size: 32rpx;
				}
				.input-text{
					flex:1;
					height: 100%;
					border: 1rpx solid #ccc;
					font-size: 34rpx;
					border-radius: 10rpx;
					padding-left: 20rpx;
				}
			}
		}
	}

	.popup-header {
		padding: $spacing-lg;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 2rpx solid $border-color;

		.title {
			font-size: $font-size-lg;
			font-weight: bold;
			color: $text-main;
		}

		.close-btn {
			font-size: 48rpx;
			color: $text-light;
			line-height: 1;
		}
	}

	.driver-list {
		flex: 1;
		// padding: 0 $spacing-lg;
		max-height: 60vh;
		box-sizing: border-box;
	}

	.driver-item {
		display: flex;
		align-items: center;
		padding: $spacing-md $spacing-lg;
		border-bottom: 2rpx solid $border-color1;

		&.empty {
			height: 140rpx;
		}

		&.active {
			background: rgba($success-color, 0.15);
		}

		.avatar {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			margin-right: $spacing-md;
		}

		.driver-info {
			flex: 1;

			.name {
				font-size: $font-size-md;
				color: $text-main;
				margin-bottom: 4rpx;
			}

			.phone {
				font-size: $font-size-sm;
				color: $text-secondary;
			}

			.plate {
				color: $text-main;
				border: 2rpx solid $default-color;
				border-radius: 8rpx;
				padding: 10rpx;
				background-color: $default-color;
			}
		}

		.select-icon {
			font-size: 40rpx;
			color: $primary-color;
			margin-left: $spacing-md;

		}
	}

	// .footer {
	// 	position: fixed;
	// 	bottom: 0;
	// 	left: 0;
	// 	right: 0;
	// 	padding-bottom: calc(env(safe-area-inset-bottom));
	// 	background-color: #fff;
	// }

	.popup-footer {
		padding: $spacing-lg;
		display: flex;
		justify-content: space-between;
		border-top: 2rpx solid $border-color;

		button {
			flex: 1;
			height: 80rpx;
			border-radius: $radius-lg;
			font-size: $font-size-md;
			border: none;
			line-height: 80rpx;

			&.cancel-btn {
				background: $bg-color;
				color: $text-main;
				margin-right: $spacing-md;
			}

			&.confirm-btn {
				background: $primary-gradient;
				color: $text-main;

				&[disabled] {
					opacity: $opacity-disabled;
					background: $gray-4;
				}
			}

			&:active {
				opacity: $opacity-hover;
			}
		}
	}
</style>