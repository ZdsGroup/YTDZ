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