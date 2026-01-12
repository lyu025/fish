/**
 * JavaScript 工具库
 * Created by FengJianBo on 2020/08/09.
 */

/**
 * 获取url参数
 * @param {string?} _s // 非必传，不传就获取？之后的所有参数，并返回对象；传参就获取指定的key值
 * @returns {object || string}
 */
export function $getUrlString(_s) {
    let data = {};
    let href = window.location.href;
    let search = href.indexOf("?");
    if (search === -1) return '';
    let searchStr = href.substring(href.indexOf("?") + 1);
    let searchArray = searchStr.split("&");
    for (let i = 0; i < searchArray.length; i++) {
        let param = searchArray[i].split("=");
        data[param[0]] = param[1];
    }
    if (!_s) return data;
    for (let i in data) {
        if (_s == i) return data[i];
        return '';
    }
}
/**
 * 在url后面追加随机参数，以防浏览器缓存请求
 * @param {string} url
 * @return {string}
 */
export function $addRandomToURL(url) {
    return url.includes('?') ? `${url}&r=${Date.now()}` : `${url}?r=${Date.now()}`
}
/**
 * 根据url地址下载
 * @param {String} url 
 * @returns {Boolean}
 */
export function $download(url) {
    let isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    let isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
    if (isChrome || isSafari) {
        let link = document.createElement('a');
        link.href = url;
        if (link.download !== undefined) {
            let fileName = url.substring(url.lastIndexOf('/') + 1, url.length);
            link.download = fileName;
        }
        if (document.createEvent) {
            let e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            link.dispatchEvent(e);
            return true;
        }
    }
    if (url.indexOf('?') === -1) {
        url += '?download';
    }
    window.open(url, '_self');
    return true;
}
/**
 * 动态引入js
 * @param {*} src 需要引入的 js 文件地址
 */
export function $injectScript(src) {
    let s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = src;
    let t = document.getElementsByTagName('script')[0];
    t.parentNode.insertBefore(s, t);
}
/**
 * 获取当前URL
 * @param {*} 
 * @return {*}
 */
export function $getCurrentURL() {
    return window.location.href
}
/**
 * URI 编码
 * @param {*} _p 需要编码的参数
 * @returns 
 */
export function $encodeURI(_p) {
    return encodeURIComponent(JSON.stringify(_p))
}
/**
 * URI 解码
 * @param {*} _p 需要解码的参数
 * @returns 
 */
export function $decodeURI(_p) {
    return JSON.parse(decodeURIComponent(_p))
}
/**
 * 解析 URL 参数为对象
 * @param {Object} url
 * @returns 
 */
export function $parseParam(url) {
    const paramsStr = /.+\?(.+)$/.exec(url)[1]; // 将 ? 后面的字符串取出来
    const paramsArr = paramsStr.split('&'); // 将字符串以 & 分割后存到数组中
    let paramsObj = {};
    // 将 params 存到对象中
    paramsArr.forEach(param => {
        if (/=/.test(param)) { // 处理有 value 的参数
            let [key, val] = param.split('='); // 分割 key 和 value
            val = decodeURIComponent(val); // 解码
            val = /^\d+$/.test(val) ? parseFloat(val) : val; // 判断是否转为数字

            if (paramsObj.hasOwnProperty(key)) { // 如果对象有 key，则添加一个值
                paramsObj[key] = [].concat(paramsObj[key], val);
            } else { // 如果对象没有这个 key，创建 key 并设置值
                paramsObj[key] = val;
            }
        } else { // 处理没有 value 的参数
            paramsObj[param] = true;
        }
    })
    return paramsObj;
}
