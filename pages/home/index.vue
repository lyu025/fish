<template>
	<view class="pages home_index">
		<view class="status_bar">$nbsp;</view>
		<view class="content">
			<view class="swiper_box" v-if="swiper.length>0">
				<u-swiper :list="swiper" keyName="image" :circular="true" :indicator="true" :indicatorStyle="{'right':'15rpx','bottom':'15rpx'}" height="160" indicatorMode="line" @click="clickSwiper"></u-swiper>
			</view>
			<view class="notice_box" v-if="notice">
				<text class="iconfont icon-notification-fill">{{$t('home.index.template.notice_title')}}</text>
				<u-notice-bar icon="" :text="notice" color="#000" bgColor="#FAFAFA"></u-notice-bar>
			</view>
			<view class="invest_box">
				<view class="item" @click="$navigateTo('/pages/home/invest/detail?id='+invest.id)">
					<view class="info">
						<view class="image">
							<img-cache mode="aspectFill" :src="require('@/static/images/home/home_icon.png')"></img-cache>
						</view>
						<view class="title">{{$t('home.index.template.invest_title')}}</view>
					</view>
					<view class="description">{{$t('home.index.template.invest_description')}}</view>
					<view class="box" v-if='invest'>
						<view class="name">{{invest.name}}</view>
						<view class="desc">{{$t('home.index.template.invest_desc')}}</view>
						<view class="percent">+{{invest.bili*100}}%</view>
            <!--
						<view class="progress">
							<view class="percentage" :style="'width: '+invest.virtual_progre||0+'%'">{{invest.virtual_progre||0}}%</view>
							<u-line-progress :percentage="invest.virtual_progre||0" height="6" activeColor="#D6AE40" inactiveColor="#DBDBDB" :showText="false"></u-line-progress>
						</view>
						<view class="count">
							<view class="total">{{$t('home.index.template.invest_total')}}: {{invest.total_num}}</view>
							<view class="overage">{{$t('home.index.template.invest_overage')}}: {{invest.overage}}</view>
						</view>
            -->
					</view>
					<u-button type="primary" color="#D6AE40" :text="$t('home.index.template.invest_btn')"  :customStyle="{'font-size':'32rpx'}"></u-button>
				</view>
			</view>
			<view class="vip_box">
				<view class="item" v-for="(item,index) in vip" :key="index" @click="goType(item)">
					<view class="info">
						<view class="level">VIP {{item.level}}</view>
						<!--<view class="desc">{{item.vip_add_back_rate}}% {{$t('home.index.template.vip_more')}}</view>-->
					</view>
					<view class="status">
						<text v-if="item.is_jiesuo==1" class="iconfont icon-unlock-fill"></text>
						<text v-else class="iconfont icon-lock-fill"></text>
					</view>
				</view>
			</view>
		</view>

		<u-modal :show="action.show" :title="action.title" :content="action.content" @confirm="action.show=false" :confirmText="action.confirm" @close="action.show=false" :closeOnClickOverlay="true" confirmColor="#D6AE40"></u-modal>
		
		<!--弹框-->
		<u-popup :show="pop_message.show" @close="closePopMessage()" mode="center" :closeOnClickOverlay="true" round="30" borderRadius="30">
			<view class="pop_message_box">
				<view class="pop_message_title">{{$t('home.index.template.announcement')}}</view>
				<view class="pop_message_content" v-html="pop_message.content"></view>
				<view class="close">
					<text class="iconfont icon-close-circle" @click="closePopMessage()"></text>
				</view>
			</view>
		</u-popup>
		
		<u-popup :show="popup.show" :round="15" mode="center" @close="popup.show=false">
			<view class="popup_box">
				<view class="title">{{popup.item.title}}</view>
				<view class="content">{{popup.item.content}}</view>
				<view class="close" @click="popup.show=false">{{$t('home.index.template.close')}}</view>
				<view class="more">
					<u-checkbox-group @change="popupCheckboxChange">
						<u-checkbox name="1" shape="circle" :label="$t('home.index.template.popup_check_labal')" labelColor="#fff" activeColor="#D6AE40"></u-checkbox>
					</u-checkbox-group>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				popup:{
					show:false,
					item:''
				},
				pop_message:{
					show:false,
					content:''
				},
				swiper:[],
				notice:'',
				invest:'',
				vip:[],
				action:{
					show:false,
					title:this.$t('home.index.data.action.title'),
					content:this.$t('home.index.data.action.content'),
					confirm:this.$t('home.index.data.action.confirm')
				}
			}
		},
		onLoad(e) {
			let s = this;
			s.$setTabBarI18n();
			if(typeof e.code != "undefined"){
				uni.setStorageSync('invite_code',e.code);
			}
			s.getSwiper();
			s.getPopMessage();
		},
		onShow() {
			let s = this;
			uni.setNavigationBarTitle({
				title:s.$t('home.index.navbar_title')
			})
			if(uni.getStorageSync('token')){}else{
				setTimeout(function() {
					s.$redirectTo('/pages/my/login')
				}, 100);
			}
		},
		methods: {
			clickSwiper(e){
				let s = this;
				console.log(e);
				let url = s.swiper[e].url;
				if(url){
					if(url.substr(0,4) == 'http'){
						s.$openUrl(url);
					}else if(url.substr(0,5) == '/page'){
						s.$navigateTo(url);
					}
				}
			},
			popupCheckboxChange(e){
				let s = this;
				if(e[0]==1){
					uni.setStorageSync('home_popup_hide',s.popup.item.addtime);
				}else{
					uni.removeStorageSync('home_popup_hide');
				}
			},
			closePopMessage(){
				let s = this;
				s.pop_message.show=false;
				s.getMessage();
			},
			getPopMessage(){
			  let s =this;
			  uni.$u.http.post('/?s=App.Message_Message.GetPopupMessageDetail').then(res => {
				console.log('获取弹窗消息');
				console.log(res);
				if(res.data.ret == 200){
					if(res.data.data.ishow==1){
						s.pop_message.content = res.data.data.content;
						s.pop_message.show = true;
					}else{
						s.getMessage();
					}
				}
			  })
			},
			getMessage(){
			  let s =this;
			  if(uni.getStorageSync('home_popup_hide')){
				  return;
			  }
			  uni.$u.http.post('/?s=App.Message_Message.GetStationMessageList',{}, {
					params: {page: 1,perpage:10}
				}).then(res => {
				console.log('获取站内消息');
				console.log(res);
				if(res.data.ret == 200){
					s.popup.item = res.data.data[0];
					if(uni.getStorageSync('home_popup_hide')){
						if(uni.getStorageSync('home_popup_hide') == res.data.data[0].addtime){
							
						}else{
							s.popup.show = true;
						}
					}else{
						s.popup.show = true;
					}
				}
			  })
			},
			getSwiper(){
				let s = this;
				uni.$u.http.get('/?s=App.Banner_Banner.GetBanner').then(res => {
					console.log('获取轮播图');
					console.log(res);
					if(res.data.ret == 200){
						s.swiper = res.data.data.Banner;
					}
					s.getNotice();
				})
			},
			getNotice(){
				let s = this;
				uni.$u.http.get('/?s=App.Message_Message.GetSystemNotice').then(res => {
					console.log('获取通知');
					console.log(res);
					if(res.data.ret == 200){
						s.notice = res.data.data.content;
					}
					s.getInfo();
				})
			},
			getInfo(){
				let s = this;
				uni.$u.http.get('/?s=App.LixibaoList_LixibaoList.GetHomeInfo').then(res => {
					console.log('获取首页数据');
					console.log(res);
					if(res.data.ret == 200){
						s.invest = res.data.data.new;
						s.vip = res.data.data.vip;
					}
					// #ifdef APP-PLUS
					setTimeout(function() {
						plus.navigator.closeSplashscreen();
					}, 1000);
					// #endif
				})
			},
			goType(item){
				let s = this;
				if(item.is_jiesuo==1){
					s.$navigateTo('/pages/home/invest/index?type='+item.level);
				}else{
					s.action.show = true;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		padding: 30rpx;
		.swiper_box{
			margin: 0 0 30rpx 0;
		}
		.notice_box{
			display: flex;
			margin: 0 0 30rpx 0;
			line-height: 34rpx;
			.iconfont{
				color: #D6AE40;
				margin: 0 30rpx 0 0;
				font-size: 28rpx;
				line-height: 34rpx;
			}
			.u-notice-bar{
				padding: 0;
				line-height: 34rpx;
				font-size: 24rpx;
			}
		}
		.invest_box{
			.item{
				background: #FFFFFF;
				box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.05);
				border-radius: 15rpx;
				padding: 30rpx;
				.info{
					display: flex;
					margin: 0 0 15rpx 0;
					.image{
						width: 48rpx;
						height: 48rpx;
						background: #eee;
						border-radius: 7.5rpx;
						overflow: hidden;
						margin: 0 20rpx 0 0;
						.img-cache{
							width: 48rpx;
							height: 48rpx;
							border-radius: 7.5rpx;
							overflow: hidden;
						}
					}
					.title{
						font-weight: 400;
						font-size: 28rpx;
						color: #000;
						line-height: 48rpx;
					}
				}
				.description{
					line-height: 34rpx;
					font-size: 24rpx;
					color: #000;
					margin: 0 0 30rpx 0;
				}
				.box{
					background: #FAFAFA;
					text-align: center;
					border-radius: 15rpx;
					padding: 30rpx;
					margin: 0 0 30rpx 0;
					.name{
						font-weight: 600;
						color: #000;
						line-height: 40rpx;
					}
					.desc{
						color: #666666;
						line-height: 34rpx;
						font-size: 24rpx;
						margin: 0 0 7.5rpx 0;
					}
					.percent{
						font-size: 40rpx;
						color: #EA2F2F;
						font-weight: 700;
						line-height: 48rpx;
						margin: 0 0 30rpx 0;
					}
					.progress{
						margin: 0 0 15rpx 0;
						.percentage{
							color: #D6AE40;
							line-height: 32rpx;
							margin: 0 0 7.5rpx 0;
							text-align: right;
						}
					}
					.count{
						display: flex;
						justify-content: space-between;
						color: #333;
						font-size: 24rpx;
						line-height: 34rpx;
					}
				}
			}
		}
		.vip_box{
			padding: 0;
			margin: 30rpx 0 0 0;
			.item{
				margin: 0 0 30rpx 0;
				background-size: 100% 100%!important;
				height: 0;
				width: 100%;
				padding-bottom: 21%;
				position: relative;
				.info{
					padding: 30rpx 0 0 0;
					margin: 0 0 0 165rpx;
					.level{
						line-height: 44rpx;
						font-size: 32rpx;
						margin: 0 0 7.5rpx 0;
						font-weight: 600;
					}
					.desc{
						line-height: 32rpx;
						font-size: 28rpx;
						font-weight: 700;
					}
				}
				.status{
					position: absolute;
					top: 45rpx;
					right: 30rpx;
					.iconfont{
						font-size: 40rpx;
					}
				}
				&:nth-child(1){
					background: url(../../static/images/home/vip/home_img_ee01@3x.png) no-repeat 0 0;
					color: #805333;
				}
				&:nth-child(2){
					background: url(../../static/images/home/vip/home_img_ee02@3x.png) no-repeat 0 0;
					color: #717680;
				}
				&:nth-child(3){
					background: url(../../static/images/home/vip/home_img_ee03@3x.png) no-repeat 0 0;
					color: #806133;
				}
				&:nth-child(4){
					background: url(../../static/images/home/vip/home_img_ee04@3x.png) no-repeat 0 0;
					color: #456C80;
				}
				&:nth-child(5){
					background: url(../../static/images/home/vip/home_img_ee05@3x.png) no-repeat 0 0;
					color: #67477F;
				}
				&:nth-child(6){
					background: url(../../static/images/home/vip/home_img_ee06@3x.png) no-repeat 0 0;
					color: #7F4747;
				}
			}
		}
		.course_box{
			.item{
				margin: 60rpx 0 0 0;
				.title{
					font-size: 32rpx;
					line-height: 44rpx;
					font-weight: 600;
					color: #000;
					margin: 0 0 15rpx 0;
				}
				.image{
					width: 100%;
					height: 360rpx;
					background: #eee;
					border-radius: 15rpx;
					overflow: hidden;
					.img-cache{
						width: 100%;
						height: 360rpx;
						border-radius: 15rpx;
						overflow: hidden;
					}
				}
			}
		}
	}
	
	.pop_message_box{
		background: #fff;
		padding: 30rpx 45rpx;
		border-radius: 30rpx;
		width: 480rpx;
		white-space: pre-wrap;
		word-break: break-all;
		
		position: relative;
		.pop_message_title{
			font-size: 36rpx;
			font-weight: bold;
			margin: 0 0 30rpx 0;
			color: #000;
			text-align: center;
		}
		.pop_message_content{
			max-height: 500rpx;
			overflow-y: auto;
		}
		.close{
			position: absolute;
			bottom: -120rpx;
			left: 0;
			width: 100%;
			text-align: center;
			.iconfont{
				color: #fff;
				font-size: 60rpx;
			}
		}
	}
	
	.popup_box{
		background: #fff;
		border-radius: 30rpx;
		text-align: center;
		width: 520rpx;
		position: relative;
		.title{
			font-size: 32rpx;
			line-height: 48rpx;
			color: #000;
			font-weight: 600;
			padding: 30rpx 30rpx 0 30rpx;
		}
		.content{
			line-height: 36rpx;
			color: #666;
			font-weight: 400;
			padding: 30rpx;
		}
		.close{
			font-size: 32rpx;
			color: #D6AE40;
			font-weight: 600;
			line-height: 80rpx;
			height: 80rpx;
			border-top: 1rpx solid #E6E6E6;
		}
		.more{
			position: absolute;
			bottom: -80rpx;
			left: 0;
			width: 100%;
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			font-weight: 400;
		}
	}
</style>