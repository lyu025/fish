<template>
	<view class="pages my_download">
		<view class="logo_box">
			<img-cache :src="require('@/static/images/logo_login.png')" width="160rpx" height="160rpx"></img-cache>
		</view>
		<view class="notice_box notice_box1">{{$t('my.download.text1')}}</view>
		<view class="button_box button_box1">
			<u-button type="primary" shape="circle" :text="$t('my.download.button.h5')" color="#1966FF" class="button primary" @click="visitH5()"></u-button>
		</view>
		<view class="notice_box notice_box2">{{$t('my.download.text2')}}</view>
		<view class="qrcode_box">
			<view class="qrcode" v-if="download">
				<uqrcode ref="uQRCode" :text="download.h5_url+'/#/pages/my/download'" :size="90" />
			</view>
		</view>
		<view class="button_box button_box2" v-if="system.platform=='ios'">
			<!-- <u-button type="default" shape="circle" :text="$t('my.download.button.ios')" :plain="true" @click="$openUrl(download.ios_url)"></u-button> -->
			<u-button type="default" shape="circle" :text="$t('my.download.button.ios')" :plain="true" class="button default" @click="$openUrl(download.webclip)"></u-button>
		</view>
		<view class="button_box button_box2" v-else>
			<u-button type="default" shape="circle" :text="$t('my.download.button.android')" :plain="true" class="button default" @click="$openUrl(download.android)"></u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				download:'',
				system:''
			}
		},
		onLoad(e) {
			let s = this;
			if(typeof e.lang != "undefined"){
				if(e.lang == 'en' || e.lang =='zh_tw' || e.lang =='tr'){
					s.$i18n.locale = e.lang;
					uni.setStorageSync('lang',e.lang);
				}
			}
			s.system = uni.getStorageSync('system');
			if(uni.getStorageSync('download')){s.download = uni.getStorageSync('download');}
			uni.setNavigationBarTitle({
				title:this.$t('my.download.navbar_title')
			})
			
			s.getDownloadLink();
		},
		methods:{
			getDownloadLink(){
				let s = this;
				uni.$u.http.get('/?s=App.ConfigData_ConfigData.GetDownloadUrl').then(res => {
					console.log('获取下载地址信息');
					console.log(res);
					if(res.data.ret == 200){
						s.download = res.data.data;
						uni.setStorageSync('download',res.data.data);
					}
				})
			},
			visitH5(){
				let s = this;
				//#ifdef H5
				uni.reLaunch({
					url:'/pages/home/index'
				})
				//#endif
				//#ifdef APP-PLUS
				s.$openUrl(s.download.h5_url);
				//#endif
			}
		}
	}
</script>

<style lang="scss" scoped>
	.my_download{
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: #999 url(@/static/images/my/login_bg.jpg) no-repeat center center;
		background-size: cover;
		z-index: 1;
		.logo_box{
			text-align: center;
			margin-top: var(--status-bar-height);
			padding: 90rpx 0 60rpx 0;
		}
		.notice_box{
			padding: 0 60rpx;
			color: #fff;
			line-height: 44rpx;
			font-size: 32rpx;
			text-align: center;
		}
		.notice_box1{
			margin-bottom: 60rpx;
		}
		.notice_box2{
			font-size: 28rpx;
			margin-bottom: 30rpx;
			margin-top: 30rpx;
		}
		.button_box{
			padding: 0 60rpx;
			.u-button{
				margin: 0 0 15rpx 0;
				background: none;
				border: 1rpx solid rgba(255,255,255,0.7);
				color: #fff;
			}
		}
		.qrcode_box{
			text-align: center;
			margin-bottom: 30rpx;
			.qrcode{
				display: inline-block;
				padding: 8rpx;
				background: #242933;
			}
		}
	}
</style>