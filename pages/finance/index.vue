<template>
	<view class="pages finance_index">
		<view class="content">
			<view class="info">
				<view class="item">
					<view class="title">{{$t('finance.index.template.user_balance')}}</view>
					<view class="price">${{wallet.total_balance||0}}</view>
				</view>
				<view class="item">
					<view class="title">{{$t('finance.index.template.available_balance')}}</view>
					<view class="price">${{wallet.balance||0}}</view>
				</view>
			</view>
		</view>
		<view class="tab_title">
			<view class="item" :class="{'cur':tab_current==0}" @click="tab_current=0">{{$t('finance.index.template.deposit')}}<text class="line"></text></view>
			<view class="item" :class="{'cur':tab_current==1}" @click="tab_current=1">{{$t('finance.index.template.withdrawal')}}<text class="line"></text></view>
		</view>
		<view class="tab_content">
			<view class="item" v-if="tab_current==0">
				<view class="deposit_box">
					<view class="card_box" v-for="(item,index) in receive" :key="index" @click="depositGo(item)">
						<view class="card_title">{{$t('finance.index.template.select_payment_channel')}}<text class="iconfont icon-arrowright"></text></view>
						<view class="card_content" v-if="item.type == 1">
							<view class="image" v-if="item.img">
								<img-cache mode="aspectFill" :src="item.img"></img-cache>
							</view>
							<view class="info">
								<view class="info_title network">{{item.agreement}}</view>
								<view class="address">{{item.address}}</view>
							</view>
						</view>
						<view class="card_content" v-else-if="item.type == 2">
							<view class="image" v-if="item.card_image">
								<img-cache mode="aspectFill" :src="item.card_image"></img-cache>
							</view>
							<view class="info">
								<view class="info_title bank">{{item.agreement}}</view>
								<view class="number">{{item.address}}</view>
								<view class="name">{{item.cardholder}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="item" v-else-if="tab_current==1">
				<view class="help">
					<text class="iconfont icon-plus-circle" @click="menu.show = true"></text>
				</view>
				<view class="qq_box" v-if="withdrawal.list3.length>0" @click="$navigateTo('/pages/my/address/zalo?type=edit',true)">
					<view class="item">{{$t('finance.index.template.name')}}:<text>{{withdrawal.list3[0].zalo_name}}</text></view>
					<view class="item">{{$t('finance.index.template.account_phone_number')}}:<text>+{{withdrawal.list3[0].zalo_mobile}}</text></view>
					<text class="iconfont icon-arrowright"></text>
				</view>
				<view class="address_box">
					<view class="empty_box" v-if="withdrawal.list.length==0 && withdrawal.list2.length==0 && withdrawal.list3.length==0 && withdrawal.done">
						<img-cache :src="require('@/static/images/empty.png')" mode="widthFix" width="300rpx"></img-cache>
						<view class="title">{{$t('common.empty_data')}}</view>
					</view>
					<view class="withdrawal_content" v-if="withdrawal.list.length>0 && withdrawal.done&&false">
						<view class="list_box list_usdt_box">
							<view :class="'list list'+index" v-for="(item,index) in withdrawal.list" :key="index" @click="withdrawalGo(item,'usdt')">
								<view class="cell">
									<view class="network">{{$t('finance.index.template.postscript')}}: {{item.network}}</view>
									<view class="rate">{{$t('finance.index.template.rate')}}: {{item.exchange_rate}}</view>
									<view class="address">{{$t('finance.index.template.wallet_address')}}：{{item.address}}</view>
								</view>
							</view>
						</view>
					</view>
					<view class="withdrawal_content" v-if="withdrawal.list2.length>0 && withdrawal.done">
						<view class="list_box list_bank_box">
							<view :class="'list list'+index" v-for="(item,index) in withdrawal.list2" :key="index" @click="withdrawalGo(item,'bank')">
								<view class="cell">
									<view class="bank">{{$t('finance.index.template.bank')}}:{{item.bankname}}</view>
									<view class="number">{{(item.cardnum).substr(0,2)+'********'+(item.cardnum).slice(-2)}}</view>
									<view class="name">
										<text>{{$t('finance.index.template.name')}}: {{item.username}}</text>
										<text>{{$t('finance.index.template.rate')}}: {{item.exchange_rate}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<u-action-sheet :actions="menu.list" :title="menu.title" :show="menu.show" :closeOnClickOverlay="true" @close="menu.show = false" :cancelText="$t('finance.index.template.cancel')" @select="menuAction"></u-action-sheet>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tab_current:0,
				receive:[],
				withdrawal:{
					done:false,
					list:[],
					list2:[],
					list3:[]
				},
				wallet:'',
				menu:{
					list:[
						// {
						// 	name:this.$t('finance.index.data.add_usdt'),
						// 	type:'usdt'
						// },
						{
							name:this.$t('finance.index.data.add_bank'),
							type:'bank'
						},
						{
							name:this.$t('finance.index.data.add_zalo'),
							type:'zalo'
						}
					],
					title:'',
					show:false
				}
			}
		},
		onLoad() {
			let s = this;
			s.$setTabBarI18n();
		},
		onShow() {
			let s = this;
			uni.setNavigationBarTitle({
				title:s.$t('finance.index.navbar_title')
			})
			uni.removeStorageSync('usdt_detail');
			uni.removeStorageSync('bank_detail');
			s.getWallet();
			s.getReceiveAddress();
			s.getWithdrawalList();
			s.getWithdrawalList2();
			s.getWithdrawalList3();
		},
		methods:{
			menuAction(e){
				let s = this;
				if(e.type == 'usdt'){
					if(s.withdrawal.list.length == 0){
						s.$navigateTo('/pages/my/address/usdt',true);
					}else{
						s.$toast(s.$t('finance.index.toast.only_one'));
					}
				}else if(e.type == 'bank'){
					if(s.withdrawal.list2.length == 0){
						s.$navigateTo('/pages/my/address/bank',true);
					}else{
						s.$toast(s.$t('finance.index.toast.only_one'));
					}
				}else if(e.type == 'zalo'){
					if(s.withdrawal.list3.length == 0){
						s.$navigateTo('/pages/my/address/zalo',true);
					}else{
						s.$toast(s.$t('finance.index.toast.only_one'));
					}
				}
			},
			getWallet(id){
				let s = this;
				uni.$u.http.get('/?s=App.User_User.GetUserBalanceInfo').then(res => {
					console.log('获取用户钱包余额');
					console.log(res);
					if(res.data.ret == 200){
						s.wallet = res.data.data;
					}
				})
			},
			getReceiveAddress(){
				let s = this;
				uni.$u.http.get('/?s=App.Recharge_Recharge.GetConfigDefaultAddress').then(res => {
					console.log(`获取系统收款信息`);
					console.log(res);
					if(res.data.ret == 200){
						s.receive = res.data.data;
					}
				})
			},
			getWithdrawalList(){
				let s = this;
				uni.$u.http.get('/?s=App.Usdt_Usdt.GetUserUsdtcard').then(res => {
					console.log('获取USDT列表');
					console.log(res);
					if(res.data.ret == 200){
						s.withdrawal.list = res.data.data.Usdt;
						s.withdrawal.done = true;
					}
				})
			},
			getWithdrawalList2(){
				let s = this;
				uni.$u.http.get('/?s=App.Bank_Bank.GetUserBankcard').then(res => {
					console.log('获取银行卡列表');
					console.log(res);
					if(res.data.ret == 200){
						s.withdrawal.list2 = res.data.data.Bank;
						s.withdrawal.done = true;
					}
				})
			},
			getWithdrawalList3(){
				let s = this;
				uni.$u.http.get('/?s=App.User_User.GetZalo').then(res => {
					console.log('获取Zalo列表');
					console.log(res);
					if(res.data.ret == 200){
						if(res.data.data){
							var result = res.data.data;
							result[0].zalo_mobile = result[0].mobile_country_code+''+result[0].zalo_mobile;
							s.withdrawal.list3 = result;
						}
						s.done = true;
					}
				})
			},
			depositGo(item){
				let s = this;
				if(item.type == 2){
					var type = 'bank'
				}else{
					var type = 'usdt';
				}
				// s.form.address_id = item.id;
				// s.receive2 = item;
				// s.step=3;
				uni.setStorageSync('receive',item);
				setTimeout(function() {
					s.$navigateTo('/pages/my/wallet/deposit/index?type='+type,true)
				}, 100);
			},
			withdrawalGo(item,type){
				let s = this;
				uni.showLoading();
				uni.$u.http.get('/?s=App.User_User.GetUserCanWithdraw').then(res => {
					console.log('判断是否能提现');
					console.log(res);
					if(res.data.ret == 200){
						if(type == 'bank'){
							uni.setStorageSync('bank_detail',item);
						}else{
							uni.setStorageSync('usdt_detail',item);
						}
						setTimeout(function() {
							s.$navigateTo(`/pages/my/wallet/withdrawal/index`,true);
						}, 100);
					}else{
						s.$toast(res.data.msg);
					}
					uni.hideLoading();
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		padding: 30rpx;
		margin: 0 0 30rpx 0;
		.info{
			background: #FFFFFF;
			box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.05);
			border-radius: 30rpx;
			padding: 45rpx 30rpx;
			display: flex;
			.item{
				width: 50%;
				text-align: center;
				.title{
					font-weight: 600;
					line-height: 40rpx;
					color: #000;
					margin: 0 0 15rpx 0;
				}
				.price{
					font-weight: 700;
					line-height: 44rpx;
					font-size: 40rpx;
					color: #000;
				}
			}
		}
	}
	.tab_title{
		background: #F5F5F5;
		height: 80rpx;
		display: flex;
		padding: 0 30rpx;
		.item{
			line-height: 40rpx;
			font-weight: 400;
			color: #666;
			width: 50%;
			text-align: center;
			height: 80rpx;
			line-height: 80rpx;
			position: relative;
			.line{
				height: 4rpx;
				width: 70rpx;
				position: absolute;
				bottom: 0;
				left: 50%;
				margin-left: -35rpx;
				background: #000;
				display: none;
			}
		}
		.cur{
			color: #000;
			font-weight: 600;
			.line{
				display: block;
			}
		}
	}
	.tab_content{
		.item{
			.help{
				text-align: right;
				padding: 30rpx 30rpx 0 30rpx;
				text{
					color: #000;
					font-size: 36rpx;
				}
			}
			.qq_box{
				background: #FFFFFF;
				box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.05);
				border-radius: 15rpx;
				margin: 30rpx 30rpx 0 30rpx;
				padding: 30rpx;
				position: relative;
				.item{
					line-height: 34rpx;
					font-size: 24rpx;
					color: #666;
					text{
						color: #000;
						font-weight: 600;
						margin: 0 0 0 7.5rpx;
					}
				}
				.iconfont{
					position: absolute;
					right: 30rpx;
					top: 50rpx;
				}
			}
			.deposit_box{
				padding: 30rpx;
				.card_box{
					background: #FFFFFF;
					box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.05);
					border-radius: 15rpx;
					padding: 30rpx;
					margin: 0 0 30rpx 0;
					position: relative;
					.card_title{
						line-height: 34rpx;
						font-size: 24rpx;
						color: #000;
						margin: 0 0 15rpx 0;
						.iconfont{
							color: #999;
							font-size: 24rpx;
							float: right;
						}
					}
					.card_content{
						display: flex;
						.image{
							width: 60rpx;
							height: 60rpx;
							background: #eee;
							border-radius: 15rpx;
							overflow: hidden;
							margin: 0 30rpx 0 0;
							.img-cache{
								width: 60rpx;
								height: 60rpx;
								border-radius: 15rpx;
								overflow: hidden;
							}
						}
						.info{
							color: #999;
							font-size: 24rpx;
							line-height: 34rpx;
							.info_title{
								color: #000;
								line-height: 32rpx;
								font-size: 28rpx;
								margin: 0 0 7.5rpx 0;
							}
						}
					}
				}
			}
		}
		.withdrawal_content{
			position: relative;
			z-index: 3;
			padding: 30rpx 30rpx 0 30rpx;
			.list_box{
				.list{
					width: 100%;
					height: 0;
					padding-bottom: 54%;
					background-size: 100% 100%!important;
					.cell{
						padding: 45rpx 60rpx;
					}
				}
			}
			.list_usdt_box{
				.list{
					position: relative;
					.cell{
						position: absolute;
						color: #fff;
						height: calc(100% - 90rpx);
						width: calc(100% - 120rpx);
						left: 0;
						top: 0;
						.network{
							font-size: 32rpx;
							line-height: 44rpx;
							font-weight: 600;
							margin: 0 0 7.5rpx 0;
						}
						.rate{
							font-weight: 400;
							line-height: 40rpx;
						}
						.address{
							position: absolute;
							left: 60rpx;
							bottom: 45rpx;
							line-height: 36rpx;
							white-space: pre-wrap;
							word-break: break-all;
							font-size: 26rpx;
						}
					}
				}
				.list0{
					background: url('../../static/images/my/usdt1.png') no-repeat 0 0;
				}
				.list1{
					background: url('../../static/images/my/usdt2.png') no-repeat 0 0;
				}
				.list2{
					background: url('../../static/images/my/usdt3.png') no-repeat 0 0;
				}
				.list3{
					background: url('../../static/images/my/usdt4.png') no-repeat 0 0;
				}
			}
			.list_bank_box{
				.list{
					position: relative;
					.cell{
						position: absolute;
						color: #fff;
						height: calc(100% - 90rpx);
						width: calc(100% - 120rpx);
						left: 0;
						top: 0;
						.bank{
							font-size: 32rpx;
							line-height: 44rpx;
							font-weight: 600;
							margin: 0 0 60rpx 0;
						}
						.number{
							font-weight: 400;
							line-height: 70rpx;
							font-size: 60rpx;
							text-align: center;
							margin: 0 0 7.5rpx 0;
						}
						.name{
							text-align: center;
							line-height: 40rpx;
							font-weight: 400;
							text{
								margin: 0 30rpx;
							}
						}
					}
				}
				.list0{
					background: url('../../static/images/my/bank1.png') no-repeat 0 0;
				}
				.list1{
					background: url('../../static/images/my/bank2.png') no-repeat 0 0;
				}
				.list2{
					background: url('../../static/images/my/bank3.png') no-repeat 0 0;
				}
				.list3{
					background: url('../../static/images/my/bank4.png') no-repeat 0 0;
				}
			}
		}
	}
</style>