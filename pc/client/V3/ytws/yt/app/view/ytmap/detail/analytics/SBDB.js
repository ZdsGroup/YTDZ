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
        'Ext.form.field.Tag',
        'Ext.layout.container.Fit',
        'Ext.panel.Panel',
        'Ext.toolbar.Fill',
        'yt.plugin.date.DateTimeField',
        'yt.view.ytmap.detail.analytics.EchartsBasePanel',
        'yt.view.ytmap.detail.analytics.SBDBController'
    ],

    config: {
        deviceType: 'wysb',
        deviceCode: '',
        quakeCode: '100000'
    },

    title: '设备对比',

    layout: 'fit',

    controller: {
        type: 'analyticssbdb'
    },
    tbar: [

        {
            xtype: 'tagfield',
            fieldLabel: '对比设备',
            emptyText: '请选择需要对比的设备',
            reference: 'comparedDevice',
            displayField: 'name',
            valueField: 'devicecode',
            filterPickList: true,
            queryMode: 'local',
            publishes: 'value',

            labelWidth: 60,
            width: 350
        },

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