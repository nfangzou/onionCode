<template>
	<view class="content">
		<back ref="child" text="" :text="myAddress" :type="5" @connectWallet="connectWallet" :classType="true"
			subheading="true" @getMsg="getMsg">
		</back>
		<view class="centerBox">
			<view class="poolTitle">
				<view class="back">
					
				</view>
				<view class="title">
					{{$t('swap8')}}
				</view>
				<view class="rightN">
					<image @tap="loadClick" src="../../static/load.png" mode=""></image>
				</view>
			</view>
			<view class="bodyList">
				<view class="lpBox">
					<view class="coinBox">
						<view class="coinNameBox">
							<view class="coinSmall">
								<text>{{$t('swap12')}}hash: </text>
							</view>
						</view>
					</view>
					<view class="inputToBox">
						<view class="inputBody" style="height: 90rpx;">
							<input v-model="fromCoinNum" type="text" />
						</view>
					</view>
					<view class="coinBox">
						<view class="coinNameBox">
							<view class="coinSmall">
								<text>{{this.$t('swap9')}}:</text>
							</view>
						</view>
					</view>
					<view class="inputToBox">
						<view class="inputBody" style="padding: 20rpx 45rpx;">
							<textarea v-model="toCoinNum"></textarea>
						</view>
					</view>
					<view class="btnGo2">
						<view class="btn" @tap="submitClick()">
							{{$t('swap10')}}
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
	import { API, FT, poolNFT } from "tbc-contract";
	import {
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex'
	import wLoading from "@/component/w-loading/w-loading.vue";
	export default {
		components: {
			back,
			wLoading,
			selectCoin
		},
		data() {
			return {
				myAddress: '',
				tabIndex: 0,
				DawkoinBalanceNum: 0,
				slipData: ['0.1', '0.5', '1.0'],
				slipCrrent: 0,
				selfSlip: '',
				toCoinNum: '',
				fromCoinNum: '',
				lpNum: 0,
				ApproveWbnb: false,
				ApproveDawkoin: false,
				lamount: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
				sliderValue: 0,
				getTotalSupplyNum: 0,
				DawkoinLpNum: 0,
				wbnbLpNum: 0,
				ApproveLP: false,
				userLpCount: 0,


				fromCur: {
					name: 'TBC',
					symbol: 'test_coin',
					address: '',
					chainId: 56,
					decimals: 18,
					balance: '',
					logoURI: 'https://dapp.onionswap.info/TBC.png',
				},
				toInput: '',
				toCur: {
					balance: '',
					name: '',
					symbol: '',
					address: '',
					chainId: '',
					decimals: '',
					logoURI: '',
				},
				activeCole: 'rgba(0,0,0,0.5)',
				tbcBalance: 0,
				goType: 'from',
				poolType: 1,
				nowPoolAddress: [],
				poolFbNum: 0,
				poolTbcNum: 0,
				FTPrice: 0,
				TBCPrice: 0,
				SelectCoinInfoData: [],
				SwapBtnStatus: false,
				stausMergeAdd: false
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
		onLoad(option) {
			this.Init();
		},
		methods: {
			Init() {
				if (uni.getStorageSync('walletAddress') == undefined || uni.getStorageSync('walletAddress') == '') {
					console.log("Please connect wallet!")
				} else {
					this.myAddress = uni.getStorageSync('walletAddress');
				}
			},
			submitClick() {
				console.log(this.toCoinNum)
				uni.request({
					url: this.localApiV1 + 'sendOne',
					method: 'POST',
					header: {
						"Content-Type": "application/json; charset=UTF-8"
					},
					data: {
						userAddress: this.myAddress,
						hash: this.fromCoinNum,
						info: this.toCoinNum
					},
					success: (res) => {
						if (res.data.success) {
							swal({
								title: this.$t('swap11'),
								icon: "success"
							})
						} else{
							swal({
								title: res.data.msg,
								icon: "error",
							})
						}
						
					}
				});
			},
			loadClick() {
				let _this = this;
				_this.$refs.loading.open();
				setTimeout(() => {
					_this.$refs.loading.close();
				}, 1000);
			},
			mobileFilter1(val) {
				let inNumber = val.toString();
				let num = this.ethers.utils.formatUnits(inNumber);
				if (parseInt(num) === parseFloat(num)) {
					return parseInt(num)
				} else {
					return Number(num)
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	@media all and (min-width: 700px) and (max-width: 2880px){
		.content {
			width: 100%;
			// height: auto;
			min-height: 100vh;
			box-sizing: border-box;
			position: relative;
			padding-bottom: 30upx;
			background-color: #F5F9FF;
			padding-top: 120upx;
			.backTitle {
				margin: 38rpx 44rpx;
		
				image {
					width: 60rpx;
					height: 54rpx;
				}
			}
		
			.centerBox {
				width: 50%;
				margin: 40rpx auto;
				box-sizing: border-box;
				background-color: #fff;
			// margin: 40rpx 30rpx 0 30rpx;
				border: 2rpx solid #e5e5e5;
				border-radius: 30rpx;
				.bodyList{
					padding: 0 28rpx;
				}
				.poolTitle {
					position: relative;
					text-align: center;
					margin-bottom: 30upx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 30upx;
					padding: 0 28rpx;
					height: 112rpx;
					background: linear-gradient( 270deg, #F4CDCD 0%, #E283E7 43%, #6652D9 100%);
					border-radius: 30rpx 30rpx 0 0;
					.back {
						width: 56upx;
						height: 56upx;
					}
					.title {
						color: #fff;
					}
					.rightN{
						width: 56rpx;
						display: flex;
						justify-content: right;
						image {
							width: 32rpx;
							height: 32rpx;
						}
					}
				}
		
				.lpBox {
					margin-top: 20rpx;
					padding-bottom: 40rpx;
		
					.coinBox {
						margin-top: 23rpx;
						display: flex;
						align-items: center;
		
						.coinNameBox {
							height: 65rpx;
							border-radius: 40rpx;
							line-height: 65rpx;
							display: flex;
							margin-right: 25rpx;
							.coinSmall {
								display: flex;
								align-items: center;
								text {
									color: #000;
									font-size: 34rpx;
									margin-left: 10rpx;
								}
								.slectIcon2 {
									width: 42rpx;
									height: 42rpx;
									border-radius: 50%;
								}
								.slectIcon {
									width: 42rpx;
									height: 42rpx;
								}
							}
						}
						
						.coinMax {
							width: 80rpx;
							height: 45rpx;
							line-height: 45rpx;
							text-align: center;
							border: 2rpx solid #7328E4;
							color: #7328E4;
							font-size: 24rpx;
							font-weight: bold;
							border-radius: 40rpx;
						}
					}
		
					.inputToBox {
						.blanceTitle {
							display: flex;
							justify-content: right;
							color: #000000;
							font-size: 24rpx;
							margin-bottom: 11rpx;
							margin-right: 40rpx;
						}
						
						.inputBody {
							height: 169rpx;
							background: rgba(115,40,228,0.1);
							border-radius: 30rpx;
							padding: 0 45rpx;
						
							input {
								width: 100%;
								height: 100%;
								font-size: 36rpx;
								color: #6929C4;
							}
							textarea {
								height: 100%;
							}
						}
					}
		
					.SlippageBox {
						margin-top: 40rpx;
		
						.boxTitle {
							font-size: 38rpx;
							color: #fff;
						}
		
						.slipBox {
							display: flex;
							align-items: center;
							margin-top: 30rpx;
		
							.list {
								width: 140rpx;
								height: 65rpx;
								line-height: 65rpx;
								text-align: center;
								border-radius: 40rpx;
								font-size: 36rpx;
								font-weight: bold;
								margin-right: 40rpx;
							}
		
							.listActive {
								background-color: rgba(0, 222, 161, 1);
								color: #000;
							}
		
							.listNoActive {
								background-color: rgba(0, 222, 161, .4);
								color: rgba(255, 255, 255, .4);
							}
		
							.list2 {
								width: 140rpx;
								height: 65rpx;
								line-height: 65rpx;
								text-align: center;
								border-radius: 40rpx;
								font-size: 36rpx;
								font-weight: bold;
								display: flex;
								align-items: center;
		
								input {
									width: 100%;
									height: 100%;
								}
							}
						}
					}
		
					.centerIcon {
						display: flex;
						justify-content: center;
						margin: 40rpx 0;
						
						.changebox {
							width: 77rpx;
							height: 77rpx;
							line-height: 96rpx;
							background: #6929C4;
							border-radius: 42rpx;
							text-align: center;
							image {
								width: 42rpx;
								height: 42rpx;
							}
						}
					}
		
					.btnGoAppove {
						display: flex;
						justify-content: center;
						margin-top: 80rpx;
		
						.btn {
							width: 300rpx;
							height: 90rpx;
							line-height: 90rpx;
							text-align: center;
							color: #000;
							font-size: 34rpx;
							font-weight: bold;
							background-color: #00DEA1;
							border-radius: 60rpx;
						}
					}
		
					.btnGo {
						display: flex;
						justify-content: center;
						margin-top: 80rpx;
		
						.btn {
							width: 300rpx;
							height: 90rpx;
							line-height: 90rpx;
							text-align: center;
							color: #000;
							font-weight: bold;
							font-size: 34rpx;
							background-color: #00DEA1;
							border-radius: 60rpx;
						}
					}
				}
		
		
			}
		}
		
		.maskRe {
			width: 550rpx;
			padding: 20rpx;
			border-radius: 20rpx;
			border: 2rpx solid #000;
			background-color: #fff;
			.title{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 25rpx;
				.left{
					width: 50rpx;
				}
				.center{
					color: #000;
					font-size: 28rpx;
					font-weight: bold;
				}
				.right{
					image{
						width: 50rpx;
						height: 50rpx;
					}
				}
			}
			.tokenList{
				padding: 18rpx;
				.coinListTitle{
					display: flex;
					justify-content: space-between;
					border-bottom: 2px solid #e5e5e5;
					padding: 20rpx 0;
					.left{
						font-size: 30rpx;
						color: #000;
					}
					.right{
						image{
							width: 60rpx;
							height: 60rpx;
							margin-right: 5rpx;
							border-radius: 50%;
						}
					}
				}
				.listOne{
					margin-top: 20rpx;
					display: flex;
					justify-content: space-between;
					.oneLeft{
						color: gray;
					}
					.oneRight{
						color: #00dea1;
					}
				}
				.btnBootom{
					display: flex;
					justify-content: center;
					margin-top: 50rpx;
					.btn{
						width: 100%;
						height: 100rpx;
						line-height: 100rpx;
						text-align: center;
						background: linear-gradient( 90deg, #AF6EFF 0%, #8D60FF 100%);
						border-radius: 42rpx;
						color: #fff;
					}
				}
			}
		}
		.slideStyle {
			background-image: url('../../static/logo.png');
			background-size: 100% 100%;
			width: 60rpx;
			height: 60rpx;
		}
		
		
		
		.clientText {
			color: #fff;
			text-align: center;
			font-size: 24upx;
			margin-top: 20upx;
		}
		
		.client {
			.samll {
				color: #fff;
				text-align: center;
				font-size: 24upx;
				margin-top: 20upx;
			}
		
			.text {
				color: #00DEA1;
				text-align: center;
				font-size: 24upx;
				margin-top: 20upx;
			}
		}
		
		.tipMsg {
			background: rgba(255,24,28,0.1);
			padding: 28upx;
			border-radius: 28upx;
			margin-bottom: 40upx;
			
			.text {
				font-family: Noto Sans SC, Noto Sans SC;
				font-weight: 400;
				font-size: 24rpx;
				color: #DA1E28;
			}
		}
		
		.sharePool {
			margin-top: 30upx;
			
			.title {
				font-size: 26upx;
				color: #000;
				font-weight: bold;
			}
			
			.shareList {
				display: flex;
				align-items: center;
				justify-content: center;
				border: 2upx solid #E0E0E0;
				padding: 30upx 0;
				border-radius: 15upx;
				margin-top: 20upx;
			
				.item {
					width: 33.3%;
					color: #000;
					text-align: center;
					font-size: 24upx;
				}
				.num{
					font-weight: bold;
				}
			}
		}
		
		.shareBtn {
			background: linear-gradient( 90deg, #AF6EFF 0%, #8D60FF 100%);
			padding: 30upx;
			margin-top: 56upx;
			border-radius: 42upx;
			
			.text {
				font-size: 30upx;
				color: #fff;
				text-align: center;
			}
			.btnNo{
				font-size: 30upx;
				color: red;
				text-align: center;
			}
		}
		.btnGo2{
			display: flex;
			justify-content: center;
			margin-top: 80rpx;
			margin-bottom: 40rpx;
			.btn{
				width: 357rpx;
				height: 90rpx;
				line-height: 90rpx;
				text-align: center;
				color: #fff;
				font-size: 36rpx;
				font-weight: bold;
				background: linear-gradient( 270deg, #F4CDCD 0%, #E283E7 43%, #6652D9 100%);
				border-radius: 50rpx;
			}
		}
		.tip{
			background-color: rgb(247 220 222);
			margin: 30upx;
			padding: 15upx;
			border-radius: 15upx;
			.text{
				font-size: 28upx;
				color:rgb(234 53 53);
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
			.backTitle {
				margin: 38rpx 44rpx;
		
				image {
					width: 60rpx;
					height: 54rpx;
				}
			}
		
			.centerBox {
				max-width: 750rpx;
				margin: 40rpx 30rpx 0 30rpx;
				border: 2rpx solid #e5e5e5;
				border-radius: 20rpx;
				.bodyList{
					padding: 0 28rpx;
				}
				.poolTitle {
					position: relative;
					text-align: center;
					margin-bottom: 30upx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 30upx;
					padding: 0 28rpx;
					height: 112rpx;
					background: linear-gradient( 270deg, #F4CDCD 0%, #E283E7 43%, #6652D9 100%);
					border-radius: 30rpx 30rpx 0 0;
					.back {
						width: 56upx;
						height: 56upx;
					}
					.title {
						color: #fff;
					}
					.rightN{
						width: 56rpx;
						display: flex;
						justify-content: right;
						image {
							width: 32rpx;
							height: 32rpx;
						}
					}
				}
		
				.lpBox {
					margin-top: 20rpx;
					padding-bottom: 40rpx;
		
					.coinBox {
						margin-top: 23rpx;
						display: flex;
						align-items: center;
		
						.coinNameBox {
							height: 65rpx;
							border-radius: 40rpx;
							line-height: 65rpx;
							display: flex;
							margin-right: 25rpx;
							.coinSmall {
								display: flex;
								align-items: center;
								text {
									color: #000;
									font-size: 34rpx;
									margin-left: 10rpx;
								}
								.slectIcon2 {
									width: 42rpx;
									height: 42rpx;
									border-radius: 50%;
								}
								.slectIcon {
									width: 42rpx;
									height: 42rpx;
								}
							}
						}
						
						.coinMax {
							width: 80rpx;
							height: 45rpx;
							line-height: 45rpx;
							text-align: center;
							border: 2rpx solid #7328E4;
							color: #7328E4;
							font-size: 24rpx;
							font-weight: bold;
							border-radius: 40rpx;
						}
					}
		
					.inputToBox {
						.blanceTitle {
							display: flex;
							justify-content: right;
							color: #000000;
							font-size: 24rpx;
							margin-bottom: 11rpx;
							margin-right: 40rpx;
						}
						
						.inputBody {
							height: 169rpx;
							background: rgba(115,40,228,0.1);
							border-radius: 30rpx;
							padding: 0 45rpx;
						
							input {
								width: 100%;
								height: 100%;
								font-size: 36rpx;
								color: #6929C4;
							}
							textarea {
								height: 100%;
							}
						}
					}
		
					.SlippageBox {
						margin-top: 40rpx;
		
						.boxTitle {
							font-size: 38rpx;
							color: #fff;
						}
		
						.slipBox {
							display: flex;
							align-items: center;
							margin-top: 30rpx;
		
							.list {
								width: 140rpx;
								height: 65rpx;
								line-height: 65rpx;
								text-align: center;
								border-radius: 40rpx;
								font-size: 36rpx;
								font-weight: bold;
								margin-right: 40rpx;
							}
		
							.listActive {
								background-color: rgba(0, 222, 161, 1);
								color: #000;
							}
		
							.listNoActive {
								background-color: rgba(0, 222, 161, .4);
								color: rgba(255, 255, 255, .4);
							}
		
							.list2 {
								width: 140rpx;
								height: 65rpx;
								line-height: 65rpx;
								text-align: center;
								border-radius: 40rpx;
								font-size: 36rpx;
								font-weight: bold;
								display: flex;
								align-items: center;
		
								input {
									width: 100%;
									height: 100%;
								}
							}
						}
					}
		
					.centerIcon {
						display: flex;
						justify-content: center;
						margin: 40rpx 0;
						
						.changebox {
							width: 77rpx;
							height: 77rpx;
							line-height: 96rpx;
							background: #6929C4;
							border-radius: 42rpx;
							text-align: center;
							image {
								width: 42rpx;
								height: 42rpx;
							}
						}
					}
		
					.btnGoAppove {
						display: flex;
						justify-content: center;
						margin-top: 80rpx;
		
						.btn {
							width: 300rpx;
							height: 90rpx;
							line-height: 90rpx;
							text-align: center;
							color: #000;
							font-size: 34rpx;
							font-weight: bold;
							background-color: #00DEA1;
							border-radius: 60rpx;
						}
					}
		
					.btnGo {
						display: flex;
						justify-content: center;
						margin-top: 80rpx;
		
						.btn {
							width: 300rpx;
							height: 90rpx;
							line-height: 90rpx;
							text-align: center;
							color: #000;
							font-weight: bold;
							font-size: 34rpx;
							background-color: #00DEA1;
							border-radius: 60rpx;
						}
					}
				}
		
		
			}
		}
		
		.maskRe {
			width: 550rpx;
			padding: 20rpx;
			border-radius: 20rpx;
			border: 2rpx solid #000;
			background-color: #fff;
			.title{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 25rpx;
				.left{
					width: 50rpx;
				}
				.center{
					color: #000;
					font-size: 28rpx;
					font-weight: bold;
				}
				.right{
					image{
						width: 50rpx;
						height: 50rpx;
					}
				}
			}
			.tokenList{
				padding: 18rpx;
				.coinListTitle{
					display: flex;
					justify-content: space-between;
					border-bottom: 2px solid #e5e5e5;
					padding: 20rpx 0;
					.left{
						font-size: 30rpx;
						color: #000;
					}
					.right{
						image{
							width: 60rpx;
							height: 60rpx;
							margin-right: 5rpx;
							border-radius: 50%;
						}
					}
				}
				.listOne{
					margin-top: 20rpx;
					display: flex;
					justify-content: space-between;
					.oneLeft{
						color: gray;
					}
					.oneRight{
						color: #00dea1;
					}
				}
				.btnBootom{
					display: flex;
					justify-content: center;
					margin-top: 50rpx;
					.btn{
						width: 100%;
						height: 100rpx;
						line-height: 100rpx;
						text-align: center;
						background: linear-gradient( 90deg, #AF6EFF 0%, #8D60FF 100%);
						border-radius: 42rpx;
						color: #fff;
					}
				}
			}
		}
		.slideStyle {
			background-image: url('../../static/logo.png');
			background-size: 100% 100%;
			width: 60rpx;
			height: 60rpx;
		}
		
		
		
		.clientText {
			color: #fff;
			text-align: center;
			font-size: 24upx;
			margin-top: 20upx;
		}
		
		.client {
			.samll {
				color: #fff;
				text-align: center;
				font-size: 24upx;
				margin-top: 20upx;
			}
		
			.text {
				color: #00DEA1;
				text-align: center;
				font-size: 24upx;
				margin-top: 20upx;
			}
		}
		
		.tipMsg {
			background: rgba(255,24,28,0.1);
			padding: 28upx;
			border-radius: 28upx;
			margin-bottom: 40upx;
			
			.text {
				font-family: Noto Sans SC, Noto Sans SC;
				font-weight: 400;
				font-size: 24rpx;
				color: #DA1E28;
			}
		}
		
		.sharePool {
			margin-top: 30upx;
			
			.title {
				font-size: 26upx;
				color: #000;
				font-weight: bold;
			}
			
			.shareList {
				display: flex;
				align-items: center;
				justify-content: center;
				border: 2upx solid #E0E0E0;
				padding: 30upx 0;
				border-radius: 15upx;
				margin-top: 20upx;
			
				.item {
					width: 33.3%;
					color: #000;
					text-align: center;
					font-size: 24upx;
				}
				.num{
					font-weight: bold;
				}
			}
		}
		
		.shareBtn {
			background: linear-gradient( 90deg, #AF6EFF 0%, #8D60FF 100%);
			padding: 30upx;
			margin-top: 56upx;
			border-radius: 42upx;
			
			.text {
				font-size: 30upx;
				color: #fff;
				text-align: center;
			}
			.btnNo{
				font-size: 30upx;
				color: red;
				text-align: center;
			}
		}
		.btnGo2{
			display: flex;
			justify-content: center;
			margin-top: 80rpx;
			margin-bottom: 40rpx;
			.btn{
				width: 357rpx;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				color: #fff;
				font-size: 36rpx;
				font-weight: bold;
				background: linear-gradient( 270deg, #F4CDCD 0%, #E283E7 43%, #6652D9 100%);
				border-radius: 50rpx;
			}
		}
		.tip{
			background-color: rgb(247 220 222);
			margin: 30upx;
			padding: 15upx;
			border-radius: 15upx;
			.text{
				font-size: 28upx;
				color:rgb(234 53 53);
			}
		}
	}
	
</style>