/**
 * Created by lyuwei on 2018/1/17.
 */
Ext.define('yt.view.ytmap.detail.DetailView', {
    extend: 'Ext.Container',

    requires: [
        'Ext.layout.container.Fit',
        'Ext.tab.Panel',
        'yt.view.ytmap.detail.monpotAlertInfo',
        'yt.view.ytmap.detail.monpotAnalytics',
        'yt.view.ytmap.detail.monpotDetail'
    ],

    /*
    Uncomment to give this component an xtype
    xtype: 'detail',
    */
    xtype: 'detailView',

    layout: 'fit',

    border: false,

    items: [
        /* include child components here */
        {
            xtype: 'tabpanel',
            ui: 'navigation1',
            border: false,
            flex: 1,
            defaults: {
                bodyPadding: 5,
                scrollable: true,
                closable: false,
                border: true
            },
            tabPosition: 'left',
            tabRotation: 0,
            items: [{
                title: '详情信息',
                iconCls: 'fa fa-file-image-o',
                xtype: 'monpot-detail'
            }, {
                title: '智能分析',
                iconCls: 'fa fa-lightbulb-o',
                xtype: 'monpot-analytics'
            },
                //     {
                //     title: '监测数据',
                //     icon: null,
                //     xtype: 'monpot-monitordata'
                // },
                {
                    title: '预警信息',
                    iconCls: 'fa fa-exclamation-triangle',
                    xtype: 'monpot-alertinfo'
                }]
        }
    ]
});