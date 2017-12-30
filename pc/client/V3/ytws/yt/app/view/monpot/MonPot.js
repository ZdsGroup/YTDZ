/**
 * Created by LBM on 2017/12/30.
 */
Ext.define('yt.view.monpot.MonPot', {
    extend: 'Ext.Container',

    requires: [
        'yt.view.monpot.MonPotModel',
		'yt.view.monpot.MonPotController'
    ],

    /*
    Uncomment to give this component an xtype*/
    xtype: 'yt-monpot',


    viewModel: {
        type: 'monpot'
    },

    controller: 'monpot',

    items: [
        /* include child components here */
    ]
});