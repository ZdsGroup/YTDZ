/**
 * Created by lyuwei on 2018/1/9.
 */
Ext.define('yt.view.monpot.monpotAnalytics', {
    extend: 'Ext.panel.Panel',

    /*
    Uncomment to give this component an xtype
    xtype: 'monpotanalytics',
    */
    xtype: 'monpot-analytics',

    requires: [
        'Ext.button.Button',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.layout.container.Fit',
        'Ext.panel.Panel',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Separator'
    ],

    layout: 'fit',

    tbar: [
        {
            xtype: 'combo',
            fieldLabel: '设备筛选',
            labelWidth: 65,
            labelAlign: 'right',
            displayField: 'label',
            queryMode: 'local',
            selectOnTab: true,
            store: {
                data: [
                    {label: '位移设备'},
                    {label: '监测设备'},
                    {label: '雨量设备'}
                ]
            }
        },
        {
            xtype: 'combo',
            displayField: 'label',
            queryMode: 'local',
            selectOnTab: true,
            store: {
                data: [
                    {label: '设备1'},
                    {label: '设备2'},
                    {label: '设备3'}
                ]
            }
        },'-',
        { xtype: 'datefield', fieldLabel: '查询时间',labelAlign: 'right', labelWidth: 65},
        { xtype: 'datefield', fieldLabel: '至', labelAlign: 'right', labelWidth: 20},
        { xtype: 'button', text: '搜索'},
        '->',
        { xtype: 'button', text: '导出表格' }
    ],

    items: [
        {
            xtype: 'panel',
            html: '对应设备的对应图表'
        }
    ]
});