<template>
	<view class="pages my_profile_password">
		<view class="loading_box" v-if="loading">
			<u-loading-icon mode="circle" :text="$t('common.loading')" :vertical="true"></u-loading-icon>
		</view>
		<view class="content" v-show="loading==false">
			<view class="form_box">
				<u--form class="form" :model="form" :rules="rules" ref="uform">
					<u-form-item label="" prop="oldpassword" class="item">
						<u-input v-model="form.oldpassword" type="text" :password="password.show0" :placeholder="$t('my.password.form.oldpassword_placeholder')"  fontSize="16px" class="input" :readonly="loading">
							<text slot="suffix" class="iconfont icon-eye-close" @click="password.show0=false" v-if="password.show0==true"></text>
							<text slot="suffix" class="iconfont icon-eye" @click="password.show0=true" v-else></text>
						</u-input>
					</u-form-item>
					<u-form-item label="" prop="password" class="item">
						<u-input v-model="form.password" type="text" :password="password.show1" :placeholder="$t('my.password.form.password_placeholder')"  fontSize="16px" class="input" :readonly="loading">
							<text slot="suffix" class="iconfont icon-eye-close" @click="password.show1=false" v-if="password.show1==true"></text>
							<text slot="suffix" class="iconfont icon-eye" @click="password.show1=true" v-else></text>
						</u-input>
					</u-form-item>
					<u-form-item label="" prop="repassword" class="item">
						<u-input v-model="form.repassword" type="text" :password="password.show2" :placeholder="$t('my.password.form.repassword_placeholder')"  fontSize="16px" class="input" :readonly="loading">
							<text slot="suffix" class="iconfont icon-eye-close" @click="password.show2=false" v-if="password.show2==true"></text>
							<text slot="suffix" class="iconfont icon-eye" @click="password.show2=true" v-else></text>
						</u-input>
					</u-form-item>
				</u--form>
			</view>
			<view class="button_box">
				<u-button type="primary" :text="$t('my.password.button.submit')" color="#D6AE40" class="button primary" :disabled="submit.disabled" :loading="submit.loading" loadingMode="circle" @click="submitForm()"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading:true,
				form:{
					oldpassword:'',
					password:'',
					repassword:''
				},
				password:{
					show0:true,
					show1:true,
					show2:true
				},
				rules:{
					oldpassword: [
						{
							required: true, 
							message: this.$t('my.password.data.rules.oldpassword.message0'),
							trigger: ['change','blur']
						},
						{
							min: 6,
							max: 15,
							message: this.$t('my.password.data.rules.oldpassword.message2'),
							trigger: ['change','blur']
						}
					],
					password: [
						{
							required: true, 
							message: this.$t('my.password.data.rules.password.message0'),
							trigger: ['change','blur']
						},
						{
							min: 6,
							max: 15,
							message: this.$t('my.password.data.rules.password.message2'),
							trigger: ['change','blur']
						}
					],
					repassword: [
						{
							required: true, 
							message: this.$t('my.password.data.rules.repassword.message0'),
							trigger: ['change','blur']
						},
						{
							min: 6,
							max: 15,
							message: this.$t('my.password.data.rules.repassword.message2'),
							trigger: ['change','blur']
						}
					]
				},
				submit:{
					disabled:true,
					loading:false
				},
				tips: '',
				seconds: 60,
			}
		},
		watch:{
			form:{
				handler(){
					let s = this;
					if(s.form.oldpassword != '' && s.form.password != '' && s.form.repassword != ''){
						s.$refs.uform.validate().then(res => {
							s.submit.disabled = false;
						}).catch(errors => {
							s.submit.disabled = true;
						})
					}else{
						s.submit.disabled = true;
					}
				},
				immediate:true,
				deep:true
			}
		},
		onLoad() {
			let s = this;
			uni.setNavigationBarTitle({
				title:s.$t('my.password.navbar_title')
			})
		},
		onShow() {
			let s = this;
			setTimeout(function() {
				s.loading = false;
			}, 1000);
		},
		methods:{
			submitForm(){
				let s = this;
				s.$refs.uform.validate().then(res => {
					s.submit.disabled = true;
					s.submit.loading = true;
					
					uni.$u.http.post('/?s=App.User_User.EditPassword',{}, {
						params: {
							oldpassword:s.form.oldpassword,
							password:s.form.password,
							repassword:s.form.repassword
						}
					}).then(res => {
						console.log('修改密码提交');
						console.log(res);
						if(res.data.ret == 200){
							s.$toast(s.$t('my.password.toast.success'));
							setTimeout(function() {
								uni.navigateBack();
							}, 500);
						}else{
							s.$toast(res.data.msg);
						}
						
						s.submit.disabled = false;
						s.submit.loading = false;
					})
				}).catch(errors => {
					
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		padding: 0 30rpx;
		.form_box{
			
		}
		.button_box{
			margin: 30rpx 0 0 0;
		}
	}
	
	.icon-eye-close{color: #ccc;}
	.icon-eye{color: #D6AE40;}
</style>