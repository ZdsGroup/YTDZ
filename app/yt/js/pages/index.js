var myMap = null;
//地图上显示地灾对象图层	
var dzMarkersLayerGroup = new L.layerGroup();
var dzQueryResults = null;
//底图上显示监测设备对象图层
var jcMarkersLayerGroup = new L.layerGroup();
var jcQueryResults = null;
var warnBounds = null;
var maxZoomShow = 15;
var footerHeight = 101;
var topNavHeight = 25; //手机顶部状态栏高度
var picListPageSize = 3;
var scroller = null;
mui.init({
	gestureConfig: {
		tap: true, //默认为true
		doubletap: true, //默认为false
		longtap: true, //默认为false
		swipe: true, //默认为true
		drag: true, //默认为true
		hold: false, //默认为false，不监听
		release: false //默认为false，不监听
	}
});

//初始化应用
var initApp = function() {
	this.initMap();
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
		hideFooterPanle();
		return false;
	}, false);
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
		plus.runtime.quit();

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

	var localMarker = null;

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

	function onLocationError(e) {
		mui.toast('未获取位置，请稍后再试！', {
			duration: 'short',
			type: 'div'
		})
		myMap.setView(L.latLng(36.55, 102.71), 4);
	}

	myMap.on('locationfound', onLocationFound);
	myMap.on('locationerror', onLocationError);

	myMap.locate({
		setView: true,
		timeout: 5000,
		maxZoom: 13
	});

	myMap.on('click', function(e) {
		var isMarker = false;
		var target = e.originalEvent.target;
		if(target.type != 'button') {
			me.hideFooterPanle(0);
			changeMapStatus();
		}
	});

	showWarnDZMarksOnMap();
	showWarnInfoOnMap();
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

//显示告警信息汇总提示栏，5秒后消失
function showWarnInfoOnMap() {
	var warnInfo = queryWarnInfo();
	if(warnInfo != '') {
		var obj = mui('#warn-info')[0];
		obj.innerHTML = warnInfo;
	}
	setTimeout(function() {
		var obj = mui('.warn-info-container')[0];
		obj.style.display = 'none';
	}, 10000);
}

//TODO 查询后台服务器，获取警告信息汇总
function queryWarnInfo() {
	var info = '今日报警：地灾点5个，监测设备26个';
	return info;
}

/*显示底部要素概要面板，fh=100*/
var showFooterPanel = function(fh) {
	if(fh == footerHeight && scroller.maxScrollY < 0) {
		scroller.scrollTo(0,0,100);
	}
	var mapFooter = mui('#ytfooter')[0];
	var mapContent = mui('#ytmap')[0];
	var baseinfo = mui('#baseinfo')[0];
	mapFooter.style.height = fh + 'px';
	mapFooter.style.display = 'block';
	mapContent.style.height = (screen.availHeight - fh - topNavHeight) + 'px';
	if (fh !=footerHeight) {
		baseinfo.classList.add("footercardcontentfloat");
	} else {
		baseinfo.classList.remove("footercardcontentfloat");
	}
};

