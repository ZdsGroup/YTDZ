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

            if(result['data']['connectstatus'] === 1) {
                result['data']['runstatus'] = 1;
                result['data']['batterystatus'] = '---';
            }

            result['data']['runstatus'] = me.rendererDeviceStatus(result['data']['runstatus']);
            result['data']['connectstatus'] = me.rendererDeviceStatus(result['data']['connectstatus']);
            result['data']['batterystatus'] = me.rendererDeviceStatus(result['data']['batterystatus']);

            meView.getViewModel().set('deviceDetailInfo',result['data']);

            // 设置图片轮播
            meView.lookupReference('imgswiper').insertImage(
                Ext.JSON.decode(decodeURIComponent(result['data']['dimage']))
            )
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

            // 设置图片轮播
            meView.lookupReference('imgswiper').insertImage(
                Ext.JSON.decode(decodeURIComponent(result['data']['image']))
            )
        }
        function failureCallBack(response, opts) {
            ajax.fn.hideMask(mask);
        }
        ajax.fn.executeV2({}, 'GET', conf.serviceUrl + action, successCallBack, failureCallBack);

        // 查询对应的群测群防评论信息
        me.qcqfGridListQuery(1);

    },
    rendererDeviceStatus: function (value, metaData) {
        // if(value !== 0){
        //     metaData.tdAttr = 'bgcolor="red"';
        // }
        return value === 1 ? '<font color="red">异常</font>' : value === 0 ? '正常' : value;
    },

    // 群测群防相关
    qcqfGridPageChange (thisExt, page, eOpts) {
        var me = this;
        // 处理 当前 page页的qcqf数据查询
        me.qcqfGridListQuery(page);
        return false;
    },
    qcqfGridListQuery (currentPage) {
        var me = this;
        var meview = me.getView();
        var mepagemodel = me.getViewModel().get('QCQFGridPageStore');
        var params = {
            userid: g.v.userid,
            quakeid: meview.getQuakeId(),
            pageno: currentPage,
            pagesize: mepagemodel.pageSize
        }

        var actions = 'comments';
        var mask = ajax.fn.showMask( meview.lookupReference('qcqfGridPanel'), '数据加载中...');

        function successCallBackFunction (response, opts) {
            ajax.fn.hideMask(mask);
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
            if (result['data'] != null) {
                meview.getViewModel().set('qcqfGridPanel',{
                    total: result['data']['total'],
                    currentPage: result['data']['page'],
                    pageSize: result['data']['size']
                })
                meview.lookupReference('qcqfGridPanel').setStore(
                    new Ext.data.Store({
                        data: result['data']['rows']
                    })
                )
            }
        }
        function failureCallBack(response, opts) {
            ajax.fn.hideMask(mask);
        }

        // ajax.fn.executeV2(params, 'GET', 'http://182.92.2.91:8081/oracle/' + actions, successCallBackFunction, failureCallBack);
        ajax.fn.executeV2(params, 'GET', conf.serviceUrl + actions, successCallBackFunction, failureCallBack);

    },
    qcqfGridRowClick (thisExt, record, element, rowIndex, e, eOpts) {
        if(e.target.dataset.qtip === '详情'){
            var winOption = {
                title: "详情",
                width: 750,
                // height: Ext.getBody().getHeight() - 40,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                modal: true,
                closable: true,
                closeAction: 'method-destroy',
                maximizable: false,
                minimizable: false,
                resizable: false,
                items: [
                    {
                        xtype: 'QCQF-detail',
                        flex: 1,
                        QCQFId: record.get('id')
                    }
                ]
            }

            var QCQFWin = Ext.create("Ext.window.Window", winOption);
            QCQFWin.show();
        }
    }
});