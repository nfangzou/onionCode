import App from './App'

import lang from "./lang/index.js"
import VueI18n from 'vue-i18n'
import VConsole from 'vconsole';

import store from './store'
Vue.use(VueI18n)
// test
// const urlApi = "https://tbcdev.org/v1/tbc/main/";
// const network = "testnet";

// mainnet
const urlApi = "https://turingwallet.xyz/v1/tbc/main/";
const network = "mainnet";

const localApi = "https://www.neww.site/v2/";
const localApiV3 = "https://www.neww.site/v3/";
const localApiV4 = "https://www.neww.site/v4/";

// test
// const localApiV4 = "https://www.dappport.xyz:444/v4/";
const localApiV1 = "https://www.neww.site/";

const vConsole = new VConsole({ theme: 'dark' });
Vue.prototype.localApi = localApi;
Vue.prototype.localApiV1 = localApiV1;
Vue.prototype.localApiV3 = localApiV3;
Vue.prototype.localApiV4 = localApiV4;
Vue.prototype.urlApi = urlApi;
Vue.prototype.network = network;
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'

const i18n = new VueI18n({
	locale: uni.getStorageSync('language') || 'en-US', // 初始化中文
	messages: lang,
	silentFallbackWarn: true
});

const app = new Vue({
	store,
	i18n,
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif