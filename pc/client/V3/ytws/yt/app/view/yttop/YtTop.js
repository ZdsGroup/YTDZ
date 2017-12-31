/**
 * Created by LBM on 2017/12/27.
 */
Ext.define('yt.view.yttop.YtTop', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.button.Button',
        'Ext.button.Segmented',
        'Ext.form.Label',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.menu.Menu',
        'Ext.panel.Panel',
        'Ext.toolbar.Separator',
        'yt.view.yttop.YtTopController',
        'yt.view.yttop.YtTopModel'
    ],

    /*
    Uncomment to give this component an xtype*/
    xtype: 'yt-top',

    viewModel: {
        type: 'top'
    },

    controller: 'top',
    ui: 'banner-panel-bgcolor',
    height: 50,
    layout: {
        type: 'hbox',
        pack: 'start',
        align: 'center'
    },
    defaults: {
        border: false
    },
    items: [
        /* include child components here */
        {xtype: 'component', width: 10},
        {
            xtype: 'image',
            alt: "",
            width: 42,
            height: 42,
            cls: 'sys-logo'
        },
        {
            xtype: 'label',
            html: conf.title,
            cls: 'sys-title'
        },
        {
            flex: 1
        },
        {
            xtype: 'panel',
            // flex: 1,
            ui: 'banner-panel-bgcolor',
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'segmentedbutton',
                    reference: 'sysMenuRef',
                    allowMultiple: false,
                    defaults: {
                        scale: 'medium',
                        border: false
                    },
                    items: []
                }, {
                    xtype: 'button',
                    ui: 'top-menu-ui',
                    scale: 'medium',
                    border: false,
                    iconCls: 'fa fa-user-circle',
                    text: '系统管理员',
                    menu: [
                        {
                            xtype: 'menu',
                            ui: 'top-sub-menu-ui',
                            border: false,
                            plain: true,
                            floating: false,
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            items: [{
                                text: '用户中心',
                                iconCls: 'fa fa-user fa-x'
                            }, {
                                text: '我的收藏',
                                iconCls: 'fa fa-star fa-x'
                            }, '-', {
                                text: '注销',
                                iconCls: 'fa fa-power-off fa-x'
                            }]
                        }
                    ]
                }
            ]
        },
        {xtype: 'component', width: 10}
    ]
});