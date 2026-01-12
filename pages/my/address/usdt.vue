<template>
	<view class="pages my_address_detail">
		<view class="content">
			<view class="form">
				<u--form labelPosition="top" ref="form1" :model="form" :rules="rules">
					<u-form-item label="" labelWidth="100%" prop="network" ref="item1">
						<u--input v-model="form.network" type="text" :placeholder="$t('my.usdt.detail.form.item1_placeholder')" :disabled="true" ></u--input>
					</u-form-item>
					<u-form-item label="" labelWidth="100%" prop="address" ref="item1">
						<u--input v-model="form.address" type="text" :placeholder="$t('my.usdt.detail.form.item2_placeholder')" :disabled="type=='edit'" ></u--input>
					</u-form-item>
					<u-form-item label="" labelWidth="100%" prop="username" ref="item1">
						<u--input v-model="form.username" type="text"  :placeholder="$t('my.usdt.detail.form.item3_placeholder')" :disabled="type=='edit'" ></u--input>
					</u-form-item>
<!-- 					<u-form-item label="" labelWidth="100%" prop="remark" ref="item1">
						<u--input v-model="form.remark" type="text" :placeholder="$t('my.usdt.detail.form.item4_placeholder')" :disabled="type=='edit'" ></u--input>
					</u-form-item> -->
					<u-form-item label="" prop="mobile" class="item">
						<u-input v-model="form.mobile" type="number" readonly fontSize="16px" class="input" maxlength="30">
							<template slot="prefix">
								<text>+</text>
							</template>
						</u-input>
					</u-form-item>
					<u-form-item label="" prop="smsCode" class="item">
						<u-input v-model="form.smsCode" type="text" :placeholder="$t('my.forget.form.smsCode_placeholder')"  fontSize="16px" class="input">
							<template slot="suffix">
								<u-button size="small" :text="send_info.text" type="info" color="#D6AE40"  :disabled="send.disabled" :loading="send.loading" @click="sendForm()" :customStyle="{'height':'36rpx'}"></u-button>
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
					v-if="type == 'add'"
				></u-button>
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
				loading:true,
				type:'add',
				form:{
					network:'TRC-20',
					address:'',
					username:'',
					mobile:'',
					smsCode:'',
					remark:''
				},
				send_info:{
					text:this.$t('my.forget.button.send'),
					time:60
				},
				send:{
					disabled:true,
					loading:false
				},
				rules:{
					'network': [
						{
							type: 'string',
							required: true,
							message: this.$t('my.usdt.detail.data.rules.network.message0'),
							trigger: ['blur', 'change']
						}
					],
					'address': [
						{
							type: 'string',
							required: true,
							message: this.$t('my.usdt.detail.data.rules.address.message0'),
							trigger: ['blur', 'change']
						}
					],
					'username': [
						{
							type: 'string',
							required: true,
							message: this.$t('my.usdt.detail.data.rules.username.message0'),
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
          let s = this, address = s.form.address.replace(/\s/g, '');
          if(address !== '') {
            uni.$u.http.post('/?s=App.Usdt_Usdt.CheckUsdtAddress', {address:address}).then(r => {
              if(r.data.msg) {
                s.$toast(r.data.msg);
                s.submit.disabled = true;
              }
            })
          }
          s.submit.disabled = s.form.network == '' || s.form.address == '' || s.form.username == '' || s.form.mobile == '' || s.form.smsCode == '';
          s.send.disabled = s.send_info.time != 60;
          if(s.form.address !== address) s.form.address = address;
				},
				immediate:true,
				deep:true
			},
			send_info:{
				handler(){
          this.send.disabled = this.send_info.time == 60;
				},
				immediate:true,
				deep:true
			},
		},
		onLoad() {
			uni.setNavigationBarTitle({title:this.$t('my.usdt.detail.navbar_title')})
		},
		onShow() {
			let s = this;
      uni.$u.http.post('/?s=App.User_User.Profile').then(res => {
        if(res.data.ret == 200){
          const user = res.data.data.profile;
          uni.setStorageSync('user',user);
          s.form.mobile = user.tel;
          setTimeout(() => s.loading = false, 1000);
        }else{
          s.$toast(res.data.msg);
        }
      })
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
				if(s.form.mobile != '' && s.send_info.time == 60){}else{
					s.$toast(s.$t('my.forget.toast.illegal_operation'))
					return false;
				}
				s.send.disabled = true;
				s.send.loading = true;
				const data = {mobile:s.form.mobile,send_type:2};
				uni.$u.http.post('/?s=App.User_User.SendSmsCodeByYTG',data).then(res => {
					console.log('找回密码发短信');
					console.log(res);
					if(res.data.ret == 200){
						s.sendFormTime();
						s.$toast(s.$t('my.forget.toast.success'));
					}else{
						s.$toast(res.data.msg);
					}
					s.send.disabled = false;
					s.send.loading = false;
				})
			},
			sendFormTime(){
				let s = this;
				let clock = setInterval(() => {
				  s.send_info.time--;
				  s.send_info.text = s.send_info.time + 's';
				  if(s.send_info.time == 0){
					s.send.disabled = false;
					s.send_info.text = s.$t('my.forget.button.send');
					s.send_info.time = 60;
					clearInterval(clock);
				  }
				},1000);
			},
			submitForm(){
				let s = this;
				if(s.form.network == '' || s.form.address == '' || s.form.username == '' || s.form.mobile == '' || s.form.smsCode == ''){
					s.$toast('illegal operation')
					return false;
				}
				s.submit.disabled = true;
				s.submit.loading = true;
				const params = {
					network:s.form.network,
					address:s.form.address,
					username:s.form.username,
					remark:s.form.remark,
					mobile:s.form.mobile,
					smsCode:s.form.smsCode
				};
        const url = 'App.Usdt_Usdt.AddUsdtcard';
				uni.$u.http.post('/?s='+url,{}, {params: params}).then(res => {
					console.log('添加或编辑USDT');
					if(res.data.ret == 200){
						s.$toast(s.$t('my.usdt.detail.toast.success'));
						setTimeout(uni.navigateBack, 500);
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
	.content{padding:30rpx}
</style>