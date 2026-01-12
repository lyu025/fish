/**
 * Created by BRETVON on 2021/06/26.
 * main.js 文件中引入
 * import global from "@/common/global.js";
 * Vue.use(global);
 */

const loginPath = '/pages/my/login/login';

// 重写 toFixed 方法
// Number.prototype.toFixed = function(n) {
// 	n = n || 0; // 保留的小数位数
// 	if (n) {
// 		let num = `${this}`,
// 			sign = "";
// 		if (num.indexOf("-") > -1 || num.indexOf("+") > -1) {
// 			sign = num.substr(0, 1); // 符号
// 			num = num.substr(1, num.length - 1);
// 		}
// 		num = num * Math.pow(10, n) + "";
// 		// 判断小数点后面的数字是否大于等于5，是就进1
// 		const i = num.indexOf(".");
// 		if (i > -1) {
// 			if (num.substr(i + 1, 1) >= 5) {
// 				num = 1 + num * 1; // 转为数字运算，否则会进行字符串运算
// 			}
// 		}
// 		num = Math.floor(num);
// 		let result = sign + num / Math.pow(10, n);
// 		result += `${new Array(n + 1).join("0")}`; // 位数不够，0来凑
// 		let dot_index = result.indexOf(".");
// 		if (dot_index != -1) {
// 			var int_part = result.substr(0, dot_index);
// 			var dot_part = result.substr(dot_index + 1, n);
// 		} else {
// 			var int_part = `${this}`;
// 			var dot_part = result.substr(int_part.length, n);
// 		}
// 		return `${int_part}.${dot_part}`;
// 	} else {
// 		return Math.round(this)
// 	}
// }

/**
 * 打开外部网址
 * @param {String} url 
 */
function $openUrl(url) {
	//#ifdef APP-PLUS
	plus.runtime.openURL(url);
	//#endif
	//#ifdef H5
	window.location.href = url;
	//#endif
}

/**
 * 保留当前页面，跳转到应用内的某个页面
 * @param {String} path 
 * @param {Boolean} islogin 
 */
function $navigateTo(path, islogin) {
	console.log('$navigateTo', path);
	if (islogin) {
		if (uni.getStorageSync('token')) {
			uni.navigateTo({
				url: path
			})
		} else {
			uni.navigateTo({
				animationType:'slide-in-bottom',
				url: '/pages/my/login'
			})
		}
	} else {
		uni.navigateTo({
			url: path
		})
	}
}
/**
 * 关闭当前页面，跳转到应用内的某个页面
 * @param {String} path 
 * @param {Boolean} islogin 
 */
function $redirectTo(path, islogin) {
	console.log('$redirectTo', path);
	if (islogin) {
		if (uni.getStorageSync('token')) {
			uni.redirectTo({
				url: path
			})
		} else {
			uni.redirectTo({
				url: loginPath
			})
		}
	} else {
		uni.redirectTo({
			url: path
		})
	}
}
/**
 * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
 * @param {String} path 
 * @param {Boolean} islogin 
 */
function $switchTab(path, islogin) {
	console.log('$switchTab', path);
	if (islogin) {
		if (uni.getStorageSync('token')) {
			uni.switchTab({
				url: path
			})
		} else {
			uni.switchTab({
				url: loginPath
			})
		}
	} else {
		uni.switchTab({
			url: path
		})
	}
}
/**
 * 关闭所有页面，打开到应用内的某个页面
 * @param {String} path 
 * @param {Boolean} islogin 
 */
function $reLaunch(path, islogin) {
	console.log('$reLaunch', path);
	if (islogin) {
		if (uni.getStorageSync('token')) {
			uni.reLaunch({
				url: path
			})
		} else {
			uni.reLaunch({
				url: loginPath
			})
		}
	} else {
		uni.reLaunch({
			url: path
		})
	}
}
/**
 * 关闭当前页面，返回上一页面或多级页面
 * @param {Number} page 
 */
function $navigateBack(page = 1) {
	console.log('$navigateBack', page);
	uni.navigateBack({
		delta: page
	});
}
/**
 * 吐司函数
 * @param {String} text 
 */
function $toast(text) {
	//#ifdef APP-PLUS
	plus.nativeUI.toast(text);
	//#endif
	//#ifndef APP-PLUS
	uni.showToast({
		title: text,
		icon: 'none',
		duration: 3000,
		position: 'bottom'
	});
	//#endif
}
/**
 * 复制
 * @param {String} content 
 * @param {String} text 
 */
