//当前显示的内容项目索引
var currentPid = 0;
//存储当前页面中所有图形对象
var bmwy_charts = {};
//侧滑容器父节点
var offCanvasWrapper = null;
var initEvent = function() {
	var me = this;

	//初始化图片轮播
	var sliderPics = mui("#bmwy-slider-pictures");
	sliderPics.slider({
		interval: 4000
	});

	//初始滚动化容器对象
	offCanvasWrapper = mui('#offCanvasWrapper');

	//侧滑选择器
	mui('.mui-table-view').on('tap', 'li', function(evt) {
		var cs = mui('.mui-control-content');
		cs[currentPid].classList.remove('mui-active');
		currentPid = evt.target.value;
		cs[currentPid].classList.add('mui-active');

		//关闭侧滑面板
		offCanvasWrapper.offCanvas('close');
		//刷新统计图
		me.refreshChart(bmwy_charts['menu_' + currentPid]);
		//切花菜单项目内容自动置顶
		mui('#muiscrollid').scroll().scrollTo(0, 0);
	});

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
		chartOption = {
			tooltip: {
				trigger: 'none',
				axisPointer: {
					type: 'cross'
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
				data: ['设备1', '设备2', '设备3', '设备4']
			},
			toolbox: {
				show: false,
				feature: {
					mark: {
						show: true
					},
					dataView: {
						show: true,
						readOnly: false
					},
					magicType: {
						show: true,
						type: ['line', 'bar']
					},
					restore: {
						show: true
					},
					saveAsImage: {
						show: true
					}
				}
			},
			calculable: false,
			xAxis: [{
				type: 'category',
				data: ['DX', 'DY', 'DH', '2D']
			}],
			yAxis: [{
				type: 'value',
				splitArea: {
					show: true
				},
				name: '距离(mm)'
			}],
			series: [{
				name: '设备1',
				type: chartType,
				smooth: true,
				data: [1, 2, 1, 2],
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
				smooth: true,
				data: [1, 1, 2, 1],
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
				smooth: true,
				data: [0, 2, 1, 3],
				itemStyle: {
					normal: {
						label: {
							show: true
						}
					}
				}
			}, {
				name: '设备4',
				type: chartType,
				smooth: true,
				data: [2, 1, 1, 2],
				itemStyle: {
					normal: {
						label: {
							show: true
						}
					}
				}
			}, ]
		};
	} else if(chartID == 'device-date-compare') {
		chartOption = {
			legend: {
				data: ['2014', '2015', '2016', '2017']
			},
			tooltip: {
				trigger: 'none',
				axisPointer: {
					type: 'cross'
				}
			},
			grid: {
				top: 50,
				bottom: 10,
				left: 20,
				right: 20,
				containLabel: true
			},
			toolbox: {
				show: false,
				feature: {
					mark: {
						show: true
					},
					dataView: {
						show: true,
						readOnly: false
					},
					magicType: {
						show: true,
						type: ['line', 'bar']
					},
					restore: {
						show: true
					},
					saveAsImage: {
						show: true
					}
				}
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
				name: '距离(mm)'
			}],
			series: [{
				name: '2014',
				type: chartType,
				smooth: true,
				data: [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
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
				smooth: true,
				data: [3, 4, 5, 2, 4, 2, 3, 2, 2, 2, 1, 2],
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
				smooth: true,
				data: [3, 6, 7, 8, 4, 2, 3, 2, 2, 2, 1, 2],
				itemStyle: {
					normal: {
						label: {
							show: true
						}
					}
				}
			}, {
				name: '设备4',
				type: chartType,
				smooth: true,
				data: [3, 3, 2, 4, 4, 2, 3, 2, 2, 2, 1, 2],
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
		chartOption = {
			tooltip: {
				trigger: 'none',
				axisPointer: {
					type: 'cross'
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
				data: ['X走势图', 'Y走势图', 'H走势图']
			},
			toolbox: {
				show: false,
				feature: {
					mark: {
						show: true
					},
					dataView: {
						show: true,
						readOnly: false
					},
					magicType: {
						show: true,
						type: ['line', 'bar']
					},
					restore: {
						show: true
					},
					saveAsImage: {
						show: true
					}
				}
			},
			calculable: false,
			xAxis: [{
				type: 'category',
				data: ['2017-10-1', '2017-10-5', '2017-10-10', '2017-10-15', '2017-10-20', '2017-10-25', '2017-10-30', '2017-11-5', '2017-11-10', '2017-11-15', '2017-11-20', '2017-11-25']
			}],
			yAxis: [{
				type: 'value',
				splitArea: {
					show: true
				},
				name: '单位(m)'
			}],
			series: [{
				name: 'X走势图',
				type: chartType,
				data: [5, 4, 6, 7, 6, 5, 6, 5, 7, 6, 4, 6],
				itemStyle: {
					normal: {
						label: {
							show: true
						}
					}
				}
			}, {
				name: 'Y走势图',
				smooth: true,
				type: chartType,
				data: [3, 3, 2, 4, 4, 2, 3, 2, 2, 2, 1, 2],
				itemStyle: {
					normal: {
						label: {
							show: true
						}
					}
				}
			}, {
				name: 'H走势图',
				smooth: true,
				type: chartType,
				data: [8, 9, 4, 1, 2, 3, 6, 2, 4, 7, 9, 4],
				itemStyle: {
					normal: {
						label: {
							show: true
						}
					}
				}
			}]
		};
	} else if(chartID == 'device-section-curve') {
		chartOption = {
			tooltip: {
				trigger: 'none',
				axisPointer: {
					type: 'cross'
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
				data: ['监测数据1', '监测数据2']
			},
			toolbox: {
				show: false,
				feature: {
					mark: {
						show: true
					},
					dataView: {
						show: true,
						readOnly: false
					},
					magicType: {
						show: true,
						type: ['line', 'bar']
					},
					restore: {
						show: true
					},
					saveAsImage: {
						show: true
					}
				}
			},
			calculable: false,
			xAxis: [{
				type: 'category',
				data: ['2017-10-1', '2017-10-5', '2017-10-10', '2017-10-15', '2017-10-20', '2017-10-25', '2017-10-30', '2017-11-5', '2017-11-10', '2017-11-15', '2017-11-20', '2017-11-25']
			}],
			yAxis: [{
				type: 'value',
				splitArea: {
					show: true
				},
				name: '距离(mm)'
			}],
			series: [{
				name: '监测数据1',
				type: chartType,
				data: [5, 4, 6, 7, 6, 5, 6, 5, 7, 6, 4, 6],
				itemStyle: {
					normal: {
						label: {
							show: true
						}
					}
				}
			}, {
				name: '监测数据2',
				smooth: true,
				type: chartType,
				data: [3, 3, 2, 4, 4, 2, 3, 2, 2, 2, 1, 2],
				itemStyle: {
					normal: {
						label: {
							show: true
						}
					}
				}
			}]
		};
	} else if(chartID == "device-speed-chart") {
		chartOption = {
			tooltip: {
				trigger: 'none',
				axisPointer: {
					type: 'cross'
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
			toolbox: {
				show: false,
				feature: {
					mark: {
						show: true
					},
					dataView: {
						show: true,
						readOnly: false
					},
					magicType: {
						show: true,
						type: ['line', 'bar']
					},
					restore: {
						show: true
					},
					saveAsImage: {
						show: true
					}
				}
			},
			calculable: false,
			xAxis: [{
				type: 'category',
				data: ['2015', '2016', '2017']
			}],
			yAxis: [{
				type: 'value',
				splitArea: {
					show: true
				},
				name: '速度(mm/day)'
			}],
			series: [{
				name: 'X轴速度',
				type: chartType,
				smooth: true,
				data: [1, 2, 1, 2],
				itemStyle: {
					normal: {
						label: {
							show: true
						}
					}
				}
			}, {
				name: 'Y轴速度',
				type: chartType,
				smooth: true,
				data: [1, 1, 2, 1],
				itemStyle: {
					normal: {
						label: {
							show: true
						}
					}
				}
			}, {
				name: 'H轴速度',
				type: chartType,
				smooth: true,
				data: [0, 2, 1, 3],
				itemStyle: {
					normal: {
						label: {
							show: true
						}
					}
				}
			}]
		};
	} else if(chartID == "device-velocity-chart") {
		chartOption = {
			tooltip: {
				trigger: 'none',
				axisPointer: {
					type: 'cross'
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
				data: ['X轴加速度', 'Y轴加速度', 'H轴加速度']
			},
			toolbox: {
				show: false,
				feature: {
					mark: {
						show: true
					},
					dataView: {
						show: true,
						readOnly: false
					},
					magicType: {
						show: true,
						type: ['line', 'bar']
					},
					restore: {
						show: true
					},
					saveAsImage: {
						show: true
					}
				}
			},
			calculable: false,
			xAxis: [{
				type: 'category',
				data: ['2015', '2016', '2017']
			}],
			yAxis: [{
				type: 'value',
				splitArea: {
					show: true
				},
				name: '加速度(mm/day²)'
			}],
			series: [{
				name: 'X轴加速度',
				type: chartType,
				smooth: true,
				data: [1, 2, 1, 2],
				itemStyle: {
					normal: {
						label: {
							show: true
						}
					}
				}
			}, {
				name: 'Y轴加速度',
				type: chartType,
				smooth: true,
				data: [1, 1, 2, 1],
				itemStyle: {
					normal: {
						label: {
							show: true
						}
					}
				}
			}, {
				name: 'H轴加速度',
				type: chartType,
				smooth: true,
				data: [0, 2, 1, 3],
				itemStyle: {
					normal: {
						label: {
							show: true
						}
					}
				}
			}]
		};
	} else if(chartID == "device-scatter-chart") {
		//起始点
		var startPoint = [
			[5.5, -12.3]
		];

		//结束点
		var endPoint = [
			[-9.5, -8.5]
		];

		//历史点(不含首尾点)
		var historyPoint = [
			[-0.5, -8.5],
			[-1.5, -6.5],
			[-4.5, -9.5],
			[-8.5, -7.5],
			[9.5, -8.5],
			[-6.5, 8.5],
			[0.5, 8.5],
			[3.5, -1.5],
			[5.5, -7.5],
			[-9.5, -0.9],
			[-1.8, -4.8],
			[-9.2, -4.3],
			[6.7, 5.4],
			[3.2, -3.9],
			[-2.7, -7.8],
			[7.8, 1.5]
		];

		chartOption = {
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
				name: '坐标Y(mm)',
				nameRotate: 270,
				splitLine: {
					show: false
				}
			},
			yAxis: {
				type: 'value',
				name: '坐标X(mm)',
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
	} else if(chartID == "device-vector-chart") {
		//起始点
		var startPoint = [
			[5.5, -12.3]
		];

		//结束点
		var endPoint = [
			[-9.5, 7.5]
		];

		//历史点(含首尾点)
		var historyPoint = [
			[5.5, -12.3],
			[9.5, -6.5],
			[-4.5, -9.5],
			[-8.5, -7.5],
			[9.5, -8.5],
			[-6.5, 8.5],
			[0.5, 8.5],
			[3.5, -1.5],
			[5.5, -7.5],
			[-9.5, -0.9],
			[-1.8, -4.8],
			[-9.2, -4.3],
			[6.7, 5.4],
			[3.2, -3.9],
			[-2.7, -7.8],
			[7.8, 1.5],
			[-9.5, 7.5]
		];

		var links = historyPoint.map(function(item, i) {
			return {
				source: i,
				target: i + 1
			};
		});
		links.pop();

		chartOption = {
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
				left: 20,
				right: 40,
				containLabel: true
			},
			xAxis: {
				type: 'value',
				name: '坐标Y(mm)',
				nameRotate: 270,
				splitLine: {
					show: false
				}
			},
			yAxis: {
				type: 'value',
				name: '坐标X(mm)',
				splitLine: {
					show: false
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

	//位移变化图
	var dom = echarts.init(mui('#device-offset-monitor')[0]);
	dom.setOption(getOption('device-offset-monitor'));

	//断面曲线图
	var dsc = echarts.init(mui('#device-section-curve')[0]);
	dsc.setOption(getOption('device-section-curve'));

	//速度图
	var dsc0 = echarts.init(mui('#device-speed-chart')[0]);
	dsc0.setOption(getOption('device-speed-chart'));

	//加速度图
	var dvc = echarts.init(mui('#device-velocity-chart')[0]);
	dvc.setOption(getOption('device-velocity-chart'));

	//散点图
	var dsc1 = echarts.init(mui('#device-scatter-chart')[0]);
	dsc1.setOption(getOption('device-scatter-chart'));

	//平面矢量图
	var dvc0 = echarts.init(mui('#device-vector-chart')[0]);
	dvc0.setOption(getOption('device-vector-chart'));

	//用于统计图刷新重绘
	bmwy_charts['menu_1'] = [dtc, ddc];
	bmwy_charts['menu_3'] = [dom];
	bmwy_charts['menu_4'] = [dsc];
	bmwy_charts['menu_5'] = [dsc0];
	bmwy_charts['menu_6'] = [dvc];
	bmwy_charts['menu_7'] = [dsc1];
	bmwy_charts['menu_8'] = [dvc0];
};