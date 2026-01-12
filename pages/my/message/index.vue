<template>
	<view class="pages my_message_index">
		<view class="empty_box" v-if="list.length == 0 && done">
			<img-cache :src="require('@/static/images/empty.png')" mode="widthFix" width="300rpx"></img-cache>
			<view class="title">{{$t('common.empty_data')}}</view>
		</view>
		<view class="loading_box" v-if="done == false">
			<u-loading-icon mode="circle" :text="$t('common.loading')" font-size="24" :vertical="true"></u-loading-icon>
		</view>
		<view class="list" v-if="list.length > 0 && done">
			<view class="item" v-for="(item,index) in list" :key="index" @click="goDetail(item)">
				<view class="title">{{item.title}}</view>
			</view>
		</view>
		<view class="loadmore_box" v-if="list.length>0 && done">
			<u-loadmore :status="status" :loading-text="$t('common.loadmore.loading')" :loadmore-text="$t('common.loadmore.loadmore')" :nomore-text="$t('common.loadmore.nomore')" loadingIcon="semicircle" />
		</view>
		
		<u-popup :show="popup.show" :round="15" mode="center" @close="popup.show=false">
			<view class="popup_box">
				<view class="title">{{popup.item.title}}</view>
				<view class="content">{{popup.item.content}}</view>
				<view class="close" @click="popup.show=false">{{$t('home.index.template.close')}}</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				popup:{
					show:false,
					item:''
				},
				done:false,
				limit:20,
				page:1,
				list:[],
				status: 'loading'
			}
		},
		onLoad() {
			let s = this;
			uni.setNavigationBarTitle({
				title:this.$t('my.message.index.navbar_title')
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
			goDetail(item){
				let s = this;
				s.popup.item = item;
				s.popup.show = true;
			},
			getList(){
				let s = this;
				uni.$u.http.post('/?s=App.Message_Message.GetStationMessageList',{}, {
					params: {page: s.page,perpage:s.limit}
				}).then(res => {
					console.log(`获取记录`);
					console.log(res);
					if(s.page == 1){
						s.list = [];
					}
					if(res.data.ret == 200 && res.data.data.length > 0){
		
						var result = res.data.data;
						result.forEach((item) => {
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
	.list{
		padding: 30rpx 30rpx 0 30rpx;
		.item{
			background: #FFFFFF;
			box-shadow: 0px 7.5rpx 15rpx 0 rgba(0,0,0,0.05);
			border-radius: 15rpx;
			margin: 0 0 30rpx 0;
			padding: 30rpx;
			color: #000;
			font-weight: 400;
		}
	}
	.popup_box{
		background: #fff;
		border-radius: 30rpx;
		text-align: center;
		width: 520rpx;
		.title{
			font-size: 32rpx;
			line-height: 48rpx;
			color: #000;
			font-weight: 600;
			padding: 30rpx 30rpx 0 30rpx;
		}
		.content{
			line-height: 36rpx;
			color: #666;
			font-weight: 400;
			padding: 30rpx;
		}
		.close{
			font-size: 32rpx;
			color: #D6AE40;
			font-weight: 600;
			line-height: 80rpx;
			height: 80rpx;
			border-top: 1rpx solid #E6E6E6;
		}
	}
</style>