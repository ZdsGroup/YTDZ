/**
 * Created by lyuwei on 2018/1/29.
 */
Ext.define('yt.view.ytmap.detail.monpotDeviceList', {
    extend: 'Ext.Container',

    /*
    Uncomment to give this component an xtype
    xtype: 'monpotdevicelist',
    */
    xtype: 'monpot-devicelist',

    requires: [
        'Ext.button.Button',
        'Ext.form.field.ComboBox',
        'Ext.grid.Panel',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'yt.utils.CustomPageToolBar',
        'yt.view.ytmap.detail.DetailViewController',
        'yt.view.ytmap.detail.DetailViewModel'
    ],

    controller: 'detailViewController',

    viewModel: {
        type: 'detailViewModel'
    },

    config: {
        quakeId: '',
        deviceType: ''
    },

    margin: '5 10 5 10',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    listeners: {
        boxready: 'monpotdevicelistBoxReady',
    },

    items: [
        /* include child components here */
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
                    xtype: 'combobox',
                    width: 300,
                    reference: 'deviceTypeRef',
                    margin: '0 0 0 10',
                    allowBlank: true,
                    fieldLabel: '设备类型',
                    labelWidth: 60,
                    store:{
                        data: [
                            {name: '全部类型', type: 'alljc'},
                            {name: '裂缝设备', type: 'lfjc'},
                            {name: '位移设备', type: 'wyjc'},
                            {name: '雨量设备', type: 'yljc'}
                        ]
                    },
                    valueField: 'type',
                    displayField: 'name',
                    editable: false,
                    typeAhead: false,
                    queryMode: 'local',
                    emptyText: '请选择类型，默认全部设备',

                    listeners: {
                        // select: 'showDeviceList'
                    }
                },
                {
                    xtype: 'component',
                    width: 5
                },
                {
                    xtype: 'button',
                    handler: 'monpotdevicelistBtnClick',
                    text: '搜索'
                }
            ]
        },
        {
            xtype: 'gridpanel',
            reference: 'DeviceListGridPanel',
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
                    dataIndex: 'name',
                    text: '设备名称',
                    flex: 1,

                    hideable: false,
                    menuDisabled: true,
                    resizable: false,
                    sortable: false,
                    align: 'center'
                }, {
                    dataIndex: 'username',
                    text: '负责人',
                    flex: 1,

                    hideable: false,
                    menuDisabled: true,
                    resizable: false,
                    sortable: false,
                    align: 'center'
                }, {
                    dataIndex: 'mobile',
                    text: '联系电话',
                    flex: 1,

                    hideable: false,
                    menuDisabled: true,
                    resizable: false,
                    sortable: false,
                    align: 'center'
                }, {
                    dataIndex: 'company',
                    text: '公司',
                    flex: 1,

                    hideable: false,
                    menuDisabled: true,
                    resizable: false,
                    sortable: false,
                    align: 'center'
                }, {
                    dataIndex: 'company',
                    text: '地址',
                    flex: 3,

                    hideable: false,
                    menuDisabled: true,
                    resizable: false,
                    sortable: false,
                    align: 'center'
                },{
                    dataIndex: 'description',
                    text: '描述',
                    flex: 3,

                    hideable: false,
                    menuDisabled: true,
                    resizable: false,
                    sortable: false,
                    align: 'center'
                }],
            bbar: {
                xtype: 'Custompagetoolbar',
                displayInfo: false,
                bind: '{gridPageStore}',
                listeners: {
                    beforechange: 'monpotdevicelistPagebuttonChange'
                }
            }
        }
    ]
});