/**
 * Created by lyuwei on 2018/1/30.
 */
Ext.define('yt.view.ytmap.detail.monpotDetailController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.monpotdetail',

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
            result['data']['connectstatus'] = me.rendererDeviceStatus(result['data']['connectstatus']);
            result['data']['batterystatus'] = me.rendererDeviceStatus(result['data']['batterystatus']);

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
    }
});