/**
 * Created by lyuwei on 2018/1/9.
 */
Ext.define('yt.view.ytmap.detail.monpotAlertInfo', {
    extend: 'Ext.panel.Panel',

    /*
    Uncomment to give this component an xtype
    xtype: 'monpotalertinfo',
    */
    xtype: 'monpot-alertinfo',

    requires: [
        'Ext.button.Button',
        'Ext.form.field.ComboBox',
        'Ext.grid.Panel',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.toolbar.Paging',
        'yt.plugin.date.DateTimeField'
    ],

    flex: 1,
    margin: '5 10 5 10',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'panel',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'center'
            },
            border: false,
            items: [
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
                },
                {
                    xtype: 'component',
                    width: 5
                },
                {
                    xtype: 'button',
                    text: '搜索'
                },
                {
                    xtype: 'component',
                    flex: 1
                },
                {
                    // 如果点击弹出的是监测设备详细面板则该部分不显示
                    xtype: 'panel',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'center'
                    },
                    border: false,
                    items: [
                        {
                            xtype: 'combo',
                            fieldLabel: '设备筛选',
                            labelWidth: 65,
                            labelAlign: 'right',
                            displayField: 'label',
                            editable: false,
                            typeAhead: false,
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
                            xtype: 'component',
                            width: 5
                        },
                        {
                            xtype: 'combo',
                            displayField: 'label',
                            editable: false,
                            typeAhead: false,
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
                    ]
                }
            ]
        },
        {
            xtype: 'gridpanel',
            flex: 1,
            margin: '5 0 0 0',
            border: true,
            // columnLines: true,
            // reserveScrollbar: true,
            // multiSelect: false,
            scrollable: 'y',
            viewConfig: {
                stripeRows: false
            },
            leadingBufferZone: 8,
            trailingBufferZone: 8,

            columns: [
                {
                    dataIndex: '1',
                    text: '序号',
                    flex: 1,

                    hideable: false,
                    menuDisabled: true,
                    resizable: false,
                    sortable: false,
                    align: 'center'
                }, {
                    dataIndex: '2',
                    text: '断面名称',
                    flex: 1,

                    hideable: false,
                    menuDisabled: true,
                    resizable: false,
                    sortable: false,
                    align: 'center'
                }, {
                    dataIndex: '3',
                    text: '设备名称',
                    flex: 1,

                    hideable: false,
                    menuDisabled: true,
                    resizable: false,
                    sortable: false,
                    align: 'center'
                }, {
                    dataIndex: '4',
                    text: '报警等级',
                    flex: 1,

                    hideable: false,
                    menuDisabled: true,
                    resizable: false,
                    sortable: false,
                    align: 'center'
                }, {
                    dataIndex: '5',
                    text: '报警内容',
                    flex: 1,

                    hideable: false,
                    menuDisabled: true,
                    resizable: false,
                    sortable: false,
                    align: 'center'
                }, {
                    dataIndex: '6',
                    text: '报警时间',
                    flex: 1,

                    hideable: false,
                    menuDisabled: true,
                    resizable: false,
                    sortable: false,
                    align: 'center'
                }],
            bbar: {
                xtype: 'pagingtoolbar',
                displayInfo: true,
                displayMsg: '当前展示 {0} - {1} 共 {2}',
                emptyMsg: "当前列表为空"
            }
        }
    ]
});