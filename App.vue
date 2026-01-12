<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			let s = this;
			const system = uni.getSystemInfoSync();
			console.log(system);
			uni.setStorageSync('system',system);
			// 设定默认语言
			let c_lang = system.language;
			c_lang = c_lang.substr(0,2);
			if(uni.getStorageSync('lang')) {
				s.$i18n.locale = uni.getStorageSync('lang')
			} else {
				if(c_lang == 'en') {
					s.$i18n.locale = 'en';
					uni.setStorageSync('lang','en');
				} else {
					s.$i18n.locale = 'vi';
					uni.setStorageSync('lang','vi');
				}
			}
			
			// #ifdef APP-PLUS
			if(s.$is_dev) {
				plus.navigator.closeSplashscreen();
			}else{
				s.checkV();
				setTimeout(function() {
					plus.navigator.closeSplashscreen();
				}, 5000);
			}
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			checkV(){//检测升级
				let s = this;
				if(uni.getStorageSync('system').platform == 'android'){
					var os_type = 0;
				}else if(uni.getStorageSync('system').platform == 'ios'){
					var os_type = 1;
				}else{
					return false;
				}
				
				uni.$u.http.get('/?s=App.APP_App.AppUpdate',{
					params: {'os':os_type,'client_version':plus.runtime.version}
				}).then(res => {
					console.log('版本升级');
					console.log(res);
					if(res.data.ret == 200 && res.data.data != {}){
						if(os_type == 1){
							uni.showModal({
							    title: res.data.data.title,
							    content: res.data.data.content,
								confirmText:'Upgrade',
								cancelText:'Cacnel',
								confirmColor:'#1966FF',
							    success: function (res) {
							        if (res.confirm) {
							            plus.runtime.openURL(res.data.data.url);
							        } else if (res.cancel) {
							            console.log('用户点击取消');
							        }
							    }
							});
						}else{
							s.startUpDate(res.data.data,os_type);
						}
					}
				})
			},
			startUpDate(res,os_type){
				let topIconPath = plus.io.convertLocalFileSystemURL('_www/static/') + "images/upgrade_app_top_img.png";
				const upDater=uni.requireNativePlugin("CL-UpDater");
				let options={
					title:res.title,
					con:res.content,
					downUrl:res.url,
					hidCancelbtn:res.upgrade==2?true:false,
					btnBgColor:"#106ff2",
					updateBtnText:"Upgrade",
					verCode:res.version,
					hidBackBtn:false, 
					downMsgTip:"Resource download in progress, please wait", 
					goBackBtnText:"Go backstage",
					topImgBg:topIconPath
				}
				upDater.startUpdate(options,()=>{
					console.log("The bullet box is closed");			
				});
			}
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	
	@font-face {
		font-family: "iconfont"; /* Project id 2606394 */
		src: url('@/static/iconfont/iconfont.eot?t=1639659550170'); /* IE9 */
		src: url('@/static/iconfont/iconfont.eot?t=1639659550170#iefix') format('embedded-opentype'), /* IE6-IE8 */
			 url('@/static/iconfont/iconfont.woff2?t=1639659550170') format('woff2'),
			 url('@/static/iconfont/iconfont.woff?t=1639659550170') format('woff'),
			 url('@/static/iconfont/iconfont.ttf?t=1639659550170') format('truetype'),
			 url('@/static/iconfont/iconfont.svg?t=1639659550170#iconfont') format('svg');
	}
	
	@import "@/static/iconfont/iconfont.css";
	@import "@/static/css/common.css";
</style>