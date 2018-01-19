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
            isMapDetaiMaximize: false,//属性面板是否最大化
            markerGroup: null,
            LayerGroup: null,
            dzMarkerGroup: new L.layerGroup(),
            jcsbMarkerGroup: new L.layerGroup(),
            quakesList: null,
            devicesList: null,
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
                    Ext.each(dataList, function (data) {
                        if (data != null && data['children'] && data['children'].length > 0) {
                            var dzList = data['children'];
                            if (dzList && dzList.length > 0) {
                                Ext.each(dzList, function (dzData) {
                                    var dzName = dzData['text'];
                                    var dzRank = dzData['rank'];
                                    var mId = dzData['quakeid'];
                                    var mType = 'dzd';
                                    var iconName = 'bullseye';
                                    var markColor = 'green';
                                    var markColor = mv.fn.calcRank(dzRank);
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
                                        mv.fn.dzAreaLine(dzMarker.options.attribution.coordinates);
                                        mv.fn.showJcsbMarkersByDZ(dzMarker.options.attribution);
                                        //显示属性面板
                                        mv.fn.createDetailPanel(mv.v.mapParentId, mv.v.mapDetailPanelParam);

                                        if (mv.v.mapDetailPanel) {
                                            //@TODO 这里的属性信息需要根据地图点击选择地灾点或监测设备进行动态更新
                                            mv.fn.showBasicInfo();
                                        }
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
                                                value: 4,
                                                limit: 4,
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
                        Ext.each(jcsbList, function (jcdbInfo) {
                            var jcName = jcdbInfo['text'];
                            var jcRank = jcdbInfo['rank'];
                            var mId = jcdbInfo['id'];
                            var mType = jcdbInfo['type'];
                            var iconName = 'camera';
                            var markColor = 'purple';
                            var markColor = mv.fn.calcRank(jcRank);
                            var markerIcon = L.AwesomeMarkers.icon({
                                icon: iconName,
                                markerColor: markColor,
                                prefix: 'fa',
                                spin: false
                            });
                            var jcdbPot = [jcdbInfo['lat'], jcdbInfo['lng']];
                            var jcdbMarker = new L.marker(jcdbPot, {
                                icon: markerIcon,
                                draggable: false,
                                title: jcName,
                                type: mType,
                                id: mId,
                                attribution: jcdbInfo//绑定数据
                            });
                            mv.v.jcsbMarkerGroup.addLayer(jcdbMarker);
                            latlngs.push(jcdbMarker.getLatLng());
                        });
                        mv.v.map.addLayer(mv.v.jcsbMarkerGroup);
                        if (latlngs.length > 0) {
                            var bounds = L.latLngBounds(latlngs).pad(0.2);
                            setTimeout(function () {
                                mv.v.map.flyToBounds(bounds, {
                                    maxZoom: mv.v.maxZoomShow
                                });
                            }, 500);
                        }
                    }
                }
            },
            getWarnInfoList: function () {
                var method = 'GET';
                var url = conf.serviceUrl + 'alarms/menu/rank';
                ajax.fn.executeV2('', method, url,
                    function (response) {
                        var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
                        if (result != null && result['data'] != null) {
                            var quakeNum = 0;
                            var deviceNum = 0;
                            var rankList = result['data'];
                            if (rankList['quakeList'] != null) {
                                mv.v.quakesList = rankList['quakeList'];
                            }
                            if (rankList['deviceList'] != null) {
                                mv.v.devicesList = rankList['deviceList'];
                            }
                            mv.fn.setWarnInfo();
                            mv.fn.refreshMarkerColor();
                        }
                    },
                    function (response) {
                        console.log(response);
                    }
                );
            },
            setWarnInfo: function () {
                var quakeNum = mv.v.quakesList == null ? 0 : mv.v.quakesList.length;
                var deviceNum = mv.v.devicesList == null ? 0 : mv.v.devicesList.length;
                var warnInfo = Ext.String.format("当前预警：地灾点{0}个，监测设备{1}个。", quakeNum, deviceNum);
                var warnInfoTextCom = Ext.getCmp('warnInfoText');
                if (warnInfoTextCom) {
                    warnInfoTextCom.setHtml(warnInfo);
                }
            },
            refreshMarkerColor: function () {

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