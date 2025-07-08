<template>
	<view class="content">
		<back ref="child" text="" :text="myAddress" :type="3" :classType="true" subheading="true" @getMsg="getMsg"></back>
		<view style="display: flex;justify-content: center;color: #000;margin-top: 100rpx;">
			{{$t('addP8')}}....
		</view>
		
		
		
		
		<w-loading text="" mask="true" click="false" ref="loading"></w-loading>
	</view>
</template>

<script>
	import back from "@/component/back/index.vue";
	import wLoading from "@/component/w-loading/w-loading.vue";
	import {mapState,mapMutations,mapGetters} from 'vuex'
	export default{
		components:{
			back,wLoading
		},
		data() {
			return {
				myAddress: '',
			}
		},
		computed: {
			...mapGetters(['getWallet','getCoin', 'setWallet'])
		},
		onReady() {
			this.Init();
		},
		watch: {
			getWallet(val, oldVal){
				this.myAddress = uni.getStorageSync('walletAddress');
			}
		},
		methods: {
			Init() {
				if (uni.getStorageSync('walletAddress') == undefined || uni.getStorageSync('walletAddress') == '') {
					console.log("Please connect wallet!")
				} else {
					this.myAddress = uni.getStorageSync('walletAddress');
				}
			},
		}
	}
</script>

<style lang="less" scoped>
	.content{
		width: 100%;
		height: 1700rpx;
		min-height: 100vh;
		box-sizing: border-box;
		position: relative;
		padding-top: 120upx;
	}
</style>