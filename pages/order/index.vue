<template>
	<view class="pages my_order_index">
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
						<view class="info">
              <!--
 							<view class="image">
								<img-cache mode="aspectFill" :src="item.img"></img-cache>
							</view>
							-->
							<view class="description">
								<h2>{{item.name}}</h2>
								<p>{{$t('order.index.template.total_order_amount')}}:{{item.total_order_amount}}</p>
								<p>{{$t('order.index.template.daily_commission')}}:<text>{{item.daily_commission}}</text></p>
								<p>{{$t('order.index.template.total_return')}}:<text>{{item.total_return}}</text></p>
							</view>
							<view class="status">
								<text v-if="item.is_qu==1">{{$t('order.index.template.completed')}}</text>
								<text v-else>{{$t('order.index.template.pending')}}</text>
							</view>
						</view>
						<view class="more">
							<view class="time">{{$t('order.index.template.order_times')}}:<b>{{item.order_time}}</b></view>
							<view class="time">{{$t('order.index.template.end_time')}}:<b>{{item.end_time}}</b></view>
							<!--<view class="time">{{$t('order.index.template.order_number')}}:<b>{{item.sn}}</b></view>-->
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
					this.$t('order.index.data.tab[0]'),
					this.$t('order.index.data.tab[1]'),
					this.$t('order.index.data.tab[2]')
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
			s.$setTabBarI18n();
		},
		onShow() {
			let s = this;
			s.getList();
			uni.setNavigationBarTitle({
				title:s.$t('order.index.navbar_title')
			})
			if(uni.getStorageSync('token')){}else{
				s.$redirectTo('/pages/my/login')
			}
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
					s.$toast(s.$t('order.index.toast.fast'));
				}
			},
			getList(){
				let s = this;
				uni.$u.http.post('/?s=App.User_User.OrderList',{}, {
					params: {page: s.page,perpage:s.limit,status:parseInt(s.tab_current)+1}
				}).then(res => {
					console.log(`获取我的订单列表`);
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
			.item{
				background: #fff;
				border-radius: 15rpx;
				margin: 0 0 30rpx 0;
				font-size: 24rpx;
				padding: 30rpx;
				box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.05);
				.info{
					display: flex;
					padding-bottom: 30rpx;
					border-bottom: 1rpx solid #E6E6E6;
					margin: 0 0 30rpx 0;
					justify-content: space-between;
					.image{
						width: 160rpx;
						height: 160rpx;
						background: #eee;
						border-radius: 15rpx;
						overflow: hidden;
						margin: 0 30rpx 0 0;
						.img-cache{
							width: 160rpx;
							height: 160rpx;
							border-radius: 15rpx;
							overflow: hidden;
						}
					}
					.description{
						margin: 0 30rpx 0 0;
						h2{
							font-size: 28rpx;
							line-height: 40rpx;
							color: #000;
							margin: 0 0 7.5rpx 0;
							font-weight: 600;
						}
						p{
							color: #999;
							font-weight: 400;
							font-size: 24rpx;
							line-height: 28rpx;
							text{
								color: #EA2F2F;
								font-weight: 700;
								margin: 0 0 0 7.5rpx;
							}
						}
					}
					.status{
						text-align: right;
						text{
							color: #D6AE40;
						}
					}
				}
				.more{
					.time{
						margin: 15rpx 0 0 0;
						font-size: 24rpx;
						color: #999;
						line-height: 34rpx;
						font-weight: 400;
						b{
							font-weight: 700;
							color: #000;
							margin: 0 0 0 7.5rpx;
						}
					}
				}
			}
		}
	}
</style>