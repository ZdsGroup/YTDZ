//当前显示的内容项目索引
var currentPid = 0;
//存储当前页面中所有图形对象
var yljc_charts = {};

mui.init({
	swipeBack: false //启用右滑关闭功能
});
mui('.mui-scroll-wrapper').scroll();

var initApp = function() {
	this.initEvent();
	//this.initChart();
};
mui.ready(initApp);
//设备属性信息
var pFeature = null;
//页面标题
var plabel = "";
//子页面ID号
var pId = "";
mui.plusReady(function() {
	//页面传值
	var self = plus.webview.currentWebview();
	pId = self.paramId;
	pFeature = self.feature;
	plabel = self.label;
	this.switchJcAnalyContent(pId, pFeature);
});

var initEvent = function() {
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
	var cs = mui('.mui-control-content');
	cs[currentPid].classList.remove('mui-active');
	currentPid = pageId;
	cs[currentPid].classList.add('mui-active');
	mui('#title')[0].innerHTML = plabel;
	var action = "";
	var param = {};
	if(pageId == 0) {
		var html = template('jcsb-state-template', {
			feature: pFeature
		});
		document.getElementById("device-state").innerHTML = html;
	}else if(pageId == 1) {
		action = "echarts/rains/date";
		param.deviceid = pFeature.deviceid;
		mui.myMuiQuery(action,param,deviceTypeCompareSuccess,mui.myMuiQueryErr)
	}else if(pageId == 2) {
		
	}else if(pageId == 3) {
		
	}else if(pageId == 4) {
		
	}
	//刷新统计图
//	this.refreshChart(yljc_charts['menu_' + currentPid]);
}
//同类型多设备对比图
var deviceTypeCompareSuccess = function(result){
	var dtc = echarts.init(mui('#device-type-compare')[0]);
	result.data.series[0].data = [10,12,13,5,1,3,0,10,0,0,0,0];
	dtc.setOption(result.data);

}
//刷新统计图
var refreshChart = function(charts) {
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
				left: 10,
				right: 10,
				containLabel: true
			},
			legend: {
				data: ['设备1', '设备2', '设备3']
			},
			calculable: false,
			xAxis: [{
				type: 'category',
				data: ['2017-10-1 08', '2017-10-1 09', '2017-10-1 10', '2017-10-1 11', '2017-10-1 12', '2017-10-1 13', '2017-10-1 14', '2017-10-1 15']
			}],
			yAxis: [{
				type: 'value',
				splitArea: {
					show: true
				},
				name: '雨量(mm)',
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
				data: [10, 10, 12, 14, 20, 25, 26, 27],
				smooth:true,
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
				data: [7, 10, 13, 17, 20, 23, 23, 25],
				 smooth:true,
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
				data: [3, 5, 10, 12, 14, 15, 20, 21],
				smooth:true,
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
				left: 10,
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
				name: '雨量(mm)',
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
				data: [10, 15, 25, 30, 45, 50, 55, 60, 65, 72, 81, 96],
				smooth:true,
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
				data: [12, 15, 35, 40, 45, 50, 55, 63, 65, 72, 81, 86],
				smooth:true,
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
				data: [20, 25, 35, 40, 45, 46, 50, 60, 75, 82, 91, 96],
				smooth:true,
				itemStyle: {
					normal: {
						label: {
							show: true
						}
					}
				}
			}]
		};
	} else if(chartID == 'device-rain-monitor') {
		chartType = "bar";
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
				data: ['小时雨量']
			},
			calculable: false,
			xAxis: [{
				type: 'category',
				data: ['2017-10-1 08', '2017-10-1 09', '2017-10-1 10', '2017-10-1 11', '2017-10-1 12', '2017-10-1 13', '2017-10-1 14', '2017-10-1 15']
			}],
			yAxis: [{
				type: 'value',
				splitArea: {
					show: true
				},
				name: '雨量(mm)',
			}],
			series: [{
					name: '小时雨量',
					type: chartType,
					data: [3, 13, 9, 7, 6, 9, 10, 11],
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

	//雨量折线图
	var drm = echarts.init(mui('#device-rain-monitor')[0]);
	drm.setOption(getOption('device-rain-monitor'));

	//用于统计图刷新重绘
	yljc_charts['menu_1'] = [dtc, ddc];
	yljc_charts['menu_3'] = [drm];
};