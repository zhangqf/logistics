import {getRegions} from '@/waybill/api/regions.js'
import {ref} from 'vue'


export function useRegions(){
	
	const regions = ref([]) 
	const selectRegionsList = ref([])
	
	const getRegionsList =async () => {
		try{
			uni.showLoading({
				title:'获取数据...'
			})
			const res = await getRegions()
			regions.value = res.data
			selectRegionsList.value = res.data.map(v => {
				return {
					value: v.id,
					text: v.name
				}
			})
		}catch(e){
			//TODO handle the exception
			uni.showToast({
				title: '获取数据失败',
				icon: 'none'
			})
		}finally {
			uni.hideLoading()
		}
	}
	
	return {
		getRegionsList,
		selectRegionsList,
		regions
	}
}