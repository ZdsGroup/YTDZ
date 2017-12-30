//当前显示的内容项目索引
var currentPid = 0;
//存储当前页面中所有图形对象
var lfjc_charts = {};
//侧滑容器父节点
var offCanvasWrapper = null;

//设备属性信息
var pFeature = null;
//页面标题
var plabel = "";
//子页面ID号
var pId = "";

mui.init({
	swipeBack: false //启用右滑关闭功能
});
mui('.mui-scroll-wrapper').scroll();

var initApp = function() {
	this.initEvent();
	this.initChart();
};
mui.ready(initApp);

mui.plusReady(function() {
	//页面传值

	//页面传值
	var self = plus.webview.currentWebview();
	pId = self.paramId;
	pFeature = self.feature;
	plabel = self.label;
	this.switchJcAnalyContent(pId, pFeature);
});

var initEvent = function() {

	//初始化图片轮播
	var sliderPics = mui("#slider-pictures");
	sliderPics.slider({
		interval: 4000
	});

	var me = this;

	//时间选择器
	mui('.mui-input-group').on('tap', '.ytdatepick', function() {　
		var dt = this;　　　　　　　
		var optionsJson = dt.getAttribute('data-options') || '{}';
		var options = JSON.parse(optionsJson);
		var picker = new mui.DtPicker(options);
		picker.show(function(rs) {
			dt.innerText = rs.text;
			picker.dispose();
		});
	}, false);
};

//切换面板内容,其中pageId-内容ID, pageFeature-地图选中的监测设备对象,用于动态获取数据
var switchJcAnalyContent = function(pageId, pageFeature) {
	//初始滚动化容器对象
	/*offCanvasWrapper = mui('#offCanvasWrapper');*/

	var cs = mui('.mui-control-content');
	cs[currentPid].classList.remove('mui-active');
	currentPid = pageId;
	cs[currentPid].classList.add('mui-active');

	mui('#title')[0].innerHTML = plabel;
	if(pageId == 0) {
		var html = template('jcsb-state-template', {
			feature: pFeature
		});
		document.getElementById("device-state").innerHTML = html;
	} else if(pageId == 1) {

	} else if(pageId == 2) {

	} else if(pageId == 3) {

	} else if(pageId == 4) {

	}

	//切花菜单项目内容自动置顶
	//mui('#muiscrollid').scroll().scrollTo(0, 0);

	//刷新统计图
	this.refreshChart(lfjc_charts['menu_' + currentPid]);
}

var refreshChart = function(charts) {
	//刷新统计图
	if(charts && charts.length > 0) {
		var cl = charts.length;
		for(var i = 0; i < cl; i++) {
			charts[i].resize();
		}
	}
}

