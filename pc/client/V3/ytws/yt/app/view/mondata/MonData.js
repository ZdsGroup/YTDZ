/**
 * Created by LBM on 2017/12/30.
 */
Ext.define('yt.view.mondata.MonData', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.form.FieldContainer',
        'Ext.form.Label',
        'Ext.form.Panel',
        'Ext.form.field.ComboBox',
        'Ext.grid.Panel',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'yt.plugin.date.DateTimeField',
        'yt.utils.CustomPageToolBar',
        'yt.view.mondata.MonDataController',
        'yt.view.mondata.MonDataModel'
    ],

    /*
    Uncomment to give this component an xtype */
    xtype: 'yt-mondata',


    viewModel: {
        type: 'mondata'
    },

    controller: 'mondata',
    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },
    items: [
        /* include child components here */
        {
            xtype: 'form',
            title: '',
            ui: 'mon-form-ui',
            reference: 'monDataConditionFormRef',
            defaultButton: 'queryMonDataRef',
            //bodyPadding: 10,
            margin: '10 10 0 10',
            defaultType: 'textfield',
            fieldDefaults: {
                msgTarget: 'side',
                labelWidth: 60,
                /*labelStyle: 'font-weight:bold'*/
            },
            items: [
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: '监测条件',
                    hideLabel: true,
                    layout: 'hbox',
                    combineErrors: false,
                    defaultType: 'textfield',
                    defaults: {
                        hideLabel: false
                    },
                    items: [
                        {
                            flex: 1,
                            allowBlank: true,
                            fieldLabel: '关键字',
                            reference: 'monName',
                            emptyText: '请输入地灾点或设备名称'
                        },
                        {
                            xtype: 'combobox',
                            flex: 1,
                            reference: 'monAreaListRef',
                            margin: '0 0 0 10',
                            allowBlank: false,
                            fieldLabel: '监测区域',
                            name: 'monArea',
                            valueField: 'area',
                            displayField: 'text',
                            editable: false,
                            typeAhead: false,
                            queryMode: 'local',
                            emptyText: '请选择区域，默认全市',

                            listeners: {
                                select: 'showDeviceList'
                            }
                        },
                        {
                            xtype: 'combobox',
                            flex: 1,
                            reference: 'monTypeListRef',
                            margin: '0 0 0 10',
                            allowBlank: true,
                            fieldLabel: '设备类型',
                            name: 'monType',
                            bind: {
                                store: '{typeStore}'
                            },
                            valueField: 'type',
                            displayField: 'name',
                            // value: '裂缝设备',
                            editable: false,
                            typeAhead: false,
                            queryMode: 'local',
                            emptyText: '请选择类型，默认裂缝设备',

                            listeners: {
                                select: 'showDeviceList'
                            }
                        },
                        {
                            xtype: 'combobox',
                            flex: 1,
                            reference: 'monDeviceListRef',
                            margin: '0 0 0 10',
                            allowBlank: true,
                            fieldLabel: '设备列表',
                            valueField: 'type',
                            displayField: 'text',
                            editable: false,
                            typeAhead: false,
                            queryMode: 'local'
                        }]
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: '监测时间',
                    hideLabel: true,
                    layout: 'hbox',
                    combineErrors: false,
                    defaultType: 'textfield',
                    defaults: {
                        hideLabel: false
                    },

                    items: [
                        {
                            xtype: 'datetimefield',
                            format: 'Y-m-d H:i:s',
                            fieldLabel: '起始时间',
                            reference: 'startTime',
                            flex: 1,
                            emptyText: '请选择起始时间',
                            allowBlank: false,
                            value: Ext.Date.add(new Date(), Ext.Date.DAY, -1)  //默认提前一天
                        }, {
                            xtype: 'datetimefield',
                            format: 'Y-m-d H:i:s',
                            fieldLabel: '结束时间',
                            reference: 'endTime',
                            flex: 1,
                            margin: '0 0 0 8',
                            emptyText: '请选择结束时间',
                            allowBlank: false,
                            value: new Date()  //默认当天
                        }, {
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
                                    xtype: 'label',
                                    id: 'queryMonDataInfo',
                                    style: 'color:red;font-size:14px;font-weight:normal;margin:6px 6px 6px 0px;',
                                    text: '默认显示前一天监测数据'
                                },
                                {
                                    xtype: 'component',
                                    flex: 1
                                },
                                {
                                    xtype: 'button',
                                    text: '查询',
                                    reference: 'queryMonDataRef',
                                    disabled: false,
                                    formBind: false,
                                    handler: 'buttonRefreshFun'
                                },
                                {
                                    xtype: 'button',
                                    margin: '0 0 0 10',
                                    text: '重置',
                                    handler: 'cleanAllData'
                                }
                            ]
                        }]
                }
            ]
        }, {
            xtype: 'component',
            height: 1,
            style: 'background-color:rgba(158, 158, 158,1.0)'
        }, {
            xtype: 'gridpanel',
            title: '',
            ui: '',
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
                text: '设备名称',
                flex: 1,
                dataIndex: 'devicename',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center'
            }, {
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
                        beforechange: 'pagebuttonChange'
                    }
                }
            ]
        },

        {
            xtype: 'gridpanel',
            title: '',
            ui: '',
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
                text: 'x',
                width: 120,
                dataIndex: 'x',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center'
            }, {
                text: 'y',
                width: 120,
                dataIndex: 'y',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center'
            }, {
                text: 'h',
                width: 120,
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
                align: 'center'
            }, {
                text: 'Y轴位移',
                width: 120,
                dataIndex: 'dy',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center'
            }, {
                text: 'H轴位移',
                width: 120,
                dataIndex: 'dh',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center'
            }, {
                text: '二维位移长度',
                width: 120,
                dataIndex: 'd2',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center'
            }, {
                text: '三维位移长度',
                width: 120,
                dataIndex: 'd3',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center'
            }, {
                text: 'X轴速度',
                width: 120,
                dataIndex: 'xs',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center'
            }, {
                text: 'Y轴速度',
                width: 120,
                dataIndex: 'ys',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center'
            }, {
                text: 'H轴速度',
                width: 120,
                dataIndex: 'hs',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center'
            }, {
                text: 'X轴加速度',
                width: 120,
                dataIndex: 'xxs',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center'
            }, {
                text: 'Y轴加速度',
                width: 120,
                dataIndex: 'yys',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center'
            }, {
                text: 'H轴加速度',
                width: 120,
                dataIndex: 'hhs',
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
                        beforechange: 'pagebuttonChange'
                    }
                }
            ]
        }
    ],
    listeners: {
        afterrender: 'gridPanelBoxReady'
    }
});