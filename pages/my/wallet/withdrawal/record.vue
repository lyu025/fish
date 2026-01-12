<template>
	<view class="pages my_wallet_withdrawal_record">
		<view class="content">
			<view class="empty_box" v-if="list.length == 0 && done">
				<img-cache :src="require('@/static/images/empty.png')" mode="widthFix" width="300rpx"></img-cache>
				<view class="title">{{$t('common.empty_data')}}</view>
			</view>
			<view class="tab_content">
				<view class="loading_box" v-if="done == false">
					<u-loading-icon mode="circle" :text="$t('common.loading')" font-size="24" :vertical="true"></u-loading-icon>
				</view>
				<view class="list_box" v-if="list.length > 0 && done">
					<view class="item" v-for="(item,index) in list" :key="index">
						<view class="status">
							<text v-if="item.status==1">{{$t('my.wallet.withdraw.record.status.status1')}}</text>
							<text v-else-if="item.status==2">{{$t('my.wallet.withdraw.record.status.status2')}}</text>
							<text v-else-if="item.status==3">{{$t('my.wallet.withdraw.record.status.status3')}}</text>
						</view>
						<p>{{$t('my.wallet.withdraw.record.withdraw_amount')}}:<b>-${{item.num}}</b></p>
						<p>{{$t('my.wallet.withdraw.record.withdraw_card')}}:<b>{{item.address}}</b></p>
						<p>{{$t('my.wallet.withdraw.record.withdraw_time')}}:<b>{{item.time}}</b></p>
						<p class="reason" v-if="item.reason">{{item.reason}}</p>
					</view>
				</view>
			</view>
			<view class="loadmore_box" v-if="list.length>0 && done">
				<u-loadmore :status="status" :loading-text="$t('common.loadmore.loading')" :loadmore-text="$t('common.loadmore.loadmore')" :nomore-text="$t('common.loadmore.nomore')" loadingIcon="semicircle" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				done:false,
				limit:20,
				page:1,
				list:[],
				status: 'loading'
			}
		},
		watch:{
			tab_current(n,o){
				let s = this;
				s.page = 1;
				s.done = false;
				s.status = 'loading';
				s.getList();
			}
		},
		onLoad() {
			let s = this;
      uni.setNavigationBarTitle({
        title:s.$t('my.wallet.withdraw.record.navbar_title')
      })
			s.getList();
		},
		onPullDownRefresh() {
			let s = this;
			s.page = 1;
			s.status = 'loading';
			s.getList();
		},
		onReachBottom(){
			let s = this;
			if (s.status !== 'loadmore') {
				return;
			}
			s.status = 'loading';
			s.getList();
		},
		methods: {
			getList(){
				let s = this;
				uni.$u.http.post('/?s=App.Recharge_Recharge.GetUserWithdrawallog',{}, {
					params: {page: s.page,perpage:s.limit}
				}).then(res => {
					console.log(`获取提现记录`);
					console.log(res);
					if(s.page == 1){
						s.list = [];
					}
					if(res.data.ret == 200 && res.data.data.length > 0){

						var result = res.data.data;
						result.forEach((item) => {
							if(typeof item.addtime != "undefined"){
								if(item.addtime>0){
									item.time = uni.$u.timeFormat(item.addtime, 'yyyy-mm-dd hh:MM:ss');
								}else{
									item.time = '0';
								}
							}else{
								item.time = 'undefined';
							}
							
							s.list.push(item);
						});

						if(result.length < s.limit){
							s.status = 'nomore';
						}else{
							s.status = 'loadmore';
						}

					}else{
						s.status = 'nomore';
					}
          uni.stopPullDownRefresh();
					s.done = true;
					s.page++;
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		padding: 30rpx;
		.tab_content{
			.item{
				background: #fff;
				border-radius: 15rpx;
				margin: 0 0 30rpx 0;
				font-size: 24rpx;
				padding: 30rpx;
				box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.05);
				position: relative;
				.status{
					position: absolute;
					top: 30rpx;
					right: 30rpx;
					line-height: 34rpx;
					text{
						color: #D6AE40;
					}
				}
				p{
					margin: 0 0 15rpx 0;
					font-size: 24rpx;
					color: #999;
					line-height: 34rpx;
					font-weight: 400;
					b{
						font-weight: 700;
						color: #000;
						margin: 0 0 0 7.5rpx;
					}
					&:last-child{
						margin: 0;
					}
				}
			}
		}
	}
	.loadmore_box{
		padding: 0;
	}
	
	.reason{
		color: #f00;
		line-height: 36rpx;
		white-space: pre-wrap;
		word-break: break-all;
	}
</style>