/**
 * Created by LBM on 2017/12/30.
 */
Ext.define('yt.view.monpot.MonPot', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.button.Button',
        'Ext.chart.series.Bar',
        'Ext.container.Container',
        'Ext.form.Panel',
        'Ext.form.field.ComboBox',
        'Ext.grid.Panel',
        'Ext.grid.column.Action',
        'Ext.layout.container.Fit',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.toolbar.Fill',
        'Ext.tree.Column',
        'yt.utils.CustomPageToolBar',
        'yt.view.monpot.MonPotController',
        'yt.view.monpot.MonPotModel',
        'yt.view.ytmap.detail.analytics.EchartsBasePanel'
    ],

    /*
    Uncomment to give this component an xtype*/
    xtype: 'yt-monpot',


    viewModel: {
        type: 'monpot'
    },

    controller: 'monpot',

    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },
    border: false,
    listeners: {
        boxready: 'monpotViewBoxReadyfunc'
    },
    items: [
        /* include child components here */
        {
            xtype: 'form',
            title: '',
            ui: 'monpot-form-ui',
            reference: 'monPotFormRef',
            margin: '10 10 0 10',
            defaultType: 'textfield',
            fieldDefaults: {
                msgTarget: 'side',
                labelWidth: 60
            },
            layout: 'hbox',
            items: [
                {
                    flex: 1,
                    allowBlank: true,
                    fieldLabel: '关键字',
                    reference: 'monpotName',
                    emptyText: '请输入地灾点或设备名称'
                },
                {
                    xtype: 'combobox',
                    flex: 1,
                    reference: 'monAreaListRef',
                    margin: '0 0 0 10',
                    allowBlank: false,
                    fieldLabel: '监测区域',
                    valueField: 'area',
                    displayField: 'text',
                    editable: false,
                    typeAhead: false,
                    queryMode: 'local',
                    emptyText: '请选择区域，默认全市',
                },
                {
                    xtype: 'combobox',
                    flex: 1,
                    reference: 'queryTypeRef',
                    margin: '0 0 0 10',
                    allowBlank: true,
                    fieldLabel: '查询类型',
                    store: {
                        data: [
                            {name: '地灾点', type: 'dzd'},
                            {name: '监测设备', type: 'jcsb'}
                        ]
                    },
                    valueField: 'type',
                    displayField: 'name',
                    editable: false,
                    typeAhead: false,
                    queryMode: 'local',
                    emptyText: '请选择查询类型，默认地灾点',

                    listeners: {
                        select: 'showDeviceTypeList'
                    }
                },
                {
                    xtype: 'combobox',
                    flex: 1,
                    reference: 'queryDeviceTypeRef',
                    margin: '0 0 0 10',
                    allowBlank: true,
                    hidden: true,
                    fieldLabel: '设备类型',
                    store: {
                        data: [
                            {name: '全部类型', type: ''},
                            {name: '裂缝设备', type: '3'},
                            {name: '位移设备', type: '1'},
                            {name: '雨量设备', type: '2'}
                        ]
                    },
                    valueField: 'type',
                    displayField: 'name',
                    editable: false,
                    typeAhead: false,
                    queryMode: 'local',
                    emptyText: '请选择类型，默认全部设备',
                },
                {
                    xtype: 'container',
                    flex: 1,
                    margin: '0 0 0 10',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'component',
                            flex: 1
                        },
                        {
                            xtype: 'button',
                            text: '查询',
                            reference: 'queryMonPotRef',
                            disabled: false,
                            formBind: false,
                            handler: 'queryButtonClick'
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'gridpanel',
            id: 'monpotGridpanel',

            flex: 1,
            border: true,
            scrollable: 'y',
            margin: '10 10 10 10',
            reserveScrollbar: true,
            useArrows: true,
            rootVisible: false,
            multiSelect: true,
            singleExpand: true,
            columnLines: true,
            dockedItems: [
                {
                    id: 'monpotToolBar',
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        '->',
                        {
                            xtype: 'button',
                            id: 'monpotGridpanelUpdate',
                            text: '新增',
                            handler: 'addNew'
                        },
                        {
                            xtype: 'button',
                            id: 'monpotGridpanelBack',
                            text: '返回上一级',
                            handler: 'getBack'
                        }
                    ]
                },
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items:[
                        {
                            xtype: 'Custompagetoolbar',
                            displayInfo: false,
                            bind: '{gridPageStore}',
                            listeners: {
                                beforechange: 'pagebuttonChange'
                            }
                        }
                    ]
                }
            ],
            viewConfig: {
                stripeRows: false
            },
            store: {
                data: []
            },
            columns: [{
                text: '名称',
                dataIndex: 'name',

                width: 180,
                align: 'center',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false
            }, {
                text: '承担单位',
                dataIndex: 'company',

                width: 160,
                align: 'center',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false
            }, {
                text: '负责人',
                dataIndex: 'username',

                width: 100,
                align: 'center',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false
            }, {
                text: '联系电话',
                dataIndex: 'mobile',

                width: 100,
                align: 'center',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false
            }, {
                text: '简述',
                dataIndex: 'description',

                flex: 2,
                align: 'center',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false
            }, {
                text: '地址',
                dataIndex: 'address',

                flex: 3,
                align: 'center',
                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false
            }, {
                xtype: 'actioncolumn',
                id: 'monpotGridActionColumn',
                text: '操作',

                width: 165,
                align: 'center',
                items: [
                    {
                        xtype: 'button',
                        iconCls: 'x-fa fa-info-circle actioncolumnMargin',
                        tooltip: '详情'
                    },
                    {
                        xtype: 'button',
                        iconCls: 'x-fa fa-edit actioncolumnMargin',
                        tooltip: '修改',
                        hidden: true
                    },
                    {
                        xtype: 'button',
                        iconCls: 'x-fa fa-trash',
                        tooltip: '删除',
                        hidden: true
                    }
                ],

                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false
            }],
            listeners: {
                rowclick: 'gridpanelRowClickfunc',
                rowdblclick: 'gridpanelRowClickfunc'
            }
        }
    ]
});