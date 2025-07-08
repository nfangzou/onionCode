<template>
	<view class="content">
		<back ref="child" text="" :text="myAddress" :type="0" :classType="true" subheading="true" @getMsg="getMsg">
		</back>
		<view class="centerBox">
			<view class="loadIcon">
				<image @tap="loadClick" src="../../static/load.png" mode=""></image>
			</view>
			<view class="lpBox">
				<view class="coinBox">
					<view class="coinNameBox">
						<view class="coinSmall" @tap="showPupCoin('from')">
							<image class="slectIcon2"
								:src="fromCur.logoURI==''?'https://dapp.onionswap.info/logo.png':fromCur.logoURI"
								mode=""></image>
							<text>{{fromCur.name?fromCur.name:$t('index6')}}</text>
							<image class="slectIcon" src="../../static/bottomIcon.png" mode=""></image>
						</view>
					</view>
					<view class="coinMax" @tap="clickFromMax(1)">
						MAX
					</view>
					<view class="coinMax" @tap="clickFromMax(2)">
						50%
					</view>
					<view class="coinMax" @tap="clickFromMax(3)">
						25%
					</view>
				</view>
				<view class="inputToBox">
					<view class="blanceTitle">
						{{$t('index7')}}：<text style="color: #3367D6;">{{fromCur.balance}}</text>
					</view>
					<view class="inputBody">
						<input v-model="fromCoinNum" :style="{'height':!focusFromStaus?'100%':''}" @input="showChange"
							type="text" />
						<view v-if="focusFromStaus" class="smallNumU">~{{Math.floor(usdtPrice*100)/100}} USD</view>
					</view>
				</view>
				<view class="centerIcon">
					<view class="changebox" @tap="changeIcon()">
						<image src="../../static/icon2.png" mode=""></image>
					</view>
				</view>
				<view class="coinBox">
					<view class="coinNameBox">
						<view class="coinSmall" @tap="showPupCoin('to')">
							<image class="slectIcon2"
								:src="toCur.logoURI==''?'https://dapp.onionswap.info/logo.png':toCur.logoURI" mode="">
							</image>
							<text>{{toCur.name?toCur.name:$t('index6')}}</text>
							<image class="slectIcon" src="../../static/bottomIcon.png" mode=""></image>
						</view>
					</view>
					<view class="coinMax" @tap="clickToMax(1)">
						MAX
					</view>
					<view class="coinMax" @tap="clickToMax(2)">
						50%
					</view>
					<view class="coinMax" @tap="clickToMax(3)">
						25%
					</view>
				</view>
				<view class="inputToBox">
					<view class="blanceTitle">
						{{$t('index7')}}：<text style="color: #3367D6;">{{toCur.balance}}</text>
					</view>
					<view class="inputBody">
						<input v-model="toCoinNum" :style="{'height':!focusToStaus?'100%':''}" @input="showToChange"
							type="text" />
						<view v-if="focusToStaus" class="smallNumU">~{{Math.floor(usdtPrice*100)/100}} USD</view>
					</view>
				</view>
				<view class="tipsText" v-if="toCur.name != ''">
					1 {{fromCur.name}}{{fromCur.name == 'TBC'?' ≈ '+(showUsdtPrice)+' USD':''}} = {{fromCur.name == 'TBC'?FTPrice:TBCPrice}} {{toCur.name}} {{toCur.name == 'TBC'?'≈ '+(Math.floor(showUsdtPrice*TBCPrice*1000000)/1000000)+' USD':''}}
				</view>
				<view class="newToBox">
					<!-- <view class="textToTitle" v-if="!personToEent" @tap="personToEent = true">
						+ {{$t('swap1')}}111
					</view> -->
					<!-- <view class="toRessBox">
						<view class="ressTitle">
							<view class="titleOne">
								{{$t('swap2')}}
							</view>
							<view class="titleCenter"></view>
							<view class="titleRight"  @tap="closeToPerson">
								{{$t('swap3')}}
							</view>
						</view>
						<view class="inputToAddress">
							<input v-model="toInputAddress" :placeholder="$t('swap4')" type="text" />
						</view>
					</view> -->
				</view>
				<view class="SlippageBox">
					<view class="boxTitle">
						{{$t('index8')}}
					</view>
					<view class="slipBox">
						<view class="list" :class="slipCrrent == index?'listActive':'listNoActive'"
							v-for="(item, index) in slipData" :key="index" @tap="clickSlip(index)">
							{{item}}%
						</view>
						<view class="list2" :class="slipCrrent == 3?'listActive':'listNoActive'">
							<input v-model="selfSlip" @input="inputNum" :placeholder="$t('index9')"
								placeholder-style="color: rgba(51, 103, 214, .3);" type="text" /><text
								style="margin-right: 20rpx;">%</text>
						</view>
					</view>
				</view>
				<view class="routerBox" v-if="toCur.name != ''">
					<view class="lefrRou">
						{{$t('index10')}}
					</view>
					<view class="rightRou">
						<text>{{fromCur.name}}</text>
						<image src="/static/rightIcon.png" mode=""></image>
						<text>{{toCur.name}}</text>
					</view>
				</view>
				<view class="btnGo">
					<view class="btn" @tap="inClick" v-if="!SwapBtnStatus">
						{{$t('index11')}}
					</view>
					<view class="btnNo" v-else>
						{{$t('new4')}}
					</view>
				</view>
				<view class="infoGo" @tap="clickGoInfo">
					{{$t('swap7')}}
				</view>
			</view>
		</view>


		<uni-popup ref="popup2" type="center" :mask-background-color="activeCole" :mask-click="true">
			<view class="maskRe">
				<view class="title">
					<view class="left">
					</view>
					<view class="center">
						{{$t('index12')}}
					</view>
					<view class="right" @tap="closePup2">
						<image src="../../static/close2.png" mode=""></image>
					</view>
				</view>
				<view class="tokenList">
					<view class="listOne">
						<view class="leftOne">
							<view class="oneLeft">{{$t('index13')}}</view>
							<view class="oneRight">{{fromCoinNum}} {{fromCur.name}}</view>
						</view>
						<view class="rightImg">
							<image :src="fromCur.logoURI==''?'https://dapp.onionswap.info/logo.png':fromCur.logoURI"
								mode=""></image>
						</view>
					</view>
					<view class="listOne">
						<view class="leftOne">
							<view class="oneLeft">{{$t("index14")}}</view>
							<view class="oneRight">{{toCoinNum}} {{toCur.name}}</view>
						</view>
						<view class="rightImg">
							<image :src="toCur.logoURI==''?'https://dapp.onionswap.info/logo.png':toCur.logoURI"
								mode=""></image>
						</view>
					</view>
					<view class="listOne2" v-if="toInputAddress != ''">
						<text class="oneLeft">{{$t('swap2')}}</text>
						<view class="oneRight">
							<view>{{toInputAddress | plusXing}}</view>
						</view>
					</view>
					<view class="listOne2">
						<text class="oneLeft">{{$t('index15')}}</text>
						<view class="oneRight">
							<view>{{$t('index16')}} {{slipCrrent == 3?selfSlip:slipData[slipCrrent]}}</view>
						</view>
					</view>
					<view class="btnBootom">
						<view class="btn" @tap="clickChange">
							{{$t('index17')}}
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
	import selectCoin from "@/component/selectCoin/index.vue";
	import swal from 'sweetalert';
	// import { useTuringsWallet } from "turing-wallet-provider";
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
				slipData: ['0.1', '0.5', '1.0'],
				slipCrrent: 0,
				selfSlip: '',
				toCoinNum: '',
				fromCoinNum: '',

				fromCur: {
					name: 'TBC',
					symbol: 'test_coin',
					address: '',
					chainId: 56,
					decimals: 6,
					balance: '',
					logoURI: 'https://dapp.onionswap.info/TBC.png',
				},
				toInput: '',
				toCur: {
					balance: '',
					name: 'SATOSHI',
					symbol: 'SATOSHI',
					address: 'a2d772d61afeac6b719a74d87872b9bbe847aa21b41a9473db066eabcddd86f3',
					chainId: '',
					decimals: 6,
					logoURI: 'https://dapp.onionswap.info/SATOSHI.png',
				},
				activeCole: 'rgba(0,0,0,0.5)',
				tbcBalance: 0,
				goType: 'from',
				nowPoolAddress: [],
				FTPrice: 0,
				TBCPrice: 0,
				poolFbNum: 0,
				poolTbcNum: 0,
				SelectCoinInfoData: [],
				balanceTimer: null,
				SwapBtnStatus: false,
				toInputAddress: '',
				personToEent: false,
				focusFromStaus: false,
				focusToStaus: false,
				usdtPrice: 0,
				showUsdtPrice: 0,
				recAddress: '',
				recSellAddress: '',
				nowToAddress: '',
				walletName: ''
			}
		},
		computed: {
			...mapGetters(['getWallet', 'getCoin', 'setWallet'])
		},
		filters: {
			plusXing(str) {
				if (str.length == 0) {
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
		watch: {
			getWallet(val, oldVal) {
				this.myAddress = uni.getStorageSync('walletAddress');
			}
		},
		onLoad() {
			console.log("version: 1.1.2")
			this.loadConnect();
		},
		onShow() {
			this.Init();
		},
		onHide() {
			this.clearTimer();
		},
		methods: {
			Init() {
				if (uni.getStorageSync('walletAddress') == undefined || uni.getStorageSync('walletAddress') == '') {
					console.log("Please connect wallet!")
				} else {
					this.myAddress = uni.getStorageSync('walletAddress');
					this.clearTimer();
					this.getCoinInfoData(this.toCur);
					this.getSelectCoinInfo(this.toCur.address);
					this.getCoinBalance(this.fromCur, 'from');
					this.getCoinBalance(this.toCur, 'to');
					this.getWalletInfo();
					this.getShowUSDTPrice();
					this.balanceTimer = setInterval(() => {
						this.getCoinInfoData(this.toCur);
						this.getCoinBalance(this.fromCur, 'from')
						this.getCoinBalance(this.toCur, 'to')
					}, 3000)
				}
			},
			async loadConnect() {
				if (window.Turing) {
					await window.Turing.connect();
					let wert = await window.Turing.getAddress();
					this.myAddress = wert.tbcAddress;
					if(wert.tbcAddress.toLowerCase() != uni.getStorageSync('walletAddress').toLowerCase()) {
						this.$store.commit('setWallet', wert.tbcAddress);
						uni.setStorageSync('walletAddress', wert.tbcAddress);
					}
					this.Init();
				}
			},
			async getWalletInfo() {
				// window.NaboxWallet
				// window.Turing
				let walletInfo = await window.Turing;
				this.walletName = walletInfo.isNabox?'Nabox':'Turing';
				console.log(this.walletName)
			},
			getMsg() {
				this.Init();
			},
			clickGoInfo() {
				uni.navigateTo({
					url: '/pages/index/tranferInfo'
				})
			},
			clearTimer() {
				// clearTime
				if (this.balanceTimer) {
					clearInterval(this.balanceTimer);
					this.balanceTimer = null;
				}
			},
			clickSlip(val) {
				this.slipCrrent = val;
			},
			clickFromMax(type) {
				if (type == 1) {
					this.fromCoinNum = this.fromCur.balance;
				} else if(type == 2) {
					this.fromCoinNum = this.fromCur.balance / 2;
				} else{
					this.fromCoinNum = this.fromCur.balance / 4;
				}
				this.showClickChange(1, this.fromCoinNum);
			},
			clickToMax(type) {
				if (type == 1) {
					this.toCoinNum = this.toCur.balance
				} else if(type == 2) {
					this.toCoinNum = this.toCur.balance / 2;
				} else{
					this.toCoinNum = this.toCur.balance / 4;
				}
				this.showClickChange(2, this.toCoinNum);
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
				this.fromCoinNum = '';
				this.toCoinNum = '';
				this.focusFromStaus = false;
				this.focusToStaus = false;
				if (this.goType == 'from') {
					this.getCoinBalance(this.fromCur, 'from')
					if (this.fromCur.name != 'TBC') {
						this.getSelectCoinInfo(this.fromCur.address);
						this.getCoinInfoData(this.fromCur);
					}
				} else {
					this.getCoinBalance(this.toCur, 'to');
					if (this.toCur.name != 'TBC') {
						this.getSelectCoinInfo(this.toCur.address);
						this.getCoinInfoData(this.toCur);
					}
				}
			},
			closePup(e) {
				this.$refs.popup.close();
			},
			closeToPerson() {
				this.personToEent = false;
				this.toInputAddress = '';
			},
			backInfo(e) {
				this.fromCoinNum = '';
				this.toCoinNum = '';
				if (this.goType == 'from') {
					if (e.name == this.toCur.name) {
						this.changeIcon();
					} else {
						if(this.toCur.name != 'TBC' && e.name != 'TBC') {
							this.changeIcon();
						}
						this.fromCur = e;
						this.getCoinBalance(e, 'from')
						if (e.name != 'TBC') {
							this.getSelectCoinInfo(e.address);
							this.getCoinInfoData(e);
						}
					}
				} else {
					if (e.name == this.fromCur.name) {
						this.changeIcon();
					} else {
						if(this.fromCur.name != 'TBC' && e.name != 'TBC') {
							this.changeIcon();
						}
						this.toCur = e;
						this.getCoinBalance(e, 'to');
						if (e.name != 'TBC') {
							this.getSelectCoinInfo(e.address);
							this.getCoinInfoData(e);
						}
					}
				}
				this.$refs.popup.close();
			},
			getCoinInfoData(val) {
				if (val.name != 'TBC') {
					uni.request({
						url: this.localApiV4 + 'getCoinInfo',
						method: 'POST',
						header: {
							"Content-Type": "application/json; charset=UTF-8"
						},
						data: {
							coinContract: val.address
						},
						success: (res) => {
							if (res.data.success) {
								this.nowPoolAddress = res.data.data;
								this.recAddress = res.data.tbcAddress;
								this.recSellAddress = res.data.coinAddress;
								this.getNowCoinPool(res.data.data.poolContract);
							} else {
								swal({
									title: res.data.msg,
									icon: "error",
								})
							}
						}
					});
				}
			},
			getNowCoinPool(ID) {
				uni.request({
					url: this.urlApi + 'ft/pool/nft/info/contract/id/' + ID,
					method: 'GET',
					header: {
						"Content-Type": "application/json; charset=UTF-8"
					},
					data: {},
					success: (res) => {
						if (res.statusCode == 200) {
							this.selectCoinPool = res.data;
							this.poolTbcNum = this.selectCoinPool.tbc_balance / Math.pow(10, 6);
							this.poolFbNum = this.selectCoinPool.ft_a_balance / Math.pow(10, this.SelectCoinInfoData.ftDecimal);
							this.FTPrice = Math.floor((this.poolFbNum / (this.poolTbcNum + 1)) * 10000) / 10000;
							this.TBCPrice = Math.floor((this.poolTbcNum / (this.poolFbNum + 1)) * 1000000) / 1000000;
						}
					}
				});
			},
			getSelectCoinInfo(address) {
				uni.request({
					url: this.urlApi + 'ft/info/contract/id/' + address,
					method: 'GET',
					header: {
						"Content-Type": "application/json; charset=UTF-8"
					},
					data: {},
					success: (res) => {
						this.SelectCoinInfoData = res.data;
					}
				});
			},
			showPupCoin(type) {
				this.goType = type;
				this.$refs.popup.open();
			},
			getCoinBalance(coinInfo, type) {
				if (coinInfo.name == 'TBC') {
					uni.request({
						url: this.urlApi + 'address/' + this.myAddress + '/get/balance',
						method: 'GET',
						header: {
							"Content-Type": "application/json; charset=UTF-8"
						},
						data: {},
						success: (res) => {
							if (res.statusCode == 200) {
								if (type == 'from') {
									this.fromCur.balance = Math.floor(bignumberJS(res.data.data.balance)
										.shiftedBy(-6) * 100) / 100;
								} else {
									this.toCur.balance = Math.floor(bignumberJS(res.data.data.balance)
										.shiftedBy(-6) * 100) / 100;
								}
							}
						}
					});
				} else {
					uni.request({
						url: this.urlApi + 'ft/balance/address/' + this.myAddress + /contract/ + coinInfo.address,
						method: 'GET',
						header: {
							"Content-Type": "application/json; charset=UTF-8"
						},
						data: {},
						success: (res) => {
							if (res.statusCode == 200) {
								if (type == 'from') {
									this.fromCur.balance = res.data.ftBalance / 1000000;
								} else {
									this.toCur.balance = res.data.ftBalance / 1000000;
								}
							}
						}
					});
				}
			},
			loadClick() {
				this.Init();
				let _this = this;
				_this.$refs.loading.open();
				setTimeout(() => {
					_this.$refs.loading.close();
				}, 1000);
			},
			swapEndClick(txID, nowAddress) {
				uni.request({
					url: (this.selectCoinPool.pool_version == 2 ? this.localApiV4 : this.localApiV1) + 'swapOne',
					method: 'POST',
					header: {
						"Content-Type": "application/json; charset=UTF-8"
					},
					data: {
						coinContract: this.fromCur.name == 'TBC' ? this.toCur.address : this.fromCur.address,
						doType: this.fromCur.name == 'TBC' ? 0 : 1,
						hash: txID,
						toAddress: nowAddress,
						canRec: this.slipCrrent == 3 ? this.selfSlip : this.slipData[this.slipCrrent],
						address: this.myAddress
					},
					success: (res) => {
						this.$refs.loading.close();
						if (res.data.success) {
							swal({
								title: this.$t('index18'),
								text: this.fromCoinNum + ' ' + this.fromCur.name + ' ' + this.$t(
									'index11') + ' ' + this.toCoinNum + ' ' + this.toCur.name+' '+this.$t('newTips1')+'...',
								icon: "success"
							})
							this.$refs.popup2.close();
							this.fromCoinNum = '';
							this.toCoinNum = '';
							this.focusFromStaus = false;
							this.focusToStaus = false;
						} else {
							swal({
									title: this.$t('tran1'),
									text: this.$t('tran2'),
									icon: "error",
									buttons: [true, this.$t('copyHash')]
								})
								.then((willDelete) => {
									if (willDelete) {
										uni.setClipboardData({
											data: txID,
											success: function () {
												swal("Success", {
													icon: "success",
												});
											}
										});
									}
								});
						}

					}
				});
			},
			async ftMerge() {
				this.$refs.loading.open();
				try {
					const params = [{
						flag: "POOLNFT_MERGE",
						nft_contract_address: this.fromCur.address,
						merge_times: 1,
						poolNFT_version: 2
					}];
					const {
						txid,
						rawtx
					} = await window.Turing.sendTransaction(params);
					if (txid) {
						this.$refs.loading.close();
						swal({
							title: 'MERGE ' + this.$t('Success'),
							icon: "success",
						})
					}
					console.log(txid)
				} catch (error) {
					this.$refs.loading.close();
					console.log(error)
				}
			},
			async clickChange() {
				this.$refs.loading.open();
				if (this.fromCur.name == 'TBC') {
					try {
						// const paramsEnd = [{
						// 	flag: "POOLNFT_SWAP_TO_TOKEN",
						// 	nft_contract_address: this.nowPoolAddress.poolContract,
						// 	address: this.toInputAddress == ''?this.myAddress:this.toInputAddress,
						// 	tbc_amount: JSON.parse(this.fromCoinNum),
						// 	poolNFT_version: 2
						// }];
						// console.log(paramsEnd)
						// const {txid,rawtx} = await window.Turing.sendTransaction(paramsEnd);
						// if(txid) {
						// }
						if (this.selectCoinPool.pool_version == 1) {
							if (JSON.parse(this.fromCoinNum) < 0.11) {
								this.$refs.loading.close();
								swal({
									title: this.$t('new7'),
									icon: "error",
								})
								return;
							}
						}
						this.nowToAddress = this.recAddress;
						const paramsEnd = [{
							flag: "P2PKH",
							satoshis: JSON.parse(this.fromCoinNum) * 1000000,
							address: this.nowToAddress
						}];
						const {
							txid,
							rawtx
						} = await window.Turing.sendTransaction(paramsEnd);
						console.log("txid:"+txid)
						if (txid) {
							this.swapEndClick(txid, this.nowToAddress);
						} else{
							swal({
								title: this.$t('tran1'),
								text: this.$t('tipsIDNull'),
								icon: "error"
							})
							this.$refs.loading.close();
						}
					} catch (err) {
						console.log(err)
						this.$refs.popup2.close();
						this.$refs.loading.close();
						if (err.code == 4001) {
							swal({
								title: err.message,
								icon: "error",
							})
						} else {
							swal({
								title: JSON.stringify(err),
								icon: "error",
							})
						}
					}
				} else {
					try {
						// const params = [{
						// 	flag:"POOLNFT_SWAP_TO_TBC",
						// 	nft_contract_address: this.nowPoolAddress.poolContract,
						// 	address: this.toInputAddress == ''?this.myAddress:this.toInputAddress,
						// 	ft_amount: JSON.parse(this.fromCoinNum),
						// 	poolNFT_version: 2
						// }];
						// const {txid,rawtx} = await window.Turing.sendTransaction(params);
						// if(txid) {
						// }
						if (this.selectCoinPool.pool_version == 1) {
							if (JSON.parse(this.toCoinNum) < 0.11) {
								this.$refs.loading.close();
								swal({
									title: this.$t('new7'),
									icon: "error",
								})
								return;
							}
						}
						this.nowToAddress = this.recSellAddress;
						const params = [{
							flag: "FT_TRANSFER",
							ft_contract_address: this.fromCur.address,
							ft_amount: JSON.parse(this.fromCoinNum),
							address: this.nowToAddress
						}];
						const {
							txid,
							rawtx
						} = await window.Turing.sendTransaction(params);
						console.log("txid:"+txid)
						if (txid) {
							this.swapEndClick(txid, this.nowToAddress);
						} else{
							swal({
								title: this.$t('tran1'),
								text: this.$t('tipsIDNull'),
								icon: "error"
							})
						}
					} catch (err) {
						console.log(err);
						this.$refs.loading.close();
						this.$refs.popup2.close();
						if (err.message.includes('Insufficient FT-A amount, please merge FT-A UTXOs')) {
							this.ftMerge();
						} else {
							if (err.code == 4001) {
								swal({
									title: err.message,
									icon: "error",
								})
							} else {
								swal({
									title: JSON.stringify(err),
									icon: "error",
								})
							}
						}
					}
				}
			},
			async inClick() {
				if (this.myAddress == '') {
					swal({
						title: 'error',
						text: this.$t('index19'),
						icon: "error"
					})
					return;
				}
				if (this.toCur.name != 'TBC' && this.toCur.address == '') {
					swal({
						title: 'error',
						text: this.$t('index20'),
						icon: "error"
					})
					return;
				}
				if (this.fromCur.name != 'TBC' && this.toCur.name != 'TBC') {
					swal({
						title: 'error',
						text: this.$t('index21'),
						icon: "error"
					})
					return;
				}
				this.$refs.popup2.open();
			},
			closePup2() {
				this.$refs.popup2.close();
			},
			inputNum(e) {
				this.slipData.forEach((item, index) => {
					if (parseFloat(item) == parseFloat(e.detail.value)) {
						this.slipCrrent = index;
					} else {
						this.slipCrrent = 3;
					}
				})
				if (parseInt(e.detail.value) >= 50) {
					this.selfSlip = 0;
					uni.showToast({
						title: this.$t('index22'),
						icon: "none"
					})
				}
			},
			showClickChange(valType, valNum) {
				if (valType == 1) {
					if (valNum == 0) {
						this.toCoinNum = 0;
						return;
					}
					this.toCoinNum = 0;
					if (this.fromCur.name == 'TBC') {
						let nowPrice = JSON.parse(valNum) * Math.pow(10, 6);
						let newNum = (nowPrice * this.selectCoinPool.ft_a_balance) / (this.selectCoinPool.tbc_balance +
							nowPrice);
						this.toCoinNum = Math.floor((newNum / Math.pow(10, this.SelectCoinInfoData.ftDecimal)) * 10000) /
							10000;
					} else {
						let nowPrice = JSON.parse(valNum) * Math.pow(10, 6);
						let newNum = (nowPrice * this.selectCoinPool.tbc_balance) / (this.selectCoinPool.ft_a_balance +
							nowPrice)
						this.toCoinNum = Math.floor(newNum / Math.pow(10, 6) * 10000) / 10000;
					}
					if (valNum > this.fromCur.balance) {
						this.SwapBtnStatus = true;
					} else {
						this.SwapBtnStatus = false;
					}
				} else {
					if (valNum == 0) {
						this.fromCoinNum = 0;
						return;
					}
					this.fromCoinNum = 0;
					if (this.toCur.name == 'TBC') {
						let nowPrice = JSON.parse(valNum) * Math.pow(10, 6);
						let newNum = (nowPrice * this.selectCoinPool.ft_a_balance) / (this.selectCoinPool.tbc_balance +
							nowPrice);
						this.fromCoinNum = Math.floor((newNum / Math.pow(10, 6)) * 10000) / 10000;
					} else {
						let nowPrice = JSON.parse(valNum) * Math.pow(10, this.SelectCoinInfoData.ftDecimal);
						let newNum = (nowPrice * this.selectCoinPool.tbc_balance) / (this.selectCoinPool.ft_a_balance +
							nowPrice)
						this.fromCoinNum = Math.floor(newNum / Math.pow(10, 6) * 10000) / 10000;
					}
					if (this.fromCoinNum > this.fromCur.balance) {
						this.SwapBtnStatus = true;
					} else {
						this.SwapBtnStatus = false;
					}
				}

			},
			showChange(e) {
				const pointIndex = e.detail.value.indexOf("."); // 小数点所在位置的索引
				const valueAfterPoint = e.detail.value.substring(pointIndex + 1);
				if(valueAfterPoint == '' || valueAfterPoint == null) {
					this.toCoinNum = 0;
					this.SwapBtnStatus = false;
					this.focusFromStaus = false;
					return;
				}
				if (e.detail.value == 0) {
					this.toCoinNum = 0;
					this.SwapBtnStatus = false;
					this.focusFromStaus = false;
					return;
				}
				let feeV = this.selectCoinPool.pool_version == 2 ? (10000 - this.nowPoolAddress.coinFee) / 10000 : 0.997;
				this.toCoinNum = 0;
				if (this.fromCur.name == 'TBC') {
					if (e.detail.value == 0) {
						this.focusFromStaus = false;
					} else {
						this.focusFromStaus = true;
						this.getUSDTPrice(JSON.parse(e.detail.value));
					}
					let nowPrice = JSON.parse(e.detail.value) * feeV * Math.pow(10, 6);
					let newNum = (nowPrice * this.selectCoinPool.ft_a_balance) / (this.selectCoinPool.tbc_balance +
						nowPrice);
					this.toCoinNum = Math.floor((newNum / Math.pow(10, this.SelectCoinInfoData.ftDecimal)) * 10000) /
					10000;
				} else {
					let nowPrice = JSON.parse(e.detail.value) * feeV * Math.pow(10, 6);
					let newNum = (nowPrice * this.selectCoinPool.tbc_balance) / (this.selectCoinPool.ft_a_balance +
						nowPrice)
					this.toCoinNum = Math.floor(newNum / Math.pow(10, 6) * 10000) / 10000;
					if (e.detail.value == 0) {
						this.focusToStaus = false;
					} else {
						this.focusToStaus = true;
						this.getUSDTPrice(JSON.parse(this.toCoinNum));
					}
				}
				if (e.detail.value > this.fromCur.balance) {
					this.SwapBtnStatus = true;
				} else {
					this.SwapBtnStatus = false;
				}
			},
			showToChange(e) {
				const pointIndexTo = e.detail.value.indexOf("."); // 小数点所在位置的索引
				const valueAfterPointTo = e.detail.value.substring(pointIndexTo + 1);
				if(valueAfterPointTo == '' || valueAfterPointTo == null) {
					this.fromCoinNum = 0;
					this.SwapBtnStatus = false;
					this.focusToStaus = false;
					return;
				}
				if (e.detail.value == 0) {
					this.fromCoinNum = 0;
					this.SwapBtnStatus = false;
					this.focusToStaus = false;
					return;
				}
				let feeB = this.selectCoinPool.pool_version == 2 ? (10000 - this.nowPoolAddress.coinFee) / 10000 : 0.997;
				this.fromCoinNum = 0;
				if (this.toCur.name == 'TBC') {
					if (e.detail.value == 0) {
						this.focusToStaus = false;
					} else {
						this.focusToStaus = true;
						this.getUSDTPrice(JSON.parse(e.detail.value));
					}
					let nowPrice = JSON.parse(e.detail.value) * feeB * Math.pow(10, 6);
					let newNum = (nowPrice * this.selectCoinPool.ft_a_balance) / (this.selectCoinPool.tbc_balance +
						nowPrice);
					this.fromCoinNum = Math.floor((newNum / Math.pow(10, this.SelectCoinInfoData.ftDecimal)) *
						10000) / 10000;
				} else {
					let nowPrice = JSON.parse(e.detail.value) / feeB * Math.pow(10, this.SelectCoinInfoData.ftDecimal);
					let newNum = (nowPrice * this.selectCoinPool.tbc_balance) / (this.selectCoinPool.ft_a_balance +
						nowPrice)
					this.fromCoinNum = Math.floor(newNum / Math.pow(10, 6) * 10000) / 10000;
					if (e.detail.value == 0) {
						this.focusFromStaus = false;
					} else {
						this.focusFromStaus = true;
						this.getUSDTPrice(JSON.parse(this.fromCoinNum));
					}
				}
				if (this.fromCoinNum > this.fromCur.balance) {
					this.SwapBtnStatus = true;
				} else {
					this.SwapBtnStatus = false;
				}
			},
			getUSDTPrice(val) {
				this.usdtPrice = this.showUsdtPrice?this.showUsdtPrice * val:0;
			},
			getShowUSDTPrice() {
				try {
					uni.request({
						url: this.urlApi + 'exchangerate/',
						method: 'GET',
						header: {
							"Content-Type": "application/json; charset=UTF-8"
						},
						data: {},
						success: (res) => {
							if (res.statusCode == 200) {
								this.showUsdtPrice = res.data.rate;
							}
						}
					});
				} catch (error) {
					console.log(error)
				}
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
	@media all and (min-width: 700px) and (max-width: 2880px) {
		.content {
			width: 100%;
			height: auto;
			// min-height: 100vh;
			box-sizing: border-box;
			position: relative;
			padding-bottom: 50upx;
			padding-top: 120upx;

			.backTitle {
				margin: 38rpx 44rpx;

				image {
					width: 60rpx;
					height: 54rpx;
				}
			}

			.centerBox {
				width: 60%;
				margin: 40rpx auto 0;
				// max-width: 750rpx;
				// margin: 40rpx 30rpx 0 30rpx;
				border-radius: 20rpx;
				padding: 30rpx;
				background-color: #fff;

				.loadIcon {
					display: flex;
					justify-content: right;

					image {
						width: 32rpx;
						height: 32rpx;
					}
				}

				.lpBox {
					margin-top: 20rpx;
					padding-bottom: 40rpx;

					.coinBox {
						display: flex;
						align-items: center;

						.coinNameBox {
							border-radius: 40rpx;
							line-height: 65rpx;
							display: flex;
							justify-content: center;
							margin-right: 25rpx;

							.coinSmall {
								display: flex;
								align-items: center;

								text {
									color: #000;
									font-size: 30rpx;
									margin-right: 23rpx;
									margin-right: 10rpx;
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
							border: 2rpx solid #3367D6;
							color: #3367D6;
							font-size: 24rpx;
							font-weight: bold;
							border-radius: 40rpx;
							margin-right: 10rpx;
						}
					}

					.inputToBox {
						.blanceTitle {
							display: flex;
							justify-content: right;
							color: #161616;
							font-size: 24rpx;
							margin-bottom: 11rpx;
							margin-right: 40rpx;
						}

						.inputBody {
							height: 169rpx;
							background-color: rgba(80, 135, 252, 0.1);
							border: 2rpx solid #3367D6;
							border-radius: 30rpx;
							padding-right: 45rpx;

							input {
								width: 100%;
								height: 65%;
								text-align: right;
								font-size: 42rpx;
								color: #3367D6;
							}

							.smallNumU {
								width: 100%;
								height: 35%;
								text-align: right;
								color: gray;
								font-size: 28rpx;
							}
						}
					}

					.tipsText {
						margin: 30rpx 0;
						padding-bottom: 60rpx;
						font-family: Noto Sans SC, Noto Sans SC;
						font-weight: 500;
						font-size: 28rpx;
						color: #6929C4;
						border-bottom: 2rpx solid #3367D6;
					}

					.newToBox {
						margin: 40rpx 0;

						.textToTitle {
							display: flex;
							justify-content: center;
							align-items: center;
							color: #AF6EFF;
							font-weight: bold;
							font-size: 30rpx;
						}

						.toRessBox {
							.ressTitle {
								display: flex;
								justify-content: space-between;
								align-items: center;

								.titleOne {
									color: #3367D6;
									font-size: 30rpx;
									font-weight: bold;
								}

								.titleCenter {
									width: 2rpx;
									height: 30rpx;
									color: gray;
									margin: 0 30rpx;
								}

								.titleRight {
									color: #AF6EFF;
									font-size: 34rpx;
									font-weight: bold;
								}
							}

							.inputToAddress {
								height: 90rpx;
								background-color: rgba(80, 135, 252, 0.1);
								border: 2rpx solid #3367D6;
								border-radius: 30rpx;
								padding-left: 30rpx;
								margin-top: 30rpx;

								input {
									width: 100%;
									height: 100%;
									text-align: left;
									font-size: 35rpx;
									color: #3367D6;
								}
							}
						}
					}

					.SlippageBox {
						margin-top: 40rpx;

						.boxTitle {
							font-family: Noto Sans SC, Noto Sans SC;
							font-weight: 500;
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
								background-color: rgba(51, 103, 214, 0.4);
								color: #3367D6;
							}

							.listNoActive {
								background-color: rgba(51, 103, 214, 0.4);
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

					.routerBox {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-top: 50rpx;

						.leftRou {
							font-family: Noto Sans SC, Noto Sans SC;
							font-weight: 500;
							font-size: 28rpx;
							color: #161616;
						}

						.rightRou {
							display: flex;
							align-items: center;

							text {
								font-family: Noto Sans SC, Noto Sans SC;
								font-weight: 500;
								font-size: 28rpx;
								color: #3367D6;
							}

							image {
								width: 35rpx;
								height: 35rpx;
							}
						}
					}

					.centerIcon {
						display: flex;
						justify-content: center;
						margin: 48rpx 0;

						.changebox {
							width: 36rpx;
							height: 40rpx;
							line-height: 40rpx;
							text-align: center;
							background-image: url('../../static/icon1.png');
							background-size: 100% 100%;

							image {
								width: 27rpx;
								height: 28rpx;
							}
						}
					}

					.btnGo {
						display: flex;
						justify-content: center;
						margin-top: 80rpx;

						.btn {
							width: 638rpx;
							height: 112rpx;
							line-height: 112rpx;
							text-align: center;
							font-family: Noto Sans SC, Noto Sans SC;
							font-weight: 600;
							font-size: 28rpx;
							background: rgba(115, 40, 228, 0.1);
							color: #6433D6;
							border-radius: 56rpx;
						}

						.btnNo {
							width: 638rpx;
							height: 112rpx;
							line-height: 112rpx;
							text-align: center;
							font-family: Noto Sans SC, Noto Sans SC;
							font-weight: 600;
							font-size: 28rpx;
							background: rgba(115, 40, 228, 0.1);
							color: rad;
							border-radius: 56rpx;
						}
					}

					.infoGo {
						display: flex;
						justify-content: center;
						color: #00dea1;
						font-size: 30rpx;
						margin-top: 20rpx;
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

			.title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 25rpx 25rpx 25rpx;

				.left {
					width: 50rpx;
				}

				.center {
					color: #000;
					font-size: 28rpx;
					font-weight: bold;
				}

				.right {
					image {
						width: 50rpx;
						height: 50rpx;
					}
				}
			}

			.tokenList {
				padding: 18rpx;

				.listOne {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 60rpx;

					.leftOne {
						border-bottom: 2rpx solid #e5e5e5;
						padding-bottom: 40rpx;

						.oneLeft {
							color: #000;
						}

						.oneRight {
							color: #6929C4;
							font-size: 40rpx;
							font-weight: bold;
							margin-top: 20rpx;
						}
					}

					.rightImg {
						width: 70rpx;
						height: 70rpx;

						image {
							width: 100%;
							height: 100%;
							border-radius: 50%;
						}
					}
				}

				.listOne2 {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: 20rpx;

					.oneLeft {
						color: #000;
					}

					.oneRight {
						color: #00dea1;
						font-size: 30rpx;
						font-weight: bold;
					}
				}

				.btnBootom {
					display: flex;
					justify-content: center;
					margin-top: 50rpx;

					.btn {
						width: 100%;
						height: 100rpx;
						line-height: 100rpx;
						text-align: center;
						background: linear-gradient(90deg, #AF6EFF 0%, #8D60FF 100%);
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
	}

	@media all and (min-width: 320px) and (max-width: 700px) {

		.content {
			width: 100%;
			height: 1700rpx;
			min-height: 100vh;
			box-sizing: border-box;
			position: relative;
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
				border-radius: 20rpx;
				padding: 30rpx;
				background-color: #fff;

				.loadIcon {
					display: flex;
					justify-content: right;

					image {
						width: 32rpx;
						height: 32rpx;
					}
				}

				.lpBox {
					margin-top: 20rpx;
					padding-bottom: 40rpx;

					.coinBox {
						display: flex;
						align-items: center;

						.coinNameBox {
							border-radius: 40rpx;
							line-height: 65rpx;
							display: flex;
							justify-content: center;
							margin-right: 25rpx;

							.coinSmall {
								display: flex;
								align-items: center;

								text {
									color: #000;
									font-size: 30rpx;
									margin-right: 23rpx;
									margin-right: 10rpx;
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
							border: 2rpx solid #3367D6;
							color: #3367D6;
							font-size: 24rpx;
							font-weight: bold;
							border-radius: 40rpx;
							margin-right: 10rpx;
						}
					}

					.inputToBox {
						.blanceTitle {
							display: flex;
							justify-content: right;
							color: #161616;
							font-size: 24rpx;
							margin-bottom: 11rpx;
							margin-right: 40rpx;
						}

						.inputBody {
							height: 169rpx;
							background-color: rgba(80, 135, 252, 0.1);
							border: 2rpx solid #3367D6;
							border-radius: 30rpx;
							padding-right: 45rpx;

							input {
								width: 100%;
								height: 65%;
								text-align: right;
								font-size: 42rpx;
								color: #3367D6;
							}

							.smallNumU {
								width: 100%;
								height: 35%;
								text-align: right;
								color: gray;
								font-size: 28rpx;
							}
						}
					}

					.tipsText {
						margin: 30rpx 0;
						padding-bottom: 60rpx;
						font-family: Noto Sans SC, Noto Sans SC;
						font-weight: 500;
						font-size: 28rpx;
						color: #6929C4;
						border-bottom: 2rpx solid #3367D6;
					}

					.newToBox {
						margin: 40rpx 0;

						.textToTitle {
							display: flex;
							justify-content: center;
							align-items: center;
							color: #AF6EFF;
							font-weight: bold;
							font-size: 30rpx;
						}

						.toRessBox {
							.ressTitle {
								display: flex;
								justify-content: space-between;
								align-items: center;

								.titleOne {
									color: #3367D6;
									font-size: 30rpx;
									font-weight: bold;
								}

								.titleCenter {
									width: 2rpx;
									height: 30rpx;
									color: gray;
									margin: 0 30rpx;
								}

								.titleRight {
									color: #AF6EFF;
									font-size: 34rpx;
									font-weight: bold;
								}
							}

							.inputToAddress {
								height: 90rpx;
								background-color: rgba(80, 135, 252, 0.1);
								border: 2rpx solid #3367D6;
								border-radius: 30rpx;
								padding-left: 30rpx;
								margin-top: 30rpx;

								input {
									width: 100%;
									height: 100%;
									text-align: left;
									font-size: 35rpx;
									color: #3367D6;
								}
							}
						}
					}

					.SlippageBox {
						margin-top: 40rpx;

						.boxTitle {
							font-family: Noto Sans SC, Noto Sans SC;
							font-weight: 500;
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
								background-color: rgba(51, 103, 214, 0.4);
								color: #3367D6;
							}

							.listNoActive {
								background-color: rgba(51, 103, 214, 0.4);
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

					.routerBox {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-top: 50rpx;

						.leftRou {
							font-family: Noto Sans SC, Noto Sans SC;
							font-weight: 500;
							font-size: 28rpx;
							color: #161616;
						}

						.rightRou {
							display: flex;
							align-items: center;

							text {
								font-family: Noto Sans SC, Noto Sans SC;
								font-weight: 500;
								font-size: 28rpx;
								color: #3367D6;
							}

							image {
								width: 35rpx;
								height: 35rpx;
							}
						}
					}

					.centerIcon {
						display: flex;
						justify-content: center;
						margin: 48rpx 0;

						.changebox {
							width: 36rpx;
							height: 40rpx;
							line-height: 40rpx;
							text-align: center;
							background-image: url('../../static/icon1.png');
							background-size: 100% 100%;

							image {
								width: 27rpx;
								height: 28rpx;
							}
						}
					}

					.btnGo {
						display: flex;
						justify-content: center;
						margin-top: 80rpx;

						.btn {
							width: 638rpx;
							height: 112rpx;
							line-height: 112rpx;
							text-align: center;
							font-family: Noto Sans SC, Noto Sans SC;
							font-weight: 600;
							font-size: 28rpx;
							background: rgba(115, 40, 228, 0.1);
							color: #6433D6;
							border-radius: 56rpx;
						}

						.btnNo {
							width: 638rpx;
							height: 112rpx;
							line-height: 112rpx;
							text-align: center;
							font-family: Noto Sans SC, Noto Sans SC;
							font-weight: 600;
							font-size: 28rpx;
							background: rgba(115, 40, 228, 0.1);
							color: red;
							border-radius: 56rpx;
						}
					}

					.infoGo {
						display: flex;
						justify-content: center;
						color: #00dea1;
						font-size: 30rpx;
						margin-top: 20rpx;
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

			.title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 25rpx 25rpx 25rpx;

				.left {
					width: 50rpx;
				}

				.center {
					color: #000;
					font-size: 28rpx;
					font-weight: bold;
				}

				.right {
					image {
						width: 50rpx;
						height: 50rpx;
					}
				}
			}

			.tokenList {
				padding: 18rpx;

				.listOne {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 60rpx;

					.leftOne {
						border-bottom: 2rpx solid #e5e5e5;
						padding-bottom: 40rpx;

						.oneLeft {
							color: #000;
						}

						.oneRight {
							color: #6929C4;
							font-size: 40rpx;
							font-weight: bold;
							margin-top: 20rpx;
						}
					}

					.rightImg {
						width: 70rpx;
						height: 70rpx;

						image {
							width: 100%;
							height: 100%;
							border-radius: 50%;
						}
					}
				}

				.listOne2 {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: 20rpx;

					.oneLeft {
						color: #000;
					}

					.oneRight {
						color: #00dea1;
						font-size: 30rpx;
						font-weight: bold;
					}
				}

				.btnBootom {
					display: flex;
					justify-content: center;
					margin-top: 50rpx;

					.btn {
						width: 100%;
						height: 100rpx;
						line-height: 100rpx;
						text-align: center;
						background: linear-gradient(90deg, #AF6EFF 0%, #8D60FF 100%);
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
	}
</style>