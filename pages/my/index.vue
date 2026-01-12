<template>
	<view class="pages my_index">
		<view class="header">
			<view class="info">
				<view class="avatar" @click="$navigateTo(`/pages/my/profile/index`,true)">
					<img-cache :src="require('@/static/images/avatar.jpg')" mode="aspectFill" width="108rpx" height="108rpx"></img-cache>
				</view>
				<view class="nickname" @click="$navigateTo(`/pages/my/profile/index`,true)">
					<h1 v-if="user.nickname">{{user.nickname}}</h1>
					<h1 v-else-if="user.username">{{user.username}}</h1>
					<h1 v-else>{{$t('my.index.guest')}}</h1>
					<p> {{user.username}}</p>
					<p> VIP{{user.level||0}}</p>
				</view>
				<view class="button">
					<u-button size="mini" type="primary" :plain="true" :text="$t('my.index.signed')" color="#D6AE40" :disabled="true" v-if="info.IsSignin==1"></u-button>
					<u-button size="mini" type="primary" :plain="true" :text="$t('my.index.sign_in')" color="#D6AE40" :disabled="sign.disabled" :loading="sign.loading" loadingMode="circle" @click="signForm()" v-else></u-button>
				</view>
			</view>
			<view class="statistics">
				<view class="cell">
					<view class="num">{{info.AccumulatedIncome||0}}</view>
					<view class="title">{{$t('my.index.accumulated_income')}}</view>
				</view>
				<view class="cell">
					<view class="num">{{info.TodayEarnings||0}}</view>
					<view class="title">{{$t('my.index.today_earnings')}}</view>
				</view>
				<view class="cell">
					<view class="num">{{info.TeamBenefits||0}}</view>
					<view class="title">{{$t('my.index.team_benefit')}}</view>
				</view>
				<view class="cell">
					<view class="num">{{info.TodayTeamBenefits||0}}</view>
					<view class="title">{{$t('my.index.today_team_benefit')}}</view>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="wallet" v-if="false">
				<view class="info">
					<p>{{$t('my.index.user_balance')}}</p>
					<h2>${{info.Userbalance||0}}</h2>
				</view>
				<view class="button">
					<u-button size="mini" type="primary" :text="$t('my.index.recharge')" color="#1966FF" @click="$navigateTo(`/pages/my/wallet/deposit/index`,true)"></u-button>
					<u-button size="mini" type="primary" :text="$t('my.index.withdrawal')" color="#D6AE40" @click="$navigateTo(`/pages/my/wallet/withdrawal/index`,true)"></u-button>
				</view>
			</view>
			<view class="app">
				<view class="cell" @click="$navigateTo(`/pages/my/profile/index`,true)">
					<view class="iconfont icon-smile-fill"></view>
					<view class="title">{{$t('my.index.app.app1')}}</view>
				</view>
				<view class="cell" @click="$navigateTo(`/pages/my/about`,true)">
					<view class="iconfont icon-detail-fill"></view>
					<view class="title">{{$t('my.index.app.app10')}}</view>
				</view>
				<view class="cell" @click="$navigateTo(`/pages/my/wallet/index`,true)">
					<view class="iconfont icon-save-fill"></view>
					<view class="title">{{$t('my.index.app.app3')}}</view>
				</view>
				<view class="cell" @click="$navigateTo(`/pages/my/address/index`,true)">
					<view class="iconfont icon-wallet-fill"></view>
					<view class="title">{{$t('my.index.app.app2')}}</view>
				</view>
				<view class="cell" @click="$navigateTo(`/pages/my/invite`,true)">
					<view class="iconfont icon-rocket-fill"></view>
					<view class="title">{{$t('my.index.app.app7')}}</view>
				</view>
				<view class="cell" v-if="external_proxy_link" @click="$copy(external_proxy_link,$t('my.index.toast.copy_success'))">
					<view class="iconfont icon-project-fill"></view>
					<view class="title">{{$t('my.index.app.app11')}}</view>
				</view>
				<view class="cell" @click="$navigateTo(`/pages/my/message/index`,true)">
					<view class="iconfont icon-message-fill"></view>
					<view class="title">{{$t('my.index.app.app12')}}</view>
				</view>
				<view class="cell" @click="$navigateTo(`/pages/my/lottery`,true)" v-if="show_lottery">
					<view class="iconfont icon-gift-fill"></view>
					<view class="title">{{$t('my.index.app.app13')}}</view>
				</view>
			</view>
		</view>

		<!-- 退出确认 -->
		<u-modal :show="logout.show" showCancelButton :title="$t('my.index.toast.tip')" :content="$t('my.index.toast.text')" confirmColor="#D6AE40" @confirm="userLogout()" @cancel="logout.show=false"
        :confirmText="$t('my.index.toast.confirm')" :cancelText="$t('my.index.toast.cancel')" asyncClose></u-modal>
	</view>
</template>

