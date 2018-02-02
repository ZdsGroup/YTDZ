/**
 * Created by lyuwei on 2018/1/9.
 */
Ext.define('yt.view.ytmap.detail.monpotDetail', {
    extend: 'Ext.Container',

    /*
    Uncomment to give this component an xtype
    xtype: 'monpotdetail',
    */
    xtype: 'monpot-detail',

    requires: [
        'yt.view.ytmap.detail.DetailViewModel'
    ],

    viewModel: {
        type: 'detailViewModel'
    },

    controller: 'monpotdetail',

    config: {
        quakeId: ''
    },

    listeners: {
        boxready: 'dzdDetailBoxReady'
    },

    requires: [
        'Ext.container.Container',
        'Ext.form.Panel',
        'Ext.form.field.Display',
        'Ext.grid.Panel',
        'Ext.grid.column.Date',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'yt.plugin.ImageSwiper',
        'yt.view.ytmap.detail.DetailViewModel',
        'yt.view.ytmap.detail.monpotDetailController'
    ],

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
            // bodyPadding: '0 10 0 10',

            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            },

            items: [
                /*{
                    title: '设备图片',
                    xtype: 'imagecomponent',
                    src: 'http://yt.qinchenguang.com/img/1.png',
                    flex: 2,
                    margin: '10 10 10 10'
                },*/
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
                    // scrollable: 'y',

                    items: [
                        {
                            xtype: 'form',
                            flex: 1,
                            layout: {
                                type: 'vbox',
                                pack: 'start',
                                align: 'left'
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '地灾点',
                                    bind: {
                                        value: '{dzdDetailInfo.name}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '承担单位',
                                    bind: {
                                        value: '{dzdDetailInfo.company}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '负责人',
                                    bind: {
                                        value: '{dzdDetailInfo.username}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '联系电话',
                                    bind: {
                                        value: '{dzdDetailInfo.mobile}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '险情等级',
                                    bind: {
                                        value: '{dzdDetailInfo.dlevel}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '威胁人数',
                                    bind: {
                                        value: '{dzdDetailInfo.dnum} (人)'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '简介',
                                    bind: {
                                        value: '{dzdDetailInfo.description}'
                                    }
                                }
                            ]
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
                                    fieldLabel: '灾害类型',
                                    bind: {
                                        value: '{dzdDetailInfo.dtype}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '报警方式',
                                    bind: {
                                        value: '{dzdDetailInfo.dmethod}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '防治措施',
                                    bind: {
                                        value: '{dzdDetailInfo.davoid}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '避灾地点',
                                    bind: {
                                        value: '{dzdDetailInfo.daddress}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '撤离路线',
                                    bind: {
                                        value: '{dzdDetailInfo.droute}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '监测设备',
                                    bind: {
                                        value: '总计 {dzdDetailInfo.typenum} 种类型，{dzdDetailInfo.devicenum} 个监测设备'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },

        // {
        //     xtype: 'form',
        //     title: '累计评论',
        //     ui: 'map-detail-secend-panel-ui',
        //     iconCls: 'fa fa-wrench',
        //     height: '49%',
        //     bodyPadding: '5 5 5 5',
        //     layout: {
        //         type: 'vbox',
        //         pack: 'start',
        //         align: 'start'
        //     },
        //     fieldDefaults: {
        //         labelStyle: 'font-weight:bold;font-size: 16px;',
        //         margin: '0 0 0 0',
        //         labelWidth: 65
        //     },
        //     scrollable: 'y',
        //     items: [
        //         {
        //             xtype: 'form',
        //             layout: {
        //                 type: 'hbox',
        //                 pack: 'start',
        //                 align: 'stretch'
        //             },
        //             items: [
        //                 {
        //                     xtype: 'displayfield',
        //                     value: '2017-12-20 18:00:00',
        //                     width: 120,
        //                     hideLabel: true,
        //                     margin: '0 20 0 5'
        //                 },
        //                 {
        //                     xtype: 'displayfield',
        //                     fieldLabel: '用户1',
        //                     margin: '0 0 0 5',
        //                     value: '该地灾点设备安装牢固，监测数据准确，不错！'
        //                 }
        //             ]
        //         },
        //         {
        //             xtype: 'form',
        //             layout: {
        //                 type: 'hbox',
        //                 pack: 'start',
        //                 align: 'stretch'
        //             },
        //             items: [
        //                 {
        //                     xtype: 'displayfield',
        //                     value: '2017-12-20 20:00:00',
        //                     width: 120,
        //                     hideLabel: true,
        //                     margin: '0 20 0 5'
        //                 },
        //                 {
        //                     xtype: 'displayfield',
        //                     fieldLabel: '用户2',
        //                     margin: '0 0 0 5',
        //                     value: '该地灾点设备被破坏，请尽快安排人员维修！'
        //                 }
        //             ]
        //         },
        //         {
        //             xtype: 'form',
        //             layout: {
        //                 type: 'hbox',
        //                 pack: 'start',
        //                 align: 'stretch'
        //             },
        //             items: [
        //                 {
        //                     xtype: 'displayfield',
        //                     value: '2017-12-21 14:12:00',
        //                     width: 120,
        //                     hideLabel: true,
        //                     margin: '0 20 0 5'
        //                 },
        //                 {
        //                     xtype: 'displayfield',
        //                     fieldLabel: '用户3',
        //                     margin: '0 0 0 5',
        //                     value: '有了这种地灾监测设备，可以实时报警，很好！'
        //                 }
        //             ]
        //         },
        //         {
        //             xtype: 'form',
        //             layout: {
        //                 type: 'hbox',
        //                 pack: 'start',
        //                 align: 'stretch'
        //             },
        //             items: [
        //                 {
        //                     xtype: 'displayfield',
        //                     value: '2017-12-25 18:00:00',
        //                     width: 120,
        //                     hideLabel: true,
        //                     margin: '0 20 0 5'
        //                 },
        //                 {
        //                     xtype: 'displayfield',
        //                     fieldLabel: '用户4',
        //                     margin: '0 0 0 5',
        //                     value: '该地灾点设备安装牢固，监测数据准确，不错！'
        //                 }
        //             ]
        //         }
        //     ]
        // },

        {
            xtype: 'gridpanel',
            title: '累计评论',
            ui: 'map-detail-secend-panel-ui',
            iconCls: 'fa fa-comment',
            height: '49%',

            reserveScrollbar: true,
            useArrows: true,
            rootVisible: false,
            multiSelect: true,
            singleExpand: true,
            columnLines: true,
            scrollable: 'y',
            viewConfig: {
                stripeRows: false
            },

            store: {
                data: [
                    {
                        "userName": '用户1',
                        "content": "该地灾点设备安装牢固，监测数据准确，很不错！！",
                        "createtime": "2017-12-19 18:50:21",
                        "readNum": "120",
                        "repeat": "已回复"
                    },
                    {
                        "userName": '用户2',
                        "content": "该地灾点设备被破坏，请尽快安排人员维修！",
                        "createtime": "2017-12-20 07:50:21",
                        "readNum": "70",
                        "repeat": "正在处理"
                    },
                    {
                        "userName": '用户3',
                        "content": "有了这种地灾监测设备，可以实时报警，很好！",
                        "createtime": "2017-12-21 16:50:21",
                        "readNum": "180",
                        "repeat": "已回复"
                    },
                    {
                        "userName": '用户4',
                        "content": "该地灾点设备安装牢固，监测数据准确，很不错！！",
                        "createtime": "2017-12-21 18:50:21",
                        "readNum": "100",
                        "repeat": "已回复"
                    },
                    {
                        "userName": '用户5',
                        "content": "巡查时发现设备太脏了，安排人员过来清理。",
                        "createtime": "2017-12-30 18:47:21",
                        "readNum": "120",
                        "repeat": "未处理"
                    }
                ]
            },
            columns: [
                {
                    text: '内容',
                    dataIndex: 'content',

                    flex: 1,
                    align: 'left',
                    hideable: false,
                    menuDisabled: true,
                    resizable: false,
                    sortable: false
                },
                {
                    text: '用户名',
                    dataIndex: 'userName',

                    width: 180,
                    align: 'center',
                    hideable: false,
                    menuDisabled: true,
                    resizable: false,
                    sortable: false
                },
                {
                    text: '评论时间',
                    dataIndex: 'createtime',

                    width: 180,
                    align: 'center',
                    hideable: false,
                    menuDisabled: true,
                    resizable: false,
                    sortable: false,

                    xtype: 'datecolumn',
                    format:'Y-m-d h:i:s'
                },
                {
                    text: '阅读量',
                    dataIndex: 'readNum',

                    width: 70,
                    align: 'center',
                    hideable: false,
                    menuDisabled: true,
                    resizable: false,
                    sortable: false
                },
                {
                    text: '状态',
                    dataIndex: 'repeat',

                    width: 90,
                    align: 'center',
                    hideable: false,
                    menuDisabled: true,
                    resizable: false,
                    sortable: false
                }
            ]
        }
    ]
});