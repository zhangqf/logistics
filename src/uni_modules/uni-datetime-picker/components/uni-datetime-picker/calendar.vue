<template>
	<view class="uni-calendar" @mouseleave="leaveCale">

		<view v-if="!insert && show" class="uni-calendar__mask" :class="{'uni-calendar--mask-show':aniMaskShow}"
			@click="maskClick"></view>

		<view v-if="insert || show" class="uni-calendar__content"
			:class="{'uni-calendar--fixed':!insert,'uni-calendar--ani-show':aniMaskShow, 'uni-calendar__content-mobile': aniMaskShow}">
			<view class="uni-calendar__header" :class="{'uni-calendar__header-mobile' :!insert}">

				<view class="uni-calendar__header-btn-box" @click.stop="changeMonth('pre')">
					<view class="uni-calendar__header-btn uni-calendar--left"></view>
				</view>

				<picker mode="date" :value="date" fields="month" @change="bindDateChange">
					<text
						class="uni-calendar__header-text">{{ (nowDate.year||'') + yearText + ( nowDate.month||'') + monthText}}</text>
				</picker>

				<view class="uni-calendar__header-btn-box" @click.stop="changeMonth('next')">
					<view class="uni-calendar__header-btn uni-calendar--right"></view>
				</view>

				<view v-if="!insert" class="dialog-close" @click="maskClick">
					<view class="dialog-close-plus" data-id="close"></view>
					<view class="dialog-close-plus dialog-close-rotate" data-id="close"></view>
				</view>
			</view>
			<view class="uni-calendar__box">

				<view v-if="showMonth" class="uni-calendar__box-bg">
					<text class="uni-calendar__box-bg-text">{{nowDate.month}}</text>
				</view>

				<view class="uni-calendar__weeks" style="padding-bottom: 7px;">
					<view class="uni-calendar__weeks-day">
						<text class="uni-calendar__weeks-day-text">{{SUNText}}</text>
					</view>
					<view class="uni-calendar__weeks-day">
						<text class="uni-calendar__weeks-day-text">{{MONText}}</text>
					</view>
					<view class="uni-calendar__weeks-day">
						<text class="uni-calendar__weeks-day-text">{{TUEText}}</text>
					</view>
					<view class="uni-calendar__weeks-day">
						<text class="uni-calendar__weeks-day-text">{{WEDText}}</text>
					</view>
					<view class="uni-calendar__weeks-day">
						<text class="uni-calendar__weeks-day-text">{{THUText}}</text>
					</view>
					<view class="uni-calendar__weeks-day">
						<text class="uni-calendar__weeks-day-text">{{FRIText}}</text>
					</view>
					<view class="uni-calendar__weeks-day">
						<text class="uni-calendar__weeks-day-text">{{SATText}}</text>
					</view>
				</view>

				<view class="uni-calendar__weeks" v-for="(item,weekIndex) in weeks" :key="weekIndex">
					<view class="uni-calendar__weeks-item" v-for="(weeks,weeksIndex) in item" :key="weeksIndex">
						<calendar-item class="uni-calendar-item--hook" :weeks="weeks" :calendar="calendar" :selected="selected"
							:checkHover="range" @change="choiceDate" @handleMouse="handleMouse">
						</calendar-item>
					</view>
				</view>
			</view>

			<view v-if="!insert && !range && hasTime" class="uni-date-changed uni-calendar--fixed-top"
				style="padding: 0 80px;">
				<view class="uni-date-changed--time-date">{{tempSingleDate ? tempSingleDate : selectDateText}}</view>
				<time-picker type="time" :start="timepickerStartTime" :end="timepickerEndTime" v-model="time"
					:disabled="!tempSingleDate" :border="false" :hide-second="hideSecond" class="time-picker-style">
				</time-picker>
			</view>

			<view v-if="!insert && range && hasTime" class="uni-date-changed uni-calendar--fixed-top">
				<view class="uni-date-changed--time-start">
					<view class="uni-date-changed--time-date">{{tempRange.before ? tempRange.before : startDateText}}
					</view>
					<time-picker type="time" :start="timepickerStartTime" v-model="timeRange.startTime" :border="false"
						:hide-second="hideSecond" :disabled="!tempRange.before" class="time-picker-style">
					</time-picker>
				</view>
				<view style="line-height: 50px;">
					<uni-icons type="arrowthinright" color="#999"></uni-icons>
				</view>
				<view class="uni-date-changed--time-end">
					<view class="uni-date-changed--time-date">{{tempRange.after ? tempRange.after : endDateText}}</view>
					<time-picker type="time" :end="timepickerEndTime" v-model="timeRange.endTime" :border="false"
						:hide-second="hideSecond" :disabled="!tempRange.after" class="time-picker-style">
					</time-picker>
				</view>
			</view>

			<view v-if="!insert" class="uni-date-changed uni-date-btn--ok">
				<view class="uni-datetime-picker--btn" @click="confirm">{{confirmText}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		Calendar,
		getDate,
		getTime
	} from './util.js';
	import calendarItem from './calendar-item.vue'
	import timePicker from './time-picker.vue'

	import {
		initVueI18n
	} from '@dcloudio/uni-i18n'
	import i18nMessages from './i18n/index.js'
	const {
		t
	} = initVueI18n(i18nMessages)

	/**
	 * Calendar 日历
	 * @description 日历组件可以查看日期，选择任意范围内的日期，打点操作。常用场景如：酒店日期预订、火车机票选择购买日期、上下班打卡等
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=56
	 * @property {String} date 自定义当前时间，默认为今天
	 * @property {String} startDate 日期选择范围-开始日期
	 * @property {String} endDate 日期选择范围-结束日期
	 * @property {Boolean} range 范围选择
	 * @property {Boolean} insert = [true|false] 插入模式,默认为false
	 * 	@value true 弹窗模式
	 * 	@value false 插入模式
	 * @property {Boolean} clearDate = [true|false] 弹窗模式是否清空上次选择内容
	 * @property {Array} selected 打点，期待格式[{date: '2019-06-27', info: '签到', data: { custom: '自定义信息', name: '自定义消息头',xxx:xxx... }}]
	 * @property {Boolean} showMonth 是否选择月份为背景
	 * @property {[String} defaultValue 选择器打开时默认显示的时间
	 * @event {Function} change 日期改变，`insert :ture` 时生效
	 * @event {Function} confirm 确认选择`insert :false` 时生效
	 * @event {Function} monthSwitch 切换月份时触发
	 * @example <uni-calendar :insert="true" :start-date="'2019-3-2'":end-date="'2019-5-20'"@change="change" />
	 */
	export default {
		components: {
			calendarItem,
			timePicker
		},

		options: {
			// #ifdef MP-TOUTIAO
			virtualHost: false,
			// #endif
			// #ifndef MP-TOUTIAO
			virtualHost: true
			// #endif
		},
		props: {
			date: {
				type: String,
				default: ''
			},
			defTime: {
				type: [String, Object],
				default: ''
			},
			selectableTimes: {
				type: [Object],
				default () {
					return {}
				}
			},
			selected: {
				type: Array,
				default () {
					return []
				}
			},
			startDate: {
				type: String,
				default: ''
			},
			endDate: {
				type: String,
				default: ''
			},
			startPlaceholder: {
				type: String,
				default: ''
			},
			endPlaceholder: {
				type: String,
				default: ''
			},
			range: {
				type: Boolean,
				default: false
			},
			hasTime: {
				type: Boolean,
				default: false
			},
			insert: {
				type: Boolean,
				default: true
			},
			showMonth: {
				type: Boolean,
				default: true
			},
			clearDate: {
				type: Boolean,
				default: true
			},
			checkHover: {
				type: Boolean,
				default: true
			},
			hideSecond: {
				type: [Boolean],
				default: false
			},
			pleStatus: {
				type: Object,
				default () {
					return {
						before: '',
						after: '',
						data: [],
						fulldate: ''
					}
				}
			},
			defaultValue: {
				type: [String, Object, Array],
				default: ''
			}
		},
		data() {
			return {
				show: false,
				weeks: [],
				calendar: {},
				nowDate: {},
				aniMaskShow: false,
				firstEnter: true,
				time: '',
				timeRange: {
					startTime: '',
					endTime: ''
				},
				tempSingleDate: '',
				tempRange: {
					before: '',
					after: ''
				}
			}
		},
		watch: {
			date: {
				immediate: true,
				handler(newVal) {
					if (!this.range) {
						this.tempSingleDate = newVal
						setTimeout(() => {
							this.init(newVal)
						}, 100)
					}
				}
			},
			defTime: {
				immediate: true,
				handler(newVal) {
					if (!this.range) {
						this.time = newVal
					} else {
						this.timeRange.startTime = newVal.start
						this.timeRange.endTime = newVal.end
					}
				}
			},
			startDate(val) {
				// 字节小程序 watch 早于 created
				if (!this.cale) {
					return
				}
				this.cale.setStartDate(val)
				this.cale.setDate(this.nowDate.fullDate)
				this.weeks = this.cale.weeks
			},
			endDate(val) {
				// 字节小程序 watch 早于 created
				if (!this.cale) {
					return
				}
				this.cale.setEndDate(val)
				this.cale.setDate(this.nowDate.fullDate)
				this.weeks = this.cale.weeks
			},
			selected(newVal) {
				// 字节小程序 watch 早于 created
				if (!this.cale) {
					return
				}
				this.cale.setSelectInfo(this.nowDate.fullDate, newVal)
				this.weeks = this.cale.weeks
			},
			pleStatus: {
				immediate: true,
				handler(newVal) {
					const {
						before,
						after,
						fulldate,
						which
					} = newVal
					this.tempRange.before = before
					this.tempRange.after = after
					setTimeout(() => {
						if (fulldate) {
							this.cale.setHoverMultiple(fulldate)
							if (before && after) {
								this.cale.lastHover = true
								if (this.rangeWithinMonth(after, before)) return
								this.setDate(before)
							} else {
								this.cale.setMultiple(fulldate)
								this.setDate(this.nowDate.fullDate)
								this.calendar.fullDate = ''
								this.cale.lastHover = false
							}
						} else {
							// 字节小程序 watch 早于 created
							if (!this.cale) {
								return
							}

							this.cale.setDefaultMultiple(before, after)
							if (which === 'left' && before) {
								this.setDate(before)
								this.weeks = this.cale.weeks
							} else if (after) {
								this.setDate(after)
								this.weeks = this.cale.weeks
							}
							this.cale.lastHover = true
						}
					}, 16)
				}
			}
		},
		computed: {
			timepickerStartTime() {
				const activeDate = this.range ? this.tempRange.before : this.calendar.fullDate
				return activeDate === this.startDate ? this.selectableTimes.start : ''
			},
			timepickerEndTime() {
				const activeDate = this.range ? this.tempRange.after : this.calendar.fullDate
				return activeDate === this.endDate ? this.selectableTimes.end : ''
			},
			/**
			 * for i18n
			 */
			selectDateText() {
				return t("uni-datetime-picker.selectDate")
			},
			startDateText() {
				return this.startPlaceholder || t("uni-datetime-picker.startDate")
			},
			endDateText() {
				return this.endPlaceholder || t("uni-datetime-picker.endDate")
			},
			okText() {
				return t("uni-datetime-picker.ok")
			},
			yearText() {
				return t("uni-datetime-picker.year")
			},
			monthText() {
				return t("uni-datetime-picker.month")
			},
			MONText() {
				return t("uni-calender.MON")
			},
			TUEText() {
				return t("uni-calender.TUE")
			},
			WEDText() {
				return t("uni-calender.WED")
			},
			THUText() {
				return t("uni-calender.THU")
			},
			FRIText() {
				return t("uni-calender.FRI")
			},
			SATText() {
				return t("uni-calender.SAT")
			},
			SUNText() {
				return t("uni-calender.SUN")
			},
			confirmText() {
				return t("uni-calender.confirm")
			},
		},
		created() {
			// 获取日历方法实例
			this.cale = new Calendar({
				selected: this.selected,
				startDate: this.startDate,
				endDate: this.endDate,
				range: this.range,
			})
			// 选中某一天
			this.init(this.date)
		},
		methods: {
			leaveCale() {
				this.firstEnter = true
			},
			handleMouse(weeks) {
				if (weeks.disable) return
				if (this.cale.lastHover) return
				let {
					before,
					after
				} = this.cale.multipleStatus
				if (!before) return
				this.calendar = weeks
				// 设置范围选
				this.cale.setHoverMultiple(this.calendar.fullDate)
				this.weeks = this.cale.weeks
				// hover时，进入一个日历，更新另一个
				if (this.firstEnter) {
					this.$emit('firstEnterCale', this.cale.multipleStatus)
					this.firstEnter = false
				}
			},
			rangeWithinMonth(A, B) {
				const [yearA, monthA] = A.split('-')
				const [yearB, monthB] = B.split('-')
				return yearA === yearB && monthA === monthB
			},
			// 蒙版点击事件
			maskClick() {
				this.close()
				this.$emit('maskClose')
			},

			clearCalender() {
				if (this.range) {
					this.timeRange.startTime = ''
					this.timeRange.endTime = ''
					this.tempRange.before = ''
					this.tempRange.after = ''
					this.cale.multipleStatus.before = ''
					this.cale.multipleStatus.after = ''
					this.cale.multipleStatus.data = []
					this.cale.lastHover = false
				} else {
					this.time = ''
					this.tempSingleDate = ''
				}
				this.calendar.fullDate = ''
				this.setDate(new Date())
			},

			bindDateChange(e) {
				const value = e.detail.value + '-1'
				this.setDate(value)
			},
			/**
			 * 初始化日期显示
			 * @param {Object} date
			 */
			init(date) {
				// 字节小程序 watch 早于 created
				if (!this.cale) {
					return
				}
				this.cale.setDate(date || new Date())
				this.weeks = this.cale.weeks
				this.nowDate = this.cale.getInfo(date)
				this.calendar = {
					...this.nowDate
				}
				if (!date) {
					// 优化date为空默认不选中今天
					this.calendar.fullDate = ''
					if (this.defaultValue && !this.range) {
						// 暂时只支持移动端非范围选择
						const defaultDate = new Date(this.defaultValue)
						const fullDate = getDate(defaultDate)
						const year = defaultDate.getFullYear()
						const month = defaultDate.getMonth() + 1
						const date = defaultDate.getDate()
						const day = defaultDate.getDay()
						this.calendar = {
								fullDate,
								year,
								month,
								date,
								day
							},
							this.tempSingleDate = fullDate
						this.time = getTime(defaultDate, this.hideSecond)
					}
				}
			},
			/**
			 * 打开日历弹窗
			 */
			open() {
				// 弹窗模式并且清理数据
				if (this.clearDate && !this.insert) {
					this.cale.cleanMultipleStatus()
					this.init(this.date)
				}
				this.show = true
				this.$nextTick(() => {
					setTimeout(() => {
						this.aniMaskShow = true
					}, 50)
				})
			},
			/**
			 * 关闭日历弹窗
			 */
			close() {
				this.aniMaskShow = false
				this.$nextTick(() => {
					setTimeout(() => {
						this.show = false
						this.$emit('close')
					}, 300)
				})
			},
			/**
			 * 确认按钮
			 */
			confirm() {
				this.setEmit('confirm')
				this.close()
			},
			/**
			 * 变化触发
			 */
			change(isSingleChange) {
				if (!this.insert && !isSingleChange) return
				this.setEmit('change')
			},
			/**
			 * 选择月份触发
			 */
			monthSwitch() {
				let {
					year,
					month
				} = this.nowDate
				this.$emit('monthSwitch', {
					year,
					month: Number(month)
				})
			},
			/**
			 * 派发事件
			 * @param {Object} name
			 */
			setEmit(name) {
				if (!this.range) {
					if (!this.calendar.fullDate) {
						this.calendar = this.cale.getInfo(new Date())
						this.tempSingleDate = this.calendar.fullDate
					}
					if (this.hasTime && !this.time) {
						this.time = getTime(new Date(), this.hideSecond)
					}
				}
				let {
					year,
					month,
					date,
					fullDate,
					extraInfo
				} = this.calendar
				this.$emit(name, {
					range: this.cale.multipleStatus,
					year,
					month,
					date,
					time: this.time,
					timeRange: this.timeRange,
					fulldate: fullDate,
					extraInfo: extraInfo || {}
				})
			},
			/**
			 * 选择天触发
			 * @param {Object} weeks
			 */
			choiceDate(weeks) {
				if (weeks.disable) return
				this.calendar = weeks
				this.calendar.userChecked = true
				// 设置多选
				this.cale.setMultiple(this.calendar.fullDate, true)
				this.weeks = this.cale.weeks
				this.tempSingleDate = this.calendar.fullDate
				const beforeDate = new Date(this.cale.multipleStatus.before).getTime()
				const afterDate = new Date(this.cale.multipleStatus.after).getTime()
				if (beforeDate > afterDate && afterDate) {
					this.tempRange.before = this.cale.multipleStatus.after
					this.tempRange.after = this.cale.multipleStatus.before
				} else {
					this.tempRange.before = this.cale.multipleStatus.before
					this.tempRange.after = this.cale.multipleStatus.after
				}
				this.change(true)
			},
			changeMonth(type) {
				let newDate
				if (type === 'pre') {
					newDate = this.cale.getPreMonthObj(this.nowDate.fullDate).fullDate
				} else if (type === 'next') {
					newDate = this.cale.getNextMonthObj(this.nowDate.fullDate).fullDate
				}

				this.setDate(newDate)
				this.monthSwitch()
			},
			/**
			 * 设置日期
			 * @param {Object} date
			 */
			setDate(date) {
				this.cale.setDate(date)
				this.weeks = this.cale.weeks
				this.nowDate = this.cale.getInfo(date)
			}
		}
	}
