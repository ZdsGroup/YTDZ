var myMap = null;
//地图上显示地灾对象图层	
var dzMarkersLayerGroup = new L.layerGroup();
var dzQueryResults = null;
//底图上显示监测设备对象图层
var jcMarkersLayerGroup = new L.layerGroup();
var jcQueryResults = null;
var warnBounds = null;
var maxZoomShow = 17;
var footerHeight = 101;
var topNavHeight = 25; //手机顶部状态栏高度
var picListPageSize = 3;
var scroller = null;
var jcsbMaxZoomShow = 17;
var warnInfoIsShow = false;
var userId = 1;
var localMarker = null;
var kmlLayer = null;
//当前选择的地图对象，地灾点or监测设备
var selectType = null;
//保存当前选择的地灾点
var currentDzd = null;
//保存当前选择的监测设备
var currentSb = null;

mui.init({
	gestureConfig: {
		tap: true, //默认为true
		doubletap: false, //默认为false
		longtap: false, //默认为false
		swipe: true, //默认为true
		drag: true, //默认为true
		hold: false, //默认为false，不监听
		release: false //默认为false，不监听
	}
});

//初始化应用
var initApp = function() {
	this.initMap();
	this.queryWarnInfoNum();
	this.initEvent();
	scroller = mui('.mui-scroll-wrapper').scroll({
		indicators: false,
		bounce: false
	});
	scroller.setStopped(true); //暂时禁止

};
mui.ready(initApp);

var initAppPlus = function() {
	//获取状态栏高度
	this.topNavHeight = plus.navigator.getStatusbarHeight();

	plus.key.addEventListener('backbutton', function() {
		hideFooterPanel();
		return false;
	}, false);

	//initNativeObjects();
	//showSoftInput();
};

mui.plusReady(initAppPlus);

var data = 0;
mui.back = function() {
	var first = null;
	if(!first) { //首次按键，提示‘再按一次退出应用’
		data += 1;
		setTimeout(function() {
			data = 0;
		}, 1000);
	}
	if(data == 2) {
		var btnArray = ['是', '否'];
		mui.confirm('确认退出？', '鹰潭地灾应用', btnArray, function(e) {
			if(e.index == 0) {
				plus.runtime.quit();
			} else {}
		});
	}
};

var initMap = function() {
	var me = this;
	myMap = L.map('ytmap', {
		zoomControl: false,
		attributionControl: false
	}).fitWorld();

	L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
		maxZoom: 18,
		attribution: 'leaflet',
		id: 'gaodem'
	}).addTo(myMap);

	localMarker = null;

	setTimeout(loadBoundary, 3000);

	function onLocationFound(e) {
		if(localMarker == null) {
			var pulsingIcon = L.icon.pulse({
				iconSize: [10, 10],
				color: '#3385FF',
				fillColor: '#3385FF',
				heartbeat: 2
			});
			localMarker = L.marker(e.latlng, {
				icon: pulsingIcon
			}).addTo(myMap);
		} else {
			localMarker.setLatLng(e.latlng);
		}
	}

	function loadBoundary() {
		if(kmlLayer == null) {
			kmlLayer = new L.KML("resources/yingtan.kml", {
				async: true
			});
			myMap.addLayer(kmlLayer);
		}
	}

	function onLocationError(e) {
		mui.toast('未获取位置，请稍后再试！', {
			duration: 'short',
			type: 'div'
		})
		//myMap.setView(L.latLng(36.55, 102.71), 4);
	}

	myMap.on('locationfound', onLocationFound);
	myMap.on('locationerror', onLocationError);

	//进入系统，只查询当前位置坐标，地图不进行定位。地图默认显示范围为地灾点查询的范围
	myMap.locate({
		setView: false,
		timeout: 5000,
		maxZoom: 13
	});

	//	myMap.on('click', function(e) {
	//		var isMarker = false;
	//		var target = e.originalEvent.target;
	//		if(target.type != 'button') {
	//			//me.hideFooterPanel(0);
	//			//changeMapStatus();
	//		}
	//	});
	//查询地灾点和设备
	showWarnDZMarksOnMap();

	//监测设备根据不同的地图级别进行显示隐藏
	myMap.on('zoomend zoomlevelschange', function(e) {
		var curLel = myMap.getZoom();
		if(curLel < jcsbMaxZoomShow) {
			dzMarkersLayerGroup.addTo(myMap);
			jcMarkersLayerGroup.remove();
		} else {
			dzMarkersLayerGroup.remove();
			jcMarkersLayerGroup.addTo(myMap);
		}
	});
};

function clearLayerByID(id) {
	if(myMap != null) {
		var i;
		for(i in myMap._layers) {
			if(myMap._layers[i].options.id == id) {
				myMap._layers[i].remove();
				return;
			}
		}
	}
}

//显示告警信息汇总提示栏，10秒后消失
function showWarnInfoOnMap() {
	var warnInfo = queryWarnInfo();
	var showTime = 100;
	if(warnInfo != '') {
		var obj = mui('#warn-info')[0];
		obj.innerHTML = warnInfo;
		showTime = 10000;
	}
	setTimeout(function() {
		var obj = mui('.warn-info-container')[0];
		obj.style.display = 'none';
	}, showTime);
}

