
// 假设 dates、data、volumes 等变量在 mock.js 里已定义
window.onload = function() {
  var myChart = echarts.init(document.getElementById('main'));
  
  var upColor = '#03ad91';
  var downColor = '#dd345b';
  var option = {
    backgroundColor: '#fff',
    grid: [
      { top: '5%', left: 20, right: 20, height: '88%' },
      { top: '85%', left: 20, right: 20, height: '10%' }
    ],
    xAxis: [
      {
        type: 'category',
        data: dates,
        scale: true,
        boundaryGap: ['8%', '10%'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
        min: 'dataMin',
        max: 'dataMax',
      },
      {
        type: 'category',
        gridIndex: 1,
        data: dates,
        scale: true,
        boundaryGap: ['0','0'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          show: true,
          margin: 6,
          fontSize: 10,
          color: 'rgba(99, 117, 139, 1.0)',
          formatter: function(value) {
            return echarts.format.formatTime('MM-dd', value);
          }
        },
        splitNumber: 20,
        splitLine: { show: false },
        min: 'dataMin',
        max: 'dataMax',
      }
    ],
    yAxis: [
      {
        type: 'value',
        position: 'right',
        scale: true,
        axisLine: { show: false }, // 隐藏Y轴竖线
        axisTick: { show: true, inside:true },
        axisLabel: {
          show: false, // 隐藏自带Y轴价格
          color: 'rgba(99, 117, 139, 1.0)',
          inside: true,
          fontSize: 10,
          formatter: function(value) { return Number(value).toFixed(2) }
        },
        splitLine: { show: false }
      },
      {
        type: 'value',
        position: 'right',
        scale: true,
        gridIndex: 1,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false }
      }
    ],
    animation: false,
    tooltip: {
      show: true,
      trigger: 'axis',
      formatter(params) {
        let tooltip = '';
        let time = '', open = 0, high = 0, low = 0, close = 0, amount = 0;
        for (var i = 0; i < params.length; i++) {
          if (params[i].seriesName === '日K') {
            time = params[i].name;
            open = params[i].data.length > 1 ? params[i].data[1] : 0;
            close = params[i].data.length > 1 ? params[i].data[2] : 0;
            low = params[i].data.length > 1 ? params[i].data[3] : 0;
            high = params[i].data.length > 1 ? params[i].data[4] : 0;
            amount = params[i].data.length > 1 ? params[i].data[5] : 0;
            tooltip = '<div class="charts-tooltip">' +
              '<div class="charts-tooltip-row"><div class="ctr-label">时间</div><div class="ctr-value">' + time + '</div></div>' +
              '<div class="charts-tooltip-row"><div class="ctr-label">开</div><div class="ctr-value">' + open + '</div></div>' +
              '<div class="charts-tooltip-row"><div class="ctr-label">高</div><div class="ctr-value">' + high + '</div></div>' +
              '<div class="charts-tooltip-row"><div class="ctr-label">低</div><div class="ctr-value">' + low + '</div></div>' +
              '<div class="charts-tooltip-row"><div class="ctr-label">收</div><div class="ctr-value">' + close + '</div></div>' +
              '<div class="charts-tooltip-row"><div class="ctr-label">数量</div><div class="ctr-value">' + amount + '</div></div></div>';
          }
        }
        return tooltip;
      },
      triggerOn: 'click',
      textStyle: { fontSize: 10 },
      backgroundColor: 'rgba(30,42,66,0.8);',
      borderColor: '#2f3a56',
      borderWidth:2,
      position: function(pos, params, el, elRect, size) {
        var obj = { top: 20 };
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 10;
        return obj;
      },
      axisPointer: {
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
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(30, 42, 66, 0.1)' },
              { offset: 0.7, color: 'rgba(30, 42, 66,0.9)' },
              { offset: 1, color: 'rgba(30, 42, 66,0.2)' }
            ]
          },
          width: 10,
          shadowColor: 'rgba(30, 42, 66,0.7)',
          shadowBlur: 0,
          shadowOffsetY: 68,
        }
      }
    },
    dataZoom: [{
      type: 'inside',
      xAxisIndex: [0, 1],
      realtime: false,
      start: 50,
      end: 100,
    }],
    series: [
      {
        type: 'candlestick',
        name: '日K',
        data: data,
        barWidth: 8,
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
          itemStyle: { color: 'rgba(255,255,255,.87)' },
          label: {
            color: 'rgba(255,255,255,.87)',
            offset: [10, 0],
            fontSize: 10,
            align: 'left',
            formatter: function(params) { return Number(params.value).toFixed(2) }
          },
          data: [
            { name: 'max', type: 'max', valueDim: 'highest' },
            { name: 'min', type: 'min', valueDim: 'lowest' }
          ]
        },
      }
    ]
  };
  myChart.setOption(option);

  // 计算当前可视区间的最高价和最低价
  function getVisibleRange(data, start, end) {
    let min = Infinity, max = -Infinity;
    for (let i = start; i <= end; i++) {
      if (!data[i]) continue;
      min = Math.min(min, data[i][2]); // low
      max = Math.max(max, data[i][3]); // high
    }
    return { min, max };
  }

  // 渲染自定义Y轴，支持高亮真实最高/最低
  function renderCustomYAxis(min, max, steps = 5, range) {
    const yAxisDiv = document.getElementById('custom-yaxis');
    yAxisDiv.innerHTML = '';
    const { min: realMin, max: realMax } = getVisibleRange(data, range.startIndex, range.endIndex);
    for (let i = 0; i <= steps; i++) {
      const val = ((max - min) * (1 - i / steps) + min).toFixed(0);
      const tick = document.createElement('div');
      tick.style.textAlign = 'right';
      tick.style.width = '100%';
      // 高亮真实最高/最低
      if (Math.abs(val - realMax) < 0.01) {
        tick.style.color = '#ff4d4f'; // 红色
        tick.style.fontWeight = 'bold';
        tick.innerText = val + ' (最高)';
      } else if (Math.abs(val - realMin) < 0.01) {
        tick.style.color = '#1890ff'; // 蓝色
        tick.style.fontWeight = 'bold';
        tick.innerText = val + ' (最低)';
      } else {
        tick.innerText = val;
      }
      yAxisDiv.appendChild(tick);
    }
  }

  // 获取当前可视区间索引
  function getCurrentRange() {
    const opt = myChart.getOption();
    const dataZoom = opt.dataZoom && opt.dataZoom[0];
    const total = data.length;
    let startIndex = 0, endIndex = total - 1;
    if (dataZoom) {
      startIndex = Math.floor(total * (dataZoom.start / 100));
      endIndex = Math.floor(total * (dataZoom.end / 100));
    }
    return { startIndex, endIndex };
  }

  // 联动刷新Y轴
  function updateCustomYAxis() {
    const range = getCurrentRange();
    let { min, max } = getVisibleRange(data, range.startIndex, range.endIndex);
    min = min + 50;
    max = max + 50;
    renderCustomYAxis(min, max, 5, range);
  }

  // 初始渲染
  updateCustomYAxis();

  // 监听缩放、拖动等事件
  myChart.on('datazoom', updateCustomYAxis);
  myChart.on('rendered', updateCustomYAxis);

  window.addEventListener('resize', function() {
    myChart.resize();
    updateCustomYAxis();
  });
};