function $copy(content,text) {
	uni.hideToast();
	uni.hideLoading();
	//#ifdef H5
	function h5Copy(content) {
		let input = document.createElement("input")
		input.value = content
		input.readOnly = "readOnly"
		document.body.appendChild(input)
		input.select() // 选择对象
		input.setSelectionRange(0, content.length) //核心
		let result = document.execCommand("Copy") // 执行浏览器复制命令
		input.remove()
		return result
	}
	if (h5Copy(content) === true) {
		$toast(text || 'Success');
	}
	//#endif
	//#ifdef MP-WEIXIN || APP-PLUS
	uni.hideToast();
	uni.setClipboardData({
		data: content,
		success: () => {
			uni.hideToast();
			uni.hideLoading();
			$toast(text || 'Success');
			return false;
		}
	});
	//#endif
}
/**
 * 图片选择
 * @param {Object} params 
 */
function $chooseImage(params) {
	const count = params.count || 9;
	const sizeType = params.sizeType || ['original', 'compressed'];
	const sourceType = params.sourceType || ['album', 'camera '];
	return new Promise((resolve, reject) => {
		uni.chooseImage({
			count: count, // 默认9
			sizeType: sizeType, // 原图还是压缩图，默认二者都有
			sourceType: sourceType, // 从相册选择还是使用相机，默认二者都有
			success: (res) => resolve(res),
			fail: (err) => reject(err),
		});
	})
}
/**
 * 图片上传
 * 
 */
function $upload(url, params) {
	const count = params.count || 9;
	const sizeType = params.sizeType || ['original', 'compressed'];
	const sourceType = params.sourceType || ['album', 'camera '];
	return new Promise((resolve, reject) => {
		uni.chooseImage({
			count: count, // 默认9
			sizeType: sizeType, // 原图还是压缩图，默认二者都有
			sourceType: sourceType, // 从相册选择还是使用相机，默认二者都有
			success: (fileRes) => {
				uni.uploadFile({
					url: `${Vue.prototype.$request_url}${url}`,
					filePath: fileRes.tempFilePaths[0],
					name: 'file',
					success: res => {
						let result = JSON.parse(res.data);
						resolve(result)
					},
					fail: error => reject(error),
				});
			},
			fail: (err) => reject(err),
		});
	})
}
/**
 * 图片预览
 * @param {Array} urls 
 */
function $previewImage(urls) {
	uni.previewImage({
		urls: urls,
	});
}
/**
 * 拨打电话
 * @param {*} param 
 * @returns 
 */
function $makePhoneCall(phone) {
	uni.makePhoneCall({
		phoneNumber: phone
	});
}
/**
 * 判断第三方平台是否已安装
 * @param {String} platform 
 * @returns 
 */
function $isApplicationExist(platform) {
	//#ifdef APP-PLUS
	if (platform == 'wechat') return plus.runtime.isApplicationExist({
		pname: 'com.tencent.mm',
		action: 'weixin://'
	});
	if (platform == 'qq') return plus.runtime.isApplicationExist({
		pname: 'com.tencent.mobileqq',
		action: 'mqq://'
	});
	if (platform == 'sinaweibo') return plus.runtime.isApplicationExist({
		pname: 'com.sina.weibo',
		action: 'sinaweibo://'
	});
	if (platform == 'taobao') return plus.runtime.isApplicationExist({
		pname: 'com.taobao.taobao',
		action: 'taobao://'
	});
	if (platform == 'alipay') return plus.runtime.isApplicationExist({
		pname: 'com.eg.android.AlipayGphone',
		action: 'alipay://'
	})
	if (platform == 'jingdong') return plus.runtime.isApplicationExist({
		pname: 'com.jingdong.app.mall',
		action: 'openApp.jdMobile://'
	});
	if (platform == 'youku') return plus.runtime.isApplicationExist({
		pname: 'com.youku.phone',
		action: 'youku://'
	});
	if (platform == 'iosamap') return plus.runtime.isApplicationExist({
		pname: 'com.autonavi.minimap',
		action: 'iosamap://'
	});
	if (platform == 'baidumap') return plus.runtime.isApplicationExist({
		pname: 'com.baidu.BaiduMap',
		action: 'baidumap://'
	});
	if (platform == 'whatsapp') return plus.runtime.isApplicationExist({
		pname: 'com.whatsapp',
		action: 'whatsapp://'
	});
	//#endif
	// #ifndef APP-PLUS
	return false
	// #endif
}
/**
 * 判断访问终端
 * @returns 
 */
