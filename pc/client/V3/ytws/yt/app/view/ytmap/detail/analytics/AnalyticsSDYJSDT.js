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
        'Ext.form.field.Date',
        'Ext.layout.container.Fit',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.toolbar.Fill',
        'yt.view.ytmap.detail.analytics.EchartsBasePanel'
    ],

    title: '速度与加速度图',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    tbar: [
        { xtype: 'datefield', fieldLabel: '查询时间',labelAlign: 'right', labelWidth: 65},
        { xtype: 'datefield', fieldLabel: '至', labelAlign: 'right', labelWidth: 20},
        { xtype: 'button', text: '搜索'},
        '->',
        { xtype: 'button', text: '导出表格' }
    ],
    items: [
        {
            xtype: 'panel',
            title: '速度图',
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
            height: '50%',
            ui: 'map-detail-secend-panel-ui',
            layout: 'fit',
            items: [
                {
                    xtype: 'echartsbasepanel'
                }
            ]
        }
    ]
});