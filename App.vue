<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			// uni.removeStorageSync('walletAddress');
			console.log('App Hide')
			// if(window.Turing) {
			// 	window.Turing.disconnect();
			// 	this.$store.commit('setWallet', '');
			// 	uni.setStorageSync('walletAddress','');
			// }
		}
	}
</script>

<style>
	/*每个页面公共css */
	.swal-title{
		font-family: Noto Sans, Noto Sans;
		font-weight: 600;
		font-size: 42rpx;
		color: #161616;
	}
	.swal-text{
		font-family: Noto Sans SC, Noto Sans SC;
		font-weight: 400;
		font-size: 25rpx;
		color: #333333;
	}
	.swal-footer{
		display: flex;
		justify-content: center;
	}
	.swal-button{
		width: 554rpx;
		height: 84rpx;
		text-align: center;
		background: linear-gradient( 270deg, #6652D9 0%, #E283E7 50%, #F4CDCD 100%);
		border-radius: 42rpx;
		font-family: Noto Sans SC, Noto Sans SC;
		font-weight: 500;
		font-size: 25rpx;
		color: #FFFFFF;
		border: none;
		margin-top: 30rpx;
	}
</style>
