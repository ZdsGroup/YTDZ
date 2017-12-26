/**
 * Created by lyuwei on 2017/10/26.
 */
requirejs.config({
    paths: {
        // 定义项目主目录入口
        app: 'app',
        data: 'data',
        // require 额外插件
        text: 'libs/requirePlugins/text',
        // 定义框架库相关路径
        "jquery": "libs/jquery-2.1.1",
        "jquery.nav": "libs/nav",
        "jquery.bootstrap": "libs/bootstrap.min",
        "jquery.pace": "libs/plugins/pace/pace.min",
        "jquery.layer": "libs/plugins/layer/layer",

        // 右侧浮动面板
        "jquery.hoverIntent": "libs/plugins/mbExtruder/jquery.hoverIntent.min",
        "jquery.mb.flipText": "libs/plugins/mbExtruder/jquery.mb.flipText",
        "jquery.mbExtruder": "libs/plugins/mbExtruder/mbExtruder",

        // 右侧简易浮动面板
        "jquery.sliderBar": "libs/plugins/sliderBar/jquery.sliderBar",
        // 模态提示窗
        "sweetalert": "libs/plugins/sweetalert/sweetalert.min",
        // 图片轮播
        "swiper": "libs/plugins/swiper/swiper.min",

        "jquery.iCheck": "libs/plugins/iCheck/icheck.min",

        "leaflet": "libs/leaflet/leaflet-src",
    },
    map: {
        '*': {
            'css': 'libs/requirePlugins/css'
        }
    },
    shim: {
        "jquery.bootstrap": { deps: ["jquery"] },
        "jquery.pace": { deps: ["jquery"] },
        "jquery.nav": { deps: ["jquery"] },
        "jquery.layer": { deps: ["jquery"] },

        "jquery.hoverIntent": { deps: ["jquery"] },
        "jquery.mb.flipText": { deps: ["jquery","jquery.hoverIntent"] },
        "jquery.mbExtruder": { deps: ["jquery","jquery.mb.flipText","css!libs/plugins/mbExtruder/mbExtruder.css"] },

        "sweetalert": { deps: ["css!libs/plugins/sweetalert/sweetalert.css"] },
        "swiper": { deps: ["css!libs/plugins/swiper/swiper.min.css"] },

        "jquery.iCheck": { deps: ["jquery","css!libs/plugins/iCheck/square/_all.css"] },

        "leaflet": { deps: ["css!libs/leaflet/leaflet.css"] },
    }
});

// require(["module/name", ...], function(params){ ... });
require([
    "jquery",
    "leaflet",
    "jquery.pace",
    "jquery.bootstrap"], function ($,L,pace) {
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

    {
        // 解决鼠标移动到dropdown 目录就可以展开，不必点击
        //关闭click.bs.dropdown.data-api事件，使顶级菜单可点击
        $(document).off('click.bs.dropdown.data-api');
        //自动展开
        $('.nav .dropdown').mouseenter(function(){
            $(this).addClass('open');
        });
        //自动关闭
        $('.nav .dropdown').mouseleave(function(){
            $(this).removeClass('open');
        });
    }

    require(['app/leftmenu/initLeftMenu'],function (leftmenu) {
        leftmenu.initmenu();
    })
});