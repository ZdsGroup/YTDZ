/**
 * Created by LBM on 2017/12/30.
 */
Ext.define('yt.view.monpot.MonPot', {
    extend: 'Ext.Container',

    requires: [
        'Ext.layout.container.VBox',
        'yt.view.monpot.MonPotController',
        'yt.view.monpot.MonPotModel',
        'yt.view.monpot.timeline.InfoDescription',
        'yt.view.monpot.timeline.TimeLine'
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
    bodyPadding: 2,

    items: [
        /* include child components here */
        {
            xtype: 'yt-InfoDescription',
            // fit: 1
        }
    ]
});