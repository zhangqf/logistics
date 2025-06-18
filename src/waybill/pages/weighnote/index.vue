<template>
	<view class="weighnote-page" :style="backgroundImageStyle">
		<!-- 抬头 -->
		<view id="container" ref="container" class="container">
			<canvas v-if="canDownload" canvas-id="myQrcode"
				style="postion:absolut;top:0;left:40rpx;width:100px;height:100px;"></canvas>
			<view class="header-section">
				<view class="company-title">新疆哈密三塘湖能源开发建设有限责任公司</view>
				<view class="document-title">销售过磅单</view>
				<view class="unit">单位：吨</view>

			</view>
			<!-- 表格内容 -->
			<view class="table-container">
				<view class="table-row">
					<view class="table-cell label-cell">发货公司</view>
					<view class="table-cell content-cell"
						style="display: flex;flex-direction: column;align-items: flex-start; padding: 10rpx 0;">
						<text style="display: block;line-height: 30rpx;">
							新疆哈密三塘湖能源开发建设有限责任公司
						</text>
						<!-- <text style="display: block;line-height: 0;letter-spacing: 2rpx;">有限责任公司</text> -->
					</view>
				</view>
				<view class="table-row">
					<view class="table-cell label-cell">入厂时间</view>
					<uni-datetime-picker v-if="!canDownload" style="width: 100%; height: 70rpx;" type="datetime"
						return-type='date' v-model="weighNote.factory_entry_time" />
					<view v-else class="table-cell content-cell" style="letter-spacing: 2rpx;">
						{{ formatDate(weighNote.factory_entry_time) || '' }}
					</view>
					<!-- <input class="uni-input table-cell" placeholder="自动获得焦点" v-model='weighNote.factory_entry_time' /> -->
				</view>
				<view class="table-row">
					<view class="table-cell label-cell">出厂时间</view>
					<view v-if="!canDownload" class="table-cell content-cell" style="padding:0;height: 30px;">
						<uni-datetime-picker style="width: 100%; " type="datetime" return-type='date'
							v-model="weighNote.factory_exit_time" />
					</view>
					<view v-else class="table-cell content-cell" style="letter-spacing: 2rpx;">
						{{ formatDate(weighNote.factory_exit_time) || '' }}
					</view>
					<!-- <input class="uni-input table-cell" placeholder="自动获得焦点" v-model='weighNote.exit_time' /> -->
				</view>
				<view class="table-row">
					<view class="table-cell label-cell">货物名称</view>
					<view class="table-cell content-cell">{{ weighNote.material_info || '' }}</view>
					<!-- <input class="uni-input table-cell" placeholder="自动获得焦点" v-model='weighNote.material_info' /> -->
				</view>
				<view class="table-row">
					<view class="table-cell label-cell">磅单编号</view>
					<view v-if="isRead" class="table-cell content-cell" style="letter-spacing: 2rpx;">
						{{ weighNote.poundage_number || '' }}
					</view>
					<input v-else class="uni-input table-cell" placeholder="请输入磅单编号"
						v-model='weighNote.poundage_number' />
				</view>
				<view class="table-row">
					<view class="table-cell label-cell">车牌号码</view>
					<view class="table-cell content-cell" style="letter-spacing: 2rpx;">
						{{ weighNote.license_plate || '' }}
					</view>
					<!-- <input class="uni-input table-cell" placeholder="自动获得焦点" v-model='weighNote.assignee_info.driver_license_plate' /> -->
				</view>
				<view class="table-row">
					<view class="table-cell label-cell">司机姓名</view>
					<view class="table-cell content-cell">{{ weighNote.driver_name || '' }}</view>
					<!-- <input class="uni-input table-cell" placeholder="自动获得焦点" v-model='weighNote.assignee_info.driver_name' /> -->
				</view>
				<view class="table-row">
					<view class="table-cell label-cell">收货单位</view>
					<view class="table-cell content-cell" style="text-align: center;width: 100%;">
						{{ weighNote.receiver_company_name || weighNote.receiver_company ||'' }}
					</view>
					<!-- <input class="uni-input table-cell" placeholder="自动获得焦点" v-model='weighNote.receiver_company' /> -->
				</view>
				<view class="table-row">
					<view class="table-cell label-cell">承运单位</view>
					<view v-if="isRead" class="table-cell content-cell">
						{{ weighNote.carrier_company }}
					</view>
					<input v-else class="uni-input table-cell" placeholder="请输入承运单位"
						v-model='weighNote.carrier_company' />
				</view>
				<view class="table-row">
					<view class="table-cell label-cell">毛重</view>
					<view v-if="isRead" class="table-cell content-cell">{{ weighNote.gross_weight || '' }}</view>
					<input v-else class="uni-input table-cell" placeholder="请输入毛重" v-model='weighNote.gross_weight' />
				</view>
				<view class="table-row">
					<view class="table-cell label-cell">皮重</view>
					<view v-if="isRead" class="table-cell content-cell">{{ weighNote.tare_weight || '' }}</view>
					<input v-else class="uni-input table-cell" placeholder="请输入皮重" v-model='weighNote.tare_weight' />
				</view>
				<view class="table-row">
					<view class="table-cell label-cell">净重</view>
					<view v-if="isRead" class="table-cell content-cell">{{ weighNote.net_weight || '' }}</view>
					<input v-else class="uni-input table-cell" placeholder="请输入净重" v-model='weighNote.net_weight' />
				</view>
				<view class="table-row">
					<view class="table-cell label-cell">集装箱号</view>
					<view v-if="isRead" class="table-cell content-cell">{{ weighNote.container_number || '' }}</view>
					<input v-else class="uni-input table-cell" placeholder="请输入集装箱号"
						v-model='weighNote.container_number' />
				</view>
				<view class="table-row no-border-bottom">
					<view class="table-cell label-cell">收货地址</view>
					<view v-if="isRead" class="table-cell content-cell">{{ weighNote.receiver_address || '' }}</view>
					<input v-else class="uni-input table-cell" placeholder="请输入收货地址"
						v-model='weighNote.receiver_address' />
				</view>
			</view>
			<text class="page-number">1-1</text>
		</view>
		<view class="footer-button" v-if="canDownload">
			<view class="footer-button-item">
				下载电子磅单（限时免费）
			</view>
			<view class="footer-button-item">
				打印电子磅单（限时免费）
			</view>
		</view>
		<!-- 底部操作区 -->
		<view class="footer-actions">
			<view class="buttons">
				<button class="action-btn primary-btn" v-if="!canDownload" @tap="generateQRCode">生成二维码</button>
				<!-- <button class="action-btn secondary-btn" :disabled="!canDownload" @tap="downloadImage">下载为图片</button> -->
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onLoad
	} from '@dcloudio/uni-app';
	import {
		ref,
		toRaw,
		computed,
		getCurrentInstance
	} from 'vue'
	import {
		formatDate
	} from '@/waybill/utils/utils.js'
	import drawQrcode from 'weapp-qrcode'
	import html2canvas from 'html2canvas'
	import {
		postWeighnote,
		getWeighnote,
		getBgImage
	} from '@/waybill/api/weighnote.js'
	import config from '@/config/index.js'
	import {
		onMounted
	} from 'vue';
	import {
		onReady
	} from '@dcloudio/uni-app'


	const weighNote = ref({
		factory_entry_time: '',
		factory_exit_time: '',
		material_info: '',
		poundage_number: '',
		license_plate: '',
		driver_name: '',
		receiver_company: '',
		carrier_company: '',
		sender_company: '',
		gross_weight: '',
		tare_weight: '',
		net_weight: '',
		container_number: '',
		delivery_address: ''
	})
	const canvasWidthPx = ref(0)
	const canvasHeightPx = ref(0)
	const bgImageUrl = ref('')
	const container = ref(null)
	const isRead = ref(false)
	const backgroundImageStyle = computed(() => {
		return {
			backgroundImage: bgImageUrl.value ? `url(${bgImageUrl.value})` : 'none',
			// backgroundRepeat: 'no-repeat',
			backgroundSize: '100% auto',
			backgroundPosition: 'center'
		}
	})
	const canDownload = ref(false)
	const autogenerateQRCode = (data) => {
		console.log(data)
		let text = "weighingList,91650521MA78WLPB8T,0," + data + ",1,qy566"
		drawQrcode({
			canvasId: 'myQrcode',
			width: 100,
			height: 100,
			// typeNumber:1,
			text: text,
			// x:5,
			// y:5,
			// image: { imageResource: '/images/logo.png', dx: 70, dy: 70 } // 可选 Logo
		})
	}
	const generateQRCode = async () => {
		
		if (!weighNote.value.factory_entry_time) {
			uni.showToast({
				title: '入厂时间不能为空！',
				icon: 'none'
			})
			return false
		}
		if (!weighNote.value.factory_exit_time) {
			uni.showToast({
				title: '出厂时间不能为空！',
				icon: 'none'
			})
			return false
		}
		if (!weighNote.value.poundage_number) {
			uni.showToast({
				title: '磅单编号不能为空！',
				icon: 'none'
			})
			return false
		}
		
		
		
		if (weighNote.value.status === 'approved') {
			try{
				uni.showLoading({
					title:'生成中...'
				})
				const r = toRaw(weighNote.value)
				const res = await postWeighnote(r)
				console.log(res)
				canDownload.value = true
				uni.showToast({
					title: "磅单已生成",
				})
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					})
				}, 500)
			}catch(e){
				//TODO handle the exception
			}finally{
				uin.hideLoading()
			}
		}
		// uni.showToast({
		// 	title: '生成二维码功能待实现',
		// 	icon: 'none'
		// })
		// 实际项目中这里会调用生成二维码的API或库
		 // 模拟生成二维码后可下载
	}
	const tableFields = ref([{
			label: '进场时间',
			key: 'factory_entry_time'
		},
		{
			label: '出场时间',
			key: 'factory_exit_time'
		},
		{
			label: '货品名称',
			key: 'material_info'
		},
		{
			label: '称重单号',
			key: 'poundage_number'
		},
		{
			label: '车牌号码',
			key: 'license_plate'
		},
		{
			label: '司机姓名',
			key: 'driver_name'
		},
		{
			label: '收货公司',
			key: 'receiver_company'
		},
		{
			label: '承运公司',
			key: 'carrier_company'
		},
		{
			label: '毛重',
			key: 'gross_weight'
		},
		{
			label: '皮重',
			key: 'tare_weight'
		},
		{
			label: '净重',
			key: 'net_weight'
		},
		{
			label: '集装箱号',
			key: 'container_number'
		},
		{
			label: '收货地址',
			key: 'receiver_address'
		},
	]);
	let instanceProxy = null;
	const downloadImage = () => {
		// const canvas = wx.createCanvasContext('myCanvas');
		// const dpr = wx.getSystemInfoSync().pixelRatio;
		// canvas.scale(dpr, dpr);
		// 实际项目中这里会调用uni.canvasToTempFilePath将页面渲染为图片
		const { proxy } = getCurrentInstance();
		if (!instanceProxy) {
		        console.error("组件实例proxy未初始化，无法执行下载。");
		        uni.showToast({
		            title: '页面加载中，请稍后再试',
		            icon: 'none'
		        });
		        return;
		    }

		uni.showLoading({
			title: '生成图片中...'
		});

		const ctx = uni.createCanvasContext('weighnoteCanvas', proxy);
		const systemInfo = uni.getSystemInfoSync();
		const rpxToPx = systemInfo.windowWidth / 750;

		const toPx = (rpx) => rpx * rpxToPx;

		const drawAreaX = toPx(30); // Left padding of the page
		const drawAreaWidth = systemInfo.windowWidth - toPx(60); // Total width minus left/right padding

		let currentYDrawing = toPx(40); // Initial padding-top of the page

		// Set background color
		ctx.setFillStyle('#FFFFFF');
		ctx.fillRect(0, 0, canvasWidthPx.value, canvasHeightPx.value); // Use full canvas dimensions for fill

		// Header Section
		ctx.setFontSize(toPx(38));
		ctx.font = `${toPx(38)}px UKIJNasqFont`; // 应用自定义字体
		ctx.setTextAlign('center');
		ctx.setFillStyle('#333333');
		ctx.fillText('某某公司', systemInfo.windowWidth / 2, currentYDrawing + toPx(38)); // Company title
		currentYDrawing += toPx(38) + toPx(10);

		ctx.setFontSize(toPx(32));
		ctx.font = `${toPx(32)}px UKIJNasqFont`; // 应用自定义字体
		ctx.fillText('称重单', systemInfo.windowWidth / 2, currentYDrawing + toPx(32)); // Document title
		currentYDrawing += toPx(32) + toPx(20);

		ctx.setFontSize(toPx(26));
		ctx.font = `${toPx(26)}px UKIJNasqFont`; // 应用自定义字体
		ctx.setTextAlign('right');
		ctx.setFillStyle('#666666');
		ctx.fillText('单位：吨', systemInfo.windowWidth - toPx(30) - toPx(10), currentYDrawing + toPx(26)); // Unit
		currentYDrawing += toPx(26) + toPx(40);

		// Table Section
		ctx.setTextAlign('left');
		ctx.setFillStyle('#333333');
		ctx.setStrokeStyle('#000000');
		ctx.setLineWidth(toPx(2));

		const cellHeight = toPx(60);
		const labelWidth = toPx(200);

		const drawRow = (label, content, yPos) => {
			console.log(label)
			console.log(content)
			console.log(yPos)
			// Draw label cell
			ctx.setFillStyle('#F8F8F8');
			ctx.fillRect(drawAreaX, yPos, labelWidth, cellHeight);
			ctx.strokeRect(drawAreaX, yPos, labelWidth, cellHeight);
			ctx.setFillStyle('#333333');
			ctx.setFontSize(toPx(28));
			ctx.font = `${toPx(28)}px UKIJNasqFont`; // 应用自定义字体
			ctx.fillText(label, drawAreaX + toPx(15), yPos + cellHeight / 2 + toPx(10));

			// Draw content cell
			ctx.setFillStyle('#FFFFFF');
			ctx.fillRect(drawAreaX + labelWidth, yPos, drawAreaWidth - labelWidth, cellHeight);
			ctx.strokeRect(drawAreaX + labelWidth, yPos, drawAreaWidth - labelWidth, cellHeight);
			ctx.setFillStyle('#333333');
			ctx.setFontSize(toPx(28));
			ctx.font = `${toPx(28)}px UKIJNasqFont`; // 应用自定义字体
			if(content) {
				ctx.fillText(content, drawAreaX + labelWidth + toPx(15), yPos + cellHeight / 2 + toPx(10));
			} else {
				ctx.fillText('', drawAreaX + labelWidth + toPx(15), yPos + cellHeight / 2 + toPx(10));
			}
			
		};
		const tableField = toRaw(tableFields.value)
		tableField.forEach(field => {
			console.log(field)
			console.log(field.key)
			drawRow(field.label, weighNote.value[field.key], currentYDrawing);
			currentYDrawing += cellHeight;
		});

		currentYDrawing += toPx(40); // Margin after table

		// Placeholder for QR Code
		if (canDownload.value) {
			const qrSize = toPx(150);
			const qrX = drawAreaX + drawAreaWidth - qrSize; // Align to right of drawing area
			const qrY = currentYDrawing;
			ctx.strokeRect(qrX, qrY, qrSize, qrSize);
			ctx.setTextAlign('center');
			ctx.setFontSize(toPx(20));
			ctx.font = `${toPx(20)}px UKIJNasqFont`; // 应用自定义字体
			ctx.setFillStyle('#999999');
			ctx.fillText('二维码占位', qrX + qrSize / 2, qrY + qrSize / 2);
			currentYDrawing += qrSize + toPx(20);
		}

		// Page number
		ctx.setTextAlign('left');
		ctx.setFontSize(toPx(26));
		ctx.font = `${toPx(26)}px UKIJNasqFont`; // 应用自定义字体
		ctx.setFillStyle('#666666');
		ctx.fillText('第1页', drawAreaX, currentYDrawing + toPx(26));
		currentYDrawing += toPx(26);

		// Final calculated export height (add bottom padding)
		const exportHeight = currentYDrawing + toPx(40);

		ctx.draw(false, () => {
			uni.canvasToTempFilePath({
				canvasId: 'weighnoteCanvas',
				x: 0,
				y: 0,
				width: canvasWidthPx.value,
				height: exportHeight,
				destWidth: canvasWidthPx.value * 2, // Double resolution for clearer image
				destHeight: exportHeight * 2,
				quality: 1,
				success: (res) => {
					uni.hideLoading();
					uni.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success: () => {
							uni.showToast({
								title: '图片已保存到相册',
								icon: 'success'
							});
						},
						fail: (err) => {
							uni.showToast({
								title: '保存失败: ' + (err.errMsg || '未知错误'),
								icon: 'none'
							});
							console.error('保存图片失败', err);
						}
					});
				},
				fail: (err) => {
					uni.hideLoading();
					uni.showToast({
						title: '生成图片失败: ' + (err.errMsg || '未知错误'),
						icon: 'none'
					});
					console.error('canvasToTempFilePath 失败', err);
				}
			}, proxy);
		});
	}

	onReady(async () => {
		// loadFont()
		instanceProxy = getCurrentInstance().proxy
		uni.loadFontFace({
			family: 'EnglishFont',
			source: 'url("https://www.leyoung.xyz/fonts/EnglishFont.ttf")', // ***请务必将此处的URL替换为你的实际字体文件HTTPS地址***
			global: true,
			success(res) {
				console.log('EnglishFont字体加载成功', res)
			},
			fail(res) {
				console.error('EnglishFont字体加载失败', res)
			}
		})
		uni.loadFontFace({
			family: 'ChineseFont',
			source: 'url("https://www.leyoung.xyz/fonts/ChineseFont.ttf")', // ***请务必将此处的URL替换为你的实际字体文件HTTPS地址***
			global: true,
			success(res) {
				console.log('ChineseFont字体加载成功', res)
			},
			fail(res) {
				console.error('ChineseFont字体加载失败', res)
			}
		})
		const pages = getCurrentPages()
		const currentPage = pages[pages.length - 1]
		const {
			assignee_info,
			...rest
		} = JSON.parse(currentPage.options.data)
		console.log(currentPage.options.data)
		if (rest.poundage_id) {
			isRead.value = true
			const res = await getBgImage(currentPage.options.bgid)
			bgImageUrl.value = config.apiBaseUrl + res.data.bg_image_url
		}

		if (rest.status !== 'approved') {
			const res = await getWeighnote(rest.poundage_id)
			console.log(res)

			weighNote.value = res.data
			autogenerateQRCode(res.data.poundage_number)
			canDownload.value = true
		} else {
			rest.waybill_id = rest.waybill
			delete rest.waybill
			console.log(rest)
			console.log(1221)
			weighNote.value = Object.assign(rest, {
				driver_name: assignee_info.driver_name,
				license_plate: assignee_info.driver_license_plate,
				factory_entry_time: null,
				factory_exit_time: null,
				receiver_address:''
			})
		}
		console.log(weighNote.value)
	})
