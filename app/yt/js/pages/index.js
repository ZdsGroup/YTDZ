var myMap = null;
//地图上显示地灾对象图层	
var dzMarkersLayerGroup = new L.layerGroup();
var dzQueryResults = null;
//底图上显示监测设备对象图层
var jcMarkersLayerGroup = new L.layerGroup();
var jcQueryResults = null;
var warnBounds = null;
var maxZoomShow = 16;
var footerHeight = 101;
var topNavHeight = 25; //手机顶部状态栏高度
var picListPageSize = 3;
var scroller = null;
var jcsbMaxZoomShow = 14;
var warnInfoIsShow = false;
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
		hideFooterPanel();
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
			me.hideFooterPanel(0);
			changeMapStatus();
		}
	});

	showWarnDZMarksOnMap();
	
	//监测设备根据不同的地图级别进行显示隐藏
	myMap.on('zoomend zoomlevelschange', function(e) {
		var curLel = myMap.getZoom();
		if(curLel < jcsbMaxZoomShow) {
			myMap.removeLayer(jcMarkersLayerGroup);
		} else {
			if(myMap.hasLayer(jcMarkersLayerGroup) == false) {
				myMap.addLayer(jcMarkersLayerGroup);
			}
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

//查询后台服务器，获取警告信息汇总
function queryWarnInfo() {
	var dzNum = 0;
	var jcsbNum = 0;
	if(dzQueryResults){
		var quakerArr = dzQueryResults.quakes;
		var devicesArr = dzQueryResults.devices;
		for (var i = 0; i < quakerArr.length; i++) {
			if(quakerArr[i].rank > 0 ){
				dzNum++;
			}
		}
		for (var i = 0; i < devicesArr.length; i++) {
			if(devicesArr[i].rank > 0 ){
				jcsbNum++;
			}
		}
	}
	var info = '今日报警：地灾点' + dzNum + '个，监测设备'+jcsbNum+'个';
	if(dzNum == 0 && jcsbNum == 0){
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

	//监测设备图文轮播事件
	mui(".mui-media").on('tap', 'img', function(evt) {
		var info = evt.target.title;
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

//TODO 过滤显示被收藏的地灾点、设备点
function showStarMarksOnMap() {

};
//显示所有的地灾点、设备点
function closeStarMarksOnMap() {

};

function showAllDZMarksOnMap() {
	dzMarkersLayerGroup.clearLayers();
	if(dzQueryResults){
		getDZMarkersLayerGroup(dzQueryResults.quakes, false);
		myMap.addLayer(dzMarkersLayerGroup);
	}else{
		var action = "quakes/all";
		mui.myMuiQuery(action, '',
			function(results){
				if(results != null && results.data.quakes.length > 0) {
					dzQueryResults = results.data;
					getDZMarkersLayerGroup(dzQueryResults.quakes, false);
					myMap.addLayer(dzMarkersLayerGroup);
				} else {
					mui.myMuiQueryNoResult('查询无结果！');
					dzQueryResults = null;
				}
			},
			function(){
				mui.myMuiQueryErr('查询失败，请稍后再试！');
				dzQueryResults = null;
			}
		)
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
	dzMarkersLayerGroup.clearLayers();
	if(dzQueryResults){
		getDZMarkersLayerGroup(dzQueryResults.quakes, true);
		myMap.addLayer(dzMarkersLayerGroup);
	}else{
		var action = "quakes/all";
		mui.myMuiQuery(action, '',
			function(results){
				if(results != null && results.data.quakes.length > 0) {
					dzQueryResults = results.data;
					getDZMarkersLayerGroup(dzQueryResults.quakes, true);
					myMap.addLayer(dzMarkersLayerGroup);
					if(!warnInfoIsShow){
						showWarnInfoOnMap();
						warnInfoIsShow = true;
					}
				} else {
					mui.myMuiQueryNoResult('查询无结果！');
					dzQueryResults = null;
				}
			},
			function(){
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
		if(isWarn == false){
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
		var picker = mui.parseJSON(results[i].attr)[0];
		var mX = picker.latitude;
		var mY = picker.longitude;
		var mN = results[i].name;
		var markerObj = new L.marker([mX, mY], {
			icon: iconObj,
			title: mN,
			type: mType,
			id: mId
		}).bindPopup(mN, {
			closeButton: false
		}).on('click', function(e) {
			showJCMarkerByDZid(e.target.options.id);
			setFooterContentByInfo(e.target.options.type, e.target.options.id);
			showFooterPanel(footerHeight);
		});
		dzMarkersLayerGroup.addLayer(markerObj);
		latLngsArr.push(markerObj.getLatLng());
	}
	if(latLngsArr.length > 0) {
		warnBounds = L.latLngBounds(latLngsArr);
		setTimeout(function() {
			myMap.fitBounds(warnBounds, {
				maxZoom: maxZoomShow
			});
		}, 500);
	}
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
	if(dzID !=null &&dzQueryResults !=null){
		jcMarkersLayerGroup.clearLayers();
		var devicesArr = dzQueryResults.devices;
		var tempArr =new Array();
		for (var i = 0; i < devicesArr.length; i++) {
			if(devicesArr[i].quakeid == dzID){
				tempArr.push(devicesArr[i]);
			}
		}
		getJCMarkersLayerGroup(tempArr);
		myMap.addLayer(jcMarkersLayerGroup);
	}
}
//生成markers并添加到监测设备markerlayergroup
function getJCMarkersLayerGroup(results) {
	var latLngsArr = new Array();
	var iconName = 'camera';
	var markColor = 'purple';
	var level = '';
	for(var i = 0; i < results.length; i++) {
		level = results[i].rank;
		markColor = getMarkerColorByWarnLevel(level);
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
			id: mId
		}).bindPopup(mN, {
			closeButton: false
		}).on('click', function(e) {
			setFooterContentByInfo(e.target.options.type, e.target.options.id);
			myMap.flyTo(e.latlng);
			showFooterPanel(footerHeight);
		});
		jcMarkersLayerGroup.addLayer(markerObj);
		latLngsArr.push(markerObj.getLatLng());
	}
	warnBounds = L.latLngBounds(latLngsArr);
	if(latLngsArr.length > 0) {
		setTimeout(function() {
			myMap.flyToBounds(warnBounds, {
				maxZoom: maxZoomShow
			});
		}, 500);
	}
}
//设置底部栏的内容，根据点击的地灾点或者设备点
function setFooterContentByInfo(Type, infoID) {
	var tempResults = null;
	var infoT = null;
	if(Type == 'dzd') {
		tempResults = dzQueryResults.quakes;
	} else {
		tempResults = dzQueryResults.devices;

		var jcsbhtml = template('jczb-ul-li-template', {
			type: Type
		});
		//释放事件监听
		mui('#jcsb-jczb-list').off('tap', 'li');
		document.getElementById("jcsb-jczb-list").innerHTML = jcsbhtml;
		mui(".mui-slider").slider();
		mui('#jcsb-jczb-list').on('tap', 'li', function(evt) {
			var selectedFeature = JSON.parse(localStorage.getItem('currentSelectedFeature')); //获取当前选中要素
			var currentPid = this.getAttribute('title');
			var type = this.getAttribute('tp');
			var preUrl = "pages/jcsb/";
			var info = {
				url: preUrl,
				extras: {
					pageId: currentPid,
					pageFeature: selectedFeature
				}
			};
			if(type == "lfjc") {
				info.url += 'lfjc.html';
				info.id = 'lfjc-analy-detail';
			} else if(type == "bmwyjc") {
				info.url += 'bmwyjc.html';
				info.id = 'bmwyjc-analy-detail';
			} else if(type == "yljc") {
				info.url += 'yljc.html';
				info.id = 'yljc-analy-detail';
			}
			mui.openWindow(info);
		});
	}
	for(var i = 0; i < tempResults.length; i++) {
		var checkId = null;
		if(Type == 'dzd') {
			checkId = tempResults[i].quakeid;
		}else{
			checkId = tempResults[i].deviceid;
		}
		if(checkId == infoID) {
			infoT = tempResults[i];
			break;
		}
	}
	var html = template('brief-ul-li-template', {
		info: infoT,
		type: Type
	});
	document.getElementById("footer-table").innerHTML = html;

	localStorage.setItem("currentSelectedFeature", JSON.stringify(infoT,Type)); //记录当前选中的要素，用于指导要素详情细分页面跳转
	this.showDetailPanel(infoT,Type);
}

//根据地灾点或监测设备类型显示详情信息，此处为三层分层信息面板
function showDetailPanel(feature,type) {
//	debugger
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