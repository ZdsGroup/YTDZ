/**
 * Created by lyuwei on 2018/1/17.
 */
Ext.define('yt.view.ytmap.detail.analytics.SBDB', {
    extend: 'Ext.panel.Panel',

    /*
    Uncomment to give this component an xtype
    xtype: 'analyticssbdb',
    */
    xtype: 'analyticssbdb',

    requires: [
        'Ext.button.Button',
        'Ext.layout.container.Fit',
        'Ext.panel.Panel',
        'Ext.toolbar.Fill',
        'yt.plugin.date.DateTimeField',
        'yt.view.ytmap.detail.analytics.SBDBController',
        'yt.view.ytmap.detail.analytics.EchartsBasePanel'
    ],

    config: {
        deivceType: 'wysb',
        quakeCode: '100000'
    },

    title: '多站对比',

    layout: 'fit',

    controller: {
        type: 'analyticssbdb'
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
            hidden: true,
            labelWidth: 20
        },
        { xtype: 'button', text: '搜索', handler: 'tlxsbdbUpdateEcharts'},
        '->',
        { xtype: 'button', text: '导出表格' }
    ],

    items: [
        {
            xtype: 'echartsbasepanel'
        }
    ],

    listeners: {
        boxready: 'dzdbBoxReady'
    }
});