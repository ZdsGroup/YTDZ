/**
 * Created by lyuwei on 2018/1/17.
 */
Ext.define('yt.view.ytmap.detail.analytics.PMSLT', {
    extend: 'Ext.panel.Panel',

    title: '平面矢量图',
    /*
    Uncomment to give this component an xtype
    xtype: 'analytiscsdypmslt',
    */
    xtype: 'analytiscpmslt',

    requires: [
        'Ext.button.Button',
        'Ext.layout.container.Fit',
        'Ext.toolbar.Fill',
        'yt.plugin.date.DateTimeField',
        'yt.view.ytmap.detail.analytics.WYSBController',
        'yt.view.ytmap.detail.analytics.EchartsBasePanel'
    ],

    layout: 'fit',

    controller: 'analyticswysb',
    config: {
        deviceCode: '7'
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
        { xtype: 'button', text: '查询', handler: 'pmsltUpdateEcharts'},
        '->',
        { xtype: 'button', text: '导出表格' }
    ],

    items: [
        /* include child components here */
        {
            xtype: 'echartsbasepanel'
        }
    ],

    listeners: {
        boxready: 'pmsltBoxReady'
    }
});