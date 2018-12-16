/**
 * Created by winnerlbm on 2018/12/15.
 */
Ext.define('yt.view.startup.StartUp', {
    extend: 'Ext.Container',

    requires: [
        'Ext.plugin.Viewport',
        'yt.view.login.Login',
        'yt.view.startup.StartUpController',
        'yt.view.startup.StartUpModel'
    ],

    /*
    Uncomment to give this component an xtype*/
    xtype: 'startup',


    viewModel: {
        type: 'startup'
    },

    controller: 'startup',
    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },
    items: [
        /* include child components here */
        {
            xtype: 'login',
            id: 'loginContainerId',
            flex: 1
        },
        {
            xtype: 'container',
            id: 'appMainContainerId',
            flex: 1,
            hidden: true,
            layout: {
                type: 'vbox',
                pack: 'start',
                align: 'stretch'
            }
        }
    ]
});