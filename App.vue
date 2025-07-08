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
	page{
		background-color: #F5F9FF;
	}
</style>
