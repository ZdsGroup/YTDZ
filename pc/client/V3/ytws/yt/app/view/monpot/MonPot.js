/**
 * Created by LBM on 2017/12/30.
 */
Ext.define('yt.view.monpot.MonPot', {
    extend: 'Ext.Container',

    requires: [
        'Ext.container.Container',
        'Ext.layout.container.VBox',
        'yt.view.monpot.MonPotController',
        'yt.view.monpot.MonPotModel'
    ],

    /*
    Uncomment to give this component an xtype*/
    xtype: 'yt-monpot',


    viewModel: {
        type: 'monpot'
    },

    controller: 'monpot',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    border: false,
    scrollable: 'y',
    items: [
        /* include child components here */
        /*{
            xtype: 'yt-InfoDescription',
            // fit: 1
        }*/
    ]
});