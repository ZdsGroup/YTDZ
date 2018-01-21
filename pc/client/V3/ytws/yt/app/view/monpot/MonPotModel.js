/**
 * Created by LBM on 2017/12/30.
 */
Ext.define('yt.view.monpot.MonPotModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.monpot',

    requires: [
        'Ext.data.TreeStore'
    ],

    stores: {
        /*
        A declaration of Ext.data.Store configurations that are first processed as binds to produce an effective
        store configuration. For example:

        users: {
            model: 'MonPot',
            autoLoad: true
        }
        */
    },

    data: {
        /* This object holds the arbitrary data that populates the ViewModel and is then available for binding. */
        disasterpointDetailData: {}
    }
});