/*隐藏底部要素概要面板, fh=0*/
var hideFooterPanle = function() {
	var mapFooter = mui('#ytfooter')[0];
	var mapContent = mui('#ytmap')[0];
	mapFooter.style.height = '0px';
	mapFooter.style.display = 'none';
	mapContent.style.height = '100%';
	//地图大小变化
	changeMapStatus();
	if (scroller.maxScrollY < 0) {
		scroller.scrollTo(0,0,100);
	}
	
	scroller.setStopped(true); //禁止滚动
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
		var step1 = screen.availHeight / 3;
		var step2 = screen.availHeight * 2 / 3;
		//scroller.setStopped(true);
		if(ytFooterHeight <= step1) {
			ytFooterHeight = me.footerHeight;
			toolFloatContainer.classList.remove("mui-hidden");
		} else if(ytFooterHeight <= step2) {
			ytFooterHeight = parseInt(step2);
		} else {
			ytFooterHeight = screen.availHeight - topNavHeight;
			scroller.setStopped(false);
		}

		me.showFooterPanel(ytFooterHeight);

		//地图大小变化
		changeMapStatus();
		//初始化评论列表
		initComentList();
		//初始化检测设备图片列表
		initJcsbPictureList();
	});

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
	mui('#search-input-text-id')[0].addEventListener('focus', function() {
		mui.openWindow({
			url: 'pages/common/search.html',
			id: 'search-page-1'
		});
	});

	//底部对象概要信息收藏按钮点击事件
	mui('#ftstar')[0].addEventListener('click', function(evt) {

		var action = evt.target.value;
		var starStatus = 0;
		if(action == 'ftstar') {
			var obj = mui('#ftstar')[0];
			if(obj.classList.contains('ytfooter-star')) {
				obj.classList.remove('ytfooter-star');
				obj.classList.add('ytfooter-star-color');
				starStatus = 1;
			} else {
				obj.classList.remove('ytfooter-star-color');
				obj.classList.add('ytfooter-star');
				starStatus = 0;
			}
			//TODO 调用后台把该对象进行收藏
			return
		}
	});

	//首页底部栏上更多详细按钮的点击事件
	mui("#ytfooter").on('tap', '.mui-badge', function(evt) {
		var action = evt.target.title;
		var info = mui('#footer-table p')[0];
		var typeT = info.id.split('_')[0];
		var idT = info.id.split('_')[1];
		var pageUrl = '';
		var pageId = '';
		var selectedFeature = JSON.parse(localStorage.getItem('currentSelectedFeature'));
		if(info) {
			switch(action) {
				case 'dzd-more-info':
					pageUrl = 'pages/dzd/dzdgdxx.html';
					pageId = 'dzd-more-info';
					break;
				case 'dzd-warn-info':
					pageUrl = 'pages/dzd/dzdsbyjxx.html';
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
					pageUrl = 'pages/jcsb/jcsbyjxx.html';
					pageId = 'jcsb-warn-info';
					break;
				case 'jcsb-analy-all':
					if(selectedFeature) {
						var jcsb_type = selectedFeature.type;
						switch(jcsb_type) {
							case 'bmwyjc':
								pageUrl = 'pages/jcsb/bmwyjcanalylist.html';
								pageId = 'jcsb-bmwyjc-analylist';
								break;
							case 'lfjc':
								pageUrl = 'pages/jcsb/lfjcanalylist.html';
								pageId = 'jcsb-lfjc-analylist';
								break;
							case 'yljc':
								pageUrl = 'pages/jcsb/yljcanalylist.html';
								pageId = 'jcsb-yljc-analylist';
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
					xqType: typeT,
					xqID: idT,
					xqFeature: selectedFeature
				}
			});
		}
	});

	//底部地灾点写评论按钮点击事件
	mui('#comment')[0].addEventListener('click', function(evt) {
		var objcomm = evt.target;
		if(objcomm) {
			mui.openWindow({
				url: 'pages/dzd/comment.html',
				id: 'comment-info'
			});
			return
		}
	});

	//监听点击事件,获取所有按钮，绑定按钮的点击事件
	mui('.mui-content').on("tap", "button", function(evt) {
		var action = evt.target.value;
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
					//预加载
					var flPage = mui.preload({
						url: 'pages/common/gjxxzx.html',
						id: 'gjxxzx',
						styles: {}, //窗口参数
						extras: {} //自定义扩展参数
					});
					flPage.show();
					break;
				}
			case 'locate':
				{
					me.hideFooterPanle(0); //定位功能，测试底部面板隐藏
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
					} else {
						obj.classList.remove('map-tool-star-color');
						obj.classList.remove('yt-star-color');
						obj.classList.add('map-tool-star');
						obj.classList.add('yt-star');
					}
					break;
				}
			case 'map': //底图切换
				{
					var obj = evt.target;
					if(obj.classList.contains('map-tool-baselayer')) {
						obj.classList.remove('map-tool-baselayer');
						obj.classList.add('map-tool-baselayer-color');
						//显示影像地图
						clearLayerByID('gaodem');
						var gaodeimg = L.tileLayer.chinaProvider('GaoDe.Satellite.Map', {
							maxZoom: 18,
							id: 'googleimg'
						});
						var gaodeimga = L.tileLayer.chinaProvider('GaoDe.Satellite.Annotion', {
							maxZoom: 18,
							id: 'googleimgano'
						});
						L.layerGroup([gaodeimg, gaodeimga]).addTo(myMap);
					} else {
						//显示矢量地图
						obj.classList.remove('map-tool-baselayer-color');
						obj.classList.add('map-tool-baselayer');
						clearLayerByID('gaodeimg');
						clearLayerByID('gaodeimga');
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

//TODO 过滤显示被收藏的地灾点、设备点
function showStarMarksOnMap() {

};
//显示所有的地灾点、设备点
function closeStarMarksOnMap() {

};

function showAllDZMarksOnMap() {
	//0所有地灾点
	var results = queryMarkers(0);
	if(results != null && results.length > 0) {
		dzMarkersLayerGroup.clearLayers();
		getDZMarkersLayerGroup(results);
		myMap.addLayer(dzMarkersLayerGroup);
		myMap.fitBounds(warnBounds, {
			maxZoom: maxZoomShow
		});
	} else {
		mui.toast('无查询结果！', {
			duration: 'short',
			type: 'div'
		})
	}
}

//检查地图size变化
function changeMapStatus() {
	myMap.invalidateSize();
	myMap.fitBounds(warnBounds, {
		maxZoom: maxZoomShow
	});
}

function initComentList() {
	setTimeout(function() {
		var html = template('com-ul-li-template', {
			list: commentListData
		});
		document.getElementById("commullist").innerHTML = html;
	}, 500);
}

function initJcsbPictureList() {
	var picsNum = warnjcMarkersData.length;
	var totalPage = parseInt(picsNum / picListPageSize);
	var remNum = picsNum % picListPageSize;
	if(remNum != 0) {
		totalPage = totalPage + 1;
	}

	template.defaults.debug = true
	var html = template('jcsb-pics-list-template', {
		list: warnjcMarkersData,
		pageNum: totalPage,
		pageSize: picListPageSize,
		pageRem: remNum
	});
	//TODO 需要从后台获取数据动态生成
	//	document.getElementById("jcsb-pics-list").innerHTML = html;
}
//显示告警对象
function showWarnDZMarksOnMap() {
	//1所有地灾点，包括报警级别信息
	var results = queryMarkers(1);
	if(results != null && results.length > 0) {
		dzMarkersLayerGroup.clearLayers();
		getDZMarkersLayerGroup(results);
		myMap.addLayer(dzMarkersLayerGroup);
		myMap.fitBounds(warnBounds, {
			maxZoom: maxZoomShow
		});
	} else {
		mui.toast('无查询结果！', {
			duration: 'short',
			type: 'div'
		})
	}
}
//请求后台服务获取不同对象数据
function queryMarkers(markType) {
	switch(markType) {
		case 0:
			return dzMarkersData;
			break;
		case 1:
			return warnDZMarkersData;
			break;
		case 2:
			return warnjcMarkersData;
			break;
		default:
			break;
	}
}
//生成markers并添加到地灾markerlayergroup
function getDZMarkersLayerGroup(results) {
	dzQueryResults = results;
	var latLngsArr = new Array();
	var iconName = 'bullseye';
	var markColor = 'green';
	var level = '';
	for(var i = 0; i < results.length; i++) {
		level = results[i].le;
		markColor = getMarkerColorByWarnLevel(level);
		var iconObj = L.AwesomeMarkers.icon({
			icon: iconName,
			markerColor: markColor,
			prefix: 'fa',
			spin: false
		});
		var mId = results[i].id;
		var mType = results[i].type;
		var mX = results[i].x;
		var mY = results[i].y;
		var mN = results[i].name;
		var mMsg = results[i].msg;
		var markerObj = new L.marker([mX, mY], {
			icon: iconObj,
			title: mId,
			type: mType
		}).bindPopup(mN, {
			closeButton: false
		}).on('click', function(e) {
			showJCMarkerByDZid(mId);
			setFooterContentByInfo(e.target.options.type, e.target.options.title);
			showFooterPanel(footerHeight);
		});
		dzMarkersLayerGroup.addLayer(markerObj);
		latLngsArr.push(markerObj.getLatLng());

	}
	warnBounds = L.latLngBounds(latLngsArr);
}
//根据不同的告警级别获取不同的颜色值
function getMarkerColorByWarnLevel(level) {
	var markColor = '';
	switch(level) {
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
				markColor = 'yellow';
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
	//2查询所有的监测设备，包括报警级别信息，以及归属的地灾点
	var results = queryMarkers(2);
	if(results != null && results.length > 0) {
		jcMarkersLayerGroup.clearLayers();
		getJCMarkersLayerGroup(results);
		myMap.addLayer(jcMarkersLayerGroup);
		myMap.fitBounds(warnBounds, {
			maxZoom: maxZoomShow
		});
	} else {
		mui.toast('无查询结果！', {
			duration: 'short',
			type: 'div'
		})
	}
}
//生成markers并添加到监测设备markerlayergroup
function getJCMarkersLayerGroup(results) {
	jcQueryResults = results;
	var latLngsArr = new Array();
	var iconName = 'camera';
	var markColor = 'purple';
	var level = '';
	for(var i = 0; i < results.length; i++) {
		level = results[i].le;
		markColor = getMarkerColorByWarnLevel(level);
		var mId = results[i].id;
		var mType = results[i].type;
		var mX = results[i].x;
		var mY = results[i].y;
		var mN = results[i].name;
		var mMsg = results[i].msg;
		var iconObj = L.AwesomeMarkers.icon({
			icon: iconName,
			markerColor: markColor,
			prefix: 'fa',
			spin: false
		});

		var markerObj = new L.marker([mX, mY], {
			icon: iconObj,
			title: mId,
			type: mType
		}).bindPopup(mN, {
			closeButton: false
		}).on('click', function(e) {
			setFooterContentByInfo(e.target.options.type, e.target.options.title);
			myMap.flyTo(e.latlng);
			showFooterPanel(footerHeight);
		});
		jcMarkersLayerGroup.addLayer(markerObj);
		latLngsArr.push(markerObj.getLatLng());
	}
	warnBounds = L.latLngBounds(latLngsArr);
}
//设置底部栏的内容，根据点击的地灾点或者设备点
function setFooterContentByInfo(Type, infoID) {
	var tempResults = null;
	var infoT = null;
	if(Type == 'dzd') {
		tempResults = dzQueryResults;
	} else {
		tempResults = jcQueryResults;
	}
	for(var i = 0; i < tempResults.length; i++) {
		if(tempResults[i].id == infoID) {
			infoT = tempResults[i];
			break;
		}
	}
	var html = template('brief-ul-li-template', {
		info: infoT,
		type: Type
	});
	document.getElementById("footer-table").innerHTML = html;

	localStorage.setItem("currentSelectedFeature", JSON.stringify(infoT)); //记录当前选中的要素，用于指导要素详情细分页面跳转
	this.showDetailPanel(infoT);
}

//根据地灾点或监测设备类型显示详情信息，此处为三层分层信息面板
function showDetailPanel(feature) {
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
	var type = feature.type;
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