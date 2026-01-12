<template>
	<view class="pages my_browser">
		<view class="content">
			<web-view :webview-styles="webviewStyles" :src="url"></web-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:'',
				webviewStyles: {
					progress: {
						color: '#292D78'
					}
				}
			}
		},
		onLoad(e) {
			let s = this;
			uni.setNavigationBarTitle({
				title:s.$t('my.browser.navbar_title')
			})
			console.log(e.url);
			if(typeof e.url != "undefined"){
				s.url = e.url;
			}else{
				s.$toast(s.$t('my.browser.toast.illegal_operation'));
				setTimeout(function() {
					uni.navigateBack();
				}, 1000);
			}
		}
	}
</script>

<style lang="scss">
	
</style>