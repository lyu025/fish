<template>
	<view class="pages my_invite">
		<view class="image">
			<img-cache mode="aspectFill" :src="require('@/static/images/my/invite.jpg')"></img-cache>
		</view>
		<view class="content" v-if="invite">
			<view class="info">
				<h3>{{$t('my.invite.text7')}}: <br />{{invite.invite_code}}</h3>
			</view>
			<view class="qrcode">
				<uqrcode ref="uQRCode" :size="86" :text="invite.invite_link" />
			</view>
		</view>
		<view class="button_box" v-if="invite">
			<u-button type="primary" color="#D6AE40" :text="$t('my.invite.text6')"  :customStyle="{'font-size':'32rpx'}" @click="$copy(invite.invite_link,$t('my.invite.toast.success'))"></u-button>
		</view>
	</view>
</template>

<script>
	//#ifdef H5
	import h5Copy from '@/common/utils/junyi-h5-copy.js'
	//#endif
	export default {
		data() {
			return {
				invite:''
			}
		},
		onLoad() {
			let s = this;
			uni.setNavigationBarTitle({
				title:this.$t('my.invite.navbar_title')
			})
			s.getInvite();
		},
		methods: {
			getInvite(){
				let s = this;
				uni.$u.http.post('/?s=App.User_User.GetUserAgentlinkInfo').then(res => {
					console.log('服务信息');
					console.log(res);
					if(res.data.ret == 200){
						s.invite = res.data.data;
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.image{
		width: 100%;
		height: 690rpx;
		background: #eee;
		overflow: hidden;
		margin: 0 30rpx 0 0;
		position: relative;
		z-index: 1;
		.img-cache{
			width: 100%;
			height: 690rpx;
			overflow: hidden;
		}
	}
	.content{
		padding: 60rpx 60rpx 30rpx 60rpx;
		display: flex;
		justify-content: space-between;
		margin-top: -90rpx;
		position: relative;
		z-index: 3;
		background: #FAFAFA;
		border-radius: 30rpx 30rpx 0 0;
		.info{
			font-weight: 600;
			color: #000;
			font-size: 32rpx;
			line-height: 44rpx;
			margin: 15rpx 15rpx 0 0;
			h3{
				margin: 0 0 30rpx 0;
			}
		}
		.qrcode{
			background: #fff;
			border: 15rpx solid #E6E6E6;

		}
	}
	.button_box{
		padding: 30rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		width: calc(100% - 60rpx);
	}
</style>