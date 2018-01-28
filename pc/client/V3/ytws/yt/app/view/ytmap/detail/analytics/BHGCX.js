/**
 * Created by lyuwei on 2018/1/17.
 */
Ext.define('yt.view.ytmap.detail.analytics.BHGCX', {
    extend: 'Ext.panel.Panel',

    title: '变化过程线',
    /*
    Uncomment to give this component an xtype
    xtype: 'analytiscbhgcx',
    */
    xtype: 'analytiscbhgcx',

    requires: [
        'Ext.button.Button',
        'Ext.layout.container.Fit',
        'Ext.toolbar.Fill',
        'yt.plugin.date.DateTimeField',
        'yt.view.ytmap.detail.analytics.BHGCXController',
        'yt.view.ytmap.detail.analytics.EchartsBasePanel'
    ],

    controller: 'analyticsbhgcx',

    layout: 'fit',
    config: {
        deviceCode: '3'
    },
    tbar: [
        {
            xtype: 'datetimefield',
            reference: 'bhgcx_startTime',
            format: 'Y-m-d H',
            fieldLabel: '查询时间',
            emptyText: '请选择起始时间',
            labelAlign: 'right',
            allowBlank: false,
            labelWidth: 60
        },
        {
            xtype: 'datetimefield',
            reference: 'bhgcx_endTime',
            format: 'Y-m-d H',
            fieldLabel: '至',
            emptyText: '请选择结束时间',
            labelAlign: 'right',
            allowBlank: false,
            hidden: true,
            labelWidth: 20
        },
        { xtype: 'button', text: '搜索', handler: 'bhgcxUpdateEcharts'},
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