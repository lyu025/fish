<template>
	<view class="pages my_profile_pay_password">
		<view class="loading_box" v-if="loading">
			<u-loading-icon mode="circle" :text="$t('common.loading')" :vertical="true"></u-loading-icon>
		</view>
		<view class="content" v-show="loading==false">
			<view class="form_box">
				<u--form class="form" :model="form" :rules="rules" ref="uform">
					<u-form-item label="" prop="mobile" class="item">
						<u-input :value="user.username" :disabled="true" type="text" fontSize="16px" class="input" maxlength="30">
						</u-input>
					</u-form-item>
					<u-form-item label="" prop="code" class="item">
						<u-input v-model="form.code" type="text" :placeholder="$t('my.pay.form.code_placeholder')"  fontSize="16px" class="input" :readonly="loading">
							<template slot="suffix">
								<u-button size="small" :text="send_info.text" type="info" color="#D6AE40"  :disabled="send.disabled" :loading="send.loading" @click="sendForm()" :customStyle="{'height':'36rpx'}"></u-button>
							</template>
						</u-input>
					</u-form-item>
					<u-form-item label="" prop="pay_pass" class="item">
						<u-input v-model="form.pay_pass" type="number" :password="password.show1" :placeholder="$t('my.pay.form.password_placeholder')"  fontSize="16px" class="input" :readonly="loading">
							<text slot="suffix" class="iconfont icon-eye-close" @click="password.show1=false" v-if="password.show1==true"></text>
							<text slot="suffix" class="iconfont icon-eye" @click="password.show1=true" v-if="password.show1==false"></text>
						</u-input>
					</u-form-item>
					<u-form-item label="" prop="repay_pass" class="item">
						<u-input v-model="form.repay_pass" type="number" :password="password.show2" :placeholder="$t('my.pay.form.repassword_placeholder')"  fontSize="16px" class="input" :readonly="loading">
							<text slot="suffix" class="iconfont icon-eye-close" @click="password.show2=false" v-if="password.show2==true"></text>
							<text slot="suffix" class="iconfont icon-eye" @click="password.show2=true" v-if="password.show2==false"></text>
						</u-input>
					</u-form-item>
				</u--form>
			</view>
			<view class="button_box">
				<u-button type="primary"  :text="$t('my.pay.button.submit')" color="#D6AE40" class="button primary" :disabled="submit.disabled" :loading="submit.loading" loadingMode="circle" @click="submitForm()"></u-button>
			</view>
		</view>

    <tf-verify-img @succeed="verifyOk" @close="showVerify=false" v-if="showVerify"></tf-verify-img>

  </view>
</template>

