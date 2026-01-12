<template>
	<view class="pages my_country_code">
		<view class="loading_box" v-if="loading">
			<u-loading-icon :text="$t('common.loading')" mode="circle" :vertical="true" timing-function="linear" color="#D6AE40" textSize="12" textColor="#D6AE40"></u-loading-icon>
		</view>
		<view class="content" v-if="loading == false">
			<scroll-view :scroll-into-view="current" scroll-y="true" class="list" :scroll-with-animation="true">
				<view id="goSearch" v-if="search != ''">
					<view class="list_title">{{$t('my.country.search')}}</view>
					<view class="list_content" v-if="list_search.length>0">
						<view v-if="list_search.length>0" class="list2" v-for="(item2,index2) in list_search" :key="index2" @click="selectThis(item2)">
							<img-cache class="flag" :src="item2.flag" mode="scaleToFill"></img-cache>
							<view class="name">{{item2.en}}</view>
							<view class="code">(+{{item2.tel}})</view>
						</view>
					</view>
					<view class="list_content" v-else>
						<view class="list2">
							<view class="empty">{{$t('common.empty_data')}}</view>
						</view>
					</view>
				</view>
				<view id="goNow" v-if="now != '' && search == '' && false">
					<view class="list_title">{{$t('my.country.current')}}</view>
					<view class="list_content">
						<view class="list2">
							<img-cache class="flag" :src="now.flag" mode="scaleToFill"></img-cache>
							<view class="name">{{now.en}}</view>
							<view class="code">(+{{now.tel}})</view>
						</view>
					</view>
				</view>
				<view v-for="(item,index) in list" :key="index"  :id="'go'+index" v-if="item.length>0 && search == ''">
					<view class="list_title">{{index}}</view>
					<view class="list_content">
						<view class="list2" v-for="(item2,index2) in item" :key="index2" @click="selectThis(item2)">
							<img-cache class="flag" :src="item2.flag" mode="scaleToFill"></img-cache>
							<view class="name">{{item2.en}}</view>
							<view class="code">(+{{item2.tel}})</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="index" v-if="loading == false && search.length==0">
			<view class="list" v-for="(item,index) in list" :key="index" @click="goList(index)" v-if="item.length>0">{{index}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				done:false,
				loading:true,
				current:'',
				now:'',
				search:'',
				list_search:[],
				list:{
					A:[],
					B:[],
					C:[],
					D:[],
					E:[],
					F:[],
					G:[],
					H:[],
					I:[],
					J:[],
					K:[],
					L:[],
					M:[],
					N:[],
					O:[],
					P:[],
					Q:[],
					R:[],
					S:[],
					T:[],
					U:[],
					V:[],
					W:[],
					X:[],
					Y:[],
					Z:[]
				}
			}
		},
		onLoad() {
			let s = this;
			  uni.setNavigationBarTitle({
				title:s.$t('my.country.navbar_title')
			  })
			if(uni.getStorageSync('country_code')){
				s.now = uni.getStorageSync('country_code');
			}
			s.getList();
		},
		onNavigationBarSearchInputConfirmed(e) {
			let s = this;
			s.search = e.text;
			s.loading = true;
			s.getList();
		},
		methods: {
			getList(){//获取国家码列表
				let s = this;
				if(s.done){
					return false;
				}
				s.done = true;
				s.list_search = [];
				s.list = {
					A:[],
					B:[],
					C:[],
					D:[],
					E:[],
					F:[],
					G:[],
					H:[],
					I:[],
					J:[],
					K:[],
					L:[],
					M:[],
					N:[],
					O:[],
					P:[],
					Q:[],
					R:[],
					S:[],
					T:[],
					U:[],
					V:[],
					W:[],
					X:[],
					Y:[],
					Z:[]
				};
				uni.$u.http.get('/?s=App.ConfigData_ConfigData.GetCountryCode').then(res => {
					console.log('获取国家码列表');
					console.log(res);
					let results = res.data.data;
					results.forEach((item) => {
						var first = (item.en).substr(0,1);
						first = first.toUpperCase();
						item.value = item.tel;
						if(s.search){
							var search = s.search;search = search.replace('+','');
							if((item.en).search(search) != -1 || (item.tel).search(search) != -1){
								s.list_search.push(item);
							}
						}else{
							s.list[first].push(item);
						}
					})
					setTimeout(function() {
						s.done = false;
						s.loading = false;
					}, 100);
				})
			},
			goList(index){//点击索引跳转到指定区域
				let s = this;
				s.current = 'go'+index;
				console.log(s.current);
			},
			selectThis(item){//选中并返回
				let s = this;
				uni.setStorageSync('country_code',item);
				setTimeout(function() {
					uni.navigateBack();
				}, 100);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		.list{
			/*#ifdef H5*/
			height: calc(100vh - 44px);
			/*#endif*/
			/*#ifdef APP-PLUS*/
			height: 100vh;
			/*#endif*/
			overflow-x: hidden;
			overflow-y: auto;
			.list_title{
				height: 72rpx;
				line-height: 72rpx;
				background: #fff;
				padding: 0 30rpx;
				border-top: 2rpx solid #eee;
				font-weight: bold;
				color: #D6AE40;
			}
			.list_content{
				.list2{
					display: flex;
					border-top: 2rpx solid #eee;
					padding: 0 30rpx;
					height: 72rpx;
					line-height: 72rpx;
					.flag{
						background: #fff;
						width: 30rpx;
						height: 21rpx;
						display: inline-block;
						margin: 26rpx 0 0 0;
					}
					.name{
						margin: 0 0 0 15rpx;
					}
					.code{
						margin: 0 0 0 15rpx;
						color: #D6AE40;
					}
				}
			}
		}
	}
	.index{
		position: fixed;
		right: 30rpx;
		bottom: 90rpx;
		display: flex;
		flex-direction: column;
		z-index: 9;
		.list{
			margin: 15rpx 0 0 0;
			width: 30rpx;
			text-align: center;
			color: #000;
			&:hover{
				color: #D6AE40;
			}
			&:active{
				color: #D6AE40;
			}
		}
	}
</style>