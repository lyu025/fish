<template>
	<view class="pages my_login">
		<view class="lang_box" @click="lang.show=true">
			<img-cache :src="require('@/static/images/flag/gb.png')" width="30rpx" height="21rpx" v-if="$i18n.locale=='en'"></img-cache>
			<img-cache :src="require('@/static/images/flag/vn.png')" width="30rpx" height="21rpx" v-else-if="$i18n.locale=='vi'"></img-cache>
			<text class="lang_current">{{$t('lang.title')}}</text>
			<text class="iconfont icon-arrowright"></text>
		</view>
		<view class="logo_box">
			<img-cache mode="aspectFill" :src="require('@/static/images/logo_login.png')" width="120rpx" height="120rpx"></img-cache>
		</view>
		<view class="chat_box">
			<img-cache mode="aspectFill" :src="require('@/static/images/my/chat.png')" width="48rpx" height="48rpx" @click="$openUrl(service.onlineservice)"></img-cache>
		</view>
		<view class="tab_box">
			<view class="tab_title">
				<text class="cell" :class="{cur:type=='login'}" @click="type='login'">{{$t('my.login.tab_title[0]')}}</text>
				<text class="cell" :class="{cur:type=='register'}" @click="type='register'">{{$t('my.login.tab_title[1]')}}</text>
				<text class="cell" :class="{cur:type=='register2'}" @click="type='register2'" v-if="false">{{$t('my.login.tab_title[2]')}}</text>
			</view>
			<view class="tab_content">
				<view class="cell" :class="{cur:type=='login'}">
					<u--form class="form" :model="form1" :rules="rules1" ref="uform1">
						<u-form-item prop="mobile" class="item">
							<u-input v-model="form1.mobile" type="text" :placeholder="$t('my.login.form2.mobile_placeholder')" border="none" color="#fff" shape="square" fontSize="16px" class="input">
								<template slot="prefix">
									<text @click="$navigateTo(`/pages/my/country`)" style="color: #fff;">+{{nation_code}}</text>
								</template>
							</u-input>
						</u-form-item>
						<u-form-item prop="password" class="item">
							<u-input v-model="form1.password" type="text" :password="form1_password" :placeholder="$t('my.login.form1.password_placeholder')" border="none" color="#fff" shape="square" fontSize="16px" class="input">
								<text slot="suffix" class="iconfont icon-eye-close" @click="form1_password=false" v-if="form1_password==true"></text>
								<text slot="suffix" class="iconfont icon-eye" @click="form1_password=true" v-if="form1_password==false"></text>
							</u-input>
						</u-form-item>
						<u-form-item prop="">
							<u-checkbox-group @change="(value) => form1_auto_login = value.length > 0">
								<u-checkbox :checked="form1_auto_login" :label="$t('my.login.form1.remember_label')" labelColor="#fff" shape="circle"></u-checkbox>
							</u-checkbox-group>
							<text style="color: #fff;" slot="right" @click="$navigateTo('/pages/my/forget',false)">{{$t('my.login.form1.forget')}}</text>
						</u-form-item>
					</u--form>
					<view class="button_box">
						<u-button type="primary" shape="circle" :text="$t('my.login.button1.submit')" color="#D6AE40" class="button primary" :disabled="submit1.disabled" :loading="submit1.loading" loadingMode="circle" @click="submitForm1()"></u-button>
						<u-button type="default" shape="circle" :text="$t('my.login.button1.download')" :plain="true" class="button default" @click="openDownload()"></u-button>

					</view>
					<view class="version_box" v-if="version">
						<text>v{{version}}</text>
					</view>
				</view>
				<view class="cell" :class="{cur:type=='register'}">
					<u--form class="form" :model="form2" :rules="rules2" ref="uform2">
						<u-form-item prop="mobile" class="item">
							<u-input v-model="form2.mobile" type="number" :placeholder="$t('my.login.form2.mobile_placeholder')" border="none" color="#fff" shape="square" fontSize="16px" class="input" maxlength="30">
								<template slot="prefix">
									<text @click="$navigateTo(`/pages/my/country`)" style="color: #fff;">+{{nation_code}}</text>
								</template>
							</u-input>
						</u-form-item>
						<u-form-item prop="smsCode" class="item">
							<u-input v-model="form2.smsCode" type="text" :placeholder="$t('my.login.form2.code_placeholder')" border="none" color="#fff" shape="square" fontSize="16px" class="input">
								<template slot="suffix">
									<u-button size="small" :text="send_info.text" type="info" color="#D6AE40"  :disabled="send.disabled" :loading="send.loading" @click="sendForm()" :customStyle="{'height':'36rpx'}"></u-button>
								</template>
							</u-input>
						</u-form-item>
						<u-form-item prop="password" class="item">
							<u-input v-model="form2.password" type="text" :password="form2_password" :placeholder="$t('my.login.form2.password_placeholder')" border="none" color="#fff" shape="square" fontSize="16px" class="input">
								<text slot="suffix" class="iconfont icon-eye-close" @click="form2_password=false" v-if="form2_password==true"></text>
								<text slot="suffix" class="iconfont icon-eye" @click="form2_password=true" v-if="form2_password==false"></text>
							</u-input>
						</u-form-item>
						<u-form-item class="item" v-if="password_strength>0">
							<view class="passwordStrength">
								<text class="ps" :class="{'ps1':password_strength>0}"></text>
								<text class="ps" :class="{'ps2':password_strength>1}"></text>
								<text class="ps" :class="{'ps3':password_strength>2}"></text>
							</view>
						</u-form-item>
						<u-form-item prop="repassword" class="item">
							<u-input v-model="form2.repassword" type="text" :password="form2_repassword" :placeholder="$t('my.login.form2.repassword_placeholder')" border="none" color="#fff" shape="square" fontSize="16px" class="input">
								<text slot="suffix" class="iconfont icon-eye-close" @click="form2_repassword=false" v-if="form2_repassword==true"></text>
								<text slot="suffix" class="iconfont icon-eye" @click="form2_repassword=true" v-if="form2_repassword==false"></text>
							</u-input>
						</u-form-item>
						<u-form-item prop="invite_code" class="item">
							<u-input v-model="form2.invite_code" type="text" :placeholder="$t('my.login.form2.invite_placeholder')" border="none" color="#fff" shape="square" fontSize="16px" class="input"></u-input>
						</u-form-item>
            <!--
						<u-form-item prop="nickname" class="item">
							<u-input v-model="form2.nickname" type="text" :placeholder="$t('my.login.form2.nickname_placeholder')" border="none" color="#fff" shape="square" fontSize="16px" class="input"></u-input>
						</u-form-item>
						-->
						<u-form-item prop="">
							<u-checkbox-group @change="(value) => form2_agree = value.length > 0">
								<u-checkbox :label="$t('my.login.form2.agree')" labelColor="#fff" shape="circle" :name="1"></u-checkbox>
							</u-checkbox-group>
							<text class="agree_text" @click="$navigateTo('/pages/my/page?type=user_agreement',false)">{{$t('my.login.form2.agreement')}}</text>
						</u-form-item>
					</u--form>
					<view class="button_box">
						<u-button type="primary" shape="circle" :text="$t('my.login.button2.submit')" color="#D6AE40" class="button primary" :disabled="submit2.disabled" :loading="submit2.loading" loadingMode="circle" @click="submitForm2()"></u-button>
					</view>
				</view>



				<view class="cell" :class="{cur:type=='register2'}">
					<u--form class="form" :model="form3" :rules="rules3" ref="uform3">

						<u-form-item prop="email" class="item">
							<u-input v-model="form3.email" type="text" :placeholder="$t('my.login.form3.email_placeholder')" border="none" color="#fff" shape="square" fontSize="16px" class="input" maxlength="30"></u-input>
						</u-form-item>
						<u-form-item prop="emailCode" class="item">
							<u-input v-model="form3.emailCode" type="text" :placeholder="$t('my.login.form3.code_placeholder')" border="none" color="#fff" shape="square" fontSize="16px" class="input">
								<template slot="suffix">
									<u-button size="small" :text="send_info2.text" type="info" color="#D6AE40"  :disabled="send2.disabled" :loading="send2.loading" @click="sendForm2()" :customStyle="{'height':'36rpx'}"></u-button>
								</template>
							</u-input>
						</u-form-item>

						<u-form-item prop="password" class="item">
							<u-input v-model="form3.password" type="text" :password="form3_password" :placeholder="$t('my.login.form3.password_placeholder')" border="none" color="#fff" shape="square" fontSize="16px" class="input">
								<text slot="suffix" class="iconfont icon-eye-close" @click="form3_password=false" v-if="form3_password==true"></text>
								<text slot="suffix" class="iconfont icon-eye" @click="form3_password=true" v-if="form3_password==false"></text>
							</u-input>
						</u-form-item>
						<u-form-item prop="repassword" class="item">
							<u-input v-model="form3.repassword" type="text" :password="form3_repassword" :placeholder="$t('my.login.form3.repassword_placeholder')" border="none" color="#fff" shape="square" fontSize="16px" class="input">
								<text slot="suffix" class="iconfont icon-eye-close" @click="form3_repassword=false" v-if="form3_repassword==true"></text>
								<text slot="suffix" class="iconfont icon-eye" @click="form3_repassword=true" v-if="form3_repassword==false"></text>
							</u-input>
						</u-form-item>
						<u-form-item prop="invite_code" class="item">
							<u-input v-model="form3.invite_code" type="text" :placeholder="$t('my.login.form3.invite_placeholder')" border="none" color="#fff" shape="square" fontSize="16px" class="input"></u-input>
						</u-form-item>
            <!--
						<u-form-item prop="nickname" class="item">
							<u-input v-model="form3.nickname" type="text" :placeholder="$t('my.login.form3.nickname_placeholder')" border="none" color="#fff" shape="square" fontSize="16px" class="input"></u-input>
						</u-form-item>
            -->
						<u-form-item prop="">
							<u-checkbox-group @change="(value) => form3_agree = value.length > 0">
								<u-checkbox :label="$t('my.login.form3.agree')" labelColor="#fff" shape="circle" :name="1"></u-checkbox>
							</u-checkbox-group>
							<text class="agree_text" @click="$navigateTo('/pages/my/page?type=user_agreement',false)">{{$t('my.login.form3.agreement')}}</text>
						</u-form-item>
					</u--form>
					<view class="button_box">
						<u-button type="primary" shape="circle" :text="$t('my.login.button3.submit')" color="#D6AE40" class="button primary" :disabled="submit3.disabled" :loading="submit3.loading" loadingMode="circle" @click="submitForm3()"></u-button>
					</view>
				</view>
			</view>
		</view>

		<!--语言选择弹框-->
		<u-popup :show="lang.show" @close="lang.show=false" mode="center" :closeOnClickOverlay="true" round="30" borderRadius="30">
			<view class="popup_lang_box">
				<view class="list" @click="switchLang('en')">
					<img-cache :src="require('@/static/images/flag/gb.png')" width="30rpx" height="21rpx"></img-cache>
					<text class="name">English</text>
				</view>
				<view class="list" @click="switchLang('vi')">
					<img-cache :src="require('@/static/images/flag/vn.png')" width="30rpx" height="21rpx"></img-cache>
					<text class="name">Tiếng Việt</text>
				</view>
				<view class="close">
					<text class="iconfont icon-close-circle" @click="lang.show=false"></text>
				</view>
			</view>
		</u-popup>

    <tf-verify-img @succeed="verifyOk" @close="verifyHide" v-if="showVerify"></tf-verify-img>

  </view>