//查询今天预警记录数
function queryWarnInfoNum() {
	var begin = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).Format('yyyy-MM-dd hh:ss:mm'); // 当前时间的前一小时
	var action = "alarms";
	var queryParam = {};
	queryParam.begin = begin;
	queryParam.status = 0;
	mui.myMuiQuery(action, queryParam,
		function(results) {
			if(results.code == 0 && results.data) {
				if(results.data.total == 0) {
					mui('#info-num-container')[0].style.display = "none";
				} else if(results.data.total > 99) {
					mui('#info-num')[0].innerHTML = '99+';
				} else {
					mui('#info-num')[0].innerHTML = results.data.total;
				}
			}
		});
}

//查询后台服务器，获取警告信息汇总
function queryWarnInfo() {
	var dzNum = 0;
	var jcsbNum = 0;
	if(dzQueryResults) {
		var quakerArr = dzQueryResults.quakes;
		var devicesArr = dzQueryResults.devices;
		for(var i = 0; i < quakerArr.length; i++) {
			if(quakerArr[i].rank > 0) {
				dzNum++;
			}
		}
		for(var i = 0; i < devicesArr.length; i++) {
			if(devicesArr[i].rank > 0) {
				jcsbNum++;
			}
		}
	}
	var info = '今日报警：地灾点' + dzNum + '个，监测设备' + jcsbNum + '个';
	if(dzNum == 0 && jcsbNum == 0) {
		info = '今日报警：无'
	}
	return info;
}

//开启华为设备虚拟导航栏实时监控
var preVirtualNavHeight = 0;
var virtualNavHeight = 0;
var monitormonitorVirtualMenu = function(fh) {
	setInterval(function() {
		var mapFooter = mui('#ytfooter')[0];
		var mapContent = mui('#ytmap')[0];
		var ytMask = mui('#ytmask')[0];

		//判断是否显示了虚拟导航栏
		if((screen.availHeight == ytMask.clientHeight + topNavHeight) || screen.availHeight == ytMask.clientHeight) {
			//没有显示虚拟导航栏
			this.virtualNavHeight = 0;
		} else if(screen.availHeight > ytMask.clientHeight + topNavHeight) {
			//已经显示虚拟导航栏，先计算虚拟导航栏的高度
			this.virtualNavHeight = screen.availHeight - ytMask.clientHeight - topNavHeight;
		}

		if(preVirtualNavHeight != virtualNavHeight && mapFooter.clientHeight < 150) {
			mapFooter.style.height = (virtualNavHeight + fh) + 'px';
			mapFooter.style.display = 'block';
			mapContent.style.height = (screen.availHeight - fh - topNavHeight - virtualNavHeight) + 'px';
			preVirtualNavHeight = virtualNavHeight;
		}
	}, 200);
}

/*显示底部要素概要面板，fh=100*/
var showFooterPanel = function(fh) {
	if(fh == footerHeight && scroller.maxScrollY < 0) {
		scroller.scrollTo(0, 0, 100);
	}

	this.monitormonitorVirtualMenu(footerHeight);

	var mapFooter = mui('#ytfooter')[0];
	var mapContent = mui('#ytmap')[0];
	var baseinfo = mui('#baseinfo')[0];
	var ytMask = mui('#ytmask')[0];

	//判断是否显示了虚拟导航栏
	if((screen.availHeight == ytMask.clientHeight + topNavHeight) || screen.availHeight == ytMask.clientHeight) {
		//没有显示虚拟导航栏
		mapFooter.style.height = fh + 'px';
		mapFooter.style.display = 'block';
		mapContent.style.height = (screen.availHeight - fh - topNavHeight) + 'px';
	} else if(screen.availHeight > ytMask.clientHeight + topNavHeight) {
		//已经显示虚拟导航栏，先计算虚拟导航栏的高度
		var virtualNavH = screen.availHeight - ytMask.clientHeight - topNavHeight;
		mapFooter.style.height = (virtualNavH + fh) + 'px';
		mapFooter.style.display = 'block';
		mapContent.style.height = (screen.availHeight - fh - topNavHeight - virtualNavH) + 'px';
	}

	if(fh != footerHeight) {
		baseinfo.classList.add("footercardcontentfloat");
	} else {
		baseinfo.classList.remove("footercardcontentfloat");
	}
};

function checkFtstar(starStatus) {
	var obj = mui('#ftstar')[0];
	if(starStatus == 0) {
		obj.classList.remove('ytfooter-star-color');
		obj.classList.add('ytfooter-star');
	} else {
		obj.classList.remove('ytfooter-star');
		obj.classList.add('ytfooter-star-color');
	}
}

