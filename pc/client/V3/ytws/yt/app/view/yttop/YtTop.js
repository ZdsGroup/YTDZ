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
        'Ext.panel.Panel',
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
                    allowMultiple: false,
                    defaults: {
                        scale: 'medium',
                        border: false
                    },
                    items: []
                },{
                    xtype: 'button',
                    ui: 'top-menu-ui',
                    scale: 'medium',
                    border: false,
                    iconCls: 'fa fa-user-circle',
                    text: '系统管理员',
                    menu: [{
                        text: 'Menu Item 1'
                    }, {
                        text: 'Menu Item 2'
                    }, {
                        text: 'Menu Item 3'
                    }]
                }
            ]
        },
        {xtype: 'component', width: 10}
    ]
});