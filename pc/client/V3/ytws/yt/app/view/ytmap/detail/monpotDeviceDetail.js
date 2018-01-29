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

    controller: 'detailViewController',

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
            title: '维护信息',
            ui: 'map-detail-secend-panel-ui',
            iconCls: 'fa fa-wrench',
            height: '49%'
        }
    ]
});