//当前显示的内容项目索引
var currentPid = 0;
//存储当前页面中所有图形对象
var yljc_charts = {};

mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		down: {
			callback: pulldownRefresh //下拉，获取更多数据
		},
		up: {
			contentrefresh: '正在加载...',
			callback: pullupRefresh //上拉， 刷新最新数据
		}
	}
});
mui('.mui-scroll-wrapper').scroll();

var initApp = function() {
	this.initEvent();
	initDatePickParam();
};
mui.ready(initApp);
//设备属性信息
var pFeature = null;
//页面标题
var plabel = "";
//子页面ID号
var pId = 0;
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
			dt.innerHTML = rs.text;
			options.value = rs.text;
			dt.setAttribute('data-options', JSON.stringify(options));
			picker.dispose();
		});
	}, false);
	mui('.mui-input-group').on('tap', '.mui-btn ', function() {
		queryAnalysisData();
	})
};

var initDatePickParam = function() {
	var dt = null;
	var options = '';
	var startDt = '';
	var endDt = '';
	//同一地灾点,同类设备对比
	//获取今天当前小时日期
	startDt = getHourDateStr(-1);
	//获取昨天24小时日期
	endDt = getHourDateStr(0);
	//当前设备最新数据,图和列表
	initDatePick('#deviceTypeStartDt', startDt, '#deviceTypeEndDt', endDt);
	initDatePick('#deviceRainStartDt', startDt, '#deviceRainEndDt', endDt);
	initDatePick('#deviceListStartDt', startDt, '#deviceListEndDt', endDt);

    initDatePick('#ytljstartdt', startDt, '#ytljenddt', endDt);

	//当前设备,不同年份时间
	startDt = getYearStr(-1);
	endDt = getYearStr(0);
	initDatePick('#deviceDateStartDt', startDt, '#deviceDateEndDt', endDt);
}

var initDatePick = function(startId, startDt, endId, endDt) {
	dt = mui(startId)[0];
	dt.innerHTML = startDt;
	options = JSON.parse(dt.getAttribute('data-options') || '{}');
	options.value = startDt;
	dt.setAttribute('data-options', JSON.stringify(options));

	dt = mui(endId)[0];
	dt.innerHTML = endDt;
	options = JSON.parse(dt.getAttribute('data-options') || '{}');
	options.value = endDt;
	dt.setAttribute('data-options', JSON.stringify(options));
}

//切换面板内容,其中pageId-内容ID, pageFeature-地图选中的监测设备对象,用于动态获取数据
function switchJcAnalyContent() {
	var cs = mui('.mui-control-content');
	cs[currentPid].classList.remove('mui-active');
	currentPid = pId;
	cs[currentPid].classList.add('mui-active');
	mui('#title')[0].innerHTML = plabel;
	queryAnalysisData();
}

function queryAnalysisData() {
	var action = "";
	var param = {};
	if(pId == 0) {
		var html = template('jcsb-state-template', {
			feature: pFeature
		});
		document.getElementById("device-state").innerHTML = html;
	} else if(pId == 1) {
		action = "rains/echarts/device";
		param.quakeid = pFeature.quakeid;
		param.begin = mui("#deviceTypeStartDt")[0].innerHTML + ":00:00";
		param.end = mui("#deviceTypeEndDt")[0].innerHTML + ":00:00";
		if(!compareDate(param.begin, param.end)) {
			mui.myMuiQuery(action, param, deviceTypeCompareSuccess, mui.myMuiQueryErr);
		} else {
			mui.myMuiQueryErr('时间选择错误');
		}

	} else if(pId == 2) {
		action = "rains/echarts/year";
		param.deviceid = pFeature.deviceid;
		param.begin = mui("#deviceDateStartDt")[0].innerHTML;
		param.end = mui("#deviceDateEndDt")[0].innerHTML;
		if(parseInt(param.begin) < parseInt(param.end)) {
			mui.myMuiQuery(action, param, deviceDateCompareSuccess, mui.myMuiQueryErr);
		} else {
			mui.myMuiQueryErr('时间选择错误');
		}
	} else if(pId == 3) {
		action = "rains/echarts/hour";
		param.deviceid = pFeature.deviceid;
		param.begin = mui("#deviceRainStartDt")[0].innerHTML + ":00:00";
		param.end = mui("#deviceRainEndDt")[0].innerHTML + ":00:00";
		if(!compareDate(param.begin, param.end)) {
			mui.myMuiQuery(action, param, deviceRainCompareSuccess, mui.myMuiQueryErr);
		} else {
			mui.myMuiQueryErr('时间选择错误');
		}
	}else if(pId == 4) {
		action = "rains/echarts/hour";
		param.deviceid = pFeature.deviceid;
		param.begin = mui("#ytljstartdt")[0].innerHTML + ":00:00";
		param.end = mui("#ytljenddt")[0].innerHTML + ":00:00";
		if(!compareDate(param.begin, param.end)) {
			mui.myMuiQuery(action, param, deviceLeiJiCompareSuccess, mui.myMuiQueryErr);
		} else {
			mui.myMuiQueryErr('时间选择错误');
		}
	}else if(pId == 5) {
		pulldownRefresh();
	}
}
//同类型多设备对比图
var deviceTypeCompareSuccess = function(result) {
	var dtc = echarts.init(mui('#device-type-compare')[0]);
	var devicetypecompareOption = {
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		grid: {
			top: 50,
			bottom: 10,
			left: 30,
			right: 10,
			containLabel: true
		},
		legend: {
			data: []
		},
		calculable: false,
		xAxis: [{
			type: 'category',
			data: []
		}],
		yAxis: [{
			type: 'value',
			splitArea: {
				show: true
			},
			name: '累计雨量(mm)',
		    min: function(value) {
				return Math.ceil(value.min - Math.abs(value.min) * 0.1);
			},
			max: function(value) {
				return Math.ceil(value.max + Math.abs(value.max) * 0.1);
			}
		}],
		series: []
	};

	var series = [];
	var legend = [];
	mui.each(result.data.dataList, function(index, item) {
		legend.push(item.devicename);
		var devItem = {
			name: item.devicename,
			type: 'line',
			data: item.rainVal,
			smooth: true,
			itemStyle: {
				normal: {
					label: {
						show: true
					}
				}
			}
		};
		series.push(devItem);
	});
	devicetypecompareOption.series = series;
	devicetypecompareOption.legend.data = legend;
	devicetypecompareOption.xAxis[0].data = result.data.hourVal;
	dtc.setOption(devicetypecompareOption);
}

