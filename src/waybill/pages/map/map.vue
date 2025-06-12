<template>
	<view class="map-container">
		<map style="width: 100%; height: 100vh;" :scale="1" :markers="markers" :include-points="includePoints"
			:polyline='mapOptions.polyline'>
		</map>
		<view v-if="role === 'admin'" class="input-section-arrow">
			<image :src="toggleImage" class="ui-img" mode="aspectFit" @click="toggleInputSection"></image>

			<view class="top-info" v-if="isInputSectionVisible">
				<view class="time-range">{{departureTime}} — {{arrivalTime}}</view>
				<view class="place-container">
					<view class="place-item">
						<image :src="ACircleRed" class="place-icon" />
						<text class="place-ad-text">{{startCity}}</text>
					</view>
					<view class="place-item">
						<image :src="ACircleGreen" class="place-icon" />
						<text class="place-ad-text">{{endCity}}</text>
					</view>
				</view>
				<view class="data-block">
					<view class="data-column">
						<input type="number" class="data-value" v-model="distance" @input="onMileageInput" />
						<text class="data-label">行驶里程（km）</text>
					</view>
					<view class="data-column">
						<view class="time-input-container">
							<input type="number" class="time-input" v-model="days" @input="onTimeInput" pattern="[0-9]*"
								maxlength="2" />
							<text>:</text>
							<input type="number" class="time-input" v-model="hours" @input="onTimeInput"
								pattern="[0-9]*" maxlength="2" />
							<text>:</text>
							<input type="number" class="time-input" v-model="minutes" @input="onTimeInput"
								pattern="[0-9]*" maxlength="2" />
						</view>
						<text class="data-label">行驶时长(d/h/m)</text>
					</view>
					<view class="data-column">
						<input type="number" class="data-value" v-model="speed" @input="onSpeedInput" />
						<text class="data-label">平均时速（km/h）</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		watch,
		toRaw
	} from 'vue'
	import {
		getMapDetial
	} from '@/waybill/api/map.js'
	import {generateUUID} from '@/waybill/utils/utils.js'
	import upImage from '@/static/a_up.png'
	import downImage from '@/static/a_down.png'
	import aCircleRed from '@/static/a_circle_red.png'
	import aCircleGreen from '@/static/a_circle_green.png'
	import aParking from '@/static/icons/a_parking.png'
	import aCar from '@/static/icons/a_car.png'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import { useUserStore } from '@/stores/user'
	
	const userStore = useUserStore()
	const role = userStore.userInfo.role || ''
	// 基本变量
	const latitude = ref(37.9042)
	const longitude = ref(103.4074)
	const polyline = ref([])
	const scale = ref(6)
	const ACircleRed = ref(aCircleRed)
	const ACircleGreen = ref(aCircleGreen)
	const departureTime = ref('')
	const arrivalTime = ref('')
	const startCity = ref('')
	const endCity = ref('')
	const isInputSectionVisible = ref(false)
	const toggleImage = ref(upImage)
	const includePoints = ref([])
	const parsedPolyline = ref([])
	
	// 核心数据变量
	const distance = ref(0) // 行驶里程 (km)
	const days = ref(0) // 天数
	const hours = ref(0) // 小时数
	const minutes = ref(0) // 分钟数
	const speed = ref(0) // 平均速度 (km/h)
	const markers = ref([])
	const startandend = []
	// 计算总分钟数 (用于存储和计算)
	const totalMinutes = computed({
		get: () => {
			return days.value * 1440 + hours.value * 60 + minutes.value
		},
		set: (val) => {
			const total = Math.max(0, val)
			days.value = Math.floor(total / 1440)
			const remaining = total % 1440
			hours.value = Math.floor(remaining / 60)
			minutes.value = remaining % 60
		}
	})

	// 监听API返回的数据
	const mapOptions = ref({
		mapCenter: {
			latitude: 37.9042,
			longitude: 103.4074
		},
		polyline: [],
		markers: [],
		distance: 0,
		duration: 0,
		scale: 6
	})

	// 当获取到地图详情时更新数据
	watch(() => mapOptions.value, (newVal) => {
		distance.value = newVal.distance.toFixed(0) || 0
		totalMinutes.value = newVal.duration || 0
		updateSpeed()
		// calculateParkingPoints()
	}, {
		deep: true
	})

	// 里程输入处理
	const onMileageInput = (e) => {
		const value = parseFloat(e.detail.value) || 0
		distance.value = Math.max(0, value)
		updateSpeed()
		// calculateParkingPoints()
	}

	// 时间输入处理
	const onTimeInput = () => {
		// 确保值在合理范围内
		days.value = Math.max(0, Math.min(99, parseInt(days.value) || 0))
		hours.value = Math.max(0, Math.min(23, parseInt(hours.value) || 0))
		minutes.value = Math.max(0, Math.min(59, parseInt(minutes.value) || 0))

		updateSpeed()
		// calculateParkingPoints()

	}

	// 速度输入处理
	const onSpeedInput = (e) => {
		const value = parseFloat(e.detail.value) || 0
		speed.value = Math.max(0, value)
		updateTime()
	}

	// 更新速度 (基于距离和时间)
	const updateSpeed = () => {
		if (totalMinutes.value > 0) {
			// 速度 = 距离 / (总分钟数 / 60)
			speed.value = parseFloat((distance.value / (totalMinutes.value / 60)).toFixed(0))
			calculateParkingPoints()
		} else {
			speed.value = 0
			
		}
	}

	// 更新时间 (基于距离和速度)
	const updateTime = () => {
		if (speed.value > 0) {
			// 总分钟数 = (距离 / 速度) * 60
			totalMinutes.value = Math.round((distance.value / speed.value) * 60)
			calculateParkingPoints()
		} else {
			totalMinutes.value = 0
			markers.value.length = 0
			console.log(markers.value)
			console.log(startandend)
			markers.value.push(...startandend)
		}
	}

	// 获取地图详情
	const getDetail = async () => {
		try {
			const res = await getMapDetial(startCity.value, endCity.value)
			// const res = await getMapDetial("上海", "乌鲁木齐")
			
			mapOptions.value = res.data
			const parsedPolyline = res.data.polyline
			startandend.push(...res.data.markers)
			
			startandend.push({
				...res.data.markers[0],
				iconPath: aCar,
				width: 40,
				height: 40,
				id: 'car' // 确保 id 唯一
			})
			includePoints.value = [parsedPolyline[0].points[0], parsedPolyline[0].points[parsedPolyline[0].points
				.length - 1]];
			// includePoints.value = parsedPolyline[0].points
			// calculateParkingPoints()
			// console.log(includePoints.value)
			// const bounds = calculateBounds(parsedPolyline[0].points)
		} catch (error) {
			console.error('获取地图详情失败:', error)
			uni.showToast({
				title: '获取路线信息失败',
				icon: 'none'
			})
		}
	}
	// const optimizePoints = (points, maxPoints = 20) => {
	// 	if (points.length <= maxPoints) return points;

	// 	const step = Math.max(1, Math.floor(points.length / maxPoints));
	// 	const optimized = [];

	// 	// 确保包含起点和终点
	// 	optimized.push(points[0]);

	// 	// 采样中间点
	// 	for (let i = 1; i < points.length - 1; i += step) {
	// 		optimized.push(points[i]);
	// 	}

	// 	optimized.push(points[points.length - 1]);

	// 	return optimized;
	// }
	const calculateParkingPoints = () => {

		console.log('当前车速 speed:', speed.value);
		if (!speed) {
			console.log('车速为 0 或未获取到，无法计算停车点');
			return;
		}
		const points = toRaw(mapOptions.value.polyline[0].points);

		// const points = toRaw(point.value)
		console.log(points)
		const numPoints = points.length;
		const minContinuousDrivingTime = 4 * 60; // 4 小时
		const maxContinuousDrivingTime = 7 * 60; // 7 小时
		let currentDistance = 0;
		let nextStopDistance = Math.random() * (maxContinuousDrivingTime - minContinuousDrivingTime) +
			minContinuousDrivingTime * speed.value / 60;
		const parkingPoints = [];
		const parkingTimes = {};
		const setp = 200
		for (let i = 0; i < numPoints - 1; i++) {
			const p1 = points[i];
			const p2 = points[i + 1];
			const segmentDistance = calculateDistance(p1, p2) / 1000;
			currentDistance += segmentDistance;

			if (currentDistance >= nextStopDistance) {
				console.log('23')
				const ratio = (nextStopDistance - (currentDistance - segmentDistance)) / segmentDistance;
				const stopPoint = {
					longitude: p1.longitude + ratio * (p2.longitude - p1.longitude),
					latitude: p1.latitude + ratio * (p2.latitude - p1.latitude)
				};
				const parkingPointId = markers.value.length + parkingPoints.length;
				const parkingTime = Math.floor(Math.random() * (7 - 4 + 1) + 4); // 随机生成 4 - 7 小时的停车时间
				parkingPoints.push({
					id: generateUUID(),
					longitude: stopPoint.longitude,
					latitude: stopPoint.latitude,
					title: 'P',
					iconPath: aParking,
					width: 20,
					height: 20
				});
				parkingTimes[parkingPointId] = parkingTime;
				currentDistance = 0;
				nextStopDistance = Math.random() * (maxContinuousDrivingTime - minContinuousDrivingTime) +
					minContinuousDrivingTime * speed.value / 60;
			}
		}
		console.log('计算得到的停车点 parkingPoints:', parkingPoints);
		// parkingPoints
		console.log(markers)
		markers.value.length = 0
		markers.value.push(...startandend, ...parkingPoints)
		// this.setData({
		// 	markers: [...this.data.markers.slice(0, 5), ...parkingPoints],
		// 	parkingTimes
		// });
		console.log(markers)
	}

	const calculateDistance = (p1, p2) => {
		const R = 6371e3;
		const φ1 = p1.latitude * (Math.PI / 180);
		const φ2 = p2.latitude * (Math.PI / 180);
		const Δφ = (p2.latitude - p1.latitude) * (Math.PI / 180);
		const Δλ = (p2.longitude - p1.longitude) * (Math.PI / 180);

		const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
			Math.cos(φ1) * Math.cos(φ2) *
			Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return R * c;
	}

	// 计算包含所有点的边界
	const calculateBounds = (points) => {
		if (!points || points.length === 0) {
			return {
				west: 116.4074,
				east: 116.4074,
				north: 39.9042,
				south: 39.9042
			};
		}

		let west = points[0].longitude;
		let east = points[0].longitude;
		let north = points[0].latitude;
		let south = points[0].latitude;

		points.forEach(point => {
			west = Math.min(west, point.longitude);
			east = Math.max(east, point.longitude);
			north = Math.max(north, point.latitude);
			south = Math.min(south, point.latitude);
		});

		// 确保有最小跨度
		if (east - west < 0.01) {
			const centerLng = (west + east) / 2;
			west = centerLng - 0.05;
			east = centerLng + 0.05;
		}

		if (north - south < 0.01) {
			const centerLat = (north + south) / 2;
			south = centerLat - 0.05;
			north = centerLat + 0.05;
		}

		// 增加边距，使地图范围更大
		const marginLng = (east - west) * 0.5;
		const marginLat = (north - south) * 0.5;

		return {
			west: west - 2 * marginLng,
			east: east + 2 * marginLng,
			north: north + 2 * marginLat,
			south: south - 2 * marginLat
		};
	}

	// 切换输入区域显示
	const toggleInputSection = () => {
		isInputSectionVisible.value = !isInputSectionVisible.value
		toggleImage.value = isInputSectionVisible.value ? downImage : upImage
	}

	// 页面加载时获取参数
	onLoad((data) => {
		arrivalTime.value = data.arrivalTime || ''
		startCity.value = data.startCity || ''
		endCity.value = data.endCity || ''
		departureTime.value = data.departureTime || ''
		getDetail()
		// console.log('uuid', uuidv4())
		
	})
	

