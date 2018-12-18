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
                    id: 'userInfoButtonId',
                    ui: 'top-menu-ui',
                    scale: 'medium',
                    border: false,
                    iconCls: 'fa fa-user-circle',
                    text: '游客',
                    menu: [
                        {
                            xtype: 'menu',
                            ui: 'top-sub-menu-ui',
                            border: false,
                            plain: false,
                            frame: false,
                            floating: false,
                            shadow: false,
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    //todo 2018-12-15--用户收藏功能待完成
                                    text: '我的收藏',
                                    iconCls: 'fa fa-star sub-menu-style',
                                    handler: 'showUserFavosList'
                                }, '-', {
                                    text: '注销',
                                    iconCls: 'fa fa-power-off sub-menu-style',
                                    handler: 'loginOutHandler'
                                }]
                        }
                    ]
                }
            ]
        },
        {xtype: 'component', width: 10}
    ]
});