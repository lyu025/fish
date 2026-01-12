/**
 * JavaScript 正则校验
 * Created by FengJianBo on 2020/08/09.
 */

/**
 * 邮箱
 * @param {String} _s 
 * @returns {Boolean}
 */
function $isEmail(_s) {
	const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
	return reg.test(_s);
};
/**
 * 手机号
 * @param {String} _s 
 * @returns {Boolean}
 */
function $isMobile(_s) {
	const reg = /^1[3456789]\d{9}$/;
	return reg.test(_s);
};
/**
 * 座机号
 * @param {String} _s 
 * @returns {Boolean}
 */
function $isPhone(_s) {
	const reg = /^(0|86|17951)?([0-9]{3,4})?[0-9]{7,8}$/;
	return reg.test(_s);
};
/**
 * URL地址
 * @param {String} _s 
 * @returns {Boolean}
 */
function $isUrl(_s) {
	const reg = /^http[s]?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;
	return reg.test(_s);
};
/**
 * 身份证
 * @param {String} _s 
 * @returns {Boolean}
 */
function $isIDCard(_s) {
	const reg =
		/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
	return reg.test(_s);
};
/**
 * 邮编
 * @param {String} _s 
 * @returns {Boolean}
 */
function $isPostCode(_s) {
	const reg = /^[1-9]\d{5}(?!\d)$/;
	return reg.test(_s);
};
/**
 * 数字和英文
 * @param {String} _s 
 * @returns {Boolean}
 */
function $isNumOrEn(_s) {
	const reg = /^[0-9a-zA-Z]*$/g;
	return reg.test(_s);
};
/**
 * 数字
 * @param {String} _s 
 * @returns {Boolean}
 */
function $isNum(_s) {
	const reg = /^\d+$/;
	return reg.test(_s);
};
/**
 * 只能输入n个数字
 * @param {String} _s 
 * @param {Number} _n 
 * @returns {Boolean}
 */
function $isNNum(_s, _n) {
	const reg = new RegExp('^\\d{' + _n + '}$');
	return reg.test(_s);
};
/**
 * 只能输入n个数字以上正则
 * @param {String} _s 
 * @param {Number} _n 
 * @returns {Boolean}
 */
function $isNNumUp(_s, _n) {
	const reg = new RegExp('^\\d{' + _n + ',}$');
	return reg.test(_s);
};
/**
 * 只能输入n到m个数字
 * @param {String} _s 
 * @param {Number} _n 
 * @param {Number} _m 
 * @returns {Boolean}
 */
function $isMToNNum(_s, _n, _m) {
	const reg = new RegExp('^\\d{' + n + ',' + m + '}$');
	return reg.test(_s);
};
/**
 * 英文数字下划线
 * @param {String} _s 
 * @returns {Boolean}
 */
function $isEnNumDownLine(_s) {
	const reg = /^\w+$/;
	return reg.test(_s);
};
/**
 * 特殊字符
 * @param {String} _s 
 * @returns {Boolean}
 */
function $isSpecial(_s) {
	const reg = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
	return reg.test(_s);
};
/**
 * 中文
 * @param {String} _s 
 * @returns {Boolean}
 */
function $isChinese(_s) {
	const reg = /^[\u4e00-\u9fa5]+$/;
	return reg.test(_s);
};
/**
 * 浮点数
 * @param {String} _s 
 * @returns {Boolean}
 */
function $isFloatPoint(_s) {
	const reg = /^([1-9]\d*|0)(\.\d{1,2})?$/;
	return reg.test(_s);
};
/**
 * 英文大小写
 * @param {String} _s 
 * @returns {Boolean}
 */
function $isEnSize(_s) {
	const reg = /^[A-Za-z]+$/;
	return reg.test(_s);
};
/**
 * 英文大写
 * @param {String} _s 
 * @returns {Boolean}
 */
function $isEnBig(_s) {
	const reg = /^[A-Z]+$/;
	return reg.test(_s);
};
/**
 * 英文小写
 * @param {String} _s 
 * @returns {Boolean}
 */
function $isEnSmall(_s) {
	const reg = /^[a-z]+$/;
	return reg.test(_s);
};
/**
 * 双字节字符
 * @param {String} _s 
 * @returns {Boolean}
 */
function $isDoubleByte(_s) {
	const reg = /[^\x00-\xff]/igm;
	return reg.test(_s);
};
/**
 * 行首行尾空白
 * @param {String} _s 
 * @returns {Boolean}
 */
function $startEndBlank(_s) {
	const reg = /(^\s*)|(\s*$)/;
	return reg.test(_s);
};
/**
 * 正整数
 * @param {String} _s 
 * @returns {Boolean}
 */
