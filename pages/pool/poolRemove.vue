<template>
	<view class="content">
		<back ref="child" text="" :text="myAddress" :type="1" @connectWallet="connectWallet" :classType="true"
			subheading="true" @getMsg="getMsg">
		</back>
		<view class="tip">
			<view class="text">
				{{$t('pool13')}}：{{$t('pool23')}}
			</view>
		</view>
		<view class="centerBox">
			<view class="poolTitle">
				<view class="back" @tap="backGo">
					<image src="../../static/Arrowleft.png" mode=""></image>
				</view>
				<view class="title">
					{{$t('pool24')}}
				</view>
				<view class="rightN">
					<image @tap="loadClick" src="../../static/load.png" mode=""></image>
				</view>
			</view>
			<view class="outLP">
				<view class="titleBox">
					<view class="one" style="margin-bottom: 10rpx;">
						{{$t('pool25')}}
					</view>
				</view>
				<view class="infoBox">
					<view class="top1" style="display: flex;justify-content: space-between;">
						<view class="left" style="width: 70%;">
							<text style="margin-right: 40rpx;">{{$t('pool26')}}</text>
							<text style="font-weight: bold;">{{sliderValue}} %</text>
						</view>
						<view class="right" style="width: 30%;display: flex;justify-content: right;text-align: right;align-items: center;">
							<input v-model="inputSlider" @input="inputChangeSlider" type="number" min="1" step="1" :placeholder="$t('pool27')" placeholder-style="color: #e5e5e5;font-size: 26rpx;" />
							<text style="margin-left: 10rpx;">%</text>
						</view>
					</view>
					<uv-slider v-model="sliderValue" @input="slideChange" step="1" backgroundColor="rgba(255, 255, 255, 0.4)" min="0" max="100"></uv-slider>
				</view>
				
				<view class="infoBox" style="background: linear-gradient( 270deg, #F4CDCD 0%, #E283E7 43%, #6652D9 100%);">
					<view class="top1">
						<text>TBC</text>
						<text>{{tbcMoveNum}}</text>
					</view>
					<view class="top1" style="margin-bottom: 5rpx;">
						<text>{{poolInfo.contractName}}</text>
						<text>{{ftMoveNum}}</text>
					</view>
				</view>
				<view class="endingBox">
					{{$t('pool28')}}：{{poolInfo.ft_lp_balance/Math.pow(10,poolInfo.ftDecimal)}}
				</view>
				<view class="btnGo2">
					<view class="btn" @tap="closeLP" v-if="!noLPShow">
						{{$t('pool11')}}
					</view>
					<view style="color: red;" v-else>
						{{$t('new8')}}
					</view>
				</view>
				<view class="btnGo2" v-if="stausMerge" style="justify-content: space-between;">
					<view class="btn" style="width: 48%;" @tap="ftMerge()">
						FTLP_MERGE
					</view>
					<view class="btn" style="width: 48%;" @tap="poolMerge()">
						POOLNFT_MERGE
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
						{{$t('pool29_1')}}
					</view>
					<view class="right" @tap="closePup2">
						<image src="../../static/close2.png" mode=""></image>
					</view>
				</view>
				<view class="tokenList">
					<view class="listOne">
						<text class="oneLeft">TBC </text>
						<text class="oneRight">{{tbcMoveNum}}</text>
					</view>
					<view class="listOne">
						<text class="oneLeft">{{poolInfo.contractName}} </text>
						<text class="oneRight">{{ftMoveNum}}</text>
					</view>
					<view class="listOne">
						<text class="oneLeft">TBC/{{poolInfo.contractName}}</text>
						<view class="oneRight">
							<view>{{poolInfo.ft_lp_balance/Math.pow(10,poolInfo.ftDecimal)}}</view>
						</view>
					</view>
					<view class="listOne">
						<text class="oneLeft">{{$t('pool15')}}</text>
						<text class="oneRight">{{inputSlider == ''?sliderValue:inputSlider}}%</text>
					</view>
					<view class="btnBootom">
						<view class="btn" @tap="clickSupply">
							{{$t('pool11')}}
						</view>
					</view>
				</view>
			</view>
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
				selfSlip: '',
				sliderValue: 0,
				inputSlider: '',
				activeCole: 'rgba(0,0,0,0.5)',
				poolInfo: [],
				tbcMoveNum: 0,
				ftMoveNum: 0,
				noLPShow: false,
				manageGoInfo: [],
				stausMerge: false
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
			this.manageGoInfo = JSON.parse(decodeURIComponent(option.poolInfo));
			console.log(this.manageGoInfo)
			this.Init();
		},
		methods: {
			Init() {
				if (uni.getStorageSync('walletAddress') == undefined || uni.getStorageSync('walletAddress') == '') {
					console.log("Please connect wallet!")
				} else {
					this.myAddress = uni.getStorageSync('walletAddress');
					this.getNowPoolInfo();
				}
			},
			closeLP() {
				if(this.ftMoveNum == 0) {
					swal({
						title: 'error',
						text: this.$t('pool30'),
						icon: "error"
					})
					return;
				}
				this.$refs.popup2.open();
			},
			getNowPoolInfo() {
				let newHash = test(this.manageGoInfo.poolContract,this.myAddress,this.manageGoInfo.contractName).then(items => {
					this.getNowPersonPool(items);
				})
			},
			getNowPersonPool(valData) {
				this.$refs.loading.open();
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
								this.$refs.loading.close();
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
								this.poolInfo = onloadData[0];
							}
						}
					});
				}catch(error) {
					console.log(error)
				}
			},
			async ftMerge() {
				this.$refs.loading.open();
				try {
					const params = [{
						flag: "FTLP_MERGE",
						nft_contract_address: this.poolInfo.poolContract,
						poolNFT_version: this.manageGoInfo.pool_version
					}];
					const { txid, rawtx } = await window.Turing.sendTransaction(params);
					console.log(txid)
					if(txid) {
						this.$refs.loading.close();
						swal({
							title: 'MERGE成功',
							icon: "success",
						})
					}
				} catch (error) {
					this.$refs.loading.close();
					swal({
						title: error,
						icon: "error",
					})
				}
			},
			async poolMerge() {
				this.$refs.loading.open();
				try {
					const params = [{
						flag: "POOLNFT_MERGE",
						nft_contract_address: this.poolInfo.poolContract,
						merge_times: 5,
						poolNFT_version: this.manageGoInfo.pool_version
					}];
					const { txid, rawtx } = await window.Turing.sendTransaction(params);
					console.log(txid)
					if(txid) {
						this.$refs.loading.close();
						swal({
							title: 'MERGE'+this.$t('Success'),
							icon: "success",
						})
					}
				} catch (error) {
					console.log(error)
					this.$refs.loading.close();
					swal({
						title: error,
						icon: "error",
					})
				}
			},
			slideChange(e) {
				if(this.poolInfo.ft_lp_balance == 0) {
					this.noLPShow = true;
					return;
				}
				this.inputSlider = '';
				this.sliderValue = e;
				this.tbcMoveNum = bignumberJS(this.poolInfo.tbc_balance).multipliedBy(e/100).shiftedBy(-6).toFixed(6);
				this.ftMoveNum = bignumberJS(this.poolInfo.ft_a_balance).multipliedBy(e/100).shiftedBy(-this.poolInfo.ftDecimal).toFixed(6);
				this.ftLPNum = bignumberJS(this.poolInfo.ft_lp_balance).multipliedBy(e/100).shiftedBy(-this.poolInfo.ftDecimal).toFixed(6);
				if(e == 100) {
					this.ftMoveNum = bignumberJS(this.poolInfo.ft_a_balance).shiftedBy(-6).toFixed(6);
				}
			},
			getNumFull(number) {
				return number % 1 !== 0;
			},
			inputChangeSlider(e) {
				if(this.poolInfo.tbc_balance == 0) {
					this.noLPShow = true;
					return;
				}
				if(e.detail.value > 100) {
					e.detail.value = 100;
				}
				this.sliderValue = 0;
				this.inputSlider = e.detail.value;
				let inputE = e.detail.value == ''?0:JSON.parse(e.detail.value);
				this.tbcMoveNum = bignumberJS(this.poolInfo.tbc_balance).multipliedBy(inputE/100).shiftedBy(-6).toFixed(6);
				this.ftMoveNum = bignumberJS(this.poolInfo.ft_a_balance).multipliedBy(inputE/100).shiftedBy(-this.poolInfo.ftDecimal).toFixed(6);
				this.ftLPNum = bignumberJS(this.poolInfo.ft_lp_balance).multipliedBy(inputE/100).shiftedBy(-this.poolInfo.ftDecimal).toFixed(6);
				if(e == 100) {
					this.ftMoveNum = bignumberJS(this.poolInfo.ft_a_balance).shiftedBy(-6).toFixed(6);
				}
			},
			closePup2() {
				this.$refs.popup2.close();
			},
			async clickSupply() {
				this.$refs.loading.open();
				try {
					const params = [{
						flag: "POOLNFT_LP_CONSUME",
						nft_contract_address: this.poolInfo.poolContract,
						address: this.myAddress,
						ft_amount: this.ftLPNum,
						poolNFT_version: this.manageGoInfo.pool_version
					}];
					const { txid, rawtx } = await window.Turing.sendTransaction(params);
					console.log(txid)
					if(txid) {
						this.$refs.loading.close();
						this.$refs.popup2.close();
						this.getNowPoolInfo();
						swal({
							title: this.$t('pool11') + this.$t('Success'),
							icon: "success",
						})
					} else{
						this.$refs.loading.close();
						this.stausMerge = true;
						swal({
							title: 'txid is null',
							icon: "error",
						})
					}
				} catch (error) {
					this.$refs.loading.close();
					this.$refs.popup2.close();
					this.stausMerge = true;
					console.log(error)
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
			loadClick() {
				let _this = this;
				_this.$refs.loading.open();
				setTimeout(() => {
					_this.$refs.loading.close();
				}, 1000);
			},
			backGo() {
				uni.navigateBack();
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
			min-height: 100vh;
			box-sizing: border-box;
			position: relative;
			padding-bottom: 30upx;
			padding-top: 140rpx;
			.backTitle {
				margin: 38rpx 44rpx;
		
				image {
					width: 60rpx;
					height: 54rpx;
				}
			}
			.centerBox{
				border: 2rpx solid #e5e5e5;
				border-radius: 20rpx;
				width: 50%;
				margin: 40rpx auto;
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
				.outLP{
					margin-top: 27rpx;
					padding: 48rpx;
					.titleBox{
						color: #161616;
						font-weight: bold;
						font-size: 36rpx;
					}
					.infoBox{
						margin-top: 30rpx;
						padding: 25rpx 16rpx;
						background: linear-gradient( 270deg, #6652D9 0%, #E283E7 55%, #F4CDCD 100%);
						border-radius: 10rpx;
						.top1{
							display: flex;
							justify-content: space-between;
							margin-bottom: 31rpx;
							color: #fff;
							font-size: 28rpx;
							font-weight: bold;
						}
					}
					.endingBox{
						margin: 34rpx 0;
						color: #161616;
						font-size: 30rpx;
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
						color: #6929C4;
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
			padding-top: 140rpx;
			.backTitle {
				margin: 38rpx 44rpx;
		
				image {
					width: 60rpx;
					height: 54rpx;
				}
			}
			.centerBox{
				margin: 40rpx 30rpx 0 30rpx;
				border: 2rpx solid #e5e5e5;
				border-radius: 20rpx;
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
				.outLP{
					margin-top: 27rpx;
					padding: 28rpx;
					.titleBox{
						color: #161616;
						font-weight: bold;
						font-size: 36rpx;
					}
					.infoBox{
						margin-top: 30rpx;
						padding: 25rpx 16rpx;
						background: linear-gradient( 270deg, #6652D9 0%, #E283E7 55%, #F4CDCD 100%);
						border-radius: 10rpx;
						.top1{
							display: flex;
							justify-content: space-between;
							margin-bottom: 31rpx;
							color: #fff;
							font-size: 28rpx;
							font-weight: bold;
						}
					}
					.endingBox{
						margin: 34rpx 0;
						color: #161616;
						font-size: 30rpx;
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
						color: #6929C4;
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