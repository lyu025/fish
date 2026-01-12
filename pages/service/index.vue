<template>
	<view class="pages service_index">
		<view class="info">
			<img-cache mode="aspectFill" :src="require('@/static/images/service/info.jpg')"></img-cache>
			<view class="text">
				<view class="title">{{$t('service.index.template.title')}}</view>
				<view class="description">{{$t('service.index.template.description')}}</view>
			</view>
		</view>
		<view class="chat">
			<view class="item" @click="$openUrl(service.onlineservice+'&name='+user.username+chat_type)">
				<img-cache mode="aspectFill" :src="require('@/static/images/service/online.png')"></img-cache>
				<view class="title">{{$t('service.index.template.online')}}</view>
			</view>
			<view class="item" @click="$openUrl(service.telegramUrl)">
				<img-cache mode="aspectFill" :src="require('@/static/images/service/telegram.png')"></img-cache>
				<view class="title">{{$t('service.index.template.telegram')}}</view>
			</view>
		</view>
		<view class="more">
			<view class="title">{{$t('service.index.template.more')}}</view>
			<view class="number">{{service.tel}}</view>
		</view>
		<view class="help" v-if="service" v-html="service.needhelp.content"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user:'',
				service:'',
				chat_type:''
			}
		},
		onLoad() {
			let s = this;
			s.user = uni.getStorageSync('user');
			s.$setTabBarI18n();
			//#ifdef APP-PLUS
			s.chat_type = '&type=app';
			//#endif
		},
		onShow() {
			let s = this;
			s.getService();
			uni.setNavigationBarTitle({
				title:s.$t('service.index.navbar_title')
			})
			if(uni.getStorageSync('token')){}else{
				s.$redirectTo('/pages/my/login')
			}
		},
		methods: {
			getService(){
				let s = this;
				uni.$u.http.get('/?s=App.CustomerService_Cs.CustomerServieIndex').then(res => {
					console.log('服务信息');
					console.log(res);
					if(res.data.ret == 200){
						s.service = res.data.data;
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pages{
		/*#ifdef APP-PLUS*/
		height: 100vh;
		/*#endif*/
		/*#ifdef H5*/
		height: calc(100vh - 50px);
		/*#endif*/
		background: #fff;
	}
	.info{
		height: 480rpx;
		background: #eee;
		overflow: hidden;
		position: relative;
		.img-cache{
			width: 100%;
			height: 480rpx;
			overflow: hidden;
		}
		.text{
			position: absolute;
			left: 30rpx;
			bottom: 90rpx;
			width: 60%;
			.title{
				line-height: 44rpx;
				font-size: 32rpx;
				color: #fff;
				font-weight: 600;
				margin: 0 0 15rpx 0;
			}
			.description{
				line-height: 36rpx;
				font-size: 24rpx;
				color: #E6E6E6;
				font-weight: 400;
			}
		}
	}
	.chat{
		background: #fff;
		border-radius: 30rpx 30rpx 0 0;
		display: flex;
		padding: 45rpx 15rpx 0 15rpx;
		margin: -30rpx 0 0 0;
		position: relative;
		z-index: 9;
		.item{
			height: 180rpx;
			background: #eee;
			overflow: hidden;
			position: relative;
			width: 50%;
			margin: 0 15rpx;
			border-radius: 7.5rpx;
			overflow: hidden;
			.img-cache{
				width: 100%;
				height: 180rpx;
				border-radius: 7.5rpx;
				overflow: hidden;
			}
			.title{
				position: absolute;
				left: 15rpx;
				bottom: 7.5rpx;
				line-height: 36rpx;
				font-size: 24rpx;
				color: #E6E6E6;
				font-weight: 400;
			}
		}
	}
	.more{
		background: #F0F0F0;
		border-radius: 15rpx;
		margin: 30rpx;
		padding: 30rpx;
		.title{
			line-height: 40rpx;
			font-weight: 600;
			color: #000;
			margin: 0 0 15rpx 0;
		}
		.number{
			line-height: 48rpx;
			font-size: 40rpx;
			font-weight: 700;
			color: #000;
		}
	}
	.help{
		padding: 0 30rpx;
	}
</style>