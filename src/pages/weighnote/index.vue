<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'

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

// Ref for canvas dimensions
const canvasWidthPx = ref(0)
const canvasHeightPx = ref(0)

// Define the order of fields to draw in the table for canvas
const tableFields = [
	{ label: '进场时间', key: 'entry_time' },
	{ label: '出场时间', key: 'exit_time' },
	{ label: '货品名称', key: 'goods_name' },
	{ label: '称重单号', key: 'weigh_note_number' },
	{ label: '车牌号码', key: 'plate_number' },
	{ label: '司机姓名', key: 'driver_name' },
	{ label: '收货公司', key: 'receiver_company' },
	{ label: '承运公司', key: 'carrier_company' },
	{ label: '毛重', key: 'gross_weight' },
	{ label: '皮重', key: 'tare_weight' },
	{ label: '净重', key: 'net_weight' },
	{ label: '集装箱号', key: 'container_number' },
	{ label: '收货地址', key: 'receiver_address' },
];

// 新增：声明一个ref来存储组件实例的proxy
let instanceProxy = null;

const generateQRCode = () => {
	uni.showToast({
		title: '生成二维码功能待实现',
		icon: 'none'
	})
	// 实际项目中这里会调用生成二维码的API或库
	canDownload.value = true // 模拟生成二维码后可下载
}

const downloadImage = () => {
    // 使用存储的 instanceProxy
    if (!instanceProxy) {
        console.error("组件实例proxy未初始化，无法执行下载。");
        uni.showToast({
            title: '页面加载中，请稍后再试',
            icon: 'none'
        });
        return;
    }

	uni.showLoading({ title: '生成图片中...' });

    // 将 instanceProxy 传递给 uni.createCanvasContext
	const ctx = uni.createCanvasContext('weighnoteCanvas', instanceProxy);
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
		ctx.fillText(content, drawAreaX + labelWidth + toPx(15), yPos + cellHeight / 2 + toPx(10));
	};

	tableFields.forEach(field => {
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
        // 将 instanceProxy 传递给 uni.canvasToTempFilePath
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
		}, instanceProxy); // 传递 instanceProxy
	});
}

onMounted(() => {
    // 在 onMounted 中初始化 instanceProxy
    instanceProxy = getCurrentInstance().proxy;

    // 加载自定义字体
    uni.loadFontFace({
        family: 'UKIJNasqFont',
        source: 'url("https://your-domain.com/path/to/UKIJNsq.ttf")', // ***请务必将此处的URL替换为你的实际字体文件HTTPS地址***
        global: true, // 全局生效，字体文件会被缓存
        desc: {
            style: 'normal',
            weight: 'normal'
        },
        success(res) {
            console.log('UKIJNasq字体加载成功', res)
            // 字体加载成功后，可以保存字体加载状态到本地存储
            uni.setStorageSync('fontLoaded', true)
        },
        fail(res) {
            console.error('UKIJNasq字体加载失败', res)
            // 如果字体加载失败，可以尝试使用系统默认字体
            uni.setStorageSync('fontLoaded', false)
        }
    })
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
	font-family: 'UKIJNasqFont', sans-serif; // 应用到整个页面
}

.header-section {
	text-align: center;
	margin-bottom: 40rpx;

	.company-title,
	.document-title {
		font-size: 38rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.document-title {
		font-size: 32rpx;
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