<template>
	<view class="pages my_wallet_index">
		<view class="content">
			<view class="tab_title">
				<view class="item" :class="{'cur':tab_current==index}" v-for="(item,index) in tab" :key="index" @click="changeTab(index)">
					<text>{{item}}</text>
				</view>
			</view>
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
						<view class="left">
							<view class="time">{{item.time}}</view>
							<view class="balance">{{$t('my.wallet.index.balance')}}: ${{item.balance||0}}</view>
							<view class="reason" v-if="item.reason && tab_current==2">{{item.reason}}</view>
						</view>
						<view class="right">
							<view class="price">
								<text v-if="(item.status==2 && tab_current==0) || tab_current==2">-</text>
								${{item.num}}
							</view>
							<view class="remark" v-if="tab_current==0">
								<text v-if="item.type==1">{{$t('my.wallet.index.type0.status1')}}</text>
								<text v-else-if="item.type==6">{{$t('my.wallet.index.type0.status6')}}</text>
								<text v-else-if="item.type==7">{{$t('my.wallet.index.type0.status7')}}</text>
								<text v-else-if="item.type==21">{{$t('my.wallet.index.type0.status21')}}</text>
								<text v-else-if="item.type==22">{{$t('my.wallet.index.type0.status22')}}</text>
								<text v-else-if="item.type==23">{{$t('my.wallet.index.type0.status23')}}</text>
								<text v-else-if="item.type==29">{{$t('my.wallet.index.type0.status29')}}</text>
								<text v-else-if="item.type==30">{{$t('my.wallet.index.type0.status30')}}</text>
								<text v-else-if="item.type==31">{{$t('my.wallet.index.type0.status31')}}</text>
								<text v-else-if="item.type==32">{{$t('my.wallet.index.type0.status32')}}</text>
								<text v-else-if="item.type==33">{{$t('my.wallet.index.type0.status33')}}</text>
								<text v-else-if="item.type==36">{{$t('my.wallet.index.type0.status36')}}</text>
								<text v-else>{{$t('my.wallet.index.type0.status0')}}</text>
							</view>
							<view class="remark" v-else-if="tab_current==1">
								<text v-if="item.status==1">{{$t('my.wallet.index.type1.status1')}}</text>
								<text v-else-if="item.status==2">{{$t('my.wallet.index.type1.status2')}}</text>
								<text v-else-if="item.status==3">{{$t('my.wallet.index.type1.status3')}}</text>
								<text v-else-if="item.status==4">{{$t('my.wallet.index.type1.status4')}}</text>
								<text v-else>{{$t('my.wallet.index.type1.status0')}}</text>
							</view>
							<view class="remark" v-else-if="tab_current==2">
								<text v-if="item.status==1">{{$t('my.wallet.index.type2.status1')}}</text>
								<text v-else-if="item.status==2">{{$t('my.wallet.index.type2.status2')}}</text>
								<text v-else-if="item.status==3">{{$t('my.wallet.index.type2.status3')}}</text>
							</view>
						</view>
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
				tab:[
          this.$t('my.wallet.index.all'),
          this.$t('my.wallet.index.deposit'),
          this.$t('my.wallet.index.withdrawal')
        ],
				tab_current:0,
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
        title:s.$t('my.wallet.index.navbar_title')
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
			changeTab(index){
				let s = this;
				if(s.done){
					s.tab_current=index;
				}else{
					s.$toast('Do not operate too fast');
				}
			},
			getList(){
				let s = this;
				uni.$u.http.post('/?s=App.User_User.GetUserFundingDetails',{}, {
					params: {page: s.page,perpage:s.limit,type:s.tab_current}
				}).then(res => {
					console.log(`获取资金明细`);
					console.log(res);
					if(s.page == 1){
						s.list = [];
					}
					if(res.data.ret == 200 && res.data.data.length > 0){

						var result = res.data.data;
						result.forEach((item) => {
							if(s.tab_current==1){
								item.time = uni.$u.timeFormat(item.endtime, 'yyyy-mm-dd hh:MM:ss');
							}else{
								item.time = uni.$u.timeFormat(item.addtime, 'yyyy-mm-dd hh:MM:ss');
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
		padding: 0 30rpx;
		.tab_title{
			display: flex;
			justify-content: space-between;
			margin: 0 0 30rpx 0;
			position: sticky;
			/*#ifdef APP-PLUS*/
			top:0;
			/*#endif*/
			/*#ifdef H5*/
			top:44px;
			/*#endif*/
			background: #FAFAFA;
			z-index: 9;
			.item{
				width: 33.333%;
				line-height: 75rpx;
				height: 75rpx;
				text-align: center;
				text{
					line-height: 75rpx;
					height: 75rpx;
					display: inline-block;
					color: #666;
					border-bottom: 2rpx solid rgba(0,0,0,0);
					font-weight: 600;
				}
			}
			.cur{
				text{
					color: #000;
					border-bottom: 2rpx solid #000;
				}
			}
		}
		.tab_content{
			background: #fff;
			border-radius: 15rpx;
			padding: 0 30rpx 30rpx 30rpx;
			box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.05);
			.item{
				display: flex;
				justify-content: space-between;
				padding: 30rpx 0;
				border-bottom: 1rpx solid #E6E6E6;
				.left{
					.time{
						font-size: 24rpx;
						font-weight: 400;
						color: #999;
						line-height: 34rpx;
						margin: 0 0 15rpx 0;
					}
					.balance{
						line-height: 44rpx;
						font-size: 32rpx;
						font-weight: 600;
						color: #000;
					}
					.reason{
						color: #f00;
						line-height: 36rpx;
						white-space: pre-wrap;
						word-break: break-all;
					}
				}
				.right{
					text-align: right;
					.price{
						line-height: 44rpx;
						font-size: 32rpx;
						font-weight: 700;
						color: #EA2F2F;
						margin: 0 0 15rpx 0;
					}
					.remark{
						font-size: 24rpx;
						font-weight: 400;
						color: #999;
						line-height: 34rpx;
					}
				}
			}
		}
	}
</style>