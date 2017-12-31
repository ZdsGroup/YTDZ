/**
 * Created by LBM on 2017/8/3.
 * 仅作为容器填充媒介,用于初始化窗口完全填充。
 */
Ext.define('yt.view.ytmain.YtFill', {
    extend: 'Ext.Container',

    xtype: 'yt-fill',

    requires: [
        'Ext.layout.container.Fit'
    ],

    layout: 'fit',

    items: [
        /* include child components here */
    ]
});