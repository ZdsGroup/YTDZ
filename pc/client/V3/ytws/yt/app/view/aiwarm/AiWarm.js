/**
 * Created by LBM on 2017/12/30.
 */
Ext.define('yt.view.aiwarm.AiWarm', {
    extend: 'Ext.Container',

    requires: [
        'yt.view.aiwarm.AiWarmModel',
		'yt.view.aiwarm.AiWarmController'
    ],

    /*
    Uncomment to give this component an xtype*/
    xtype: 'yt-aiwarm',


    viewModel: {
        type: 'aiwarm'
    },

    controller: 'aiwarm',

    items: [
        /* include child components here */
    ]
});