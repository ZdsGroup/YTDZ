/**
 * Created by lyuwei on 2018/4/18.
 */
Ext.define('yt.view.ytmap.detail.analytics.LJQX', {
    extend: 'Ext.panel.Panel',

    // Uncomment to give this component an xtype 
    xtype: 'analyticsljqx',

    title: '累计曲线',

    layout: 'fit',

    config: {
        deviceType: 'wysb',
        deviceCode: '',
    },

    requires: [
        'Ext.button.Button',
        'Ext.layout.container.Fit',
        'Ext.toolbar.Fill',
        'yt.plugin.date.DateTimeField',
        'yt.view.ytmap.detail.analytics.LJQXController',
        'yt.view.ytmap.detail.analytics.EchartsBasePanel'
    ],

    controller: 'analyticsLJQX',

    tbar: [
        {
            xtype: 'datetimefield',
            reference: 'ljqx_startTime',
            format: 'Y-m-d H',
            fieldLabel: '查询时间',
            emptyText: '请选择起始时间',
            labelAlign: 'right',
            allowBlank: false,
            labelWidth: 60
        },
        {
            xtype: 'datetimefield',
            reference: 'ljqx_endTime',
            format: 'Y-m-d H',
            fieldLabel: '至',
            emptyText: '请选择结束时间',
            labelAlign: 'right',
            allowBlank: false,
            labelWidth: 20
        },
        { xtype: 'button', text: '查询', handler: 'ljqxUpdateEcharts' },
        '->',
        { xtype: 'button', text: '导出表格' }
    ],

    items: [
        {
            xtype: 'echartsbasepanel'
        }
    ],
    listeners: {
        boxready: 'ljqxBoxReady'
    }
});