//单设备多年对比图
var deviceDateCompareSuccess = function(result) {
	var dtc = echarts.init(mui('#device-date-compare')[0]);
	var devicetypecompareOption = {
		legend: {
			data: []
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
				return Math.ceil(value.min - Math.abs(value.min) * 0.1);
			},
			max: function(value) {
				return Math.ceil(value.max + Math.abs(value.max) * 0.1);
			}
		}],
		series: []
	}

	var series = [];
	var legend = [];
	mui.each(result.data, function(index, item) {
		legend.push(item.year);
		var devItem = {
			name: item.year,
			type: 'line',
			data: item.rainVal,
			smooth: true,
			itemStyle: {
				normal: {
					label: {
						show: true
					}
				}
			}
		}
		series.push(devItem);
	});
	devicetypecompareOption.series = series;
	devicetypecompareOption.legend.data = legend;
	dtc.setOption(devicetypecompareOption);
}

//变化过程
var deviceRainCompareSuccess = function(result) {
	var dtc = echarts.init(mui('#device-rain-monitor')[0]);
//	result.data.redvalue = result.data.redvalue == null ? 0 :result.data.redvalue;
//	result.data.orangevalue = result.data.orangevalue == null ? 0 :result.data.orangevalue;
//	result.data.yellowvalue = result.data.yellowvalue == null ? 0 :result.data.yellowvalue;
//	result.data.bluevalue = result.data.bluevalue == null ? 0 :result.data.bluevalue;
	var devicetypecompareOption = {
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
			data: []
		}],
		yAxis: [{
			type: 'value',
			splitArea: {
				show: true
			},
			name: '雨量(mm)',
			min: function(value) {
				return Math.ceil(value.min - Math.abs(value.min) * 0.1);
			},
			max: function(value) {
				return Math.ceil(value.max + Math.abs(value.max) * 0.1);
			}
		}],
		series: [
//		{
//				name: '小时雨量',
//				type: 'bar',
//				data: [],
//				itemStyle: {
//					normal: {
//						label: {
//							show: true
//						}
//					}
//				}
//				,
//				markLine: {
//					silent: true,
//					symbol: 'circle',
//					data: [{
//						lineStyle: {
//							normal: {
//								color: '#FF0000'
//							}
//						},
//						label: {
//							normal: {
//								position: 'middle',
//								formatter: '红色警戒'
//							}
//						},
//						yAxis: result.data.redvalue
//					},{
//						lineStyle: {
//							normal: {
//								color: '#FFA500'
//							}
//						},
//						label: {
//							normal: {
//								position: 'middle',
//								formatter: '橙色警戒'
//							}
//						},
//						yAxis: result.data.orangevalue
//					},  {
//						lineStyle: {
//							normal: {
//								color: '#FFFF00'
//							}
//						},
//						label: {
//							normal: {
//								position: 'middle',
//								formatter: '黄色预警'
//							}
//						},
//						yAxis: result.data.yellowvalue
//					},{
//						lineStyle: {
//							normal: {
//								color: '#0000FF'
//							}
//						},
//						label: {
//							normal: {
//
//								position: 'middle',
//								formatter: '蓝色预警'
//							}
//						},
//						yAxis: result.data.bluevalue
//					}]
//				}
//			},{
//				name: '累计雨量',
//				type: 'line',
//				data: [],
//				itemStyle: {
//					normal: {
//						label: {
//							show: true
//						}
//					}
//				}	
//			}

		]
	}
	var s1series = {	
				name: '小时雨量',
				type: 'bar',
				data: [],
				itemStyle: {
					normal: {
						label: {
							show: true
						}
					}
				}
           }
		var s2series = {	
				name: '累计雨量',
				type: 'line',
				data: [],
				itemStyle: {
					normal: {
						label: {
							show: true
						}
					}
				}
           }
		var series = [];
	series.push(s1series);
	//series.push(s2series);
	var xAxisData = [];
	var s1datas = [];
	//var s2datas = [];
	mui.each(result.data.rainList, function(index, item) {
		xAxisData.push(item.datekey);
		s1datas.push(item.v1);
	//	s2datas.push(item.s1);
	});
	s1series.data = s1datas;
