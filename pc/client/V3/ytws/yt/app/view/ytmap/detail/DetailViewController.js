/**
 * Created by lyuwei on 2018/1/17.
 */
Ext.define('yt.view.ytmap.detail.DetailViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.detailViewController',

    requires: [
        'Ext.data.Store',
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

    // 详细面板相关 controller
    deviceDetailBoxReady: function () {
        var me = this;
        var meView = me.getView();

        if(meView.deviceId === '')
            return;

        var action = 'devices/' + meView.deviceId;
        var mask = ajax.fn.showMask( meView.lookupReference('detailInfoForm'), '数据加载中...');

        function successCallBack(response, opts) {
            ajax.fn.hideMask(mask);
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
            if(!result['data']) return;

            result['data']['runstatus'] = me.rendererDeviceStatus(result['data']['runstatus']);
            result['data']['connectstatus'] = me.rendererDeviceStatus(result['data']['connectstatus'])
            result['data']['batterystatus'] = me.rendererDeviceStatus(result['data']['batterystatus'])

            meView.getViewModel().set('deviceDetailInfo',result['data']);
        }
        function failureCallBack(response, opts) {
            ajax.fn.hideMask(mask);
        }
        ajax.fn.executeV2({}, 'GET', conf.serviceUrl + action, successCallBack, failureCallBack);

    },
    dzdDetailBoxReady: function () {
        var me = this;
        var meView = me.getView();

        if(meView.quakeId === '')
            return;

        var action = 'quakes/' + meView.quakeId;
        var mask = ajax.fn.showMask( meView.lookupReference('detailInfoForm'), '数据加载中...');

        function successCallBack(response, opts) {
            ajax.fn.hideMask(mask);
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
            if(!result['data']) return;

            meView.getViewModel().set('dzdDetailInfo',result['data']);
        }
        function failureCallBack(response, opts) {
            ajax.fn.hideMask(mask);
        }
        ajax.fn.executeV2({}, 'GET', conf.serviceUrl + action, successCallBack, failureCallBack);

    },
    rendererDeviceStatus: function (value, metaData) {
        // if(value !== 0){
        //     metaData.tdAttr = 'bgcolor="red"';
        // }
        return value === 0 ? '异常' : '正常';
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
        var me = this;
        var meView = me.getView();

        this.removeAllAnalyticsTab();
        var thisContainer = Ext.getCmp('analyticsTabContainer');
        switch (deviceType){
            case 'wysb':
                thisContainer.add([
                    {
                        xtype: 'analyticssbdb',
                        deivceType: 'wysb',
                        quakeCode: meView.quakeId
                    },
                    {
                        xtype: 'analyticsdzdb',
                        deivceType: 'wysb',
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
                        deivceType: 'lfsb',
                        quakeCode: meView.quakeId
                    },
                    {
                        xtype: 'analyticsdzdb',
                        deivceType: 'lfsb',
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
                        deivceType: 'ylsb',
                        quakeCode: meView.quakeId
                    },
                    {
                        xtype: 'analyticsdzdb',
                        deivceType: 'ylsb',
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
    },


    // 预警信息面板相关 controller
    alertInfoBoxReady: function () {
        var me = this;
        var meView = me.getView();

        me.updateAlertInfoDataGrid(1);
    },
    updateAlertInfoDataGrid: function ( wantpageno ) {
        if(!wantpageno)return;
        var me = this;
        var meView = me.getView();
        var datagrid = meView.lookupReference('AlertInfoGridPanel');

        var action = "alarms";
        var param = {};
        param.deviceid = meView.deviceCode;
        param.quakeid = meView.quakeId;
        param.begin = meView.lookupReference('startDate').getRawValue();
        param.end = meView.lookupReference('endDate').getRawValue();
        param.pageno = wantpageno;
        param.pagesize = meView.getViewModel().get('gridPageStore').pageSize;

        var mask = ajax.fn.showMask( meView, '数据加载中...');

        function successCallBack(response, opts) {
            ajax.fn.hideMask(mask);
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
            if(!result['data']) return;

            meView.getViewModel().set('gridPageStore',{
                total: result['data']['total'],
                currentPage: result['data']['page'],
                pageSize: result['data']['size']
            })

            var gridStore = new Ext.create('Ext.data.Store', {
                data: result.data.rows
            });
            datagrid.setStore(gridStore);
        }
        function failureCallBack(response, opts) {
            ajax.fn.hideMask(mask);
        }
        ajax.fn.executeV2(param, 'GET', conf.serviceUrl + action, successCallBack, failureCallBack);
    },
    AlertInfobuttonClick: function () {
        var me = this;
        var meView = me.getView();
        me.updateAlertInfoDataGrid(1);
    },
    pagebuttonChange: function (thisExt, page, eOpts ) {
        var me = this;
        me.updateAlertInfoDataGrid(page);
        return false;
    },

    // 数据列表面板相关 controller
    monitorDataBoxReady: function () {
        var me = this;
        var meView = me.getView();

        if(meView.deviceType === '' && meView.deviceId === ''){
            // 如果是地灾点
            meView.lookupReference('monDeviceListRef').setHidden(false);
            me.monitorDataQuery(1);
        }
        else
        {
            meView.lookupReference('monDeviceListRef').setHidden(true);
            me.monitorDataQuery(1);
        }
    },
    monitorDataQuery: function (pageNo) {
        var me = this;
        var meView = me.getView();

        var startTime = meView.lookupReference('startTime').getRawValue();
        var endTime = meView.lookupReference('endTime').getRawValue();
        var params = {};
        params.begin = startTime;
        params.end = endTime;
        params.pageno = pageNo;
        params.pagesize = meView.getViewModel().get('gridPageStore').pageSize;
        var queryType = '';

        if(meView.deviceType === '' || meView.deviceId === ''){
            // 如果是地灾点
            queryType = meView.lookupReference('monDeviceListRef').getSelection();
            if(queryType === null)
                queryType = 'lfsb';
            else
                queryType = queryType.get('type');

            params.quakeid = meView.quakeId;
        }
        else
        {
            queryType = meView.deviceType;
            params.quakeid = meView.quakeId;
            params.deviceid = meView.deviceId;
        }

        var action = null;
        switch (queryType){
            case 'wysb':
                action = 'tbmwys';
                break;
            case 'lfsb':
                action = 'crevices';
                break;
            case 'ylsb':
                action = 'rains';
                break;
        }

        var mask = ajax.fn.showMask(meView, '数据加载中...');
        function successCallBack(response, opts) {
            ajax.fn.hideMask(mask);
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
            if (result['data'] != null) {
                meView.getViewModel().set('gridPageStore',{
                    total: result['data']['total'],
                    currentPage: result['data']['page'],
                    pageSize: result['data']['size']
                })
                // 如果是裂缝和雨量设备就用第一个grid
                if(queryType === 'lfsb' || queryType === 'ylsb')
                {
                    meView.lookupReference('monLFYLDataGridRef').setHidden(false);
                    meView.lookupReference('monWYDataGridRef').setHidden(true);
                    meView.lookupReference('monLFYLDataGridRef').setStore(
                        new Ext.data.Store({
                            data: result['data']['rows']
                        })
                    )
                }
                else
                {
                    // 位移设备的数据量大，表格横向可缩放
                    meView.lookupReference('monLFYLDataGridRef').setHidden(true);
                    meView.lookupReference('monWYDataGridRef').setHidden(false);
                    meView.lookupReference('monWYDataGridRef').setStore(
                        new Ext.data.Store({
                            data: result['data']['rows']
                        })
                    )
                }
            }
        }
        function failureCallBack(response, opts) {
            ajax.fn.hideMask(mask);
        }
        ajax.fn.executeV2(params, 'GET', conf.serviceUrl + action, successCallBack, failureCallBack);

    },
    monitorDataBtnClick: function () {
        var me = this;
        var meView = me.getView();

        me.monitorDataQuery(1);
    },
    monitorDataPagebuttonChange: function (thisExt, page, eOpts ) {
        var me = this;
        me.updateAlertInfoDataGrid(page);
        return false;
    },

    // 设备列表面板相关 controller
    monpotdevicelistBoxReady: function () {
        var me = this;
        var meView = me.getView();

        // if(meView.deviceType === '')
            meView.lookupReference('deviceTypeRef').setSelection( meView.lookupReference('deviceTypeRef').getStore().first() );

        me.monpotdevicelistQuery(1);
    },
    monpotdevicelistQuery: function (pageNo) {
        var me = this;
        var meView = me.getView();

        var querydeviceType = '';
        var queryCombo = meView.lookupReference('deviceTypeRef').getSelection();
        if(queryCombo){
            switch (queryCombo.get('type')){
                case 'alljc':
                    querydeviceType = '';
                    break;
                case 'lfjc':
                    querydeviceType = '3';
                    break;
                case 'wyjc':
                    querydeviceType = '1';
                    break;
                case 'yljc':
                    querydeviceType = '2';
                    break;
            }
        }

        var params = {};
        params.quakeid = meView.quakeId;
        params.type = querydeviceType;
        params.pageno = pageNo;
        params.pagesize = meView.getViewModel().get('gridPageStore').pageSize;

        var mask = ajax.fn.showMask(meView, '数据加载中...');
        function successCallBack(response, opts) {
            ajax.fn.hideMask(mask);
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
            if (result['data'] != null) {
                meView.getViewModel().set('gridPageStore',{
                    total: result['data']['total'],
                    currentPage: result['data']['page'],
                    pageSize: result['data']['size']
                })
                meView.lookupReference('DeviceListGridPanel').setStore(
                    new Ext.data.Store({
                        data: result['data']['rows']
                    })
                )
            }
        }
        function failureCallBack(response, opts) {
            ajax.fn.hideMask(mask);
        }
        ajax.fn.executeV2(params, 'GET', conf.serviceUrl + 'devices', successCallBack, failureCallBack);
    },
    monpotdevicelistBtnClick: function () {
        var me = this;
        var meView = me.getView();

        me.monpotdevicelistQuery(1);
    },
    monpotdevicelistPagebuttonChange: function (thisExt, page, eOpts ) {
        var me = this;
        me.monpotdevicelistQuery(page);
        return false;
    },
});