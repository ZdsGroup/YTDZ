/**
 * Created by lyuwei on 2018/1/17.
 */
Ext.define('yt.view.ytmap.detail.analytics.AnalyticsYLZXT', {
    extend: 'Ext.panel.Panel',

    title: '雨量过程图',
    /*
    Uncomment to give this component an xtype
    xtype: 'analyticsylzxt',
    */
    xtype: 'analyticsylzxt',

    requires: [
        'Ext.button.Button',
        'Ext.layout.container.Fit',
        'Ext.toolbar.Fill',
        'yt.plugin.date.DateTimeField',
        'yt.view.ytmap.detail.analytics.AnalyticsYLZXTController',
        'yt.view.ytmap.detail.analytics.EchartsBasePanel'
    ],

    controller: 'analyticsylzxt',

    layout: 'fit',
    tbar: [
        {
            xtype: 'datetimefield',
            reference: 'ylzxt_startTime',
            format: 'Y-m-d H',
            fieldLabel: '查询时间',
            emptyText: '请选择起始时间',
            labelAlign: 'right',
            allowBlank: false,
            labelWidth: 60
        },
        {
            xtype: 'datetimefield',
            reference: 'ylzxt_endTime',
            format: 'Y-m-d H',
            fieldLabel: '至',
            emptyText: '请选择结束时间',
            labelAlign: 'right',
            allowBlank: false,
            labelWidth: 20
        },
        { xtype: 'button', text: '搜索', handler: 'ylzxtUpdateEcharts'},
        '->',
        { xtype: 'button', text: '导出表格' }
    ],
    items: [
        {
            xtype: 'echartsbasepanel'
        }
    ],
    listeners: {
        boxready: 'bhgcxBoxReady'
    }
});