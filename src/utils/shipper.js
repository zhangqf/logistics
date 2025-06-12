import {
	getShipper
} from '@/api/user.js'
import {
	ref
} from 'vue'
export function useShippers() {

	const shipperList = ref([])
	const selectList = ref([])

	const getShippers = async () => {
		try {
			uni.showLoading({
				title: '加载中...'
			})
			const res = await getShipper()
			shipperList.value = res.data
			selectList.value = res.data.map(v => {
				return {
					value: v.id,
					text: v.company_name
				}
			})
			console.log(selectList)
		} catch (e) {
			//TODO handle the exception
			uni.showToast({
				title: '加载失败',
				icon: 'none'
			})
		} finally {
			uni.hideLoading()
		}
	}

	return {
		getShippers,
		shipperList,
		selectList
	}
}