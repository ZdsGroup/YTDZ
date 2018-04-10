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
                queryType = 'wysb';
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
                    // 加上裂缝和雨量设备的单位，裂缝mm 雨量ml
                    var isLFSB = queryType === 'lfsb' ? true : false;
                    var dataArr = result['data']['rows'];
                    for(var index = 0; index < dataArr.length; index++){
                        if(isLFSB)
                            dataArr[index].v1 = dataArr[index].v1 + ' mm';
                        else
                            dataArr[index].v1 = dataArr[index].v1 + ' ml';
                    }
                    meView.lookupReference('monLFYLDataGridRef').setStore(
                        new Ext.data.Store({
                            data: dataArr
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
    }
});