/*隐藏底部要素概要面板, fh=0*/
var hideFooterPanel = function() {
	var mapFooter = mui('#ytfooter')[0];
	var mapContent = mui('#ytmap')[0];
	mapFooter.style.height = '0px';
	mapFooter.style.display = 'none';
	mapContent.style.height = '100%';
	//地图大小变化
	changeMapStatus();
	if(scroller.maxScrollY < 0) {
		scroller.scrollTo(0, 0, 100);
	}

	scroller.setStopped(true); //禁止滚动
	var toolFloatContainer = mui("#toolFloatContainer")[0];
	toolFloatContainer.classList.remove("mui-hidden");
};

//初始化事件
var initEvent = function() {
	var me = this;

	//首页底部面板拖动
	var ytFooterHeight = 0;
	/*var zoomin = mui('#yt-map-zoomin')[0];
	var zoomout = mui('#yt-map-zoomout')[0];
	var detailInfo = mui("#detailInfo")[0];*/
	var toolFloatContainer = mui("#toolFloatContainer")[0];
	var startY = 0;
	var ytfooter = mui('#ytfooter')[0];
	ytfooter.addEventListener('dragstart', function(evt) {
		ytFooterHeight = parseInt(document.getElementById("ytfooter").style.height);
		startY = evt.detail.center.y;
		toolFloatContainer.classList.add("mui-hidden");
	});
	ytfooter.addEventListener('drag', function(evt) {
		ytFooterHeight = ytFooterHeight - (evt.detail.center.y - startY);
		startY = evt.detail.center.y;
		if(ytFooterHeight < me.footerHeight) {
			ytFooterHeight = me.footerHeight;
		}
		me.showFooterPanel(ytFooterHeight);
	});
	ytfooter.addEventListener('dragend', function(evt) {
		ytFooterHeight = ytFooterHeight - (evt.detail.center.y - startY);
		var step1 = (screen.availHeight - me.virtualNavHeight) / 3;
		var step2 = (screen.availHeight - me.virtualNavHeight) * 2 / 3;
		//scroller.setStopped(true);
		if(ytFooterHeight <= step1) {
			ytFooterHeight = me.footerHeight;
			toolFloatContainer.classList.remove("mui-hidden");
		} else if(ytFooterHeight <= step2) {
			ytFooterHeight = parseInt(step2);
		} else {
			ytFooterHeight = screen.availHeight - topNavHeight - me.virtualNavHeight;
			scroller.setStopped(false);
		}

		me.showFooterPanel(ytFooterHeight);
		//地图大小变化
		changeMapStatus();
	});

	mui("#search-input-id")[0].addEventListener("onfocus", function() {
		var toolFloatContainer = mui("#toolFloatContainer")[0];
		toolFloatContainer.classList.add("mui-hidden");
	});
	mui("#search-input-id")[0].addEventListener("onblur", function() {
		var toolFloatContainer = mui("#toolFloatContainer")[0];
		toolFloatContainer.classList.remove("mui-hidden");
	})

	//监听滚动事件
	var scrollStart = 0;
	mui(".mui-scroll-wrapper")[0].addEventListener("scrollstart", function() {
		scrollStart = event.detail.y;
	});
	mui(".mui-scroll-wrapper")[0].addEventListener("scroll", function() {
		if(scrollStart == 0 && event.detail.y == 0 && scroller != null) {
			scroller.setStopped(true);
		}
	});

	//搜索框聚焦激活搜索面板
	mui('#search-input-id')[0].addEventListener('focus', function() {
		//				mui('#search-input-id')[0].blur();
		//				mui.openWindow({
		//							url: 'pages/common/search.html',
		//							id: 'search-page-1',
		//							createNew: true
		//						});
	});
	//首页底部栏上更多详细按钮的点击事件
	mui("#ytfooter").on('tap', '.mui-badge', function(evt) {
		var action = evt.target.title;
		//地灾点或设备ID
		var idT = "";
		var feature = null;
		var typeT = null;
		if(selectType == "dzd") {
			idT = currentDzd.quakeid;
			feature = currentDzd;
			typeT = selectType;
		} else if(selectType == "jcsb") {
			idT = currentSb.deviceid;
			feature = currentSb;
			typeT = currentSb.type;
		}
		//地灾点或设备所有属性数据对象
		var pageUrl = '';
		var pageId = '';
		switch(action) {
			case 'dzd-more-info':
				pageUrl = 'pages/dzd/dzdgdxx.html';
				pageId = 'dzd-more-info';
				break;
			case 'dzd-warn-info':
				pageUrl = 'pages/common/gjxxzx.html';
				pageId = 'dzd-warn-info';
				break;
			case 'dzd-jcsb-all':
				pageUrl = 'pages/dzd/dzdjcsblist.html';
				pageId = 'dzd-jcsb-all';
				break;
			case 'jcsb-more-info':
				pageUrl = 'pages/jcsb/jcsbgdxx.html';
				pageId = 'jcsb-more-info';
				break;
			case 'jcsb-warn-info':
				pageUrl = 'pages/common/gjxxzx.html';
				pageId = 'jcsb-warn-info';
				break;
			case 'jcsb-analy-all':
				if(typeT) {
					switch(typeT) {
						case 1:
							pageUrl = 'pages/jcsb/bmwyjcanalylist.html';
							pageId = 'jcsb-bmwyjc-analylist';
							break;
						case 2:
							pageUrl = 'pages/jcsb/yljcanalylist.html';
							pageId = 'jcsb-yljc-analylist';
							break;
						case 3:
							pageUrl = 'pages/jcsb/lfjcanalylist.html';
							pageId = 'jcsb-lfjc-analylist';
							break;
						default:
							break;
					}
				}
				break;
			default:
				break;
		}
		mui.openWindow({
			url: pageUrl,
			id: pageId,
			extras: {
				type: typeT,
				paramId: idT,
				feature: feature
			}
		});
	});

	//底部地灾点写评论按钮点击事件
	mui('#comment')[0].addEventListener('click', function(evt) {
		var objcomm = evt.target;
		if(objcomm) {
			mui.openWindow({
				url: 'pages/dzd/comment.html',
				id: 'comment-info',
				extras: {
					dzQueryResults: dzQueryResults, //地灾点查询结果数据
					currentdzd: currentDzd, //当前选择的地灾点
				}
			});
			return
		}
	});

	//	监听点击事件,获取所有按钮，绑定按钮的点击事件
	mui('#toolFloatContainer').on("tap", ".mui-btn", function(evt) {
		var action = this.getAttribute('value');
		switch(action) {
			case 'usercenter':
				{
					mui.openWindow({
						url: 'pages/common/user.html',
						id: 'user',
					});
					break;
				}
			case 'info':
				/*已发生预警地灾点列表*/
				{
					mui.openWindow({
						url: 'pages/common/gjxxzx.html',
						id: 'gjxxzx',
					});
					break;
				}
			case 'locate':
				{
					me.hideFooterPanel(0); //定位功能，测试底部面板隐藏
					myMap.locate({
						setView: true,
						timeout: 5000,
						maxZoom: 15
					});
					break;
				}
			case 'zoomin':
				{
					myMap.zoomIn();
					break;
				}
			case 'zoomout':
				{
					myMap.zoomOut();
					break;
				}
			case 'warn':
				{
					var obj = evt.target;
					if(obj.classList.contains('map-tool-warn-color')) {
						obj.classList.remove('map-tool-warn-color');
						obj.classList.add('map-tool-warn');
						showAllDZMarksOnMap();
					} else {
						obj.classList.remove('map-tool-warn');
						obj.classList.add('map-tool-warn-color');
						showWarnDZMarksOnMap();
					}
					var obj = mui('.yt-star-color')[0];
					if(obj) {
						obj.classList.remove('map-tool-star-color');
						obj.classList.remove('yt-star-color');
						obj.classList.add('map-tool-star');
						obj.classList.add('yt-star');
					}
					break;
				}
			case 'star': //显示收藏的地灾点 、设备
				{
					var obj = evt.target;
					if(obj.classList.contains('map-tool-star')) {
						obj.classList.remove('map-tool-star');
						obj.classList.remove('yt-star');
						obj.classList.add('map-tool-star-color');
						obj.classList.add('yt-star-color');
						showFilterStarMarksOnMap(true);
					} else {
						obj.classList.remove('map-tool-star-color');
						obj.classList.remove('yt-star-color');
						obj.classList.add('map-tool-star');
						obj.classList.add('yt-star');
						showFilterStarMarksOnMap(false);
					}
					break;
				}
			case 'map': //底图切换
				{
					var obj = evt.target;
					//显示影像地图
					clearLayerByID('gaodeimg');
					clearLayerByID('gaodeimga');
					clearLayerByID('gaodem');
					if(obj.classList.contains('map-tool-baselayer')) {
						obj.classList.remove('map-tool-baselayer');
						obj.classList.add('map-tool-baselayer-color');

						var gaodeimg = L.tileLayer.chinaProvider('GaoDe.Satellite.Map', {
							maxZoom: 18,
							id: 'gaodeimg'
						});
						var gaodeimga = L.tileLayer.chinaProvider('GaoDe.Satellite.Annotion', {
							maxZoom: 18,
							id: 'gaodeimga'
						});
						L.layerGroup([gaodeimg, gaodeimga]).addTo(myMap);
					} else {
						//显示矢量地图
						obj.classList.remove('map-tool-baselayer-color');
						obj.classList.add('map-tool-baselayer');
						L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
							maxZoom: 18,
							attribution: 'leaflet',
							id: 'gaodem'
						}).addTo(myMap);
					}

					break;
				}
			default:
				break;
		}
	});
};

