/**
 * Created by lyuwei on 2018/1/17.
 */
Ext.define('yt.view.ytmap.detail.DetailViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.detailViewController',

    requires: [
        'Ext.util.Format',
        'yt.view.ytmap.detail.analytics.AnalyticsDMQXT',
        'yt.view.ytmap.detail.analytics.AnalyticsSBDB',
        'yt.view.ytmap.detail.analytics.AnalyticsSDYJSDT',
        'yt.view.ytmap.detail.analytics.AnalyticsWYBHT',
        'yt.view.ytmap.detail.analytics.AnalyticsYLZXT',
        'yt.view.ytmap.detail.analytics.AnalytiscBHGCX',
        'yt.view.ytmap.detail.analytics.AnalytiscSDYPMSLT'
    ],

    /**
     * Called when the view is created
     */
    init: function() {

    },

    // 详细面板相关 controller
    rendererDeviceStatus: function (value, metaData) {
        if(value !== 0){
            metaData.tdAttr = 'bgcolor="red"';
        }
        return value === 0 ? '正常' : '异常';
    },

    // 智能分析面板相关 controller
    deviceTypeChange: function (combo, record, eOpts) {
        // 根据设备的type切换显示指定的tab页
        this.switchAnalyticsTab(record.get('type'));
    },

    removeAllAnalyticsTab: function () {
        // analytics-sbdb  设备对比
        // analytics-wybht 位移变化图
        // analytics-dmqxt 断面曲线图
        // analytics-sdyjsdt 速度与加速度图
        // analytics-sdypmslt 散点与平面矢量图
        // analytics-ylzxt 雨量折线图
        // analytics-bhgcx 变化过程线
        Ext.getCmp('analyticsTabContainer').removeAll();
    },
    switchAnalyticsTab: function (deviceType) {
        this.removeAllAnalyticsTab();
        var thisContainer = Ext.getCmp('analyticsTabContainer');
        switch (deviceType){
            case 'wysb':
                thisContainer.add([
                    { xtype: 'analyticssbdb' },
                    { xtype: 'analyticswybht' },
                    { xtype: 'analyticsdmqxt' },
                    { xtype: 'analyticssdyjsdt' },
                    { xtype: 'analytiscsdypmslt' }
                ]);
                break;
            case 'lfsb':
                thisContainer.add([
                    { xtype: 'analyticssbdb' },
                    { xtype: 'analytiscbhgcx' }
                ]);
                break;
            case 'ylsb':
                thisContainer.add([
                    { xtype: 'analyticssbdb' },
                    { xtype: 'analyticsylzxt' }
                ])
                break;
        }
        thisContainer.setActiveTab( 0 );
    }


    // 预警信息面板相关 controller
});