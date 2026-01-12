<template>
	<view class="pages my_address_index">
		<view class="empty_box" v-if="list.length==0 && list2.length==0  && list3.length==0 && done">
			<img-cache :src="require('@/static/images/empty.png')" mode="widthFix" width="300rpx"></img-cache>
			<view class="title">{{$t('common.empty_data')}}</view>
		</view>
		<view class="loading_box" v-if="done == false">
			<u-loading-icon mode="circle" :text="$t('common.loading')" :vertical="true"></u-loading-icon>
		</view>
		<view class="content" v-if="list3.length>0 && done">
			<view class="list_box list_zalo_box">
				<view :class="'list list'+index" v-for="(item,index) in list3" :key="index" @click="$navigateTo('/pages/my/address/zalo?type=edit',true)">
					<view class="cell">
						<view class="name">{{$t('my.address.index.name')}}: <text>{{item.zalo_name}}</text></view>
						<view class="mobile">{{$t('my.address.index.phone_num')}}: <text>+{{item.zalo_mobile}}</text></view>
					</view>
					<text class="iconfont icon-arrowright"></text>
				</view>
			</view>
		</view>
		<view class="content" v-if="list.length>0 && done&&false">
			<view class="list_box list_usdt_box">
				<view :class="'list list'+index" v-for="(item,index) in list" :key="index" @click="selectThis(item,'usdt')">
					<view class="cell">
						<view class="network">{{$t('my.address.index.postscript')}}: {{item.network}}</view>
						<view class="rate">{{$t('my.address.index.rate')}}: {{item.exchange_rate}}</view>
						<view class="address">{{$t('my.address.index.wallet')}}：{{item.address}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="content" v-if="list2.length>0 && done">
			<view class="list_box list_bank_box">
				<view :class="'list list'+index" v-for="(item,index) in list2" :key="index" @click="selectThis(item,'bank')">
					<view class="cell">
						<view class="bank">{{$t('my.address.index.bank')}}:{{item.bankname}}</view>
						<view class="number">{{item.cardnum}}</view>
						<view class="name">
							<text>{{$t('my.address.index.name')}}: {{item.username}}</text>
							<text>{{$t('my.address.index.rate')}}: {{item.exchange_rate}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<u-action-sheet :actions="menu.list" :title="menu.title" :show="menu.show" :closeOnClickOverlay="true" @close="menu.show = false" cancelText="Cancel" @select="menuAction"></u-action-sheet>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type:'default',
				list:[],
				list2:[],
				list3:[],
				done:false,
				menu:{
					list:[
						// {
						// 	name:this.$t('my.address.index.add_usdt'),
						// 	type:'usdt'
						// },
						{
							name:this.$t('my.address.index.add_bank'),
							type:'bank'
						},
						{
							name:this.$t('my.address.index.add_zalo'),
							type:'zalo'
						}
					],
					title:'',
					show:false
				}
			}
		},
		onLoad(e) {
			let s = this;
      uni.setNavigationBarTitle({
        title:s.$t('my.address.index.navbar_title')
      })
			s.type = e.type;
		},
		onShow() {
			let s = this;
			s.getList();
			s.getList2();
			s.getList3();
			uni.removeStorageSync('usdt_detail');
			uni.removeStorageSync('bank_detail');
		},
		onNavigationBarButtonTap(e) {
			let s = this;
			if(e.index == 0){
				s.menu.show = true;
			}
		},
		methods:{
			selectThis(item,type){
				let s = this;
				if(s.type == 'select'){
					uni.setStorageSync(type+'_detail',item);
					setTimeout(function() {
						uni.navigateBack()
					}, 100);
				}
			},
			menuAction(e){
				let s = this;
				if(e.type == 'usdt'){
					if(s.list.length == 0){
						s.$navigateTo('/pages/my/address/usdt',true);
					}else{
						s.$toast(s.$t('my.usdt.index.only_one'));
					}
				}else if(e.type == 'bank'){
					if(s.list2.length == 0){
						s.$navigateTo('/pages/my/address/bank',true);
					}else{
						s.$toast(s.$t('my.usdt.index.only_one'));
					}
				}else if(e.type == 'zalo'){
					if(s.list3.length == 0){
						s.$navigateTo('/pages/my/address/zalo',true);
					}else{
						s.$toast(s.$t('my.usdt.index.only_one'));
					}
				}
			},
			getList(){
				let s = this;
				uni.$u.http.get('/?s=App.Usdt_Usdt.GetUserUsdtcard').then(res => {
					console.log('获取USDT列表');
					console.log(res);
					if(res.data.ret == 200){
						s.list = res.data.data.Usdt;
						s.done = true;
					}
				})
			},
			getList2(){
				let s = this;
				uni.$u.http.get('/?s=App.Bank_Bank.GetUserBankcard').then(res => {
					console.log('获取银行卡列表');
					console.log(res);
					if(res.data.ret == 200){
						s.list2 = res.data.data.Bank;
						s.done = true;
					}
				})
			},
			getList3(){
				let s = this;
				uni.$u.http.get('/?s=App.User_User.GetZalo').then(res => {
					console.log('获取Zalo列表');
					console.log(res);
					if(res.data.ret == 200){
						if(res.data.data){
							var result = res.data.data;
							result[0].zalo_mobile = result[0].mobile_country_code+''+result[0].zalo_mobile;
							s.list3 = result;
						}
						s.done = true;
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pages{
		position: relative;
		z-index: 1;
		.content{
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
			.list_zalo_box{
				background: #FFFFFF;
				box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.05);
				border-radius: 20rpx;
				.list{
					height: auto;
					padding-bottom: 0;
					position: relative;
					.cell{
						padding: 30rpx;
						view{
							line-height: 44rpx;
							text{
								color: #000;
								font-weight: 600;
								margin: 0 0 0 7.5rpx;
							}
						}
					}
					.iconfont{
						position: absolute;
						right: 30rpx;
						top: 60rpx;
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
					background: url('../../../static/images/my/usdt1.png') no-repeat 0 0;
				}
				.list1{
					background: url('../../../static/images/my/usdt2.png') no-repeat 0 0;
				}
				.list2{
					background: url('../../../static/images/my/usdt3.png') no-repeat 0 0;
				}
				.list3{
					background: url('../../../static/images/my/usdt4.png') no-repeat 0 0;
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
					background: url('../../../static/images/my/bank1.png') no-repeat 0 0;
				}
				.list1{
					background: url('../../../static/images/my/bank2.png') no-repeat 0 0;
				}
				.list2{
					background: url('../../../static/images/my/bank3.png') no-repeat 0 0;
				}
				.list3{
					background: url('../../../static/images/my/bank4.png') no-repeat 0 0;
				}
			}
		}
	}
</style>