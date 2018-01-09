/**
 * Created by lyuwei on 2018/1/9.
 */
Ext.define('yt.view.monpot.monpotAlertInfo', {
    extend: 'Ext.grid.Panel',

    /*
    Uncomment to give this component an xtype
    xtype: 'monpotalertinfo',
    */
    xtype: 'monpot-alertinfo',

    requires: [
        'Ext.button.Button',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.layout.container.Fit',
        'Ext.panel.Panel',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging'
    ],

    layout: 'fit',

    tbar: [
        { xtype: 'datefield', fieldLabel: '查询时间',labelAlign: 'right', labelWidth: 65},
        { xtype: 'datefield', fieldLabel: '至', labelAlign: 'right', labelWidth: 20},
        { xtype: 'button', text: '搜索'},
        '->',
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
                    {label: '地灾点1'},
                    {label: '地灾点2'},
                    {label: '地灾点3'}
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
        }
    ],

    columns: [{
        dataIndex: '1',
        text: '序号',
        flex: 1
    }, {
        dataIndex: '2',
        text: '断面名称',
        flex: 1
    }, {
        dataIndex: '3',
        text: '设备名称',
        flex: 1
    }, {
        dataIndex: '4',
        text: '报警等级',
        flex: 1
    }, {
        dataIndex: '5',
        text: '报警内容',
        flex: 1
    }, {
        dataIndex: '6',
        text: '报警时间',
        flex: 1
    }],
    bbar: {
        xtype: 'pagingtoolbar',
        displayInfo: true,
        displayMsg: '当前展示 {0} - {1} 共 {2}',
        emptyMsg: "当前列表为空"
    }
});