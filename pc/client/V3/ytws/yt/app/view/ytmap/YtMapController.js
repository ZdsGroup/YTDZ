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
            mapToolPanel: null
        },
        fn: {
            initMap: function (mapid) {
                mv.v.map = L.map(mapid, {
                    zoomControl: false,
                    attributionControl: false
                }).fitWorld();
                if (mv.v.gaodeVecLayer == null) {
                    mv.v.gaodeVecLayer = L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
                        maxZoom: 18,
                        attribution: 'leaflet',
                        id: 'gaodem'
                    });
                }
                mv.v.gaodeVecLayer.addTo(mv.v.map);
                mv.v.map.setView(L.latLng(28.23, 117.02), 10);//定位到鹰潭市

                //创建地图工具栏
                mv.fn.createMapToolPanel(mapid);
            },
            mapFullExtent: function () {
                //显示配置文件配置的显示范围
                var fullMapExtent= L.latLngBounds(L.latLng(24.487606414383,115.572696970468),L.latLng(32.0790331326058,119.482260921593));
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
                                    iconCls: 'fa fa-map-o'
                                }],
                                listeners: {
                                    toggle: function (container, button, pressed) {
                                        if (pressed) {
                                            var action = button['action'];

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