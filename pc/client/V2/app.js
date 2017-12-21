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

        "leaflet": "libs/leaflet/leaflet-src",
    },
    map: {
        '*': {
            'css': 'libs/css'
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

        "leaflet": { deps: ["css!libs/leaflet/leaflet.css"] },
    }
});

// require(["module/name", ...], function(params){ ... });
require([
    "jquery",
    "leaflet",
    "jquery.pace",
    "jquery.bootstrap",
    "jquery.nav"], function ($,L,pace) {
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

    var tempicon = L.marker([40, 113]).addTo(mapview);
    tempicon.on('click',function () {
        require(['app/core/rightPanel'],function (rightpanel) {
            rightpanel.init();
        })
    })
    tempicon.on('dblclick',function () {
        require(['app/core/rightPanel'],function (rightpanel) {
            rightpanel.destroy();
        })
    })

    // 测试接口
    require(['app/common/restfulRequest'],function (restfulRequest) {
        restfulRequest.sendWebRequest(
            'regions',
            'get',
            { pageno : 1 , pagesize : 200 },
            function (data) {
                console.log(data);
            },
            function (data) {
                console.log(data);
            }
        )
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
});