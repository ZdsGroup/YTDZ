/**
 * Created by lyuwei on 2018/1/30.
 */
Ext.define('yt.view.ytmap.detail.monpotDeviceListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.monpotdevicelist',

    requires: [
        'Ext.data.Store',
        'Ext.layout.container.Fit',
        'Ext.tab.Panel',
        'Ext.window.Window',
        'yt.view.ytmap.detail.monpotAlertInfo',
        'yt.view.ytmap.detail.monpotAnalytics',
        'yt.view.ytmap.detail.monpotDeviceDetail',
        'yt.view.ytmap.detail.monpotMonitordata'
    ],

    /**
     * Called when the view is created
     */
    init: function() {

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
    }
});