//	s2series.data = s2datas;
	devicetypecompareOption.series = series;
	devicetypecompareOption.xAxis[0].data = xAxisData;
	dtc.setOption(devicetypecompareOption);
}

//累计曲线
var deviceLeiJiCompareSuccess = function(result) {
	var dtc = echarts.init(mui('#device-rain-leiji')[0]);
	var devicetypecompareOption = {
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
			data: ['累计雨量']
		},
		calculable: false,
		xAxis: [{
			type: 'category',
			data: []
		}],
		yAxis: [{
			type: 'value',
			splitArea: {
				show: true
			},
			name: '雨量(mm)',
			min: function(value) {
				return Math.ceil(value.min - Math.abs(value.min) * 0.1);
			},
			max: function(value) {
				return Math.ceil(value.max + Math.abs(value.max) * 0.1);
			}
		}],
		series: [
		]
	}
	
		var s2series = {	
				name: '累计雨量',
				type: 'line',
				data: [],
				itemStyle: {
					normal: {
						label: {
							show: true
						}
					}
				}
           }
		var series = [];
	series.push(s2series);
	var xAxisData = [];
	var s2datas = [];
	mui.each(result.data.rainList, function(index, item) {
		xAxisData.push(item.datekey);
		s2datas.push(item.s1);
	});
	s2series.data = s2datas;
	devicetypecompareOption.series = series;
	devicetypecompareOption.xAxis[0].data = xAxisData;
	dtc.setOption(devicetypecompareOption);
}


//雨量列表刷新展示
var pageno = mui.myMuiQueryBaseInfo.pageStartIndex;

function getDeviceListQueryParam() {
	var listParam = {};
	listParam.deviceid = pFeature.deviceid;
	listParam.begin = mui("#deviceListStartDt")[0].innerHTML + ":00:00";
	listParam.end = mui("#deviceListEndDt")[0].innerHTML + ":00:00";
	return listParam;
}

function pulldownRefresh() {
	pageno = mui.myMuiQueryBaseInfo.pageStartIndex;
	var queryParam = getDeviceListQueryParam();
	queryParam.pageno = pageno;
	var action = "rains";
	if(!compareDate(queryParam.begin, queryParam.end)) {
		mui.myMuiQuery(action, queryParam,
			pullDownSuccess,
			falult
		)
	} else {
		mui.myMuiQueryErr('时间选择错误');
	}
}
/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
	var queryParam = getDeviceListQueryParam();
	queryParam.pageno = pageno;
	var action = "rains";
	if(!compareDate(queryParam.begin, queryParam.end)) {
		mui.myMuiQuery(action, queryParam,
			pullUpSuccess,
			falult
		)
	} else {
		mui.myMuiQueryErr('时间选择错误');
	}
}

function pullUpSuccess(result) {
	if(result.code == 0) {
		var data = result.data;
		var rows = data.rows;
		var html = template('ul-li-template', {
			list: rows
		});
		document.getElementById("ullist").innerHTML = document.getElementById("ullist").innerHTML + html;
		pageno = data.page + 1;
		if((data.page + 1) * data.size >= data.total) {
			//没有更多数据
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		} else {
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
		}

	}
}

function pullDownSuccess(result) {
	if(result.code == 0) {
		var data = result.data;
		var rows = data.rows;
		var html = template('ul-li-template', {
			list: rows
		});
		document.getElementById("ullist").innerHTML = html;
		pageno = data.page + 1;
		if((data.page + 1) * data.size >= data.total) {
			//没有更多数据
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(true);
		} else {
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
		}
	}
}

function falult(message) {
	document.getElementById("ullist").innerHTML = '';
	mui.showMsg('查询失败');
	//异常处理；
}