//过滤显示被收藏的地灾点、设备点
function showFilterStarMarksOnMap(isFilter) {
	if(isFilter == true) {
		if(dzMarkersLayerGroup) {
			var layers = new Array();
			dzMarkersLayerGroup.eachLayer(function(layer) {
				var attr = layer.options.attr;
				if(attr.favostatus != 1) {
					layers.push(layer);
				}
			});
			for(var i = 0; i < layers.length; i++) {
				if(dzMarkersLayerGroup.hasLayer(layers[i])) {
					dzMarkersLayerGroup.removeLayer(layers[i]);
				}
			}
		}
	} else {
		var obj = mui('.yt-warn')[0];
		if(obj.classList.contains('map-tool-warn-color')) {
			showWarnDZMarksOnMap();
		} else {
			showAllDZMarksOnMap();
		}
	}
	if(jcMarkersLayerGroup) {
		myMap.removeLayer(jcMarkersLayerGroup);
	}
	hideFooterPanel();
};

function showAllDZMarksOnMap() {
	dzMarkersLayerGroup.clearLayers();
	if(dzQueryResults) {
		getDZMarkersLayerGroup(dzQueryResults.quakes, false);
		myMap.addLayer(dzMarkersLayerGroup);
	} else {
		var action = "quakes/all/" + userId;
		mui.myMuiQuery(action, '',
			function(results) {
				if(results != null && results.data.quakes.length > 0) {
					dzQueryResults = results.data;
					getDZMarkersLayerGroup(dzQueryResults.quakes, false);
					myMap.addLayer(dzMarkersLayerGroup);
				} else {
					mui.myMuiQueryNoResult('查询无结果！');
					dzQueryResults = null;
				}
			},
			function() {
				mui.myMuiQueryErr('查询失败，请稍后再试！');
				dzQueryResults = null;
			}
		)
	}
}

