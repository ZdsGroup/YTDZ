//当前显示的内容项目索引
var currentPid = 0;
//存储当前页面中所有图形对象
var yljc_charts = {};
//侧滑容器父节点
var offCanvasWrapper = null;
var initEvent = function() {
	var me = this;

	//初始化图片轮播
	var sliderPics = mui("#yljc-slider-pictures");
	sliderPics.slider({
		interval: 4000
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

//切换面板内容,其中pageId-内容ID, pageFeature-地图选中的监测设备对象,用于动态获取数据
var switchJcAnalyContent = function(pageId, pageFeature) {
	//初始滚动化容器对象
	/*offCanvasWrapper = mui('#offCanvasWrapper');*/
	
	var cs = mui('.mui-control-content');
	cs[currentPid].classList.remove('mui-active');
	currentPid = pageId;
	cs[currentPid].classList.add('mui-active');

	//关闭侧滑面板
	/*offCanvasWrapper.offCanvas('close');*/

	//切花菜单项目内容自动置顶
	mui('#muiscrollid').scroll().scrollTo(0, 0);

	//刷新统计图
	this.refreshChart(yljc_charts['menu_' + currentPid]);
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
	} else if(chartID == 'device-rain-monitor') {
		chartOption = {
			color: [
				'#FF0000', '#0000FF', '#FFFF00'
			],
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
				data: ['红色警戒', '蓝色警戒', '黄色警戒']
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
				name: '红色警戒',
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
				name: '蓝色警戒',
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
				name: '黄色警戒',
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