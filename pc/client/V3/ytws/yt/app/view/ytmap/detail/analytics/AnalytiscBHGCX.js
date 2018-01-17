/**
 * Created by lyuwei on 2018/1/17.
 */
Ext.define('yt.view.ytmap.detail.analytics.AnalytiscBHGCX', {
    extend: 'Ext.panel.Panel',

    title: '变化过程线',
    /*
    Uncomment to give this component an xtype
    xtype: 'analytiscbhgcx',
    */
    xtype: 'analytiscbhgcx',

    requires: [
        'Ext.button.Button',
        'Ext.chart.series.Line',
        'Ext.form.field.Date',
        'Ext.layout.container.Fit',
        'Ext.toolbar.Fill',
        'yt.view.ytmap.detail.analytics.EchartsBasePanel'
    ],

    layout: 'fit',
    tbar: [
        { xtype: 'datefield', fieldLabel: '查询时间',labelAlign: 'right', labelWidth: 65},
        { xtype: 'datefield', fieldLabel: '至', labelAlign: 'right', labelWidth: 20},
        { xtype: 'button', text: '搜索'},
        '->',
        { xtype: 'button', text: '导出表格' }
    ],
    items: [
        {
            xtype: 'echartsbasepanel'
        }
    ]
});