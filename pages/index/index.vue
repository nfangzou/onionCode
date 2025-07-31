<template>
	<view class="content">
		<back ref="child" text="" :text="myAddress" :type="0" :classType="true" subheading="true" @getMsg="getMsg">
		</back>
		<view class="searchTop">
			<view class="leftInput">
				<input type="text" v-model="searchHash" :placeholder="$t('newIndex10')" />
			</view>
			<view class="rightBtn" @tap="searchClick">
				<image src="/static/searchIcon.png" mode=""></image>
				<text>{{$t('newIndex1')}}</text>
			</view>
		</view>
		<view class="webView">
			<web-view src="/hybrid/html/local.html" style="width: 100%; height: 600upx;border-radius: 30upx;"></web-view>
		</view>
		<view class="webCenterBox">
			<view class="webLeft">
				<view class="bannerBox">
					<liu-slide-img :list="bannerList" :borderRadius="30" :type="1" :autoplay="autoplay" :interval="interval" @change="bannerChange"
					   @click="bannerClick"></liu-slide-img>
				</view>
				<view class="tranInfo">
					<view class="infoTilte">
						{{$t('newIndex2')}}
					</view>
					<view class="smallText">
						{{$t('newIndex3')}}
					</view>
					<view class="tokenIcon">
						<image :src="fromCur.logoURI==''?'https://dapp.onionswap.info/logo.png':fromCur.logoURI" mode=""></image>
						<text>{{fromCur.name}}</text>
					</view>
					<view class="tokenIcon">
						<image :src="toCur.logoURI==''?'https://dapp.onionswap.info/logo.png':toCur.logoURI" mode=""></image>
						<text>{{toCur.name}}</text>
					</view>
				</view>
			</view>
			
			<view class="centerBox">
				<view class="lpBox">
					<view class="formBox">
						<view class="coinBox">
							<view class="fromText">
								{{$t('newIndex4')}}
							</view>
							<view class="selectNum">
								<view class="coinMax" v-for="(item, index) in numList" :key="index" @tap="clickFromMax(index)">
									{{item}}
								</view>
							</view>
						</view>
						<view class="inputToBox">
							<view class="inputBody">
								<view class="coinNameBox">
									<view class="coinSmall" @tap="showPupCoin('from')">
										<image class="slectIcon2"
											:src="fromCur.logoURI==''?'https://dapp.onionswap.info/logo.png':fromCur.logoURI"
											mode=""></image>
										<text>{{fromCur.name?fromCur.name:$t('index6')}}</text>
										<image class="slectIcon" src="../../static/bottomIcon.png" mode=""></image>
									</view>
								</view>
								<view class="inputRight">
									<input v-model="fromCoinNum" :style="{'height':!focusFromStaus?'100%':''}" @input="showChange"
										type="text" placeholder="0.00" />
								</view>
							</view>
							<view class="blanceTitle">
								<view class="leftBlan">
									{{$t('index7')}}：{{fromCur.balance}}
								</view>
								<view v-if="focusFromStaus" class="smallNumU">~{{Math.floor(usdtPrice*100)/100}} USD</view>
							</view>
						</view>
					</view>
					<view class="centerIcon">
						<view class="changebox" @tap="changeIcon()">
							<image src="../../static/icon2.png" mode=""></image>
						</view>
					</view>
					<view class="formBox">
						<view class="coinBox">
							<view class="fromText">
								{{$t('newIndex5')}}
							</view>
							<view class="selectNum">
								<view class="coinMax" v-for="(item, index) in numList2" :key="index" @tap="clickToMax(index)">
									{{item}}
								</view>
							</view>
						</view>
						<view class="inputToBox">
							<view class="inputBody">
								<view class="coinNameBox">
									<view class="coinSmall" @tap="showPupCoin('to')">
										<image class="slectIcon2"
											:src="toCur.logoURI==''?'https://dapp.onionswap.info/logo.png':toCur.logoURI" mode="">
										</image>
										<text>{{toCur.name?toCur.name:$t('index6')}}</text>
										<image class="slectIcon" src="../../static/bottomIcon.png" mode=""></image>
									</view>
								</view>
								<view class="inputRight">
									<input v-model="toCoinNum" :style="{'height':!focusToStaus?'100%':''}" @input="showToChange"
										type="text" placeholder="0.00" />
								</view>
							</view>
							<view class="blanceTitle">
								<view class="leftBlan">
									{{$t('index7')}}：{{toCur.balance}}
								</view>
								<view v-if="focusToStaus" class="smallNumU">~{{Math.floor(usdtPrice*100)/100}} USD</view>
							</view>
						</view>
					</view>
					<view class="tipsText" v-if="toCur.name != ''">
						1 {{fromCur.name}}{{fromCur.name == 'TBC'?' ≈ '+(showUsdtPrice)+' USD':''}} = {{fromCur.name == 'TBC'?FTPrice:TBCPrice}} {{toCur.name}} {{toCur.name == 'TBC'?'≈ '+(Math.floor(showUsdtPrice*TBCPrice*1000000)/1000000)+' USD':''}}
						<image @tap="loadClick" src="../../static/load.png" mode=""></image>
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
									placeholder-style="color: rgba(102,82,217,0.6);" type="text" /><text
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
		</view>
		<view class="noticeBox">
			<view class="leftNotice">
				{{$t('newIndex6')}}
			</view>
			<view class="rightBtn">
				{{$t('newIndex7')}}
			</view>
		</view>
		<view class="footerBox">
			<view class="titleN">
				{{$t('newIndex8')}}
				<view class="lineStyle">
				</view>
			</view>
			<view class="smallTitle">
				{{$t('newIndex9')}}
			</view>
			<view class="parBox">
				<view class="list">
					<image src="/static/part1.png" mode=""></image>
					<image src="/static/part2.png" mode=""></image>
					<image src="/static/part3.png" mode=""></image>
				</view>
				<view class="list">
					<image src="/static/part4.png" mode=""></image>
					<image src="/static/part5.png" mode=""></image>
					<image style="height: 30rpx;" src="/static/part6.png" mode=""></image>
				</view>
				<view class="list">
					<image src="/static/part7.png" mode=""></image>
					<image src="/static/part8.png" mode=""></image>
					<image style="height: 30rpx;" src="/static/part9.png" mode=""></image>
				</view>
				<view class="list">
					<image src="/static/part10.png" mode=""></image>
					<image src="/static/part11.png" mode=""></image>
					<image src="/static/part12.png" mode=""></image>
				</view>
				<view class="list">
					<image src="/static/part13.png" mode=""></image>
					<image src="/static/part14.png" mode=""></image>
					<image src="/static/part15.png" mode=""></image>
				</view>
				<view class="list">
					<image src="/static/part16.png" mode=""></image>
					<image src="/static/part17.png" mode=""></image>
					<image src="/static/part18.png" mode=""></image>
				</view>
				<view class="list">
					<image src="/static/part19.png" mode=""></image>
					<image src="/static/part20.png" mode=""></image>
					<image src="/static/part21.png" mode=""></image>
				</view>
				<view class="list" style="justify-content: space-around;margin-bottom: 0;">
					<image src="/static/part22.png" mode=""></image>
					<image src="/static/part23.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="shareEnd">
			<view class="endBg">
				<image src="/static/share1.png" mode=""></image>
			</view>
			<view class="endBg">
				<image src="/static/share2.png" mode=""></image>
			</view>
			<view class="endBg">
				<image src="/static/share3.png" mode=""></image>
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
				searchHash: '',
				recAddress: '',
				recSellAddress: '',
				nowToAddress: '',
				walletName: '',
				autoplay: true,
				interval: 5000,
				numList:['Max','50%','25%'],
				numList2:['Max','50%','25%'],
				bannerList: [
					{
						src: "../../static/bannerList.png",
						title: "Onion Swap",
						bannerInfo: "超有内涵 等你发现  ！"
					},
					{
						src: "../../static/bannerList.png",
						title: "Onion Swap",
						bannerInfo: "天生卷王，卷出无限未来"
					}
				]
				
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
			console.log("version: 1.2.0")
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
					// this.getWalletInfo();
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
			//当前轮播索引
			bannerChange(e) {
			    // console.log('==========', e)
			},
			//点击轮播
			bannerClick(e) {
			    // console.log('点击轮播', e)
			},
			getMsg() {
				this.Init();
			},
			clickGoInfo() {
				uni.navigateTo({
					url: '/pages/index/tranferInfo'
				})
			},
			searchClick() {
				if(this.searchHash == '') {
					return ;
				}
				window.open('https://explorer.turingbitchain.io/tx/'+this.searchHash, '_blank')
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
				if (type == 0) {
					this.fromCoinNum = this.fromCur.balance;
				} else if(type == 1) {
					this.fromCoinNum = this.fromCur.balance / 2;
				} else{
					this.fromCoinNum = this.fromCur.balance / 4;
				}
				this.showClickChange(1, this.fromCoinNum);
			},
			clickToMax(type) {
				if (type == 0) {
					this.toCoinNum = this.toCur.balance
				} else if(type == 1) {
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
			padding: 120rpx 10% 50rpx 10%;
			.searchTop{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin: 40rpx 30rpx 0 30rpx;
				.leftInput{
					width: 70%;
					height: 80rpx;
					background: rgba(102,82,217,0.05);
					border-radius: 56rpx;
					input{
						width: 100%;
						height: 100%;
						padding-left: 30rpx;
					}
				}
				.rightBtn{
					display: flex;
					justify-content: center;
					align-items: center;
					width: 25%;
					height: 80rpx;
					background: linear-gradient( 270deg, #F4CDCD 0%, #E283E7 43%, #6652D9 100%);
					border-radius: 56rpx;
					image{
						width: 30rpx;
						height: 30rpx;
						margin-right: 14rpx;
					}
					text{
						font-family: Noto Sans, Noto Sans;
						font-weight: 500;
						font-size: 30rpx;
						color: #FFFFFF;
						margin-bottom: 10rpx;
					}
				}
			}
			.webCenterBox{
				display: flex;
				justify-content: space-between;
				.webLeft{
					width: 60%;
					.bannerBox{
						padding: 0 30rpx;
						margin: 30rpx 0;
					}
					.tranInfo{
						padding: 30rpx;
						margin: 40rpx 30rpx 0 30rpx;
						background: #FFFFFF;
						box-shadow: 0px 7rpx 35rpx rgba(88,86,218,0.2);
						border-radius: 28rpx;
						.infoTilte{
							font-family: Noto Sans SC, Noto Sans SC;
							font-weight: 500;
							font-size: 30rpx;
							color: #161616;
						}
						.smallText{
							margin-top: 46rpx;
							font-family: Noto Sans SC, Noto Sans SC;
							font-weight: 500;
							font-size: 30rpx;
							color: #A8A8A8;
						}
						.tokenIcon{
							margin-top: 56rpx;
							display: flex;
							align-items: center;
							image{
								width: 45rpx;
								height: 45rpx;
								margin-right: 14rpx;
								border-radius: 50%;
							}
							text{
								font-family: Noto Sans SC, Noto Sans SC;
								font-weight: 500;
								font-size: 28rpx;
								color: #6929C4;
							}
						}
					}
				}
				.centerBox {
					width: 35%;
					margin: 30rpx auto 0;
					// max-width: 750rpx;
					// margin: 40rpx 30rpx 0 30rpx;
					border-radius: 28rpx;
					padding: 30rpx;
					background-color: #fff;
					box-shadow: 0px 7rpx 35rpx rgba(88,86,218,0.2);
					.lpBox {
						margin-top: 20rpx;
						padding-bottom: 40rpx;
						.formBox{
							background: rgba(102,82,217,0.05);
							border-radius: 28rpx;
							padding: 30rpx;
						}
						.coinBox {
							display: flex;
							justify-content: space-between;
							align-items: center;
							.fromText{
								font-family: Noto Sans, Noto Sans;
								font-weight: 500;
								font-size: 30rpx;
								color: #8A8A8A;
							}
							.selectNum{
								display: flex;
								align-items: center;
								.coinMax {
									width: 80rpx;
									height: 42rpx;
									color: rgba(102, 82, 217, .8);
									border: 2px solid rgba(102, 82, 217, .8);
									border-radius: 56rpx;
									line-height: 42rpx;
									text-align: center;
									font-size: 24rpx;
									font-weight: bold;
									margin-right: 10rpx;
								}
							}
						}
				
						.inputToBox {
							.blanceTitle {
								display: flex;
								justify-content: space-between;
								align-items: center;
								margin-bottom: 11rpx;
								.leftBlan{
									color: #A8A8A8;
									font-size: 28rpx;
								}
								.smallNumU {
									text-align: right;
									color: gray;
									font-size: 28rpx;
								}
							}
				
							.inputBody {
								height: 160rpx;
								border-radius: 30rpx;
								padding-right: 45rpx;
								display: flex;
								justify-content: space-between;
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
											font-size: 35rpx;
											margin-right: 10rpx;
										}
								
										.slectIcon2 {
											width: 56rpx;
											height: 56rpx;
											border-radius: 50%;
											margin-right: 10rpx;
										}
								
										.slectIcon {
											width: 42rpx;
											height: 42rpx;
										}
									}
								}
								.inputRight{
									width: 50%;
									input {
										width: 100%;
										height: 65%;
										text-align: right;
										font-size: 42rpx;
										color: #3367D6;
									}
															
									
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
							border-bottom: 2rpx solid #8D61DD;
							display: flex;
							align-items: center;
							image{
								width: 32rpx;
								height: 32rpx;
								margin-left: 10rpx;
							}
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
							display: flex;
							justify-content: space-between;
							align-items: center;
							.boxTitle {
								font-family: Noto Sans SC, Noto Sans SC;
								font-weight: 500;
								font-size: 28rpx;
								color: #161616;
							}
				
							.slipBox {
								display: flex;
								align-items: center;
				
								.list {
									width: 90rpx;
									height: 47rpx;
									line-height: 47rpx;
									text-align: center;
									border-radius: 40rpx;
									font-size: 25rpx;
									font-weight: bold;
									margin-right: 10rpx;
								}
				
								.listActive {
									background-color: #6652D9;
									color: #FFFFFF;
								}
				
								.listNoActive {
									background-color: rgba(102,82,217,0.1);
									color: rgba(102,82,217,0.6);
								}
				
								.list2 {
									width: 90rpx;
									height: 47rpx;
									line-height: 47rpx;
									text-align: center;
									border-radius: 40rpx;
									font-size: 20rpx;
									font-weight: bold;
									display: flex;
									align-items: center;
				
									input {
										width: 100%;
										height: 100%;
										font-size: 25rpx;
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
									color: #6652D9;
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
								background: linear-gradient( 270deg, #6652D9 0%, #E283E7 50%, #F4CDCD 100%);
								color: #fff;
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
			
			.noticeBox{
				padding: 25rpx 28rpx;
				margin: 30rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				background: linear-gradient( 270deg, rgba(244,205,205,0.63) 0%, #E283E7 50%, rgba(102,82,217,0.53) 100%);
				.leftNotice{
					font-family: Noto Sans, Noto Sans;
					font-weight: 500;
					font-size: 25rpx;
					color: #FFFFFF;
					white-space: nowrap; /* 防止文本换行 */
					overflow: hidden;    /* 隐藏溢出的内容 */
					text-overflow: ellipsis;
				}
				.rightBtn{
					padding: 0 10rpx;
					height: 40rpx;
					line-height: 40rpx;
					text-align: center;
					border-radius: 35rpx;
					border: 2px solid #FFFFFF;
					font-family: Noto Sans, Noto Sans;
					font-weight: 500;
					font-size: 25rpx;
					color: #FFFFFF;
				}
			}
			.footerBox{
				padding: 112rpx 28rpx;
				margin: 30rpx;
				background: #FFFFFF;
				box-shadow: 0px 7rpx 35rpx rgba(88,86,218,0.2);
				border-radius: 28rpx;
				text-align: center;
				.titleN{
					font-family: Noto Sans SC, Noto Sans SC;
					font-weight: 700;
					font-size: 50rpx;
					color: #000000;
					padding: 0 30rpx;
				}
				.smallTitle{
					margin-top: 30rpx;
					font-family: Noto Sans SC, Noto Sans SC;
					font-weight: 400;
					font-size: 28rpx;
					color: #000000;
				}
				.parBox{
					margin-top: 112rpx;
					.list{
						display: flex;
						justify-content: space-evenly;
						align-items: center;
						margin-bottom: 117rpx;
						image{
							width: 165rpx;
							height: 60rpx;
						}
					}
				}
			}
			.shareEnd{
				margin: 28rpx 30rpx 28rpx 30rpx;
				padding: 56rpx 30%;
				display: flex;
				justify-content: space-around;
				align-items: center;
				.endBg{
					width: 84rpx;
					height: 84rpx;
					line-height: 114rpx;
					text-align: center;
					background: linear-gradient( 270deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 100%);
					border-radius: 56rpx;
					image{
						width: 56rpx;
						height: 56rpx;
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
						background: linear-gradient( 270deg, #6652D9 0%, #E283E7 50%, #F4CDCD 100%);
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
			.searchTop{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin: 40rpx 30rpx 0 30rpx;
				.leftInput{
					width: 70%;
					height: 80rpx;
					background: rgba(102,82,217,0.05);
					border-radius: 56rpx;
					input{
						width: 100%;
						height: 100%;
						padding-left: 30rpx;
					}
				}
				.rightBtn{
					display: flex;
					justify-content: center;
					align-items: center;
					width: 25%;
					height: 80rpx;
					background: linear-gradient( 270deg, #F4CDCD 0%, #E283E7 43%, #6652D9 100%);
					border-radius: 56rpx;
					image{
						width: 30rpx;
						height: 30rpx;
						margin-right: 14rpx;
					}
					text{
						font-family: Noto Sans, Noto Sans;
						font-weight: 500;
						font-size: 30rpx;
						color: #FFFFFF;
						margin-bottom: 10rpx;
					}
				}
			}
			.webCenterBox{
				.webLeft{
					.bannerBox{
						padding: 0 30rpx;
						margin: 30rpx 0;
					}
					.tranInfo{
						padding: 30rpx;
						margin: 40rpx 30rpx 0 30rpx;
						background: #FFFFFF;
						box-shadow: 0px 7rpx 35rpx rgba(88,86,218,0.2);
						border-radius: 28rpx;
						.infoTilte{
							font-family: Noto Sans SC, Noto Sans SC;
							font-weight: 500;
							font-size: 30rpx;
							color: #161616;
						}
						.smallText{
							margin-top: 46rpx;
							font-family: Noto Sans SC, Noto Sans SC;
							font-weight: 500;
							font-size: 30rpx;
							color: #A8A8A8;
						}
						.tokenIcon{
							margin-top: 56rpx;
							display: flex;
							align-items: center;
							image{
								width: 45rpx;
								height: 45rpx;
								margin-right: 14rpx;
								border-radius: 50%;
							}
							text{
								font-family: Noto Sans SC, Noto Sans SC;
								font-weight: 500;
								font-size: 28rpx;
								color: #6929C4;
							}
						}
					}
				}
				.centerBox {
					max-width: 750rpx;
					margin: 40rpx 30rpx 0 30rpx;
					border-radius: 28rpx;
					padding: 30rpx;
					background-color: #fff;
					box-shadow: 0px 7rpx 35rpx rgba(88,86,218,0.2);
				
					.lpBox {
						margin-top: 20rpx;
						padding-bottom: 40rpx;
						.formBox{
							background: rgba(102,82,217,0.05);
							border-radius: 28rpx;
							padding: 30rpx;
							.coinBox {
								display: flex;
								justify-content: space-between;
								align-items: center;
								.fromText{
									font-family: Noto Sans, Noto Sans;
									font-weight: 500;
									font-size: 30rpx;
									color: #8A8A8A;
								}
								.selectNum{
									display: flex;
									align-items: center;
									.coinMax {
										width: 80rpx;
										height: 42rpx;
										color: rgba(102, 82, 217, .8);
										border: 2px solid rgba(102, 82, 217, .8);
										border-radius: 56rpx;
										line-height: 42rpx;
										text-align: center;
										font-size: 24rpx;
										font-weight: bold;
										margin-right: 10rpx;
									}
								}
								
							}
							
							.inputToBox {
								.blanceTitle {
									display: flex;
									justify-content: space-between;
									align-items: center;
									margin-bottom: 11rpx;
									.leftBlan{
										color: #A8A8A8;
										font-size: 28rpx;
									}
									.smallNumU {
										text-align: right;
										color: gray;
										font-size: 28rpx;
									}
								}
							
								.inputBody {
									height: 160rpx;
									border-radius: 30rpx;
									padding-right: 45rpx;
									display: flex;
									justify-content: space-between;
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
												font-size: 35rpx;
												margin-right: 10rpx;
											}
															
											.slectIcon2 {
												width: 56rpx;
												height: 56rpx;
												border-radius: 50%;
												margin-right: 10rpx;
											}
															
											.slectIcon {
												width: 42rpx;
												height: 42rpx;
											}
										}
									}
									.inputRight{
										width: 50%;
										input {
											width: 100%;
											height: 65%;
											text-align: right;
											font-size: 42rpx;
											color: #3367D6;
										}
																
										
									}
									
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
							border-bottom: 2rpx solid #8D61DD;
							display: flex;
							align-items: center;
							image{
								width: 32rpx;
								height: 32rpx;
								margin-left: 10rpx;
							}
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
							display: flex;
							justify-content: space-between;
							align-items: center;
							.boxTitle {
								font-family: Noto Sans SC, Noto Sans SC;
								font-weight: 500;
								font-size: 28rpx;
								color: #161616;
							}
				
							.slipBox {
								display: flex;
								align-items: center;
				
								.list {
									width: 90rpx;
									height: 47rpx;
									line-height: 47rpx;
									text-align: center;
									border-radius: 40rpx;
									font-size: 25rpx;
									font-weight: bold;
									margin-right: 10rpx;
								}
				
								.listActive {
									background-color: #6652D9;
									color: #FFFFFF;
								}
								
								.listNoActive {
									background-color: rgba(102,82,217,0.1);
									color: rgba(102,82,217,0.6);
								}
				
								.list2 {
									width: 90rpx;
									height: 47rpx;
									line-height: 47rpx;
									text-align: center;
									border-radius: 40rpx;
									font-size: 20rpx;
									font-weight: bold;
									display: flex;
									align-items: center;
				
									input {
										width: 100%;
										height: 100%;
										font-size: 25rpx;
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
									color: #6652D9;
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
								background: linear-gradient( 270deg, #6652D9 0%, #E283E7 50%, #F4CDCD 100%);
								color: #fff;
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
			
			.noticeBox{
				padding: 25rpx 28rpx;
				margin: 30rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				background: linear-gradient( 270deg, rgba(102,82,217,0.53) 0%, #E283E7 50%, rgba(244,205,205,0.63) 100%);
				.leftNotice{
					font-family: Noto Sans, Noto Sans;
					font-weight: 500;
					font-size: 26rpx;
					color: #FFFFFF;
					white-space: nowrap; /* 防止文本换行 */
					overflow: hidden;    /* 隐藏溢出的内容 */
					text-overflow: ellipsis;
					width: 80%;
				}
				.rightBtn{
					padding: 0 10rpx;
					height: 40rpx;
					line-height: 40rpx;
					text-align: center;
					border-radius: 35rpx;
					border: 2px solid #FFFFFF;
					font-family: Noto Sans, Noto Sans;
					font-weight: 500;
					font-size: 25rpx;
					color: #FFFFFF;
				}
			}
			.footerBox{
				padding: 112rpx 28rpx;
				margin: 30rpx;
				background: #FFFFFF;
				box-shadow: 0px 7rpx 35rpx rgba(88,86,218,0.2);
				border-radius: 28rpx;
				text-align: center;
				.titleN{
					font-family: Noto Sans SC, Noto Sans SC;
					font-weight: 700;
					font-size: 49rpx;
					color: #000000;
					padding: 0 30rpx;
					position: relative;
					z-index: 9;
					.lineStyle{
						position: absolute;
						transform: translate(-50%,-50%);
						left: 50%;
						bottom: -10%;
						width: 217rpx;
						height: 26rpx;
						background: linear-gradient( 270deg, #6652D9 0%, #E283E7 50%, #F4CDCD 100%);
						border-radius: 56rpx;
						z-index: -1;
					}
				}
				.smallTitle{
					margin-top: 30rpx;
					font-family: Noto Sans SC, Noto Sans SC;
					font-weight: 400;
					font-size: 28rpx;
					color: #000000;
				}
				.parBox{
					margin-top: 112rpx;
					.list{
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 117rpx;
						image{
							width: 145rpx;
							height: 50rpx;
						}
					}
				}
			}
			.shareEnd{
				margin: 28rpx 30rpx 28rpx 30rpx;
				padding: 56rpx;
				display: flex;
				justify-content: space-around;
				align-items: center;
				.endBg{
					width: 84rpx;
					height: 84rpx;
					line-height: 114rpx;
					text-align: center;
					background: linear-gradient( 270deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 100%);
					border-radius: 56rpx;
					image{
						width: 56rpx;
						height: 56rpx;
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
						background: linear-gradient( 270deg, #6652D9 0%, #E283E7 50%, #F4CDCD 100%);
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
	.webView{
		// height: 400upx;
		margin: 30upx 30upx;
		height: 600upx;
		position: relative;
		border-radius: 30upx;
		overflow: hidden;
	}
</style>