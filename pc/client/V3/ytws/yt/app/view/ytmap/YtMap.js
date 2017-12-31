/**
 * Created by LBM on 2017/12/27.
 */
Ext.define('yt.view.ytmap.YtMap', {
    extend: 'Ext.Container',

    requires: [
        'Ext.container.Container',
        'Ext.layout.container.Fit',
        'yt.view.ytmap.YtMapController',
        'yt.view.ytmap.YtMapModel'
    ],

    xtype: 'yt-map',

    viewModel: {
        type: 'map'
    },

    controller: 'map',
    layout: 'fit',
    listeners:{
        afterlayout:'afterlayout'
    },
    items: [
        {
            xtype: 'container',
            html: '<div id="mapContainerId" style="width: 100%;height: 100%;overflow: hidden;margin:0;position: relative;border: hidden;"></div>',
            margin: '0 0 0 0'
        }
    ]
});