/**
 * Created by lyuwei on 2018/1/30.
 */
Ext.define('yt.view.ytmap.detail.monpotAnalyticsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.monpotanalytics',

    requires: [
        'yt.view.ytmap.detail.analytics.BHGCX',
        'yt.view.ytmap.detail.analytics.DMQXT',
        'yt.view.ytmap.detail.analytics.DZDB',
        'yt.view.ytmap.detail.analytics.JSDT',
        'yt.view.ytmap.detail.analytics.PMSLT',
        'yt.view.ytmap.detail.analytics.SBDB',
        'yt.view.ytmap.detail.analytics.SDT',
        'yt.view.ytmap.detail.analytics.SDYPMSLT',
        'yt.view.ytmap.detail.analytics.WYBHT',
        'yt.view.ytmap.detail.analytics.YLZXT'
    ],

    /**
     * Called when the view is created
     */
    init: function() {

    },

    // 智能分析面板相关 controller
    boxReadyFunc: function () {
        var me = this;
        var meView = me.getView();

        // var deviceTypeCombo = meView.lookupReference('deviceTypeCombo');
        // var deviceTypeStore = deviceTypeCombo.getStore();
        // deviceTypeCombo.setSelection( deviceTypeStore.first() );

        me.switchAnalyticsTab(meView.deviceType);
    },
    deviceTypeChange: function (combo, record, eOpts) {
        // 根据设备的type切换显示指定的tab页
        this.switchAnalyticsTab(record.get('type'));
    },
    removeAllAnalyticsTab: function () {
        var me = this;
        var meView = me.getView();
        // analytics-sbdb  设备对比
        // analytics-wybht 位移变化图
        // analytics-dmqxt 断面曲线图
        // analytics-sdyjsdt 速度与加速度图
        // analytics-sdypmslt 散点与平面矢量图
        // analytics-ylzxt 雨量折线图
        // analytics-bhgcx 变化过程线
        meView.lookupReference('analyticsTabContainer').removeAll();
    },
    switchAnalyticsTab: function (deviceType) {
        var me = this;
        var meView = me.getView();

        this.removeAllAnalyticsTab();
        var thisContainer = meView.lookupReference('analyticsTabContainer');
        switch (deviceType){
            case 'wysb':
                thisContainer.add([
                    {
                        xtype: 'analyticssbdb',
                        deviceType: 'wysb',
                        quakeCode: meView.quakeId,
                        deviceCode: meView.deviceCode
                    },
                    {
                        xtype: 'analyticsdzdb',
                        deviceType: 'wysb',
                        deviceCode: meView.deviceCode
                    },
                    {
                        xtype: 'analyticswybht',
                        deviceCode: meView.deviceCode
                    },
                    {
                        xtype: 'analyticsdmqxt',
                        quakeCode: meView.quakeId
                    },
                    {
                        xtype: 'analyticssdt',
                        deviceCode: meView.deviceCode
                    },
                    {
                        xtype: 'analyticsjsdt',
                        deviceCode: meView.deviceCode
                    },
                    {
                        xtype: 'analytiscsdypmslt',
                        deviceCode: meView.deviceCode
                    },
                    {
                        xtype:'analytiscpmslt',
                        deviceCode: meView.deviceCode
                    }
                ]);
                break;
            case 'lfsb':
                thisContainer.add([
                    {
                        xtype: 'analyticssbdb',
                        deviceType: 'lfsb',
                        quakeCode: meView.quakeId,
                        deviceCode: meView.deviceCode
                    },
                    {
                        xtype: 'analyticsdzdb',
                        deviceType: 'lfsb',
                        deviceCode: meView.deviceCode
                    },
                    {
                        xtype: 'analytiscbhgcx',
                        deviceCode: meView.deviceCode
                    }
                ]);
                break;
            case 'ylsb':
                thisContainer.add([
                    {
                        xtype: 'analyticssbdb',
                        deviceType: 'ylsb',
                        quakeCode: meView.quakeId,
                        deviceCode: meView.deviceCode
                    },
                    {
                        xtype: 'analyticsdzdb',
                        deviceType: 'ylsb',
                        deviceCode: meView.deviceCode
                    },
                    {
                        xtype: 'analyticsylzxt',
                        deviceCode: meView.deviceCode
                    }
                ])
                break;
        }
        thisContainer.setActiveTab( 0 );
    }
});