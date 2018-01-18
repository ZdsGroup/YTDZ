/**
 * Created by lyuwei on 2018/1/17.
 */
Ext.define('yt.view.ytmap.detail.analytics.AnalyticsDMQXT', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.button.Button',
        'Ext.form.field.ComboBox',
        'Ext.layout.container.Fit',
        'Ext.toolbar.Fill',
        'yt.plugin.date.DateTimeField',
        'yt.view.ytmap.detail.analytics.AnalyticsWYSBController',
        'yt.view.ytmap.detail.analytics.EchartsBasePanel'
    ],

    /*
    Uncomment to give this component an xtype
    xtype: 'analyticsdmqxt',
    */
    xtype: 'analyticsdmqxt',

    controller: 'analyticswysb',

    title: '断面曲线图',
    layout: 'fit',
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
        {
            xtype: 'combo',
            reference: 'searchType',
            fieldLabel: '对比指标',
            emptyText: '请选择结束时间',
            labelAlign: 'right',
            labelWidth: 60,
            displayField: 'text',
            queryMode: 'local',
            selectOnTab: true,
            editable: false,
            typeAhead: false,
            allowBlank: false,
            store: {
                data: [
                    { text: 'X轴位移' },
                    { text: 'Y轴位移' },
                    { text: 'H轴位移' },
                    { text: '二维位移长度' },
                    { text: '三维位移长度' }
                ]
            }
        },
        { xtype: 'button', text: '搜索', handler: 'dmqxtUpdateEcharts'},
        '->',
        { xtype: 'button', text: '导出表格' }
    ],
    items: [
        {
            xtype: 'echartsbasepanel'
        }
    ],

    listeners: {
        boxready: 'dmqxtReady'
    }
});