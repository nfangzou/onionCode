<template>
	<view class="goBacke" :class="classType?'goBackeBg':'goBackeBg2'">
		<view class="headLeft">
			<view class="logoHead">
				<image src="../../static/logo1.png" mode=""></image>
				<text>Onion Swap</text>
			</view>
			<view class="listTab staus2">
				<view class="tabOne" :style="{color: type == index?'#fff':''}" v-for="(item, index) in tabData" :key="index" @tap="clickTap(item.path)">
					{{$t(item.text)}}
					<view class="pcTabOne" v-if="type==index"></view>
				</view>
			</view>
		</view>
		<view class="subheading" v-if="subheading">
			<view class="backe">
				<text v-if="text">{{text | plusXing}}</text>
				<text v-else @tap="clickConnect">{{$t('index1')}}</text>
			</view>
			<view class="appStyleIcon staus1">
				<image @tap="clickLeftShow" src="/static/nav.png" mode=""></image>
			</view>
			<view class="appStyleIcon langShow" style="margin-left: 20rpx;">
				<image @tap="clickLangShow" src="/static/lang.png" mode=""></image>
			</view>
		</view>
		<uni-popup ref="popup2" type="right" :mask-click="true">
			<view class="insureBoxTwo">
				<view class="closeStyle">
					<view class="leftText">
						OnionSwap
					</view>
					<view class="rightIcon" @tap="closePup2">
						<image src="/static/close2.png" mode=""></image>
					</view>
				</view>
				<view class="btnList no-scrollbar">
					<view class="iconListTwo" v-for="(item, index) in tabData" :key="index+'a'" @tap="clickTap(item.path)">
						<image class="iconImg" :src="'../../static/tabIcon'+(index+1)+'.png'" mode=""></image>
						<text>{{$t(item.text)}}</text>
					</view>
					<view class="iconListTwo" style="border: none;">
						<image class="iconImg" src="../../static/tabIcon7.png" mode=""></image>
						<text>{{$t('tab6')}}</text>
					</view>
					<view class="iconListTwo2" v-for="(item, index) in langList" :key="index" @tap="changeLang(item.val, index)">
						<text>{{item.name}}</text>
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="popup" type="right" :mask-click="true">
			<view class="insureBoxOne">
				<view class="closeStyle1">
					<view class="leftText">
						{{$t('tab6')}}
					</view>
					<view class="rightIcon" @tap="colse1">
						<image src="../../static/close2.png" mode=""></image>
					</view>
				</view>
				<view class="btnList1" style="margin-top: 0;">
					<view class="iconList" v-for="(item, index) in langList" :key="index" @tap="changeLang(item.val, index)">
						<text>{{item.name}}</text>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {mapState,mapMutations,mapGetters} from 'vuex'
	export default {
		data() {
			return {
				vip:1,
				index: 0,
				langList: [
					{name: '繁体中文',val: 'zh-CN'},
					{name: 'English',val: 'en-US'},
					{name: '한국인',val: 'kor'},
					{name: '日本語',val: 'jap'},
				],
				tabData: [{
						text: 'tab1',
						path: "/pages/index/index",
					},
					{
						text: 'tab2',
						path: "/pages/pool/pool",
					},
					{
						text: 'tab3',
						path: "/pages/stake/stake",
					},
					{
						text: 'tab4',
						path: "/pages/earn/earn",
					},
					{
						text: 'tab5',
						path: "/pages/stats/stats",
					},
					{
						text: 'swap8',
						path: "/pages/feedback/feedback",
					}
				],
				tabCurrent: 0,
				myAddress: '',
				twoAddress: ''
			}
		},
		filters: {
			plusXing(str) {
			 if (str.length == 0){
			  return "";
			 }
			 var len = str.length - 4 - 18;
			 var xing = '';
			 for (var i = 0; i < 4; i++) {
			  xing += '*';
			 }
			 return str.substring(0, 4) + xing + str.substring(str.length - 4);
			}
		},
		computed: {
			...mapGetters(['getWallet','getCoin'])
		},
		created() {
			this.index = uni.getStorageSync("indexVal") === '' || uni.getStorageSync("indexVal") == undefined?1:uni.getStorageSync("indexVal");
		},
		props:['text','type','classType','subheading'],
		methods: {
			clickTap(pathVal) {
				this.$refs.popup2.close();
				uni.navigateTo({
				   url: pathVal
				})
			},
			clickLeftShow() {
				this.$refs.popup2.open();
			},
			closePup2() {
				this.$refs.popup2.close();
			},
			async clickConnect() {
				if(window.Turing) {
					await window.Turing.connect();
					let wert = await window.Turing.getAddress();
					this.myAddress = wert.tbcAddress;
					this.$store.commit('setWallet', wert.tbcAddress);
					uni.setStorageSync('walletAddress',wert.tbcAddress);
					this.$emit('getMsg');
				} else{
					swal({
						title: this.$t('new6'),
						icon: "error",
					})
				}
			},
			changeLang(lang, indexA) {
				this.index = indexA;
				uni.setStorageSync("language",lang);
				uni.setStorageSync("indexVal",this.index);
				this._i18n.locale = lang;
				this.$refs.popup2.close();
				this.$refs.popup.close();
			},
			clickLangShow() {
				this.$refs.popup.open();
			},
			colse1() {
				this.$refs.popup.close();
			}
		}
	}
