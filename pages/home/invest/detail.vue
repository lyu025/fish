<template>
	<view class="pages invest_detail">
		<view class="content">
			<view class="invest_box">
				<view class="item">
					<view class="box">
						<view class="name">{{detail.name}}</view>
						<view class="percent">+{{detail.bili}}%</view>
            <!--
						<view class="progress">
							<view class="percentage" :style="'width: '+detail.virtual_progre+'%'">{{detail.virtual_progre}}%</view>
							<u-line-progress :percentage="detail.virtual_progre" height="6" activeColor="#D6AE40" inactiveColor="#DBDBDB" :showText="false"></u-line-progress>
						</view>
            -->
						<view class="count" v-if="false">
							<view class="total">{{$t('home.invest.detail.total')}}: {{detail.total_num}}</view>
							<view class="overage">{{$t('home.invest.detail.overage')}}: {{detail.overage}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="guarantee_box">
				<view class="item">
					<view class="image">
						<img-cache mode="aspectFill" :src="require('@/static/images/invest/guarantee1.png')"></img-cache>
					</view>
					<view class="title">{{$t('home.invest.detail.guarantee_item1')}}</view>
				</view>
				<view class="item">
					<view class="image">
						<img-cache mode="aspectFill" :src="require('@/static/images/invest/guarantee2.png')"></img-cache>
					</view>
					<view class="title">{{$t('home.invest.detail.guarantee_item2')}}</view>
				</view>
				<view class="item">
					<view class="image">
						<img-cache mode="aspectFill" :src="require('@/static/images/invest/guarantee3.png')"></img-cache>
					</view>
					<view class="title">{{$t('home.invest.detail.guarantee_item3')}}</view>
				</view>
			</view>
			<view class="detail_box">
				<view class="item">
					<view class="title">{{$t('home.invest.detail.detail_title1')}}</view>
					<view class="description">{{detail.name}}</view>
				</view>
				<view class="item">
					<view class="title">{{$t('home.invest.detail.detail_title2')}}</view>
					<view class="description">{{detail.day}}</view>
				</view>
				<view class="item">
					<view class="title">{{$t('home.invest.detail.detail_title3')}}</view>
					<view class="description">{{detail.bili}}</view>
				</view>
        <!--
				<view class="item">
					<view class="title">{{$t('home.invest.detail.detail_title4')}}</view>
					<view class="description">{{detail.dbgs}}</view>
				</view>
				<view class="item">
					<view class="title">{{$t('home.invest.detail.detail_title5')}}</view>
					<view class="description">{{detail.calculation_rules}}</view>
				</view>
 				<view class="item">
					<view class="title">{{$t('home.invest.detail.detail_title6')}}</view>
					<view class="description">{{detail.capital_flow}}</view>
				</view>
				<view class="item">
					<view class="title">{{$t('home.invest.detail.detail_title7')}}</view>
					<view class="description">{{detail.safety_plan}}</view>
				</view>
				-->
				<u-button type="primary" color="#D6AE40" :text="$t('home.invest.detail.detail_button')"  :customStyle="{'font-size':'32rpx','margin':'60rpx 0 0 0'}" @click="$navigateTo('/pages/home/invest/checkout?id='+detail.id)"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading:'',
				detail:''
			}
		},
		onLoad(e) {
			let s = this;
			if(typeof e.id != "undefined"){
				s.getDetail(parseInt(e.id));
			}else{
				s.$redirectTo('/pages/home/invest/index')
			}
		},
		onShow() {
			let s = this;
			uni.setNavigationBarTitle({
				title:s.$t('home.invest.detail.navbar_title')
			})
		},
		methods: {
			getDetail(id){
				let s = this;
				uni.$u.http.get('/?s=App.LixibaoList_LixibaoList.GetYuebaoListDetails', {
					params: {lxb_list_id: id}
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		padding: 30rpx 30rpx 0 30rpx;
		.invest_box{
			background: #fff;
			box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.05);
			border-radius: 15rpx;
			margin: 0 0 30rpx 0;
			.item{
				background: #fff;
				border-radius: 15rpx;
				.box{
					text-align: center;
					border-radius: 15rpx;
					padding: 30rpx;
					margin: 0 0 30rpx 0;
					.name{
						font-weight: 600;
						color: #000;
						line-height: 40rpx;
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
		.guarantee_box{
			display: flex;
			padding: 60rpx 30rpx;
			background: #FFFFFF;
			box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.05);
			border-radius: 15rpx;
			margin: 0 0 30rpx 0;
			.item{
				text-align: center;
				width: 33.333%;
				.image{
					width: 72rpx;
					height: 72rpx;
					overflow: hidden;
					margin: 0 0 15rpx 0;
					display: inline-block;
					.img-cache{
						width: 72rpx;
						height: 72rpx;
						overflow: hidden;
					}
				}
				.title{
					font-size: 28rpx;
					color: #000;
					line-height: 40rpx;
				}
			}
		}
		.detail_box{
			background: #FFFFFF;
			box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.05);
			border-radius: 15rpx 15rpx 0 0;
			padding: 30rpx;
			.item{
				border-bottom: 1rpx solid  #E6E6E6;
				padding: 30rpx 0;
				.title{
					font-weight: 600;
					font-size: 28rpx;
					color: #000;
					line-height: 40rpx;
					margin: 0 0 15rpx 0;
				}
				.description{
					line-height: 34rpx;
					font-size: 24rpx;
				}
				&:last-child{
					border-bottom: none;
				}
			}
		}
	}
</style>