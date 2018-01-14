/**
 * Created by LBM on 2017/12/30.
 */
Ext.define('yt.view.monpot.MonPot', {
    extend: 'Ext.Container',

    requires: [
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.tab.Panel',
        'Ext.ux.rating.Picker',
        'yt.view.monpot.MonPotController',
        'yt.view.monpot.MonPotModel',
        'yt.view.monpot.monpotAlertInfo',
        'yt.view.monpot.monpotAnalytics',
        'yt.view.monpot.monpotDetail',
        'yt.view.monpot.monpotMonitordata'
    ],

    /*
    Uncomment to give this component an xtype*/
    xtype: 'yt-monpot',


    viewModel: {
        type: 'monpot'
    },

    controller: 'monpot',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    border: false,
    scrollable: 'y',
    items: [
        /* include child components here */
        /*{
            xtype: 'yt-InfoDescription',
            // fit: 1
        }*/
        // {
        //     xtype: 'panel',
        //     layout: {
        //         type: 'vbox',
        //         align: 'stretch'
        //     },
        //     ui: 'monpot-info-panel',
        //     items: [
        //         {
        //             xtype: 'container',
        //             layout: {
        //                 type: 'hbox',
        //                 align: 'middle',
        //                 pack: 'center'
        //             },
        //             margin: '3 10 3 10',
        //             items: [
        //                 {
        //                     xtype: 'component',
        //                     flex: 1,
        //                     html: '贵溪市煤矿',
        //                     cls: 'mon-info-title'
        //                 },
        //                 {
        //                     xtype: 'button',
        //                     ui: 'mon-tool-button',
        //                     border: false,
        //                     iconCls: 'fa fa-map-marker',
        //                     tooltip: '快速定位'
        //                 },
        //                 {
        //                     xtype: 'button',
        //                     ui: 'mon-tool-button',
        //                     border: false,
        //                     iconCls: 'fa fa-star',
        //                     tooltip: '快速收藏'
        //                 }
        //             ]
        //         },
        //         {
        //             xtype: 'container',
        //             layout: {
        //                 type: 'hbox',
        //                 align: 'middle',
        //                 pack: 'center'
        //             },
        //             margin: '3 10 3 10',
        //             items: [
        //                 {
        //                     xtype: 'button',
        //                     ui: 'mon-image-button',
        //                     border: false,
        //                     iconCls: 'fa fa-dot-circle-o'
        //                 },
        //                 {
        //                     xtype: 'component',
        //                     flex: 1,
        //                     html: '南山大道与火炬大道交叉口东50米'
        //                 }
        //             ]
        //         },
        //         {
        //             xtype: 'container',
        //             layout: {
        //                 type: 'hbox',
        //                 align: 'middle',
        //                 pack: 'center'
        //             },
        //             margin: '3 10 3 10',
        //             items: [
        //                 {
        //                     xtype: 'component',
        //                     html: '类型：'
        //                 },
        //                 {
        //                     xtype: 'component',
        //                     flex: 1,
        //                     html: '地面塌陷'
        //                 }
        //             ]
        //         },
        //         {
        //             xtype: 'container',
        //             layout: {
        //                 type: 'hbox',
        //                 align: 'middle',
        //                 pack: 'center'
        //             },
        //             margin: '3 10 3 10',
        //             items: [
        //                 {
        //                     xtype: 'component',
        //                     html: '等级：'
        //                 },
        //                 {
        //                     xtype: 'rating',
        //                     flex: 1,
        //                     height: 16,
        //                     minimum: 4,
        //                     value: 4,
        //                     limit: 4,
        //                     overStyle: 'color:red;',
        //                     selectedStyle: 'color:red;'
        //                 }
        //             ]
        //         }
        //     ]
        // },
        // {
        //     xtype: 'button',
        //     text: '更多详情'
        // }

        // 全屏状态下的面板
        {
            xtype: 'tabpanel',
            border: false,
            flex: 1,
            defaults: {
                bodyPadding: 10,
                scrollable: true,
                closable: false,
                border: false
            },
            tabPosition: 'left',
            tabRotation: 0,
            items: [{
                title: '详    情',
                icon: null,
                xtype: 'monpot-detail'
            }, {
                title: '智能分析',
                icon: null,
                xtype: 'monpot-analytics'
            },
            //     {
            //     title: '监测数据',
            //     icon: null,
            //     xtype: 'monpot-monitordata'
            // },
                {
                title: '预警信息',
                icon: null,
                xtype: 'monpot-alertinfo'
            }]
        }
    ]
});