<template>
	<view class="pages my_lottery">
		<view class="content">
			<!-- 抽奖转盘 -->
			<view class="lottery_box">
				<view class="lottery_center">
					<view class="go" @click="move()">{{$t('my.lottery.go')}}</view>
					<view class="p">{{$t('my.lottery.number_of_lucky_draw')}}: {{number_of_draws}}</view>
				</view>
				<view class="lottery_lamp">
					<view class="cell cell0"><text :class="lampShow?'yes':'no'"></text></view>
					<view class="cell cell1"><text :class="lampShow?'no':'yes'"></text></view>
					<view class="cell cell2"><text :class="lampShow?'yes':'no'"></text></view>
					<view class="cell cell3"><text :class="lampShow?'no':'yes'"></text></view>
					<view class="cell cell4"><text :class="lampShow?'yes':'no'"></text></view>
					<view class="cell cell5"><text :class="lampShow?'no':'yes'"></text></view>
					<view class="cell cell6"><text :class="lampShow?'yes':'no'"></text></view>
					<view class="cell cell7"><text :class="lampShow?'no':'yes'"></text></view>
					<view class="cell cell8"><text :class="lampShow?'yes':'no'"></text></view>
					<view class="cell cell9"><text :class="lampShow?'no':'yes'"></text></view>
					<view class="cell cell10"><text :class="lampShow?'yes':'no'"></text></view>
					<view class="cell cell11"><text :class="lampShow?'no':'yes'"></text></view>
					<view class="cell cell12"><text :class="lampShow?'yes':'no'"></text></view>
					<view class="cell cell13"><text :class="lampShow?'no':'yes'"></text></view>
					<view class="cell cell14"><text :class="lampShow?'yes':'no'"></text></view>
					<view class="cell cell15"><text :class="lampShow?'no':'yes'"></text></view>
				</view>
				<view class="lottery_box2">
					<view :class="index==index2?'list cur':'list'" v-for="(item2,index2) in lottery.list" :key="index2" :id="'item'+index2">
						<view class="title">{{['0','1','2','3','4','5','6','7','8','9'].includes((item2.prize_name).substr(0,1))?'$'+item2.prize_name:item2.prize_name}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="help" v-if="detail">
			<view class="title">{{detail.title}}</view>
			<view class="body" v-html="detail.content"></view>
		</view>
		
		<!-- 抽奖结果 -->
		<u-popup :show="lottery_prize.show" @close="lottery_prize.show=false" mode="center" bgColor="transparent" :closeOnClickOverlay="true" v-if="prize_data != ''">
			<view class="lottery_prize_box" v-if="prize_data != ''">
				<view class="title">{{$t('my.lottery.congrats_on_getting')}} <b>{{['0','1','2','3','4','5','6','7','8','9'].includes((prize_data.prize_name).substr(0,1))?'$'+prize_data.prize_name:prize_data.prize_name}}</b></view>
				<view class="button">
					<u-button type="info" color="#F9C623" :text="$t('my.lottery.confirm')" @click="lottery_prize.show = false" :customStyle="{'color':'#000'}"></u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail:'',
				user:'',
				lottery:{
					show:true,
					list:[]
				},
				lottery_prize:{
					show:false
				},
				index: 0, // 当前转动到哪个位置，第一次起点位置0,对应页面item1位置
				count: 12, // 总共有多少个位置
				times: 0, // 转动跑格子次数,
				cycle: 10, // 转动基本次数: 即至少需要转动多少次再进入抽奖环节
				speed: 500, // 初始转动速度
				lampShow:false,//开始抽奖，灯光闪烁
				timer: 0, // 转动定时器
				lamp:0, // 灯光定时器
				prize: 0, // 中奖位置，接口返回
				number_of_draws:0,//限制每天抽奖次数，接口返回
				prize_data: '',
				do:false
			};
		},
		onLoad(option) {
			let s = this;
			uni.setNavigationBarTitle({
				title:s.$t('my.lottery.navbar_title')
			})
			s.getLotteryList();
		},
		methods: {
			//点击开始抽奖
			move() {
				let s = this;
				if(s.do){
					return false;
				}
				// uni.showLoading();
				s.do = true;
				if( this.number_of_draws == 0){
					this.$toast(s.$t('my.lottery.toast.luck_drawed'));

				}else if(this.times != 0){
					this.$toast(s.$t('my.lottery.toast.luck_drawimg'))

				} else{
					let s = this;
					uni.$u.http.get('/?s=App.Activity_Activity.LuckDraw').then(res => {
						console.log('抽奖结果');
						console.log(res);
						if(res.data.ret == 200){
							this.number_of_draws--;//抽奖开始，次数-1
							this.speed = 100;//每次抽奖速度初始化为200
							// this.prize_data = res.data.data;//已经拿到中奖信息，页面展示，等抽奖结束后，将弹窗弹出
							// this.prize = res.data.lucky_id -1;ceshivip01
							//中奖位置赋值，跑马灯最终停留位置，这里实际位置需要-1
							for(var i = 0;i<s.lottery.list.length;i++){
								if(s.lottery.list[i].id == res.data.data.id){
									this.prize = i;
									this.prize_data = s.lottery.list[i];
									// console.log(this.prize);
								}
							}
							
							this.startRoll();//执行抽奖
							this.lamp = setInterval(()=>{//灯光闪烁开启
								this.lampShow = !this.lampShow;
							},100)
							
							// s.getUser();
						}else{
							s.$toast(res.data.msg)
						}
					})
				}
			},
			// 开始转动
			startRoll() {
				this.times += 1; // 转动次数
				this.oneRoll(); // 转动过程调用的每一次转动方法，这里是第一次调用初始化
				this.usePrize();
			},
			
			// 每一次转动
			oneRoll() {
				let index = this.index; // 当前转动到哪个位置
				const count = this.count; // 总共有多少个位置
				index += 1;
				if (index > count - 1) {
					index = 0;
				}
				console.log(index);
				this.index = index;
			},
		
			usePrize() {
				let s = this;
				// 如果当前转动次数达到要求 && 目前转到的位置是中奖位置
				if (this.times > this.cycle +10 && this.prize === this.index) {
					clearTimeout(this.timer); // 清除转动定时器
					clearTimeout(this.lamp); // 清除灯光定时器
					this.lampShow = false; // 白色灯隐藏
					this.times = 0; // 转动跑格子次数初始化为0，可以开始下次抽奖
					
					setTimeout(function() {
						s.do = false;
					}, 1000);
					// uni.hideLoading();
					
					// if(this.prize_data.type == 0){
					// 	console.log('未中奖，谢谢参与');//未中奖提示弹出，
					// }else{
					// 	console.log('中奖啦');//中奖弹出提示
					// }
					setTimeout(function() {
						s.lottery.show = false;
						s.lottery_prize.show = true;
					}, 500);
				} else {
					if(this.times < this.cycle -20){
						this.speed -= 4; // 加快转动速度
					}else{
						this.speed += 10; // 抽奖即将结束，放慢转动速度
					}
					this.timer = setTimeout(this.startRoll, this.speed);//开始转动
					// console.log(this.timer);
				}
			},
			getLotteryList(){
				let s = this;
				uni.$u.http.get('/?s=App.Activity_Activity.GetTurntableDetail', {
					params: {page: s.page,perpage:s.limit}
				}).then(res => {
					console.log('奖品列表');
					console.log(res);
					if(res.data.ret == 200){
						s.lottery.list = res.data.data.prize;
						s.detail = res.data.data.rule_detail;
						s.number_of_draws = res.data.data.give_num||0
					}else{
						s.$toast(res.data.msg);
						setTimeout(function() {
							uni.navigateBack();
						}, 1000);
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.content{
		padding: 30rpx;
	}
	
	.lottery_box{
		background: #FFCE80;
		box-shadow: 0px 4rpx 15rpx 0px rgba(51,51,51,0.2);
		border-radius: 20rpx;
		padding: 48rpx;
		position: relative;
		z-index: 1;
		.close{
			position: absolute;
			bottom: -116rpx;
			left: 0;
			width: 100%;
			text-align: center;
			.iconfont{
				color: #fff;
				font-size: 56rpx;
			}
		}
		.lottery_center{
			position: absolute;
			z-index: 4;
			width: 278rpx;
			height: 278rpx;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
			color: #fff;
			background: #FF8F1F;
			box-shadow: inset 0px -10px 16px 0px rgba(255,42,0,0.5);
			border-radius: 20rpx;
			justify-content: center;
			align-items: center;  
			display: flex;
			flex-direction: column;
			.go{
				font-size: 90rpx;
				color: #FFFFFF;
				text-shadow: 0 4px 8px rgba(204,48,0,0.50);
				font-weight: bold;
			}
			.p{
				font-size: 24rpx;
				text-align: center;
			}
		}
		.lottery_lamp{
			position: absolute;
			left: 48rpx;
			top: 48rpx;
			width: 592rpx;
			height: 592rpx;
			z-index: 2;
			.cell{
				width: 148rpx;
				height: 16rpx;
				text-align: center;
				position: absolute;
				z-index: 3;
				text{
					width: 16rpx;
					height: 16rpx;
					border-radius: 50%;
					display: inline-block;
					
				}
				.yes{
					background-image: radial-gradient(circle at 50% 50%, #FFBE7D 0%, #FF8F1F 50%);
					box-shadow: 0px 0px 4px 0px rgba(255,170,0,1);
				}
				.no{
					background-image: radial-gradient(circle at 50% 50%, #FFFFFF 0%, #F5F5F5 50%);
					box-shadow: 0px 0px 8rpx 0px rgba(255,255,255,1);
				}
			}
			.cell0{left: 0;top: -40rpx;}
			.cell1{left: 148rpx;top: -40rpx;}
			.cell2{left: 296rpx;top: -40rpx;}
			.cell3{left: 444rpx;top: -40rpx;}	
			.cell4{left: 608rpx;top: 0;width: 16rpx;height: 148rpx;line-height: 148rpx;}
			.cell5{right: -32rpx;top: 148rpx;width: 16rpx;height: 148rpx;line-height: 148rpx;}
			.cell6{right: -32rpx;top: 296rpx;width: 16rpx;height: 148rpx;line-height: 148rpx;}
			.cell7{right: -32rpx;top: 444rpx;width: 16rpx;height: 148rpx;line-height: 148rpx;}
			.cell8{left: 0;bottom: -24rpx;}
			.cell9{left: 148rpx;bottom: -24rpx;}
			.cell10{left: 296rpx;bottom: -24rpx;}
			.cell11{left: 444rpx;bottom: -24rpx;}
			.cell12{left: -32rpx;top: 0;width: 16rpx;height: 148rpx;line-height: 148rpx;}
			.cell13{left: -32rpx;top: 148rpx;width: 16rpx;height: 148rpx;line-height: 148rpx;}
			.cell14{left: -32rpx;top: 296rpx;width: 16rpx;height: 148rpx;line-height: 148rpx;}
			.cell15{left: -32rpx;top: 444rpx;width: 16rpx;height: 148rpx;line-height: 148rpx;}
		}
		.lottery_box2{
			background: #CC7A00;
			box-shadow: inset 0px 0px 40rpx 0px rgba(240,177,9,1);
			border-radius: 24rpx;
			position: relative;
			width: 592rpx;
			height: 592rpx;
			z-index: 2;
			.list{
				width: 76rpx;
				height: 136rpx;
				border-radius: 20rpx;
				background: #fff;
				text-align: center;
				position: absolute;
				z-index: 3;
				image{
					margin-top: 6rpx;
				}
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0 30rpx;
				
				.title{
					font-size: 24rpx;
					line-height: 28rpx;
					color: #000;
				}
			}
			.cur{
				background: #F9C723;
				.title{
					color: #fff;
				}
			}
			#item0{top: 12rpx;left: 12rpx;}
			#item1{top: 12rpx;left: 156rpx;}
			#item2{top: 12rpx;left: 300rpx;}
			#item3{top: 12rpx;left: 444rpx;}
			#item4{top: 156rpx;left: 444rpx;}
			#item5{top: 302rpx;left: 444rpx;}
			#item6{top: 446rpx;left: 444rpx;}
			#item7{top: 446rpx;left: 302rpx;}
			#item8{top: 446rpx;left: 156rpx;}
			#item9{top: 446rpx;left: 12rpx;}
			#item10{top: 302rpx;left: 12rpx;}
			#item11{top: 156rpx;left: 12rpx;}
		}
	}
	
	.lottery_prize_box{
		text-align: center;
		.img{
			width: 176rpx;
			height: 176rpx;
			text-align: center;
			background: url(../../static/images/market/light.png) no-repeat center;
			background-size: cover;
			padding: 112rpx;
		}
		.title{
			font-size: 32rpx;
			color: #fff;
			height: 36rpx;
			line-height: 36rpx;
			margin: 0 0 40rpx 0;
			b{
				font-weight: bold;
				color: #F9C623;
				margin: 0 0 0 15rpx;
			}
		}
	}
	.help{
		padding: 30rpx;
		.title{
			color: #000;
			font-weight: bold;
			margin: 0 0 15rpx 0;
		}
	}
</style>