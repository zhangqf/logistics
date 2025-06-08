import request from "@/utils/request.js"
import config from "../config"

console.log(config)

export function getMapDetial(startCity, endCity) {
	const url = `${config.mapBaseUrl}`
	console.log('map')
	console.log(url)
	// return request({
	// 	url: `${config.mapBaseUrl}/get_route_info`,
	// 	method: 'post',
	// 	data:{
	// 		apiKey:config.apiKey,
	// 		startCity,
	// 		endCity
	// 	}
	// })
	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: '加载中...'
		})
		uni.request({
			url: `${config.mapBaseUrl}/get_route_info`,
			method: 'post',
			data: {
				apiKey: config.apiKey,
				startCity,
				endCity
			},
			success: (res) => {
				resolve(res.data)
			},
			fail: (error) => {
				reject(error)
			},
			complete: () => {
				uni.hideLoading()
			}
		})
	})

}