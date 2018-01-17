/**
 * Created by lyuwei on 2018/1/17.
 */
Ext.define('yt.view.ytmap.detail.analytics.AnalytiscSDYPMSLT', {
    extend: 'Ext.panel.Panel',

    title: '散点与平面矢量图',
    /*
    Uncomment to give this component an xtype
    xtype: 'analytiscsdypmslt',
    */
    xtype: 'analytiscsdypmslt',

    requires: [
        'Ext.chart.series.Scatter',
        'Ext.layout.container.Fit',
        'yt.view.ytmap.detail.analytics.EchartsBasePanel'
    ],

    layout: 'fit',

    items: [
        /* include child components here */
        {
            xtype: 'echartsbasepanel'
        }
    ]
});