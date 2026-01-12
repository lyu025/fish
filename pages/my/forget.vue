<template>
	<view class="pages my_forget">
		<view class="loading_box" v-if="loading">
			<u-loading-icon mode="circle" :text="$t('common.loading')" :vertical="true"></u-loading-icon>
		</view>
		<view class="content" v-show="loading==false">
			<view class="form_box" v-show="type=='mobile'">
				<u--form class="form" :model="form" :rules="rules" ref="uform">
					<u-form-item label="" prop="mobile" class="item">
						<u-input v-model="form.mobile" type="number" :placeholder="$t('my.forget.form.mobile_placeholder')"  fontSize="16px" class="input" maxlength="30" :readonly="loading">
							<template slot="prefix">
								<text @click="$navigateTo(`/pages/my/country`)">+{{nation_code}}</text>
							</template>
						</u-input>
					</u-form-item>
					<u-form-item label="" prop="smsCode" class="item">
						<u-input v-model="form.smsCode" type="text" :placeholder="$t('my.forget.form.smsCode_placeholder')"  fontSize="16px" class="input" :readonly="loading">
							<template slot="suffix">
								<u-button size="small" :text="send_info.text" type="info" color="#D6AE40"  :disabled="send.disabled" :loading="send.loading" @click="sendForm()" :customStyle="{'height':'36rpx'}"></u-button>
							</template>
						</u-input>
					</u-form-item>
					<u-form-item label="" prop="password" class="item">
						<u-input v-model="form.password" type="text" :password="password.show1" :placeholder="$t('my.forget.form.password_placeholder')"  fontSize="16px" class="input" :readonly="loading">
							<text slot="suffix" class="iconfont icon-eye-close" @click="password.show1=false" v-if="password.show1==true"></text>
							<text slot="suffix" class="iconfont icon-eye" @click="password.show1=true" v-if="password.show1==false"></text>
						</u-input>
					</u-form-item>
					<u-form-item label="" prop="repassword" class="item">
						<u-input v-model="form.repassword" type="text" :password="password.show2" :placeholder="$t('my.forget.form.repassword_placeholder')"  fontSize="16px" class="input" :readonly="loading">
							<text slot="suffix" class="iconfont icon-eye-close" @click="password.show2=false" v-if="password.show2==true"></text>
							<text slot="suffix" class="iconfont icon-eye" @click="password.show2=true" v-if="password.show2==false"></text>
						</u-input>
					</u-form-item>
				</u--form>
			</view>


			<view class="form_box" v-show="type=='email'">
				<u--form class="form" :model="form2" :rules="rules2" ref="uform2">
					<u-form-item label="" prop="email" class="item">
						<u-input v-model="form2.email" type="text" :placeholder="$t('my.forget.form.email_placeholder')"  fontSize="16px" class="input" maxlength="30"  :readonly="loading"></u-input>
					</u-form-item>
					<u-form-item label="" prop="emailCode" class="item">
						<u-input v-model="form2.emailCode" type="text" :placeholder="$t('my.forget.form.emailCode_placeholder')"  fontSize="16px" class="input" :readonly="loading">
							<template slot="suffix">
								<u-button size="small" :text="send_info2.text" type="info" color="#D6AE40"  :disabled="send2.disabled" :loading="send2.loading" @click="sendForm2()" :customStyle="{'height':'36rpx'}"></u-button>
							</template>
						</u-input>
					</u-form-item>
					<u-form-item label="" prop="password" class="item">
						<u-input v-model="form2.password" type="text" :password="password.show1" :placeholder="$t('my.forget.form.password_placeholder')"  fontSize="16px" class="input" :readonly="loading">
							<text slot="suffix" class="iconfont icon-eye-close" @click="password2.show1=false" v-if="password2.show1==true"></text>
							<text slot="suffix" class="iconfont icon-eye" @click="password2.show1=true" v-if="password2.show1==false"></text>
						</u-input>
					</u-form-item>
					<u-form-item label="" prop="repassword" class="item">
						<u-input v-model="form2.repassword" type="text" :password="password2.show2" :placeholder="$t('my.forget.form.repassword_placeholder')"  fontSize="16px" class="input" :readonly="loading">
							<text slot="suffix" class="iconfont icon-eye-close" @click="password2.show2=false" v-if="password2.show2==true"></text>
							<text slot="suffix" class="iconfont icon-eye" @click="password2.show2=true" v-if="password2.show2==false"></text>
						</u-input>
					</u-form-item>
				</u--form>
			</view>
			<view class="button_box" v-if="type=='mobile'">
				<u-button type="primary"  :text="$t('my.forget.button.submit')" color="#D6AE40" class="button primary" :disabled="submit.disabled" :loading="submit.loading" loadingMode="circle" @click="submitForm()"></u-button>
			</view>
			<view class="button_box" v-else-if="type=='email'">
				<u-button type="primary"  :text="$t('my.forget.button.submit')" color="#D6AE40" class="button primary" :disabled="submit2.disabled" :loading="submit2.loading" loadingMode="circle" @click="submitForm2()"></u-button>
			</view>
			<view class="info_box" v-if="false">
				<text v-if="type=='mobile'" @click="type='email'">{{$t('my.forget.text.email')}}</text>
				<text v-else-if="type=='email'" @click="type='mobile'">{{$t('my.forget.text.mobile')}}</text>
			</view>
		</view>

    <tf-verify-img @succeed="verifyOk" @close="verifyHide" v-if="showVerify"></tf-verify-img>

	</view>
