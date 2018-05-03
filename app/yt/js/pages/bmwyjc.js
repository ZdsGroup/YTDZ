//当前显示的内容项目索引
var currentPid = 0;
//存储当前页面中所有图形对象
var yljc_charts = {};

mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		down: {
			callback: pulldownRefresh, //下拉，获取更多数据
			auto: true
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
var wacthTypes = [{
	value: 'dx',
	text: 'X轴位移'
}, {
	value: 'dy',
	text: 'Y轴位移'
}, {
	value: 'dh',
	text: 'H轴位移'
}, {
	value: 'd2',
	text: '二维位移长度'
}, {
	value: 'd3',
	text: '三维位移长度'
}]
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
	mui('.mui-input-group').on('tap', '.yttypepick ', function() {
		var dt = this;
		var picker = new mui.PopPicker();
		picker.setData(wacthTypes);
		picker.show(function(rs) {
			dt.innerHTML = rs[0].text;
			picker.dispose();
		});
	}, false);
	mui('.mui-input-group').on('tap', '.mui-btn ', function() {
		queryAnalysisData();
	});

};

var initDatePickParam = function() {
	var dt = null;
	var options = '';
	var startDt = '';
	var endDt = '';
	//同一地灾点,同类设备对比
	//获取今天当前时刻点日期
	startDt = getHourDateStr(-1);
	//获取昨天24小时前日期
	endDt = getHourDateStr(0);
	//当前设备最新数据,图和列表
	initDatePick('#deviceTypeStartDt', endDt, '#deviceTypeStartDt', endDt);
	initDatePick('#ytmcstartdt', startDt, '#ytmcenddt', endDt);
	initDatePick('#ytdmstartdt', startDt, '#ytdmenddt', endDt);

	initDatePick('#ytljstartdt', startDt, '#ytljenddt', endDt);

	initDatePick('#ytspstartdt', startDt, '#ytspenddt', endDt);
	initDatePick('#ytacspeedstartdt', startDt, '#ytacspeedenddt', endDt);
	initDatePick('#ytscastartdt', startDt, '#ytscaenddt', endDt);
	initDatePick('#ytvecstartdt', startDt, '#ytvecenddt', endDt);
	initDatePick('#deviceliststartdt', startDt, '#devicelistenddt', endDt);

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
	if(pId == 0) { //设备状态
		var html = template('jcsb-state-template', {
			feature: pFeature
		});
		document.getElementById("device-state").innerHTML = html;
	} else if(pId == 1) { //多站对比
		action = "tbmwys/echarts/device";
		param.quakeid = pFeature.quakeid;
		param.begin = mui("#deviceTypeStartDt")[0].innerHTML + ":00:00";
		mui.myMuiQuery(action, param, deviceTypeCompareSuccess, mui.myMuiQueryErr);
	} else if(pId == 2) { //单站对比
		action = "tbmwys/echarts/year";
		param.deviceid = pFeature.deviceid;
		param.begin = mui("#deviceDateStartDt")[0].innerHTML;
		param.end = mui("#deviceDateEndDt")[0].innerHTML;
		if(parseInt(param.begin) < parseInt(param.end)) {
			mui.myMuiQuery(action, param, deviceDateCompareSuccess, mui.myMuiQueryErr);
		} else {
			mui.myMuiQueryErr('时间选择错误');
		}
	} else if(pId == 3) { //位移变化
		action = "tbmwys/echarts/hour";
		param.deviceid = pFeature.deviceid;
		param.begin = mui("#ytmcstartdt")[0].innerHTML + ":00:00";
		param.end = mui("#ytmcenddt")[0].innerHTML + ":00:00";
		if(!compareDate(param.begin, param.end)) {
			mui.myMuiQuery(action, param, deviceMoveChangeCompareSuccess, mui.myMuiQueryErr);
		} else {
			mui.myMuiQueryErr('时间选择错误');
		}
	} else if(pId == 4) { //累计曲线图
		action = "tbmwys/echarts/hour";
		param.deviceid = pFeature.deviceid;
		param.begin = mui("#ytljstartdt")[0].innerHTML + ":00:00";
		param.end = mui("#ytljenddt")[0].innerHTML + ":00:00";
		if(!compareDate(param.begin, param.end)) {
			mui.myMuiQuery(action, param, deviceLJMoveChangeCompareSuccess, mui.myMuiQueryErr);
		} else {
			mui.myMuiQueryErr('时间选择错误');
		}
	} else if(pId == 5) { //断面曲线
		action = "tbmwys/echarts/dmqx";
		param.quakeid = pFeature.quakeid;
		param.begin = mui("#ytdmstartdt")[0].innerHTML + ":00:00";
		param.end = mui("#ytdmenddt")[0].innerHTML + ":00:00";
		if(!compareDate(param.begin, param.end)) {
			mui.myMuiQuery(action, param, deviceDMCompareSuccess, mui.myMuiQueryErr);
		} else {
			mui.myMuiQueryErr('时间选择错误');
		}
	} else if(pId == 6) { //速度图
		action = "tbmwys/echarts/hour";
		param.deviceid = pFeature.deviceid;
		param.begin = mui("#ytspstartdt")[0].innerHTML + ":00:00";
		param.end = mui("#ytspenddt")[0].innerHTML + ":00:00";
		if(!compareDate(param.begin, param.end)) {
			mui.myMuiQuery(action, param, deviceSpeedCompareSuccess, mui.myMuiQueryErr);
		} else {
			mui.myMuiQueryErr('时间选择错误');
		}
	} else if(pId == 7) { //加速度
		action = "tbmwys/echarts/hour";
		param.deviceid = pFeature.deviceid;
		param.begin = mui("#ytacspeedstartdt")[0].innerHTML + ":00:00";
		param.end = mui("#ytacspeedenddt")[0].innerHTML + ":00:00";
		if(!compareDate(param.begin, param.end)) {
			mui.myMuiQuery(action, param, deviceAcceleSpeedCompareSuccess, mui.myMuiQueryErr);
		} else {
			mui.myMuiQueryErr('时间选择错误');
		}
	} else if(pId == 8) { //散点图
		action = "tbmwys/echarts/hour";
		param.deviceid = pFeature.deviceid;
		param.begin = mui("#ytscastartdt")[0].innerHTML + ":00:00";
		param.end = mui("#ytscaenddt")[0].innerHTML + ":00:00";
		if(!compareDate(param.begin, param.end)) {
			mui.myMuiQuery(action, param, devicePointCompareSuccess, mui.myMuiQueryErr);
		} else {
			mui.myMuiQueryErr('时间选择错误');
		}
	} else if(pId == 9) { //平面矢量图
		action = "tbmwys/echarts/hour";
		param.deviceid = pFeature.deviceid;
		param.begin = mui("#ytvecstartdt")[0].innerHTML + ":00:00";
		param.end = mui("#ytvecenddt")[0].innerHTML + ":00:00";
		if(!compareDate(param.begin, param.end)) {
			mui.myMuiQuery(action, param, devicePlaneCompareSuccess, mui.myMuiQueryErr);
		} else {
			mui.myMuiQueryErr('时间选择错误');
		}
	} else if(pId == 10) { //数据列表
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
			top: 120,
			bottom: 30,
			left: 10,
			right: 10,
			containLabel: true
		},
		legend: {
			data: []
		},
		calculable: false,
		xAxis: [{
			type: 'category',
			data: ['X轴', 'Y轴', 'H轴', '二维', '三维']
		}],
		yAxis: [{
			type: 'value',
			splitArea: {
				show: true
			},
			name: '位移(mm)',
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
	mui.each(result.data, function(index, item) {
		legend.push(item.devicename);

		var devItem = {
			name: item.devicename,
			type: 'line',
			data: [item.dx, item.dy, item.dh, item.d2, item.d3],
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
	dtc.setOption(devicetypecompareOption);
}

//单设备多年对比图
var deviceDateCompareSuccess = function(result) {
	var type = mui('#yeartype')[0].innerHTML;
	type = selectWachType(type);
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
			name: '位移(mm)',
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
			data: item[type],
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

//位移变化
var deviceMoveChangeCompareSuccess = function(result) {
	var dtc = echarts.init(mui('#device-mc-monitor')[0]);
	var devicetypecompareOption = {
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		grid: {
			top: 60,
			bottom: 10,
			left: 20,
			right: 20,
			containLabel: true
		},
		legend: {
			data: ['X轴位移', 'Y轴位移', 'H轴位移', '二维位移长度', '三维位移长度']
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
			name: '长度(mm)',
			min: function(value) {
				return Math.ceil(value.min - Math.abs(value.min) * 0.1);
			},
			max: function(value) {
				return Math.ceil(value.max + Math.abs(value.max) * 0.1);
			}
		}],
		series: []
	}
	var xAxisData = [];
	var datas = [];
	var dxs = [];
	var dys = [];
	var dhs = [];
	var d2s = [];
	var d3s = [];
	var legend = [];
	var dxseries = {
		name: 'X轴位移',
		type: 'line',
		smooth: true,
		itemStyle: {
			normal: {
				label: {
					show: true
				}
			}
		}
	}
	var dyseries = {
		name: 'Y轴位移',
		type: 'line',
		smooth: true,
		itemStyle: {
			normal: {
				label: {
					show: true
				}
			}
		}
	}
	var dhseries = {
		name: 'H轴位移',
		type: 'line',
		smooth: true,
		itemStyle: {
			normal: {
				label: {
					show: true
				}
			}
		}
	}
	var d2series = {
		name: '二维位移长度',
		type: 'line',
		smooth: true,
		itemStyle: {
			normal: {
				label: {
					show: true
				}
			}
		}
	}
	var d3series = {
		name: '三维位移长度',
		type: 'line',
		smooth: true,
		itemStyle: {
			normal: {
				label: {
					show: true
				}
			}
		}
	}
	var series = [];
	series.push(dxseries);
	series.push(dyseries);
	series.push(dhseries);
	series.push(d2series);
	series.push(d3series);
	mui.each(result.data.tbmwyList, function(index, item) {
		dxs.push(item.dx);
		dys.push(item.dy);
		dhs.push(item.dh);
		d2s.push(item.d2);
		d3s.push(item.d3);
		xAxisData.push(item.datekey);
	});
	dxseries.data = dxs;
	dyseries.data = dys;
	dhseries.data = dhs;
	d2series.data = d2s;
	d3series.data = d3s;
	devicetypecompareOption.series = series;
	devicetypecompareOption.xAxis[0].data = xAxisData;
	dtc.setOption(devicetypecompareOption);
}

//累计曲线变化
var deviceLJMoveChangeCompareSuccess = function(result) {
	var dtc = echarts.init(mui('#device-lj-monitor')[0]);
	var devicetypecompareOption = {
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		grid: {
			top: 70,
			bottom: 10,
			left: 20,
			right: 20,
			containLabel: true
		},
		legend: {
			data: ['X轴累计位移', 'Y轴累计位移', 'H轴累计位移', '二维累计位移长度', '三维累计位移长度']
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
			name: '长度(mm)',
			min: function(value) {
				return Math.ceil(value.min - Math.abs(value.min) * 0.1);
			},
			max: function(value) {
				return Math.ceil(value.max + Math.abs(value.max) * 0.1);
			}
		}],
		series: []
	}
	var xAxisData = [];
	var datas = [];
	var dxs = [];
	var dys = [];
	var dhs = [];
	var d2s = [];
	var d3s = [];
	var legend = [];
	var dxseries = {
		name: 'X轴累计位移',
		type: 'line',
		smooth: true,
		itemStyle: {
			normal: {
				label: {
					show: true
				}
			}
		}
	}
	var dyseries = {
		name: 'Y轴累计位移',
		type: 'line',
		smooth: true,
		itemStyle: {
			normal: {
				label: {
					show: true
				}
			}
		}
	}
	var dhseries = {
		name: 'H轴累计位移',
		type: 'line',
		smooth: true,
		itemStyle: {
			normal: {
				label: {
					show: true
				}
			}
		}
	}
	var d2series = {
		name: '二维累计位移长度',
		type: 'line',
		smooth: true,
		itemStyle: {
			normal: {
				label: {
					show: true
				}
			}
		}
	}
	var d3series = {
		name: '三维累计位移长度',
		type: 'line',
		smooth: true,
		itemStyle: {
			normal: {
				label: {
					show: true
				}
			}
		}
	}
	var series = [];
	series.push(dxseries);
	series.push(dyseries);
	series.push(dhseries);
	series.push(d2series);
	series.push(d3series);
	mui.each(result.data.tbmwyList, function(index, item) {
		dxs.push(item.sx);
		dys.push(item.sy);
		dhs.push(item.sh);
		d2s.push(item.s2);
		d3s.push(item.s3);
		xAxisData.push(item.datekey);
	});
	dxseries.data = dxs;
	dyseries.data = dys;
	dhseries.data = dhs;
	d2series.data = d2s;
	d3series.data = d3s;
	devicetypecompareOption.series = series;
	devicetypecompareOption.xAxis[0].data = xAxisData;
	dtc.setOption(devicetypecompareOption);
}

//断面曲线
var deviceDMCompareSuccess = function(result) {
	var type = mui("#dmtype")[0].innerHTML;
	type = selectWachType(type);
	var dtc = echarts.init(mui('#device-dm-curve')[0]);
	var devicetypecompareOption = {
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		grid: {
			top: 120,
			bottom: 30,
			left: 10,
			right: 10,
			containLabel: true
		},
		legend: {
			data: []
		},
		calculable: false,
		xAxis: [{
			type: 'category',
		}],
		yAxis: [{
			type: 'value',
			splitArea: {
				show: true
			},
			name: '位移(mm)',
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
			data: item[type],
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

//速度图
var deviceSpeedCompareSuccess = function(result) {
	var dtc = echarts.init(mui('#device-speed-chart')[0]);
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
			left: 20,
			right: 20,
			containLabel: true
		},
		legend: {
			data: ['X轴速度', 'Y轴速度', 'H轴速度']
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
			name: '速度(mm/s)',
			min: function(value) {
				return Math.ceil(value.min - Math.abs(value.min) * 0.1);
			},
			max: function(value) {
				return Math.ceil(value.max + Math.abs(value.max) * 0.1);
			}
		}],
		series: []
	}
	var xAxisData = [];
	var datas = [];
	var dxs = [];
	var dys = [];
	var dhs = [];
	var legend = [];
	var dxseries = {
		name: 'X轴速度',
		type: 'line',
		smooth: true,
		itemStyle: {
			normal: {
				label: {
					show: true
				}
			}
		}
	}
	var dyseries = {
		name: 'Y轴速度',
		type: 'line',
		smooth: true,
		itemStyle: {
			normal: {
				label: {
					show: true
				}
			}
		}
	}
	var dhseries = {
		name: 'H轴速度',
		type: 'line',
		smooth: true,
		itemStyle: {
			normal: {
				label: {
					show: true
				}
			}
		}
	}

	var series = [];
	series.push(dxseries);
	series.push(dyseries);
	series.push(dhseries);
	mui.each(result.data.tbmwyList, function(index, item) {
		dxs.push(item.xs);
		dys.push(item.ys);
		dhs.push(item.hs);
		xAxisData.push(item.datekey);
	});
	dxseries.data = dxs;
	dyseries.data = dys;
	dhseries.data = dhs;
	devicetypecompareOption.series = series;
	devicetypecompareOption.xAxis[0].data = xAxisData;
	dtc.setOption(devicetypecompareOption);
}

//加速度图
var deviceAcceleSpeedCompareSuccess = function(result) {
	var dtc = echarts.init(mui('#device-velocity-chart')[0]);
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
			left: 25,
			right: 20,
			containLabel: true
		},
		legend: {
			data: ['X轴加速度', 'Y轴加速度', 'H轴加速度']
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
			name: '加速度(mm/s²)',
			min: function(value) {
				return Math.ceil(value.min - Math.abs(value.min) * 0.1);
			},
			max: function(value) {
				return Math.ceil(value.max + Math.abs(value.max) * 0.1);
			}
		}],
		series: []
	}
	var xAxisData = [];
	var datas = [];
	var dxs = [];
	var dys = [];
	var dhs = [];
	var legend = [];
	var dxseries = {
		name: 'X轴加速度',
		type: 'line',
		smooth: true,
		itemStyle: {
			normal: {
				label: {
					show: true
				}
			}
		}
	}
	var dyseries = {
		name: 'Y轴加速度',
		type: 'line',
		smooth: true,
		itemStyle: {
			normal: {
				label: {
					show: true
				}
			}
		}
	}
	var dhseries = {
		name: 'H轴加速度',
		type: 'line',
		smooth: true,
		itemStyle: {
			normal: {
				label: {
					show: true
				}
			}
		}
	}

	var series = [];
	series.push(dxseries);
	series.push(dyseries);
	series.push(dhseries);
	mui.each(result.data.tbmwyList, function(index, item) {
		dxs.push(item.xxs);
		dys.push(item.yys);
		dhs.push(item.hhs);
		xAxisData.push(item.datekey);
	});
	dxseries.data = dxs;
	dyseries.data = dys;
	dhseries.data = dhs;
	devicetypecompareOption.series = series;
	devicetypecompareOption.xAxis[0].data = xAxisData;
	dtc.setOption(devicetypecompareOption);
}

//散点图
var devicePointCompareSuccess = function(result) {
	var dtc = echarts.init(mui('#device-scatter-chart')[0]);
	var vectors = result.data.vectors;
	var startPoint = [vectors[0]];
	var endPoint = [vectors[vectors.length - 1]];
	var historyPoint = vectors;
	historyPoint.shift();
	historyPoint.pop();
	var devicetypecompareOption = {
		color: [
			'#6DC576', '#8DA8C9', '#E37072'
		],
		legend: {
			y: 'top',
			data: ['起始点', '历史点', '结束点']
		},
		tooltip: {
			trigger: 'none',
			axisPointer: {
				type: 'cross'
			}
		},
		grid: {
			top: 60,
			bottom: 10,
			left: 20,
			right: 40,
			containLabel: true
		},
		xAxis: {
			type: 'value',
			name: 'Y(mm)',
			nameRotate: 270,
			splitLine: {
				show: false
			}
		},
		yAxis: {
			type: 'value',
			name: 'X(mm)',
			splitLine: {
				show: false
			}
		},
		series: [{
				name: '起始点',
				type: 'scatter',
				data: startPoint
			},
			{
				name: '历史点',
				type: 'scatter',
				data: historyPoint
			},
			{
				name: '结束点',
				type: 'scatter',
				data: endPoint
			}
		]
	}
	dtc.setOption(devicetypecompareOption);
}

//平面矢量图
var devicePlaneCompareSuccess = function(result) {
	var dtc = echarts.init(mui('#device-vector-chart')[0]);
	var vectors = result.data.points;
	var startPoint = [vectors[0]];
	var endPoint = [vectors[vectors.length - 1]];
	var historyPoint = vectors;
	var links = historyPoint.map(function(item, i) {
		return {
			source: i,
			target: i + 1
		};
	});
	links.pop();
	var devicetypecompareOption = {
		color: [
			'#8DA8C9', '#8DA8C9', '#6DC576', '#E37072'
		],
		legend: {
			y: 'top',
			data: ['起始点', '历史点', '结束点']
		},
		tooltip: {
			trigger: 'none',
			axisPointer: {
				type: 'cross'
			}
		},
		grid: {
			top: 60,
			bottom: 10,
			left: 10,
			right: 40,
			containLabel: true
		},
		xAxis: {
			type: 'value',
			name: '坐标Y(mm)',
			nameRotate: 270,
			splitLine: {
				show: false
			},
			min: function(value) {
				return value.min - (value.max-value.min)/5;
			}
		},
		yAxis: {
			type: 'value',
			name: '坐标X(mm)',
			splitLine: {
				show: false
			},
			min: function(value) {
				return value.min - (value.max-value.min)/5;
			}
		},
		series: [{
				name: '历史点',
				type: 'scatter',
				data: historyPoint
			},
			{
				type: 'graph',
				layout: 'none',
				coordinateSystem: 'cartesian2d',
				symbolSize: 0,
				label: {
					normal: {
						show: true
					}
				},
				edgeSymbol: ['circle', 'arrow'],
				edgeSymbolSize: [2, 8],
				data: historyPoint,
				links: links,
				lineStyle: {
					normal: {
						color: '#8DA8C9'
					}
				}
			},
			{
				name: '起始点',
				type: 'scatter',
				data: startPoint
			},
			{
				name: '结束点',
				type: 'scatter',
				data: endPoint
			}
		]
	}
	dtc.setOption(devicetypecompareOption);
}

//列表刷新展示
var pageno = mui.myMuiQueryBaseInfo.pageStartIndex;

function getDeviceListQueryParam() {
	var listParam = {};
	listParam.deviceid = pFeature.deviceid;
	listParam.begin = mui("#deviceliststartdt")[0].innerHTML + ":00:00";
	listParam.end = mui("#devicelistenddt")[0].innerHTML + ":00:00";
	return listParam;
}

function pulldownRefresh() {
	pageno = mui.myMuiQueryBaseInfo.pageStartIndex;
	var queryParam = getDeviceListQueryParam();
	queryParam.pageno = pageno;
	var action = "tbmwys";
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
	var action = "tbmwys";
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

function selectWachType(type) {
	var value = 'dx';
	mui.each(wacthTypes, function(index, item) {
		if(item.text == type) {
			value = item.value;
			return value;
		}
	})
	return value;
}