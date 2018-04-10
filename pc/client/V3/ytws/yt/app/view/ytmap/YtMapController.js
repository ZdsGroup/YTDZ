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
            jcsbMaxZoomShow: 15,
            maxZoomShow: 16,
            selDzMarker: null,

            detailAddressTooltips: null
        },
        fn: {
            initMap: function (mapid) {
                if( IS_OUTER_NET ){
                    // 是外网地址
                    mv.v.map = L.map(mapid, {
                        zoomControl: false,
                        attributionControl: false
                    }).fitWorld();
                } else {
                    // 内网地址
                    mv.v.map = L.map(mapid, {
                        crs: L.CRS.EPSG4326,
                        zoomControl: false,
                        attributionControl: false,
                        center: [0, 0],
                        maxZoom: 18,
                        zoom: 1
                    }).fitWorld();
                }

                //默认显示影像地图
                mv.fn.switchBaseLayer('vector');

                mv.v.map.flyTo(L.latLng(28.23, 117.02), 10);//定位到鹰潭市
                // 渲染鹰潭市的行政边界
                var allbounds = new yt.conf.Bounds();
                L.geoJson(allbounds.YTBounds).addTo(mv.v.map);

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
                //地灾点以及监测设备根据不同的地图级别进行显示隐藏
                mv.v.map.on('zoomend', function () {
                    var curLel = mv.v.map.getZoom();
                    if (curLel < mv.v.jcsbMaxZoomShow) {
                        if (mv.v.map.hasLayer(mv.v.jcsbMarkerGroup) == true) {
                            mv.v.map.removeLayer(mv.v.jcsbMarkerGroup);
                        }
                        if (mv.v.selDzMarker != null && mv.v.dzMarkerGroup != null) {
                            mv.v.dzMarkerGroup.addLayer(mv.v.selDzMarker);
                            mv.fn.showHighMarker(mv.v.selDzMarker);
                        }
                    } else {
                        if (mv.v.map.hasLayer(mv.v.jcsbMarkerGroup) == false) {
                            mv.v.map.addLayer(mv.v.jcsbMarkerGroup);
                        }
                        if (mv.v.selDzMarker != null && mv.v.dzMarkerGroup != null && mv.v.map.hasLayer(mv.v.selDzMarker) == true) {
                            mv.v.dzMarkerGroup.removeLayer(mv.v.selDzMarker);
                            if (mv.v.highMarker) {
                                mv.v.map.removeLayer(mv.v.highMarker);
                            }
                        }
                    }
                });
                // mv.fn.setWarnInfo();
            },
            // 计算rank对应的颜色
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
                                            w: 350,//数值或百分比，如：100%
                                            h: 250, //地灾点-250，监测设备-172，'100%',//数值或百分比，如：100%
                                            align: 'tr' //右上
                                        };
                                        if (mv.v.jcsbMarkerGroup) {
                                            mv.v.jcsbMarkerGroup.clearLayers();
                                        }
                                        if (mv.v.selDzMarker) {
                                            mv.v.dzMarkerGroup.addLayer(mv.v.selDzMarker);
                                        }
                                        mv.v.selDzMarker = dzMarker;
                                        // mv.fn.showHighMarker(dzMarker);
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
                    // if (latlngs.length > 0) {
                    //     var bounds = L.latLngBounds(latlngs).pad(0.2);
                    //     setTimeout(function () {
                    //         mv.v.map.flyToBounds(bounds, {
                    //             maxZoom: mv.v.maxZoomShow
                    //         });
                    //     }, 500);
                    // }
                }
            },
            markClickShowDetail: function (markObj) {
                var showMondataType = mv.fn.calcParamByType(markObj.options.attribution);
                mv.fn.createDetailPanel(mv.v.mapParentId, mv.v.mapDetailPanelParam);
                if (mv.v.mapDetailPanel) {
                    if (!mv.v.mapDetailPanelInfo || mv.v.mapDetailPanelInfo.code !== markObj.options.attribution.code) {
                        // 如果点击的信息与上次参数不一致才刷新界面，不然不刷新
                        mv.fn.switchSummarypanel(markObj.options.attribution, showMondataType);
                    }
                    mv.v.mapDetailPanelInfo = markObj.options.attribution;
                    mv.fn.showBasicInfo();
                }
            },
            //切换概要信息面板
            switchSummarypanel: function (data, type) {
                // 查询对应的详细信息，然后设置承担单位。负责人，还有运行状态
                var action = '';
                if (data.type === 'disasterpoint') {
                    action = 'quakes/' + data.code.toString();
                }
                else if (data.type === 'device') {
                    action = 'devices/' + data.code.toString();
                }
                var params = {
                    hours: 24,   // 默认查询24小时之前的预警信息
                    userid: g.v.userId
                }
                var meView = mv.v.mapDetailPanel;
                var mask = ajax.fn.showMask(meView, '数据加载中...');

                function successCalBack(response, opts) {
                    ajax.fn.hideMask(mask);
                    var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
                    if (result['code'] !== 0) return;// 返回结果 code 为 0 正常，否则不正常
                    if (data.type === 'device') {
                        Ext.getCmp('mondataStatusId').setHtml('运行状态： ' + (result.data.runstatus === 1 ? '异常' : '正常'));// 运行状态
                    } else if (data.type === 'disasterpoint') {
                        // todo 设置收藏状态
                        Ext.getCmp('mondataCollectId').setIconCls('fa fa-heart favoStatus');
                        Ext.getCmp('mondataCollectId').setTooltip('快速收藏');
                        if (result.data.favostatus === 1) {
                            Ext.getCmp('mondataCollectId').setIconCls('fa fa-heart');
                            Ext.getCmp('mondataCollectId').setTooltip('取消收藏');
                        }
                    }
                    Ext.getCmp('mondataCompanyId').setHtml(result.data.company);// 设置承担单位
                    Ext.getCmp('mondataUserNameId').setHtml(result.data.username);// 设置负责人
                    // 预警信息统计信息
                    var warmPanel = Ext.getCmp('monWarnPanelId');
                    warmPanel.down('button[action=warn-red]').setText("红色预警<br/>" + (result.data.alarmLevel['4']));
                    warmPanel.down('button[action=warn-orange]').setText("橙色预警<br/>" + (result.data.alarmLevel['3']));
                    warmPanel.down('button[action=warn-yellow]').setText("黄色预警<br/>" + (result.data.alarmLevel['2']));
                    warmPanel.down('button[action=warn-blud]').setText("蓝色预警<br/>" + (result.data.alarmLevel['1']));
                }

                function failureCallBack(response, opts) {
                    ajax.fn.hideMask(mask);
                };
                ajax.fn.executeV2(params, 'GET', conf.serviceUrl + action, successCalBack, failureCallBack);

                Ext.getCmp('mondataTitleId').setHtml(data.text);// 设置标题
                // 设置地址的tooltips
                if(!mv.v.detailAddressTooltips){
                    mv.v.detailAddressTooltips = Ext.create('Ext.tip.ToolTip', {
                        target: 'mondataAddressId'
                    });
                }
                var addressComponent = Ext.getCmp('mondataAddressId');// 设置地址
                if(data.address.toString().length === 0){
                    addressComponent.setHtml('暂无地址信息');
                    mv.v.detailAddressTooltips.setHtml('暂无地址信息');
                } else if(data.address.toString().length > 19){
                    var showAddress = data.address.toString().slice(0,19) + '...';
                    addressComponent.setHtml(showAddress);
                    mv.v.detailAddressTooltips.setHtml(data.address.toString());
                } else {
                    addressComponent.setHtml(data.address);
                    mv.v.detailAddressTooltips.setHtml(data.address.toString());
                }
                // Ext.getCmp('mondataTypeId').setHtml(type);// 设置类型
                mv.fn.calcRank4FeaturePanel(data.rank);// 设置预警等级
                // 监测设备统计信息
                var devicePanel = Ext.getCmp('monInfoPanelId');
                devicePanel.down('button[action=lfjc]').setText("裂缝监测<br/>" + (data.hasOwnProperty('crevDeviceNum') ? data.crevDeviceNum.toString() : '0'));
                devicePanel.down('button[action=bmwyjc]').setText("表面位移监测<br/>" + (data.hasOwnProperty('weiyiDeviceNum') ? data.weiyiDeviceNum.toString() : '0'));
                devicePanel.down('button[action=yljc]').setText("雨量监测<br/>" + (data.hasOwnProperty('rainDeviceNum') ? data.rainDeviceNum.toString() : '0'));
            },
            //根据类型计算相关参数并返回类型
            calcParamByType: function (data) {
                var showMondataType = '';
                var w = mv.v.mapDetailPanelParam['w'];
                if (data.type === 'disasterpoint') {
                    showMondataType = '地灾点';//统一类型为地灾点
                    //判断是否最大化属性面板
                    if (w < 400) {
                        mv.v.mapDetailPanelParam['h'] = 286;
                    }
                }
                else if (data.type === 'device') {
                    showMondataType = '监测设备';
                    if (w < 400) {
                        mv.v.mapDetailPanelParam['h'] = 220;
                    }
                    if (data.deviceType === 1)
                        showMondataType = '位移设备'
                    else if (data.deviceType === 2)
                        showMondataType = '雨量设备'
                    else if (data.deviceType === 3)
                        showMondataType = '裂缝设备'
                }

                return showMondataType;
            },
            // 切换底图
            switchBaseLayer: function (action) {
                if (mv.v.LayerGroup != null) {
                    mv.v.LayerGroup.clearLayers();
                }

                if( IS_OUTER_NET ){
                    // 如果为外网地址
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
                    } else if (action == "vector") {
                        if (mv.v.gaodeVecLayer == null) {
                            mv.v.gaodeVecLayer = L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
                                maxZoom: 18,
                                attribution: 'leaflet',
                                id: 'gaodem'
                            });
                        }
                        mv.v.LayerGroup = L.layerGroup([mv.v.gaodeVecLayer]).addTo(mv.v.map);
                    }

                } else {
                    // 如果为内网地址
                    if (action == "image") {
                        if (mv.v.gaodeImageLayer == null) {
                            mv.v.gaodeImageLayer = L.supermap.tiledMapLayer("http://17.112.24.6:8090/iserver/services/map-YX_YZT/rest/maps/YTGQSD");
                        }
                        mv.v.LayerGroup = L.layerGroup([mv.v.gaodeImageLayer]).addTo(mv.v.map);
                    } else if (action == "vector") {
                        if (mv.v.gaodeVecLayer == null) {
                            mv.v.gaodeVecLayer = L.supermap.tiledMapLayer("http://17.112.24.6:8090/iserver/services/map-YT_YZT/rest/maps/XZQ");
                        }
                        mv.v.LayerGroup = L.layerGroup([mv.v.gaodeVecLayer]).addTo(mv.v.map);
                    }
                }
            },
            mapFullExtent: function () {
                //显示配置文件配置的显示范围
                var fullMapExtent = L.latLngBounds(L.latLng(24.487606414383, 115.572696970468), L.latLng(32.0790331326058, 119.482260921593));
                mv.v.map.fitBounds(fullMapExtent);
            },
            //创建详情面板
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
                                            // {
                                            //     xtype: 'button',
                                            //     ui: 'mondata-detail-tool-button',
                                            //     id: 'mondataLocateId',
                                            //     border: false,
                                            //     iconCls: 'fa fa-map-marker',
                                            //     tooltip: '快速定位',
                                            //     handler: function () {
                                            //         // 此时面板展开，
                                            //         if (mv.v.mapDetailPanelInfo) {
                                            //             var detailInfo = mv.v.mapDetailPanelInfo;
                                            //             if (detailInfo.hasOwnProperty('lat') && detailInfo.hasOwnProperty('lng')) {
                                            //                 var detailInfoLatLng = new L.latLng(detailInfo.lat, detailInfo.lng);
                                            //                 mv.v.map.flyTo(detailInfoLatLng, mv.v.maxZoomShow);
                                            //             }
                                            //         }
                                            //     }
                                            // },
                                            {
                                                xtype: 'button',
                                                ui: 'mondata-detail-tool-button',
                                                id: 'mondataCollectId',
                                                margin: '0 0 0 5',
                                                border: false,
                                                iconCls: 'fa fa-heart',
                                                tooltip: '快速收藏',
                                                handler: function () {
                                                    // 只有地灾点有收藏功能
                                                    var action = 'userfavos';
                                                    var params = {
                                                        userid: g.v.userId,
                                                        quakeid: mv.v.mapDetailPanelInfo.code
                                                    }

                                                    function successCallBack(response, opts) {
                                                        var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);

                                                        if (!result.data) return;
                                                        // todo 设置收藏状态
                                                        var favoBtn = Ext.getCmp('mondataCollectId');
                                                        if (result.data.status === 1) {
                                                            favoBtn.setIconCls('fa fa-heart');
                                                            favoBtn.setTooltip('取消收藏');
                                                        } else {
                                                            favoBtn.setIconCls('fa fa-heart favoStatus');
                                                            favoBtn.setTooltip('快速收藏');
                                                        }
                                                    }

                                                    ajax.fn.executeV2(params, 'POST', conf.serviceUrl + action, successCallBack, null);
                                                }
                                            },
                                            {
                                                xtype: 'button',
                                                ui: 'mondata-detail-tool-button',
                                                id: 'mondataMoreId',
                                                margin: '0 0 0 5',
                                                border: false,
                                                iconCls: 'fa fa-window-maximize',
                                                tooltip: '更多信息',
                                                handler: function (btn) {

                                                    //最大化
                                                    if (!mv.v.isMapDetaiMaximize) {
                                                        btn.setIconCls('fa fa-window-restore');
                                                        btn.setTooltip('基本信息');
                                                        mv.v.mapDetailPanelParam = {
                                                            gapX: 5,
                                                            gapY: 5,//40,
                                                            //bottomY: 5,//底部间隔
                                                            w: '100%',//数值或百分比，如：100%
                                                            h: '100%',//数值或百分比，如：100%
                                                            align: 'tr' //右上
                                                        };
                                                        mv.fn.relayoutPanel(parentContainer, mv.v.mapDetailPanel, mv.v.mapDetailPanelParam);
                                                        mv.v.isMapDetaiMaximize = true;
                                                        mv.fn.showMoreInfo();
                                                    } else {


                                                        //最小化
                                                        btn.setIconCls('fa fa-window-maximize');
                                                        btn.setTooltip('更多信息');
                                                        mv.v.mapDetailPanelParam = {
                                                            gapX: 5,
                                                            gapY: 40,
                                                            bottomY: 5,//底部间隔
                                                            w: 350,//数值或百分比，如：100%
                                                            h: '100%',//数值或百分比，如：100%
                                                            align: 'tr' //右上
                                                        };
                                                        if (mv.v.mapDetailPanelInfo) {
                                                            mv.fn.calcParamByType(mv.v.mapDetailPanelInfo);
                                                        }

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
                                                        closeBtn.setIconCls('fa fa-window-maximize');
                                                        closeBtn.setTooltip('更多信息');
                                                    }

                                                    //初始化详情面板参数
                                                    mv.v.mapDetailPanelParam = {
                                                        gapX: 5,
                                                        gapY: 40,
                                                        bottomY: 5,//底部间隔
                                                        w: 350,//数值或百分比，如：100%
                                                        h: '100%',//数值或百分比，如：100%
                                                        align: 'tr' //右上
                                                    };
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
                                                margin: '0 0 0 5',
                                                flex: 1,
                                                html: '南山大道与火炬大道交叉口东50米'
                                            }
                                        ]
                                    },
                                    // {
                                    //     xtype: 'container',
                                    //     id: 'monTypePanelId',
                                    //     layout: {
                                    //         type: 'hbox',
                                    //         align: 'middle',
                                    //         pack: 'center'
                                    //     },
                                    //     margin: '3 10 3 10',
                                    //     items: [
                                    //         {
                                    //             xtype: 'component',
                                    //             html: '类型：'
                                    //         },
                                    //         {
                                    //             xtype: 'component',
                                    //             id: 'mondataTypeId',
                                    //             flex: 1,
                                    //             html: ''//地面塌陷
                                    //         }
                                    //     ]
                                    // },
                                    {
                                        xtype: 'container',
                                        id: 'mondataCompanyPanelId',
                                        layout: {
                                            type: 'hbox',
                                            align: 'middle',
                                            pack: 'center'
                                        },
                                        margin: '3 10 3 10',
                                        items: [
                                            {
                                                xtype: 'component',
                                                html: '承担单位： '
                                            },
                                            {
                                                xtype: 'component',
                                                id: 'mondataCompanyId',
                                                flex: 1,
                                                html: '鹰潭市国土资源局'
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'container',
                                        id: 'mondataUserNamePanelId',
                                        layout: {
                                            type: 'hbox',
                                            align: 'middle',
                                            pack: 'center'
                                        },
                                        margin: '3 10 3 10',
                                        items: [
                                            {
                                                xtype: 'component',
                                                html: '负责人： '
                                            },
                                            {
                                                xtype: 'component',
                                                id: 'mondataUserNameId',
                                                flex: 1,
                                                html: '张云'
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'container',
                                        id: 'mondataStatusPanelId',
                                        layout: {
                                            type: 'hbox',
                                            align: 'middle',
                                            pack: 'center'
                                        },
                                        margin: '3 10 3 10',
                                        items: [
                                            {
                                                xtype: 'component',
                                                id: 'mondataStatusId',
                                                flex: 1,
                                                html: ''
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
                                margin: '1 0 0 0',
                                title: '预警信息统计',
                                ui: 'map-detail-warnning-panel-ui',
                                layout: {
                                    type: 'hbox',
                                    align: 'middle',
                                    pack: 'center'
                                },
                                items: [
                                    {
                                        xtype: 'button',
                                        action: 'warn-red',
                                        ui: 'button-red-ui',
                                        text: '红色预警<br/>50',
                                        flex: 1,
                                        listeners: {
                                            click: function (btn, evt) {
                                                mv.fn.switchWarnPanel(btn, evt, '红色预警');
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'button',
                                        action: 'warn-orange',
                                        ui: 'button-orange-ui',
                                        text: '橙色预警<br/>50',
                                        flex: 1,
                                        listeners: {
                                            click: function (btn, evt) {
                                                mv.fn.switchWarnPanel(btn, evt, '橙色预警');
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'button',
                                        action: 'warn-yellow',
                                        ui: 'button-yellow-ui',
                                        text: '黄色预警<br/>50',
                                        flex: 1,
                                        listeners: {
                                            click: function (btn, evt) {
                                                mv.fn.switchWarnPanel(btn, evt, '黄色预警');
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'button',
                                        action: 'warn-blud',
                                        ui: 'button-blue-ui',
                                        text: '蓝色预警<br/>50',
                                        flex: 1,
                                        listeners: {
                                            click: function (btn, evt) {
                                                mv.fn.switchWarnPanel(btn, evt, '蓝色预警');
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                xtype: 'panel',
                                id: 'monInfoPanelId',
                                margin: '1 0 0 0',
                                flex: 1,
                                title: '监测设备统计',
                                ui: 'map-detail-warnning-panel-ui',
                                layout: {
                                    type: 'hbox',
                                    align: 'middle',
                                    pack: 'center'
                                },
                                items: [
                                    {
                                        xtype: 'button',
                                        action: 'lfjc',
                                        ui: 'button-device-ui',
                                        text: '裂缝监测<br/>50',
                                        flex: 1,
                                        listeners: {
                                            click: function (btn, evt) {
                                                mv.fn.switchDeviceListPanel(btn, evt);
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'button',
                                        action: 'bmwyjc',
                                        ui: 'button-device-ui',
                                        text: '表面位移监测<br/>50',
                                        flex: 1,
                                        listeners: {
                                            click: function (btn, evt) {
                                                mv.fn.switchDeviceListPanel(btn, evt);
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'button',
                                        action: 'yljc',
                                        ui: 'button-device-ui',
                                        text: '雨量监测<br/>50',
                                        flex: 1,
                                        listeners: {
                                            click: function (btn, evt) {
                                                mv.fn.switchDeviceListPanel(btn, evt);
                                            }
                                        }
                                    }
                                ]
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
                Ext.getCmp('monAddressPanelId').show();//地灾点或设备地址
                // Ext.getCmp('monTypePanelId').show();//地灾点或监测类型
                Ext.getCmp('monRankPanelId').show();//预警等级
                Ext.getCmp('monWarnPanelId').show();//预警信息统计
                Ext.getCmp('monInfoPanelId').show();//监测设备统计
                Ext.getCmp('mondataCompanyPanelId').show();// 承建单位
                Ext.getCmp('mondataUserNamePanelId').show();// 负责人
                Ext.getCmp('mondataStatusPanelId').show();// 状态信息

                //根据类型切换面板
                var type = mv.v.mapDetailPanelInfo.type;
                if (type == 'disasterpoint') {
                    Ext.getCmp('mondataCollectId').show();
                    Ext.getCmp('monInfoPanelId').show();
                    Ext.getCmp('mondataStatusId').setHidden(true);
                } else if (type == 'device') {
                    Ext.getCmp('mondataCollectId').hide();
                    Ext.getCmp('monInfoPanelId').hide();
                    Ext.getCmp('mondataStatusId').setHidden(false);
                }
            },
            //@todo action参数表示需要切换的地灾点或监测设备等级，以及地灾点需要切换的监测设备类型
            showMoreInfo: function (action, rankStr) {
                //显示更多信息面板
                Ext.getCmp('monMoreInfoPanelId').show();

                //隐藏其他基本信息面板
                Ext.getCmp('monAddressPanelId').hide();
                // Ext.getCmp('monTypePanelId').hide();
                Ext.getCmp('monRankPanelId').hide();
                Ext.getCmp('monWarnPanelId').hide();
                Ext.getCmp('monInfoPanelId').hide();
                Ext.getCmp('mondataCompanyPanelId').hide();
                Ext.getCmp('mondataUserNamePanelId').hide();
                Ext.getCmp('mondataStatusPanelId').hide();

                var deviceDetail = Ext.getCmp('deviceDetailContainerID');
                var dzDetail = Ext.getCmp('dzDetailContainerID');
                deviceDetail.hide();
                dzDetail.hide();

                //根据类型切换面板
                var type = mv.v.mapDetailPanelInfo.type;
                if (type == 'disasterpoint') {
                    // 动态添加组件，先删除所有组件再添加
                    dzDetail.removeAll();
                    var detailpanel = Ext.create(
                        {
                            title: '详情信息',
                            iconCls: 'fa fa-file-image-o',
                            xtype: 'monpot-detail',

                            // config
                            quakeId: mv.v.mapDetailPanelInfo.code.toString()
                        }
                    );
                    var warninfopanel = Ext.create(
                        {
                            title: '预警信息',
                            iconCls: 'fa fa-exclamation-triangle',
                            xtype: 'monpot-alertinfo',

                            // config
                            quakeId: mv.v.mapDetailPanelInfo.code.toString(),
                            rankStr: rankStr
                        }
                    );
                    var datalistpanel = Ext.create(
                        {
                            title: '数据列表',
                            iconCls: 'fa fa-list',
                            itemId: 'deviceDataListId',
                            xtype: 'monpot-monitordata',

                            // config
                            quakeId: mv.v.mapDetailPanelInfo.code.toString(),
                            deviceId: '',
                            deviceType: ''
                        }
                    );
                    var devicepanel = Ext.create(
                        {
                            title: '设备列表',
                            iconCls: 'fa fa-th',
                            xtype: 'monpot-devicelist',

                            quakeId: mv.v.mapDetailPanelInfo.code.toString(),
                            deviceType: '',
                            detailBtnClick: function (thisExt, record, element, rowIndex, e, eOpts) {
                                var detailData = record.getData();
                                if (e.target.dataset.qtip === '详情' || e.type === "dblclick") {
                                    var winOption = {
                                        title: "详情",
                                        width: Ext.getBody().getWidth() - 20,
                                        height: Ext.getBody().getHeight() - 20,
                                        layout: "fit",
                                        modal: true,
                                        closable: true,
                                        maximizable: true,
                                        minimizable: false,
                                        resizable: true,
                                        items: []
                                    }

                                    winOption.title = detailData.name + '详情';

                                    winOption.items = [
                                        {
                                            xtype: 'tabpanel',
                                            ui: 'navigation1',
                                            border: false,
                                            flex: 1,
                                            defaults: {
                                                bodyPadding: 5,
                                                scrollable: true,
                                                closable: false,
                                                border: false
                                            },
                                            tabPosition: 'left',
                                            tabRotation: 0,
                                            items: [
                                                {
                                                    title: '详情信息',
                                                    iconCls: 'fa fa-file-image-o',
                                                    xtype: 'monpot-devicedetail',

                                                    // config
                                                    deviceId: detailData.deviceid.toString()
                                                },
                                                {
                                                    title: '预警信息',
                                                    iconCls: 'fa fa-exclamation-triangle',
                                                    xtype: 'monpot-alertinfo',

                                                    // config
                                                    quakeId: detailData.quakeid.toString(),
                                                    deviceCode: detailData.deviceid.toString()
                                                },
                                                {
                                                    title: '数据列表',
                                                    iconCls: 'fa fa-list',
                                                    xtype: 'monpot-monitordata',

                                                    // config
                                                    quakeId: detailData.quakeid.toString(),
                                                    deviceId: detailData.deviceid.toString(),
                                                    deviceType:
                                                        detailData.type === 1 ? 'wysb' :
                                                            detailData.type === 2 ? 'ylsb' : 'lfsb'
                                                },
                                                {
                                                    title: '智能分析',
                                                    iconCls: 'fa fa-lightbulb-o',
                                                    xtype: 'monpot-analytics',

                                                    // config
                                                    deviceType:
                                                        detailData.type === 1 ? 'wysb' :
                                                            detailData.type === 2 ? 'ylsb' : 'lfsb',
                                                    deviceCode: detailData.deviceid.toString(),
                                                    quakeId: detailData.quakeid.toString()
                                                }
                                            ]
                                        }
                                    ]
                                    Ext.create("Ext.window.Window", winOption).show();
                                }
                            }
                        }
                    )
                    dzDetail.add(
                        [detailpanel, warninfopanel, datalistpanel, devicepanel]
                    )

                    dzDetail.show();
                    var dzItem = null;
                    if (action) {
                        if (action.indexOf('warn') > -1) {
                            //需要切换到预警信息列表
                            dzItem = warninfopanel;
                        } else {
                            //需要切换到监测设备列表
                            dzItem = devicepanel;
                        }
                    } else {
                        dzItem = detailpanel;
                    }

                    //定位模块
                    if (dzItem) {
                        dzDetail.setActiveTab(dzItem);
                    }

                } else if (type == 'device') {
                    // 动态添加组件，先删除所有组件再添加
                    deviceDetail.removeAll();
                    var detailPanel = Ext.create(
                        {
                            title: '详情信息',
                            iconCls: 'fa fa-file-image-o',
                            xtype: 'monpot-devicedetail',

                            // config
                            deviceId: mv.v.mapDetailPanelInfo.code.toString()
                        }
                    )
                    var warninfopanel = Ext.create(
                        {
                            title: '预警信息',
                            iconCls: 'fa fa-exclamation-triangle',
                            xtype: 'monpot-alertinfo',

                            // config
                            quakeId: mv.v.mapDetailPanelInfo.quakeId.toString(),
                            deviceCode: mv.v.mapDetailPanelInfo.code.toString(),
                            rankStr: rankStr
                        }
                    )
                    var devicedatalistpanel = Ext.create(
                        {
                            title: '数据列表',
                            iconCls: 'fa fa-list',
                            xtype: 'monpot-monitordata',

                            // config
                            quakeId: mv.v.mapDetailPanelInfo.quakeId.toString(),
                            deviceId: mv.v.mapDetailPanelInfo.code.toString(),
                            deviceType:
                                mv.v.mapDetailPanelInfo.deviceType === 1 ? 'wysb' :
                                    mv.v.mapDetailPanelInfo.deviceType === 2 ? 'ylsb' : 'lfsb'
                        }
                    )
                    var deviceaipanel = Ext.create(
                        {
                            title: '智能分析',
                            iconCls: 'fa fa-lightbulb-o',
                            xtype: 'monpot-analytics',

                            // config
                            deviceType:
                                mv.v.mapDetailPanelInfo.deviceType === 1 ? 'wysb' :
                                    mv.v.mapDetailPanelInfo.deviceType === 2 ? 'ylsb' : 'lfsb',
                            deviceCode: mv.v.mapDetailPanelInfo.code.toString(),
                            quakeId: mv.v.mapDetailPanelInfo.quakeId.toString()
                        }
                    )
                    deviceDetail.add(
                        [detailPanel, warninfopanel, devicedatalistpanel, deviceaipanel]
                    )


                    deviceDetail.show();
                    var deviceItem = null;
                    if (action) {
                        //需要切换到预警信息列表
                        deviceItem = warninfopanel;
                    } else {
                        deviceItem = detailPanel;//详情面板
                    }

                    //定位模块
                    if (deviceItem) {
                        deviceDetail.setActiveTab(deviceItem);
                    }
                }
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
            // 从地灾点显示监测设备
            showJcsbMarkersByDZ: function (dzInfo) {
                if (dzInfo != null && dzInfo['children'] != null) {
                    var jcsbList = dzInfo['children'];
                    if (jcsbList.length > 0) {
                        var latlngs = new Array();
                        Ext.each(jcsbList, function (jcsbInfo) {
                            // 设置监测设备的地灾点id
                            jcsbInfo.quakeId = dzInfo.code;
                            var jcName = jcsbInfo['text'];
                            var jcRank = jcsbInfo['rank'];
                            var mId = jcsbInfo['code'];
                            var mType = jcsbInfo['type'];
                            var iconName = 'camera';
                            var markerIcon = mv.fn.refreshJCSBIcon( jcsbInfo['deviceType'], jcRank);
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
            // 通过预警信息统计面板切换到详情面板-地灾点/监测设备
            switchWarnPanel: function (btn, evt, rankStr) {
                //切换详情面板中更多按钮状态
                var moreBtn = Ext.getCmp('mondataMoreId');
                moreBtn.setIconCls('fa fa-window-restore');
                moreBtn.setTooltip('基本信息');

                var parentContainer = Ext.getDom(mv.v.mapParentId);
                mv.v.mapDetailPanelParam = {
                    gapX: 5,
                    gapY: 5,//40,
                    //bottomY: 5,//底部间隔
                    w: '100%',//数值或百分比，如：100%
                    h: '100%',//数值或百分比，如：100%
                    align: 'tr' //右上
                };
                mv.fn.relayoutPanel(parentContainer, mv.v.mapDetailPanel, mv.v.mapDetailPanelParam);
                mv.v.isMapDetaiMaximize = true;
                if(!rankStr)rankStr = '';
                mv.fn.showMoreInfo(btn['action'], rankStr);
            },
            // 通过监测设备统计面板切换到详情面板-地灾点
            switchDeviceListPanel: function (btn, evt) {
                //切换详情面板中更多按钮状态
                var moreBtn = Ext.getCmp('mondataMoreId');
                moreBtn.setIconCls('fa fa-window-restore');
                moreBtn.setTooltip('基本信息');

                var parentContainer = Ext.getDom(mv.v.mapParentId);
                mv.v.mapDetailPanelParam = {
                    gapX: 5,
                    gapY: 5,//40,
                    //bottomY: 5,//底部间隔
                    w: '100%',//数值或百分比，如：100%
                    h: '100%',//数值或百分比，如：100%
                    align: 'tr' //右上
                };
                mv.fn.relayoutPanel(parentContainer, mv.v.mapDetailPanel, mv.v.mapDetailPanelParam);
                mv.v.isMapDetaiMaximize = true;
                mv.fn.showMoreInfo(btn['action']);
            },
            showHighMarker: function (markerObj) {
                if (mv.v.highMarker == null) {
                    var pulsingIcon = L.icon.pulse({
                        iconSize: [10, 10],
                        color: '#3385FF',
                        fillColor: '#3385FF',
                        heartbeat: 2
                    });
                    mv.v.highMarker = L.marker(markerObj.getLatLng(), {
                        type: markerObj.options['type'],
                        id: markerObj.options['id'],
                        icon: pulsingIcon
                    }).addTo(mv.v.map);
                } else {
                    mv.v.highMarker.setLatLng(markerObj.getLatLng());
                    if (mv.v.map.hasLayer(mv.v.highMarker) == false) {
                        mv.v.map.addLayer(mv.v.highMarker);
                    }
                }
                mv.v.highMarker.setZIndexOffset(-100);
            },
            isShowWarnInfos: function (warnObj) {
                if (warnObj) {
                    var isShow = true;
                    if (warnObj.iconCls == 'fa fa-bell orange-cls') {
                        warnObj.setIconCls('fa fa-bell-slash');
                        isShow = false;
                    } else {
                        warnObj.setIconCls('fa fa-bell orange-cls');
                    }
                    if (isShow == true) {
                        mv.fn.refreshMarkerColor();
                    } else {
                        if (mv.v.dzMarkerGroup) {
                            mv.v.dzMarkerGroup.eachLayer(function (dzLayer) {
                                var markerIcon = L.AwesomeMarkers.icon({
                                    icon: 'bullseye',
                                    markerColor: mv.fn.calcRank('0'),
                                    prefix: 'fa',
                                    spin: false
                                });
                                if (markerIcon) {
                                    dzLayer.setIcon(markerIcon);
                                }
                            })
                        }
                        if (mv.v.jcsbMarkerGroup) {
                            mv.v.jcsbMarkerGroup.eachLayer(function (jcsbLayer) {
                                var oldOption = jcsbLayer.options;
                                var jcsbCode = oldOption['id'];
                                var markerIcon = null;
                                Ext.each(mv.v.devicesRankList, function (devicesRankData) {
                                    if (devicesRankData.DEVICEID === jcsbCode) {
                                        markerIcon = mv.fn.refreshJCSBIcon(jcsbLayer.getAttribution().deviceType,'0');
                                    }
                                });
                                if (markerIcon) {
                                    jcsbLayer.setIcon(markerIcon);
                                }
                            })
                        }
                    }
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
                                markerIcon = mv.fn.refreshJCSBIcon(jcsbMarker.getAttribution().deviceType,devicesRankData.RANK);
                            }
                        });
                        if (markerIcon) {
                            jcsbMarker.setIcon(markerIcon);
                        }
                    })
                }
            },
            // 监测设备的图标更新，传监测设备类型和rank值，返回对应的图标
            refreshJCSBIcon: function (jcsbType,jcsbrank) {
                var willReturnIcon = null;
                var iconName = 'camera';
                // 设置设备图标样式
                switch (jcsbType){
                    case 1:
                        iconName = 'arrows';
                        break;
                    case 2:
                        iconName = 'tint';
                        break;
                    case 3:
                        iconName = 'bolt';
                        break;
                }
                willReturnIcon = L.AwesomeMarkers.icon({
                    icon: iconName,
                    markerColor: mv.fn.calcRank(jcsbrank),
                    prefix: 'fa',
                    spin: false
                });
                return willReturnIcon;
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
                    iconCls = 'fa fa-plus-square normal-cls';
                } else if (node.get('type') == 'device') {
                    iconCls = 'fa fa-circle normal-cls';
                } else if (node.get('type') == 'region' && isRegionRefresh) {
                    iconCls = 'fa fa-table normal-cls';
                    node.set('iconCls', iconCls);
                }

                if (node.get('type') != 'region') {
                    switch (rank) {
                        case 0:
                            node.set('iconCls', iconCls + ' green-cls');
                            node.set('rank', 0);
                            break;
                        case 1:
                            node.set('iconCls', iconCls + ' blue-cls');
                            node.set('rank', 1);
                            break;
                        case 2:
                            node.set('iconCls', iconCls + ' yellow-cls');
                            node.set('rank', 2);
                            break;
                        case 3:
                            node.set('iconCls', iconCls + ' orange-cls');
                            node.set('rank', 3);
                            break;
                        case 4:
                            node.set('iconCls', iconCls + ' red-cls');
                            node.set('rank', 4);
                            break;
                    }
                }

                //node.load();
            },
            // 概要面板等级信息
            calcRank4FeaturePanel: function (rank) {
                var mrpid = Ext.getCmp('monRankPanelId');
                mrpid.show();

                var mdrid = Ext.getCmp('mondataRankId');
                mdrid.setValue(rank);
                mdrid.setLimit(rank);
                mdrid.setMinimum(rank);

                switch (rank) {
                    case 0://如果等级为0，转化为绿色1星。
                        mdrid.setValue(1);
                        mdrid.setLimit(1);
                        mdrid.setMinimum(1);
                        mdrid.setSelectedStyle('color:green;');
                        mdrid.setOverStyle('color:green;');
                        break;
                    case 1:
                        mdrid.setSelectedStyle('color:blue;');
                        mdrid.setOverStyle('color:blue;');
                        break;
                    case 2:
                        mdrid.setSelectedStyle('color:yellow;');
                        mdrid.setOverStyle('color:yellow;');
                        break;
                    case 3:
                        mdrid.setSelectedStyle('color:orange;');
                        mdrid.setOverStyle('color:orange;');
                        break;
                    case 4:
                        mdrid.setSelectedStyle('color:red;');
                        mdrid.setOverStyle('color:red;');
                        break;
                }
            },
            //属性面板布局重绘
            relayoutPanel: function (parentContainer, childContainer, floatParams) {
                var w = floatParams['w'];
                var h = floatParams['h'];

                var align = floatParams['align'];
                var offsetX = floatParams['gapX'];
                var offsetY = floatParams['gapY'];
                var bottomOffsetY = floatParams['bottomY'];

                if (w && typeof (w) == 'string' && w.indexOf('%') > -1) {
                    w = parentContainer.clientWidth * parseFloat(w.substr(0, w.indexOf('%'))) / 100 - 2 * offsetX;
                }

                if (h && typeof (h) == 'string' && h.indexOf('%') > -1) {
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
                        // width: 350,
                        layout: {
                            type: 'hbox',
                            pack: 'center',
                            align: 'middle'
                        },
                        items: [
                            {
                                xtype: 'button',
                                tooltip: '显示告警',
                                id: 'showWarnInfoId',
                                enableToggle: true,
                                pressed: false,
                                width: 50,
                                // scale: 'large',
                                iconCls: 'fa fa-bell orange-cls',
                                // style: 'background: blue;border: 0;color: rgba(192, 57, 43, 1.0);',
                                handler: function () {
                                    //地图是否显示告警等级
                                    mv.fn.isShowWarnInfos(this);
                                }
                            },
                            {
                                xtype: 'component',
                                width: 1,
                                height: 30,
                                style: 'background-color:rgba(250, 250, 250,1.0);'
                            },
                            {
                                xtype: 'container',
                                id: 'warnInfoText',
                                padding: '0 0 0 10',
                                width: 300,
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
                                id: 'controllleftpanelId',
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
    },
    mapViewShow: function () {
        if (mv.v.mapDetailPanel && !mv.v.mapDetailPanel.isHidden()) {
            mv.v.mapDetailPanel.updateLayout();
        }
    }
});