/**
 * Created by LBM on 2017/12/30.
 */
Ext.define('yt.view.setting.Setting', {
    extend: 'Ext.Container',

    requires: [
        'Ext.layout.container.Fit',
        'Ext.ux.IFrame',
        'yt.view.setting.SettingController',
        'yt.view.setting.SettingModel'
    ],

    /*
    Uncomment to give this component an xtype*/
    xtype: 'yt-setting',


    viewModel: {
        type: 'setting'
    },

    controller: 'setting',
    layout: 'fit',
    items: [
        {
            xtype: 'uxiframe',
            id: 'appiFrame',
            loadMask: false
        }
    ]
});