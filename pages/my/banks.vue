<template>
	<view class="pages app-bank">
		<view class="loading_box" v-if="loading">
			<u-loading-icon :text="$t('common.loading')" mode="circle" :vertical="true" timing-function="linear" color="#D6AE40" textSize="12" textColor="#D6AE40"></u-loading-icon>
		</view>
		<view class="content" v-if="loading == false">
			<scroll-view :scroll-into-view="current" scroll-y="true" class="list" :scroll-with-animation="true">
				<view id="goSearch" v-if="search != ''">
					<view class="list_title">{{$t('my.banks.search')}}</view>
					<view class="list_content" v-if="list_search.length>0">
						<view v-if="list_search.length>0" class="list2" v-for="(v,i) in list_search" :key="i" @click="selectThis(v)">
							<view class="name">{{v}}</view>
						</view>
					</view>
					<view class="list_content" v-else>
						<view class="list2">
							<view class="empty">{{$t('common.empty_data')}}</view>
						</view>
					</view>
				</view>
				<view id="goNow" v-if="now != '' && search == '' && false">
					<view class="list_title">{{$t('my.banks.current')}}</view>
					<view class="list_content">
						<view class="list2">
							<view class="name">{{now}}</view>
						</view>
					</view>
				</view>
				<view v-for="(v,i) in list" :key="i"  :id="'go'+i" v-if="v.length>0 && search == ''">
					<view class="list_title">{{i}}</view>
					<view class="list_content">
						<view class="list2" v-for="(vv,ii) in v" :key="ii" @click="selectThis(vv)">
							<view class="name">{{vv}}</view>
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
          A: ['Agri Bank', 'AB Bank', 'ACB'],
          B: ['BIDV', 'Bac A Bank', 'BAOVIET Bank'],
          C: ['CB Bank'],
          D: ['Dong A Bank'],
          E: ['Exim bank'],
          F: ['First Bank'],
          G:[],
          H: ['HD Bank'],
          I:[],
          J:[],
          K: ['KienLong Bank'],
          L: ['LienVietPost Bank'],
          M: ['MSB', 'MB Bank'],
          N: ['Nam A Bank', 'NCB'],
          O: ['Ocean Bank'],
          P: ['PG Bank', 'PVcom Bank'],
          Q:[],
          R:[],
          S: ['Sacom Bank', 'SHB', 'Shinhan Bank', 'SCB', 'SeABank', 'Standard Chartered', 'Saigonbank'],
          T: ['TPBank', 'TechcomBank'],
          U: ['UOB'],
          V: ['Vietcom Bank', 'Vietin Bank', 'VPBank', 'VIB', 'Viet Bank', 'Viet Capital Bank', 'VIETABANK', 'VBSP', 'VDB'],
          W: ['Woori Bank'],
          X:[],
          Y:[],
          Z:[]
        }
			}
		},
		onLoad() {
			let s = this;
      uni.setNavigationBarTitle({title:s.$t('my.banks.navbar_title')})
			if(uni.getStorageSync('bank_code')) s.now = uni.getStorageSync('bank_code');
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
				let s = this, list = s.list;
				if(s.done) return false;
				s.done = true;
				s.list_search = [];
        let search = s.search;
        for(let i in list) for(let v of list[i]) if(search && v.search(search) != -1) s.list_search.push(v);
        setTimeout(function() {
          s.done = false;
          s.loading = false;
        }, 100);
			},
			goList(index){//点击索引跳转到指定区域
				let s = this;
				s.current = 'go'+index;
			},
			selectThis(item){//选中并返回
				let s = this;
				uni.setStorageSync('bank_code',item);
				setTimeout(uni.navigateBack, 100);
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