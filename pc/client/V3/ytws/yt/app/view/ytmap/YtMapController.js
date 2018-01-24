/**
 * Created by LBM on 2017/12/27.
 */
var mv = {
        v: {
            //地图控件是否已经初始化
            isMapAdded: false,
            //mapDivId: null,
            mapParentId: null,
            map: null,
            gaodeVecLayer: null,
            gaodeImageLayer: null,
            gaodeAnnoLayer: null,
            mapToolPanel: null,//地图工具面板
            mapWarnPanel: null,//地灾点预警信息面板
            mapDetailPanel: null,//地灾点或设备详情面板
            mapDetailPanelParam: null,//详情面板浮动参数
            mapDetailPanelInfo: null,//地灾点或设备详情信息
            isMapDetaiMaximize: false,//属性面板是否最大化
            markerGroup: null,
            LayerGroup: null,
            dzMarkerGroup: null,//new L.layerGroup(),
            jcsbMarkerGroup: null,//new L.layerGroup(),
            quakesRankList: null,
            devicesRankList: null,
            highMarker: null,
            maxZoomShow: 16
        },
        fn: {
            initMap: function (mapid) {
                mv.v.map = L.map(mapid, {
                    zoomControl: false,
                    attributionControl: false
                }).fitWorld();

                //默认显示影像地图
                mv.fn.switchBaseLayer('vector');

                mv.v.map.setView(L.latLng(28.23, 117.02), 10);//定位到鹰潭市

                //创建地图工具栏
                mv.fn.createMapToolPanel(mv.v.mapParentId);
                //mv.fn.createWarnTip(mapid);
                mv.fn.createWarnPanel(mv.v.mapParentId);
                mv.fn.getWarnInfoList();
                var refershMarkColor = {
                    run: mv.fn.getWarnInfoList,
                    interval: 1000 * 60 * conf.refreshTime
                };
                //执行预警等级刷新并更新树节点显示状态
                Ext.TaskManager.start(refershMarkColor);
                // mv.fn.setWarnInfo();
            },
            calcRank: function (dzRank) {
                switch (String(dzRank)) {
                    case '4': {
                        markColor = 'red';
                        break;
                    }
                    case '3': {
                        markColor = 'orange';
                        break;
                    }
                    case '2': {
                        markColor = 'purple'; //就是yellow颜色
                        break;
                    }
                    case '1': {
                        markColor = 'blue';
                        break;
                    }
                    case '0': {
                        markColor = 'green';
                        break;
                    }
                    default: {
                        markColor = 'cadetblue';
                        break;
                    }
                }
                return markColor;
            },
            //创建地灾点或设备点
            createMarker: function (dataList) {
                //地灾点
                if (dataList && dataList instanceof Array && dataList.length > 0) {
                    var latlngs = new Array();
                    if (mv.v.dzMarkerGroup != null) {
                        mv.v.dzMarkerGroup.clearLayers();
                    }
                    Ext.each(dataList, function (data) {
                        if (data != null && data['children'] && data['children'].length > 0) {
                            var dzList = data['children'];
                            if (dzList && dzList.length > 0) {
                                Ext.each(dzList, function (dzData) {
                                    var dzName = dzData['text'];
                                    var dzRank = dzData['rank'];
                                    var mId = dzData['code'];
                                    var mType = 'dzd';
                                    var iconName = 'bullseye';
                                    var markColor = 'green';
                                    markColor = mv.fn.calcRank(dzRank);
                                    var markerIcon = L.AwesomeMarkers.icon({
                                        icon: iconName,
                                        markerColor: markColor,
                                        prefix: 'fa',
                                        spin: false
                                    });
                                    var dzPot = [dzData['lat'], dzData['lng']];
                                    var dzMarker = new L.marker(dzPot, {
                                        icon: markerIcon,
                                        draggable: false,
                                        title: dzName,
                                        type: mType,
                                        id: mId,
                                        attribution: dzData//绑定数据
                                    });
                                    dzMarker.on('click', function () {
                                        mv.v.map.flyTo(dzMarker.getLatLng());
                                        mv.v.isMapDetaiMaximize = false;
                                        mv.v.mapDetailPanelParam = {
                                            gapX: 5,
                                            gapY: 40,
                                            bottomY: 5,//底部间隔
                                            w: 300,//数值或百分比，如：100%
                                            h: '100%',//数值或百分比，如：100%
                                            align: 'br' //右下
                                        };
                                        if (mv.v.jcsbMarkerGroup) {
                                            mv.v.jcsbMarkerGroup.clearLayers();
                                        }
                                        mv.fn.showHighMarker(dzMarker);
                                        mv.fn.dzAreaLine(dzMarker.options.attribution.coordinates);
                                        mv.fn.showJcsbMarkersByDZ(dzMarker.options.attribution);

                                        //显示属性面板
                                        mv.fn.markClickShowDetail(dzMarker);
                                    });
                                    mv.v.dzMarkerGroup.addLayer(dzMarker);
                                    latlngs.push(dzMarker.getLatLng());
                                });
                            }
                        }
                    });
                    mv.v.map.addLayer(mv.v.dzMarkerGroup);
                    if (latlngs.length > 0) {
                        var bounds = L.latLngBounds(latlngs).pad(0.2);
                        setTimeout(function () {
                            mv.v.map.flyToBounds(bounds, {
                                maxZoom: mv.v.maxZoomShow
                            });
                        }, 500);
                    }
                }
            },
            markClickShowDetail: function (markObj) {
                mv.fn.createDetailPanel(mv.v.mapParentId, mv.v.mapDetailPanelParam);
                if (mv.v.mapDetailPanel) {
                    //@TODO 这里的属性信息需要根据地图点击选择地灾点或监测设备进行动态更新
                    if (!mv.v.mapDetailPanelInfo || mv.v.mapDetailPanelInfo.code !== markObj.options.attribution.code) {
                        // 如果点击的信息与上次参数不一致才刷新界面，不然不刷新
                        Ext.getCmp('mondataTitleId').setHtml(markObj.options.attribution.text);
                        Ext.getCmp('mondataAddressId').setHtml(); // todo address 没找到对应字段
                        var showMondataType = '';
                        if (markObj.options.attribution.type === 'disasterpoint')
                            showMondataType = '地面塌陷';
                        else if (markObj.options.attribution.type === 'device'){
                            showMondataType = '设备';
                            if( markObj.options.attribution.deviceType === 1 )
                                showMondataType = '位移设备'
                            else if( markObj.options.attribution.deviceType === 2 )
                                showMondataType = '雨量设备'
                            else if( markObj.options.attribution.deviceType === 3 )
                                showMondataType = '裂缝设备'
                        }
                        Ext.getCmp('mondataTypeId').setHtml(showMondataType);

                        Ext.getCmp('mondataRankId').setValue(markObj.options.attribution.rank);
                        Ext.getCmp('mondataRankId').setLimit(markObj.options.attribution.rank);
                        Ext.getCmp('mondataRankId').setMinimum(markObj.options.attribution.rank);
                    }
                    mv.v.mapDetailPanelInfo = markObj.options.attribution;
                    mv.fn.showBasicInfo();
                }
            },
            switchBaseLayer: function (action) {
                if (mv.v.LayerGroup != null) {
                    mv.v.LayerGroup.clearLayers();
                }

                if (action == "image") {
                    if (mv.v.gaodeImageLayer == null) {
                        mv.v.gaodeImageLayer = L.tileLayer.chinaProvider('GaoDe.Satellite.Map', {
                            maxZoom: 18,
                            attribution: 'leaflet',
                            id: 'gaodem'
                        });
                    }

                    if (mv.v.gaodeAnnoLayer == null) {
                        mv.v.gaodeAnnoLayer = L.tileLayer.chinaProvider('GaoDe.Satellite.Annotion', {
                            maxZoom: 18,
                            attribution: 'leaflet',
                            id: 'gaodem'
                        });
                    }
                    mv.v.LayerGroup = L.layerGroup([mv.v.gaodeImageLayer, mv.v.gaodeAnnoLayer]).addTo(mv.v.map);
                } else {
                    if (mv.v.gaodeVecLayer == null) {
                        mv.v.gaodeVecLayer = L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
                            maxZoom: 18,
                            attribution: 'leaflet',
                            id: 'gaodem'
                        });
                    }
                    mv.v.LayerGroup = L.layerGroup([mv.v.gaodeVecLayer]).addTo(mv.v.map);
                }
            },
            mapFullExtent: function () {
                //显示配置文件配置的显示范围
                var fullMapExtent = L.latLngBounds(L.latLng(24.487606414383, 115.572696970468), L.latLng(32.0790331326058, 119.482260921593));
                mv.v.map.fitBounds(fullMapExtent);
            },
            createDetailPanel: function (parentId, floatParams) {
                var parentContainer = Ext.getDom(parentId);
                if (mv.v.mapDetailPanel == null) {
                    mv.v.mapDetailPanel = new Ext.create('Ext.panel.Panel', {
                        renderTo: parentContainer,
                        x: 2000,
                        y: 1000,
                        floating: true,
                        height: 10,
                        width: 10,
                        layout: {
                            type: 'vbox',
                            pack: 'start',
                            align: 'stretch'
                        },
                        items: [
                            /* include child components here */
                            {
                                xtype: 'panel',
                                layout: {
                                    type: 'vbox',
                                    align: 'stretch'
                                },
                                ui: 'mondata-detail-info-panel',
                                items: [
                                    {
                                        xtype: 'container',
                                        layout: {
                                            type: 'hbox',
                                            align: 'middle',
                                            pack: 'center'
                                        },
                                        height: 24,
                                        margin: '3 10 3 10',
                                        items: [
                                            {
                                                xtype: 'component',
                                                flex: 1,
                                                id: 'mondataTitleId',
                                                html: '贵溪市煤矿',
                                                cls: 'mondata-detail-info-title'
                                            },
                                            {
                                                xtype: 'button',
                                                ui: 'mondata-detail-tool-button',
                                                id: 'mondataLocateId',
                                                border: false,
                                                iconCls: 'fa fa-map-marker',
                                                tooltip: '快速定位'
                                            },
                                            {
                                                xtype: 'button',
                                                ui: 'mondata-detail-tool-button',
                                                id: 'mondataCollectId',
                                                margin: '0 0 0 5',
                                                border: false,
                                                iconCls: 'fa fa-star',
                                                tooltip: '快速收藏'
                                            },
                                            {
                                                xtype: 'button',
                                                ui: 'mondata-detail-tool-button',
                                                id: 'mondataMoreId',
                                                margin: '0 0 0 5',
                                                border: false,
                                                iconCls: 'fa fa-plus',
                                                tooltip: '更多信息',
                                                handler: function (btn) {
                                                    //最大化
                                                    if (!mv.v.isMapDetaiMaximize) {
                                                        btn.setIconCls('fa fa-minus');
                                                        btn.setTooltip('基本信息');
                                                        mv.v.mapDetailPanelParam = {
                                                            gapX: 5,
                                                            gapY: 5,//40,
                                                            //bottomY: 5,//底部间隔
                                                            w: '100%',//数值或百分比，如：100%
                                                            h: '100%',//数值或百分比，如：100%
                                                            align: 'br' //右下
                                                        };
                                                        mv.fn.relayoutPanel(parentContainer, mv.v.mapDetailPanel, mv.v.mapDetailPanelParam);
                                                        mv.v.isMapDetaiMaximize = true;
                                                        mv.fn.showMoreInfo();
                                                    } else {
                                                        //最小化
                                                        btn.setIconCls('fa fa-plus');
                                                        btn.setTooltip('更多信息');
                                                        mv.v.mapDetailPanelParam = {
                                                            gapX: 5,
                                                            gapY: 40,
                                                            bottomY: 5,//底部间隔
                                                            w: 300,//数值或百分比，如：100%
                                                            h: '100%',//数值或百分比，如：100%
                                                            align: 'br' //右下
                                                        };
                                                        mv.fn.relayoutPanel(parentContainer, mv.v.mapDetailPanel, mv.v.mapDetailPanelParam);
                                                        mv.v.isMapDetaiMaximize = false;
                                                        mv.fn.showBasicInfo();
                                                    }
                                                }
                                            },
                                            {
                                                xtype: 'button',
                                                ui: 'mondata-detail-tool-button',
                                                id: 'mondataCloseId',
                                                margin: '0 0 0 5',
                                                border: false,
                                                iconCls: 'fa fa-times',
                                                tooltip: '关闭',
                                                handler: function () {
                                                    mv.v.mapDetailPanel.hide();
                                                    mv.v.isMapDetaiMaximize = false;

                                                    //变更按钮状态
                                                    var closeBtn = Ext.getCmp('mondataMoreId');
                                                    if (closeBtn) {
                                                        closeBtn.setIconCls('fa fa-plus');
                                                        closeBtn.setTooltip('更多信息');
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'container',
                                        id: 'monAddressPanelId',
                                        layout: {
                                            type: 'hbox',
                                            align: 'middle',
                                            pack: 'center'
                                        },
                                        margin: '3 10 3 10',
                                        items: [
                                            {
                                                xtype: 'button',
                                                ui: 'mon-detail-image-button',
                                                border: false,
                                                iconCls: 'fa fa-dot-circle-o'
                                            },
                                            {
                                                xtype: 'component',
                                                id: 'mondataAddressId',
                                                flex: 1,
                                                html: '南山大道与火炬大道交叉口东50米'
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'container',
                                        id: 'monTypePanelId',
                                        layout: {
                                            type: 'hbox',
                                            align: 'middle',
                                            pack: 'center'
                                        },
                                        margin: '3 10 3 10',
                                        items: [
                                            {
                                                xtype: 'component',
                                                html: '类型：'
                                            },
                                            {
                                                xtype: 'component',
                                                id: 'mondataTypeId',
                                                flex: 1,
                                                html: '地面塌陷'
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'container',
                                        id: 'monRankPanelId',
                                        layout: {
                                            type: 'hbox',
                                            align: 'middle',
                                            pack: 'center'
                                        },
                                        margin: '3 10 3 10',
                                        items: [
                                            {
                                                xtype: 'component',
                                                html: '等级：'
                                            },
                                            {
                                                xtype: 'rating',
                                                id: 'mondataRankId',
                                                flex: 1,
                                                height: 16,
                                                minimum: 4,
                                                limit: 4,
                                                value: 4,
                                                overStyle: 'color:red;',
                                                selectedStyle: 'color:red;'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                xtype: 'panel',
                                id: 'monWarnPanelId',
                                title: '预警信息',
                                ui: 'map-detail-warnning-panel-ui',
                                iconCls: 'fa fa-exclamation-triangle',
                                layout: {
                                    type: 'vbox',
                                    pack: 'start',
                                    align: 'stretch'
                                },
                                items: [
                                    {
                                        xtype: 'timeline',
                                        cls: 'timline-infoDescription'
                                    }
                                ]
                            },
                            {
                                xtype: 'panel',
                                id: 'monInfoPanelId',
                                title: '监测设备',
                                ui: 'map-detail-warnning-panel-ui',
                                iconCls: 'fa fa-cube',
                                flex: 1
                            },
                            {
                                xtype: 'detailView',
                                id: 'monMoreInfoPanelId',
                                ui: 'map-detail-warnning-panel-ui',
                                hidden: true,
                                iconCls: '',
                                flex: 1
                            }
                        ]
                    });
                }

                //定位面板
                mv.fn.relayoutPanel(parentContainer, mv.v.mapDetailPanel, floatParams);
                mv.v.mapDetailPanel.show();
            },
            showBasicInfo: function () {
                //隐藏更多信息面板
                Ext.getCmp('monMoreInfoPanelId').hide();

                //显示其他基本信息面板
                Ext.getCmp('monAddressPanelId').show();
                Ext.getCmp('monTypePanelId').show();
                Ext.getCmp('monRankPanelId').show();
                Ext.getCmp('monWarnPanelId').show();
                Ext.getCmp('monInfoPanelId').show();
            },
            showMoreInfo: function () {
                //显示更多信息面板
                Ext.getCmp('monMoreInfoPanelId').show();

                //隐藏其他基本信息面板
                Ext.getCmp('monAddressPanelId').hide();
                Ext.getCmp('monTypePanelId').hide();
                Ext.getCmp('monRankPanelId').hide();
                Ext.getCmp('monWarnPanelId').hide();
                Ext.getCmp('monInfoPanelId').hide();

                //@TODO 根据当前选中对象（地灾点或监测设备动态加载详情内容,若显示基本信息面板时，这里的内容没有事先加载，这里需要加载）

            },
            //地图操作
            dzAreaLine: function (points) {
                var pointsT = Ext.decode(points);
                if (pointsT != null && pointsT.length > 2) {
                    var latlngs = new Array();
                    for (var i = 0; i < pointsT.length; i++) {
                        latlngs.push(new L.latLng(pointsT[i].lat, pointsT[i].lng));
                    }
                    var dzAreaLine = L.polygon(latlngs, {
                        color: 'red',
                        weight: 2,
                        opacity: 0.5,
                        fillColor: '#cccccc',
                        fillOpacity: 0.4,
                        fill: true
                    });
                    mv.v.jcsbMarkerGroup.addLayer(dzAreaLine);
                    mv.v.map.addLayer(mv.v.jcsbMarkerGroup);
                }
            },
            showJcsbMarkersByDZ: function (dzInfo) {
                if (dzInfo != null && dzInfo['children'] != null) {
                    var jcsbList = dzInfo['children'];
                    if (jcsbList.length > 0) {
                        var latlngs = new Array();
                        Ext.each(jcsbList, function (jcsbInfo) {
                            var jcName = jcsbInfo['text'];
                            var jcRank = jcsbInfo['rank'];
                            var mId = jcsbInfo['code'];
                            var mType = jcsbInfo['type'];
                            var iconName = 'camera';
                            var markColor = 'purple';
                            var markColor = mv.fn.calcRank(jcRank);
                            var markerIcon = L.AwesomeMarkers.icon({
                                icon: iconName,
                                markerColor: markColor,
                                prefix: 'fa',
                                spin: false
                            });
                            var jcsbPot = [jcsbInfo['lat'], jcsbInfo['lng']];
                            var jcsbMarker = new L.marker(jcsbPot, {
                                icon: markerIcon,
                                draggable: false,
                                title: jcName,
                                type: mType,
                                id: mId,
                                attribution: jcsbInfo//绑定数据
                            });
                            jcsbMarker.on('click', function () {
                                mv.v.map.flyTo(jcsbMarker.getLatLng());
                                mv.v.isMapDetaiMaximize = false;
                                mv.fn.showHighMarker(jcsbMarker);

                                // 显示概要面板
                                mv.fn.markClickShowDetail(jcsbMarker);
                            });
                            mv.v.jcsbMarkerGroup.addLayer(jcsbMarker);
                            latlngs.push(jcsbMarker.getLatLng());
                        });
                        mv.v.map.addLayer(mv.v.jcsbMarkerGroup);
                        mv.fn.refreshMarkerColor();
                        if (latlngs.length > 0) {
                            var bounds = L.latLngBounds(latlngs).pad(0.2);
                            setTimeout(function () {
                                mv.v.map.flyToBounds(bounds, {
                                    maxZoom: mv.v.maxZoomShow
                                });
                            }, 500);
                        }
                    }
                } else {
                    mv.v.map.flyTo([dzInfo['lat'], dzInfo['lng']]);
                }
            },
            showHighMarker: function (markerObj) {
              if(mv.v.highMarker==null){
                  markerObj.setZIndexOffset(100);
                  var pulsingIcon = L.icon.pulse({
                      iconSize: [10, 10],
                      color: '#3385FF',
                      fillColor: '#3385FF',
                      heartbeat: 2
                  });
                  mv.v.highMarker = L.marker(markerObj.getLatLng(), {
                      icon: pulsingIcon
                  }).addTo(mv.v.map);
              }else {
                  mv.v.highMarker.setLatLng(markerObj.getLatLng());
              }
            },
            //按照时间间隔获取地灾点或设备的预警等级
            getWarnInfoList: function () {
                var method = 'GET';
                var url = conf.serviceUrl + 'alarms/menu/rank';
                ajax.fn.executeV2('', method, url,
                    function (response) {
                        var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
                        if (result != null && result['data'] != null) {
                            var rankList = result['data'];
                            if (rankList['quakeList'] != null) {
                                mv.v.quakesRankList = rankList['quakeList'];
                            }
                            if (rankList['deviceList'] != null) {
                                mv.v.devicesRankList = rankList['deviceList'];
                            }
                            //设置地图预警banner信息
                            mv.fn.setWarnInfo();
                            //刷新地图mark显示
                            mv.fn.refreshMarkerColor();
                            //刷新地灾树节点显示
                            mv.fn.refreshMenu4Rank();
                        }
                    },
                    function (response) {
                        console.log(response);
                    }
                );
            },
            setWarnInfo: function () {
                var quakeNum = mv.v.quakesRankList == null ? 0 : mv.v.quakesRankList.length;
                var deviceNum = mv.v.devicesRankList == null ? 0 : mv.v.devicesRankList.length;
                var warnInfo = Ext.String.format("当前预警：地灾点{0}个，监测设备{1}个。", quakeNum, deviceNum);
                var warnInfoTextCom = Ext.getCmp('warnInfoText');
                if (warnInfoTextCom) {
                    warnInfoTextCom.setHtml(warnInfo);
                }
            },
            refreshMarkerColor: function () {
                // 更新地图上的 mark 点
                if (mv.v.dzMarkerGroup != null) {
                    mv.v.dzMarkerGroup.eachLayer(function (dzMarker) {
                        var oldOption = dzMarker.options;
                        var dzName = oldOption['title'];
                        var dzCode = oldOption['id'];
                        var markerIcon = null;
                        Ext.each(mv.v.quakesRankList, function (quakesRankData) {
                            if (quakesRankData.QUAKEID === dzCode) {
                                markerIcon = L.AwesomeMarkers.icon({
                                    icon: 'bullseye',
                                    markerColor: mv.fn.calcRank(quakesRankData.RANK),
                                    prefix: 'fa',
                                    spin: false
                                });
                            }
                        });
                        if (markerIcon) {
                            dzMarker.setIcon(markerIcon);
                        }
                    })
                }
                if (mv.v.jcsbMarkerGroup != null) {
                    mv.v.jcsbMarkerGroup.eachLayer(function (jcsbMarker) {
                        var oldOption = jcsbMarker.options;
                        var jcsbCode = oldOption['id'];
                        var markerIcon = null;
                        Ext.each(mv.v.devicesRankList, function (devicesRankData) {
                            if (devicesRankData.DEVICEID === jcsbCode) {
                                markerIcon = L.AwesomeMarkers.icon({
                                    icon: 'camera',
                                    markerColor: mv.fn.calcRank(devicesRankData.RANK),
                                    prefix: 'fa',
                                    spin: false
                                });
                            }
                        });
                        if (markerIcon) {
                            jcsbMarker.setIcon(markerIcon);
                        }
                    })
                }
            },
            //按照预警等级更新树节点状态
            refreshMenu4Rank: function () {
                //获取左侧菜单树
                var sysTree = Ext.getCmp('dzDataTreeRef');
                var sysTreeStore = sysTree.getStore();
                if (sysTreeStore) {
                    sysTreeStore.each(function (node) {
                        if (node) {
                            //console.log(node.get('iconCls'));
                            var nodeType = node.get('type');
                            //判断当前节点是否为区域
                            if (nodeType != 'region') {
                                if (nodeType == 'disasterpoint') {
                                    //地灾点
                                    if (mv.v.quakesRankList) {
                                        Ext.each(mv.v.quakesRankList, function (nodeRankItem) {
                                            if (nodeRankItem['QUAKEID'] == node.get('code')) {
                                                mv.fn.calcRank4TreeNode(nodeRankItem['RANK'], node, false);
                                                return false;
                                            }
                                        })
                                    }

                                } else if (nodeType == 'device') {
                                    //监测设备
                                    if (mv.v.devicesRankList) {
                                        Ext.each(mv.v.devicesRankList, function (nodeRankItem) {
                                            if (nodeRankItem['DEVICEID'] == node.get('code')) {
                                                mv.fn.calcRank4TreeNode(nodeRankItem['RANK'], node, false);
                                                return false;
                                            }
                                        })
                                    }
                                }
                            }
                        }
                    }, this)
                }
            },
            //根据地灾点树节点等级设置显示图标颜色,isRegionRefresh为true表示包含区域节点刷新，false表示不包含区域节点刷新
            calcRank4TreeNode: function (rank, node, isRegionRefresh) {
                var iconCls = '';

                if (node.get('type') == 'disasterpoint') {
                    iconCls = 'fa fa-plus-square';
                } else if (node.get('type') == 'device') {
                    iconCls = 'fa fa-circle';
                } else if (node.get('type') == 'region' && isRegionRefresh) {
                    iconCls = 'fa fa-table'
                    node.set('iconCls', iconCls);
                }

                if (node.get('type') != 'region') {
                    switch (rank) {
                        case 0:
                            node.set('iconCls', iconCls + ' green-cls');
                            break;
                        case 1:
                            node.set('iconCls', iconCls + ' blue-cls');
                            break;
                        case 2:
                            node.set('iconCls', iconCls + ' yellow-cls');
                            break;
                        case 3:
                            node.set('iconCls', iconCls + ' orange-cls');
                            break;
                        case 4:
                            node.set('iconCls', iconCls + ' red-cls');
                            break;
                    }
                }

                //node.load();
            },
            //属性面板布局重绘
            relayoutPanel: function (parentContainer, childContainer, floatParams) {
                var w = floatParams['w'];
                var h = floatParams['h'];

                var align = floatParams['align'];
                var offsetX = floatParams['gapX'];
                var offsetY = floatParams['gapY'];
                var bottomOffsetY = floatParams['bottomY'];

                if (typeof (w) == 'string' && w.indexOf('%') > -1) {
                    w = parentContainer.clientWidth * parseFloat(w.substr(0, w.indexOf('%'))) / 100 - 2 * offsetX;
                }

                if (typeof (h) == 'string' && h.indexOf('%') > -1) {
                    if (bottomOffsetY == null) {
                        h = parentContainer.clientHeight * parseFloat(h.substr(0, h.indexOf('%'))) / 100 - 2 * offsetY;
                    } else {
                        h = parentContainer.clientHeight * parseFloat(h.substr(0, h.indexOf('%'))) / 100 - offsetY - bottomOffsetY;
                    }
                }

                childContainer.setWidth(w);
                childContainer.setHeight(h);

                switch (align) {
                    case 'tl': {
                        childContainer.el.alignTo(parentContainer, "tl?", [offsetX, offsetY], true);
                        break;
                    }
                    case 'bl': {
                        offsetY = parentContainer.clientHeight - offsetY - h;
                        childContainer.el.alignTo(parentContainer, "tl?", [offsetX, offsetY], true);
                        break;
                    }
                    case 'tr': {
                        offsetX = parentContainer.clientWidth - offsetX - w;
                        childContainer.el.alignTo(parentContainer, "tl?", [offsetX, offsetY], true);
                        break;
                    }
                    case 'br': {
                        offsetX = parentContainer.clientWidth - offsetX - w;
                        if (bottomOffsetY == null) {
                            offsetY = parentContainer.clientHeight - offsetY - h;
                        } else {
                            offsetY = parentContainer.clientHeight - h - bottomOffsetY;
                        }
                        childContainer.el.alignTo(parentContainer, "tl?", [offsetX, offsetY], true);
                        break;
                    }
                }
            },
            createWarnPanel: function (parentId) {
                var parentContainer = Ext.getDom(parentId);
                if (mv.v.mapWarnPanel != null) {
                    return;
                } else {
                    mv.v.mapWarnPanel = new Ext.create('Ext.panel.Panel', {
                        renderTo: parentContainer,
                        x: -0,
                        y: 5,
                        ui: 'map-warn-panel-ui',
                        floating: true,
                        height: 30,
                        width: 300,
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                            pack: 'center'
                        },
                        items: [
                            {
                                xtype: 'container',
                                id: 'warnInfoText',
                                html: ''
                            }
                        ]
                    })
                }
                var offsetX = parentContainer.clientWidth - mv.v.mapWarnPanel.el.dom.clientWidth - 5;
                var offsetY = 5;
                mv.v.mapWarnPanel.el.alignTo(parentContainer, "tl?", [offsetX, offsetY], true);
                mv.v.mapWarnPanel.updateLayout();

            },
            createMapToolPanel: function (parentId) {
                if (mv.v.mapToolPanel != null) {
                    return;
                } else {
                    var parentContainer = Ext.getDom(parentId);
                    mv.v.mapToolPanel = new Ext.create('Ext.container.Container', {
                        renderTo: parentContainer,
                        x: -500,
                        y: -100,
                        floating: true,
                        bodyStyle: 'opacity:0.9; filter: Alpha(Opacity=90);',
                        height: 30,
                        layout: {
                            type: 'hbox',
                            pack: 'start',
                            align: 'stretch'
                        },
                        defaults: {
                            border: false,
                            ui: 'map-tool-ui',
                            scale: 'medium'
                        },
                        items: [
                            {
                                xtype: 'button',
                                tooltip: '关闭左侧面板',
                                text: '',
                                action: 'controllleftpanel',
                                iconCls: 'fa fa-caret-left'
                            },
                            {
                                xtype: 'button',
                                tooltip: '全屏显示',
                                text: '全屏',
                                action: 'fullScreen',
                                pressed: false,
                                enableToggle: true,
                                iconCls: 'fa fa-window-maximize'
                            },
                            {
                                xtype: 'button',
                                tooltip: '地图全幅',
                                text: '全幅',
                                iconCls: 'fa fa-globe',
                                handler: function () {
                                    //地图全幅显示
                                    mv.fn.mapFullExtent();
                                }
                            }, {
                                xtype: 'component',
                                width: 1,
                                height: 30,
                                style: 'background-color:rgba(250, 250, 250,1.0);'
                            },
                            {
                                xtype: 'segmentedbutton',
                                defaults: {
                                    border: false,
                                    ui: 'map-tool-ui',
                                    scale: 'medium'
                                }
                                ,
                                items: [{
                                    xtype: 'button',
                                    action: 'image',
                                    text: '影像',
                                    iconCls: 'fa fa-picture-o'
                                }, {
                                    xtype: 'button',
                                    action: 'vector',
                                    pressed: true,
                                    text: '矢量',
                                    iconCls: 'fa fa-map'
                                }],
                                listeners: {
                                    toggle: function (container, button, pressed) {
                                        if (pressed) {
                                            var action = button['action'];
                                            mv.fn.switchBaseLayer(action);
                                        }
                                    }
                                }
                            }
                        ]
                    })
                }
                mv.v.mapToolPanel.el.alignTo(parentContainer, "tl?", [5, 5], true);
                mv.v.mapToolPanel.updateLayout();
            },
            refreshLayout: function (id) {
                var parentContainer = Ext.getDom(id);
                if (mv.v.mapToolPanel) {
                    mv.v.mapToolPanel.el.alignTo(parentContainer, "tl?", [5, 5], true);
                }

                if (mv.v.mapWarnPanel) {
                    var offsetX = parentContainer.clientWidth - mv.v.mapWarnPanel.el.dom.clientWidth - 5;
                    var offsetY = 5;
                    mv.v.mapWarnPanel.el.alignTo(parentContainer, "tl?", [offsetX, offsetY], true);
                }

                if (mv.v.mapDetailPanel && mv.v.mapDetailPanelParam) {
                    mv.fn.relayoutPanel(parentContainer, mv.v.mapDetailPanel, mv.v.mapDetailPanelParam);
                }
            }
        }
    }
;

Ext.define('yt.view.ytmap.YtMapController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.map',

    /**
     * Called when the view is created
     */
    init: function () {
        mv.v.dzMarkerGroup = new L.layerGroup();
        mv.v.jcsbMarkerGroup = new L.layerGroup();
    },
    afterlayout: function () {
        if (!mv.v.isMapAdded) {
            mv.v.isMapAdded = true;
            mv.v.mapDivId = 'mapContainerId';
            mv.v.mapParentId = 'mapParentContainerId';//地图父容器ID
            mv.fn.initMap(mv.v.mapDivId);
        }

        if (mv.v.map) {
            mv.v.map.invalidateSize();
        }

        mv.fn.refreshLayout(mv.v.mapParentId);
    }
});