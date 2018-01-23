/**
 * Created by LBM on 2017/12/30.
 */
Ext.define('yt.view.mondata.MonDataController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.mondata',

    requires: [
        'Ext.data.Store'
    ],

    /**
     * Called when the view is created
     */
    init: function() {

    },
    gridPanelBoxReady: function () {
        var me = this;
        var meView = me.getView();

        // var monArea = meView.lookupReference('monAreaListRef');
        // var monType = meView.lookupReference('monTypeListRef');
        //
        // monArea.setSelection( monArea.getStore().first() );
        // monType.setSelection( monType.getStore().first() );

        // 初始化加载数据
        me.mondataRefreshFun(1);
    },

    cleanAllData: function () {
        var me = this;
        var meView = me.getView();

        var monName = meView.lookupReference('monName').setValue('');
        var monArea = meView.lookupReference('monAreaListRef');
        var monType = meView.lookupReference('monTypeListRef');
        // monArea.setSelection( monArea.getStore().first() );
        monArea.setSelection( null );
        // monType.setSelection( monType.getStore().first() );
        monType.setSelection( null );

        var startTime = meView.lookupReference('startTime').setValue( Ext.Date.add(new Date(), Ext.Date.DAY, -1) );
        var endTime = meView.lookupReference('endTime').setValue( new Date() );

        me.mondataRefreshFun(1);
    },

    buttonRefreshFun: function () {
        var me = this;
        me.mondataRefreshFun(1);
    },

    mondataRefreshFun: function (wantpageno) {
        if(!wantpageno)return;
        var me = this;
        var meView = me.getView();

        var monName = meView.lookupReference('monName').getValue();
        var monArea = meView.lookupReference('monAreaListRef').getSelection();
        var monType = meView.lookupReference('monTypeListRef').getSelection();

        var startTime = meView.lookupReference('startTime').getRawValue();
        var endTime = meView.lookupReference('endTime').getRawValue();

        if(monArea === null)
            monArea = '';
        else
            monArea = monArea.get('code');
        if(monType === null)
            monType = 'lfjc';
        else
            monType = monType.get('type');

        var action = null;
        switch (monType){
            case 'wyjc':
                action = 'tbmwys';
                break;
            case 'lfjc':
                action = 'crevices';
                break;
            case 'yljc':
                action = 'rains';
                break;
        }

        var params = {};
        params.begin = startTime;
        params.end = endTime;
        params.regionid = monArea
        // params.deviceid = ''; // todo 暂时没有对接上
        params.name = monName;
        params.pageno = wantpageno;
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
                meView.lookupReference('monDataGridRef').setStore(
                    new Ext.data.Store({
                        data: result['data']['rows']
                    })
                )
            }
        }
        function failureCallBack(response, opts) {
            ajax.fn.hideMask(mask);
        }
        ajax.fn.executeV2(params, 'GET', conf.serviceUrl + action, successCallBack, failureCallBack);
    },

    pagebuttonChange: function (thisExt, page, eOpts ) {
        var me = this;
        me.mondataRefreshFun(page);
        return false;
    }
});