function $browser() {
	return {
		versions: (function() {
			let u = navigator.userAgent
			// let app = navigator.appVersion
			return {
				trident: u.indexOf('Trident') > -1, // IE内核
				presto: u.indexOf('Presto') > -1, // opera内核
				webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
				gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
				mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
				ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
				android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, // android终端
				iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
				iPad: u.indexOf('iPad') > -1, // 是否iPad
				webApp: u.indexOf('Safari') === -1, // 是否web应该程序，没有头部与底部
				weixin: u.indexOf('MicroMessenger') > -1, // 是否微信
				qq: u.match(/\sQQ/i) === 'qq' // 是否QQ
			}
		}()),
		language: (navigator.browserLanguage || navigator.language).toLowerCase()
	}
}
/**
 * JS精度加法函数
 * @param {Number} arg1 
 * @param {Number} arg2 
 * @returns 
 */
function $accAdd(arg1, arg2) {
	var r1, r2, m, c;
	try {
		// 获取参数1的小数长度，比如 12.12345，那么 r1 === 5
		r1 = arg1.toString().split(".")[1].length;
	} catch (e) {
		r1 = 0;
	}
	try {
		// 获取参数2的小数长度，比如 12.12345，那么 r2 === 5
		r2 = arg2.toString().split(".")[1].length;
	} catch (e) {
		r2 = 0;
	}
	c = Math.abs(r1 - r2); // 获取绝对值
	m = Math.pow(10, Math.max(r1, r2)); // 小数位数最多的，10的次幂
	if (c > 0) {
		// 确保小数转成整数的时候，一样大小，
		var cm = Math.pow(10, c);
		if (r1 > r2) {
			// 参数1的小数长度大于参数2，那么参数arg2去掉小数后，在乘上差的位数
			arg1 = Number(arg1.toString().replace(".", "")); // 小数变整数：12.123 => 12123
			arg2 = Number(arg2.toString().replace(".", "")) * cm;
		} else {
			arg1 = Number(arg1.toString().replace(".", "")) * cm;
			arg2 = Number(arg2.toString().replace(".", ""));
		}
	} else {
		// 小数位数一样，那么直接转成整数
		arg1 = Number(arg1.toString().replace(".", ""));
		arg2 = Number(arg2.toString().replace(".", ""));
	}
	// 或者不用上面的if else
	// 直接 return (arg1 * m  + arg2 * m) / m;
	// 整数相加后，变回小数
	return (arg1 + arg2) / m;
}
/**
 * JS精度减法函数
 * @param {Number} arg1 
 * @param {Number} arg2 
 * @returns 
 */
