/**
 * Created by LBM on 2017/12/26.
 */
Ext.define('yt.view.ytmain.YtMain', {
    extend: 'Ext.Container',

    requires: [
        'Ext.plugin.Viewport',
        'Ext.layout.container.Border',
        'yt.view.ytmain.YtFill',
        'yt.view.ytmain.YtMainController',
        'yt.view.ytmain.YtMainModel',
        'yt.view.yttop.YtTop',
        'yt.view.ytwest.YtWest',
        'yt.view.aiwarn.AiWarn',
        'yt.view.mondata.MonData',
        'yt.view.monpot.MonPot',
        'yt.view.setting.Setting'
    ],

    /*
    Uncomment to give this component an xtype*/
    xtype: 'yt-main',

    viewModel: {
        type: 'main'
    },

    controller: 'main',
    layout: 'border',
    items: [
        /* include child components here */
        {
            region: 'north',
            xtype: 'yt-top',
            height: 50
        },
        {
            region: 'center',
            id: conf.bodyContainerID,
            xtype: 'yt-fill'

        },
        {
            region: 'west',
            xtype: 'yt-west',
            titleAlign: 'center',
            collapseFirst: true,
            collapsible: false,
            collapseMode: 'mini',
            collapseToolText: '关闭',
            expandToolText: '展开',
            titleCollapse: false,
            floatable: false,
            listeners: {
                collapse: function (p, eOpts) {
                    p.collapseMode = 'none';
                }
            }
        }
    ]
});