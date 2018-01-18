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
        'Ext.form.field.Checkbox',
        'Ext.form.field.ComboBox',
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
                // '-',
                // { xtype: 'checkbox', boxLabel: '对比设备1',inputValue: '对比设备1'},
                // { xtype: 'checkbox', boxLabel: '对比设备2',inputValue: '对比设备2'},
                // { xtype: 'checkbox', boxLabel: '对比设备3',inputValue: '对比设备3'},
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
            reference: 'dqsbdndb',
            iconCls: 'fa fa-balance-scale',
            height: '50%',
            layout: 'fit',
            ui: 'map-detail-secend-panel-ui',
            tbar: [
                {
                    xtype: 'combo',
                    reference: 'dqsbdndb_startTime',
                    fieldLabel: '起始年份',
                    emptyText: '请选择起始时间',
                    labelAlign: 'right',
                    labelWidth: 60,
                    displayField: 'year',
                    queryMode: 'local',
                    selectOnTab: true,
                    editable: false,
                    typeAhead: false,
                    allowBlank: false,
                    store: {
                        data: [
                            { year: '2013'},{ year: '2014'},{ year: '2015'},{ year: '2016'},
                            { year: '2017'},{ year: '2018'},{ year: '2019'},{ year: '2020'},
                            { year: '2021'},{ year: '2022'},{ year: '2023'}
                        ]
                    }
                },
                {
                    xtype: 'combo',
                    reference: 'dqsbdndb_endTime',
                    fieldLabel: '结束年份',
                    emptyText: '请选择结束时间',
                    labelAlign: 'right',
                    labelWidth: 60,
                    displayField: 'year',
                    queryMode: 'local',
                    selectOnTab: true,
                    editable: false,
                    typeAhead: false,
                    allowBlank: false,
                    store: {
                        data: [
                            { year: '2013'},{ year: '2014'},{ year: '2015'},{ year: '2016'},
                            { year: '2017'},{ year: '2018'},{ year: '2019'},{ year: '2020'},
                            { year: '2021'},{ year: '2022'},{ year: '2023'}
                        ]
                    }
                },
                {
                    xtype: 'combo',
                    reference: 'dqsbdndb_searchType',
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
                { xtype: 'button', text: '搜索', handler: 'dqsbdndbUpdateEcharts'},
                '->',
                { xtype: 'button', text: '导出表格' }
            ],
            items: [
                {
                    xtype: 'echartsbasepanel'
                }
            ],

            listeners: {
                boxready: 'dqsbdndbBoxReady'
            }
        }
    ]
});