</template>

<script>
  import tfVerifyImg from '@/components/tf-verify-img/tf-verify-img.vue';
	export default {
    components:{tfVerifyImg},
		data() {
			return {
				version:'',
				nation_code:'84',
				send_info:{
					text:this.$t('my.login.button2.send'),
					time:300
				},
				send:{
					disabled:true,
					loading:false
				},
				send_info2:{
					text:this.$t('my.login.button3.send'),
					time:300
				},
				send2:{
					disabled:true,
					loading:false
				},
				type:'login',
				form1:{
          mobile:'',
					password:''
				},
				form1_password:true,
				form1_auto_login:false,
				rules1:{
          mobile: [
            {
              required: true,
              message: this.$t('my.login.data.rules.mobile.message0'),
              trigger: ['change','blur']
            },
            {
              pattern: /^[0-9]*$/g,
              transform(value) {
                return String(value);
              },
              message: this.$t('my.login.data.rules.mobile.message1'),
              trigger: ['change','blur']
            },
            {
              min: 8,
              max: 13,
              message: this.$t('my.login.data.rules.mobile.message2'),
              trigger: ['change','blur']
            }
          ],
					password: [
						{
							required: true,
							message: this.$t('my.login.data.rules.password.message0'),
							trigger: ['change','blur']
						},
						{
							min: 6,
							max: 15,
							message: this.$t('my.login.data.rules.password.message2'),
							trigger: ['change','blur']
						}
					],
				},
				submit1:{
					disabled:true,
					loading:false
				},
				form2:{
					password:'',
					repassword:'',
					mobile:'',
					smsCode:'',
					invite_code: '',
					nickname: '',
				},
				form2_password:true,
				form2_repassword:true,
				form2_agree: false,
				rules2:{
					password: [
						{
							required: true,
							message: this.$t('my.login.data.rules.password.message0'),
							trigger: ['change','blur']
						},
						{
							min: 6,
							max: 15,
							message: this.$t('my.login.data.rules.password.message2'),
							trigger: ['change','blur']
						}
					],
					repassword: [
						{
							required: true,
							message: this.$t('my.login.data.rules.repassword.message0'),
							trigger: ['change','blur']
						},
						{
							min: 6,
							max: 15,
							message: this.$t('my.login.data.rules.repassword.message2'),
							trigger: ['change','blur']
						}
					],
					mobile: [
						{
							required: true,
							message: this.$t('my.login.data.rules.mobile.message0'),
							trigger: ['change','blur']
						},
						{
							pattern: /^[0-9]*$/g,
							transform(value) {
								return String(value);
							},
							message: this.$t('my.login.data.rules.mobile.message1'),
							trigger: ['change','blur']
						},
						{
							min: 8,
							max: 13,
							message: this.$t('my.login.data.rules.mobile.message2'),
							trigger: ['change','blur']
						}
					],
					smsCode: [
						{
							required: true,
							message: this.$t('my.login.data.rules.smsCode.message0'),
							trigger: ['change','blur']
						},
						{
							pattern: /^[0-9]*$/g,
							transform(value) {
								return String(value);
							},
							message: this.$t('my.login.data.rules.smsCode.message1'),
							trigger: ['change','blur']
						},
						{
							min: 6,
							max: 6,
							message: this.$t('my.login.data.rules.smsCode.message2'),
							trigger: ['change','blur']
						}
					],
					invite_code: [
						{
							required: true,
							message: this.$t('my.login.data.rules.invite_code.message0'),
							trigger: 'blur'
						}
					],
					nickname: [
						{
							required: true,
							message: 'Please input nickname',
							trigger: ['change','blur']
						},
						{
							min: 2,
							max: 10,
							message: 'Length 2-10 characters',
							trigger: ['change','blur']
						}
					],
				},
				submit2:{
					disabled:true,
					loading:false
				},

				form3:{
					password:'',
					repassword:'',
					email:'',
					emailCode:'',
					invite_code: '',
					nickname: '',
				},
				form3_password:true,
				form3_repassword:true,
				form3_agree: false,
				rules3:{
					password: [
						{
							required: true,
							message: this.$t('my.login.data.rules.password.message0'),
							trigger: ['change','blur']
						},
						{
							min: 6,
							max: 15,
							message: this.$t('my.login.data.rules.password.message2'),
							trigger: ['change','blur']
						}
					],
					repassword: [
						{
							required: true,
							message: this.$t('my.login.data.rules.repassword.message0'),
							trigger: ['change','blur']
						},
						{
							min: 6,
							max: 15,
							message: this.$t('my.login.data.rules.repassword.message2'),
							trigger: ['change','blur']
						}
					],
					email: [
						{
							required: true,
							message: this.$t('my.login.data.rules.email.message0'),
							trigger: ['change','blur']
						},
						{
							pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g,
							transform(value) {
								return String(value);
							},
							message: this.$t('my.login.data.rules.email.message1'),
							trigger: ['change','blur']
						},
						{
							min: 6,
							max: 30,
							message: this.$t('my.login.data.rules.email.message2'),
							trigger: ['change','blur']
						}
					],
					emailCode: [
						{
							required: true,
							message: this.$t('my.login.data.rules.emailCode.message0'),
							trigger: ['change','blur']
						},
						{
							pattern: /^[0-9]*$/g,
							transform(value) {
								return String(value);
							},
							message: this.$t('my.login.data.rules.emailCode.message1'),
							trigger: ['change','blur']
						},
						{
							min: 6,
							max: 6,
							message: this.$t('my.login.data.rules.emailCode.message2'),
							trigger: ['change','blur']
						}
					],
					invite_code: [
						{
							required: true,
							message: this.$t('my.login.data.rules.invite_code.message0'),
							trigger: 'blur'
						}
					]
				},
				submit3:{
					disabled:true,
					loading:false
				},
				tips: '',
				seconds: 60,
				lang:{
					show:false
				},
				download:'',
				service:'',
				password_strength:0,

        showVerify: false,
        sendMethod: ''
			}
		},
		watch:{
			form1:{
				handler(){
					let s = this;
          if(s.form1.mobile != '' && s.form1.mobile != s.nation_code){
            s.submit1.disabled = false;
            return;
          }
					if(s.form1.mobile != '' && s.form1.password != ''){
						s.$refs.uform1.validate().then(res => {
							s.submit1.disabled = false;
						}).catch(errors => {
							s.submit1.disabled = true;
						})
					}else{
						s.submit1.disabled = true;
					}
				},
				immediate:true,
				deep:true
			},
			form2:{
				handler(){
					let s = this;
          if(s.form2.mobile.startsWith('0')) s.form2.mobile = s.form2.mobile.replace(/^0/g,'');
					if(s.form2.password != '' && s.form2.repassword != '' && s.form2.mobile != '' && s.form2.invite_code != '' && s.form2.smsCode != ''){
						s.$refs.uform2.validate().then(res => {
							s.submit2.disabled = false;
						}).catch(errors => {
							s.submit2.disabled = true;
						})
					}else{
						s.submit2.disabled = true;
					}
					if(s.form2.mobile != '' && s.form2.mobile != s.nation_code && s.send_info.time == 300){
						s.send.disabled = false;
					}else{
						s.send.disabled = true;
					}
					if(s.form2.password != ''){
						var pass = s.form2.password;
						// 弱密码：全是数字或全是字母，6-15个字符
						const weakReg = /^[0-9]{6,15}$|^[a-zA-Z]{6,15}$/;
						// 中密码：数字和26个英文字母，6-15个字符
						const mediumReg = /^[A-Za-z0-9]{6,15}$/;
						// 强密码：由数字、26个英文字母或者下划线组成的字符串，6-15个字符
						const strongReg = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,15}/;

						if(pass.match(weakReg)) {
							s.password_strength = 1;
						}else if(pass.match(mediumReg)) {
							s.password_strength = 2;
						}else if(pass.match(strongReg)) {
							s.password_strength = 3;
						}else{
							s.password_strength = 0;
						}
					}
				},
				immediate:true,
				deep:true
			},
			send_info:{
				handler(){
					let s = this;
					if(s.form2.mobile != '' && s.form2.mobile != s.nation_code && s.send_info.time == 300){
						s.send.disabled = false;
					}else{
						s.send.disabled = true;
					}
				},
				immediate:true,
				deep:true
			},
			form3:{
				handler(){
					let s = this;
					if(s.form3.password != '' && s.form3.repassword != '' && s.form3.email != '' && s.form3.invite_code != '' && s.form3.emailCode != ''){
						s.$refs.uform3.validate().then(res => {
							s.submit3.disabled = false;
						}).catch(errors => {
							s.submit3.disabled = true;
						})
					}else{
						s.submit3.disabled = true;
					}

					if(s.form3.email != '' && s.send_info2.time == 300){
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
					if(s.form3.mobile != '' && s.send_info2.time == 300){
						s.send2.disabled = false;
					}else{
						s.send2.disabled = true;
					}
				},
				immediate:true,
				deep:true
			}
		},
		onLoad() {
			let s = this;
			// #ifdef APP-PLUS
			setTimeout(function() {
				plus.navigator.closeSplashscreen();
			}, 1000);
			// #endif
			// #ifdef APP-PLUS
			s.version = plus.runtime.version;
			// #endif
			if(uni.getStorageSync('login')){
				let login = uni.getStorageSync('login');
				login = login.split('###');
				s.form1.mobile = login[0];
				s.form1.password = login[1];
				s.form1_auto_login = true;
			}
			if(uni.getStorageSync('invite_code')){
				s.form2.invite_code = uni.getStorageSync('invite_code');
				s.form3.invite_code = uni.getStorageSync('invite_code');
			}


			s.getDownloadLink();
			s.getService();
		},
		onShow() {
			let s = this;
			if(uni.getStorageSync('country_code')){
				s.nation_code = uni.getStorageSync('country_code').tel;
			}
			uni.setNavigationBarTitle({
				title:this.$t('my.login.navbar_title')
			})
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
			getService(){
				let s = this;
				uni.$u.http.get('/?s=App.CustomerService_Cs.CustomerServieIndex').then(res => {
					console.log('服务信息');
					console.log(res);
					if(res.data.ret == 200){
						s.service = res.data.data;
					}
				})
			},
			getDownloadLink(){
				let s = this;
				uni.$u.http.get('/?s=App.ConfigData_ConfigData.GetDownloadUrl').then(res => {
					console.log('获取下载地址信息');
					console.log(res);
					if(res.data.ret == 200){
						s.download = res.data.data;
						uni.setStorageSync('download',res.data.data);
					}
				})
			},
			openDownload(){
				let s = this;
				//#ifdef H5
				s.$navigateTo('/pages/my/download?lang='+s.$i18n.locale)
				//#endif
				//#ifdef APP-PLUS
				plus.runtime.openURL(s.download.h5_url + '/#/pages/my/download?lang='+s.$i18n.locale);
				//#endif
			},
			confirmNation(e){
				let s = this;
				s.nation_code = e.value[0].code;
				s.nation.show = false;
			},
			switchLang(lang){
				let s = this;
				s.$i18n.locale = lang;
				uni.setStorageSync('lang',lang);
				s.lang.show = false;
				s.$redirectTo('/pages/my/login');
			},
			submitForm1(){
				let s = this;
				s.$refs.uform1.validate().then(verify => {
					var params = {
						username:s.nation_code+s.form1.mobile,
						password:s.form1.password
					};

					let system = uni.getStorageSync('system');
					//#ifdef APP-PLUS
					params.brand = system.brand;
					//#endif
					params.model = system.model;
					//#ifdef APP-PLUS
					params.version = plus.runtime.version;
					//#endif
					//#ifdef APP-PLUS
					params.platform = system.platform;
					//#endif
					//#ifdef H5
					params.platform = system.platform +'-H5';
					//#endif
					params.deviceId = system.deviceId;
					params.system = system.system;

					s.submit1 = { disabled: true, loading: true };
					uni.$u.http.post('/?s=App.User_User.Login',params).then(res => {
						console.log('登录',res);
						if(res.data.ret == 200) {
							let result = res.data.data;
							s.$toast(s.$t('my.login.toast.success'));
							uni.setStorageSync('token',result.token);
							uni.setStorageSync('user_id',result.user_id);
							if(s.form1_auto_login){
								uni.setStorageSync('login',s.form1.mobile+'###'+s.form1.password);
							}else{
								uni.removeStorageSync('login');
							}
							s.getUser(result.user_id,result.token);
						} else {
							s.$toast(res.data.msg);
						}
						s.submit1 = { disabled: false, loading: false };
					})
				})
			},
			submitForm2(){
				let s = this;
				console.log('s.form2_agree',s.form2_agree)
				if(!s.form2_agree) {
					s.$toast(s.$t('my.login.toast.need_agree'));
					return;
				}
				s.$refs.uform2.validate().then(verify => {
					var params = {
						// username:s.form2.username,
						password:s.form2.password,
						repassword:s.form2.repassword,
						mobile:s.nation_code+s.form2.mobile,
						smsCode:s.form2.smsCode,
						invite_code: s.form2.invite_code,
						nickname: s.form2.nickname,
					};
					for(let key in params) !params[key]&& delete params[key]
					s.submit2 = { disabled: true, loading: true };
					uni.$u.http.post('/?s=App.User_User.Register',params).then(res => {
						console.log('注册',res)
						if(res.data.ret == 200) {
							s.$toast(s.$t('my.login.toast.success'));
							setTimeout(() => {
								s.type = 'login';
							}, 1000);
						} else {
							s.$toast(res.data.msg);
						}
						s.submit2 = { disabled: false, loading: false };
					})
				})
			},
			getUser(user_id,token){
				let s = this;
				uni.$u.http.post('/?s=App.User_User.Profile',{}, {
					params: {user_id:user_id,token:token}
				}).then(res => {
					console.log('获取用户信息');
					console.log(res);
					if(res.data.ret == 200){
						s.$toast(s.$t('my.login.toast.success'));
						uni.setStorageSync('user',res.data.data.profile);
						setTimeout(function() {
							uni.reLaunch({
								url:'/pages/home/index'
							})
						}, 500);
					}
				})
			},
			sendForm(){
				let s = this;
        if(!s.showVerify) {
          s.showVerify = true;
          s.sendMethod = 'sendForm';
          return;
        }
				if(s.form2.mobile != '' && s.send_info.time == 300){}else{
					s.$toast(s.$t('my.login.toast.illegal_operation'))
					return false;
				}
				s.send.disabled = true;
				s.send.loading = true;

				var data = {
					mobile:s.nation_code+s.form2.mobile,
					send_type:0
				};
				uni.$u.http.post('/?s=App.User_User.SendSmsCodeByYTG',data).then(res => {
					console.log('发短信');
					console.log(res);
					if(res.data.ret == 200){
						s.sendFormTime();
						s.$toast(s.$t('my.login.toast.success'));
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
					s.send_info.text = s.$t('my.login.button2.send');
					s.send_info.time = 300;
					clearInterval(clock);
				  }
				},1000);
			},
			sendForm2(){
				let s = this;
        if(!s.showVerify) {
          s.showVerify = true;
          s.sendMethod = 'sendForm2';
          return;
        }
				if(s.form3.email != '' && s.send_info2.time == 300){}else{
					s.$toast(s.$t('my.login.toast.illegal_operation'))
					return false;
				}
				s.send2.disabled = true;
				s.send2.loading = true;

				var data = {
					email:s.form3.email,
					send_type:0
				};
				uni.$u.http.post('/?s=App.User_User.SendEmailCode',data).then(res => {
					console.log('发邮件');
					console.log(res);
					if(res.data.ret == 200){
						s.sendFormTime2();
						s.$toast(s.$t('my.login.toast.success'));
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
					s.send_info2.text = s.$t('my.login.button3.send');
					s.send_info2.time = 300;
					clearInterval(clock2);
				  }
				},1000);
			},
			submitForm3(){
				let s = this;
				console.log('s.form3_agree',s.form3_agree)
				if(!s.form3_agree) {
					s.$toast(s.$t('my.login.toast.need_agree'));
					return;
				}

				s.$refs.uform3.validate().then(verify => {
					var params = s.form3;
					s.submit3 = { disabled: true, loading: true };
					uni.$u.http.post('/?s=App.User_User.EmailRegister',s.form3).then(res => {
						console.log('邮箱注册');
						console.log(res);
						if(res.data.ret == 200){
							s.$toast(s.$t('my.login.toast.success'));
							setTimeout(() => {
								s.type = 'login';
							}, 1000);
						}else{
							s.$toast(res.data.msg);
						}
						s.submit3 = { disabled: false, loading: false };
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.my_login{
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: #999 url(../../static/images/my/login_bg.jpg) no-repeat center center;
		background-size: cover;
		z-index: 1;
		.lang_box{
			position: fixed;
			bottom: 30rpx;
			left: 0;
			height: 44rpx;
			line-height: 44rpx;
			color: #fff;
			font-size: 24rpx;
			width: 100%;
			text-align: center;
			display: flex;
			justify-content: center;
			.img-cache{
				margin: 10rpx 0 0 0;
			}
			.lang_current{
				margin: 0 15rpx;
			}
			.iconfont{
				font-size: 24rpx;
			}
		}
		.logo_box{
			text-align: center;
			margin-top: var(--status-bar-height);
			padding: 90rpx 0 60rpx 0;
			padding-bottom: 60rpx;
		}
		.chat_box{
			position: absolute;
			right: 30rpx;
			top: 30rpx;
		}
		.tab_box{
			height: 100%;
			padding: 0 60rpx;
			.tab_title{
				margin-bottom: 30rpx;
				.cell{
					color: #C4C7CC;
					border-bottom: 4rpx solid rgba(0,0,0,0);
					font-size: 36rpx;
					height: 75rpx;
					line-height: 75rpx;
					display: inline-block;
					margin-right: 30rpx;
					&:last-child{
						margin-right: 0;
					}
				}
				.cur{
					color: #fff;
					border-bottom: 4rpx solid #fff;
				}
			}
			.tab_content{
				width: 100%;
				height: 60%;
				overflow-y: scroll;
				.cell{
					display: none;
					.form{
						.item{
							.input{
								height: 88rpx;
								line-height: 88rpx;
								padding: 0;
								border-bottom: 1rpx solid #fff;
								border-radius: 0;
								.iconfont{
									margin-top: 7.5rpx;
								}
								.icon-eye-close{
									color: #fff;
								}
								.icon-eye{
									color: #D6AE40;
								}
							}
							.passwordStrength{
								display: flex;
								.ps{
									background: rgba(255, 255, 255, 0.5);
									width: 120rpx;
									height: 15rpx;
									display: inline-block;
									margin: 0 7.5rpx 0 0;
								}
								.ps1{
									background: red;
								}
								.ps2{
									background: orange;
								}
								.ps3{
									background: green;
								}
							}
						}
						.agree_text{
							color: #fff;
							margin-left: 10rpx;
						}
					}
					.button_box{
						.button{
							margin-top: 30rpx;
							height: 96rpx;
						}
						.primary{
							border: 1rpx solid #D6AE40;
						}
						.default{
							background: none;
							color: #fff;
							border: 1rpx solid #fff;
						}
					}
					.version_box{
						padding: 30rpx 0;
						color: #fff;
						text-align: center;
					}
				}
				.cur{
					display: block;
				}
			}
		}
	}

	.popup_lang_box{
		background: #fff;
		padding: 30rpx 45rpx;
		border-radius: 30rpx;
		width: 480rpx;
		position: relative;
		.list{
			height: 44rpx;
			line-height: 44rpx;
			display: flex;
			margin: 15rpx 0;
			.img-cache{
				margin: 10rpx 0 0 0;
			}
			.name{
				margin-left: 30rpx;
				font-size: 24rpx;
			}
		}
		.close{
			position: absolute;
			bottom: -120rpx;
			left: 0;
			width: 100%;
			text-align: center;
			.iconfont{
				color: #fff;
				font-size: 60rpx;
			}
		}
	}

	.popup_forget_box{
		padding: 60rpx 30rpx 30rpx 30rpx;
		position: relative;
		.close{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			text-align: center;
			line-height: 30rpx;
			height: 30rpx;
			.line{
				background: #C4C7CC;
				height: 7.5rpx;
				width: 150rpx;
				display: inline-block;
			}
		}
	}
</style>