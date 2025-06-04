import {getDriverInfo} from '@/api/driver.js'
import {ref} from 'vue'
export function useDirvers(){
	
	const drivers = ref([]) 
	
	const getDriverList =async () => {
		try{
			uni.showLoading({
				title:'获取司机列表...'
			})
			const res = await getDriverInfo()
			drivers.value = res.data
		}catch(e){
			//TODO handle the exception
			uni.showToast({
				title: '获取司机列表失败',
				icon: 'none'
			})
		}finally {
			uni.hideLoading()
		}
	}
	
	return {
		getDriverList,
		drivers
	}
}