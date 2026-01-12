<template>
	<view class="pages about_index">
		<view class="tab_title">
			<view class="item" :class="{'cur':tab_current==index}" v-for="(item,index) in tab" :key="index" @click="tab_current=index">
				<text>{{item.title}}</text>
			</view>
		</view>
		<view class="empty_box" v-if="tab[0].content=='' && done">
			<img-cache :src="require('@/static/images/empty.png')" mode="widthFix" width="300rpx"></img-cache>
			<view class="title">{{$t('common.empty_data')}}</view>
		</view>
		<view class="loading_box" v-if="done == false">
			<u-loading-icon mode="circle" :text="$t('common.loading')" :vertical="true"></u-loading-icon>
		</view>
		<view class="tab_content" v-if="tab[0].content!='' && done" v-html="tab[tab_current].content"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				done:false,
				tab:[
					{
						title:'Info',
						content:''
					},
					{
						title:'Agency',
						content:''
					},
					{
						title:'Rule',
						content:''
					}
				],
				tab_current:0
			}
		},
		onLoad() {
			let s = this;
			s.getAbout();
		},
		methods: {
			getAbout(){
				let s = this;
				uni.$u.http.get('/?s=App.ConfigData_ConfigData.AboutUs').then(res => {
					console.log('关于我们');
					console.log(res);
					if(res.data.ret == 200){
						s.tab[0].content = res.data.data.about_us.content;
						s.tab[1].content = res.data.data.agency_cooperation.content;
						s.tab[2].content = res.data.data.rule_description.content;
						s.done = true;
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tab_title{
		display: flex;
		justify-content: space-between;
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
			width: 33.333%;
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
		padding: 30rpx;
		/*#ifdef APP-PLUS*/
		min-height: calc(100vh - 75rpx);
		/*#endif*/
		/*#ifdef H5*/
		min-height: calc(100vh - 323rpx);
		/*#endif*/
	}
</style>