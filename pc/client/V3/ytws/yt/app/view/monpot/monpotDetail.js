/**
 * Created by lyuwei on 2018/1/9.
 */
Ext.define('yt.view.monpot.monpotDetail', {
    extend: 'Ext.Container',

    /*
    Uncomment to give this component an xtype
    xtype: 'monpotdetail',
    */
    xtype: 'monpot-detail',

    cls: 'monpot-detail',

    requires: [
        'Ext.panel.Panel',
        'Ext.ux.layout.ResponsiveColumn'
    ],

    layout: 'responsivecolumn',

    items: [
        /* include child components here */
        {
            xtype: 'imagecomponent',
            src: 'http://yt.qinchenguang.com/img/1.png',
            userCls: 'big-50'
        },

        {
            xtype: 'panel',
            title: '设备运行情况',
            userCls: 'big-50'
        },

        {
            xtype: 'panel',
            title: '维护信息',
            userCls: 'big-100'
        }
    ]
});