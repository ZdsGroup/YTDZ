/**
 * Created by LBM on 2017/12/30.
 */
Ext.define('yt.view.setting.Setting', {
    extend: 'Ext.Container',

    requires: [
        'yt.view.setting.SettingModel',
        'yt.view.setting.SettingController'
    ],

    /*
    Uncomment to give this component an xtype*/
    xtype: 'yt-setting',


    viewModel: {
        type: 'setting'
    },

    controller: 'setting',

    items: []
});