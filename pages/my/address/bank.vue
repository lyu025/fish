<template>
	<view class="pages my_address_detail">
		<view class="content">
			<view class="form">
				<u--form labelPosition="top" ref="form1" :model="form" :rules="rules">
					<u-form-item labelWidth="100%" prop="bank_name" ref="item1">
            <u-input v-model="form.bank_name" type="text" readonly :placeholder="$t('my.address.index.form.bankname_placeholder')" :disabled="type=='edit'">
              <template slot="suffix">
                <text @click="$navigateTo(`/pages/my/banks`)" class='suffix-select'>{{$t('my.address.index.select')}}</text>
              </template>
            </u-input>
          </u-form-item>
					<u-form-item labelWidth="100%" prop="card_num" ref="item1">
						<u--input v-model="form.card_num" type="text" :placeholder="$t('my.address.index.form.card_num_placeholder')" :disabled="type=='edit'" ></u--input>
					</u-form-item>
					<u-form-item labelWidth="100%" prop="real_name" ref="item1">
						<u--input v-model="form.real_name" type="text" :placeholder="$t('my.address.index.form.real_name_placeholder')" :disabled="type=='edit'" ></u--input>
					</u-form-item>
          <!--
					<u-form-item labelWidth="100%" prop="remark" ref="item1">
						<u&#45;&#45;input v-model="form.remark" type="text" :placeholder="$t('my.address.index.form.remarks_placeholder')" :disabled="type=='edit'" ></u&#45;&#45;input>
					</u-form-item>
          -->
          <u-form-item label="" prop="mobile" class="item">
            <u-input v-model="form.mobile" type="number" readonly fontSize="16px" class="input" maxlength="30">
              <template slot="prefix">
                <text>+</text>
              </template>
            </u-input>
          </u-form-item>
					<u-form-item prop="smsCode" class="item">
						<u-input v-model="form.smsCode" type="text" :placeholder="$t('my.address.index.form.sms_code_placeholder')"  fontSize="16px" class="input">
							<template slot="suffix">
								<u-button size="small" :text="send_info.text" type="info" color="#D6AE40" :disabled="send.disabled" :loading="send.loading"
                    @click="sendForm()" :customStyle="{'height':'36rpx'}"></u-button>
							</template>
						</u-input>
					</u-form-item>
				</u--form>
				<u-button
					size="normal"
					type="primary" color="#D6AE40" @click="submitForm"
					:text="$t('my.usdt.detail.button.submit')"
					:loading="submit.loading"
					:disabled="submit.disabled"
					:customStyle="{'margin':'30rpx 0 0 0'}"
					v-if="type == 'add'"></u-button>
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
				type:'add',
				form:{
					bank_name:'',
					card_num:'',
					real_name:'',
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
					'bank_name': [
						{
							type: 'string',
							required: true,
							message: this.$t('my.address.index.form.bankname_placeholder'),
							trigger: ['blur', 'change']
						}
					],
					'card_num': [
						{
							type: 'string',
							required: true,
							message: this.$t('my.address.index.form.card_num_placeholder'),
							trigger: ['blur', 'change']
						}
					],
					'real_name': [
						{
							type: 'string',
							required: true,
							message: this.$t('my.address.index.form.real_name_placeholder'),
							trigger: ['blur', 'change']
						},
						{
							pattern: /^[\s+A-Z]*$/g,
							transform(value) {
								return String(value);
							},
							message: this.$t('my.address.index.form.real_name_placeholder2'),
							trigger: ['change','blur']
						}
					],
					mobile: [
						{
							required: true,
							message: this.$t('my.address.index.form.mobile_placeholder'),
							trigger: ['change','blur']
						},
						{
							pattern: /^[0-9]*$/g,
							transform(value) {
								return String(value);
							},
							message: this.$t('my.address.index.form.just_num_regex_error'),
							trigger: ['change','blur']
						},
						{
							min: 6,
							max: 30,
							message: this.$t('my.address.index.form.len_8_13_error'),
							trigger: ['change','blur']
						}
					],
					smsCode: [
						{
							required: true,
							message: this.$t('my.address.index.form.sms_code_placeholder'),
							trigger: ['change','blur']
						},
						{
							pattern: /^[0-9]*$/g,
							transform(value) {
								return String(value);
							},
							message: this.$t('my.address.index.form.just_num_regex_error'),
							trigger: ['change','blur']
						},
						{
							min: 6,
							max: 6,
							message: this.$t('my.address.index.form.len_6_error'),
							trigger: ['change','blur']
						}
					]
				},
				submit:{
					loading:false,
					disabled:true
				},

        showVerify: false,
			}
		},
		watch:{
			form:{
				handler(){
					let s = this, cardNum = s.form.card_num.replace(/\s/g, '');
					  if(cardNum !== '') {
						uni.$u.http.post('/?s=App.Bank_Bank.CheckBankCard', {card_num:cardNum}).then(r => {
						  if(r.data.msg) {
							s.$toast(r.data.msg);
							s.submit.disabled = true;
						  }
						})
					  }

						let reg_real_name = /^[\s+A-Z]*$/g;
						let reg_mobile = /^[0-9]*$/g;
						let reg_smsCode = /^[0-9]*$/g;
					  if(reg_real_name.test(s.form.real_name) && reg_mobile.test(s.form.mobile) && reg_smsCode.test(s.form.smsCode)){
						  s.submit.disabled = s.form.bank_name == '' || s.form.card_num == '' || s.form.real_name == '' || s.form.mobile == '' || s.form.smsCode == '';
					  }

					s.send.disabled = s.send_info.time != 60;
					if(s.form.card_num !== cardNum) s.form.card_num = cardNum;
				},
				immediate:true,
				deep:true
			},
			send_info:{
				handler(){
          this.send.disabled = this.send_info.time != 60;
				},
				immediate:true,
				deep:true
			},
		},
		onLoad() {
			uni.setNavigationBarTitle({title:this.$t('my.usdt.detail.navbar_title')});
		},
		onShow() {
			let s = this;
      if(uni.getStorageSync('bank_code')) s.$set(s.form, 'bank_name', uni.getStorageSync('bank_code'));
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
				if(s.send_info.time != 60){
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
				if(s.form.bank_name == '' || s.form.card_num == '' || s.form.real_name == '' || s.form.mobile == '' || s.form.smsCode == ''){
					s.$toast('illegal operation')
					return false;
				}
				s.submit.disabled = true;
				s.submit.loading = true;
				const params = {
					bank_name:s.form.bank_name,
					card_num:s.form.card_num,
					real_name:s.form.real_name,
					remark:s.form.remark,
					mobile:s.form.mobile,
					smsCode:s.form.smsCode
				};
        const url = 'App.Bank_Bank.AddBankcard';
				uni.$u.http.post('/?s='+url,{}, {params: params}).then(res => {
					console.log('添加或编辑银行卡');
					console.log(res);
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
	.content{
		padding: 30rpx;
    .suffix-select{background:#D6AE40;color:white;padding:0 20rpx;margin-top:-30rpx;margin-right:-18rpx;margin-bottom:-30rpx;height:72rpx;line-height:72rpx}
	}
</style>