<template>
	<view class="content">
		<back ref="child" text="" :text="myAddress" :type="1" @connectWallet="connectWallet" :classType="true"
			subheading="true" @getMsg="getMsg">
		</back>
		<view class="centerBox">
			<view class="poolTitle">
				<view class="back" @tap="backGo">
					<image src="../../static/Arrowleft.png" mode=""></image>
				</view>
				<view class="title">
					{{$t('addP1')}}
				</view>
				<view class="rightN">
					<image @tap="loadClick" src="../../static/load.png" mode=""></image>
				</view>
			</view>
			<view class="bodyList">
				<view class="tipMsg" v-if="poolType==3">
					<view class="text">
						{{$t('pool13')}}: {{$t('addP2')}}
					</view>
				</view>
				<view class="lpBox">
					<view class="coinBox">
						<view class="coinNameBox">
							<view class="coinSmall">
								<image class="slectIcon" src="../../static/TBC.png" mode=""></image>
								<text>{{fromCur.name?fromCur.name:$t('index6')}}</text>
							</view>
						</view>
						<view class="coinMax" @tap="fromCoinNum = fromCur.balance">
							MAX
						</view>
					</view>
					<view class="inputToBox">
						<view class="blanceTitle">
							{{$t('index7')}}：<text style="color: #6929C4;">{{fromCur.balance}} </text>
						</view>
						<view class="inputBody">
							<input v-model="fromCoinNum" type="text" />
						</view>
					</view>
					<view class="centerIcon">
						<view class="changebox">
							<image src="../../static/icon3.png" mode=""></image>
						</view>
					</view>
					<view class="coinBox">
						<view class="coinNameBox">
							<view class="coinSmall" @tap="showPupCoin('to')">
								<image class="slectIcon2" :src="toCur.logoURI == ''?'https://dapp.onionswap.info/logo.png':toCur.logoURI" mode=""></image>
								<text>{{toCur.name?toCur.name:$t('index6')}}</text>
								<image class="slectIcon" src="../../static/bottomIcon.png" mode=""></image>
							</view>
						</view>
					</view>
					<view class="inputToBox">
						<view class="blanceTitle">
							{{$t('index7')}}：<text style="color: #6929C4;">{{toCur.balance}} </text>
						</view>
						<view class="inputBody">
							<input v-model="toCoinNum" type="text" />
						</view>
					</view>
					<view class="clientText" v-if="poolType==1">
						{{$t('addP3')}}
					</view>
					<view v-if="statusCanPool">
						<view class="client" v-if="poolType==2">
							<view class="text" @tap="clickGoNew">
								{{$t('new1')}}
							</view>
						</view>
					</view>
					<view v-else>
						<view class="client" v-if="poolType==2">
							<view class="samll">
								{{$t('addP4')}}
							</view>
							<view class="text" @click="poolType=3">
								{{$t('addP5')}}
							</view>
						</view>
					</view>
					<!-- <view class="SlippageBox" v-if="poolType==3">
						<view class="boxTitle">
							{{$t('new10')}}
						</view>
						<view class="slipBox">
							<view class="list" :class="slipCrrent == index?'listActive':'listNoActive'"
								v-for="(item, index) in slipData" :key="index" @tap="clickSlip(index)">
								{{item}}%
							</view>
							<view class="list2" :class="slipCrrent == 3?'listActive':'listNoActive'">
								<input v-model="selfSlip" @input="inputNum" :placeholder="$t('index9')" placeholder-style="color: rgba(51, 103, 214, .3);" type="text" /><text
									style="margin-right: 20rpx;">%</text>
							</view>
						</view>
					</view> -->
					<view class="sharePool" v-if="poolType==3">
						<view class="title">
							{{$t('addP6')}}
						</view>
						<view class="shareList">
							<view class="item">
								<view class="num">
									1
								</view>
								<view class="text">
									{{fromCur.name}} per {{toCur.name}}
								</view>
							</view>
							<view class="item">
								<view class="num">
									1
								</view>
								<view class="text">
									{{toCur.name}} per {{fromCur.name}}
								</view>
							</view>
							<view class="item">
								<view class="num">
									100%
								</view>
								<view class="text">
									{{$t('pool15')}}
								</view>
							</view>
						</view>
					</view>
					<view class="shareBtn" @tap="clickShowSupply" v-if="poolType==3">
						<view class="text">
							{{$t('pool16')}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popup2" type="center" :mask-background-color="activeCole" :mask-click="true">
			<view class="maskRe">
				<view class="title">
					<view class="left">
					</view>
					<view class="center">
						{{$t('pool17')}}
					</view>
					<view class="right" @tap="closePup2">
						<image src="../../static/close2.png" mode=""></image>
					</view>
				</view>
				<view class="tokenList">
					<view class="coinListTitle">
						<view class="left">
							{{fromCur.name}} / {{toCur.name}}
						</view>
						<view class="right">
							<image :src="fromCur.logoURI==''?'https://dapp.onionswap.info/logo.png':fromCur.logoURI" mode=""></image>
							<image :src="toCur.logoURI==''?'https://dapp.onionswap.info/logo.png':toCur.logoURI" mode=""></image>
						</view>
					</view>
					<view class="listOne">
						<text class="oneLeft">{{fromCur.name}} {{$t('pool18')}}</text>
						<text class="oneRight">{{fromCoinNum}}</text>
					</view>
					<view class="listOne">
						<text class="oneLeft">{{toCur.name}} {{$t('pool18')}}</text>
						<text class="oneRight">{{toCoinNum}}</text>
					</view>
					<view class="listOne">
						<text class="oneLeft">{{$t('new12')}}</text>
						<text class="oneRight">{{slipCrrent == 3?selfSlip:slipData[slipCrrent]}}%</text>
					</view>
					<view class="listOne">
						<text class="oneLeft">{{$t('pool19')}}</text>
						<view class="oneRight">
							<view>1 {{fromCur.name}} = 1 {{toCur.name}}</view>
							<view>1 {{toCur.name}} = 1 {{fromCur.name}}</view>
						</view>
					</view>
					<view class="listOne">
						<text class="oneLeft">{{$t('pool15')}}</text>
						<text class="oneRight">100%</text>
					</view>
					<view class="btnBootom">
						<view class="btn" @tap="clickSupply">
							{{$t('addP7')}}
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="popup" type="center" :mask-background-color="activeCole" :mask-click="true">
			<select-coin @clickClose="closePup" @clickBackInfo="backInfo"></select-coin>
		</uni-popup>
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
				slipData: ['0.25', '1.0', '3.0'],
				slipCrrent: 0,
				selfSlip: '',
				toCoinNum: '',
				fromCoinNum: '',
				lpNum: 0,
				ApproveWbnb: false,
				ApproveDawkoin: false,
				lamount: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
				sliderValue: 0,
				DawkoinLpNum: 0,
				wbnbLpNum: 0,
				ApproveLP: false,
				userLpCount: 0,
				statusCanPool: false,

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
				nowPoolCoin: ''
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
		onLoad() {
			this.Init();
		},
		methods: {
			Init() {
				if (uni.getStorageSync('walletAddress') == undefined || uni.getStorageSync('walletAddress') == '') {
					console.log("Please connect wallet!")
				} else {
					this.myAddress = uni.getStorageSync('walletAddress');
					this.getCoinBalance(this.fromCur,'from')
				}
			},
			clickSlip(val) {
				this.slipCrrent = val;
			},
			slideChange(e) {},
			changeIcon() {
				const tempCurrency = {
					...this.toCur
				};
				this.toCur = {
					...this.fromCur
				};
				this.fromCur = {
					...tempCurrency
				};

				const tempInput = this.toInput;
				this.toInput = this.fromInput;
				this.fromInput = tempInput;

				this.goType = this.goType === 'from' ? 'to' : 'from';
			},
			closePup(e) {
				this.$refs.popup.close();
			},
			closePup2() {
				this.$refs.popup2.close();
			},
			clickShowSupply() {
				if(this.fromCoinNum == '' || this.toCoinNum == '') {
					swal({
						title: this.$t('new9'),
						icon: "error",
					})
					return ;
				}
				this.$refs.popup2.open();
			},
			clickGoNew() {
				uni.navigateTo({
				   url: './poolAdd'+'?poolContract='+this.nowPoolCoin+'&coinDecimal='+this.toCur.decimals
				})
			},
			async clickSupply() {
				let lpVal = this.slipCrrent == 3?this.selfSlip:this.slipData[this.slipCrrent];
				try{
					this.$refs.loading.open();
					const params = [{
						flag: "POOLNFT_MINT",
						ft_contract_address: this.toCur.address,
						poolNFT_version: 2,
						serverProvider_tag: "Onion",
						serviceFeeRate: JSON.parse(lpVal*100), // poolNFT_version为2时此参数有效，默认为25
						with_lock: false
					}];
					const {txid,rawtx} = await window.Turing.sendTransaction(params);
					this.poolInit(txid);
				} catch(err) {
					this.$refs.loading.close();
				}
			},
			async poolInit(twoID) {
				try{
					const paramsEnd = [{
						flag: "POOLNFT_INIT",
						nft_contract_address: twoID,
						address: this.myAddress,
						tbc_amount: JSON.parse(this.fromCoinNum),
						ft_amount: JSON.parse(this.toCoinNum),
						poolNFT_version: 2
					}];
					const {txid,rawtx} = await window.Turing.sendTransaction(paramsEnd)
					console.log(txid)
					if(txid) {
						this.unloadCoinID(twoID)
						this.$refs.loading.close();
					}
				} catch(error){
					console.log(error)
					this.$refs.loading.close();
					if(error.code == 4001) {
						swal({
							title: error.message,
							icon: "error",
						})
					} else{
						swal({
							title: JSON.stringify(error),
							icon: "error",
						})
					}
				}
			},
			inputNum(e) {
				this.slipData.forEach((item, index) => {
					if (parseFloat(item) == parseFloat(e.detail.value)) {
						this.slipCrrent = index;
					} else {
						this.slipCrrent = 3;
					}
				})
				if (parseFloat(e.detail.value) > 3) {
					this.selfSlip = 0;
					uni.showToast({
						title: this.$t('new11'),
						icon: "none"
					})
				}
			},
			unloadCoinID(txid) {
				let lpNowWay = this.slipCrrent == 3?this.selfSlip:this.slipData[this.slipCrrent];
				uni.request({
					url: this.localApi+'newPool',
					method: 'POST',
					header: {
						"Content-Type": "application/json; charset=UTF-8"
					},
					data: {
						coinContract1: this.toCur.address,
						poolContract: txid,
						coinName1: this.toCur.name,
						userAddress: this.myAddress,
						coinDecimal: this.toCur.decimals,
						coinFee: JSON.parse(lpNowWay*100)
					},
					success: (res) => {
						if(res.data.success) {
							uni.setStorageSync('poolID',txid);
							uni.setStorageSync('poolTokenName',this.toCur.name);
							this.$refs.popup2.close();
							swal({
								title: this.$t('pool22'),
								icon: "success",
							})
						}
					}
				});
			},
			backInfo(e) {
				if (this.goType == 'from') {
					this.fromCur = e;
					this.getCoinBalance(e,'from')
				} else {
					this.toCur = e;
					this.getCoinBalance(e,'to')
					this.getCoinInfoData(e);
				}
				this.$refs.popup.close();
				if (this.fromCur.name && this.toCur.name) {
					this.poolType = 2;
				}
			},
			getCoinInfoData(val) {
				this.$refs.loading.open();
				uni.request({
					url: this.localApi+'getCoinInfo',
					method: 'POST',
					header: {
						"Content-Type": "application/json; charset=UTF-8"
					},
					data: {
						coinContract: val.address
					},
					success: (res) => {
						this.$refs.loading.close();
						if(res.data.success) {
							this.nowPoolCoin = res.data.data.poolContract;
							if(this.nowPoolCoin) {
								this.statusCanPool = true;
							} else{
								this.statusCanPool = false;
							}
						} else{
							this.statusCanPool = false;
						}
					}
				});
			},
			showPupCoin(type) {
				this.goType = type;
				this.$refs.popup.open();

			},
			getCoinBalance(coinInfo, type) {
				if (coinInfo.name == 'TBC') {
					var nowTbc = 0;
					uni.request({
						url: this.urlApi + 'address/'+this.myAddress+'/get/balance',
						method: 'GET',
						header: {
							"Content-Type": "application/json; charset=UTF-8"
						},
						data: {
						},
						success: (res) => {
							if(res.statusCode == 200) {
								if(type == 'from') {
									this.fromCur.balance = res.data.data.balance/1000000;
								} else{
									this.toCur.balance = res.data.data.balance/1000000;
								}
							}
						}
					});
				} else{
					uni.request({
						url: this.urlApi + 'ft/balance/address/'+this.myAddress+/contract/+coinInfo.address,
						method: 'GET',
						header: {
							"Content-Type": "application/json; charset=UTF-8"
						},
						data: {
						},
						success: (res) => {
							if(res.statusCode == 200) {
								if(type == 'from') {
									this.fromCur.balance = res.data.ftBalance/1000000;
								} else{
									this.toCur.balance = res.data.ftBalance/1000000;
									this.toCur.decimals = res.data.ftDecimal;
								}
							}
						}
					});
				}
			},
			loadClick() {
				let _this = this;
				_this.$refs.loading.open();
				setTimeout(() => {
					_this.$refs.loading.close();
				}, 1000);
			},
			backGo() {
				uni.navigateTo({
				   url: './pool'
				})
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
				height: auto;
				// min-height: 100vh;
				box-sizing: border-box;
				position: relative;
				padding-bottom: 50upx;
				padding-top: 120upx;
				background-color: #F5F9FF;
				.backTitle {
					margin: 38rpx 44rpx;
			
					image {
						width: 60rpx;
						height: 54rpx;
					}
				}
			
				.centerBox {
					width: 70%;
					margin: 40rpx auto;
					box-sizing: border-box;
					// margin: 40rpx 30rpx 0 30rpx;
					background-color: #fff;
					border-radius: 20rpx;
					.poolTitle {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 30upx;
						padding: 0 28rpx;
						height: 112rpx;
						background: linear-gradient( 90deg, #AF6EFF 0%, #8D60FF 100%);
						border-radius: 30rpx 30rpx 0 0;
						.back {
							image {
								width: 56upx;
								height: 56upx;
							}
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
					.bodyList{
						padding: 0 28rpx;
					}
					.lpBox {
						margin-top: 20rpx;
						padding-bottom: 40rpx;
			
						.coinBox {
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
								padding-right: 45rpx;
			
								input {
									width: 100%;
									height: 100%;
									text-align: right;
									font-size: 42rpx;
									color: #6929C4;
								}
							}
						}
			
						.SlippageBox {
							margin-top: 40rpx;
									
							.boxTitle {
								font-family: Noto Sans SC, Noto Sans SC;
								font-weight: bold;
								font-size: 28rpx;
								color: #161616;
							}
									
							.slipBox {
								display: flex;
								align-items: center;
								margin-top: 30rpx;
									
								.list {
									width: 140rpx;
									height: 60rpx;
									line-height: 60rpx;
									text-align: center;
									border-radius: 40rpx;
									font-size: 36rpx;
									font-weight: bold;
									margin-right: 40rpx;
								}
									
								.listActive {
									background-color: rgba(51,103,214,0.4);
									color: #3367D6;
								}
									
								.listNoActive {
									background-color: rgba(51,103,214,0.4);
									color: rgba(51, 103, 214, .3);
								}
									
								.list2 {
									width: 140rpx;
									height: 60rpx;
									line-height: 60rpx;
									text-align: center;
									border-radius: 40rpx;
									font-size: 36rpx;
									font-weight: bold;
									display: flex;
									align-items: center;
									
									input {
										width: 100%;
										height: 100%;
										color: #3367D6;
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
					color: #525252;
					text-align: center;
					font-size: 24upx;
					margin-top: 20upx;
				}
			
				.text {
					color: #6929C4;
					text-align: center;
					font-size: 34upx;
					margin-top: 40upx;
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
				background-color: #F5F9FF;
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
					background-color: #fff;
					border-radius: 20rpx;
					.poolTitle {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 30upx;
						padding: 0 28rpx;
						height: 112rpx;
						background: linear-gradient( 90deg, #AF6EFF 0%, #8D60FF 100%);
						border-radius: 30rpx 30rpx 0 0;
						.back {
							image {
								width: 56upx;
								height: 56upx;
							}
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
					.bodyList{
						padding: 0 28rpx;
					}
					.lpBox {
						margin-top: 20rpx;
						padding-bottom: 40rpx;
			
						.coinBox {
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
								padding-right: 45rpx;
			
								input {
									width: 100%;
									height: 100%;
									text-align: right;
									font-size: 42rpx;
									color: #6929C4;
								}
							}
						}
			
						.SlippageBox {
							margin-top: 40rpx;
									
							.boxTitle {
								font-family: Noto Sans SC, Noto Sans SC;
								font-weight: bold;
								font-size: 28rpx;
								color: #161616;
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
									background-color: rgba(51,103,214,0.4);
									color: #3367D6;
								}
									
								.listNoActive {
									background-color: rgba(51,103,214,0.4);
									color: rgba(51, 103, 214, .3);
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
										color: #3367D6;
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
					color: #525252;
					text-align: center;
					font-size: 24upx;
					margin-top: 20upx;
				}
			
				.text {
					color: #6929C4;
					text-align: center;
					font-size: 34upx;
					margin-top: 40upx;
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
			}
	}
	
</style>