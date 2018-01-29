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

    controller: 'detailViewController',

    config: {
        quakeId: ''
    },

    listeners: {
        boxready: 'dzdDetailBoxReady'
    },

    requires: [
        'Ext.form.Panel',
        'Ext.form.field.Display',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'yt.utils.ImageSwiper',
        'yt.view.ytmap.detail.DetailViewController',
        'yt.view.ytmap.detail.DetailViewModel'
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
                {
                    title: '设备图片',
                    xtype: 'imagecomponent',
                    src: 'http://yt.qinchenguang.com/img/1.png',
                    flex: 2,
                    margin: '10 10 10 10'
                },
                // {
                //     title: '设备图片',
                //     xtype: 'imageswiper',
                //     // src: 'http://yt.qinchenguang.com/img/1.png',
                //     userCls: 'big-30',
                //     height: 340
                // },
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
                                    fieldLabel: '灾害类型',
                                    bind: {
                                        value: '{dzdDetailInfo.dtype}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '威胁人数',
                                    bind: {
                                        value: '{dzdDetailInfo.dnum}'
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
                                    fieldLabel: '撤离路线',
                                    bind: {
                                        value: '{dzdDetailInfo.droute}'
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
                                    fieldLabel: '简介',
                                    bind: {
                                        value: '总计{dzdDetailInfo.typenum}种类型，{dzdDetailInfo.devicenum}个监测设备'
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
                                    fieldLabel: '承担单位',
                                    bind: {
                                        value: '{dzdDetailInfo.company}'
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
                                    fieldLabel: '负责人',
                                    bind: {
                                        value: '{dzdDetailInfo.username}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '监测设备',
                                    bind: {
                                        value: '{dzdDetailInfo.dmethod}'
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
            title: '维护信息',
            ui: 'map-detail-secend-panel-ui',
            iconCls: 'fa fa-wrench',
            height: '49%'
        }
    ]
});