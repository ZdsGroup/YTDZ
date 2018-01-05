/**
 * Created by lyuwei on 2018/1/3.
 */
Ext.define('yt.view.monpot.timeline.InfoDescription', {
    extend: 'Ext.panel.Panel',

    /*
    Uncomment to give this component an xtype
    xtype: 'infodescription',
    */
    xtype: 'yt-InfoDescription',

    requires: [
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.toolbar.Separator',
        'Ext.toolbar.Toolbar',
        'yt.view.monpot.timeline.TimeLine',
        'yt.view.monpot.timeline.TimeLineController',
        'yt.view.monpot.timeline.TimeLineModel'
    ],

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    border: false,
    scrollable: 'y',
    bodyPadding: 2,

    viewModel: {
        type: 'timeline'
    },

    controller: 'timeline',

    cls: 'timline-infoDescription',

    items: [

        {
            xtype: 'panel',
            bodyPadding: '10 20 10 20',
            ui: 'light',
            cls: 'shadow base-container',
            title: '基本信息',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'container',
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    padding:'0 0 0 0',
                    items: [
                        {
                            xtype: 'component',
                            // flex: 1,
                            html: '名称'
                        },
                        {
                            xtype: 'component',
                            flex: 1,
                            cls: 'right-value',
                            bind: {
                                html: '{quakeInfo.name}'
                            }
                        }
                    ]
                },
                {
                    xtype: 'container',
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    padding:'0 0 0 0',
                    items: [
                        {
                            xtype: 'component',
                            // flex: 1,
                            html: '地址'
                        },
                        {
                            xtype: 'component',
                            flex: 1,
                            cls: 'right-value',
                            bind: {
                                html: '{quakeInfo.address}'
                            }
                        }
                    ]
                },
                {
                    xtype: 'container',
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    padding:'0 0 0 0',
                    items: [
                        {
                            xtype: 'component',
                            // flex: 1,
                            html: '类型'
                        },
                        {
                            xtype: 'component',
                            flex: 1,
                            cls: 'right-value',
                            bind: {
                                html: '{quakeInfo.dtype}'
                            }
                        }
                    ]
                },
                {
                    xtype: 'container',
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    padding:'0 0 0 0',
                    items: [
                        {
                            xtype: 'component',
                            // flex: 1,
                            html: '等级'
                        },
                        {
                            xtype: 'component',
                            flex: 1,
                            cls: 'right-value',
                            bind: {
                                html: '{quakeInfo.rank}'
                            }
                        }
                    ]
                },
                {
                    xtype: 'container',
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    padding:'0 0 0 0',
                    items: [
                        {
                            xtype: 'component',
                            // flex: 1,
                            html: '设备'
                        },
                        {
                            xtype: 'component',
                            flex: 1,
                            cls: 'right-value',
                            bind: {
                                html: '{quakeInfo.devicenum}'
                            }
                        }
                    ]
                }
            ]
        },

        {
            xtype: 'panel',
            ui: 'light',
            cls: 'shadow base-container',
            title: '告警统计',
            flexed: 1,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'toolbar',
                    layout: {
                        type: 'hbox',
                        pack : 'center',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'button',
                            ui: 'warmButton',
                            cls: 'icon-padding red',
                            text: '5',
                            listeners: {
                                click: 'warmButtonCountClick'
                            }
                        },
                        {
                            xtype: 'component',
                            cls: 'warmInfo-value',
                            html: '很高'
                        },

                        '-',

                        {
                            xtype: 'button',
                            ui: 'warmButton',
                            cls: 'icon-padding orange',
                            text: '7',
                            listeners: {
                                click: 'warmButtonCountClick'
                            }
                        },
                        {
                            xtype: 'component',
                            cls: 'warmInfo-value',
                            html: '高'
                        },

                        '-',

                        {
                            xtype: 'button',
                            ui: 'warmButton',
                            cls: 'icon-padding yellow',
                            text: '1',
                            listeners: {
                                click: 'warmButtonCountClick'
                            }
                        },
                        {
                            xtype: 'component',
                            cls: 'warmInfo-value',
                            html: '较高'
                        },

                        '-',

                        {
                            xtype: 'button',
                            ui: 'warmButton',
                            cls: 'icon-padding blue',
                            text: '1',
                            listeners: {
                                click: 'warmButtonCountClick'
                            }
                        },
                        {
                            xtype: 'component',
                            cls: 'warmInfo-value',
                            html: '一般'
                        }
                    ]
                },

                {
                    xtype: 'timeline',
                    flexed: 1
                }
            ]
        }

    ]
});