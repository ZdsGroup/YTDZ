/**
 * Created by lyuwei on 2018/1/30.
 */
Ext.define('yt.view.ytmap.detail.monpotAlertInfoController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.monpotalertinfo',

    requires: [
        'Ext.data.Store'
    ],

    /**
     * Called when the view is created
     */
    init: function() {

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
    }
});