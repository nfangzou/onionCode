<template>
	<view class="content">
		<back ref="child" text="" :text="myAddress" :type="1" @connectWallet="connectWallet" :classType="true"
			subheading="true" @getMsg="getMsg">
		</back>
		<!-- <view class="tip">
			<view class="text">
				Tip: When you add liquidity,you will receive pool tokens representing your position.These tokens automatically earn fees proportional to you share of the pool,and can be redeemed at any time.
			</view>
		</view> -->
		<view class="centerBox">
			<view class="poolTitle">
				<view class="back" @tap="backGo">
					<image src="../../static/Arrowleft.png" mode=""></image>
				</view>
				<view class="title">
					{{$t('new1')}}
				</view>
				<view class="rightN">
					<image @tap="loadClick" src="../../static/load.png" mode=""></image>
				</view>
			</view>
			<view class="bodyList">
				<view class="tipMsg" v-if="poolType==3">
					<view class="text">
						{{$t('pool13')}}: {{$t('pool14')}}
					</view>
				</view>
				<view class="lpBox">
					<view class="coinBox">
						<view class="coinNameBox">
							<view class="coinSmall">
								<image class="slectIcon" src="../../static/TBC.png" mode=""></image>
								<text>{{fromCur.name?fromCur.name:this.$t('index3')}}</text>
								<image class="slectIcon" src="../../static/bottomIcon.png" mode=""></image>
							</view>
						</view>
						<view class="coinMax" @tap="fromCoinNum = fromCur.balance">
							MAX
						</view>
					</view>
					<view class="inputToBox">
						<view class="blanceTitle">
							{{$t('index7')}}：{{fromCur.balance}}
						</view>
						<view class="inputBody">
							<input v-model="fromCoinNum" @input="showChange" type="text" />
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
								<image class="slectIcon2" :src="toCur.name == 'SATOSHI'?'https://dapp.onionswap.info/SATOSHI.png':toCur.logoURI" mode=""></image>
								<text>{{toCur.name?toCur.name:this.$t('index6')}}</text>
								<image class="slectIcon" src="../../static/bottomIcon.png" mode=""></image>
							</view>
						</view>
					</view>
					<view class="inputToBox">
						<view class="blanceTitle">
							{{$t('index7')}}：{{toCur.balance}}
						</view>
						<view class="inputBody">
							<input v-model="toCoinNum" type="text" />
						</view>
					</view>
					<view class="sharePool" v-if="poolType==3">
						<view class="title">
							{{$t('new5')}}
						</view>
						<view class="shareList">
							<view class="item">
								<view class="num">
									{{TBCPrice}}
								</view>
								<view class="text">
									{{fromCur.name}} per {{toCur.name}}
								</view>
							</view>
							<view class="item">
								<view class="num">
									{{FTPrice}}
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
					<view class="shareBtn" v-if="poolType==3">
						<view class="text" @tap="clickShowSupply" v-if="!SwapBtnStatus">
							{{$t('pool16')}}
						</view>
						<view class="btnNo" v-else>
							{{$t('new4')}}
						</view>
					</view>
					<view class="btnGo2" v-if="poolType==3 && stausMergeAdd" style="justify-content: space-between;">
						<view class="btn" style="width: 48%;" @tap="ftMerge()">
							FTLP_MERGE
						</view>
						<view class="btn" style="width: 48%;" @tap="poolMerge()">
							POOLNFT_MERGE
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
						{{$t('new2')}}
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
						<text class="oneLeft">{{$t('pool19')}}</text>
						<view class="oneRight">
							<view>1 {{fromCur.name}} = {{TBCPrice}} {{toCur.name}}</view>
							<view>1 {{toCur.name}} = {{FTPrice}} {{fromCur.name}}</view>
						</view>
					</view>
					<view class="listOne">
						<text class="oneLeft">{{$t('pool15')}}</text>
						<text class="oneRight">100%</text>
					</view>
					<view class="btnBootom">
						<view class="btn" @tap="clickSupply">
							{{$t('new3')}}
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
			if(option.poolContract != undefined) {
				this.getPoolInCoin(option.poolContract);
			}
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
			async getPoolInCoin(id) {
				const poolUse = new poolNFT({txidOrParams: id, network:this.network});
				 await poolUse.initfromContractId();
				this.getUrlCoinList(poolUse.ft_a_contractTxid);
			},
			getUrlCoinList(coinAddress) {
				let tokenUrlList = [];
				uni.request({
					url: this.urlApi + 'ft/info/contract/id/'+coinAddress,
					method: 'GET',
					header: {
						"Content-Type": "application/json; charset=UTF-8"
					},
					data: {
					},
					success: (res) => {
						tokenUrlList.push({
							name: res.data.ftName,
							symbol: res.data.ftSymbol,
							address: res.data.ftContractId,
							chainId: 0,
							decimals: res.data.ftDecimal,
							balance: 0,
							logoURI: res.data.ftIconUrl == ''?'https://dapp.onionswap.info/logo.png':res.data.ftIconUrl,
						})
						this.SelectCoinInfoData = res.data;
						this.toCur = tokenUrlList[0];
						this.poolType = 3;
						this.getCoinInfoData(this.toCur);
						this.getCoinBalance(this.toCur)
					}
				});
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
				if(this.nowPoolAddress.length == 0) {
					swal({
						title: 'error',
						text: this.$t('pool21'),
						icon: "error"
					})
					return ;
				}
				this.$refs.popup2.open();
			},
			async clickSupply() {
				this.$refs.loading.open();
				try {
					if(this.selectCoinPool.ft_lp_balance == 0) {
						const paramsEnd = [{
							flag: "POOLNFT_INIT",
							nft_contract_address: this.nowPoolAddress.poolContract,
							address: this.myAddress,
							tbc_amount: JSON.parse(this.fromCoinNum),
							ft_amount: JSON.parse(this.toCoinNum),
							poolNFT_version: this.selectCoinPool.pool_version
						}];
						const {txid,rawtx} = await window.Turing.sendTransaction(paramsEnd)
						console.log(txid)
						if(txid) {
							this.unloadCoinID()
						}
					} else{
						const params = [{
							flag: "POOLNFT_LP_INCREASE",
							nft_contract_address: this.nowPoolAddress.poolContract,
							address: this.myAddress,
							tbc_amount: JSON.parse(this.fromCoinNum),
							poolNFT_version: this.selectCoinPool.pool_version
						}];
						const { txid, rawtx } = await window.Turing.sendTransaction(params);
						console.log(txid)
						if(txid) {
							this.unloadCoinID();
						}
					}
				} catch (error) {
					this.$refs.loading.close();
					this.stausMergeAdd = true;
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
			async ftMerge() {
				this.$refs.loading.open();
				try {
					const params = [{
						flag: "FTLP_MERGE",
						nft_contract_address: this.nowPoolAddress.poolContract,
						poolNFT_version: this.selectCoinPool.pool_version
					}];
					console.log(params)
					const { txid, rawtx } = await window.Turing.sendTransaction(params);
					if(txid) {
						this.$refs.loading.close();
						swal({
							title: 'MERGE成功',
							icon: "success",
						})
					}
					console.log(txid)
				} catch (error) {
					console.log(error)
					this.$refs.loading.close();
					swal({
						title: JSON.stringify(error),
						icon: "error",
					})
				}
			},
			async poolMerge() {
				this.$refs.loading.open();
				try {
					const params = [{
						flag: "POOLNFT_MERGE",
						nft_contract_address: this.nowPoolAddress.poolContract,
						merge_times: 5,
						poolNFT_version: this.selectCoinPool.pool_version
					}];
					const { txid, rawtx } = await window.Turing.sendTransaction(params);
					if(txid) {
						this.$refs.loading.close();
						swal({
							title: 'MERGE'+this.$t('Success'),
							icon: "success",
						})
					}
					console.log(txid)
				} catch (error) {
					console.log(error)
					this.$refs.loading.close();
					swal({
						title: JSON.stringify(error),
						icon: "error",
					})
				}
			},
			unloadCoinID() {
				try {
					uni.request({
						url: (this.selectCoinPool.pool_version == 2?this.localApi:this.localApiV1) + 'newPool',
						method: 'POST',
						header: {
							"Content-Type": "application/json; charset=UTF-8"
						},
						data: {
							coinContract1: this.toCur.address,
							poolContract: this.nowPoolAddress.poolContract,
							coinName1: this.toCur.name,
							userAddress: this.myAddress,
							coinDecimal: this.toCur.decimals,
							coinFee: 25
						},
						success: (res) => {
							if(res.data.success) {
								this.$refs.popup2.close();
								this.$refs.loading.close();
								swal({
									title: this.$t('pool22'),
									icon: "success",
								})
							}
						}
					});
				} catch(err){
					this.$refs.loading.close();
					swal({
						title: err,
						icon: "error"
					})
					console.log(err)
				}
				
			},
			backInfo(e) {
				this.fromCoinNum = '';
				this.toCoinNum = '';
				if (this.goType == 'from') {
					this.fromCur = e;
					this.getCoinBalance(e,'from')
				} else {
					this.toCur = e;
					this.getCoinBalance(e,'to')
					this.getCoinInfoData(e);
					this.getUrlCoinList(e.address);
				}
				this.$refs.popup.close();
				if (this.fromCur.name && this.toCur.name) {
					this.poolType = 3;
				}
			},
			getCoinInfoData(val) {
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
						if(res.data.success) {
							this.nowPoolAddress = res.data.data;
							this.getNowCoinPool(res.data.data.poolContract);
						} else{
							swal({
								title: res.data.msg,
								icon: "error",
							})
						}
					}
				});
			},
			getNowCoinPool(ID) {
				uni.request({
					url: this.urlApi + 'ft/pool/nft/info/contract/id/'+ID,
					method: 'GET',
					header: {
						"Content-Type": "application/json; charset=UTF-8"
					},
					data: {
					},
					success: (res) => {
						if(res.statusCode == 200) {
							this.selectCoinPool = res.data;
							this.poolTbcNum = this.selectCoinPool.tbc_balance/Math.pow(10,6);
							this.poolFbNum = this.selectCoinPool.ft_a_balance/Math.pow(10,this.SelectCoinInfoData.ftDecimal);
							this.FTPrice = Math.floor(((1/this.poolFbNum)*this.poolTbcNum)*10000)/10000;
							this.TBCPrice = Math.floor(((1/this.poolTbcNum)*this.poolFbNum)*10000)/10000;
						}
					}
				});
			},
			showChange(e) {
				if(e.detail.value > this.fromCur.balance) {
					this.SwapBtnStatus = true;
				} else{
					this.SwapBtnStatus = false;
				}
				if(e.detail.value == 0) {
					this.toCoinNum = 0;
					return ;
				}
				this.toCoinNum = 0;
				if(this.fromCur.name == 'TBC') {
					let nowPrice = JSON.parse(e.detail.value) * Math.pow(10,6);
					let newNum = (nowPrice / this.selectCoinPool.tbc_balance) * (this.selectCoinPool.ft_a_balance);
					this.toCoinNum = Math.floor((newNum/Math.pow(10,this.SelectCoinInfoData.ftDecimal))*10000)/10000;
				}
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
				uni.navigateBack()
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
				box-shadow: 0px 4rpx 28px rgba(88,86,218,0.16);
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
							background: rgba(102,82,217,0.05);
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
						color: #6652D9;
					}
				}
				.btnBootom{
					display: flex;
					justify-content: center;
					margin-top: 50rpx;
					.btn{
						width: 100%;
						height: 84rpx;
						line-height: 84rpx;
						text-align: center;
						background: linear-gradient( 270deg, #F4CDCD 0%, #E283E7 43%, #6652D9 100%);
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
			background: linear-gradient( 270deg, #F4CDCD 0%, #E283E7 43%, #6652D9 100%);
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
				background: linear-gradient( 90deg, #AF6EFF 0%, #8D60FF 100%);
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
				box-shadow: 0px 4rpx 28px rgba(88,86,218,0.16);
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
							background: rgba(102,82,217,0.05);
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
						color: #6652D9;
					}
				}
				.btnBootom{
					display: flex;
					justify-content: center;
					margin-top: 50rpx;
					.btn{
						width: 100%;
						height: 84rpx;
						line-height: 84rpx;
						text-align: center;
						background: linear-gradient( 270deg, #F4CDCD 0%, #E283E7 43%, #6652D9 100%);
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
			background: linear-gradient( 270deg, #F4CDCD 0%, #E283E7 43%, #6652D9 100%);
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
				background: linear-gradient( 90deg, #AF6EFF 0%, #8D60FF 100%);
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