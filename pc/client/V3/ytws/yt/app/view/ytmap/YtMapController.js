/**
 * Created by LBM on 2017/12/27.
 */
var mv = {
        v: {
            //地图控件是否已经初始化
            isMapAdded: false,
            mapDivId: null,
            map: null,
            gaodeVecLayer: null,
            gaodeImageLayer: null,
            gaodeAnnoLayer: null,
            mapToolPanel: null,
            markerGroup: null,
            LayerGroup: null
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
                mv.fn.createMapToolPanel(mapid);
                mv.fn.createWarnTip(mapid);
            },
            calcRank: function (dzRank) {
                if (dzRank == 4) {
                    return 'resources/images/yt/dz/red.png';
                } else if (dzRank == 3) {
                    return 'resources/images/yt/dz/orange.png';
                } else if (dzRank == 2) {
                    return 'resources/images/yt/dz/yellow.png';
                }
                else if (dzRank == 1) {
                    return 'resources/images/yt/dz/blue.png';
                } else {
                    return 'resources/images/yt/dz/green.png';
                }
            },
            //创建地灾点或设备点
            createMarker: function (dataList) {
                //地灾点
                if (dataList && dataList instanceof Array && dataList.length > 0) {
                    var markers = [];
                    Ext.each(dataList, function (data) {
                        if (data != null && data['children'] && data['children'].length > 0) {
                            var dzList = data['children'];
                            if (dzList && dzList.length > 0) {
                                Ext.each(dzList, function (dzData) {
                                    var dzName = dzData['text'];
                                    var dzRank = dzData['rank'];
                                    var dzImageUrl = mv.fn.calcRank(dzRank);
                                    var markerIcon = L.icon({
                                        iconUrl: dzImageUrl,
                                        iconSize: [24, 24],
                                        iconAnchor: [12, 24]
                                    });
                                    var dzPot = [dzData['lat'], dzData['lng']];
                                    var dzMarker = new L.marker(dzPot, {
                                        icon: markerIcon,
                                        draggable: false,
                                        title: dzName
                                    });

                                    dzMarker.on('click',function(){
                                        alert('clicked!!!');
                                    });

                                    markers.push(dzMarker);
                                });
                            }
                        }
                    });

                    //创建标签分组
                    if (markers.length > 0) {
                        mv.v.markerGroup = L.layerGroup(markers);
                        mv.v.map.addLayer(mv.v.markerGroup);
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
                    ;
                }
                //var toolDom = mv.v.mapToolPanel.el.dom;
                //mv.v.mapToolPanel.el.alignTo(parentContainer, "tl?", [parentContainer.clientWidth - 5 - toolDom.clientWidth, 5], true);
                mv.v.mapToolPanel.el.alignTo(parentContainer, "tl?", [5, 5], true);
                mv.v.mapToolPanel.updateLayout();
            },
            refreshLayout: function (id) {
                var parentContainer = Ext.getDom(id);
                if (mv.v.mapToolPanel) {
                    //var toolDom = mv.v.mapToolPanel.el.dom;
                    // mv.v.mapToolPanel.el.alignTo(parentContainer, "tl?", [parentContainer.clientWidth - 5 - toolDom.clientWidth, 5], true);
                    mv.v.mapToolPanel.el.alignTo(parentContainer, "tl?", [5, 5], true);
                }
            },
            createWarnTip:function(parentId){
                var parentContainer = Ext.getDom(parentId);
                var warnTip = new Ext.create('yt.view.warntip.Warntip',{
                    renderTo:parentContainer,
                    floating: true
                });
                warnTip.el.alignTo(parentContainer, "tr?", [-0, 5], true);
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
            mv.fn.initMap(mv.v.mapDivId);
        }

        if (mv.v.map) {
            mv.v.map.invalidateSize();
        }

        mv.fn.refreshLayout(mv.v.mapDivId);
    }
});