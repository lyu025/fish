<template>
	<view class="pages invest_checkout">
		<view class="content">
			<view class="wallet_box">
				<view class="item">
					<view class="title">{{$t('home.invest.checkout.wallet_item1')}} ($)</view>
					<view class="number">{{detail.user_balance}}</view>
				</view>
				<view class="item">
					<view class="title">{{$t('home.invest.checkout.wallet_item2')}} ($)</view>
					<view class="number">{{detail.user_lixibao_balance}}</view>
				</view>
			</view>
			<view class="form_box">
				<view class="item">
					<view class="label">{{$t('home.invest.checkout.form_label1')}}</view>
					<view class="value">${{detail.min_num||0}}</view>
				</view>
				<view class="item">
					<view class="label">{{$t('home.invest.checkout.form_label2')}}</view>
					<view class="value">{{$t('home.invest.checkout.form_value2')}}</view>
				</view>
				<view class="item">
					<view class="label">{{$t('home.invest.checkout.form_label3')}}</view>
					<view class="value">
						<text class="price">${{detail.min_num||0}}</text>
<!-- 						<u-number-box :buttonSize="24" v-model="form.price" :value="detail.min_num||0" :inputWidth="60" :step="detail.step||0">
							<view slot="minus" class="minus">
								<text class="iconfont icon-minus"></text>
							</view>
							<view slot="input" class="input_box">
								<input type="number" v-model="form.price" :value="detail.min_num||0"></input>
							</view>
							<view slot="plus" class="plus">
								<text class="iconfont icon-plus"></text>
							</view>
						</u-number-box> -->
					</view>
				</view>
				<view class="item" v-if="false">
					<view class="label">{{$t('home.invest.checkout.form_label4')}} {{detail.min_num||0}}, {{$t('home.invest.checkout.form_label4_1')}} {{detail.step||0}} {{$t('home.invest.checkout.form_label4_2')}}</view>
				</view>
			</view>
			<view class="button_box">
				<u-button type="primary" color="#D6AE40" :text="$t('home.invest.checkout.form_button')"  :customStyle="{'font-size':'32rpx'}" :disabled="submit.disabled" :loading="submit.loading" loadingMode="circle" @click="submitForm()"></u-button>
			</view>
		</view>
		
		<!--支付密码弹框-->
		<u-popup :show="pay.show" @close="pay.show=false" mode="bottom" :closeOnClickOverlay="true" round="15" borderRadius="15">
			<view class="popup_pay_box">
				<view class="line" @click="pay.show=false"></view>
				<u-input v-model="form.pay_password" type="number" :password="pay.password" :placeholder="$t('home.invest.checkout.form_placeholder')" class="input">
					<text slot="suffix" class="iconfont icon-eye-close" @click="pay.password=false" v-if="pay.password==true"></text>
					<text slot="suffix" class="iconfont icon-eye" @click="pay.password=true" v-if="pay.password==false"></text>
				</u-input>
				<u-button type="primary" color="#D6AE40" :text="$t('home.invest.checkout.form_button')"  :customStyle="{'font-size':'32rpx'}" :disabled="submit2.disabled" :loading="submit2.loading" loadingMode="circle" @click="submitForm2()"></u-button>
				<view class="help">
					<text @click="$navigateTo(`/pages/my/profile/pay_password`,true)">{{$t('home.invest.checkout.form_forget')}}</text>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail:'',
				form:{
					lxb_id:'',
					price:'',
					pay_password:''
				},
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
				pay_password:false,
			}
		},
		watch:{
			form:{
				handler(){
					let s = this;
					if(s.form.lxb_id != '' && s.form.price != ''){
						s.submit.disabled = false;
					}else{
						s.submit.disabled = true;
					}
					if(s.form.lxb_id != '' && s.form.price != '' && s.form.pay_password != ''){
						s.submit2.disabled = false;
					}else{
						s.submit2.disabled = true;
					}
				},
				immediate:true,
				deep:true
			},
		},
		onLoad(e) {
			let s = this;
			s.detail = uni.getStorageSync('invest_detail');
			s.form.lxb_id = s.detail.id;
			s.form.price = s.detail.min_num||0;
		},
		onShow() {
			let s = this;
			uni.setNavigationBarTitle({
				title:s.$t('home.invest.checkout.navbar_title')
			})
			s.getPaymentPassword();
			s.getDetail();
		},
		methods: {
			getDetail(id){
				let s = this;
				uni.$u.http.get('/?s=App.LixibaoList_LixibaoList.GetYuebaoListDetails', {
					params: {lxb_list_id: s.detail.id}
				}).then(res => {
					console.log('获取理财详情');
					console.log(res);
					if(res.data.ret == 200){
						s.detail = res.data.data;
						uni.setStorageSync('invest_detail',s.detail);
					}else{
						s.$toast(res.data.msg)
					}
				})
			},
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
			submitForm(){
				let s = this;
				if(s.pay_password){
					if(Number(s.form.price) > Number(s.detail.user_balance)){
						s.$toast(s.$t('home.invest.checkout.toast.sorry'));
						setTimeout(function() {
							s.$navigateTo(`/pages/my/wallet/deposit/index`,true);
						}, 500);
						return false;
					}else{
						s.pay.show = true;
					}
				}else{
					s.$toast(s.$t('home.invest.checkout.toast.set'));
					setTimeout(function() {
						s.$navigateTo(`/pages/my/profile/pay_password`,true);
					}, 500);
					return false;
				}
			},
			submitForm2(){
				let s = this;
				if(Number(s.form.price) > Number(s.detail.user_balance)){
					s.$toast(s.$t('home.invest.checkout.toast.sorry'));
					return false;
				}
				
				s.submit2.disabled = true;
				s.submit2.loading = true;
				
				uni.$u.http.get('/?s=App.LixibaoList_LixibaoList.TransferIntoYuebao', {
					params: s.form
				}).then(res => {
					console.log('理财产品提交');
					console.log(res);
					if(res.data.ret == 200){
						s.$toast(s.$t('home.invest.checkout.toast.success'));
						setTimeout(function() {
							s.$switchTab(`/pages/order/index`)
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
		.wallet_box{
			background: #fff;
			box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.05);
			border-radius: 15rpx;
			margin: 0 0 30rpx 0;
			display: flex;
			.item{
				width: 50%;
				text-align: center;
				padding: 60rpx 0 45rpx 0;
				.title{
					font-size: 28rpx;
					color: #000;
					font-weight: 600;
					line-height: 40rpx;
					margin: 0 0 15rpx 0;
				}
				.number{
					font-weight: 700;
					font-size: 40rpx;
					color: #D6AE40;
					line-height: 48rpx;
				}
			}
		}
		.form_box{
			background: #fff;
			box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.05);
			border-radius: 15rpx;
			margin: 0 0 30rpx 0;
			padding: 0 30rpx;
			.item{
				display: flex;
				padding: 30rpx 0;
				border-bottom: 1rpx solid #E6E6E6;
				justify-content: space-between;
				.label{
					line-height: 36rpx;
					font-weight: 400;
					color: #000;
					min-width: 50%;
				}
				.value{
					line-height: 36rpx;
					font-weight: 400;
					color: #666;
					text-align: right;
					text{
						color: #D6AE40;
						font-weight: bold;
					}
					.u-number-box{
						display: flex;
						.minus{
							height: 40rpx;
							line-height: 40rpx;
							width: 40rpx;
							text-align: center;
							border: 1rpx solid #999;
							border-radius: 6rpx;
							font-size: 24rpx;
						}
						.input_box{
							height: 40rpx;
							line-height: 40rpx;
							text-align: center;
							flex: auto;
							color: #D6AE40;
						}
						.plus{
							height: 40rpx;
							line-height: 40rpx;
							width: 40rpx;
							text-align: center;
							border: 1rpx solid #D6AE40;
							border-radius: 6rpx;
							font-size: 24rpx;
							background: #D6AE40;
							color: #fff;
						}
					}
				}
				&:last-child{
					border-bottom: none;
				}
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