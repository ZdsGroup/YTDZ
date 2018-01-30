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
    },

    monpotDetailBtnClick: function (thisExt, record, element, rowIndex, e, eOpts) {
        var detailData = record.getData();
        console.log(detailData);
        // 如果点击的是对应的 操作按钮
        if(e.target.dataset.qtip === '详情'){
            var winOption = {
                title: "详情",
                width: 1500,
                height: 800,
                layout: "fit",
                modal: true,
                closable: true,
                maximizable: true,
                minimizable: false,
                resizable: true,
                items: []
            }

            winOption.title = detailData.name + '详情';

            winOption.items = [

                {
                    xtype: 'tabpanel',
                    ui: 'navigation1',
                    border: false,
                    flex: 1,
                    defaults: {
                        bodyPadding: 5,
                        scrollable: true,
                        closable: false,
                        border: false
                    },
                    tabPosition: 'left',
                    tabRotation: 0,
                    items: [
                        {
                            title: '详情信息',
                            iconCls: 'fa fa-file-image-o',
                            xtype: 'monpot-devicedetail',

                            // config
                            deviceId: detailData.deviceid.toString()
                        },
                        {
                            title: '预警信息',
                            iconCls: 'fa fa-exclamation-triangle',
                            xtype: 'monpot-alertinfo',

                            // config
                            quakeId: detailData.quakeid.toString(),
                            deviceCode: detailData.deviceid.toString()
                        },
                        {
                            title: '数据列表',
                            iconCls: 'fa fa-list',
                            xtype: 'monpot-monitordata',

                            // config
                            quakeId: detailData.quakeid.toString(),
                            deviceId: detailData.deviceid.toString(),
                            deviceType:
                                detailData.type === 1 ? 'wysb' :
                                    detailData.type === 2 ? 'ylsb' : 'lfsb'
                        },
                        {
                            title: '智能分析',
                            iconCls: 'fa fa-lightbulb-o',
                            xtype: 'monpot-analytics',

                            // config
                            deviceType:
                                detailData.type === 1 ? 'wysb' :
                                    detailData.type === 2 ? 'ylsb' : 'lfsb',
                            deviceCode: detailData.deviceid.toString(),
                            quakeId: detailData.quakeid.toString()
                        }
                    ]
                }
            ]
            Ext.create("Ext.window.Window", winOption).show();
        }
    }
});