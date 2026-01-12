<template>
	<view class="pages invest_index">
		<view class="content">
<!-- 			<view class="tab_title">
				<view class="item" :class="{'cur':tab_current==index}" v-for="(item,index) in tab" :key="index" @click="changeTab(index)" v-if="false">
					<text>{{item}}</text>
				</view>
			</view> -->
			<view class="tab_content">
				<view class="empty_box" v-if="list.length == 0 && done">
					<img-cache :src="require('@/static/images/empty.png')" mode="widthFix" width="300rpx"></img-cache>
					<view class="title">{{$t('common.empty_data')}}</view>
				</view>
				<view class="loading_box" v-if="done == false">
					<u-loading-icon mode="circle" :text="$t('common.loading')" font-size="24" :vertical="true"></u-loading-icon>
				</view>
				<view class="table" v-if="list.length > 0 && done">
					<view class="item item_title">
						<view class="name">{{$t('home.invest.index.fund_name')}}</view>
						<view class="period">{{$t('home.invest.index.holding_period')}}</view>
						<view class="rate">{{$t('home.invest.index.rate')}}</view>
					</view>
					<view class="item" v-for="(item,index) in list" :key="index" @click="$navigateTo('/pages/home/invest/detail?id='+item.id)">
						<view class="name">
							<view class="product_name">{{item.name}}</view>
							<!--
              <view class="progress">
								<u-line-progress :percentage="item.virtual_progre||0" height="6" activeColor="#D6AE40" inactiveColor="#DBDBDB" :showText="false"></u-line-progress>
								<view class="total">{{item.total_num||0}}</view>
							</view>
              -->
						</view>
						<view class="period">
							<view class="day">{{item.day}} day</view>
							<!--<view class="unit">{{$t('home.invest.index.until_full')}}</view>-->
						</view>
						<view class="rate">
							<view class="percent">{{item.bili}}%</view>
							<!--<view class="start">{{$t('home.invest.index.start')}} {{item.min_num}}</view>-->
							<!--<view class="total">{{$t('home.invest.index.total')}} {{$accMul(item.day,item.bili).toFixed(2)}}%</view>-->
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
				// tab:['All','Beginner','Featured','VIP'],
				// tab_current:0,
				done:false,
				limit:20,
				page:1,
				list:[],
				status: 'loading',
				type:''
			}
		},
		// watch:{
		// 	tab_current(n,o){
		// 		let s = this;
		// 		s.page = 1;
		// 		s.done = false;
		// 		s.status = 'loading';
		// 		s.getList();
		// 	}
		// },
		onLoad(e) {
			let s = this;
			if(typeof e.type != "undefined"){
				s.type = e.type;
				s.getList();
			}else{
				uni.$switchTab('/pages/home/index')
			}
		},
		onShow() {
			let s = this;
			uni.setNavigationBarTitle({
				title:s.$t('home.invest.index.navbar_title')
			})
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
			// changeTab(index){
			// 	let s = this;
			// 	if(s.done){
			// 		s.tab_current=index;
			// 	}else{
			// 		s.$toast('Do not operate too fast');
			// 	}
			// },
			getList(){
				let s = this;
				// if(s.tab_current == 0){
				// 	var type_val = s.tab_current;
				// }else{
				// 	var type_val = parseInt(s.tab_current)+1
				// }
				uni.$u.http.get('/?s=App.LixibaoList_LixibaoList.GetYuebaoListByVip', {
					params: {page: s.page,perpage:s.limit,vip:s.type}
				}).then(res => {
					console.log('获取理财产品列表');
					console.log(res);
					if(s.page == 1){
						s.list = [];
					}
					if(res.data.ret == 200 && res.data.data.length > 0){

						var result = res.data.data;
						result.forEach((item) => {
							item.time = uni.$u.timeFormat(item.addtime, 'yyyy-mm-dd');
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
				line-height: 75rpx;
				height: 75rpx;
				text-align: center;
				margin: 0 15rpx;
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
				font-size: 24rpx;
				padding: 30rpx 0;
				border-top: 1rpx solid #E6E6E6;
				.name{
					flex: auto;
					.product_name{
						line-height: 40rpx;
						font-size: 28rpx;
						margin: 0 0 15rpx 0;
						color: #000;
						font-weight: 600;
					}
					.progress{
						// display: flex;
						font-size: 20rpx;
						color: #666;
						width: 200rpx;
						.u-line-progress{
							margin: 15rpx 0 15rpx 0;
						}
						.total{
							// margin: 0 0 0 15rpx;
							line-height: 28rpx;
						}
					}
				}
				.period{
					width: 40%;
					text-align: center;
					.day{
						line-height: 40rpx;
						font-size: 28rpx;
						margin: 0 0 15rpx 0;
						color: #000;
						font-weight: 600;
					}
					.unit{
						font-size: 20rpx;
						color: #666;
					}
				}
				.rate{
					width: 20%;
					text-align: center;
					.percent{
						line-height: 40rpx;
						font-size: 28rpx;
						margin: 0 0 15rpx 0;
						color: #EA2F2F;
						font-weight: 600;
					}
					.start{
						font-size: 20rpx;
						color: #666;
					}
					.total{
						font-size: 20rpx;
						color: #666;
					}
				}
			}
			.item_title{
				color: #000;
				border-top: none;
			}
		}
	}
</style>