//检查地图size变化
function changeMapStatus() {
	myMap.invalidateSize();
	if(warnBounds) {
		myMap.fitBounds(warnBounds, {
			maxZoom: maxZoomShow
		});
	}
}

//点击评论跳转到评论详情页面
function initComentList() {
	var action = "comments";
	var queryParam = {};
	queryParam.quakeid = currentDzd.quakeid
	mui.myMuiQuery(action, queryParam,
		function(results) {
			if(results != null && results.data.rows != null) {
				mui.each(results.data.rows, function(index, item) {
					if(item.image != null) {
						item.image = item.image.split(';');
					}
				})
				var html = template('com-ul-li-template', {
					list: results.data.rows
				});
				document.getElementById("commullist").innerHTML = html;
				mui('#commullist').on('tap', '#commullist>li', function(evt) {
					var index = parseInt(this.getAttribute("data-item"));
					var info = {
						url: 'pages/dzd/commentinfo.html',
						extras: {
							data: results.data.rows[index], //评论数据
							dzQueryResults: dzQueryResults, //地灾点查询结果数据
							currentdzd: currentDzd //当前选择的地灾点
						}
					};
					mui.openWindow(info);
				});
			}
		},
		function() {
			mui.myMuiQueryErr('查询失败，请稍后再试！');
			dzQueryResults = null;
		}
	)
}

//显示告警对象
function showWarnDZMarksOnMap() {
	//1所有地灾点，包括报警级别信息
	dzMarkersLayerGroup.clearLayers();
	if(dzQueryResults) {
		getDZMarkersLayerGroup(dzQueryResults.quakes, true);
		myMap.addLayer(dzMarkersLayerGroup);
	} else {
		var action = "quakes/all/" + userId;
		var param = {
			hours: 24
		};
		mui.myMuiQuery(action, param,
			function(results) {
				if(results != null && results.data && results.data.quakes.length > 0) {
					dzQueryResults = results.data;
					getDZMarkersLayerGroup(dzQueryResults.quakes, true);
					getJCMarkersLayerGroup(dzQueryResults.devices, false);
					myMap.addLayer(dzMarkersLayerGroup);
					if(!warnInfoIsShow) {
						showWarnInfoOnMap();
						warnInfoIsShow = true;
					}
				} else {
					mui.myMuiQueryNoResult('查询无结果！');
					dzQueryResults = null;
				}
			},
			function() {
				mui.myMuiQueryErr('查询失败，请稍后再试！');
				dzQueryResults = null;
			}
		)
	}
}

