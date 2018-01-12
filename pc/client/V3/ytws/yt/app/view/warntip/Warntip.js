/**
 * Created by Administrator on 2018-1-5.
 */


Ext.define('yt.view.warntip.Warntip', {
    extend: 'Ext.container.Container',

    requires: [
        'Ext.container.Container',
        'yt.view.warntip.WarntipController',
        'yt.view.warntip.WarntipModel'
    ],
    xtype:'yt-warntp',

    /*
    Uncomment to give this component an xtype
    xtype: 'warntip',
    */

    viewModel: {
        type: 'warntip'
    },

    controller: 'warntip',

    items: [
        /* include child components here */
        {
            xtype: 'container',
            html: '<p id="scrollobj" style="white-space:nowrap;width:300px; font-size:0px;overflow:hidden;background-color: #FFF;opacity: 0.8" onmouseover="wt.fn.stop()" onmouseout="wt.fn.start()"><span style="padding-left: 210px;width:100%px;font-size:16px;color:#FF0000">今日预警：地灾点5个，监测设备26个</span></p>',
            margin: '0 0 0 0'
        }
    ],
    listeners: {
        afterlayout:function(){
            wt.fn.initView();
            wt.fn.start();
        }
    }
});