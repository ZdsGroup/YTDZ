/**
 * Created by LBM on 2017/7/27.
 * 关于selected、init属性说明，所有模块都可以设置init=true，只能配置最后一个init=true的项目的selected=true（重点）
 */
Ext.define('yt.conf.SystemConfig', {
    //singleton: true,
    serviceUrl: 'http://quake.anruence.com/oracle/',
    title: "鹰潭市智能监测预警系统",
    //主容器ID
    bodyContainerID: 'bodyContainerID',
    //浮动容器ID
    floatContainerID: 'floatContainerID',
    //当前选择的菜单项目
    currentMenuItem: null,
    systemMenu: [
        {
            name: "监测地图",
            selected: true,
            init: true,
            type: "widget",
            key: "yt-menu-map",
            widgetId: 'yt-widget-map',
            url: "yt-map",
            parent: 'bodyContainerID',
            ui: "top-menu-ui",
            icon: "fa fa-map-marker",
            mode: "cover",
            hide: true
        },
        {
            name: "监测点",
            selected: false,
            init: false,
            type: "widget",
            key: "yt-menu-monitorpoint",
            widgetId: 'yt-widget-monitorpoint',
            url: "yt-monpot",
            parent: 'floatContainerID',
            ui: "top-menu-ui",
            icon: "fa fa-circle",
            mode: "normal",
            hide: false,

            //浮动容器相关参数,align: l(左)、r(右)、t(上)、b(下)
            floatContainerParams: {
                gapX: 5,
                gapY: 5,
                w: 500,//数值或百分比，如：100%
                h: '100%',//数值或百分比，如：100%
                align: 'tr' //左上
            }
        },
        {
            name: "监测数据",
            selected: false,
            init: false,
            type: "widget",
            key: "yt-menu-monitordata",
            widgetId: 'yt-widget-monitordata',
            url: "yt-mondata",
            parent: 'floatContainerID',
            ui: "top-menu-ui",
            icon: "fa fa-cubes",
            mode: "normal",
            hide: false,
            //浮动容器相关参数,align: l(左)、r(右)、t(上)、b(下)
            floatContainerParams: {
                gapX: 5,
                gapY: 5,
                w: 300,//数值或百分比，如：100%
                h: '100%',//数值或百分比，如：100%
                align: 'tr' //左上
            }
        },
        {
            name: "智能预警",
            selected: false,
            init: false,
            type: "widget",
            key: "yt-menu-aiwarm",
            widgetId: 'yt-widget-aiwarm',
            url: "yt-aiwarm",
            parent: 'floatContainerID',
            ui: "top-menu-ui",
            icon: "fa fa-exclamation-triangle",
            mode: "normal",
            hide: false,

            //浮动容器相关参数,align: l(左)、r(右)、t(上)、b(下)
            floatContainerParams: {
                gapX: 5,
                gapY: 5,
                w: 300,//数值或百分比，如：100%
                h: '100%',//数值或百分比，如：100%
                align: 'tr' //左上
            }
        },
        {
            name: "系统管理",
            selected: false,
            init: false,
            type: "widget",
            key: "yt-menu-setting",
            widgetId: 'yt-widget-setting',
            url: "yt-setting",
            parent: 'floatContainerID',
            ui: "top-menu-ui",
            icon: "fa fa-cog",
            mode: "normal",
            hide: false,

            //浮动容器相关参数,align: l(左)、r(右)、t(上)、b(下)
            floatContainerParams: {
                gapX: 5,
                gapY: 5,
                w: '100%',//数值或百分比，如：100%
                h: '100%',//数值或百分比，如：100%
                align: 'tr' //左上
            }
        }
    ],
    dataList: [{
        text: '月湖区',
        type: 'region',
        num: 3,
        leftTop: '29.815559,116.503952',
        rightBottom: '26.815559,120.503952',
        expanded: true,
        iconCls: 'fa fa-table',
        children: [{
            text: '月湖地灾点1',
            lat: 28.815559,
            lng: 117.503952,
            type: 'disasterpoint',
            rank: 4,
            expanded: true,
            iconCls: 'fa fa-plus-square red-cls',
            children: [
                {
                    text: '监测设备1',
                    lat: 28.215559,
                    lng: 117.203952,
                    iconCls: 'fa fa-circle red-cls',
                    leaf: true,
                    type: 'device',
                    rank: 4
                },
                {
                    text: '监测设备2',
                    lat: 28.515559,
                    lng: 117.303952,
                    iconCls: 'fa fa-circle yellow-cls',
                    leaf: true,
                    type: 'device',
                    rank: 2
                },
                {
                    text: '监测设备3',
                    lat: 28.295559,
                    lng: 117.283952,
                    iconCls: 'fa fa-circle orange-cls',
                    leaf: true,
                    type: 'device',
                    rank: 3
                },
                {
                    text: '监测设备4',
                    lat: 29.285559,
                    lng: 117.503952,
                    iconCls: 'fa fa-circle orange-cls',
                    leaf: true,
                    type: 'device',
                    rank: 3
                }
            ]
        }, {
            text: '月湖地灾点2',
            lat: 30.215559,
            lng: 116.263952,
            type: 'disasterpoint',
            rank: 4,
            expanded: true,
            iconCls: 'fa fa-plus-square red-cls',
            children: [
                {
                    text: '监测设备1',
                    lat: 28.315559,
                    lng: 117.603952,
                    iconCls: 'fa fa-circle red-cls',
                    leaf: true,
                    type: 'device',
                    rank: 4
                },
                {
                    text: '监测设备2',
                    lat: 28.215559,
                    lng: 118.273952,
                    iconCls: 'fa fa-circle green-cls',
                    leaf: true,
                    type: 'device',
                    rank: 0
                },
                {
                    text: '监测设备3',
                    lat: 28.115559,
                    lng: 117.503952,
                    iconCls: 'fa fa-circle green-cls',
                    leaf: true,
                    type: 'device',
                    rank: 0
                },
                {
                    text: '监测设备4',
                    lat: 28.415559,
                    lng: 117.206952,
                    iconCls: 'fa fa-circle green-cls',
                    leaf: true,
                    type: 'device',
                    rank: 0
                },
                {
                    text: '监测设备5',
                    lat: 28.285559,
                    lng: 117.403952,
                    iconCls: 'fa fa-circle orange-cls',
                    leaf: true,
                    type: 'device',
                    rank: 3
                }
            ]
        }, {
            text: '月湖地灾点3',
            lat: 29.215559,
            lng: 117.203952,
            type: 'disasterpoint',
            rank: 0,
            expanded: true,
            iconCls: 'fa fa-plus-square  green-cls',
            children: [
                {
                    text: '监测设备1',
                    lat: 26.285559,
                    lng: 116.903952,
                    iconCls: 'fa fa-circle green-cls',
                    leaf: true,
                    type: 'device',
                    rank: 0
                },
                {
                    text: '监测设备2',
                    lat: 28.255559,
                    lng: 117.303952,
                    iconCls: 'fa fa-circle green-cls',
                    leaf: true,
                    type: 'device',
                    rank: 0
                },
                {
                    text: '监测设备3',
                    lat: 28.845559,
                    lng: 117.673952,
                    iconCls: 'fa fa-circle green-cls',
                    leaf: true,
                    type: 'device',
                    rank: 0
                },
                {
                    text: '监测设备4',
                    lat: 28.115559,
                    lng: 117.163952,
                    iconCls: 'fa fa-circle green-cls',
                    leaf: true,
                    type: 'device',
                    rank: 0
                }
            ]
        }]
    }, {
        text: '余江县',
        type: 'region',
        num: 1,
        leftTop: '30.815559,115.503952',
        rightBottom: '28.815559,119.503952',
        expanded: true,
        iconCls: 'fa fa-table',
        children: [{
            text: '余江地灾点1',
            lat: 28.115559,
            lng: 116.903952,
            type: 'disasterpoint',
            rank: 3,
            expanded: true,
            iconCls: 'fa fa-plus-square red-cls',
            children: [
                {
                    text: '监测设备1',
                    lat: 28.545559,
                    lng: 117.203952,
                    iconCls: 'fa fa-circle red-cls',
                    leaf: true,
                    type: 'device',
                    rank: 4
                },
                {
                    text: '监测设备2',
                    lat: 28.515559,
                    lng: 117.673952,
                    iconCls: 'fa fa-circle yellow-cls',
                    leaf: true,
                    type: 'device',
                    rank: 2
                },
                {
                    text: '监测设备3',
                    lat: 28.895559,
                    lng: 117.433952,
                    iconCls: 'fa fa-circle orange-cls',
                    leaf: true,
                    type: 'device',
                    rank: 3
                },
                {
                    text: '监测设备4',
                    lat: 29.125559,
                    lng: 117.563952,
                    iconCls: 'fa fa-circle orange-cls',
                    leaf: true,
                    type: 'device',
                    rank: 3
                }
            ]
        }]
    }]
});
/*PS:通过"singleton: true"属性设置类为单例之后，不能再通过new关键字创建类的实例。
* 是否设置为单例类视个人喜好定,为了简化，现在屏蔽单例设置,否则需要通过全类型路径“jxxc.conf.SystemConfig”
* 调用其中的配置信息。*/
var conf = new yt.conf.SystemConfig();