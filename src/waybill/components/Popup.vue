<template>
	<view class="popup-mask" @tap="closeDriverPopup"></view>
	<view class="driver-popup">
		<view class="popup-header">
			<text class="title">{{title}}</text>
			<text class="close-btn" @tap="closeDriverPopup">×</text>
		</view>
		<scroll-view scroll-y class="driver-list">
			<view class="driver-item" v-for="item in data" :key="item.id"
				:class="{ active: selectedRegion?.id === item.id }" @tap="selectRegion(item)">
				<view class="driver-info">
					<view style="display: flex;justify-content: space-between;">
						<text class="name">{{item.name}}</text>
					</view>
				</view>
			</view>
			<view class="driver-item empty">
			</view>
		</scroll-view>

		<view class="footer">
			<view class="popup-footer">
				<button class="cancel-btn" @tap="closeDriverPopup">
					{{cancelText}}
				</button>
				<button class="confirm-btn" @tap="handleConfirm" :disabled="!selectedRegion">
					{{confirmText}}
				</button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from "vue"
	const emit = defineEmits(['confirm', 'cancel'])
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
	const selectedRegion = ref(null)
	const selectRegion = (data) => {
		selectedRegion.value = data
	}

	const closeDriverPopup = () => {
		emit('cancel')
	}
	const handleConfirm = () => {
		emit('confirm', selectedRegion)
	}
</script>

<style lang="scss">
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
		bottom: 0;
		background: $bg-white;
		border-radius: $radius-lg $radius-lg 0 0;
		z-index: 101;
		max-height: 70vh;
		display: flex;
		flex-direction: column;
		padding-bottom: calc(env(safe-area-inset-bottom));
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

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding-bottom: calc(env(safe-area-inset-bottom));
		background-color: #fff;
	}

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