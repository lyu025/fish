<template>
	<view class="pages my_address_detail">
		<view class="content">
			<view class="form">
				<u--form labelPosition="top" ref="form1" :model="form" :rules="rules">
					<u-form-item label="" labelWidth="100%" prop="name" ref="item1">
						<u--input v-model="form.name" type="text" :placeholder="$t('my.forget.form.name_placeholder')" ></u--input>
					</u-form-item>
					<u-form-item label="" prop="mobile" class="item">
						<u-input v-model="form.mobile" type="number" :placeholder="$t('my.forget.form.mobile_placeholder')"  fontSize="16px" class="input" maxlength="30">
							<template slot="prefix">
								<text @click="$navigateTo(`/pages/my/country`)">+{{nation_code}}</text>
							</template>
						</u-input>
					</u-form-item>
				</u--form>
				<u-button
					size="normal"
					type="primary"
					:text="$t('my.usdt.detail.button.submit')"
					color="#D6AE40"
					:loading="submit.loading"
					:disabled="submit.disabled"
					@click="submitForm"
					:customStyle="{'margin':'30rpx 0 0 0'}"
				></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type:'add',
				nation_code:'84',
				form:{
					name:'',
					mobile:''
				},
				rules:{
					name: [
						{
							type: 'string',
							required: true,
							message: this.$t('my.forget.data.rules.name.message0'),
							trigger: ['blur', 'change']
						}
					],
					mobile: [
						{
							required: true,
							message: this.$t('my.forget.data.rules.mobile.message0'),
							trigger: ['change','blur']
						},
						{
							pattern: /^[0-9]*$/g,
							transform(value) {
								return String(value);
							},
							message: this.$t('my.forget.data.rules.mobile.message1'),
							trigger: ['change','blur']
						},
						{
							min: 6,
							max: 30,
							message: this.$t('my.forget.data.rules.mobile.message2'),
							trigger: ['change','blur']
						}
					]
				},
				submit:{
					loading:false,
					disabled:true
				}
			}
		},
		watch:{
			form:{
				handler(){
					let s = this;
					if(s.form.name != '' && s.form.mobile != ''){
						s.submit.disabled = false;
					}else{
						s.submit.disabled = true;
					}
				},
				immediate:true,
				deep:true
			}
		},
		onLoad(e) {
			let s = this;
			if(typeof e.type != "undefined"){
				s.type = 'edit';
				s.getZalo();
				uni.setNavigationBarTitle({
					title:s.$t('my.address.zalo.edit_title')
				})
			}else{
				uni.setNavigationBarTitle({
					title:s.$t('my.address.zalo.add_title')
				})
			}
			
		},
		onShow() {
			let s = this;
			if(uni.getStorageSync('country_code')){
				s.nation_code = uni.getStorageSync('country_code').tel;
			}
			setTimeout(function() {
				s.loading = false;
			}, 1000);
		},
		methods:{
			getZalo(){
				let s = this;
				uni.$u.http.get('/?s=App.User_User.GetZalo').then(res => {
					console.log('获取Zalo列表');
					console.log(res);
					if(res.data.ret == 200){
						if(res.data.data){
							s.form.name = res.data.data[0].zalo_name;
							s.form.mobile = res.data.data[0].zalo_mobile;
							if(res.data.data[0].mobile_country_code){
								s.form.nation_code = res.data.data[0].mobile_country_code;
							}
						}
						s.done = true;
					}
				})
			},
			submitForm(){
				let s = this;
				if(s.form.name != '' && s.form.mobile != ''){}else{
					s.$toast('illegal operation')
					return false;
				}
				s.submit.disabled = true;
				s.submit.loading = true;

				var params = {
					name:s.form.name,
					mobile:s.form.mobile,
					mobile_country_code:s.nation_code
				};

				if(s.type == 'edit'){
					var url_s = 'App.User_User.UpdateZalo';
				}else{
					var url_s = 'App.User_User.AddZalo';
				}
				

				uni.$u.http.post('/?s='+url_s,{}, {
					params: params
				}).then(res => {
					console.log('添加或编辑Zalo');
					console.log(res);
					if(res.data.ret == 200){
						s.$toast(s.$t('my.address.zalo.toast.success'));
						setTimeout(function() {
							uni.navigateBack()
						}, 500);
					}else{
						s.$toast(res.data.msg);
					}
					s.submit.disabled = false;
					s.submit.loading = false;
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		padding: 30rpx;
	}
</style>