function $accSub(arg1, arg2) {
	var r1, r2, m, n;
	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch (e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch (e) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
	n = (r1 >= r2) ? r1 : r2;
	return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
/**
 * JS精度乘法函数
 * @param {Number} arg1 
 * @param {Number} arg2 
 * @returns 
 */
function $accMul(arg1, arg2) {
	var m = 0,
		s1 = arg1.toString(),
		s2 = arg2.toString();
	try {
		m += s1.split(".")[1].length;
	} catch (e) {}
	try {
		m += s2.split(".")[1].length;
	} catch (e) {}
	return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}
/**
 * JS精度除法函数
 * @param {Number} arg1 
 * @param {Number} arg2 
 * @returns 
 */
function $accDiv(arg1, arg2) {
	var t1 = 0,
		t2 = 0,
		r1, r2;
	try {
		t1 = arg1.toString().split(".")[1].length;
	} catch (e) {}
	try {
		t2 = arg2.toString().split(".")[1].length;
	} catch (e) {}

	r1 = Number(arg1.toString().replace(".", ""));
	r2 = Number(arg2.toString().replace(".", ""));
	return (r1 / r2) * Math.pow(10, t2 - t1);
}
/**
 * 剩余时间
 * @param {Object} _t
 * @returns 
 */
function $countdown(_t) {
	let len = typeof _t === 'number' ? JSON.stringify(_t).length : _t.length;
	let timestamp = len == '10' ? Number(_t) * 1000 : Number(_t); /* 时间戳为10位需*1000，时间戳为13位的话不需乘1000 */
	return Math.max(timestamp - Date.now(), 0); /* 取最大值，防止出现小于0的剩余时间值 */
}
/**
 * 小于10的数，前面补0
 * @param {String||Number} T 数
 * @returns {String}
 */
function $add0(T) {
    return T < 10 ? '0' + T : T
}
/**
 * 时间戳转日期
 * @param {Number || String} _t // 时间戳
 * @returns {String}
 */
function $timestampToDate(_t) {
    let _len = typeof _t === 'number' ? JSON.stringify(_t).length : _t.length;
    let date = _len == '10' ? new Date(Number(_t) * 1000) : new Date(Number(_t)); /* 时间戳为10位需*1000，时间戳为13位的话不需乘1000 */
    let Y = date.getFullYear(), // 获取完整的年份(4位)
        M = date.getMonth() + 1, // 获取当前月份(0-11,0代表1月,+1表示1-12)
        D = date.getDate(), // 获取当前日(1-31)
        h = date.getHours(), // 获取当前小时数(0-23)
        m = date.getMinutes(), // 获取当前分钟数(0-59)
        s = date.getSeconds(); // 获取当前秒数(0-59)
    return Y + '-' + $add0(M) + '-' + $add0(D) + ' ' + $add0(h) + ':' + $add0(m) + ':' + $add0(s);
}

/**
 * tabbar国际化
 * @returns 
 */
function $setTabBarI18n(Vue){
	const i18n = Vue.prototype._i18n
	const { tabBar } = i18n.messages[i18n.locale]
	const tabBarKeys = ['common.tabbar[0]','common.tabbar[1]','common.tabbar[2]','common.tabbar[3]','common.tabbar[4]'];
	tabBarKeys.forEach((name,index)=>{
		uni.setTabBarItem({
			index:index,
			text:i18n.t(name)
		})
	})
}

if(uni) {
	uni.$openUrl = (url) => $openUrl(url)
	uni.$navigateTo = (path, islogin) => $navigateTo(path, islogin)
	uni.$redirectTo = (path, islogin) => $redirectTo(path, islogin)
	uni.$switchTab = (path, islogin) => $switchTab(path, islogin)
	uni.$reLaunch = (path, islogin) => $reLaunch(path, islogin)
	uni.$navigateBack = (page) => $navigateBack(page)
	uni.$toast = (text) => $toast(text)
	uni.$copy = (content,text) => $copy(content,text)
	uni.$chooseImage = (params) => $chooseImage(params)
	uni.$upload = (url, params) => $upload(url, params)
	uni.$previewImage = (urls) => $previewImage(urls)
	uni.$makePhoneCall = (phone) => $makePhoneCall(phone)
	uni.$ocr = (param) => $ocr(param)
	uni.$adJump = (ad) => $adJump(ad)
	uni.$isApplicationExist = (platform) => $isApplicationExist(platform)
	uni.$browser = () => $browser()
	uni.$accAdd = (arg1, arg2) => $accAdd(arg1, arg2)
	uni.$accSub = (arg1, arg2) => $accSub(arg1, arg2)
	uni.$accMul = (arg1, arg2) => $accMul(arg1, arg2)
	uni.$accDiv = (arg1, arg2) => $accDiv(arg1, arg2)
	uni.$countdown = (_t) => $countdown(_t)
	uni.$timestampToDate = (_t) => $timestampToDate(_t)
	uni.$add0 = (T) => $add0(T)
	
}

export default {
	install: Vue => {
		Vue.prototype.$openUrl = (url) => $openUrl(url)
		Vue.prototype.$navigateTo = (path, islogin) => $navigateTo(path, islogin)
		Vue.prototype.$redirectTo = (path, islogin) => $redirectTo(path, islogin)
		Vue.prototype.$switchTab = (path, islogin) => $switchTab(path, islogin)
		Vue.prototype.$reLaunch = (path, islogin) => $reLaunch(path, islogin)
		Vue.prototype.$navigateBack = (page) => $navigateBack(page)
		Vue.prototype.$toast = (text) => $toast(text)
		Vue.prototype.$copy = (content,text) => $copy(content,text)
		Vue.prototype.$chooseImage = (params) => $chooseImage(params)
		Vue.prototype.$upload = (url, params) => $upload(url, params)
		Vue.prototype.$previewImage = (urls) => $previewImage(urls)
		Vue.prototype.$makePhoneCall = (phone) => $makePhoneCall(phone)
		Vue.prototype.$ocr = (param) => $ocr(param)
		Vue.prototype.$adJump = (ad) => $adJump(ad)
		Vue.prototype.$isApplicationExist = (platform) => $isApplicationExist(platform)
		Vue.prototype.$browser = () => $browser()
		Vue.prototype.$accAdd = (arg1, arg2) => $accAdd(arg1, arg2)
		Vue.prototype.$accSub = (arg1, arg2) => $accSub(arg1, arg2)
		Vue.prototype.$accMul = (arg1, arg2) => $accMul(arg1, arg2)
		Vue.prototype.$accDiv = (arg1, arg2) => $accDiv(arg1, arg2)
		Vue.prototype.$countdown = (_t) => $countdown(_t)
		Vue.prototype.$timestampToDate = (_t) => $timestampToDate(_t)
		Vue.prototype.$add0 = (T) => $add0(T)
		Vue.prototype.$setTabBarI18n = () => $setTabBarI18n(Vue)
	}
}
