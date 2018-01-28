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
        'yt.view.ytmap.detail.monpotDetail',
        'yt.view.ytmap.detail.monpotMonitordata'
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
            id: 'deviceDetailContainerID',
            hidden: true,
            border: false,
            flex: 1,
            defaults: {
                bodyPadding: 5,
                scrollable: true,
                closable: false,
                border: false
            },
            tabPosition: 'left',
            tabRotation: 0,
            //@todo 需要将具体的内容添加到相应的模块
            items: [
                {
                    title: '详情信息',
                    iconCls: 'fa fa-file-image-o',
                    itemId: 'deviceDetailId',
                    //xtype: 'monpot-detail'
                },
                {
                    title: '数据列表',
                    iconCls: 'fa fa-list',
                    itemId: 'deviceDataListId',
                    //xtype: 'monpot-monitordata'
                },
                {
                    title: '预警信息',
                    iconCls: 'fa fa-exclamation-triangle',
                    itemId: 'deviceWarnInfoId',
                    //xtype: 'monpot-alertinfo'
                },
                {
                    title: '智能分析',
                    iconCls: 'fa fa-lightbulb-o',
                    itemId: 'deviceAIId',
                    //xtype: 'monpot-analytics'
                }
            ]
        },
        {
            xtype: 'tabpanel',
            ui: 'navigation1',
            id: 'dzDetailContainerID',
            hidden: true,
            border: false,
            flex: 1,
            defaults: {
                bodyPadding: 5,
                scrollable: true,
                closable: false,
                border: false
            },
            tabPosition: 'left',
            tabRotation: 0,
            items: [
                {
                    title: '详情信息',
                    iconCls: 'fa fa-file-image-o',
                    itemId: 'dzDetailId',
                    //xtype: 'monpot-detail'
                },
                {
                    title: '数据列表',
                    iconCls: 'fa fa-list',
                    itemId: 'dzDataListId',
                    //xtype: 'monpot-monitordata'
                },
                {
                    title: '预警信息',
                    iconCls: 'fa fa-exclamation-triangle',
                    itemId: 'dzWarnInfoId',
                    //xtype: 'monpot-alertinfo'
                },
                {
                    title: '设备列表',
                    iconCls: 'fa fa-th',
                    itemId: 'dzDeviceListId',
                    //xtype: 'monpot-analytics'
                }
            ]
        }
    ]
});