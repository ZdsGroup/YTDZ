/**
 * Created by LBM on 2017/12/30.
 */
Ext.define('yt.view.mondata.MonData', {
    extend: 'Ext.Container',

    requires: [
        'yt.view.mondata.MonDataModel',
		'yt.view.mondata.MonDataController'
    ],

    /*
    Uncomment to give this component an xtype */
    xtype: 'yt-mondata',


    viewModel: {
        type: 'mondata'
    },

    controller: 'mondata',

    items: [
        /* include child components here */
    ]
});