//生成markers并添加到地灾markerlayergroup
function getDZMarkersLayerGroup(results, isWarn) {
	var latLngsArr = new Array();
	var iconName = 'bullseye';
	var markColor = 'green';
	var level = '';
	for(var i = 0; i < results.length; i++) {
		level = results[i].rank;
		if(isWarn == false) {
			level = -1;
		}
		markColor = getMarkerColorByWarnLevel(level);
		var iconObj = L.AwesomeMarkers.icon({
			icon: iconName,
			markerColor: markColor,
			prefix: 'fa',
			spin: false
		});
		var mId = results[i].quakeid;
		var mType = 'dzd';
		var picker = mui.parseJSON(results[i].centroid);
		//		var picker = null;
		//		if(results[i].quakeid == 100000) {
		//			picker = {
		//				"latitude": 28.225979618836536,
		//				"longitude": 117.17275110731283
		//			};
		//			results[i].attr = '[{"lng":"117.17275110731283","lat":"28.225979618836536"}]'
		//		} else {
		//			continue;
		//		}

		var mX = picker.latitude;
		var mY = picker.longitude;
		var mN = results[i].name;
		var markerObj = new L.marker([mX, mY], {
			icon: iconObj,
			title: mN,
			type: mType,
			id: mId,
			attr: results[i]
		}).bindPopup(mN, {
			closeButton: false
		}).on('click', function(e) {
			selectType = "dzd";
			currentDzd = this.options.attr;
			showJCMarkerByDZid(e.target.options.id);
			setFooterContentByInfo(e.target.options.type, e.target.options.id);
			checkFtstar(currentDzd.favostatus);
			showFooterPanel(footerHeight);
			//初始化评论列表
			initComentList();
		});
		dzMarkersLayerGroup.addLayer(markerObj);
		latLngsArr.push(markerObj.getLatLng());
	}
	//	if(latLngsArr.length > 0) {
	//		warnBounds = L.latLngBounds(latLngsArr).pad(0.2);
	//		setTimeout(function() {
	//			myMap.fitBounds(warnBounds, {
	//				maxZoom: maxZoomShow
	//			});
	//		}, 500);
	//}
	setTimeout(function() {
		myMap.flyTo(new L.LatLng(28.247538, 117.049713), 9)
	}, 500)
}
//根据不同的告警级别获取不同的颜色值
function getMarkerColorByWarnLevel(level) {
	var markColor = '';
	switch(String(level)) {
		case '4':
			{
				markColor = 'red';
				break;
			}
		case '3':
			{
				markColor = 'orange';
				break;
			}
		case '2':
			{
				markColor = 'purple'; //就是yellow颜色
				break;
			}
		case '1':
			{
				markColor = 'blue';
				break;
			}
		case '0':
			{
				markColor = 'green';
				break;
			}
		default:
			{
				markColor = 'cadetblue';
				break;
			}
	}
	return markColor;
}

//地灾点的点击事件，显示该地灾点的监测设备
function showJCMarkerByDZid(dzID) {
	if(dzID != null && dzQueryResults != null) {
		jcMarkersLayerGroup.clearLayers();
		var quakesArr = dzQueryResults.quakes;
		var areaT = null;
		var latlngs = new Array();
		for(var i = 0; i < quakesArr.length; i++) {
			if(quakesArr[i].quakeid == dzID) {
				areaT = mui.parseJSON(quakesArr[i].attr);
				break;
			}
		}
		for(var i = 0; i < areaT.length; i++) {
			latlngs.push(new L.latLng(areaT[i].lat, areaT[i].lng));
		}
		var areaLine = L.polygon(latlngs, {
			color: 'red',
			weight: 2,
			opacity: 0.5,
			fillColor: '#cccccc',
			fillOpacity: 0.4,
			fill: true
		});
		jcMarkersLayerGroup.addLayer(areaLine);

		var devicesArr = dzQueryResults.devices;
		var tempArr = new Array();
		for(var i = 0; i < devicesArr.length; i++) {
			if(devicesArr[i].quakeid == dzID) {
				tempArr.push(devicesArr[i]);
			}
		}

		getJCMarkersLayerGroup(tempArr);
		myMap.addLayer(jcMarkersLayerGroup);
	}
}
//生成markers并添加到监测设备markerlayergroup
function getJCMarkersLayerGroup(results, fitBounds) {
	fitBounds = fitBounds == null ? true : fitBounds;
	var latLngsArr = new Array();
	var iconName = '';
	var markColor = 'purple';
	var level = '';
	for(var i = 0; i < results.length; i++) {
		level = results[i].rank;
		if(results[i].type == 1) { //位移
			iconName = "fa-clone icon-white";
		} else if(results[i].type == 2) { //雨量
			iconName = "fa-tint icon-white";
		} else if(results[i].type == 3) { //裂缝
			iconName = "fa-bolt icon-white";
		}
		markColor = getMarkerColorByWarnLevel(level);
		if(results[i]['connectstatus'] != 0) {
			markColor = 'gray';
		}
		var mId = results[i].deviceid;
		var mType = results[i].type;
		var mX = results[i].lat;
		var mY = results[i].lng;
		var mN = results[i].name;
		var iconObj = L.AwesomeMarkers.icon({
			icon: iconName,
			markerColor: markColor,
			prefix: 'fa',
			spin: false
		});
		var markerObj = new L.marker([mX, mY], {
			icon: iconObj,
			title: mN,
			type: mType,
			id: mId,
			attr: results[i]
		}).bindPopup(mN, {
			closeButton: false
		}).on('click', function(e) {
			jcMarkersLayerGroup.addTo(myMap);
			selectType = "jcsb";
			currentSb = this.options.attr;
			setFooterContentByInfo(e.target.options.type, e.target.options.id);
			myMap.flyTo(e.sourceTarget.getLatLng(), 17);
			showFooterPanel(footerHeight);
			//			checkFtstar(currentSb.favostatus);
		});
		jcMarkersLayerGroup.addLayer(markerObj);
		latLngsArr.push(markerObj.getLatLng());
	}
	if(fitBounds == true && latLngsArr.length > 0) {
		warnBounds = L.latLngBounds(latLngsArr);
		setTimeout(function() {
			myMap.flyTo(warnBounds.getCenter(), jcsbMaxZoomShow);
		}, 500);
	}

}
//设置底部栏的内容，根据点击的地灾点或者设备点
function setFooterContentByInfo(Type, infoID) {
	var tempResults = null;
	var infoT = null;
	//底部面板是地灾点信息
	if(Type == 'dzd') {
		tempResults = dzQueryResults.quakes;
		infoT = getCheckInfos(tempResults, Type, infoID);
		initDzdContentHtml(infoT, Type);

		mui('#mui-slider-jcsb').off('tap', 'li');
		mui("#mui-slider-jcsb").on('tap', 'img', function(evt) {
			var info = this.getAttribute("id");
			if(info) {
				var typeT = info.split('_')[0];
				var idT = info.split('_')[1];
				mui.openWindow({
					url: 'pages/jcsb/jcsb.html',
					id: 'jcsb-detail-id',
					extras: {
						xqType: typeT,
						xqID: idT
					}
				});
			}
		});
	} else {
		//底部面板是监测设备信息
		tempResults = dzQueryResults.devices;
		infoT = getCheckInfos(tempResults, Type, infoID);
		initJcsbContentHtml(infoT, Type);

		//释放事件监听
		mui('#jcsb-jczb-list').off('tap', 'li');
		mui(".mui-slider").slider();
		mui('#jcsb-jczb-list').on('tap', 'li', function(evt) {
			var currentPid = this.getAttribute('page');
			var type = this.getAttribute('tp');
			var label = this.getAttribute('label');
			var preUrl = "pages/jcsb/";
			var info = {
				url: preUrl,
				extras: {
					paramId: currentPid, //设备页面对应的子面板
					feature: currentSb, //监测设备属性信息
					label: label //子页面显示标题
				}
			};
			//裂缝监测设备
			if(type == "1") {
				//位移监测设备
				info.url += 'bmwyjc.html';
				info.id = 'bmwyjc-analy-detail';
			} else if(type == "2") {
				//雨量监测设备
				info.url += 'yljc.html';
				info.id = 'yljc-analy-detail';
			} else if(type == "3") {
				info.url += 'lfjc.html';
				info.id = 'lfjc-analy-detail';
			}
			mui.openWindow(info);
		});
	}
	initBriefContentHtml(infoT, Type);
	this.showDetailPanel(infoT, Type);
}

