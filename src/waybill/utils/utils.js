export const formatDate = (dateString) => {
	const date = new Date(dateString)
	console.log(date)
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
}

export const generateUUID = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		const r = Math.random() * 16 | 0;
		const v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(10);
	});
}

const getDuration = (start, end) => {

}

export const safeQueryString=(data)=> {
  return Object.keys(data)
    .filter(key => 
      data[key] !== undefined && 
      data[key] !== null && 
      data[key] !== ''
    )
    .map(key => 
      `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
    )
    .join('&');
}


export const statusMap = {
	created: '待分配',
	assigned: '待完善',
	auditing: '待审核',
	approved: '待生成磅单',
	poundageok: '待生成轨迹',
	completed: '已完成'
}

export const driverSearchMap = {
	driver_license_plate: '车牌号',
	region: '区域',
	driver_name: '司机姓名',
	phone: '手机号',
}