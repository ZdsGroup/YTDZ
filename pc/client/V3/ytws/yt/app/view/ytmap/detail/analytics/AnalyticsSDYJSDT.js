/**
 * Created by lyuwei on 2018/1/17.
 */
Ext.define('yt.view.ytmap.detail.analytics.AnalyticsSDYJSDT', {
    extend: 'Ext.panel.Panel',

    /*
    Uncomment to give this component an xtype
    xtype: 'analyticssdyjsdt',
    */
    xtype: 'analyticssdyjsdt',

    requires: [
        'Ext.button.Button',
        'Ext.layout.container.Fit',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.toolbar.Fill',
        'yt.plugin.date.DateTimeField',
        'yt.view.ytmap.detail.analytics.AnalyticsWYSBController',
        'yt.view.ytmap.detail.analytics.EchartsBasePanel'
    ],

    title: '速度与加速度图',

    controller: 'analyticswysb',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    tbar: [
        {
            xtype: 'datetimefield',
            reference: 'startTime',
            format: 'Y-m-d H',
            fieldLabel: '查询时间',
            emptyText: '请选择起始时间',
            labelAlign: 'right',
            allowBlank: false,
            labelWidth: 60
        },
        {
            xtype: 'datetimefield',
            reference: 'endTime',
            format: 'Y-m-d H',
            fieldLabel: '至',
            emptyText: '请选择结束时间',
            labelAlign: 'right',
            allowBlank: false,
            labelWidth: 20
        },
        { xtype: 'button', text: '搜索', handler: 'sdyjsdtUpdateEcharts'},
        '->',
        { xtype: 'button', text: '导出表格' }
    ],
    items: [
        {
            xtype: 'panel',
            title: '速度图',
            reference: 'speed',
            height: '50%',
            ui: 'map-detail-secend-panel-ui',
            layout: 'fit',
            items: [
                {
                    xtype: 'echartsbasepanel'
                }
            ]
        },
        {
            xtype: 'panel',
            title: '加速度图',
            reference: 'gspeed',
            height: '50%',
            ui: 'map-detail-secend-panel-ui',
            layout: 'fit',
            items: [
                {
                    xtype: 'echartsbasepanel'
                }
            ]
        }
    ],

    listeners: {
        boxready: 'sdyjsdtReady'
    }
});