function getCheckInfos(results, typeT, idT) {
	var infoT = null;
	for(var i = 0; i < results.length; i++) {
		var checkId = null;
		if(typeT == 'dzd') {
			checkId = results[i].quakeid;
		} else {
			checkId = results[i].deviceid;
		}
		if(checkId == idT) {
			infoT = results[i];
			break;
		}
	}
	return infoT;
}
//初始化概要信息内容
function initBriefContentHtml(infoT, typeT) {
	var html = template('brief-ul-li-template', {
		info: infoT,
		type: typeT
	});
	document.getElementById("baseinfo").innerHTML = html;
	//底部对象概要信息收藏按钮点击事件
	if(mui('#ftstar')[0] != null) {
		mui('#ftstar')[0].addEventListener('click', function(evt) {
			var action = evt.target.value;
			var starStatus = 0;
			if(action == 'ftstar') {
				var action = "userfavos";
				if(selectType == 'dzd') {
					mui.myMuiQueryPost(action, {
							userid: userId,
							quakeid: currentDzd.quakeid
						},
						function(results) {
							var obj = mui('#ftstar')[0];
							var statusT = 1;
							if(results.data.status == 1) {
								obj.classList.remove('ytfooter-star');
								obj.classList.add('ytfooter-star-color');
								statusT = 1;
							} else {
								obj.classList.remove('ytfooter-star-color');
								obj.classList.add('ytfooter-star');
								statusT = 0;
							}
							dzMarkersLayerGroup.eachLayer(function(layer) {
								var attr = layer.options.attr;
								if(attr.quakeid == results.data.quakeid) {
									attr.favostatus = statusT;
								}
							});
						},
						function() {
							mui.myMuiQueryErr('收藏(取消)失败，请稍后再试！');
							dzQueryResults = null;
						}
					)
				}
				return
			}
		})
	}
}
//初始化地灾点内容
function initDzdContentHtml(infoT, typeT) {
	var contentPart1 = template('dzd-content-part1-template', {
		info: infoT,
		type: typeT
	});
	document.getElementById("dzd-content-part1").innerHTML = contentPart1;

	var contentPart2 = template('dzd-content-part2-template', {
		info: infoT,
		type: typeT
	});
	document.getElementById("dzd-content-part2").innerHTML = contentPart2;

	var quakeId = infoT.quakeid;
	var ownerDevices = new Array();
	var tempResults = mui.myCloneObj(dzQueryResults.devices);
	for(var i = 0; i < tempResults.length; i++) {
		if(tempResults[i].quakeid == quakeId) {
			var imgT = null;
			if(tempResults[i].dimage.length == 0) {
				imgT = [{
					"title": "",
					"url": ""
				}];
			} else {
				imgT = JSON.parse(tempResults[i].dimage);
			}
			tempResults[i].dimage = imgT[0];
			ownerDevices.push(tempResults[i]);
		}
	}
	var picsNum = ownerDevices.length;
	var totalPage = parseInt(picsNum / picListPageSize);
	var remNum = picsNum % picListPageSize;
	if(remNum != 0) {
		totalPage = totalPage + 1;
	}
	var contentPart3 = template('dzd-content-part3-template', {
		list: ownerDevices,
		pageNum: totalPage,
		pageSize: picListPageSize,
		pageRem: remNum
	});
	document.getElementById("dzd-content-part3").innerHTML = contentPart3;
	//监测设备图文轮播事件
	mui.later(dzdsbScroll, 1000);
}

