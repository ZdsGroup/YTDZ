/**
 * Created by lyuwei on 2018/1/9.
 */
Ext.define('yt.view.ytmap.detail.monpotDeviceDetail', {
    extend: 'Ext.panel.Panel',

    /*
    Uncomment to give this component an xtype
    xtype: 'monpotdetail',
    */
    xtype: 'monpot-devicedetail',

    requires: [
        'yt.view.ytmap.detail.DetailViewModel'
    ],

    viewModel: {
        type: 'detailViewModel'
    },

    controller: 'monpotdetail',

    requires: [
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.form.Panel',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Display',
        'Ext.grid.Panel',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'yt.plugin.ImageSwiper',
        'yt.plugin.date.DateTimeField',
        'yt.utils.CustomPageToolBar',
        'yt.view.ytmap.detail.DetailViewModel',
        'yt.view.ytmap.detail.monpotDetailController'
    ],

    config: {
        deviceId: ''
    },

    listeners: {
        boxready: 'deviceDetailBoxReady'
    },

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [
        /* include child components here */
        {
            xtype: 'panel',
            ui: 'map-detail-secend-panel-ui',
            height: '50%',

            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            },

            items: [
                // {
                //     title: '设备图片',
                //     xtype: 'imagecomponent',
                //     src: 'http://yt.qinchenguang.com/img/1.png',
                //     flex: 2,
                //     margin: '10 10 10 10'
                // },
                {
                    title: '设备图片',
                    xtype: 'imageswiper',
                    reference: 'imgswiper',
                    flex: 2,
                    margin: '10 10 10 10'
                },
                {
                    xtype: 'form',
                    reference: 'detailInfoForm',
                    margin: '10 10 10 10',
                    flex: 3,
                    fieldDefaults: {
                        labelStyle: 'font-weight:bold',
                        margin: '0 0 0 0',
                        labelWidth: 85
                    },
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'left'
                    },

                    items: [
                        {
                            xtype: 'form',
                            flex: 1,
                            layout: {
                                type: 'vbox',
                                pack: 'start',
                                align: 'left'
                            },
                            items: [{
                                xtype: 'displayfield',
                                fieldLabel: '设备名称',
                                bind: {
                                    value: '{deviceDetailInfo.name}'
                                }
                            }, {
                                xtype: 'displayfield',
                                fieldLabel: '负责人',
                                bind: {
                                    value: '{deviceDetailInfo.username}'
                                }
                            }, {
                                xtype: 'displayfield',
                                fieldLabel: '联系电话',
                                bind: {
                                    value: '{deviceDetailInfo.mobile}'
                                }
                            }, {
                                xtype: 'displayfield',
                                fieldLabel: '安装地点',
                                bind: {
                                    value: '{deviceDetailInfo.address}'
                                }
                            }, {
                                xtype: 'displayfield',
                                fieldLabel: '安装时间',
                                bind: {
                                    value: '{deviceDetailInfo.addtime}'
                                }
                            }, {
                                xtype: 'displayfield',
                                fieldLabel: '维护周期',
                                bind: {
                                    value: '{deviceDetailInfo.rate}'
                                }
                            }, {
                                xtype: 'displayfield',
                                fieldLabel: '上次维护',
                                bind: {
                                    value: '{deviceDetailInfo.modtime}'
                                }
                            }]
                        },
                        {
                            xtype: 'form',
                            flex: 1,
                            layout: {
                                type: 'vbox',
                                pack: 'start',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '运行状态',
                                    bind: {
                                        value: '{deviceDetailInfo.runstatus}'
                                    }
                                }, {
                                    xtype: 'displayfield',
                                    fieldLabel: '连接状态',
                                    bind: {
                                        value: '{deviceDetailInfo.connectstatus}'
                                    }
                                }, {
                                    xtype: 'displayfield',
                                    fieldLabel: '电池状态',
                                    bind: {
                                        value: '{deviceDetailInfo.batterystatus}'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },

        {
            xtype: 'panel',
            title: '设备状态',
            ui: 'map-detail-secend-panel-ui',
            iconCls: 'fa fa-wrench',
            height: '49%',
            reference: 'deviceStatusPanel',
            layout: {
                type: 'vbox',
                pack: 'start',
                align: 'stretch'
            },

            items: [
                {
                    xtype: 'form',

                    reference: 'deviceStatusFormRef',
                    margin: '10 10 0 10',
                    defaultType: 'textfield',
                    fieldDefaults: {
                        msgTarget: 'side',
                        labelWidth: 60
                    },
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },

                    defaultButton: 'queryDeviceStatusRef',
                    items: [
                        {
                            xtype: 'combobox',
                            flex: 1,
                            reference: 'queryTypeRef',
                            margin: '0 0 0 10',
                            allowBlank: true,
                            fieldLabel: '设备状态',
                            store: {
                                data: [
                                    {name: '全部', type: 'all'},
                                    {name: '异常', type: 'yc'},
                                    {name: '正常', type: 'zc'}
                                ]
                            },
                            valueField: 'type',
                            displayField: 'name',
                            editable: false,
                            typeAhead: false,
                            queryMode: 'local',
                            emptyText: '全部'
                        },
                        {
                            xtype: 'datetimefield',
                            format: 'Y-m-d H:i:s',
                            fieldLabel: '起始时间',
                            reference: 'startTime',
                            flex: 1,
                            margin: '0 0 0 8',
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
                                    reference: 'queryDeviceStatusRef',
                                    disabled: false,
                                    formBind: false,
                                    // handler: 'queryButtonClick'
                                }
                            ]
                        }
                    ]
                },

                {
                    xtype: 'gridpanel',
                    margin: '10 10 10 10',
                    flex: 1,
                    border: true,
                    columnLines: true,
                    reserveScrollbar: true,
                    multiSelect: false,
                    scrollable: 'y',
                    viewConfig: {
                        stripeRows: false
                    },
                    columns: [
                        {
                            text: '连接状态',
                            flex: 1,
                            dataIndex: 'connectstatus',
                            hideable: false,
                            menuDisabled: true,
                            resizable: false,
                            sortable: false,
                            align: 'center'
                        },
                        {
                            text: '电池状态',
                            flex: 1,
                            dataIndex: 'batterystatus',
                            hideable: false,
                            menuDisabled: true,
                            resizable: false,
                            sortable: false,
                            align: 'center'
                        },
                        {
                            text: '运行状态',
                            flex: 1,
                            dataIndex: 'runstatus',
                            hideable: false,
                            menuDisabled: true,
                            resizable: false,
                            sortable: false,
                            align: 'center'
                        },
                        {
                            text: '通讯异常原因',
                            flex: 3,
                            dataIndex: '',
                            hideable: false,
                            menuDisabled: true,
                            resizable: false,
                            sortable: false,
                            align: 'center'
                        },
                        {
                            text: '通讯时间',
                            flex: 2,
                            dataIndex: 'time',
                            hideable: false,
                            menuDisabled: true,
                            resizable: false,
                            sortable: false,
                            align: 'center'
                        }
                    ],
                    leadingBufferZone: 8,
                    trailingBufferZone: 8,
                    bbar: [
                        {
                            xtype: 'Custompagetoolbar',
                            displayInfo: false,
                            bind: '{gridPageStore}',
                            listeners: {
                                // beforechange: 'pagebuttonChange'
                            }
                        }
                    ]
                }
            ]
        }
    ]
});