</script>

<style lang="scss">
	$uni-primary: #ebc40c !default;

	.uni-calendar {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.uni-calendar__mask {
		position: fixed;
		bottom: 0;
		top: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.4);
		transition-property: opacity;
		transition-duration: 0.3s;
		opacity: 0;
		/* #ifndef APP-NVUE */
		z-index: 99;
		/* #endif */
	}

	.uni-calendar--mask-show {
		opacity: 1
	}

	.uni-calendar--fixed {
		position: fixed;
		bottom: calc(var(--window-bottom));
		left: 0;
		right: 0;
		transition-property: transform;
		transition-duration: 0.3s;
		transform: translateY(460px);
		/* #ifndef APP-NVUE */
		z-index: 99;
		/* #endif */
	}

	.uni-calendar--ani-show {
		transform: translateY(0);
	}

	.uni-calendar__content {
		background-color: #fff;
	}

	.uni-calendar__content-mobile {
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.1);
	}

	.uni-calendar__header {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 50px;
	}

	.uni-calendar__header-mobile {
		padding: 10px;
		padding-bottom: 0;
	}

	.uni-calendar--fixed-top {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		border-top-color: rgba(0, 0, 0, 0.4);
		border-top-style: solid;
		border-top-width: 1px;
	}

	.uni-calendar--fixed-width {
		width: 50px;
	}

	.uni-calendar__backtoday {
		position: absolute;
		right: 0;
		top: 25rpx;
		padding: 0 5px;
		padding-left: 10px;
		height: 25px;
		line-height: 25px;
		font-size: 12px;
		border-top-left-radius: 25px;
		border-bottom-left-radius: 25px;
		color: #fff;
		background-color: #f1f1f1;
	}

	.uni-calendar__header-text {
		text-align: center;
		width: 100px;
		font-size: 15px;
		color: #666;
	}

	.uni-calendar__button-text {
		text-align: center;
		width: 100px;
		font-size: 14px;
		color: $uni-primary;
		/* #ifndef APP-NVUE */
		letter-spacing: 3px;
		/* #endif */
	}

	.uni-calendar__header-btn-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 50px;
		height: 50px;
	}

	.uni-calendar__header-btn {
		width: 9px;
		height: 9px;
		border-left-color: #808080;
		border-left-style: solid;
		border-left-width: 1px;
		border-top-color: #555555;
		border-top-style: solid;
		border-top-width: 1px;
	}

	.uni-calendar--left {
		transform: rotate(-45deg);
	}

	.uni-calendar--right {
		transform: rotate(135deg);
	}


	.uni-calendar__weeks {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-calendar__weeks-item {
		flex: 1;
	}

	.uni-calendar__weeks-day {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 40px;
		border-bottom-color: #F5F5F5;
		border-bottom-style: solid;
		border-bottom-width: 1px;
	}

	.uni-calendar__weeks-day-text {
		font-size: 12px;
		color: #B2B2B2;
	}

	.uni-calendar__box {
		position: relative;
		// padding: 0 10px;
		padding-bottom: 7px;
	}

	.uni-calendar__box-bg {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.uni-calendar__box-bg-text {
		font-size: 200px;
		font-weight: bold;
		color: #999;
		opacity: 0.1;
		text-align: center;
		/* #ifndef APP-NVUE */
		line-height: 1;
		/* #endif */
	}

	.uni-date-changed {
		padding: 0 10px;
		// line-height: 50px;
		text-align: center;
		color: #333;
		border-top-color: #DCDCDC;
		;
		border-top-style: solid;
		border-top-width: 1px;
		flex: 1;
	}

	.uni-date-btn--ok {
		padding: 20px 15px;
	}

	.uni-date-changed--time-start {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
	}

	.uni-date-changed--time-end {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
	}

	.uni-date-changed--time-date {
		color: #999;
		line-height: 50px;
		/* #ifdef MP-TOUTIAO */
		font-size: 16px;
		/* #endif */
		margin-right: 5px;
		// opacity: 0.6;
	}

	.time-picker-style {
		// width: 62px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center
	}

	.mr-10 {
		margin-right: 10px;
	}

	.dialog-close {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		padding: 0 25px;
		margin-top: 10px;
	}

	.dialog-close-plus {
		width: 16px;
		height: 2px;
		background-color: #737987;
		border-radius: 2px;
		transform: rotate(45deg);
	}

	.dialog-close-rotate {
		position: absolute;
		transform: rotate(-45deg);
	}

	.uni-datetime-picker--btn {
		border-radius: 100px;
		height: 40px;
		line-height: 40px;
		background-color: $uni-primary;
		color: #fff;
		font-size: 16px;
		letter-spacing: 2px;
	}

	/* #ifndef APP-NVUE */
	.uni-datetime-picker--btn:active {
		opacity: 0.7;
	}

	/* #endif */
</style>