</template>

<script>
  import tfVerifyImg from '@/components/tf-verify-img/tf-verify-img.vue';
	export default {
    components:{tfVerifyImg},
		data() {
			return {
				loading:true,
				type:'mobile',
				nation_code:'84',
				send_info:{
					text:this.$t('my.forget.button.send'),
					time:300
				},
				send:{
					disabled:true,
					loading:false
				},
				form:{
					mobile:'',
					smsCode:'',
					password:'',
					repassword:''
				},
				password:{
					show1:true,
					show2:true
				},
				rules:{
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
							min: 8,
							max: 13,
							message: this.$t('my.forget.data.rules.mobile.message2'),
							trigger: ['change','blur']
						}
					],
					smsCode: [
						{
							required: true,
							message: this.$t('my.forget.data.rules.smsCode.message0'),
							trigger: ['change','blur']
						},
						{
							pattern: /^[0-9]*$/g,
							transform(value) {
								return String(value);
							},
							message: this.$t('my.forget.data.rules.smsCode.message1'),
							trigger: ['change','blur']
						},
						{
							min: 6,
							max: 6,
							message: this.$t('my.forget.data.rules.smsCode.message2'),
							trigger: ['change','blur']
						}
					],
					password: [
						{
							required: true,
							message: this.$t('my.forget.data.rules.password.message0'),
							trigger: ['change','blur']
						},
						{
							min: 6,
							max: 15,
							message: this.$t('my.forget.data.rules.password.message2'),
							trigger: ['change','blur']
						}
					],
					repassword: [
						{
							required: true,
							message: this.$t('my.forget.data.rules.repassword.message0'),
							trigger: ['change','blur']
						},
						{
							min: 6,
							max: 15,
							message: this.$t('my.forget.data.rules.repassword.message2'),
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

				send_info2:{
					text:this.$t('my.forget.button.send'),
					time:300
				},
				send2:{
					disabled:true,
					loading:false
				},
				form2:{
					mobile:'',
					smsCode:'',
					password:'',
					repassword:''
				},
				password2:{
					show1:true,
					show2:true
				},
				submit2:{
					disabled:true,
					loading:false
				},
				rules2:{
					email: [
						{
							required: true,
							message: this.$t('my.forget.data.rules.email.message0'),
							trigger: ['change','blur']
						},
						{
							pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g,
							transform(value) {
								return String(value);
							},
							message: this.$t('my.forget.data.rules.email.message1'),
							trigger: ['change','blur']
						},
						{
							min: 6,
							max: 30,
							message: this.$t('my.forget.data.rules.email.message2'),
							trigger: ['change','blur']
						}
					],
					emailCode: [
						{
							required: true,
							message: this.$t('my.forget.data.rules.emailCode.message0'),
							trigger: ['change','blur']
						},
						{
							pattern: /^[0-9]*$/g,
							transform(value) {
								return String(value);
							},
							message: this.$t('my.forget.data.rules.emailCode.message1'),
							trigger: ['change','blur']
						},
						{
							min: 6,
							max: 6,
							message: this.$t('my.forget.data.rules.emailCode.message2'),
							trigger: ['change','blur']
						}
					],
					password: [
						{
							required: true,
							message: this.$t('my.forget.data.rules.password.message0'),
							trigger: ['change','blur']
						},
						{
							pattern: /^[0-9a-zA-Z]*$/g,
							transform(value) {
								return String(value);
							},
							message: this.$t('my.forget.data.rules.password.message1'),
							trigger: ['change','blur']
						},
						{
							min: 6,
							max: 15,
							message: this.$t('my.forget.data.rules.password.message2'),
							trigger: ['change','blur']
						}
					],
					repassword: [
						{
							required: true,
							message: this.$t('my.forget.data.rules.repassword.message0'),
							trigger: ['change','blur']
						},
						{
							pattern: /^[0-9a-zA-Z]*$/g,
							transform(value) {
								return String(value);
							},
							message: this.$t('my.forget.data.rules.repassword.message1'),
							trigger: ['change','blur']
						},
						{
							min: 6,
							max: 15,
							message: this.$t('my.forget.data.rules.repassword.message2'),
							trigger: ['change','blur']
						}
					]
				},

        showVerify: false,
        sendMethod: ''
			}
		},
		watch:{
			form:{
				handler(){
					let s = this;
					if(s.form.mobile != '' && s.form.smsCode != '' && s.form.password != '' && s.form.repassword != ''){
						s.$refs.uform.validate().then(res => {
							s.submit.disabled = false;
						}).catch(errors => {
							s.submit.disabled = true;
						})
					}else{
						s.submit.disabled = true;
					}

					if(s.form.mobile != '' && s.form.mobile != s.nation_code && s.send_info.time == 300){
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
					if(s.form.mobile != '' && s.form.mobile != s.nation_code && s.send_info.time == 300){
						s.send.disabled = false;
					}else{
						s.send.disabled = true;
					}
				},
				immediate:true,
				deep:true
			},
			form2:{
				handler(){
					let s = this;
					if(s.form2.email != '' && s.form2.emailCode != '' && s.form2.password != '' && s.form2.repassword != ''){
						s.$refs.uform2.validate().then(res => {
							s.submit2.disabled = false;
						}).catch(errors => {
							s.submit2.disabled = true;
						})
					}else{
						s.submit2.disabled = true;
					}

					if(s.form2.email != '' && s.send_info2.time == 300){
						s.send2.disabled = false;
					}else{
						s.send2.disabled = true;
					}
				},
				immediate:true,
				deep:true
			},
			send_info2:{
				handler(){
					let s = this;
					if(s.form2.mobile != '' && s.send_info2.time == 300){
						s.send2.disabled = false;
					}else{
						s.send2.disabled = true;
					}
				},
				immediate:true,
				deep:true
			},
		},
		onLoad() {
			let s = this;
			uni.setNavigationBarTitle({
				title:s.$t('my.forget.navbar_title')
			})
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
      verifyOk(){
        this[this.sendMethod]();
        this.sendMethod = '';
        this.showVerify = false;
      },
      verifyHide(){
        this.sendMethod = '';
        this.showVerify = false;
      },
			confirmNation(e){
				let s = this;
				s.nation_code = e.value[0].code;
				s.nation.show = false;
			},
			sendForm(){
				let s = this;
        if(!s.showVerify) {
          s.showVerify = true;
          s.sendMethod = 'sendForm';
          return;
        }
				if(s.form.mobile != '' && s.send_info.time == 300){}else{
					s.$toast(s.$t('my.forget.toast.illegal_operation'))
					return false;
				}
				s.send.disabled = true;
				s.send.loading = true;

				var data = {
					mobile:s.nation_code+s.form.mobile,
					send_type:4
				};
				uni.$u.http.post('/?s=App.User_User.SendSmsCodeByYTG',data).then(res => {
					console.log('找回密码发短信');
					console.log(res);
					if(res.data.ret == 200){
						s.sendFormTime();
						s.$toast(s.$t('my.forget.toast.success'));
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
					s.send_info.text = s.$t('my.forget.button.send');
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

					uni.$u.http.post('/?s=App.User_User.ForgetPassword', {
							mobile:s.nation_code+s.form.mobile,
							smsCode:s.form.smsCode,
							password:s.form.password,
							repassword:s.form.repassword
						}).then(res => {
						console.log('找回密码提交');
						console.log(res);
						if(res.data.ret == 200){
							s.$toast(s.$t('my.forget.toast.success'));
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
			},
			sendForm2(){
				let s = this;
        if(!s.showVerify) {
          s.showVerify = true;
          s.sendMethod = 'sendForm2';
          return;
        }
				if(s.form2.email != '' && s.send_info2.time == 300){}else{
					s.$toast(s.$t('my.forget.toast.illegal_operation'))
					return false;
				}
				s.send2.disabled = true;
				s.send2.loading = true;

				var data = {
					email:s.form2.email,
					send_type:4
				};
				uni.$u.http.post('/?s=App.User_User.SendEmailCode',data).then(res => {
					console.log('找回密码发邮件');
					console.log(res);
					if(res.data.ret == 200){
						s.sendFormTime2();
						s.$toast(s.$t('my.forget.toast.success'));
					}else{
						s.send2.disabled = false;
						s.$toast(res.data.msg);
					}
					s.send2.loading = false;
				})
			},
			sendFormTime2(){
				let s = this;
				let clock2 = setInterval((item) => {
				  s.send_info2.time--;
				  s.send_info2.text = s.send_info2.time + 's';
				  if(s.send_info2.time == 0){
					s.send2.disabled = false;
					s.send_info2.text = s.$t('my.forget.button.send');
					s.send_info2.time = 300;
					clearInterval(clock2);
				  }
				},1000);
			},
			submitForm2(){
				let s = this;
				s.$refs.uform2.validate().then(res => {
					s.submit2.disabled = true;
					s.submit2.loading = true;

					uni.$u.http.post('/?s=App.User_User.ForgetPasswordByEmail', s.form2).then(res => {
						console.log('找回密码提交');
						console.log(res);
						if(res.data.ret == 200){
							s.$toast(s.$t('my.forget.toast.success'));
							setTimeout(function() {
								uni.navigateBack();
							}, 500);
						}else{
							s.$toast(res.data.msg);
						}

						s.submit2.disabled = false;
						s.submit2.loading = false;
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
		.info_box{
			padding: 30rpx 0;
			text-align: center;
		}
	}

	.icon-eye-close{color: #ccc;}
	.icon-eye{color: #D6AE40;}
</style>