function $isPosInt(_s) {
	const reg = /^([1-9]\d*|[0]{1,1})$/;
	return reg.test(_s);
};
/**
 * 去除html标签
 * @param {String} _s 
 * @returns {Boolean}
 */
function $removeHtmltags(_s) {
	const reg = /<[^>]+>/g;
	return _s.replace(reg, '');
};
/**
 * 车牌号（含新能源车牌）
 * @param {String} _s 
 * @returns {Boolean}
 */
function $isCarNum(_s) {
	const reg =
		/^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
	return reg.test(_s);
};
/**
 * URL 前缀拼接
 * @param {String} url 
 * @returns {String}
 */
function $addUrlPrefix(url) {
	let pic_url = uni.getStorageSync('config').pic_url || '';
	if (url) {
		if (url.substr(0, 2) != '//') {
			if (url.substr(0, 4) != 'http' && url.substr(0, 5) != 'https' && !$isUrl(url)) return pic_url + url;
			else return url;
		} else return url;
	} else return '';
}

if(uni) {
	uni.$isEmail = (str) => $isEmail(str)
	uni.$isMobile = (str) => $isMobile(str)
	uni.$isPhone = (str) => $isPhone(str)
	uni.$isUrl = (str) => $isUrl(str)
	uni.$isIDCard = (str) => $isIDCard(str)
	uni.$isPostCode = (str) => $isPostCode(str)
	uni.$isNumOrEn = (str) => $isNumOrEn(str)
	uni.$isNum = (str) => $isNum(str)
	uni.$isNNum = (str) => $isNNum(str)
	uni.$isNNumUp = (str) => $isNNumUp(str)
	uni.$isMToNNum = (str) => $isMToNNum(str)
	uni.$isEnNumDownLine = (str) => $isEnNumDownLine(str)
	uni.$isSpecial = (str) => $isSpecial(str)
	uni.$isChinese = (str) => $isChinese(str)
	uni.$isFloatPoint = (str) => $isFloatPoint(str)
	uni.$isEnSize = (str) => $isEnSize(str)
	uni.$isEnBig = (str) => $isEnBig(str)
	uni.$isEnSmall = (str) => $isEnSmall(str)
	uni.$isDoubleByte = (str) => $isDoubleByte(str)
	uni.$startEndBlank = (str) => $startEndBlank(str)
	uni.$isPosInt = (str) => $isPosInt(str)
	uni.$removeHtmltags = (str) => $removeHtmltags(str)
	uni.$isCarNum = (str) => $isCarNum(str)
	uni.$addUrlPrefix = (url) => $addUrlPrefix(url)
}

export default {
	install: Vue => {
		Vue.prototype.$isEmail = (str) => $isEmail(str)
		Vue.prototype.$isMobile = (str) => $isMobile(str)
		Vue.prototype.$isPhone = (str) => $isPhone(str)
		Vue.prototype.$isUrl = (str) => $isUrl(str)
		Vue.prototype.$isIDCard = (str) => $isIDCard(str)
		Vue.prototype.$isPostCode = (str) => $isPostCode(str)
		Vue.prototype.$isNumOrEn = (str) => $isNumOrEn(str)
		Vue.prototype.$isNum = (str) => $isNum(str)
		Vue.prototype.$isNNum = (str) => $isNNum(str)
		Vue.prototype.$isNNumUp = (str) => $isNNumUp(str)
		Vue.prototype.$isMToNNum = (str) => $isMToNNum(str)
		Vue.prototype.$isEnNumDownLine = (str) => $isEnNumDownLine(str)
		Vue.prototype.$isSpecial = (str) => $isSpecial(str)
		Vue.prototype.$isChinese = (str) => $isChinese(str)
		Vue.prototype.$isFloatPoint = (str) => $isFloatPoint(str)
		Vue.prototype.$isEnSize = (str) => $isEnSize(str)
		Vue.prototype.$isEnBig = (str) => $isEnBig(str)
		Vue.prototype.$isEnSmall = (str) => $isEnSmall(str)
		Vue.prototype.$isDoubleByte = (str) => $isDoubleByte(str)
		Vue.prototype.$startEndBlank = (str) => $startEndBlank(str)
		Vue.prototype.$isPosInt = (str) => $isPosInt(str)
		Vue.prototype.$removeHtmltags = (str) => $removeHtmltags(str)
		Vue.prototype.$isCarNum = (str) => $isCarNum(str)
		Vue.prototype.$addUrlPrefix = (url) => $addUrlPrefix(url)
	}
}
