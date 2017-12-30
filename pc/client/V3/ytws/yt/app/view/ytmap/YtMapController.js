/**
 * Created by LBM on 2017/12/27.
 */
var mv = {
        v: {
            //地图控件是否已经初始化
            isMapAdded: false,
            mapDivId: null,
            map: null,
            gaodeVecLayer: null
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
    }
});