<script>
  //#ifdef H5
  import h5Copy from '@/common/utils/junyi-h5-copy.js'
  //#endif
	export default {
		data() {
			return {
				show_lottery:false,
				sign:{
					disabled:false,
					loading:false
				},
				logout:{
					show: false
				},
				user:'',
				info:'',
				external_proxy_link:''
			}
		},
		onLoad() {
			let s = this;
			s.$setTabBarI18n();
			s.getConfig();
			s.getShowLottery();
		},
		onShow(){
			let s = this;
			if(uni.getStorageSync('token')){}else{
				s.$redirectTo('/pages/my/login')
			}
			s.getUser();
			s.getInfo();
      uni.setNavigationBarTitle({
        title:s.$t('my.index.navbar_title')
      })
		},
		onNavigationBarButtonTap(e) {
			let s = this;
			if(e.index == 0){
				s.logout.show=true;
			}
		},
		methods: {
			getShowLottery(){
				let s = this;
				uni.$u.http.post('/?s=App.ConfigData_ConfigData.GetConfigbyName',{
					config_name:'turntable_activity'
				}).then(res => {
					console.log('获取是否显示抽奖模块');
					console.log(res);
					if(res.data.ret == 200){
						if(res.data.data.value == 1){
							s.show_lottery = true
						}
					}
				})
			},
			getConfig(){
				let s = this;
				if(uni.getStorageSync('token')){}else{
					s.info = '';
					return false;
				}
				uni.$u.http.post('/?s=App.ConfigData_ConfigData.GetConfigbyName',{
					config_name:'external_proxy_link'
				}).then(res => {
					console.log('获取代理端信息');
					console.log(res);
					if(res.data.ret == 200){
						s.external_proxy_link = res.data.data.value
					}
				})
			},
			signForm(){
				let s = this;
				if(uni.getStorageSync('token')){}else{
					s.$navigateTo('/pages/my/login');
				}
				s.sign.disabled = true;
				s.sign.loading = true;

				uni.$u.http.post('/?s=App.User_User.UserSignin').then(res => {
					console.log('用户签到');
					console.log(res);
					if(res.data.ret == 200){
						s.$toast(s.$t('my.index.toast.success'));
						s.getInfo();
					}else{
						s.$toast(res.data.msg);
					}

					s.sign.disabled = false;
					s.sign.loading = false;
				})
			},
			userLogout(){//退出登录
				let s = this;
				uni.$u.http.post('/?s=App.User_User.Logout').then(res => {
					console.log('退出登录');
					console.log(res);
					if(res.data.ret == 200){
						s.logout.show = false;
						uni.removeStorageSync('token');
						uni.removeStorageSync('user');
						uni.removeStorageSync('user_id');
						s.$toast(s.$t('my.index.toast.success'));
						s.user = '';
						s.wallet = '';
						setTimeout(function() {
							s.$redirectTo('/pages/my/login',false);
						}, 100);
					}
				})
			},
			getUser(){
				let s = this;
				if(uni.getStorageSync('token')){}else{
					s.user = '';
					return false;
				}
				uni.$u.http.post('/?s=App.User_User.Profile').then(res => {
					console.log('获取用户信息');
					console.log(res);
					if(res.data.ret == 200){
						s.user = res.data.data.profile;
						uni.setStorageSync('user',res.data.data.profile);
					}else{
						s.$toast(res.data.msg);
					}
				})
			},
			getInfo(){
				let s = this;
				if(uni.getStorageSync('token')){}else{
					s.info = '';
					return false;
				}
				uni.$u.http.post('/?s=App.User_User.UserIndexInfo').then(res => {
					console.log('获取钱包统计数据');
					console.log(res);
					if(res.data.ret == 200){
						s.info = res.data.data;
					}else{
						s.$toast(res.data.msg);
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header{
		background: #fff;
		padding: 0 30rpx;
		box-shadow: 0px 8px 20px 0px rgba(230,228,228,0.7);
		border-radius: 0 0 20rpx 20rpx;
		.info{
			border-bottom: 1rpx solid #E6E6E6;
			padding: 0 0 30rpx 0;
			display: flex;
			.avatar{
				border-radius: 50%;
				overflow: hidden;
				width: 108rpx;
				height: 108rpx;
				margin: 0 30rpx 0 0;
				.img-cache{
					border-radius: 50%;
					overflow: hidden;
				}
			}
			.nickname{
				flex: auto;
				h1{
					font-size: 32rpx;
					line-height: 48rpx;
					color: #000;
					font-weight: normal;
				}
				p{
					font-size: 24rpx;
					line-height: 34rpx;
				}
			}
			.button{
				margin: 30rpx 0 0 0;
				width: 150rpx;
			}
		}
		.statistics{
			display: flex;
			.cell{
				text-align: center;
				padding: 30rpx 0;
				.num{
					font-size: 32rpx;
					color: #000;
					font-weight: bold;
					margin: 0 0 15rpx 0;
				}
				.title{
					line-height: 28rpx;
					font-size: 24rpx;
				}
			}
		}
	}
	.content{
		padding: 30rpx;
		.wallet{
			box-shadow: 0px 8rpx 20rpx 0px rgba(0,0,0,0.05);
			border-radius: 20rpx;
			background: #fff;
			margin: 0 0 30rpx 0;
			padding: 30rpx;
			display: flex;
			.info{
				flex: auto;
				margin: 7.5rpx 0 0 0;
				p{
					line-height: 40rpx;
				}
				h2{
					color: #000;
					font-weight: normal;
					font-size: 36rpx;
					line-height: 48rpx;
				}
			}
			.button{
				width: 150rpx;
				.u-button{
					&:first-child{
						margin: 0 0 15rpx 0;
					}
				}
			}
		}
		.app{
			box-shadow: 0px 8rpx 20rpx 0px rgba(0,0,0,0.05);
			border-radius: 20rpx;
			background: #fff;
			padding: 30rpx;
			display: flex;
			flex-wrap: wrap;
			.cell{
				text-align: center;width: 33.333%;
				padding: 30rpx 0;
				color: #000;
				.iconfont{
					font-size: 60rpx;
					margin: 0 0 15rpx 0;
				}
				.title{
					font-size: 24rpx;
					line-height: 36rpx;
				}
			}
		}
	}
</style>