import request from '@/utils/request'
import config from '@/config'
// 添加货主
export function addShipper(data) {
	return request({
		url: '/api/cargo-owner-info/',
		method: 'POST',
		data
	})
}

export function putShipper(id,data) {
	return request({
		url: `/api/cargo-owner-info/${id}/`,
		method: 'put',
		data
	})
}



// 获取货主列表
export function getShipper() {
	return request({
		url: '/api/cargo-owner-info/',
		method: 'get',
	})
}

// 获取货主信息
export function getShipperById(id) {
	return request({
		url: '/api/cargo-owner-info/' + id + '/',
		method: 'get',
	})
}

// 获取图片


// 上传图片
export function updateBgImage(id, data) {
	return new Promise((resolve,reject) => {
		const token = uni.getStorageSync('token')
		uni.uploadFile({
			url: `${config.apiBaseUrl}/api/cargo-owner-info/${id}/update-bg-image/`, //仅为示例，非真实的接口地址
			filePath: data.path,
			name:'bg_image',
			formData: {
				'file': data
			},
			header: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'multipart/form-data'
			},
			success: (uploadFileRes) => {
				console.log(uploadFileRes.data);
				resolve(JSON.parse(uploadFileRes.data))
			},
			fail: (error) => {
				console.log(error)
				reject(error)
			}
		});
	})

}