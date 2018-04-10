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

        var monArea = meView.lookupReference('monAreaListRef');
        var treeData = [{text: '全部区域',code: ''}];
        meView.getTreeRegion = g.fn.getRegionData();
        for(var index = 0; index < meView.getTreeRegion.length; index++){
            treeData.push( meView.getTreeRegion[index] );
        }
        monArea.setStore(
            new Ext.data.Store({
                data: treeData
            })
        );
        monArea.setSelection( monArea.getStore().first() );

        // var monType = meView.lookupReference('monTypeListRef');
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
        var monDevice = meView.lookupReference('monDeviceListRef').getSelection();

        var startTime = meView.lookupReference('startTime').getRawValue();
        var endTime = meView.lookupReference('endTime').getRawValue();

        if(monArea === null)
            monArea = '';
        else
            monArea = monArea.get('code');
        if(monType === null)
            monType = 'wyjc';
        else
            monType = monType.get('type');
        if(monDevice === null)
            monDevice = '';
        else
            monDevice = monDevice.get('code');

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
        params.regionid = monArea;
        params.deviceid = monDevice;
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
                // 如果是裂缝和雨量设备就用第一个grid
                if(monType === 'lfjc' || monType === 'yljc')
                {
                    meView.lookupReference('monLFYLDataGridRef').setHidden(false);
                    meView.lookupReference('monWYDataGridRef').setHidden(true);
                    // 加上裂缝和雨量设备的单位，裂缝mm 雨量ml
                    var isLFSB = monType === 'lfjc' ? true : false;
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

    pagebuttonChange: function (thisExt, page, eOpts ) {
        var me = this;
        me.mondataRefreshFun(page);
        return false;
    },

    showDeviceList: function () {
        var me = this;
        var meView = me.getView();

        var monArea = meView.lookupReference('monAreaListRef').getSelection();
        var monType = meView.lookupReference('monTypeListRef').getSelection();

        var monAreaCode = null;
        if(monArea === null)
            monAreaCode = '';
        else
            monAreaCode = monArea.get('code');


        if(monType === null)
            monType = 'wyjc';
        else
            monType = monType.get('type');
        var deviceType = null;
        switch (monType){
            case 'wyjc':
                deviceType = 1;
                break;
            case 'lfjc':
                deviceType = 3;
                break;
            case 'yljc':
                deviceType = 2;
                break;
        }
        var allDeviceList = [];
        if(monAreaCode === ''){
            for(var index = 0; index < meView.getTreeRegion.length; index++){
                if(meView.getTreeRegion[index].hasOwnProperty('children') &&
                    meView.getTreeRegion[index].children !== null){
                    for(var regionIndex = 0;regionIndex < meView.getTreeRegion[index].children.length; regionIndex++)
                    {
                        var regionData = meView.getTreeRegion[index].children[regionIndex];
                        if(regionData.hasOwnProperty('children') && regionData.children !== null)
                            allDeviceList = allDeviceList.concat( regionData.children );
                    }
                }
            }
        } else {
            var regiondata = monArea.getData();
            if(regiondata.hasOwnProperty('children') && regiondata.children !== null){
                for(var regionIndex = 0;regionIndex < regiondata.children.length; regionIndex++)
                {
                    var regionData = regiondata.children[regionIndex];
                    if(regionData.hasOwnProperty('children') && regionData.children !== null)
                        allDeviceList = allDeviceList.concat( regionData.children );
                }
            }
        }
        var deviceList = [
            {
                text: '全部设备',
                code: ''
            }
        ];
        for(var index in allDeviceList){
            var eachData = allDeviceList[index];
            if(eachData.deviceType === deviceType)
                deviceList.push(eachData);
        }

        var monDevice = meView.lookupReference('monDeviceListRef');
        monDevice.setStore(
            new Ext.data.Store({
                data: deviceList
            })
        );
        monDevice.setSelection( monDevice.getStore().first() );
    }
});