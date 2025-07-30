<template>
	<view class="content">
		<back ref="child" text="" :text="myAddress" :type="0" @connectWallet="connectWallet" :classType="true"
			subheading="true" @getMsg="getMsg">
		</back>
		<view class="centerBox">
			<view class="poolTitle">
				<view class="back" @tap="backGo">
					<image src="../../static/back1.png" mode=""></image>
				</view>
				<view class="title">
					{{$t('swap7')}}
				</view>
			</view>
			<view class="coinSetBody">
				<view v-if="isMaskVisible" class="maskStyle">
					<view class="loader"></view>
				</view>
				<view class="tabBoX">
					<view class="tabList" :class="countIndex == index?'activeS':'activeS2'" v-for="(item, index) in tab" :key="index" @tap="clickTab(index)">
						<text>{{$t(item)}}</text>
						<image v-if="countIndex == index" class="positionImg" src="/static/icon3.png" mode=""></image>
					</view>
				</view>
				<view class="boxInfo" v-for="(item, index) in pooInfoData" :key="index">
					<view class="smallTitle">
						<text>ftAmount</text>
						<text>tbcAmount</text>
						<text>{{$t('tran3')}}</text>
					</view>
					<view class="infoBigBox">
						<!-- <view class="positionTips":style="{color: item.userType == 1?'firebrick':'green'}">
							{{item.userType == 0?$t('tran4'):$t('tran5')}}
						</view> -->
						<view class="infoCoinNum">
							<view class="numRight">
								{{Math.floor((item.ftAmount/1000000)*100)/100}}
							</view>
							<view class="numRight">
								{{Math.floor((item.tbcAmount/1000000)*100)/100}}
							</view>
							<view class="numRight" :style="{color: item.doStatus == 3 || item.doStatus == 4?'#07c160':'rgba(115, 40, 228, 0.4)'}">
								{{item.doStatus == 0?$t('newTips0'):item.doStatus == 1?$t('newTips1'):item.doStatus == 2?$t('newTips2'):item.doStatus == 3 || item.doStatus == 4?$t('Success'):item.doStatus == -11?$t('tran7'):item.doStatus == 6?$t('newTips3'):item.doStatus == 8?$t('newTips4'):''}}
							</view>
						</view>
						<view class="infoCoinNum2">
							<view class="numRight" style="margin-top: 0;">
								<text class="hashText" @tap="copyHash(item.getHash)">{{$t('tran8')}} hash：{{item.getHash | plusXing}}</text>
								<image class="copyBtn" src="/static/goIcon.png" @tap="clickCopy(item.getHash)" mode=""></image>
							</view>
							<view class="numRight">
								<text class="hashText" @tap="copyHash(item.doHash)">{{$t('tran9')}} hash：{{item.doHash | plusXing}}</text>
								<image class="copyBtn" src="/static/goIcon.png" @tap="clickCopy(item.doHash)" mode=""></image>
							</view>
							<view class="numRight">
								<text class="hashText" @tap="copyHash(item.sendHash)">{{$t('tran10')}} hash：{{item.sendHash | plusXing}}</text>
								<image class="copyBtn" src="/static/goIcon.png" @tap="clickCopy(item.sendHash)" mode=""></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<w-loading text="" mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
	import back from "@/component/back/index.vue";
	import swal from 'sweetalert';
	import selectCoin from "@/component/selectCoin/index.vue";
	import bignumberJS from "bignumber.js"
	import {
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex'
	import wLoading from "@/component/w-loading/w-loading.vue";
	import test from '../../abi/tbc_gethash.js'
	export default {
		components: {
			back,
			wLoading,
			selectCoin
		},
		data() {
			return {
				myAddress: '',
				pageType: '',
				contractID: '',
				pooInfoData: [],
				isMaskVisible: false,
				page: 1,
				limit: 20,
				totol: 0,
				tab: ['tabList1','tabList2'],
				countIndex: 0
			}
		},
		filters: {
			plusXing(str) {
				if (str == undefined || str == null || str.length == 0) {
					return "- -";
				}
				var len = str.length - 4 - 18;
				var xing = '';
				for (var i = 0; i < 4; i++) {
					xing += '*';
				}
				return str.substring(0, 6) + xing + str.substring(str.length - 6);
			}
		},
		computed: {
			...mapGetters(['getWallet', 'getCoin'])
		},
		watch: {
			getWallet(val, oldVal) {
				this.Init();
			}
		},
		onReachBottom() {
			if(this.totol > this.limit) {
				this.page++;
				this.getNowInfo(this.countIndex);
			}
		},
		onLoad() {
			this.Init();
		},
		methods: {
			clickTab(val) {
				this.countIndex = val;
				this.pooInfoData = [];
				this.page = 1;
				this.limit = 20;
				this.totol = 0;
				this.getNowInfo(val);
			},
			copyHash(val) {
				let _this = this;
				uni.setClipboardData({
					data: val,
					success: function () {
						uni.showToast({
							icon: 'none',
						    title: _this.$t('copySuccess'),
						});
					}
				});
			},
			Init() {
				console.log(uni.getStorageSync('walletAddress'))
				if (uni.getStorageSync('walletAddress') == undefined || uni.getStorageSync('walletAddress') == '') {
					console.log("Please connect wallet!")
				} else {
					this.myAddress = uni.getStorageSync('walletAddress');
					this.getNowInfo(this.countIndex);
				}
			},
			copyAddress(val) {
				let _this = this;
				uni.setClipboardData({
					data: val,
					success: function () {
						uni.showToast({
							icon: 'none',
						    title: _this.$t('copySuccess'),
						});
					}
				});
			},
			clickCopy(val) {
				if(val == null) {
					uni.showToast({
						icon: 'none',
					    title: this.$t('tran11'),
					});
				} else{
					// window.location.href = 'https://explorer.turingbitchain.io/tx/'+val;
					window.open('https://explorer.turingbitchain.io/tx/'+val, '_blank')
				}
			},
			getNowInfo(type) {
				this.isMaskVisible = true;
				uni.request({
					url: this.localApiV4+'getMyEx',
					method: 'POST',
					header: {
						"Content-Type": "application/json; charset=UTF-8"
					},
					data: {
						userAddress: this.myAddress,
						doType: type,
						page: this.page,
						limit: this.limit
					},
					success: (res) => {
						if(res.data.success) {
							this.totol = res.data.num;
							this.pooInfoData = this.pooInfoData.concat(res.data.data);
							this.isMaskVisible = false;
						}
					},
					fail: (err) => {
						console.log(err)
						this.isMaskVisible = false;
					}
				});
			},
			backGo() {
				uni.navigateTo({
				   url: './index'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	@media all and (min-width: 700px) and (max-width: 2880px){
		.content {
			width: 100%;
			height: auto;
			// min-height: 100vh;
			box-sizing: border-box;
			position: relative;
			padding-bottom: 50upx;
			padding-top: 120upx;
			.centerBox {
				width: 70%;
				margin: 40rpx auto;
				box-sizing: border-box;
				border-radius: 20rpx;
				padding: 30rpx;
				.poolTitle{
					display: flex;
					align-items: center;
					margin: 26rpx 0 30rpx 0;
					.back{
						width: 40rpx;
						height: 40rpx;
						image{
							width: 100%;
							height: 100%;
						}
					}
					.title{
						margin-left: 20rpx;
						color: 35rpx;
					}
				}
				
				.titleEnd{
					font-size: 30rpx;
					color: #000;
					font-weight: bold;
					margin-top: 50rpx;
				}
				.coinSetBody{
					background-color: #fff;
					border-radius: 20rpx;
					padding: 40rpx 20rpx;
					position: relative;
					.maskStyle{
						position: absolute;
						  top: 0;
						  left: 0;
						  right: 0;
						  bottom: 0;
						  background-color: rgba(102, 82, 217, .1); /* 半透明黑色遮罩 */
						  z-index: 10;
					}
					
					.tabBoX{
						display: flex;
						justify-content: space-around;
						align-items: center;
						margin-bottom: 40rpx;
						.tabList{
							margin-right: 20rpx;
							width: 300rpx;
							height: 80rpx;
							line-height: 78rpx;
							border-radius: 40rpx;
							text-align: center;
							position: relative;
							.positionImg{
								position: absolute;
								right: 10rpx;
								top: 50%;
								transform: translate(-50%,-50%);
								width: 30rpx;
								height: 30rpx;
							}
						}
						.activeS{
							background: linear-gradient( 270deg, #6652D9 0%, #E283E7 50%, #F4CDCD 100%);
							color: #fff;
						}
						.activeS2{
							border: 2rpx solid #E283E7;
							color: #9152D9;
						}
					}
					.boxInfo{
						border-radius: 20rpx;
						background: #FFFFFF;
						box-shadow: 0px 4rpx 28rpx rgba(88,86,218,0.16);
						padding: 20rpx;
						margin-bottom: 28rpx;
						.smallTitle{
							color: #525252;
							font-size: 30rpx;
							margin-bottom: 20rpx;
							display: flex;
							justify-content: space-between;
							padding: 0 20rpx;
						}
						.infoBigBox{
							padding: 20rpx 10rpx;
							position: relative;
							.positionTips{
								position: absolute;
								left: 25%;
								top: 10rpx;
								width: 60rpx;
								height: 60rpx;
								line-height: 60rpx;
								text-align: center;
								border-radius: 50%;
								background-color: rgba(115, 40, 228, 0.1);
								font-size: 34rpx;
								font-weight: bold;
								z-index: 1;
							}
							.infoCoinNum{
								display: flex;
								justify-content: space-between;
								margin-bottom: 20rpx;
								.numRight{
									font-weight: bold;
									color: #3367D6;
									font-size: 34rpx;
								}
							}
							.infoCoinNum2{
								background-color: #F5F9FF;
								padding: 14rpx;
								border-radius: 14rpx;
								.numRight{
									display: flex;
									justify-content: space-between;
									align-items: center;
									margin-top: 30rpx;
									.hashText{
										font-family: Noto Sans SC, Noto Sans SC;
										font-weight: 500;
										font-size: 26rpx;
										color: #4E5969;
									}
									.copyBtn{
										width: 30rpx;
										height: 30rpx;
									}
								}
							}
						}
					}
					
				}
			}
		}
	}
	
	@media all and (min-width: 320px) and (max-width: 700px){
		.content {
			width: 100%;
			height: auto;
			min-height: 100vh;
			box-sizing: border-box;
			position: relative;
			padding-bottom: 30upx;
			padding-top: 120upx;
			.centerBox {
				max-width: 750rpx;
				border-radius: 20rpx;
				padding: 30rpx;
				.poolTitle{
					display: flex;
					align-items: center;
					margin: 26rpx 0 30rpx 0;
					.back{
						width: 40rpx;
						height: 40rpx;
						image{
							width: 100%;
							height: 100%;
						}
					}
					.title{
						margin-left: 20rpx;
						color: 35rpx;
					}
				}
				
				.titleEnd{
					font-size: 30rpx;
					color: #000;
					font-weight: bold;
					margin-top: 50rpx;
				}
				.coinSetBody{
					background-color: #fff;
					border-radius: 20rpx;
					padding: 40rpx 0;
					position: relative;
					.maskStyle{
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						background-color: rgba(102, 82, 217, .1); /* 半透明黑色遮罩 */
						z-index: 10;
						border-radius: 20rpx;
					}
					
					.tabBoX{
						display: flex;
						justify-content: space-around;
						align-items: center;
						margin-bottom: 40rpx;
						.tabList{
							text-align: center;
							margin-right: 20rpx;
							width: 300rpx;
							height: 80rpx;
							line-height: 78rpx;
							border-radius: 40rpx;
							position: relative;
							.positionImg{
								position: absolute;
								right: 10rpx;
								top: 50%;
								transform: translate(-50%,-50%);
								width: 30rpx;
								height: 30rpx;
							}
						}
						.activeS{
							background: linear-gradient( 270deg, #6652D9 0%, #E283E7 50%, #F4CDCD 100%);
							color: #fff;
						}
						.activeS2{
							border: 2rpx solid #E283E7;
							color: #9152D9;
						}
					}
					.boxInfo{
						border-radius: 20rpx;
						background: #FFFFFF;
						box-shadow: 0px 4rpx 28rpx rgba(88,86,218,0.16);
						padding: 20rpx;
						margin-bottom: 28rpx;
						.smallTitle{
							color: #525252;
							font-size: 30rpx;
							margin-bottom: 20rpx;
							display: flex;
							justify-content: space-between;
							padding: 0 20rpx;
						}
						.infoBigBox{
							padding: 20rpx 10rpx;
							position: relative;
							.positionTips{
								position: absolute;
								left: 25%;
								top: 10rpx;
								width: 60rpx;
								height: 60rpx;
								line-height: 60rpx;
								text-align: center;
								border-radius: 50%;
								background-color: rgba(115, 40, 228, 0.1);
								font-size: 32rpx;
								font-weight: bold;
								z-index: 1;
							}
							.infoCoinNum{
								display: flex;
								justify-content: space-between;
								margin-bottom: 20rpx;
								.numRight{
									font-weight: bold;
									color: #3367D6;
									font-size: 34rpx;
								}
							}
							.infoCoinNum2{
								background-color: #F5F9FF;
								padding: 14rpx;
								border-radius: 14rpx;
								.numRight{
									display: flex;
									justify-content: space-between;
									align-items: center;
									margin-top: 30rpx;
									.hashText{
										font-family: Noto Sans SC, Noto Sans SC;
										font-weight: 500;
										font-size: 26rpx;
										color: #4E5969;
									}
									.copyBtn{
										width: 30rpx;
										height: 30rpx;
									}
								}
							}
						}
						
					}
				}
			}
		}
	}
	
	
	/* loading加载动画的css */
	.loader {
	  display: block;
	  position: relative;
	  left: 50%;
	  top: 45%;
	  width: 150upx;
	  height: 150upx;
	  margin: -75upx 0 0 -75upx;
	  border-radius: 50%;
	  border: 3upx solid transparent;
	  border-top-color: #9370db;
	  -webkit-animation: spin 2s linear infinite;
	  animation: spin 2s linear infinite;
	}
	.loader::before {
	  content: "";
	  position: absolute;
	  top: 5upx;
	  left: 5upx;
	  right: 5upx;
	  bottom: 5upx;
	  border-radius: 50%;
	  border: 3upx solid transparent;
	  border-top-color: #ba55d3;
	  -webkit-animation: spin 3s linear infinite;
	  animation: spin 3s linear infinite;
	}
	.loader::after {
	  content: "";
	  position: absolute;
	  top: 15upx;
	  left: 15upx;
	  right: 15upx;
	  bottom: 15upx;
	  border-radius: 50%;
	  border: 3upx solid transparent;
	  border-top-color: #ff00ff;
	  -webkit-animation: spin 1.5s linear infinite;
	  animation: spin 1.5s linear infinite;
	}
	@-webkit-keyframes spin {
	  0% {
	    -webkit-transform: rotate(0deg);
	    -ms-transform: rotate(0deg);
	    transform: rotate(0deg);
	  }
	  100% {
	    -webkit-transform: rotate(360deg);
	    -ms-transform: rotate(360deg);
	    transform: rotate(360deg);
	  }
	}
	@keyframes spin {
	  0% {
	    -webkit-transform: rotate(0deg);
	    -ms-transform: rotate(0deg);
	    transform: rotate(0deg);
	  }
	  100% {
	    -webkit-transform: rotate(360deg);
	    -ms-transform: rotate(360deg);
	    transform: rotate(360deg);
	  }
	}
</style>