<template>
	<view class="pages my_profile_index">
		<view class="content">
			<view class="menu_box">
				<view class="item">
					<view class="label">{{$t('my.profile.system_account')}}</view>
					<view class="value">{{user.username}}</view>
				</view>
				<view class="item" v-if="false">
					<view class="label">{{$t('my.profile.mobile_number')}}</view>
					<view class="value">{{user.username}}<</view>
				</view>
				<view class="item" @click="$navigateTo(`/pages/my/address/index`,true)">
					<view class="label">{{$t('my.profile.add_address')}}</view>
					<view class="value">
						<text class="iconfont icon-arrowright"></text>
					</view>
				</view>
				<view class="item" @click="$navigateTo(`/pages/my/profile/password`,true)">
					<view class="label">{{$t('my.profile.password_management')}}</view>
					<view class="value">
						<text class="iconfont icon-arrowright"></text>
					</view>
				</view>
				<view class="item" @click="$navigateTo(`/pages/my/profile/pay_password`,true)">
					<view class="label">{{$t('my.profile.payment_password_management')}}</view>
					<view class="value">
						<text class="iconfont icon-arrowright"></text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user:''
			}
		},
		onLoad() {
			let s = this;
      uni.setNavigationBarTitle({
        title:s.$t('my.profile.navbar_title')
      })
			s.user = uni.getStorageSync('user');
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.content{
		padding: 30rpx;
		.menu_box{
			ackground: #FFFFFF;
			box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.05);
			border-radius: 15rpx;
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
				}
				&:last-child{
					border-bottom: none;
				}
			}
		}
	}
</style>