<script>
  import tfVerifyImg from '@/components/tf-verify-img/tf-verify-img.vue';
  export default {
    components:{tfVerifyImg},
		data() {
			return {
				type:'mobile',
				loading:true,
				send_info:{
					text:this.$t('my.pay.button.send'),
					time:300
				},
				send:{
					disabled:true,
					loading:false
				},
				form:{
					username:'',
					code:'',
					pay_pass:'',
					repay_pass:''
				},
				password:{
					show1:true,
					show2:true
				},
				rules:{
					code: [
						{
							required: true,
							message: this.$t('my.pay.data.rules.code.message0'),
							trigger: ['change','blur']
						},
						{
							pattern: /^[0-9]*$/g,
							transform(value) {
								return String(value);
							},
							message: this.$t('my.pay.data.rules.code.message1'),
							trigger: ['change','blur']
						},
						{
							min: 6,
							max: 6,
							message: this.$t('my.pay.data.rules.code.message2'),
							trigger: ['change','blur']
						}
					],
					pay_pass: [
						{
							required: true,
							message: this.$t('my.pay.data.rules.password.message0'),
							trigger: ['change','blur']
						},
						{
							pattern: /^[0-9]*$/g,
							transform(value) {
								return String(value);
							},
							message: this.$t('my.pay.data.rules.password.message1'),
							trigger: ['change','blur']
						},
						{
							min: 4,
							max: 6,
							message: this.$t('my.pay.data.rules.password.message2'),
							trigger: ['change','blur']
						}
					],
					repay_pass: [
						{
							required: true,
							message: this.$t('my.pay.data.rules.repassword.message0'),
							trigger: ['change','blur']
						},
						{
							pattern: /^[0-9]*$/g,
							transform(value) {
								return String(value);
							},
							message: this.$t('my.pay.data.rules.password.message1'),
							trigger: ['change','blur']
						},
						{
							min: 4,
							max: 6,
							message: this.$t('my.pay.data.rules.repassword.message2'),
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
				user:'',

        showVerify: false,
			}
		},
		watch:{
			form:{
				handler(){
					let s = this;
					if(s.form.username != '' && s.form.code != '' && s.form.pay_pass != '' && s.form.repay_pass != ''){
						s.$refs.uform.validate().then(res => {
							s.submit.disabled = false;
						}).catch(errors => {
							s.submit.disabled = true;
						})
					}else{
						s.submit.disabled = true;
					}

					if(s.form.username != '' && s.send_info.time == 300){
						s.send.disabled = false;
					}else{
						s.send.disabled = true;
					}
				},
				immediate:true,
				deep:true
			},
			send_info:{
				handler(){
					let s = this;
					if(s.form.username != '' && s.send_info.time == 300){
						s.send.disabled = false;
					}else{
						s.send.disabled = true;
					}
				},
				immediate:true,
				deep:true
			}
		},
		onLoad() {
			let s = this;
			uni.setNavigationBarTitle({
				title:s.$t('my.pay.navbar_title')
			})
			s.user = uni.getStorageSync('user');
			if(s.$isEmail(s.user.username)){
				s.type = 'email';
			}
			s.form.username = s.user.username;
		},
		onShow() {
			let s = this;
			setTimeout(function() {
				s.loading = false;
			}, 1000);
		},
		methods:{
      verifyOk(){
        this.sendForm();
        this.showVerify = false;
      },
			sendForm(){
				let s = this;
        if(!s.showVerify) {
          s.showVerify = true;
          return;
        }
				if(s.form.username != '' && s.send_info.time == 300){}else{
					s.$toast(s.$t('my.pay.toast.illegal_operation'))
					return false;
				}
				s.send.disabled = true;
				s.send.loading = true;


				if(s.type == 'email'){
					var apiurl = 'App.User_User.SendEmailCode';
					var data = {
						email:s.user.username,
						send_type:4
					};
				}else{
					var apiurl = 'App.User_User.SendSmsCodeByYTG';
					var data = {
						mobile:s.user.username,
						send_type:4
					};
				}
				uni.$u.http.post('/?s='+apiurl,data).then(res => {
					console.log('重置支付密码发短信或邮件');
					console.log(res);
					if(res.data.ret == 200){
						s.sendFormTime();
						s.$toast(s.$t('my.pay.toast.success'));
					}else{
						s.send.disabled = false;
						s.$toast(res.data.msg);
					}

					s.send.loading = false;
				})
			},
			sendFormTime(){
				let s = this;
				let clock = setInterval((item) => {
				  s.send_info.time--;
				  s.send_info.text = s.send_info.time + 's';
				  if(s.send_info.time == 0){
					s.send.disabled = false;
					s.send_info.text = s.$t('my.pay.button.send');
					s.send_info.time = 300;
					clearInterval(clock);
				  }
				},1000);
			},
			submitForm(){
				let s = this;
				s.$refs.uform.validate().then(res => {
					s.submit.disabled = true;
					s.submit.loading = true;

					uni.$u.http.post('/?s=App.User_User.ForgetPayPassByUsername',{}, {
						params: s.form
					}).then(res => {
						console.log('重置支付密码提交');
						console.log(res);
						if(res.data.ret == 200){
							s.$toast(s.$t('my.pay.toast.success'));
							s.getUser();

						}else{
							s.$toast(res.data.msg);
						}

						s.submit.disabled = false;
						s.submit.loading = false;
					})
				}).catch(errors => {

				})
			},
			getUser(){
				let s = this;
				uni.$u.http.post('/?s=App.User_User.Profile').then(res => {
					console.log('获取用户信息');
					console.log(res);
					if(res.data.ret == 200){
						s.user = res.data.data.profile;
						uni.setStorageSync('user',res.data.data.profile);
						setTimeout(function() {
							uni.navigateBack();
						}, 500);
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
		padding: 0 30rpx;
		.form_box{

		}
		.button_box{
			margin: 30rpx 0 0 0;
		}
		.info_box{
			padding: 30rpx 0;
			text-align: center;
		}
	}

	.icon-eye-close{color: #ccc;}
	.icon-eye{color: #D6AE40;}
</style>