<template>
	<view class="pages my_wallet_withdrawal_index">
		<view class="content">
			<view class="form_box">
				<u--form class="form" :model="form" :rules="rules" ref="uform" labelPosition="top" labelWidth="100%" :labelStyle="{'font-weight':'bold','font-size':'32rpx','margin':'0 0 15rpx 0'}">
					<view class="address_box" v-if="type=='usdt' && address != ''" @click="$navigateTo(`/pages/my/address/index?type=select`,true)">
						<view class="type">{{$t('my.wallet.withdraw.index.usdt')}}</view>
						<view class="network">{{$t('my.wallet.withdraw.index.network')}}: {{address.network}}</view>
						<view class="address">{{$t('my.wallet.withdraw.index.address')}}: {{address.address}}</view>
						<text class="iconfont icon-right"></text>
					</view>
					<view class="address_box" v-else-if="type=='bank' && address != ''" @click="$navigateTo(`/pages/my/address/index?type=select`,true)">
						<view class="type">{{$t('my.wallet.withdraw.index.bank')}}</view>
						<view class="bank_name">{{$t('my.wallet.withdraw.index.bankname')}}: {{address.bankname}}</view>
						<view class="bank_card">{{$t('my.wallet.withdraw.index.card_num')}}: {{(address.cardnum).substr(0,2)+'********'+(address.cardnum).slice(-2)}}</view>
						<view class="name">{{$t('my.wallet.withdraw.index.name')}}: {{address.username}}</view>
						<text class="iconfont icon-right"></text>
					</view>
					<view class="address_box_empty" v-else @click="$navigateTo(`/pages/my/address/index?type=select`,true)">
						<text class="iconfont icon-plus">{{$t('my.wallet.withdraw.index.add_address')}}</text>
					</view>
					<u-form-item :label="$t('my.wallet.withdraw.index.form.rate_label')" prop="price" class="item" v-if="address">
						<u-input :value="address.rate" type="number" :placeholder="$t('my.wallet.withdraw.index.form.rate_placeholder')" class="price_input" readonly></u-input>
					</u-form-item>
					<u-form-item :label="$t('my.wallet.withdraw.index.form.price_label')" prop="price" class="item">
						<u-input v-model="form.price" :type="system.platform=='ios'?'digit':'digit'" :placeholder="$t('my.wallet.withdraw.index.form.price_placeholder')" class="price_input">
							<text slot="prefix">$</text>
							<view class="input_right" slot="suffix" v-if="false">
								<u-button v-if="form.price" style=";color: #D6AE40;" size="mini" text="Confirm" :loading="exchange.loading" :disabled="exchange.disabled" @click="getDeposit()"></u-button>
								<u-button v-else size="mini" text="Confirm" :loading="exchange.loading" :disabled="exchange.disabled" @click="getDeposit()"></u-button>
							</view>
						</u-input>
					</u-form-item>
					<u-form-item :label="$t('my.wallet.withdraw.index.form.ac_label')" prop="price" class="item" v-if="form.price && type=='bank'">
						<u-input :value="$accMul(form.price,address.rate).toFixed(0)" type="number" :placeholder="$t('my.wallet.withdraw.index.form.ac_placeholder')" class="price_input" readonly>
							<text slot="prefix">₫</text>
						</u-input>
					</u-form-item>
					<u-form-item :label="$t('my.wallet.withdraw.index.form.ac_label')"  prop="price" class="item" v-else-if="form.price && type=='usdt'">
						<u-input :value="$accMul(form.price,address.rate).toFixed(2)" type="number" :placeholder="$t('my.wallet.withdraw.index.form.ac_placeholder')" class="price_input" readonly>
							<text slot="prefix">U</text>
						</u-input>
					</u-form-item>
					<view class="button_box">
						<u-button type="primary" color="#D6AE40" :text="$t('my.wallet.withdraw.index.navbar_title')" :customStyle="{'font-size':'32rpx'}" :disabled="submit.disabled" :loading="submit.loading" loadingMode="circle" @click="submitForm()"></u-button>
					</view>
					<view class="description_box" v-if="notice" v-html="notice.content"></view>
				</u--form>
			</view>
		</view>

		<!--支付密码弹框-->
		<u-popup :show="pay.show" @close="pay.show=false" mode="bottom" :closeOnClickOverlay="true" round="15" borderRadius="15">
			<view class="popup_pay_box">
				<view class="line" @click="pay.show=false"></view>
				<u-input v-model="form.pay_password" type="number" :password="pay.password" :placeholder="$t('my.wallet.withdraw.index.form.pay_password_placeholder')" class="input">
					<text slot="suffix" class="iconfont icon-eye-close" @click="pay.password=false" v-if="pay.password==true"></text>
					<text slot="suffix" class="iconfont icon-eye" @click="pay.password=true" v-if="pay.password==false"></text>
				</u-input>
				<u-button type="primary" color="#D6AE40" :text="$t('my.wallet.withdraw.index.form.invest')"  :customStyle="{'font-size':'32rpx'}" :disabled="submit2.disabled" :loading="submit2.loading" loadingMode="circle" @click="submitForm2()"></u-button>
				<view class="help">
					<text @click="$navigateTo(`/pages/my/profile/pay_password`,true)">{{$t('my.wallet.withdraw.index.form.forget')}}</text>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				system:'',
				type:'usdt',
				form:{
					pay_password:'',
					id:'',
					price:''
				},
				rules:[],
				pay:{
					show:false,
					password:true,
				},
				submit:{
					disabled:true,
					loading:false
				},
				submit2:{
					disabled:true,
					loading:false
				},
				address:'',
				notice:'',
				pay_password:false,
				credit:'',
				exchange:{
					disabled:true,
					loading:false
				}
			}
		},
		watch:{
			form:{
				handler(){
					let s = this;
					if(s.form.id != '' && s.form.price != ''){
						s.submit.disabled = false;
					}else{
						s.submit.disabled = true;
					}
					if(s.form.id != '' && s.form.price != '' && s.form.pay_password != ''){
						s.submit2.disabled = false;
					}else{
						s.submit2.disabled = true;
					}
				},
				immediate:true,
				deep:true
			},
		},
		onLoad() {
			let s = this;
			s.system = uni.getStorageSync('system');
      uni.setNavigationBarTitle({
        title:s.$t('my.wallet.withdraw.index.navbar_title')
      })
			s.getNotice();
		},
		onShow() {
			let s = this;
			if(uni.getStorageSync('usdt_detail')){
				s.type = 'usdt',
				s.form.id = uni.getStorageSync('usdt_detail').id;
				s.address = uni.getStorageSync('usdt_detail');
			}else if(uni.getStorageSync('bank_detail')){
				s.type = 'bank',
				s.form.id = uni.getStorageSync('bank_detail').id;
				s.address = uni.getStorageSync('bank_detail');
			}
			s.getPaymentPassword();
		},
		onNavigationBarButtonTap(e) {
			let s = this;
			if(e.index == 0){
				s.$navigateTo(`/pages/my/wallet/withdrawal/record`,false);
			}
		},
		methods: {
			getPaymentPassword(){
				let s = this;
				uni.$u.http.post('/?s=App.User_User.CheckPaymentPassword').then(res => {
					console.log('获取是否有设置支付密码');
					console.log(res);
					if(res.data.ret == 200){
						if(res.data.data.pwd2){
							s.pay_password = true;
						}
					}
				})
			},
			getNotice(){
				let s = this;
				uni.$u.http.get('/?s=App.Message_Message.GetMessageDetail', {
					params: {type: 6}
				}).then(res => {
					console.log('提现注意信息');
					console.log(res);
					if(res.data.ret == 200){
						s.notice = res.data.data;
					}
				})
			},
			submitForm(){
				let s = this;
				var price2 = s.form.price;
				price2 = String(price2);
				var price2_arr = price2.split('.');
				if(price2_arr.length>2){
					s.$toast(s.$t('my.wallet.withdraw.index.toast.no_number'));
					return false;
				}else if(price2_arr.length==2 && price2_arr[1].length>2){
					s.$toast(s.$t('my.wallet.withdraw.index.toast.max_two'));
					return false;
				}else{
					if(s.pay_password){
						s.pay.show = true;
					}else{
						s.$toast(s.$t('my.wallet.withdraw.index.toast.set_pay'));
						setTimeout(function() {
							s.$navigateTo(`/pages/my/profile/pay_password`,true);
						}, 1000);
						return false;
					}
				}
			},
			submitForm2(){
				let s = this;
				s.submit2.disabled = true;
				s.submit2.loading = true;

				if(s.type == 'bank'){
					var url = 'App.Recharge_Recharge.BankWithdrawal';
				}else{
					var url = 'App.Recharge_Recharge.UsdtWithdrawal'
				}

				uni.$u.http.post('/?s='+url,{}, {
					params: s.form
				}).then(res => {
					console.log('提现申请');
					console.log(res);
					if(res.data.ret == 200){
						s.$toast('Success');
						setTimeout(function() {
							s.$navigateTo(`/pages/my/withdrawal/record`,true)
						}, 500);
					}else{
						s.$toast(res.data.msg);
					}
					s.form.pay_password = '';
					s.pay.show = false;

					s.submit2.disabled = false;
					s.submit2.loading = false;
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		padding: 30rpx;
		.address_box{
			background: #FFFFFF;
			box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.05);
			border-radius: 15rpx;
			padding: 30rpx;
			margin: 0 0 30rpx 0;
			position: relative;
			.type{
				color: #000;
				font-weight: bold;
				margin: 0 0 15rpx 0;
			}
			.iconfont{
				font-size: 48rpx;
				color: #eee;
				line-height: 40rpx;
				position: absolute;
				right: 30rpx;
				top: 50%;
				margin-top: -20rpx;
			}
		}
		.address_box_empty{
			background: #FFFFFF;
			box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.05);
			border-radius: 15rpx;
			padding: 30rpx;
			margin: 0 0 30rpx 0;
			.iconfont{
				font-weight: 400;
				color: #000;
				line-height: 40rpx;
				&:before{
					margin: 0 15rpx 0 0;
				}
			}
		}
		.price_input{
			background: #F5F5F5;
			line-height: 75rpx;
			height: 75rpx;
			border: none;
			.input_right{
				.u-button{
					background: none;
					border: none;
					font-weight: bold;
				}
			}
		}
		.description_box{
			margin: 30rpx 0 0 0;
			color: #666;
			line-height: 40rpx;
			h3{
				font-weight: normal;
			}
		}
	}

	.popup_pay_box{
		padding: 90rpx 30rpx 30rpx 30rpx;
		position: relative;
		.line{
			width: 150rpx;
			height: 8rpx;
			background: #eee;
			position: absolute;
			left: 50%;
			margin-left: -75rpx;
			top: 30rpx;
		}
		.input{
			margin: 0 0 30rpx 0;
		}
		.help{
			text-align: right;
			text{
				color: #999;
				border-bottom: 1rpx solid #999;
				font-size: 24rpx;
				line-height: 48rpx;
			}
		}
	}
</style>