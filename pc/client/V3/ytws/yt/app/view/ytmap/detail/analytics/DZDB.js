/**
 * Created by lyuwei on 2018/1/28.
 */
Ext.define('yt.view.ytmap.detail.analytics.DZDB', {
    extend: 'Ext.panel.Panel',

    /*
    Uncomment to give this component an xtype
    xtype: 'analyticsdzdb',
    */
    xtype: 'analyticsdzdb',

    requires: [
        'Ext.button.Button',
        'Ext.form.field.ComboBox',
        'Ext.layout.container.Fit',
        'Ext.toolbar.Fill',
        'yt.view.ytmap.detail.analytics.DZDBController',
        'yt.view.ytmap.detail.analytics.EchartsBasePanel'
    ],

    config: {
        deviceType: 'wysb',
        deviceCode: '7'
    },

    title: '时段对比',

    controller: {
        type: 'analyticsdzdb'
    },

    layout: 'fit',
    tbar: [
        {
            xtype: 'combo',
            reference: 'startTime',
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
            reference: 'endTime',
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
            reference: 'searchType',
            fieldLabel: '对比指标',
            emptyText: '请选择结束时间',
            labelAlign: 'right',
            labelWidth: 60,
            displayField: 'text',
            queryMode: 'local',
            hidden: true,
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
        { xtype: 'button', text: '搜索', handler: 'dzdbUpdateEcharts'},
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
    },

    // initComponent: function () {
    //     var me = this;
    //
    // }
});