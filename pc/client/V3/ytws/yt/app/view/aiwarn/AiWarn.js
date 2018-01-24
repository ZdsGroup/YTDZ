/**
 * Created by LBM on 2018/1/2.
 */
Ext.define('yt.view.aiwarn.AiWarn', {
    extend: 'Ext.Container',

    requires: [
        'yt.view.aiwarn.AiWarnModel',
		'yt.view.aiwarn.AiWarnController'
    ],

    /*
    Uncomment to give this component an xtype*/
    xtype: 'yt-aiwarm',

    viewModel: {
        type: 'aiwarn'
    },

    controller: 'aiwarn',

    items: [
        /* include child components here */
    ]
});