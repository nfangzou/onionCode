<template>
	<view class="mask">
		<view class="title">
			<view class="left">
			</view>
			<view class="center">
				{{$t('index3')}}
			</view>
			<view class="right" @tap="clickClose">
				<image src="../../static/close.png" mode=""></image>
			</view>
		</view>
		<view class="coinListBox">
			<view class="inputBox">
				<image src="../../static/Search.png" mode=""></image>
				<input v-model="newAddress" @input="getProCoinList" :placeholder="$t('index4')" type="text" />
				<image src="../../static/delIcon.png" @tap="clickCloseInput" mode=""></image>
			</view>
			<view class="tokenList">
				<view class="titleList" v-if="nowTokenList.length != 0">
					{{$t('index5')}}
				</view>
				<view class="list" v-if="nowTokenList.length != 0">
					<view class="listOne" v-for="(item, index) in nowTokenList" :key="index" @tap="clickNowCoin(item)">
						<image :src="item.logoURI == ''?'https://dapp.onionswap.info/logo.png':item.logoURI" mode=""></image>
						<view class="coinName">
							<view class="topCoin">
								{{item.name}}
							</view>
							<view class="bottomCoin">
								{{item.symbol}}
							</view>
						</view>
					</view>
				</view>
				<view class="titleList">
					Tokens
				</view>
				<view class="list">
					<view class="listOne" v-for="(item, index) in tokenList" :key="index" @tap="clickNowCoin(item)">
						<image :src="item.logoURI == ''?'https://dapp.onionswap.info/logo.png':item.logoURI" mode=""></image>
						<view class="coinName">
							<view class="topCoin">
								{{item.name}}
							</view>
							<view class="bottomCoin">
								{{item.symbol}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script scoped="true">
	export default {
		props: {
			text: String
		},
		data() {
			return {
				newAddress: '',
				tokenList: [
					{
						name: 'TBC',
						symbol: 'test_coin',
						address: '',
						chainId: 1,
						decimals: 6,
						balance: '',
						logoURI: 'https://dapp.onionswap.info/TBC.png',
					},
					{
						name: 'SATOSHI',
						symbol: 'SATOSHI',
						address: 'a2d772d61afeac6b719a74d87872b9bbe847aa21b41a9473db066eabcddd86f3',
						chainId: 1,
						decimals: 6,
						balance: '',
						logoURI: 'https://dapp.onionswap.info/SATOSHI.png',
					},
					{
						name: 'GrumpyCat',
						symbol: 'GrumpyCat',
						address: 'a74f08e9251cf9e87e6e1a4b39a7f1758bb8d4013f09edc59ad03e90beea783d',
						chainId: 1,
						decimals: 6,
						balance: '',
						logoURI: 'https://dapp.onionswap.info/GrumpyCat.png',
					}
				],
				nowTokenList: []
			};
		},
		created() {
			let newListToken = uni.getStorageSync('stoTokenList');
			if(newListToken == null || newListToken == '') {
				this.nowTokenList = []
			} else{
				this.nowTokenList.push(newListToken);
			}
		},
		methods: {
			clickClose() {
				this.$emit('clickClose', 0);
			},
			clickCloseInput() {
				this.newAddress = '';
			},
			clickNowCoin(val) {
				this.$emit('clickBackInfo',val)
			},
			getProCoinList(e) {
				this.newAddress = e.detail.value;
				uni.request({
					url: this.localApi+'getCoinInfo',
					method: 'POST',
					header: {
						"Content-Type": "application/json; charset=UTF-8"
					},
					data: {
						coinContract: e.detail.value
					},
					success: (res) => {
						if(res.data.success) {
							this.getCoinPng(e.detail.value,res.data.data.coinPNG)
						} else{
							this.getCoinPng(e.detail.value,null)
						}
					}
				});
			},
			getCoinPng(address, picUrl) {
				uni.request({
					url: this.urlApi + 'ft/info/contract/id/'+address,
					method: 'GET',
					header: {
						"Content-Type": "application/json; charset=UTF-8"
					},
					data: {
					},
					success: (res) => {
						if(res.data.ftContractId == null) {
							uni.showToast({
								title: '请输入正确的代币地址',
								icon: "none"
							})
						} else{
							let nowlist = {
								name: res.data.ftName,
								symbol: res.data.ftSymbol,
								address: res.data.ftContractId,
								chainId: 0,
								decimals: res.data.ftDecimal,
								balance: 0,
								logoURI: picUrl == null?res.data.ftIconUrl:picUrl
							}
							this.tokenList.push(nowlist)
							if(this.nowTokenList.length != 0) {
								this.nowTokenList.push(nowlist)
							}
							uni.setStorageSync('stoTokenList', nowlist);
						}
					}
				});
			}
		}
	};
</script>

<style lang="less" scoped>
	@media all and (min-width: 700px) and (max-width: 2880px){
		.mask {
			width: 1200rpx;
			height: 868rpx;
			border-radius: 20rpx;
			background-color: #fff;
			.title{
				display: flex;
				justify-content: space-between;
				background: linear-gradient( 90deg, #AF6EFF 0%, #8D60FF 100%);
				padding: 30rpx 28rpx;
				border-radius: 20rpx 20rpx 0 0;
				align-items: center;
				.left{
					width: 50rpx;
				}
				.center{
					font-family: Noto Sans SC, Noto Sans SC;
					font-weight: 500;
					font-size: 30rpx;
					color: #FFFFFF;
				}
				.right{
					image{
						width: 56rpx;
						height: 56rpx;
					}
				}
			}
			.coinListBox{
				padding: 28rpx;
				.inputBox{
					height: 84rpx;
					border-radius: 56px 56px 56px 56px;
					background: rgba(115,40,228,0.1);
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 0 28rpx;
					input{
						width: 80%;
						height: 100%;
					}
					image{
						width: 42rpx;
						height: 42rpx;
					}
				}
				.tokenList{
					margin-top: 40rpx;
					padding-left: 20rpx;
					overflow-y: scroll;
					height: 510rpx;
					.titleList{
						font-family: Noto Sans SC, Noto Sans SC;
						font-weight: 500;
						font-size: 28rpx;
						color: #161616;
					}
					.list{
						margin-top: 28rpx;
						.listOne{
							margin-bottom: 28rpx;
							display: flex;
							align-items: center;
							image{
								width: 70rpx;
								height: 70rpx;
								border-radius: 50%;
							}
							.coinName{
								margin-left: 20rpx;
								.topCoin{
									font-family: Noto Sans SC, Noto Sans SC;
									font-weight: 500;
									font-size: 30rpx;
									color: #525252;
								}
								.bottomCoin{
									font-family: Noto Sans SC, Noto Sans SC;
									font-weight: 500;
									font-size: 24rpx;
									color: #A8A8A8;
								}
							}
						}
					}
				}
			}
			
		}
	}
	@media all and (min-width: 320px) and (max-width: 700px){
		.mask {
			width: 610rpx;
			height: 818rpx;
			border-radius: 20rpx;
			background-color: #fff;
			.title{
				display: flex;
				justify-content: space-between;
				background: linear-gradient( 90deg, #AF6EFF 0%, #8D60FF 100%);
				padding: 30rpx 28rpx;
				border-radius: 20rpx 20rpx 0 0;
				align-items: center;
				.left{
					width: 50rpx;
				}
				.center{
					font-family: Noto Sans SC, Noto Sans SC;
					font-weight: 500;
					font-size: 30rpx;
					color: #FFFFFF;
				}
				.right{
					image{
						width: 56rpx;
						height: 56rpx;
					}
				}
			}
			.coinListBox{
				padding: 28rpx;
				.inputBox{
					height: 84rpx;
					border-radius: 56px 56px 56px 56px;
					background: rgba(115,40,228,0.1);
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 0 28rpx;
					input{
						width: 80%;
						height: 100%;
					}
					image{
						width: 42rpx;
						height: 42rpx;
					}
				}
				.tokenList{
					margin-top: 40rpx;
					padding-left: 20rpx;
					overflow-y: scroll;
					height: 510rpx;
					.titleList{
						font-family: Noto Sans SC, Noto Sans SC;
						font-weight: 500;
						font-size: 28rpx;
						color: #161616;
					}
					.list{
						margin-top: 28rpx;
						.listOne{
							margin-bottom: 28rpx;
							display: flex;
							align-items: center;
							image{
								width: 70rpx;
								height: 70rpx;
								border-radius: 50%;
							}
							.coinName{
								margin-left: 20rpx;
								.topCoin{
									font-family: Noto Sans SC, Noto Sans SC;
									font-weight: 500;
									font-size: 30rpx;
									color: #525252;
								}
								.bottomCoin{
									font-family: Noto Sans SC, Noto Sans SC;
									font-weight: 500;
									font-size: 24rpx;
									color: #A8A8A8;
								}
							}
						}
					}
				}
			}
			
		}
	}
	
</style>