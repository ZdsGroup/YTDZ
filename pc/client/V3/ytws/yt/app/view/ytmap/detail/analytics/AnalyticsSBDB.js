/**
 * Created by lyuwei on 2018/1/17.
 */
Ext.define('yt.view.ytmap.detail.analytics.AnalyticsSBDB', {
    extend: 'Ext.Container',

    /*
    Uncomment to give this component an xtype
    xtype: 'analyticssbdb',
    */
    xtype: 'analyticssbdb',

    requires: [
        'Ext.button.Button',
        'Ext.data.TreeStore',
        'Ext.form.field.Checkbox',
        'Ext.layout.container.Fit',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Separator',
        'yt.plugin.date.DateTimeField',
        'yt.view.ytmap.detail.analytics.AnalyticsSBDBController',
        'yt.view.ytmap.detail.analytics.EchartsBasePanel'
    ],

    title: '设备对比',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    controller: {
        type: 'analyticssbdb'
    },

    items: [
        {
            xtype: 'panel',
            title: '同类型设备对比',
            reference: 'tlxsbdb',
            iconCls: 'fa fa-chain',
            height: '50%',
            ui: 'map-detail-secend-panel-ui',
            layout: 'fit',
            tbar: [
                {
                    xtype: 'datetimefield',
                    reference: 'tlxsbdb_startTime',
                    format: 'Y-m-d H',
                    fieldLabel: '查询时间',
                    emptyText: '请选择起始时间',
                    labelAlign: 'right',
                    allowBlank: false,
                    labelWidth: 60
                },
                {
                    xtype: 'datetimefield',
                    reference: 'tlxsbdb_endTime',
                    format: 'Y-m-d H',
                    fieldLabel: '至',
                    emptyText: '请选择结束时间',
                    labelAlign: 'right',
                    allowBlank: false,
                    hidden: true,
                    labelWidth: 20
                },
                { xtype: 'button', text: '搜索', handler: 'tlxsbdbUpdateEcharts'},
                '-',
                { xtype: 'checkbox', boxLabel: '对比设备1',inputValue: '对比设备1'},
                { xtype: 'checkbox', boxLabel: '对比设备2',inputValue: '对比设备2'},
                { xtype: 'checkbox', boxLabel: '对比设备3',inputValue: '对比设备3'},
                '->',
                { xtype: 'button', text: '导出表格' }
            ],
            items: [
                {
                    xtype: 'echartsbasepanel'
                }
            ],
            listeners: {
                boxready: 'tlxsbdbBoxReady'
            }
        },
        {
            xtype: 'panel',
            title: '当前设备多年对比',
            iconCls: 'fa fa-balance-scale',
            height: '50%',
            layout: 'fit',
            ui: 'map-detail-secend-panel-ui',
            tbar: [
                {
                    xtype: 'datetimefield',
                    format: 'Y/m/d H:i:s',
                    fieldLabel: '查询时间',
                    emptyText: '请选择起始时间',
                    labelAlign: 'right',
                    allowBlank: false,
                    labelWidth: 60
                },
                {
                    xtype: 'datetimefield',
                    format: 'Y/m/d H:i:s',
                    fieldLabel: '至',
                    emptyText: '请选择结束时间',
                    labelAlign: 'right',
                    allowBlank: false,
                    labelWidth: 20
                },{ xtype: 'button', text: '搜索'},
                '->',
                { xtype: 'button', text: '导出表格' }
            ],
            items: [
                {
                    xtype: 'echartsbasepanel'
                }
            ]
        }
    ]
});