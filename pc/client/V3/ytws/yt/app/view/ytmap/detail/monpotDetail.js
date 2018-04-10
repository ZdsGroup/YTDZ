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
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.form.Panel',
        'Ext.form.field.Display',
        'Ext.grid.Panel',
        'Ext.grid.column.Action',
        'Ext.grid.column.Date',
        'Ext.layout.container.Box',
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
                    margin: '10 10 10 10',
                    flex: 3,
                    fieldDefaults: {
                        labelStyle: 'font-weight:bold',
                        margin: '0 0 0 0',
                        labelWidth: 85
                    },
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    scrollable: 'y',
                    items: [
                        {
                            xtype: 'form',
                            reference: 'detailInfoForm',
                            /* margin: '10 10 10 10',
                             flex: 3,*/
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
                                            fieldLabel: '规模',
                                            bind: {
                                                value: '{dzdDetailInfo.scale}'
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
                                            fieldLabel: '监测员',
                                            bind: {
                                                value: '{dzdDetailInfo.username}'
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: '监测员电话',
                                            bind: {
                                                value: '{dzdDetailInfo.mobile}'
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: '村级责任人',
                                            bind: {
                                                value: '{dzdDetailInfo.personname}'
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: '村级责任人电话',
                                            labelWidth: 95,
                                            bind: {
                                                value: '{dzdDetailInfo.personmobile}'
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: '治理现状',
                                            bind: {
                                                value: '{dzdDetailInfo.govern}'
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
                                            fieldLabel: '威胁财产',
                                            bind: {
                                                value: '{dzdDetailInfo.estate} (万元)'
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
                                            fieldLabel: '地址条件',
                                            bind: {
                                                value: '{dzdDetailInfo.geology}'
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: '潜在威胁',
                                            bind: {
                                                value: '{dzdDetailInfo.harm}'
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
                                            fieldLabel: '稳定性分析',
                                            bind: {
                                                value: '{dzdDetailInfo.stability}'
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: '引发因素',
                                            bind: {
                                                value: '{dzdDetailInfo.reason}'
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: '监测方法',
                                            bind: {
                                                value: '{dzdDetailInfo.monitormethod}'
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
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: '变形特征及活动历史',
                            labelWidth: 140,
                            bind: {
                                value: '{dzdDetailInfo.history}'
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
                }
            ]
        },

        {
            xtype: 'gridpanel',
            title: '群测群防',
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
                    format: 'Y-m-d h:i:s'
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
                },
                {
                    xtype: 'actioncolumn',
                    text: '操作',

                    width: 65,
                    align: 'center',
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-eye actioncolumnMargin',
                            tooltip: '详情'
                        }
                    ],

                    hideable: false,
                    menuDisabled: true,
                    resizable: false,
                    sortable: false
                }
            ]
        }
    ]
});