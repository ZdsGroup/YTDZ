/**
 * Created by lyuwei on 2018/1/30.
 */
Ext.define('yt.view.ytmap.detail.monpotMonitordataController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.monpotmonitordata',

    requires: [
        'Ext.data.Store'
    ],

    /**
     * Called when the view is created
     */
    init: function() {

    },

    // 数据列表面板相关 controller
    monitorDataBoxReady: function () {
        var me = this;
        var meView = me.getView();

        if(meView.deviceType === '' && meView.deviceId === ''){
            // 如果是地灾点
            meView.lookupReference('monDeviceTypeListRef').setHidden(false);
            meView.lookupReference('monDeviceListRef').setHidden(false);
            me.getDviceList();
            me.monitorDataQuery(1);
        } else {
            meView.lookupReference('monDeviceTypeListRef').setHidden(true);
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

        meView.lookupReference('yltjLabel').setText('');// 设置雨量总下雨量为空
        if(meView.deviceType === '' || meView.deviceId === ''){
            // 如果是地灾点
            queryType = meView.lookupReference('monDeviceTypeListRef').getSelection();
            queryType = queryType == null ? 'wysb' : queryType.get('type');

            params.deviceid = meView.lookupReference('monDeviceListRef').getValue()
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
                    // 加上裂缝和雨量设备的单位，裂缝mm 雨量mm
                    var isLFSB = queryType === 'lfsb';
                    var dataArr = result['data']['rows'];
                    for(var index = 0; index < dataArr.length; index++){
                        if(isLFSB)
                            dataArr[index].v1 = dataArr[index].v1 + ' mm';
                        else
                            dataArr[index].v1 = dataArr[index].v1 + ' mm';
                    }
                    meView.lookupReference('monLFYLDataGridRef').setStore(
                        new Ext.data.Store({
                            data: dataArr
                        })
                    )
                    // 如果是雨量设备调用下面的方法设置当前时段雨量总合
                    if( opts.params.deviceid !== '' && queryType === 'ylsb' ) {
                        // 如果为单个雨量设备则显示统计
                        // meView.lookupReference('yltjLabel').setText('当前时段总雨量为');
                        ajax.fn.executeV2(
                            {
                                begin: opts.params.begin,
                                end: opts.params.end,
                                pageno: 1,
                                pagesize: 20000,
                                quakeid: opts.params.quakeid,
                                deviceid: opts.params.deviceid
                            },
                            'GET',
                            conf.serviceUrl + 'rains',
                            function failureCallBack(response, opts) {
                                var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
                                var totalValue = 0;
                                if(result['data'] !== null) {
                                    Ext.Array.forEach(result['data']['rows'],function (item,index) {
                                        totalValue += item.v1
                                    })
                                }
                                meView.lookupReference('yltjLabel').setText('当前时段总雨量为 ' + totalValue + ' mm');
                            },
                            function failureCallBack(response, opts) {
                            }
                        );
                    }
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
        me.monitorDataQuery(page);
        return false;
    },

    getDviceList: function () {
        // 当前设备的quakeid已经有了
        var me = this;
        var meView = this.getView();
        var queryDeviceType = meView.lookupReference('monDeviceTypeListRef').getSelection();
        queryDeviceType = queryDeviceType == null ? 'wysb' : queryDeviceType.get('type');
        switch (queryDeviceType){
            case 'wysb':
                queryDeviceType = '1';
                break;
            case 'lfsb':
                queryDeviceType = '3';
                break;
            case 'ylsb':
                queryDeviceType = '2';
                break;
        }

        var actions = 'devices';
        var params = {
            type: queryDeviceType,
            quakeid: meView.quakeId,
            pageno: 1,
            pagesize: 200
        }

        function getdeviceListSuccess(response, opts) {
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
            if(result.code !== 0){
                return;
            }
            var showListData = [
                {
                    name: '全部设备',
                    deviceid: ''
                }
            ]
            Ext.each( result.data.rows, function(item, index) {
                showListData.push({
                    name: item.name,
                    deviceid: item.deviceid
                })
            })
            // 设置对应的view中的datastore
            meView.lookupReference('monDeviceListRef').setStore(
                new Ext.data.Store({
                    data: showListData
                })
            )

            meView.lookupReference('monDeviceListRef').setSelection( 
                meView.lookupReference('monDeviceListRef').getStore().first()
            );
        }
        function getdeviceListFailure(response, opts) {

        }

        ajax.fn.executeV2(params, 'GET', conf.serviceUrl + actions, getdeviceListSuccess, getdeviceListFailure);
    },

    showDeviceList: function() {
        var me = this;
        var meView = me.getView();

        me.getDviceList();
    }

});