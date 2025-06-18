import { createSSRApp } from "vue"
import App from "./App.vue"
import pinia from './stores'

export function createApp() {
	const app = createSSRApp(App)
	app.use(pinia)
	
	// 添加全局错误处理
	app.config.errorHandler = (err, vm, info) => {
		console.error('全局错误:', err)
		console.error('错误信息:', info)
	}

	// 添加全局未捕获Promise错误处理
	if (typeof window !== 'undefined') {
		window.addEventListener('unhandledrejection', event => {
			console.error('未捕获的Promise错误:', event.reason)
		})
	}

	return {
		app
	}
}
