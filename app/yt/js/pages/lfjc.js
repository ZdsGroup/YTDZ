//当前显示的内容项目索引
var currentPid = 0;
//存储当前页面中所有图形对象
var bmwy_charts = {};
//侧滑容器父节点
var offCanvasWrapper = null;
var initEvent = function() {

	//初始化图片轮播
	var sliderPics = mui("#slider-pictures");
	sliderPics.slider({
		interval: 5000
	});

	var me = this;

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
				name: '2017',
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
	} else if(chartID == "device-speed-compare") {
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
				name: '速度(mm/y)'
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

	bmwy_charts['menu_1'] = [dtc];
	bmwy_charts['menu_2'] = [ddc];
	bmwy_charts['menu_4'] = [dom];
};