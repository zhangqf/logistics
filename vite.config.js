import {
	defineConfig
} from 'vite'
import {
	resolve
} from 'path'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
console.log('SCSS 配置已加载');
export default defineConfig({
	plugins: [
		uni(),
	],
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
			'pinia': 'pinia/dist/pinia.mjs',
			'@utils': resolve(__dirname, 'src/utils/')
		}
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler', // 或 "modern"
				additionalData: `@use "@/styles/_variables.scss" as *;`,

				// additionalData: '@use "@/styles/index.scss" as *;',
			},
		},
	},
	optimizeDeps: {
		include: ['pinia']
	},
	build: {
		sourcemap:'inline',
		minify: 'terser', // 确保使用 terser
		terserOptions: {
			compress: {
				drop_console: true, // 移除所有 console.*
				drop_debugger: true, // 移除 debugger
			}
		}
	}
})