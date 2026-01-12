// 此vm参数为页面的实例，可以通过它引用vuex中的变量
import sha1 from 'sha1'
module.exports = (vm) => {
	// 初始化请求配置
	uni.$u.http.setConfig((config) => {
		/* config 为默认全局配置*/
		console.log(vm.$request_url);
		config.baseURL = vm.$request_url; /* 根域名 */
		console.log(config);
		return config
	})

	// 请求拦截
	uni.$u.http.interceptors.request.use((config) => { // 可使用async await 做异步操作
	    // 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
	    config.data = config.data || {}
		// 根据custom参数中配置的是否需要token，添加对应的请求头
		if(config?.custom?.auth) {
			// 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
			// config.header.token = vm.$store.state.userInfo.token
		}
		
		//###增加api鉴权参数
		let key = '6EB2756AbEa6ab79572FfaedD685b56C359011037E790EfE7F670D03E011E12C0C34';
		let timestamp = Math.round(new Date().getTime()/1000).toString();
		let nonce = 0;
		let signature_str = 'key='+key+'&nonce='+nonce+'&timestamp='+timestamp;
		config.params.signature = sha1(signature_str);
		config.params.timestamp = timestamp;
		config.params.nonce = nonce;
		
		//###增加默认header参数
		if(uni.getStorageSync('token') && uni.getStorageSync('user_id')){//令牌
			config.params.token = uni.getStorageSync('token');
			if(typeof config.params.user_id !="undefined"){}else{
				config.params.user_id = uni.getStorageSync('user_id');
			}
		}
		config.params.lang = uni.getStorageSync('lang');//语言标识
		
	    return config 
	}, config => { // 可使用async await 做异步操作
	    return Promise.reject(config)
	})

	// 响应拦截
	uni.$u.http.interceptors.response.use((response) => { /* 对响应成功做点什么 （statusCode === 200） 可使用async await 做异步操作*/
		const data = response.data
		// 自定义参数
		const custom = response.config?.custom
		if (data.ret !== 200) {
			if(data.ret == 402){
				uni.removeStorageSync('token');
				uni.removeStorageSync('user');
				uni.removeStorageSync('user_id');
				vm.$toast('Login failed, please login again');
				setTimeout(() => {
					uni.reLaunch({
						animationType:'slide-in-bottom',
						url:'/pages/my/login'
					})
				}, 500);
				return false;
			}else{
				return response;
			}
			// 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
			if (custom.toast !== false) {
				uni.$u.toast(data.msg)
			}
	
			// 如果需要catch返回，则进行reject
			if (custom?.catch) {
				return Promise.reject(data)
			} else {
				// 否则返回一个pending中的promise，请求不会进入catch中
				return new Promise(() => { })
			}
		} else {
			return response === undefined ? {} : response;
		}
	}, (response) => { 
		// 对响应错误做点什么 （statusCode !== 200）
		return Promise.reject(response)
	})
}
