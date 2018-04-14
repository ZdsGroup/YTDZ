/**
 * Created by lyuwei on 2018/1/9.
 */
Ext.define('yt.view.ytmap.detail.monpotMonitordata', {
    extend: 'Ext.panel.Panel',

    /*
    Uncomment to give this component an xtype
    xtype: 'monpotmonitordata',
    */
    xtype: 'monpot-monitordata',

    requires: [
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.form.FieldContainer',
        'Ext.form.field.ComboBox',
        'Ext.grid.Panel',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'yt.plugin.date.DateTimeField',
        'yt.utils.CustomPageToolBar',
        'yt.view.ytmap.detail.DetailViewModel',
        'yt.view.ytmap.detail.monpotMonitordataController'
    ],
    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },

    viewModel: {
        type: 'detailViewModel'
    },

    controller: 'monpotmonitordata',

    config: {
        quakeId: '',
        deviceId: '',
        deviceType: '',
    },

    margin: '5 10 5 10',

    items: [
        {
            xtype: 'fieldcontainer',
            hideLabel: true,
            layout: 'hbox',
            combineErrors: false,
            defaultType: 'textfield',
            defaults: {
                hideLabel: false
            },
            items: [
                {
                    xtype: 'combobox',
                    flex: 1,
                    hidden: true,
                    reference: 'monDeviceListRef',
                    margin: '0 0 0 10',
                    allowBlank: true,
                    fieldLabel: '设备类型',
                    msgTarget: 'side',
                    labelWidth: 60,
                    store: {
                        data: [
                            {name: '位移设备', type: 'wysb'},
                            {name: '裂缝设备', type: 'lfsb'},
                            {name: '雨量设备', type: 'ylsb'}
                        ]
                    },
                    valueField: 'type',
                    displayField: 'name',
                    editable: false,
                    typeAhead: false,
                    queryMode: 'local',
                    emptyText: '请选择类型，默认位移设备'
                },
                {
                    xtype: 'datetimefield',
                    format: 'Y-m-d H:i:s',
                    fieldLabel: '起始时间',
                    margin: '0 0 0 10',
                    msgTarget: 'side',
                    labelWidth: 60,
                    reference: 'startTime',
                    flex: 1,
                    emptyText: '请选择起始时间',
                    allowBlank: false,
                    value: Ext.Date.add(new Date(), Ext.Date.DAY, -1)  //默认提前一天
                }, {
                    xtype: 'datetimefield',
                    format: 'Y-m-d H:i:s',
                    fieldLabel: '结束时间',
                    msgTarget: 'side',
                    labelWidth: 60,
                    reference: 'endTime',
                    flex: 1,
                    margin: '0 0 0 8',
                    emptyText: '请选择结束时间',
                    allowBlank: false,
                    value: new Date()  //默认当天
                },
                {
                    xtype: 'container',
                    flex: 2,
                    margin: '0 0 0 10',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'component',
                            width: 5
                        },
                        {
                            xtype: 'button',
                            text: '查询',
                            reference: 'queryMonDataRef',
                            disabled: false,
                            formBind: false,
                            handler: 'monitorDataBtnClick'
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'component',
            height: 1,
            style: 'background-color:rgba(158, 158, 158,1.0)'
        },
        {
            xtype: 'gridpanel',
            reference: 'monLFYLDataGridRef',
            margin: '10 10 10 10',
            flex: 1,
            hidden: true,
            border: true,
            columnLines: true,
            reserveScrollbar: true,
            multiSelect: false,
            scrollable: 'y',
            viewConfig: {
                stripeRows: false
            },
            columns: [{
                text: '所属区域',
                flex: 1,
                dataIndex: 'regionname',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center'
            }, {
                text: '所属地灾点',
                flex: 1,
                dataIndex: 'quakename',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center'
            }, {
                text: '设备名称',
                flex: 1,
                dataIndex: 'devicename',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center'
            }, {
                text: '数据值',
                flex: 1,
                dataIndex: 'v1',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center'
            }, {
                text: '时间',
                flex: 1,
                dataIndex: 'datekey',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center'
            }],
            leadingBufferZone: 8,
            trailingBufferZone: 8,
            bbar: [
                {
                    xtype: 'Custompagetoolbar',
                    displayInfo: true,
                    bind: '{gridPageStore}',
                    listeners: {
                        beforechange: 'monitorDataPagebuttonChange'
                    }
                }
            ]
        },

        {
            xtype: 'gridpanel',
            reference: 'monWYDataGridRef',
            margin: '10 10 10 10',
            flex: 1,
            hidden: true,
            border: true,
            columnLines: true,
            reserveScrollbar: true,
            multiSelect: false,
            scrollable: true,
            viewConfig: {
                stripeRows: false
            },
            columns: [{
                text: '所属区域',
                width: 120,
                dataIndex: 'regionname',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                locked: true,
                align: 'center'
            }, {
                text: '所属地灾点',
                width: 170,
                dataIndex: 'quakename',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                locked: true,
                align: 'center'
            }, {
                text: '设备名称',
                width: 170,
                dataIndex: 'devicename',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                locked: true,
                align: 'center'
            }, {
                text: '时间',
                width: 170,
                dataIndex: 'datekey',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                locked: true,
                align: 'center'
            }, {
                text: 'x (mm)',
                width: 135,
                dataIndex: 'x',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center'
            }, {
                text: 'y (mm)',
                width: 135,
                dataIndex: 'y',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center'
            }, {
                text: 'h (mm)',
                width: 135,
                dataIndex: 'h',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center'
            }, {
                text: 'X轴位移',
                width: 120,
                dataIndex: 'dx',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center',
                renderer: function (value) {
                    return value.toString() + ' mm'
                }
            }, {
                text: 'Y轴位移',
                width: 120,
                dataIndex: 'dy',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center',
                renderer: function (value) {
                    return value.toString() + ' mm'
                }
            }, {
                text: 'H轴位移',
                width: 120,
                dataIndex: 'dh',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center',
                renderer: function (value) {
                    return value.toString() + ' mm'
                }
            }, {
                text: '二维位移长度',
                width: 120,
                dataIndex: 'd2',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center',
                renderer: function (value) {
                    return value.toString() + ' mm'
                }
            }, {
                text: '三维位移长度',
                width: 120,
                dataIndex: 'd3',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center',
                renderer: function (value) {
                    return value.toString() + ' mm'
                }
            }, {
                text: 'X轴速度',
                width: 120,
                dataIndex: 'xs',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center',
                renderer: function (value) {
                    return value.toString() + ' mm/s'
                }
            }, {
                text: 'Y轴速度',
                width: 120,
                dataIndex: 'ys',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center',
                renderer: function (value) {
                    return value.toString() + ' mm/s'
                }
            }, {
                text: 'H轴速度',
                width: 120,
                dataIndex: 'hs',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center',
                renderer: function (value) {
                    return value.toString() + ' mm/s'
                }
            }, {
                text: 'X轴加速度',
                width: 120,
                dataIndex: 'xxs',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center',
                renderer: function (value) {
                    return value.toString() + ' mm/s2'
                }
            }, {
                text: 'Y轴加速度',
                width: 120,
                dataIndex: 'yys',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center',
                renderer: function (value) {
                    return value.toString() + ' mm/s2'
                }
            }, {
                text: 'H轴加速度',
                width: 120,
                dataIndex: 'hhs',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center',
                renderer: function (value) {
                    return value.toString() + ' mm/s2'
                }
            }],
            leadingBufferZone: 8,
            trailingBufferZone: 8,
            bbar: [
                {
                    xtype: 'Custompagetoolbar',
                    displayInfo: true,
                    bind: '{gridPageStore}',
                    listeners: {
                        beforechange: 'monitorDataPagebuttonChange'
                    }
                }
            ]
        }
    ],

    listeners: {
        boxready: 'monitorDataBoxReady'
    }
});