var getOption = function(chartID) {
	var chartOption = null;
	var chartType = 'line';
	if(chartID == "device-type-compare") {
		chartType = "line";
		chartOption = {
			tooltip: {
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			grid: {
				top: 50,
				bottom: 10,
				left: 20,
				right: 10,
				containLabel: true
			},
			legend: {
				data: ['设备1', '设备2', '设备3']
			},
			calculable: false,
			xAxis: [{
				type: 'category',
				data: ['2017-10-1', '2017-10-2', '2017-10-3', '2017-10-4', '2017-10-5', '2017-10-6', '2017-10-7', '2017-10-8']
			}],
			yAxis: [{
				type: 'value',
				splitArea: {
					show: true
				},
				name: '裂缝长度(mm)',
				min: function(value) {
					return value.min - value.min*0.01;
				},
				max:function(value) {
					return value.max + value.max*0.01;
				}
			}],
			series: [{
				name: '设备1',
				type: chartType,
				data: [10, 10, 10.4, 10.3, 10.2, 10.2, 10.2, 10.1],
				itemStyle: {
					normal: {
						label: {
							show: true
						}
					}
				}
			}, {
				name: '设备2',
				type: chartType,
				data: [7, 7.1, 7.2, 7.1, 7.1, 7.1, 7.1, 7.0],
				itemStyle: {
					normal: {
						label: {
							show: true
						}
					}
				}
			}, {
				name: '设备3',
				type: chartType,
				data: [3, 3, 3.3, 3.2, 3.3, 3.3, 3.3, 3.2],
				itemStyle: {
					normal: {
						label: {
							show: true
						}
					}
				}
			}]
		};
	} else if(chartID == 'device-date-compare') {
		chartType = "line"
		chartOption = {
			legend: {
				data: ['2014', '2015', '2016', '2017']
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			grid: {
				top: 50,
				bottom: 10,
				left: 20,
				right: 10,
				containLabel: true
			},
			calculable: false,
			xAxis: [{
				type: 'category',
				data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
			}],
			yAxis: [{
				type: 'value',
				splitArea: {
					show: true
				},
				name: '裂缝长度(mm)',
				min: function(value) {
					return value.min - value.min*0.01;
				},
				max:function(value) {
					return value.max + value.max*0.01;
				}
			}],
			series: [{
				name: '2014',
				type: chartType,
				data: [10, 10.2, 10.2, 10.1, 10.2, 10.2, 10.2, 10.2, 10.1, 10.2, 10.2, 10.2],
				itemStyle: {
					normal: {
						label: {
							show: true
						}
					}
				}
			}, {
				name: '2015',
				type: chartType,
				data: [10.1, 10.1, 10.2, 10.1, 10.1, 10.2, 10.2, 10.1, 10.1, 10.2, 10.2, 10.2],
				itemStyle: {
					normal: {
						label: {
							show: true
						}
					}
				}
			}, {
				name: '2016',
				type: chartType,
				data: [10.2, 10, 10.2, 10.1, 10, 10.2, 10.2, 10.1, 10, 10.1, 10.2, 10.2],
				itemStyle: {
					normal: {
						label: {
							show: true
						}
					}
				}
			}]
		};
	} else if(chartID == 'device-offset-monitor') {
		chartType = "line";
		chartOption = {
			color: [
				'#387FFF'
			],
			tooltip: {
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			grid: {
				top: 50,
				bottom: 10,
				left: 20,
				right: 20,
				containLabel: true
			},
			legend: {
				data: ['变化过程']
			},
			calculable: false,
			xAxis: [{
				type: 'category',
				data: ['2017-10-1', '2017-10-2', '2017-10-3', '2017-10-4', '2017-10-5', '2017-10-6', '2017-10-7', '2017-10-8']
			}],
			yAxis: [{
				type: 'value',
				splitArea: {
					show: true
				},
				name: '裂缝长度(mm)',
				min: function(value) {
					return value.min - value.min*0.01;
				},
				max:function(value) {
					return value.max + value.max*0.01;
				}
			}],
			series: [{
					name: '变化过程',
					type: chartType,
					data: [10.2, 10, 10.2, 10.1, 10, 10.2, 10.2, 10.1, 10, 10.1, 10.2, 10.2],
					itemStyle: {
						normal: {
							label: {
								show: true
							}
						}
					},
					markLine: {
						silent: true,
						symbol: 'circle',
						data: [{
							lineStyle: {
								normal: {
									color: '#FF0000'
								}
							},
							label: {
								normal: {
									position: 'middle',
									formatter: '红色警戒'
								}
							},
							yAxis: 20
						}, {
							lineStyle: {
								normal: {
									color: '#0000FF'
								}
							},
							label: {
								normal: {

									position: 'middle',
									formatter: '蓝色预警'
								}
							},
							yAxis: 15
						}, {
							lineStyle: {
								normal: {
									color: '#FFFF00'
								}
							},
							label: {
								normal: {
									position: 'middle',
									formatter: '黄色预警'
								}
							},
							yAxis: 12
						}]
					}
				}

			]
		};
	}
	return chartOption;
};

var initChart = function() {
	//同类型多设备对比图
	var dtc = echarts.init(mui('#device-type-compare')[0]);
	dtc.setOption(getOption('device-type-compare'));

	//单设备多时段对比图
	var ddc = echarts.init(mui('#device-date-compare')[0]);
	ddc.setOption(getOption('device-date-compare'));

	//变化过程线
	var dom = echarts.init(mui('#device-offset-monitor')[0]);
	dom.setOption(getOption('device-offset-monitor'));

	lfjc_charts['menu_1'] = [dtc, ddc];
	lfjc_charts['menu_3'] = [dom];
};