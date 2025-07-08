<template>
	<view class="content">
		<back ref="child" text="" :text="myAddress" :type="1" @connectWallet="connectWallet" :classType="true"
			subheading="true" @getMsg="getMsg">
		</back>
		<view class="centerBox">
			<view class="poolTitle">
				<view class="back" @tap="backGo">
					<image src="../../static/back1.png" mode=""></image>
				</view>
				<view class="title">
					{{pageType == 'my'?this.$t('pool6'):this.$t('pool5')}}{{$t('pool7')}}
				</view>
			</view>
			<view class="poolInfo">
				<view class="infoLeft">
					<view class="coinD">
						<image src="/static/TBC.png" mode=""></image>
						<image :src="pooInfoArr.contractName == 'SATOSHI'?'https://dapp.onionswap.info/SATOSHI.png':'https://dapp.onionswap.info/logo.png'" mode=""></image>
					</view>
					<view class="coinNmaeD">
						{{'TBC/'+pooInfoArr.contractName}}
					</view>
				</view>
				<view class="infoRight">
					<view class="oneRight" @tap="copyAddress(pooInfoArr.poolContract)">
						<view class="top">
							{{$t('pool7')}} ID：
						</view>
						<view class="bottom">
							{{pooInfoArr.poolContract}}
						</view>
					</view>
					<view class="oneRight" @tap="copyAddress(pooInfoArr.ftContract)">
						<view class="top">
							{{$t('TokenN')}} ID：
						</view>
						<view class="bottom">
							{{pooInfoArr.ftContract}}
						</view>
					</view>
				</view>
			</view>
			<view class="coinSetBody">
				<view v-if="isMaskVisible" class="maskStyle">
					<view class="loader"></view>
				</view>
				<view class="bigTilte">
					{{$t('pool8')}}
				</view>
				<view class="smallTitle">
					{{$t('pool9')}}：{{poolPersonInfo.ft_lp_balance/Math.pow(10, pooInfoArr.ftDecimal)}}
				</view>
				<view class="boxInfo">
					<view class="infoCoinNum" style="margin-bottom: 20rpx;">
						<view class="numLeft">
							<image src="/static/TBC.png" mode=""></image>
							<text>TBC</text>
						</view>
						<view class="numRight">
							{{Math.floor((poolPersonInfo.tbc_balance/Math.pow(10, 6))*1000000)/1000000}}
						</view>
					</view>
					<view class="infoCoinNum">
						<view class="numLeft">
							<image :src="pooInfoArr.contractName == 'SATOSHI'?'https://dapp.onionswap.info/SATOSHI.png':'https://dapp.onionswap.info/logo.png'" mode=""></image>
							<text>{{pooInfoArr.contractName}}</text>
						</view>
						<view class="numRight">
							{{Math.floor(poolPersonInfo.ft_a_balance/Math.pow(10, pooInfoArr.ftDecimal)*1000000)/1000000}}
						</view>
					</view>
				</view>
				<view class="btnBox">
					<view class="btnOne" @tap="clickGo('add')">
						{{$t('pool10')}}
					</view>
					<view class="btnTwo" @tap="clickGo('remove')">
						{{$t('pool11')}}
					</view>
				</view>
				
			</view>
			<view class="titleEnd">
				{{$t('pool12')}}
			</view>
			<view class="coinSetBody">
				<view class="bigTilte">
					{{$t('pool8')}}
				</view>
				<view class="smallTitle">
					{{$t('pool9_1')}}：{{nowPoolData.ft_lp_balance/Math.pow(10, pooInfoArr.ftDecimal)}}
				</view>
				<view class="boxInfo">
					<view class="infoCoinNum" style="margin-bottom: 20rpx;">
						<view class="numLeft">
							<image src="/static/TBC.png" mode=""></image>
							<text>TBC</text>
						</view>
						<view class="numRight">
							{{nowPoolData.tbc_balance/Math.pow(10, 6)}}
						</view>
					</view>
					<view class="infoCoinNum">
						<view class="numLeft">
							<image :src="pooInfoArr.contractName == 'SATOSHI'?'https://dapp.onionswap.info/SATOSHI.png':'https://dapp.onionswap.info/logo.png'" mode=""></image>
							<text>{{pooInfoArr.contractName}}</text>
						</view>
						<view class="numRight">
							{{nowPoolData.ft_a_balance/Math.pow(10, pooInfoArr.ftDecimal)}}
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
				pooInfoArr: [],
				nowPoolData: [],
				poolPersonInfo: [],
				isMaskVisible: false
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
			this.pageType = option.pageType;
			this.pooInfoArr = JSON.parse(decodeURIComponent(option.poolInfo));
			this.getNowPoolBalance(this.pooInfoArr.poolContract);
			this.Init();
		},
		methods: {
			Init() {
				if (uni.getStorageSync('walletAddress') == undefined || uni.getStorageSync('walletAddress') == '') {
					console.log("Please connect wallet!")
				} else {
					this.myAddress = uni.getStorageSync('walletAddress');
					this.getNowPersonPollBalance();
				}
			},
			getNowPersonPollBalance() {
				let newHash = test(this.pooInfoArr.poolContract,this.myAddress,this.pooInfoArr.contractName).then(items => {
					this.getNowPersonPool(items);
				})
			},
			getNowPersonPool(valData) {
				this.isMaskVisible = true;
				let personNum = 0;
				let onloadData = [];
				try{
					uni.request({
						url: this.urlApi + 'ft/lp/unspent/by/script/hash'+valData[0].ftlpCodeHash,
						method: 'GET',
						header: {
							"Content-Type": "application/json; charset=UTF-8"
						},
						data: {
						},
						success: (res) => {
							if(res.statusCode == 200) {
								this.isMaskVisible = false;
								if(res.data.ftUtxoList.length == 0) {
									onloadData.push({
										"ft_lp_balance":0,
										"ft_a_balance":0,
										"tbc_balance":0,
										"contractName":valData[0].contractName,
										"ftDecimal":valData[0].ftDecimal,
										"poolContract":valData[0].poolContract,
										"ftContract":valData[0].FTContract
									})
								} else{
									res.data.ftUtxoList.forEach(item => {
										personNum += item.ftBalance;
									})
									if(personNum != 0) {
										onloadData.push({
											"ft_lp_balance":personNum,
											"ft_a_balance":(personNum/valData[0].ft_lp_amount)*valData[0].ft_a_amount,
											"tbc_balance":(personNum/valData[0].ft_lp_amount)*valData[0].tbc_amount,
											"contractName":valData[0].contractName,
											"ftDecimal":valData[0].ftDecimal,
											"poolContract":valData[0].poolContract,
											"ftContract":valData[0].FTContract
										})
									}
								}
								this.poolPersonInfo = onloadData[0];
							}
						}
					});
				}catch(error) {
					this.isMaskVisible = false;
					console.log(error)
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
			clickGo(Type) {
				if(Type == 'add') {
					uni.navigateTo({
					   url: './poolAdd'+'?poolContract='+this.pooInfoArr.poolContract+'&coinDecimal='+this.pooInfoArr.ftDecimal
					})
				} else{
					let newRemoveInfo = encodeURIComponent(JSON.stringify(this.pooInfoArr))
					uni.navigateTo({
					   url: './poolRemove'+'?poolInfo='+newRemoveInfo
					})
				}
				
			},
			getNowPoolBalance(address) {
				try{
					uni.request({
						url: this.urlApi + 'ft/pool/nft/info/contract/id/'+address,
						method: 'GET',
						header: {
							"Content-Type": "application/json; charset=UTF-8"
						},
						data: {
						},
						success: (res) => {
							if(res.statusCode == 200) {
								this.nowPoolData = res.data;
							}
						}
					});
				}catch(error) {
					console.log(error)
				}
			},
			backGo() {
				uni.navigateTo({
				   url: './pool'
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
					margin: 26rpx 0 56rpx 0;
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
				.poolInfo{
					margin-top: 30rpx;
					.infoLeft{
						display: flex;
						align-items: center;
						.coinD{
							display: flex;
							align-items: center;
							image{
								width: 70rpx;
								height: 70rpx;
								border-radius: 50%;
								margin-right: 2rpx;
							}
						}
						.coinNmaeD{
							font-family: Noto Sans SC, Noto Sans SC;
							font-weight: 600;
							font-size: 42rpx;
							color: #161616;
							margin-left: 20rpx;
						}
					}
					.infoRight{
						margin-top: 20rpx;
						padding-left: 20rpx;
						.oneRight{
							margin-top: 20rpx;
							font-family: Noto Sans SC, Noto Sans SC;
							font-weight: 400;
							font-size: 21rpx;
							color: #525252;
							.bottom{
								word-wrap: break-word;
							}
						}
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
					padding: 40rpx 30rpx;
					margin-top: 20rpx;
					position: relative;
					.maskStyle{
						position: absolute;
						  top: 0;
						  left: 0;
						  right: 0;
						  bottom: 0;
						  background-color: rgba(0, 0, 0, 0.09); /* 半透明黑色遮罩 */
						  z-index: 10;
					}
					.bigTilte{
						color: #000;
						font-size: 30rpx;
						margin-bottom: 30rpx;
						font-weight: bold;
					}
					.smallTitle{
						color: gray;
						font-size: 30rpx;
						margin-bottom: 30rpx;
					}
					.boxInfo{
						background-color: #F5F9FF;
						border-radius: 20rpx;
						padding: 30rpx 40rpx;
						.infoCoinNum{
							display: flex;
							justify-content: space-between;
							.numLeft{
								display: flex;
								align-items: center;
								color: #000;
								font-weight: bold;
								image{
									width: 40rpx;
									height: 40rpx;
									margin-right: 10rpx;
								}
							}
							.numRight{
								font-weight: bold;
								color: #3367D6;
							}
						}
					}
					.btnBox{
						display: flex;
						justify-content: space-between;
						align-items: center;
						.btnOne{
							width: 48%;
							height: 90rpx;
							line-height: 90rpx;
							text-align: center;
							background: linear-gradient( 90deg, #AF6EFF 0%, #8D60FF 100%);
							margin: 30rpx 0;
							border-radius: 40rpx;
							color: #fff;
						}
						.btnTwo{
							width: 48%;
							height: 90rpx;
							line-height: 90rpx;
							text-align: center;
							background: linear-gradient( 90deg, #8D60FF 0%, #AF6EFF 100%);
							color: #fff;
							border-radius: 40rpx;
							opacity: 0.75;
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
					margin: 26rpx 0 56rpx 0;
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
				.poolInfo{
					margin-top: 30rpx;
					.infoLeft{
						display: flex;
						align-items: center;
						.coinD{
							display: flex;
							align-items: center;
							image{
								width: 70rpx;
								height: 70rpx;
								border-radius: 50%;
								margin-right: 2rpx;
							}
						}
						.coinNmaeD{
							font-family: Noto Sans SC, Noto Sans SC;
							font-weight: 600;
							font-size: 42rpx;
							color: #161616;
							margin-left: 20rpx;
						}
					}
					.infoRight{
						margin-top: 20rpx;
						padding-left: 20rpx;
						.oneRight{
							margin-top: 20rpx;
							font-family: Noto Sans SC, Noto Sans SC;
							font-weight: 400;
							font-size: 21rpx;
							color: #525252;
							.bottom{
								word-wrap: break-word;
							}
						}
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
					padding: 40rpx 30rpx;
					margin-top: 20rpx;
					position: relative;
					.maskStyle{
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						background-color: rgba(0, 0, 0, 0.09); /* 半透明黑色遮罩 */
						z-index: 10;
						border-radius: 20rpx;
					}
					.bigTilte{
						color: #000;
						font-size: 30rpx;
						margin-bottom: 30rpx;
						font-weight: bold;
					}
					.smallTitle{
						color: gray;
						font-size: 30rpx;
						margin-bottom: 30rpx;
					}
					.boxInfo{
						background-color: #F5F9FF;
						border-radius: 20rpx;
						padding: 30rpx 40rpx;
						.infoCoinNum{
							display: flex;
							justify-content: space-between;
							.numLeft{
								display: flex;
								align-items: center;
								color: #000;
								font-weight: bold;
								image{
									width: 40rpx;
									height: 40rpx;
									margin-right: 10rpx;
								}
							}
							.numRight{
								font-weight: bold;
								color: #3367D6;
							}
						}
					}
					.btnBox{
						display: flex;
						justify-content: space-between;
						align-items: center;
						.btnOne{
							width: 48%;
							height: 90rpx;
							line-height: 90rpx;
							text-align: center;
							background: linear-gradient( 90deg, #AF6EFF 0%, #8D60FF 100%);
							margin: 30rpx 0;
							border-radius: 40rpx;
							color: #fff;
						}
						.btnTwo{
							width: 48%;
							height: 90rpx;
							line-height: 90rpx;
							text-align: center;
							background: linear-gradient( 90deg, #8D60FF 0%, #AF6EFF 100%);
							color: #fff;
							border-radius: 40rpx;
							opacity: 0.75;
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