</script>
<style lang="scss">
	.weighnote-page {
		font-family: 'EnglishFont', 'ChineseFont', sans-serif !important;
		background-color: #F1f1f1;

		min-height: 100vh;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-bottom: calc(80rpx + env(safe-area-inset-bottom));
	}

	#container {
		position: relative;
		padding: 10rpx 4rpx;
		margin-top: 10rpx;
	}

	.header-section {
		text-align: center;
		margin-bottom: 4rpx;

		.company-title {
			font-size: 34rpx;
			// font-weight: bold;
			margin-top: 10rpx;
			// font-family: 'EnglishFont', 'ChineseFont', sans-serif;
		}

		.document-title {
			font-size: 34rpx;
			// font-weight: bold;
			// margin-bottom: 8rpx;
			// font-family: 'EnglishFont', 'ChineseFont', sans-serif;
		}

		.unit {
			text-align: center;
			font-size: 26rpx;
			color: #000;
			padding-left: 10rpx;
			margin-left: 300rpx;
		}
	}

	.table-container {
		border: 2rpx solid #000;
		margin-bottom: 40rpx;

		.table-row {
			display: flex;
			border-bottom: 2rpx solid #000;
			height: 70rpx;
			align-items: center;
			&:last-child,
			&.no-border-bottom {
				border-bottom: none;
			}
			
			.uni-date-x {
				background-color: #F1f1f1;
				height: 60rpx;
				.uni-date-editor--x {
					border:none !important;
				}
				
				.icon-calendar {
					display: none;
				}

				.uni-date__x-input {
					font-size: 38rpx;
					height: 60rpx;
					padding-left: 10rpx;
				}

			}



			.input {
				height: 100%;
				line-height: 29rpx;

			}

			.table-cell {
				padding: 20rpx 15rpx;
				color: #333;
				border-right: 2rpx solid #000;
				display: flex;
				align-items: center;
				font-family: 'EnglishFont', 'ChineseFont', sans-serif;
				font-size: 38rpx;

				&:last-child {
					border-right: none;
				}
			}

			.label-cell {
				flex: 0 0 200rpx; // 固定左侧label宽度
				// background-color: #F8F8F8;
				// font-weight: bold;
				text-align: center;
				display: inline-block;
				font-size: 38rpx;
				line-height: 36rpx;
				font-family: 'EnglishFont', 'ChineseFont', sans-serif;
			}

			.content-cell {
				flex: 1;
				font-size: 38rpx;
				line-height: 26rpx;
				font-family: 'EnglishFont', 'ChineseFont', sans-serif;

			}
		}
	}

	.page-number {
		font-size: 26rpx;
		color: #666;
		text-align: right;
		margin-right: 10rpx;
		float: right;
	}
.footer-button{
	z-index: 10;
	display: flex;
	height: 80rpx;
	background: #F7DB1C;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	line-height: 80rpx;
	justify-content: space-around;
	font-family: 'EnglishFont', 'ChineseFont', sans-serif;
	font-size: 32rpx;
	// padding-bottom: calc(env(safe-area-inset-bottom));
	.footer-button-item{
		text-align: center;
	}
}	
	.footer-actions {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-end;
		margin-top: auto; // 将底部推到最下方



		.buttons {
			width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: space-between;

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