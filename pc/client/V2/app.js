/**
 * Created by lyuwei on 2017/10/26.
 */
requirejs.config({
    paths: {
        // 定义项目主目录入口
        app: 'app',
        data: 'data',
        // 定义框架库相关路径
        "jquery": "libs/jquery-2.1.1",
        "jquery.bootstrap": "libs/bootstrap.min",
        "jquery.inspinia": "libs/inspinia",
        "jquery.pace": "libs/plugins/pace/pace.min",
        "jquery.metisMenu": "libs/plugins/metisMenu/jquery.metisMenu",
        "jquery.slimscroll": "libs/plugins/slimscroll/jquery.slimscroll.min",
        "jquery.jsTree": "libs/plugins/jsTree/jstree",
        "jquery.layer": "libs/plugins/layer/layer",
        "jquery.bootstrap.switch": "libs/plugins/bootstrap-switch/bootstrap-switch",

        "leaflet": "libs/leaflet/leaflet-src",
    },
    map: {
        '*': {
            'css': 'libs/css'
        }
    },
    shim: {
        "jquery.bootstrap": { deps: ["jquery"] },
        "jquery.metisMenu": { deps: ["jquery"] },
        "jquery.inspinia": { deps: ["jquery","jquery.bootstrap","jquery.metisMenu"] },
        "jquery.pace": { deps: ["jquery"] },
        "jquery.slimscroll": { deps: ["jquery"] },
        "jquery.jsTree": { deps: ["jquery"] },
        "jquery.layer": { deps: ["jquery"] },
        "jquery.bootstrap.switch": { deps: ["jquery","jquery.bootstrap","css!libs/plugins/bootstrap-switch/bootstrap-switch.css"] },
        "leaflet": { deps: ["css!libs/leaflet/leaflet.css"] },
    }
});

// require(["module/name", ...], function(params){ ... });
require([
    "jquery",
    "leaflet",
    "jquery.pace",
    "jquery.bootstrap",
    "jquery.inspinia",
    "jquery.metisMenu",
    "jquery.slimscroll",
    "jquery.jsTree",
    "jquery.bootstrap.switch"], function ($,L,pace) {
    // 初始化将jquery 和 bootstrap等必须的框架加入系统
    // 初始化进度条组件
    pace.start({
        document: false
    });

    // 初始化全局地图变量
    window.YTmap = window.YTmap || {};

    var mapview = YTmap =  L.map('mapdiv',{
        attributionControl: false,
        crs: L.CRS.EPSG4326
    }).setView([36.1733569352216, 108.06152343750001], 4);
    var baselayerGroup = {};
    require(['data/BaseLayerData','app/core/WMTS_Service'],function (basedata,wmtslayer) {
        var baselayeroption = basedata.DMZ_TDTSL.baseServerInfo[0];
        baselayerGroup['天地图底图'] = wmtslayer(baselayeroption.url,baselayeroption).addTo(mapview);
        baselayeroption = basedata.DMZ_TDTSL.baseServerInfo[1];
        baselayerGroup['天地图注记'] = wmtslayer(baselayeroption.url,baselayeroption);
        L.control.layers(null,baselayerGroup).addTo(mapview);
    })
});