function dzdsbScroll() {
	mui("#mui-slider-jcsb").slider();
}
//初始化监测设备内容
function initJcsbContentHtml(infoT, typeT) {
	var contentPart1 = template('jcsb-content-part1-template', {
		info: infoT,
		type: typeT
	});
	document.getElementById("jcsb-content-part1").innerHTML = contentPart1;

	var contentPart2 = template('jcsb-content-part2-template', {
		info: infoT,
		type: typeT
	});
	document.getElementById("jcsb-content-part2").innerHTML = contentPart2;

	var jcsbhtml = template('jczb-ul-li-template', {
		type: typeT
	});
	document.getElementById("jcsb-jczb-list").innerHTML = jcsbhtml;
}

//根据地灾点或监测设备类型显示详情信息，此处为三层分层信息面板
function showDetailPanel(feature, type) {
	var dzdDetailList = mui('.dzd-footercardcontent');
	var jcsbDetailList = mui('.jcsb-footercardcontent');
	if(dzdDetailList && dzdDetailList.length > 0) {
		var len = dzdDetailList.length;
		for(var i = 0; i < len; i++) {
			dzdDetailList[i].classList.add('mui-hidden');
		}
	}
	if(jcsbDetailList && jcsbDetailList.length > 0) {
		var len = jcsbDetailList.length;
		for(var i = 0; i < len; i++) {
			jcsbDetailList[i].classList.add('mui-hidden');
		}
	}
	if(type == 'dzd') {
		if(dzdDetailList && dzdDetailList.length > 0) {
			var len = dzdDetailList.length;
			for(var i = 0; i < len; i++) {
				dzdDetailList[i].classList.remove('mui-hidden');
			}
		}
	} else {
		if(jcsbDetailList && jcsbDetailList.length > 0) {
			var len = jcsbDetailList.length;
			for(var i = 0; i < len; i++) {
				jcsbDetailList[i].classList.remove('mui-hidden');
			}
		}
	}
}

var nativeWebview, imm, InputMethodManager;
var initNativeObjects = function() {
	if(mui.os.android) {
		var main = plus.android.runtimeMainActivity();
		var Context = plus.android.importClass("android.content.Context");
		InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
		imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
	} else {
		nativeWebview = plus.webview.currentWebview().nativeInstanceObject();
	}
};
var showSoftInput = function() {
	var nativeWebview = plus.webview.currentWebview().nativeInstanceObject();
	if(mui.os.android) {
		//强制当前webview获得焦点
		plus.android.importClass(nativeWebview);
		nativeWebview.requestFocus();
		imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
	} else {
		nativeWebview.plusCallMethod({
			"setKeyboardDisplayRequiresUserAction": false
		});
	}
};

$(function() {
	var action = "quakes/all/" + userId;
	mui.myMuiQuery(action, '', function(results) {
		if(results != null && results.data != null) {
			var tags = [];
			mui.each(results.data.quakes, function(index, element) {
				tags.push({
					label: element.name,
					type: 1, //地灾点
					id: element.quakeid
				});
			});
			mui.each(results.data.devices, function(index, element) {
				tags.push({
					label: element.name,
					type: 2, //监测设备
					id: element.deviceid
				});
			});

			$("#search-input-id").autocomplete({
				source: tags,
				minLength: 1,
				select: function(event, ui) {
					$("#search-input-id").autocomplete("close");
					setTimeout("mui('#search-input-id')[0].blur()", 100);
					setTimeout(function() {
						var evt = document.createEvent('Event');
						evt.initEvent('click', true, true);
						ui = ui.item;
						if(ui.type == 1) {
							dzMarkersLayerGroup.eachLayer(function(layer) {
								if(layer.options.id != null && layer.options.id == ui.id) {
									layer.fire('click');
									return false;
								}
							})
						} else if(ui.type == 2) {
							jcMarkersLayerGroup.eachLayer(function(layer) {
								if(layer.options.id != null && layer.options.id == ui.id) {
									layer.fire('click');
									return false;
								}
							})
						}
					}, 500);
					setTimeout(function() {
						$("#search-input-id").val('');
					}, 500);
					setTimeout(changeMapStatus, 1000);
				}
			});
		}
	})
})