</script>

<style lang="less" scoped>
	@media all and (min-width: 700px) and (max-width: 2880px){
		.goBacke{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 24upx 34rpx;
			width: 100%;
			box-sizing: border-box;
			z-index: 7;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			background: linear-gradient( 270deg, #F4CDCD 0%, #E283E7 43%, #6652D9 100%);
			.headLeft{
				display: flex;
				align-items: center;
				width: 80%;
				.logoHead{
					display: flex;
					align-items: center;
					margin-right: 100rpx;
					image{
						width: 83rpx;
						height: 83rpx;
					}
					text{
						margin-left: 30upx;
					}
				}
				
				.listTab{
					display: flex;
					justify-content: space-between;
					.tabOne{
						color: #fff;
						margin-right: 100rpx;
						position: relative;
						.pcTabOne{
							position: absolute;
							left: 0;
							right: 0;
							bottom: -20upx;
							box-sizing: border-box;
							border-bottom: 5upx solid #fff;
							border-radius: 30upx;
							// color: red !important;
						}
					}
					
				}
			}
			
			
			.subheading{
				font-size: 28upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 400;
				color: #fff;
				display: flex;
				align-items: center;
				.backe{
					display: flex;
					align-items: center;
					padding: 20rpx;
					background: rgba(255,255,255,0.16);
					border-radius: 50rpx 50rpx 50rpx 50rpx;
					margin-right: 20rpx;
					text{
						font-size: 32rpx;
						font-family: Microsoft YaHei;
						font-weight: 400;
					}
				}
				
				.staus1{
					display: none !important;
				}
				image{
					width: 55rpx;
					height: 48rpx;
					margin-right: 20rpx;
				}
				text{
					font-size: 32rpx;
					font-family: Microsoft YaHei;
					font-weight: 400;
				}
			}
		}
		.goBackeBg{
			text{
				font-size: 36upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 400;
				color: #FFFFFF;
			}
		}
		.goBackeBg2{
			text{
				font-size: 36upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 400;
				color: #000;
			}
		}
		
		.insureBoxOne{
			width: 659upx;
			border-radius: 20rpx;
			background-color: #fff;
			padding: 40rpx;
			margin-top: 140rpx;
			.closeStyle1{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 50rpx;
				.leftText{
					font-size: 32rpx;
					font-family: Microsoft YaHei, Microsoft YaHei;
					font-weight: bold;
					color: #000;
				}
				.rightIcon{
					width: 40rpx;
					height: 40rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
			.btnList1{
				.marginB{
					margin-bottom: 50rpx;
				}
				.iconList{
					display: flex;
					align-items: center;
					border-bottom: 2rpx solid rgba(115, 40, 228, 0.2);
					padding: 20rpx 40rpx;
					border-radius: 10rpx;
					margin-bottom: 30rpx;
					image{
						width: 50rpx;
						height: 50rpx;
						margin-right: 20rpx;
					}
					text{
						font-size: 32rpx;
						font-family: Microsoft YaHei, Microsoft YaHei;
						font-weight: bold;
						color: #000;
					}
				}
			}
		}
		.insureBoxTwo{
			width: 200upx;
			height: 100%;
			border-radius: 20rpx;
			background-color: #fff;
			padding: 40rpx;
			.closeStyle{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.leftText{
					font-size: 32rpx;
					font-family: Microsoft YaHei, Microsoft YaHei;
					font-weight: bold;
					color: #000;
				}
				.rightIcon{
					width: 50rpx;
					height: 50rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
			.no-scrollbar {
			    -ms-overflow-style: none;  /* IE 10+ */
			    scrollbar-width: none;  /* Firefox */
			}
			.btnList{
				height: 70%;
				overflow-y: scroll;
				.iconListTwo{
					display: flex;
					align-items: center;
					margin-top: 50rpx;
					border-bottom: 2rpx solid rgba(115, 40, 228, 0.2);
					padding: 40rpx;
					.iconImg{
						width: 40rpx;
						height: 40rpx;
						margin-right: 20rpx;
					}
					text{
						font-family: Noto Sans SC, Noto Sans SC;
						font-weight: 500;
						font-size: 33rpx;
						color: #161616;
					}
				}
				.iconListTwo2{
					border-bottom: 2rpx solid rgba(115, 40, 228, 0.2);
					padding:  40rpx 80rpx;
					margin-left: 50rpx;
					text{
						font-family: Noto Sans SC, Noto Sans SC;
						font-weight: 500;
						font-size: 33rpx;
						color: #161616;
					}
				}
			}
		}
	}
	@media all and (min-width: 320px) and (max-width: 700px){
		.goBacke{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 24upx;
			width: 100%;
			box-sizing: border-box;
			background: linear-gradient( 270deg, #6652D9 0%, #E283E7 55%, #F4CDCD 100%);
			z-index: 99;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			.headLeft{
				display: flex;
				align-items: center;
				.logoHead{
					margin-left: 20rpx;
					display: flex;
					align-items: center;
					image{
						width: 83rpx;
						height: 83rpx;
						margin-right: 10rpx;
					}
				}
				
				.staus2{
					display: none !important;
				}
				.appStyleIcon{
					image{
						width: 50rpx;
						height: 50rpx;
					}
				}
				.listTab{
					display: flex;
					justify-content: space-between;
					.tabOne{
						color: gray;
						margin-right: 100rpx;
						.pcTabOne{
							display: none;
						}
					}
				}
			}
			
			
			.subheading{
				font-size: 28upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 400;
				color: #fff;
				display: flex;
				align-items: center;
				.backe{
					padding: 10rpx 30rpx;
					background: rgba(255,255,255,0.16);
					border-radius: 50rpx 50rpx 50rpx 50rpx;
					margin-right: 20rpx;
					text{
						font-size: 32rpx;
						font-family: Microsoft YaHei;
						font-weight: 400;
					}
				}
				.langShow{
					display: none !important;
				}
				image{
					width: 55rpx;
					height: 48rpx;
					margin-right: 20rpx;
				}
				text{
					font-size: 32rpx;
					font-family: Microsoft YaHei;
					font-weight: 400;
				}
			}
		}
		.goBackeBg{
			text{
				font-size: 36upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 400;
				color: #FFFFFF;
			}
		}
		.goBackeBg2{
			text{
				font-size: 36upx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 400;
				color: #000;
			}
		}
		.insureBoxOne{
			width: 380upx;
			border-radius: 20rpx;
			background-color: #fff;
			padding: 40rpx;
			margin-top: 100rpx;
			.closeStyle1{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 50rpx;
				.leftText{
					font-size: 32rpx;
					font-family: Microsoft YaHei, Microsoft YaHei;
					font-weight: bold;
					color: #000;
				}
				.rightIcon{
					width: 40rpx;
					height: 40rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
			.btnList1{
				.marginB{
					margin-bottom: 30rpx;
				}
				.iconList{
					display: flex;
					align-items: center;
					border-bottom: 2rpx solid rgba(115, 40, 228, 0.2);
					padding: 20rpx 40rpx;
					border-radius: 10rpx;
					margin-bottom: 20rpx;
					image{
						width: 20rpx;
						height: 20rpx;
						margin-right: 20rpx;
					}
					text{
						font-size: 32rpx;
						font-family: Microsoft YaHei, Microsoft YaHei;
						font-weight: bold;
						color: #000;
					}
				}
			}
		}
		.insureBoxTwo{
			width: 400upx;
			height: 100%;
			border-radius: 20rpx;
			background-color: #fff;
			padding: 40rpx;
			.closeStyle{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.leftText{
					font-size: 32rpx;
					font-family: Microsoft YaHei, Microsoft YaHei;
					font-weight: bold;
					color: #000;
				}
				.rightIcon{
					width: 50rpx;
					height: 50rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
			.no-scrollbar {
			    -ms-overflow-style: none;  /* IE 10+ */
			    scrollbar-width: none;  /* Firefox */
			}
			.btnList{
				height: 70%;
				overflow-y: scroll;
				.iconListTwo{
					display: flex;
					align-items: center;
					margin-top: 50rpx;
					border-bottom: 2rpx solid rgba(115, 40, 228, 0.2);
					padding: 40rpx;
					.iconImg{
						width: 40rpx;
						height: 40rpx;
						margin-right: 20rpx;
					}
					text{
						font-family: Noto Sans SC, Noto Sans SC;
						font-weight: 500;
						font-size: 33rpx;
						color: #161616;
					}
				}
				.iconListTwo2{
					border-bottom: 2rpx solid rgba(115, 40, 228, 0.2);
					padding:  40rpx 80rpx;
					margin-left: 50rpx;
					text{
						font-family: Noto Sans SC, Noto Sans SC;
						font-weight: 500;
						font-size: 33rpx;
						color: #161616;
					}
				}
			}
		}
	}
</style>