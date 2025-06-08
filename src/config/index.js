// 环境配置
const ENV = {
    development: {
        // apiBaseUrl: 'http://192.168.12.7:7000', // 开发环境API地址
		apiBaseUrl: 'https://bm705jd40744.vicp.fun',
		mapBaseUrl: 'https://www.zhongyudz.cn',
        websocketUrl: 'ws://dev-api.example.com', // 开发环境WebSocket地址
		apiKey:'I6BBZ-7MAOQ-PDW5J-4FWJ2-QNCS6-LLBYU',
    },
    production: {
        apiBaseUrl: 'http://api.example.com', // 生产环境API地址
        websocketUrl: 'wss://api.example.com', // 生产环境WebSocket地址
		apiKey:'I6BBZ-7MAOQ-PDW5J-4FWJ2-QNCS6-LLBYU',
		mapBaseUrl: 'https://www.zhongyudz.cn',
    }
}

// 获取当前环境
const getEnv = () => {
    // #ifdef H5
    console.log('H5环境')
    return process.env.NODE_ENV
    // #endif

    // #ifdef MP-WEIXIN
    if (process.env.NODE_ENV === 'development') {
        console.log('微信小程序开发环境')
        return 'development'
    }
    console.log('微信小程序生产环境')
    return 'production'
    // #endif

    // 默认返回开发环境
    console.log('默认开发环境')
    return 'development'
}

// 当前环境配置
const currentEnv = getEnv()
console.log('当前环境：', currentEnv)
const config = ENV[currentEnv]

export default {
    ...config,
    env: currentEnv,
    // 版本号
    version: '1.0.0',
    // 请求超时时间
    timeout: 60000,
    // 最大重试次数
    maxRetry: 3,
    // 重试延迟时间（毫秒）
    retryDelay: 1000,
} 