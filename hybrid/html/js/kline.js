
var myChart;

// post请求封装
// function post(url,data) {
// 	let baseUrl='http://192.168.3.135:8080';
// 	return new Promise((resolve,reject)=>{
// 		axios({
// 			headers:{
// 				"Content-Type": "application/x-www-form-urlencoded",
// 			},
// 			method:'post',
// 			url:baseUrl+url,
// 			data:Qs.stringify( data || {})
// 		})
// 		.then(res=>{
// 			console.log(res)
// 			if(res.data.code==1){
// 				resolve(res.data)
// 			}else{
// 				reject()
// 				alertError('请求超时')
// 			}
// 		})
// 		.catch(err=>{
// 			alertError('请求超时')
// 		})
// 	})
// }
// 弹窗
function alertError(title) {
	document.addEventListener('plusready',function() {
		console.log('......')
	})
	try{
		plus.nativeUI.toast(title, {
			 icon:'/static/common/toast-error.png',
			 style:'inline',
			 verticalAlign:'top'
		});
	}catch(e){
		//TODO handle the exception
	}
}
var app = new Vue({
	el:'#app',
	data:{
		MA5:'',
		MA10:'',
		MA30:'',
		volMA5:'',
		volMA10:'',
		current:1,
		tabs:[
			{'label':'1分钟','value':1},
			{'label':'15分钟','value':2},
			{'label':'30分钟','value':3},
			{'label':'1小时','value':4},
			{'label':'4小时','value':5},
			{'label':'1天','value':6},
		],
		category:1,
		categoryList:[
			{'label':'深度','value':1},
			{'label':'成交','value':2},
			{'label':'简介','value':3},
		],
		txData:{},//交易数据统计
		buyList:[],
		sellList:[],
		dealHis:[],
		tokenInfo:{},
		page:1,
		
	},
	created() {
		this.getTxData()
		this.getDepth()
	},
	mounted() {
		myChart = echarts.init(document.getElementById('main'));
		this.draw()
		this.getKline()
	},
	methods:{
		// 返回上一页
		back(){
			uni.navigateBack()
		},
		// 获取24小时交易数据统计
		getTxData(){
			this.txData=txData;
		},
		// 获取k线数据,生成k线
		getKline(){
			var dataMA5 = this.calculateMA(5, data);
			var dataMA10 = this.calculateMA(10, data);
			var dataMA30 = this.calculateMA(30, data);
			var volumeMA5 = this.calculateMA(5, volumes);
			var volumeMA10 = this.calculateMA(10, volumes);
			myChart.setOption({
				xAxis: [
					{
						data: dates
					},
					{
						data: dates
					},
				],
				series: [
					{
						name: '日K',
						data: data
					},
					{
						name: 'MA5',
						data: dataMA5
					},
					{
						name: 'MA10',
						data: dataMA10
					},
					{
						name: 'MA30',
						data: dataMA30
					},
					{
						name: 'Volume',
						data: volumes
					},
					{
						name: 'VolumeMA5',
						data: volumeMA5
					},
					{
						name: 'VolumeMA10',
						data: volumeMA10
					},
				]
			})
		},
		// 列表条数不足补全
		addItem(list,type){
			// type: 1开头加，2末尾加
			list=list || [];
			let len=20-list.length;
			if(len>0){
				for(let i=0;i<len;i++){
					if(type==1){
						list.unshift({})
					}else{
						list.push({})
					}
				}
			}
			return list;
		},
		// 获取深度数据
		getDepth(){
			this.buyList=this.addItem(depthList().buyList || []);
			this.sellList=this.addItem(depthList().sellList || []);
		},
		// 获取成交记录
		getDealHis(){
			this.dealHis=dealHis();
		},
		// 获取项目简介信息
		getTokenInfo(){
			this.tokenInfo=tokenInfo;
		},
		
		// 切换tab
		switchTab(val){
			if(this.current==val) return;
			this.current=val;
			this.getKline()
		},
		// 切换类目
		switchCategory(val){
			if(this.category==val) return;
			this.category=val;
			if(this.category==1){
				this.getDepth()
			}else if(this.category==2){
				this.getDealHis()
			}else{
				this.getTokenInfo()
			}
		},
		// 截取数字字符串 保留precision小数
		formatterNum(value, precision) {
			// console.log(value)
			let reg = new RegExp('^\\d+(?:\\.\\d{0,' + precision + '})?')
			return value.toString().match(reg)
		},
		// 计算MA
		calculateMA(dayCount, data) {
			var result = [];
			for (var i = 0, len = data.length; i < len; i++) {
				if (i < dayCount) {
					result.push('-');
					continue;
				}
				var sum = 0;
				for (var j = 0; j < dayCount; j++) {
					sum += data[i - j][1];
				}
				// console.log(sum, dayCount)
				result.push((sum / dayCount).toFixed(2));
			}
			return result;
		},
		// 绘制(配置项)
		draw(){
			let that=this;
			var upColor = '#03ad91';
			var downColor = '#dd345b';
			var colorList = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074',
				'#546570', '#c4ccd3'
			];
			var labelFont = 'bold 12px Sans-serif';
			var option = {
				backgroundColor: '#0d1723',
				title: {
					show: false
				},
				legend: {
					show: false
				},
				visualMap: {
				            show: false,
				            seriesIndex: 4,
				            dimension: 2,
				            pieces: [{
				                value: 1,
				                color: downColor
				            }, {
				                value: -1,
				                color: upColor
				            }]
				        },
				grid: [{
						top: '5%',
						left: 20,
						right: 20,
						height: '70%'
					},
					{
						top: '80%',
						left: 20,
						right: 20,
						height: '16%'
					},
				],
				axisPointer: { //坐标轴指示器配置项
					link: {
						xAxisIndex: 'all'
					},
					label: {
						backgroundColor: '#0d1723',
						color: '#fff',
						borderColor: 'rgb(99, 117, 139)',
						borderWidth: 1,
						borderRadius: 2,
						fontSize: 10
					}
				},
				xAxis: [{
					type: 'category', //坐标轴类型。(value:数值轴，适用于连续数据。,category:类目轴，适用于离散的类目数据,time: 时间轴，适用于连续的时序数据,log:对数轴。适用于对数数据)
					data: [], //类目数据，在类目轴（type: 'category'）中有效。
					scale: true,
					boundaryGap: false, //坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
					axisLine: {
						show: false
					}, //坐标轴轴线相关设置
					axisTick: {
						show: false
					}, //坐标轴刻度相关设置。
					axisLabel: {
						show: false,
					}, //坐标轴刻度标签的相关设置。
					splitLine: {
						show: false,
						lineStyle: {
							color: 'rgba(255,255,255, 0.1)'
						}
					}, //坐标轴在 grid 区域中的分隔线。
					min: 'dataMin', //坐标轴刻度最小值。可以设置成特殊值 'dataMin'，此时取数据在该轴上的最小值作为最小刻度。
					max: 'dataMax', //坐标轴刻度最大值。可以设置成特殊值 'dataMax'，此时取数据在该轴上的最大值作为最大刻度。
					axisPointer: {
						label: {
							margin: 200
						}
					},
				}, {
					type: 'category',
					gridIndex: 1, //x 轴所在的 grid 的索引，默认位于第一个 grid。
					data: [], //类目数据，在类目轴（type: 'category'）中有效。
					scale: true,
					boundaryGap: false, //坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
					axisLine: {
						show: false,
						lineStyle: {
							color: 'rgba(255,255,255,1)',
							width: 1
						}
					}, //坐标轴轴线相关设置
					axisTick: {
						show: false
					}, //坐标轴刻度相关设置。
					axisLabel: { //坐标轴刻度标签的相关设置。
						show: true,
						margin: 6,
						fontSize: 10,
						color: 'rgba(99, 117, 139, 1.0)',
						formatter: function(value) {
							return echarts.format.formatTime('MM-dd', value);
						}
					},
					splitNumber: 20,
					splitLine: {
						show: false,
						lineStyle: {
							color: 'rgba(255,255,255, 0.1)'
						}
					}, //坐标轴在 grid 区域中的分隔线。
					min: 'dataMin', //坐标轴刻度最小值。可以设置成特殊值 'dataMin'，此时取数据在该轴上的最小值作为最小刻度。
					max: 'dataMax', //坐标轴刻度最大值。可以设置成特殊值 'dataMax'，此时取数据在该轴上的最大值作为最大刻度。
					// axisPointer: { show: true, type: 'none', label: { show: false }},
				}],
				yAxis: [{
					type: 'value', //坐标轴类型。(value:数值轴，适用于连续数据。,category:类目轴，适用于离散的类目数据,time: 时间轴，适用于连续的时序数据,log:对数轴。适用于对数数据)
					position: 'right', //y 轴的位置。'left','right'
					scale: true, //是否是脱离 0 值比例。设置成 true 后坐标刻度不会强制包含零刻度。在双数值轴的散点图中比较有用。(在设置 min 和 max 之后该配置项无效。)
					axisLine: {
						show: true
					}, //坐标轴轴线相关设置。
					axisTick: {
						show: true,
						inside:true
					}, //坐标轴刻度相关设置。
					axisLabel: { //坐标轴刻度标签的相关设置。
						show: true,
						color: 'rgba(99, 117, 139, 1.0)',
						inside: true,
						fontSize: 10,
						formatter: function(value) {
							return Number(value).toFixed(2)
						}
					},
					splitLine: {
						show: false,
						lineStyle: {
							color: 'rgba(255,255,255, 0.1)'
						}
					}, //坐标轴在 grid 区域中的分隔线。
				}, {
					type: 'value',
					position: 'right',
					scale: true,
					gridIndex: 1,
					axisLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					axisLabel: {
						show: false
					},
					splitLine: {
						show: false
					}
				}],
			
				animation: false, //是否开启动画。
				color: colorList,
				tooltip: {
					show: true, //是否显示提示框组件，包括提示框浮层和 axisPointer。
					trigger: 'axis', //触发类型。item,axis,none
					formatter(params){
						let tooltip = '';
						let time = '', open = 0, high = 0, low = 0, close = 0, amount = 0;
						for (var i = 0; i < params.length; i++) {
							if (params[i].seriesName === '日K') {
								time = params[i].name;
								open = params[i].data.length > 1 ? Number(that.formatterNum(params[i].data[1], 2)) : 0;
								close = params[i].data.length > 1 ? Number(that.formatterNum(params[i].data[2], 2)) : 0;
								low = params[i].data.length > 1 ? Number(that.formatterNum(params[i].data[3], 2)) : 0;
								high = params[i].data.length > 1 ? Number(that.formatterNum(params[i].data[4], 2)) : 0;
								amount = params[i].data.length > 1 ? Number(that.formatterNum(params[i].data[5], 2)) : 0;
								// console.log(time,open,close,low,high,amount)
								tooltip = '<div class="charts-tooltip">' +
									'<div class="charts-tooltip-row"><div class="ctr-label">' + '时间' + '</div><div class="ctr-value">' + time + '</div></div>' + 
									'<div class="charts-tooltip-row"><div class="ctr-label">' + '开' + '</div><div class="ctr-value">' + open + '</div></div>' + 
									'<div class="charts-tooltip-row"><div class="ctr-label">' + '高' + '</div><div class="ctr-value">' + high + '</div></div>' + 
									'<div class="charts-tooltip-row"><div class="ctr-label">' + '低' + '</div><div class="ctr-value">' + low + '</div></div>' + 
									'<div class="charts-tooltip-row"><div class="ctr-label">' + '收' + '</div><div class="ctr-value">' + close + '</div></div>' + 
									'<div class="charts-tooltip-row"><div class="ctr-label">' + '数量' + '</div><div class="ctr-value">' +amount + '</div></div></div>';
							}
							if (params[i].seriesName === 'MA5') {
								that.MA5 = params[i].data !== 'NAN' ? Number(that.formatterNum(params[i].data, 2)) : 0
							}
							if (params[i].seriesName === 'MA10') {
								that.MA10 = params[i].data !== 'NAN' ? Number(that.formatterNum(params[i].data, 2)) : 0
							}
							if (params[i].seriesName === 'MA30') {
								that.MA30 = params[i].data !== 'NAN' ? Number(that.formatterNum(params[i].data, 2)) : 0
							}
							if (params[i].seriesName === 'VolumeMA5') {
								that.volMA5 = params[i].data !== 'NAN' ? Number(that.formatterNum(params[i].data, 2)) : 0
							}
							if (params[i].seriesName === 'VolumeMA10') {
								that.volMA10 = params[i].data !== 'NAN' ? Number(that.formatterNum(params[i].data, 2)) : 0
							}
						}
						return tooltip;
					},
					triggerOn: 'click', //提示框触发的条件 'mousemove','click','mousemove|click','none'
					textStyle: {
						fontSize: 10
					}, //提示框浮层的文本样式
					backgroundColor: 'rgba(30,42,66,0.8);', //提示框浮层的背景颜色。
					borderColor: '#2f3a56', //提示框浮层的边框颜色。
					borderWidth:2,
					position: function(pos, params, el, elRect, size) { //提示框浮层的位置，默认不设置时位置会跟随鼠标的位置。
						var obj = {
							top: 20
						};
						obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 10;
						return obj;
					},
					axisPointer: { //坐标轴指示器配置项。
						label: {
							color: 'rgba(255,255,255,.87)',
							fontSize: 9,
							backgroundColor: '#020204',
							borderColor: "#9c9fa4",
							shadowBlur: 0,
							borderWidth: 0.5,
							padding: [4, 2, 3, 2],
						},
						animation: false,
						type: 'cross',
						lineStyle: {
							color: {
								type: 'linear',
								x: 0,
								y: 0,
								x2: 0,
								y2: 1,
								colorStops: [{
									offset: 0,
									color: 'rgba(30, 42, 66, 0.1)' // 0% 处的颜色
								}, {
									offset: 0.7,
									color: 'rgba(30, 42, 66,0.9)' // 100% 处的颜色
								}, {
									offset: 1,
									color: 'rgba(30, 42, 66,0.2)' // 100% 处的颜色
								}]
							},
							width: 10,
							shadowColor: 'rgba(30, 42, 66,0.7)',
							shadowBlur: 0,
							shadowOffsetY: 68,
						}
					}
				},
			
				dataZoom: [{ //用于区域缩放
					type: 'inside',
					xAxisIndex: [0, 1],
					realtime: false,
					start: 50,
					end: 100,
				}
				],
				series: [
					{
						type: 'candlestick',
						name: '日K',
						data: [],
						itemStyle: {
							color: upColor,
							color0: downColor,
							borderColor: upColor,
							borderColor0: downColor
						},
						markPoint: {
							symbol: 'rect',
							symbolSize: [-10, 0.5],
							symbolOffset: [5, 0],
							itemStyle: {
								color: 'rgba(255,255,255,.87)'
							},
							label: {
								color: 'rgba(255,255,255,.87)',
								offset: [10, 0],
								fontSize: 10,
								align: 'left',
								formatter: function(params) {
									return Number(params.value).toFixed(2)
								}
							},
							data: [{
									name: 'max',
									type: 'max',
									valueDim: 'highest'
								},
								{
									name: 'min',
									type: 'min',
									valueDim: 'lowest'
								}
							]
						},
					}, 
					{
						name: 'MA5',
						type: 'line',
						data: [],
						symbol: 'none',//去除圆点
						smooth: true,
						lineStyle: { normal: { opacity: 1, width: 1, color: "#eef4ba" } },
						z: 5
					}, 
					{
						name: 'MA10',
						type: 'line',
						data: [],
						symbol: 'none',//去除圆点
						smooth: true,
						lineStyle: { normal: { opacity: 1, width: 1, color: '#83c1c5' } },
						z: 4
					},
					{
						name: 'MA30',
						type: 'line',
						data: [],
						symbol: 'none',//去除圆点
						smooth: true,
						lineStyle: { normal: { opacity: 1, width: 1, color: '#b39cd8' } },
						z: 3
					},
					{
							name: 'Volume',
							type: 'bar',
							xAxisIndex: 1,
							yAxisIndex: 1,
							data: []
						},
						{
							name: 'VolumeMA5',
							type: 'line',
							xAxisIndex: 1,
							yAxisIndex: 1,
							data: [],
							symbol: 'none',//去除圆点
							smooth: true,
							lineStyle: { normal: { opacity: 1, width: 1, color: "#eef4ba" } },
							z: 5
						},
						{
							name: 'VolumeMA10',
							type: 'line',
							xAxisIndex: 1,
							yAxisIndex: 1,
							data: [],
							symbol: 'none',//去除圆点
							smooth: true,
							lineStyle: { normal: { opacity: 1, width: 1, color: '#83c1c5' } },
							z: 4
						},
				]
			};
			myChart.setOption(option);
			// 加载上一页数据
			myChart.on('datazoom',function(params){
				let num=params.batch[0]['start'];
				if(num==0){
					console.log('到最左边了')
				}
			})
			window.addEventListener('resize', () => { myChart.resize()})
		}
	}
})