</script>

<style scoped>
	.map-container {
		position: relative;
		height: 100vh;
		width: 100%;
		position: relative;
		padding-bottom: env(safe-area-inset-bottom);
	}

	#myMap {
		width: 100%;
		height: calc(100% - env(safe-area-inset-bottom));
	}

	.top-info {

		background: #fff;
		/* box-shadow: 0 -4rpx 12rpx rgba(0,0,0,0.1); */
		z-index: 100;
		width: 100%;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
	}

	.input-section-arrow {
		position: absolute;
		bottom: env(safe-area-inset-bottom);
		left: 0;
		right: 0;
		/* height: 60rpx; */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 101;
		transition: all 0.3s ease;
		padding-bottom: 30rpx;
	}

	.ui-img {
		width: 80rpx !important;
		height: 80rpx !important;
	}

	/* 当info未展开时的样式 */
	.map-container:not([data-section-visible]) .input-section-arrow {
		background: #fff;
	}

	.time-range {
		width: 100%;
		font-size: 26rpx;
		margin: 0 0 20rpx 40rpx;
		display: block;
	}

	.place-container {
		margin-bottom: 20rpx;
		padding: 0 30rpx;
	}

	.place-item {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.place-icon {
		width: 30rpx;
		height: 30rpx;
		margin-right: 12rpx;
		flex-shrink: 0;
	}

	.place-ad-text {
		font-size: 32rpx;
		line-height: 1.4;
		max-width: 99%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.data-block {
		display: flex;
		justify-content: space-around;
		align-items: center;
		background: #a4e2ffc2;
		border-radius: 30rpx;
		padding: 5rpx 0;
		margin-bottom: 5rpx;
	}

	.data-column {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 120rpx;
	}

	.data-value {
		font-size: 40rpx;
		text-align: center;
		line-height: 50rpx;
		min-height: 50rpx;
	}

	.data-label {
		font-size: 22rpx;
		color: #666;
		text-align: center;
	}

	.time-input-container {
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 50rpx;
		margin-top: -6rpx
	}

	.time-input {
		width: 60rpx;
		height: 50rpx;
		font-size: 40rpx;
		border: 1rpx solid rgba(221, 221, 221, 0.3);
		border-radius: 8rpx;
		margin: 0 4rpx;
		text-align: center;
		line-height: 50rpx !important;
		box-sizing: border-box;
	}

	.data-block input:focus {
		border-color: rgba(0, 122, 255, 0.5);
	}

	/* 隐藏数字输入框箭头 */
	.data-block input::-webkit-outer-spin-button,
	.data-block input::-webkit-inner-spin-button {
		-webkit-appearance: none;
	}

	.data-block input[type="number"] {
		-moz-appearance: textfield;
	}
</style>