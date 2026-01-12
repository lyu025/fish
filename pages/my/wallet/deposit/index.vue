<template>
	<view class="pages my_deposit_index">
		<view class="content">
			<view class="form_box" v-if="step==1">
				<view class="box_title">{{$t('my.wallet.recharge.index.form.price_label')}}</view>
				<u--form class="form" :model="form" :rules="rules" ref="uform">
					<u-form-item label="" prop="price" class="item">
						<u-input v-model="form.price" type="number" :placeholder="$t('my.wallet.recharge.index.form.price_placeholder')" class="price_input">
							<text slot="prefix">$</text>
						</u-input>
					</u-form-item>
					<view class="price_box">
						<view class="item" v-for="(item,index) in price" :key="index">
							<view class="number" :class="{'cur':form.price==item}" @click="form.price=item">${{item}}</view>
						</view>
					</view>
					<view class="button_box">
						<u-button type="primary" color="#D6AE40" :text="$t('my.wallet.recharge.index.navbar_title')" :customStyle="{'font-size':'32rpx'}" :disabled="submit.disabled" :loading="submit.loading" loadingMode="circle" @click="submitForm()"></u-button>
					</view>
				</u--form>
			</view>
			<view class="form_box2" v-else-if="step==2">
				<view class="card_box" v-for="(item,index) in receive" :key="index" @click="submitForm2(item)">
					<view class="card_title">{{$t('my.wallet.recharge.index.select_payment_channel')}}<text class="iconfont icon-arrowright"></text></view>
					<view class="card_content" v-if="item.type == 1">
						<view class="image" v-if="item.img">
							<img-cache mode="aspectFill" :src="item.img"></img-cache>
						</view>
						<view class="info">
							<view class="info_title network">{{item.agreement}}</view>
							<view class="address">{{item.address}}</view>
						</view>
					</view>
					<view class="card_content" v-else-if="item.type == 2">
						<view class="image" v-if="item.img">
							<img-cache mode="aspectFill" :src="item.img"></img-cache>
						</view>
						<view class="info">
							<view class="info_title bank">{{item.agreement}}</view>
							<view class="number">{{item.address}}</view>
							<view class="name">{{item.cardholder}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="form_box3" v-else-if="step==3">
				<view class="box_title">{{$t('my.wallet.recharge.index.step3.t1')}}</view>
				<view class="box_desc">{{$t('my.wallet.recharge.index.step3.t2')}}: {{$t('my.wallet.recharge.index.min_5')}}</view>
				<view class="qrcode" @longtap="saveQr()" v-if="type=='usdt'">
					<uqrcode ref="uQRCode" :text="receive2.address" v-if="receive2" style="display: inline-block;" :size="86" />
				</view>
				<view class="img" v-else-if="type=='bank'">
					<img-cache mode="widthFix" :src="receive2.img"></img-cache>
				</view>
				<view class="detail_box" v-if="type=='bank'">
					<view class="cell">
						<view class="info">
							<view class="label">{{$t('my.wallet.recharge.index.step3.t8')}}</view>
							<view class="value">{{user.username}}</view>
						</view>
						<view class="button">
							<u-button type="primary" shape="circle" size="mini" :text="$t('my.wallet.recharge.index.button.copy')" color="#D6AE40" @click="$copy(user.username,$t('my.wallet.recharge.index.toast.success'))"></u-button>
						</view>
					</view>
					<view class="cell">
						<view class="info">
							<view class="label">{{$t('my.wallet.recharge.index.step3.t9')}}</view>
							<view class="value">{{receive2.agreement}}</view>
						</view>
						<view class="button">
							<u-button type="primary" shape="circle" size="mini" :text="$t('my.wallet.recharge.index.button.copy')" color="#D6AE40" @click="$copy(receive2.agreement,$t('my.wallet.recharge.index.toast.success'))"></u-button>
						</view>
					</view>
					<view class="cell">
						<view class="info">
							<view class="label">{{$t('my.wallet.recharge.index.step3.t10')}}</view>
							<view class="value">{{receive2.address}}</view>
						</view>
						<view class="button">
							<u-button type="primary" shape="circle" size="mini" :text="$t('my.wallet.recharge.index.button.copy')" color="#D6AE40" @click="$copy(receive2.address,$t('my.wallet.recharge.index.toast.success'))"></u-button>
						</view>
					</view>
					<view class="cell">
						<view class="info">
							<view class="label">{{$t('my.wallet.recharge.index.step3.t11')}}</view>
							<view class="value">{{receive2.cardholder}}</view>
						</view>
						<view class="button">
							<u-button type="primary" shape="circle" size="mini" :text="$t('my.wallet.recharge.index.button.copy')" color="#D6AE40" @click="$copy(receive2.cardholder,$t('my.wallet.recharge.index.toast.success'))"></u-button>
						</view>
					</view>
					<view class="cell">
						<view class="info">
							<view class="label">{{$t('my.wallet.recharge.index.step3.t12')}}</view>
							<view class="value">{{receive2.exchange_rate}}</view>
						</view>
						<view class="button">
							<u-button type="primary" shape="circle" size="mini" :text="$t('my.wallet.recharge.index.button.copy')" color="#D6AE40" @click="$copy(receive2.exchange_rate,$t('my.wallet.recharge.index.toast.success'))"></u-button>
						</view>
					</view>
					<view class="cell">
						<view class="info">
							<view class="label">{{$t('my.wallet.recharge.index.step3.t5')}}</view>
							<view class="value value2"></view>
						</view>
						<view class="button">
							<u-button type="primary" shape="circle" size="mini" :text="$t('my.wallet.recharge.index.button.copy')" color="#D6AE40" @click="$copy(form.price,$t('my.wallet.recharge.index.toast.success'))"></u-button>
						</view>
						<view class="more">
							<u-input type="number" :placeholder="$t('my.wallet.recharge.index.form.postscript_placeholder')" v-model="form.price">
								<text slot="prefix">$</text>
							</u-input>
							<!--
							<u-button v-if="postscript" style="color: #D6AE40;" size="mini" text="Confirm" :loading="exchange.loading" :disabled="exchange.disabled" @click="getDeposit()"></u-button>
							<u-button v-else size="mini" text="Confirm" :loading="exchange.loading" :disabled="exchange.disabled" @click="getDeposit()"></u-button>
							-->
						</view>
					</view>
					<view class="cell cell2" v-if="form.price">
						<view class="info">
							<view class="label">{{$t('my.wallet.recharge.index.step3.t4')}}</view>
							<view class="value">₫{{$accMul(receive2.exchange_rate,form.price).toFixed(0)}}</view>
						</view>
						<view class="button">
							<u-button type="primary" shape="circle" size="mini" :text="$t('my.wallet.recharge.index.button.copy')" color="#D6AE40" @click="$copy(deposit_amount,$t('my.wallet.recharge.index.toast.success'))"></u-button>
						</view>
					</view>
					<view class="upload">
						{{$t('my.wallet.recharge.index.step3.t13')}}
					</view>
				</view>
				<view class="detail_box" v-else-if="type=='usdt'">
					<view class="cell">
						<view class="info">
							<view class="label">{{$t('my.wallet.recharge.index.step3.t8')}}</view>
							<view class="value">{{user.username}}</view>
						</view>
						<view class="button">
							<u-button type="primary" shape="circle" size="mini" :text="$t('my.wallet.recharge.index.button.copy')" color="#D6AE40" @click="$copy(user.username,$t('my.wallet.recharge.index.toast.success'))"></u-button>
						</view>
					</view>
					<view class="cell">
						<view class="info">
							<view class="label">{{$t('my.wallet.recharge.index.step3.t3')}}</view>
							<view class="value">{{receive2.address}}</view>
						</view>
						<view class="button">
							<u-button type="primary" shape="circle" size="mini" :text="$t('my.wallet.recharge.index.button.copy')" color="#D6AE40" @click="$copy(receive2.address,$t('my.wallet.recharge.index.toast.success'))"></u-button>
						</view>
					</view>

					<view class="cell">
						<view class="info">
							<view class="label">{{$t('my.wallet.recharge.index.step3.t12')}}</view>
							<view class="value">{{receive2.exchange_rate}}</view>
						</view>
						<view class="button">
							<u-button type="primary" shape="circle" size="mini" :text="$t('my.wallet.recharge.index.button.copy')" color="#D6AE40" @click="$copy(receive2.exchange_rate,$t('my.wallet.recharge.index.toast.success'))"></u-button>
						</view>
					</view>
					<view class="cell">
						<view class="info">
							<view class="label">{{$t('my.wallet.recharge.index.step3.t5')}}</view>
							<view class="value value2">
							</view>
						</view>
						<view class="button">
							<u-button type="primary" shape="circle" size="mini" :text="$t('my.wallet.recharge.index.button.copy')" color="#D6AE40" @click="$copy(form.price,$t('my.wallet.recharge.index.toast.success'))"></u-button>
						</view>
						<view class="more">
							<u-input type="number" :placeholder="$t('my.wallet.recharge.index.form.postscript_placeholder')" v-model="form.price">
								<text slot="prefix">$</text>
							</u-input>
              <!--
 							<u-button v-if="postscript" style="color: #D6AE40;" size="mini" text="Confirm" :loading="exchange.loading" :disabled="exchange.disabled" @click="getDeposit()"></u-button>
							<u-button v-else size="mini" text="Confirm" :loading="exchange.loading" :disabled="exchange.disabled" @click="getDeposit()"></u-button>
              -->
						</view>
					</view>
					<view class="cell cell2" v-if="form.price">
						<view class="info">
							<view class="label">{{$t('my.wallet.recharge.index.step3.t4')}}</view>
							<view class="value">U{{$accMul(receive2.exchange_rate,form.price).toFixed(2)}}</view>
						</view>
						<view class="button">
							<u-button type="primary" shape="circle" size="mini" :text="$t('my.wallet.recharge.index.button.copy')" color="#D6AE40" @click="$copy(deposit_amount,$t('my.wallet.recharge.index.toast.success'))"></u-button>
						</view>
					</view>
					<view class="upload">
						<view class="title">{{$t('my.wallet.recharge.index.step3.t6')}}</view>
						<u-upload
							:fileList="fileList1"
							@afterRead="afterRead"
							@delete="deletePic"
							name="1"
							multiple
							:maxCount="1"
						></u-upload>
						<view class="upload_tips">{{$t('my.wallet.recharge.index.step3.t7')}}</view>
					</view>
				</view>
				<view class="input" v-if="type=='usdt'">
					<view class="title">{{$t('my.wallet.recharge.index.form.address_label')}}</view>
					<u-input type="text" v-model="form.user_pay_name" :placeholder="$t('my.wallet.recharge.index.form.address_placeholder')"></u-input>
				</view>
				<view class="btn">
					<u-button
						size="normal"
						type="primary"
						:text="$t('my.wallet.recharge.index.button.submit')"
						color="#D6AE40"
						shape="circle"
						:loading="submit3.loading"
						:disabled="submit3.disabled"
						@click="submitForm3()"
					></u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	//#ifdef H5
	import h5Copy from '@/common/utils/junyi-h5-copy.js'
	//#endif
	export default {
		data() {
			return {
				step:3,
				type:'',
				receive:[],
				receive2:'',
				form:{
					price:'',
					address_id:'',
					img_url:'',
					user_pay_name:''
				},
				rules: [],
				price:[100,300,1000,3000,5000,10000,20000,30000,48000],
				submit:{
					disabled:true,
					loading:false
				},
				submit3:{
					disabled:true,
					loading:false
				},
				exchange:{
					disabled:true,
					loading:false
				},
				fileList1:[],
				min:30,
				postscript:'',
				deposit_amount:'',
				user:''
			}
		},
		watch:{
			// postscript(n,o){
			// 	let s = this;
			// 	if(s.postscript != ''){
			// 		s.form.price = s.$accMul(s.receive2.exchange_rate,s.postscript)
			// 		s.exchange.disabled = false;
			// 	}else{
			// 		s.form.price = '';
			// 		s.exchange.disabled = true;
			// 	}
			// },
			form:{
				handler(){
					let s = this;
					if(s.form.price != ''){
						s.submit.disabled = false;
					}else{
						s.submit.disabled = true;
					}
					if(s.type == 'usdt'){
						if(s.form.price != '' && s.form.address_id != '' && s.form.img_url != ''){
							s.submit3.disabled = false;
						}else{
							s.submit3.disabled = true;
						}
					}else{
						if(s.form.price != '' && s.form.address_id != ''){
							s.submit3.disabled = false;
						}else{
							s.submit3.disabled = true;
						}
					}
				},
				immediate:true,
				deep:true
			},
			fileList1(n,o){
				let s = this;
				var img_url = [];
				for(var i = 0;i<s.fileList1.length;i++){
					var url = s.fileList1[i].url;
					if(url.substr(0,4) == 'http'){
						img_url.push(s.fileList1[i].url);
					}
				}
				s.form.img_url = img_url.join(',');
			}
		},
		onLoad(e) {
			let s = this;
      uni.setNavigationBarTitle({
        title:s.$t('my.wallet.recharge.index.navbar_title')
      })
			if(typeof e.type != "undefined"){
				s.type = e.type;
				s.receive2 = uni.getStorageSync('receive');
				s.form.address_id = s.receive2.id;
				s.user = uni.getStorageSync('user');
			}else{
				uni.$switchTab('/pages/finance/index')
			}
			// s.getReceiveAddress();
		},
		onNavigationBarButtonTap(e) {
			let s = this;
			if(e.index == 0){
				s.$navigateTo(`/pages/my/wallet/deposit/record`,true);
			}
		},
		methods: {
			saveQr(){
				this.$refs.uQRCode.save({
					success: res => {
					  console.log(res)
					}
				  })
			},
			getDeposit(){
				let s = this;
				s.exchange.disabled = true;
				s.exchange.loading = true;
				uni.$u.http.get('/?s=App.Recharge_Recharge.AmountConversion', {
					params: {address_id:s.form.address_id,price:s.postscript}
				}).then(res => {
					console.log(`获取充值金额`);
					console.log(res);
					if(res.data.ret == 200){
						s.form.price = res.data.data.deposit_amount;
					}

					s.exchange.disabled = false;
					s.exchange.loading = false;
				})
			},
			getReceiveAddress(){
				let s = this;
				uni.$u.http.get('/?s=App.Recharge_Recharge.GetConfigDefaultAddress').then(res => {
					console.log(`获取系统收款信息`);
					console.log(res);
					if(res.data.ret == 200){
						s.receive = res.data.data;
					}
				})
			},
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: this.$t('my.wallet.recharge.index.toast.uploading')
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].thumb)
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url) {
				let s = this;
				return new Promise((resolve, reject) => {
					let a = uni.$u.http.upload('/?s=App.FileUpload_FileUpload.Upload', {
						filePath: url,
						name: 'file',
					}).then(res => {
						console.log('上传图片');
						console.log(res);
						var res2 = res.data;
						if(res2.ret == 200){
							setTimeout(() => {
								resolve(res2.data.url);
							}, 1000)
						}else{
							(s.fileList1).splice(parseInt(s.fileList1.length)-1);
							s.$toast(res2.msg);
						}
					})
				})
			},
			submitForm(){
				let s = this;
				var price2 = s.form.price;
				price2 = String(price2);
				if(price2.indexOf(".") != -1){
					s.$toast(s.$t('my.wallet.recharge.index.toast.int'));
					return false;
				}else{
					s.submit.disabled = true;
					s.submit.loading = true;

					uni.$u.http.get('/?s=App.Recharge_Recharge.CheckRechargeAmount', {
						params: {price: s.form.price}
					}).then(res => {
						console.log(`获取最小充值金额`);
						console.log(res);
						if(res.data.ret == 200){
							s.form.price = Number(s.form.price);
							s.step=2;
						}else{
							s.$toast(res.data.msg);
						}

						setTimeout(function() {
							s.submit.disabled = false;
							s.submit.loading = false;
						}, 500);
					})
				}
			},
			submitForm2(item){
				let s = this;
				if(item.type == 2){
					s.type = 'bank'
				}else{
					s.type = 'usdt';
					// s.form.price = s.form.price+'.'+Math.round(Math.random()*99);
				}
				s.form.address_id = item.id;
				s.receive2 = item;
				s.step=3;
			},
			submitForm3(){
				let s = this;
				if(s.type == 'usdt'){
					if(s.form.price != '' && s.form.address_id != '' && s.form.img_url != ''){
						if(s.type == 'usdt' && s.form.user_pay_name == ''){
							s.$toast(s.$t('my.wallet.recharge.index.form.address_placeholder'));
							return false;
						}
					}else{
						s.$toast(s.$t('my.wallet.recharge.index.toast.illegal_operation'));
						return false;
					}
				}else{
					if(s.form.price != '' && s.form.address_id != ''){}else{
						s.$toast(s.$t('my.wallet.recharge.index.toast.illegal_operation'));
						return false;
					}
				}
				

				s.submit3.disabled = true;
				s.submit3.loading = true;

				if(s.type == 'bank'){
					var url = 'App.Recharge_Recharge.BankRecharge';
				}else{
					var url = 'App.Recharge_Recharge.UsdtRecharge';
				}

				uni.$u.http.post('/?s='+url,{}, {
					params: s.form
				}).then(res => {
					console.log('充值');
					console.log(res);
					if(res.data.ret == 200){
						s.$toast(s.$t('my.wallet.recharge.index.toast.success'));
						setTimeout(function() {
							s.$redirectTo('/pages/my/wallet/deposit/record',true)
						}, 500);
					}else{
						s.$toast(res.data.msg);
					}
					s.submit3.disabled = false;
					s.submit3.loading = false;
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		padding: 30rpx;
		.form_box{
			.box_title{
				font-size: 32rpx;
				color: #000;
				font-weight: 600;
				line-height: 44rpx;
			}
			.price_input{
				background: #F5F5F5;
				line-height: 75rpx;
				height: 75rpx;
				border: none;
			}
			.price_box{
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				.item{
					width: calc(33.333% - 15rpx);
					text-align: center;
					margin: 0 0 30rpx 0;
					.number{
						background: #F5F5F5;
						color: #242933;
						line-height: 38rpx;
						line-height: 100rpx;
						height: 100rpx;
						border-radius: 15rpx;
					}
					.cur{
						background: #D6AE40;
					}
				}
			}
		}
		.form_box2{
			.card_box{
				background: #FFFFFF;
				box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.05);
				border-radius: 15rpx;
				padding: 30rpx;
				margin: 0 0 30rpx 0;
				position: relative;
				.card_title{
					line-height: 34rpx;
					font-size: 24rpx;
					color: #000;
					margin: 0 0 15rpx 0;
					.iconfont{
						color: #999;
						font-size: 24rpx;
						float: right;
					}
				}
				.card_content{
					display: flex;
					.image{
						width: 60rpx;
						height: 60rpx;
						background: #eee;
						border-radius: 15rpx;
						overflow: hidden;
						margin: 0 30rpx 0 0;
						.img-cache{
							width: 60rpx;
							height: 60rpx;
							border-radius: 15rpx;
							overflow: hidden;
						}
					}
					.info{
						color: #999;
						font-size: 24rpx;
						line-height: 34rpx;
						.info_title{
							color: #000;
							line-height: 32rpx;
							font-size: 28rpx;
							margin: 0 0 7.5rpx 0;
						}
					}
				}
			}
		}
		.form_box3{
			.box_title{
				color: #242933;
				font-weight: 400;
				line-height: 40rpx;
			}
			.box_desc{
				color: #242933;
				font-weight: 400;
				line-height: 40rpx;
			}
			.qrcode{
				text-align: center;
				margin: 60rpx 0;
				.uqrcode{
					padding: 15rpx;
					background: #F5F5F5;
				}
			}
			.img{
				margin: 30rpx 0;
				.img-cache{
					width: 100%;
					height: auto;
				}
			}
			.cell{
				display: flex;
				justify-content: space-between;
				padding: 30rpx 0;
				border-bottom: 1rpx solid #E6E6E6;
				flex-wrap: wrap;
				.info{
					width: 85%;
					.label{
						font-weight: 600;
						color: #000;
						line-height: 40rpx;
						margin: 0 0 7.5rpx 0;
					}
					.value{
						color: #999;
						font-size: 24rpx;
						line-height: 34rpx;
					}
					.value2{
						display: flex;
						margin: 30rpx 0 0 0;

					}
				}
				.button{
					width: 15%;
				}
				.more{
					width: 100%;
					position: relative;
					.u-input{
						border-radius: 0;
						height: 58rpx;
						line-height: 58rpx;
						padding: 5rpx 15rpx!important;
						background: #f5f5f5;
					}
					.u-button{
						position: absolute;
						top:4rpx;
						right: 4rpx;
						width: 120rpx;
						height: 60rpx;
						border-radius: 0;
						background: none;
						border: none;
					}
				}
			}
			.cell2{
				border-bottom: none;
			}
			.upload{
				padding: 30rpx 0;
				.title{
					font-weight: 600;
					color: #000;
					line-height: 40rpx;
					margin: 0 0 15rpx 0;
				}
			}
			.input{
				margin: 0 0 30rpx 0;
				.title{
					font-weight: 600;
					color: #000;
					line-height: 40rpx;
					margin: 0 0 15rpx 0;
				}
			}
		}
	}
</style>