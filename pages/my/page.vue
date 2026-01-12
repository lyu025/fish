<template>
	<view class="pages my_page">
		<view class="content" v-if="detail" v-html="detail.content"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail: null,
			};
		},
		onLoad(e) {
			let s = this;
			uni.setNavigationBarTitle({
				title:s.$t('my.page.navbar_title')
			})
			if(typeof e.type != "undefined"){
				s.getDetail(e.type);
			}else{
				
			}
		},
		methods: {
			getDetail(typename){
				let s = this;
				uni.setNavigationBarTitle({
					title:s.$t('common.loading')
				})
				if(typename == 'notice'){
					var type2 = 1;
				}else if(typename == 'about'){
					var type2 = 2;
				}else if(typename == 'rule'){
					var type2 = 3;
				}else if(typename == 'agent'){
					var type2 = 4;
				}else if(typename == 'faq'){
					var type2 = 5;
				}else if(typename == 'user_agreement'){
					var type2 = 1;
				}
				uni.$u.http.get('/?s=App.Message_Message.GetMessageDetail',{params: {type: type2}}).then(res => {
					console.log('页面信息');
					console.log(res);
					if(res.data.ret == 200){
						s.detail = res.data.data;
						uni.setNavigationBarTitle({
							title:res.data.data.title
						})
					}else{
						s.$toast(res.data.msg);
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		padding: 30rpx;
	}
</style>
