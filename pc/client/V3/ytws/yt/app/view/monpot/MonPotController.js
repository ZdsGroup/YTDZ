/**
 * Created by LBM on 2017/12/30.
 */

monpot = {};
monpot.v = {
    menuListData: null, // 初始化时候从左侧树中得到的相关数据

    currentDataList: null, // 当前显示的dataList
    // region --> disasterpoint --> device
    currentType: null,     // 当前显示的类型

    parentType: null,
    parentCode: null,

}

monpot.fn = {
    showNewModelWin: function (state, objTitle, objCode) {
        var winOption = {
            title: "详情",
            width: 700,
            height: 400,
            layout: "fit",
            modal: true,
            closable: true,
            maximizable: false,
            minimizable: false,
            resizable: false,
            items: []
        }
        var isEdit = false;
        switch (state){
            case 'view':
                winOption.title = objTitle + '详情';
                break;
            case 'edit':
                winOption.closable = false;
                winOption.title = '编辑' + objTitle + '详情';
                isEdit = true;
                winOption.fbar = [
                    '->',
                    { xtype: 'button', text: '确定' },
                    { xtype: 'button', text: '取消', handler: function () {
                        this.up('window').close()
                    } },
                ]
                break;
        }
        if(state === 'add'){
            winOption.closable = false;
            isEdit = true;
            winOption.fbar = [
                '->',
                { xtype: 'button', text: '确定' },
                { xtype: 'button', text: '取消', handler: function () {
                    this.up('window').close()
                } },
            ]
            switch (monpot.v.currentType){
                case 'disasterpoint':
                    winOption.items = [
                        {
                            xtype: 'disasterpointdetail',
                            editable: isEdit
                        }
                    ]
                    winOption.title = '地灾点新增';
                    Ext.create("Ext.window.Window", winOption).show();
                    break;
                case 'device':
                    winOption.items = [
                        {
                            xtype: 'devicedetail',
                            editable: isEdit
                        }
                    ]
                    winOption.title = '设备新增';
                    Ext.create("Ext.window.Window", winOption).show();
                    break;
            }
            return;
        }

        var action = null;
        var successCallBack = null;
        switch (monpot.v.currentType){
            case 'disasterpoint':
                action = 'quakes/' + objCode;
                successCallBack = function (response, opts) {
                    //查询结果转json对象
                    var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
                    if (result['data'] === null) return;
                    // 展示地灾点详情
                    winOption.items = [
                        {
                            xtype: 'disasterpointdetail',
                            disasterpointData: result['data'],
                            editable: isEdit
                        }
                    ]
                    Ext.create("Ext.window.Window", winOption).show();
                }
                break;
            case 'device':
                action = 'devices/' + objCode;
                successCallBack = function (response, opts) {
                    //查询结果转json对象
                    var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
                    if (result['data'] === null) return;
                    // 展示地灾点详情
                    winOption.items = [
                        {
                            xtype: 'devicedetail',
                            deviceData: result['data'],
                            editable: isEdit
                        }
                    ]
                    Ext.create("Ext.window.Window", winOption).show();
                }
                break;
        }
        function failureCallBack(response, opts) {
            // 失败
        }
        if(action)
            ajax.fn.executeV2({},'GET',conf.serviceUrl + action,successCallBack,failureCallBack);
    }
}

Ext.define('yt.view.monpot.MonPotController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.monpot',

    requires: [
        'Ext.data.Store',
        'Ext.layout.container.Fit',
        'Ext.toolbar.Fill',
        'Ext.window.Window',
        'yt.view.monpot.deviceDetail',
        'yt.view.monpot.disasterpointDetail'
    ],

    /**
     * Called when the view is created
     */
    init: function() {

    },

    monpotViewBoxReadyfunc: function () {
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

        Ext.getCmp('monpotToolBar').setHidden(true);
        Ext.getCmp('monpotGridpanelUpdate').setDisabled(true);
        Ext.getCmp('monpotGridpanelBack').setDisabled(true);

        me.queryButtonClick();
    },

    queryButtonClick: function () {
        var me = this;
        var meView = me.getView();

        var queryArea = meView.lookupReference('monAreaListRef').getSelection();
        var queryType = meView.lookupReference('queryTypeRef').getSelection();
        var qyeryDeviceType = meView.lookupReference('queryDeviceTypeRef').getSelection();

        if(queryArea === null)
            queryArea = '';
        else
            queryArea = queryArea.get('code');
        if(queryType === null)
            queryType = 'dzd';
        else
            queryType = queryType.get('type');
        if(qyeryDeviceType === null)
            qyeryDeviceType = '';
        else
            qyeryDeviceType = qyeryDeviceType.get('type');

        var action = "quakes";
        if(queryType === 'dzd')
            action = "quakes";
        else
            action = "devices";
        var params = {};
        // todo 查询条件
        var mask = ajax.fn.showMask(meView, '数据加载中...');
        // 查询地灾点
        function successCallBack(response, opts) {
            ajax.fn.hideMask(mask);
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
            if (result['data'] === null) return;
            // 展示地灾点详情
            meView.getViewModel().set('gridPageStore',{
                total: result['data']['total'],
                currentPage: result['data']['page'],
                pageSize: result['data']['size']
            })
            Ext.each(result['data']['rows'],function (items) {
                // 参数归一化处理
                if(queryType === 'dzd')
                {
                    items.code = items.quakeid;
                }
                else
                {
                    items.code = items.deviceid;
                }
            })
            var dataGrid = Ext.getCmp('monpotGridpanel');
            dataGrid.setStore(
                new Ext.data.Store({
                    data: result['data']['rows']
                })
            )
            // 设置详情和编辑的相关参数
            if(queryType === 'dzd')
            {
                monpot.v.currentType = 'disasterpoint';
            }
            else
            {
                monpot.v.currentType = 'device';
            }
        }
        function failureCallBack(response, opts) {
            // 失败
            ajax.fn.hideMask(mask);
        }
        ajax.fn.executeV2(params, 'GET', conf.serviceUrl + action, successCallBack, failureCallBack);
    },

    showDeviceTypeList: function (combo, record, eOpts) {
        var me = this;
        var meView = me.getView();
        if(record.get('type') === 'jcsb')
        {
            meView.lookupReference('queryDeviceTypeRef').setHidden(false);
        }
        else
        {
            meView.lookupReference('queryDeviceTypeRef').setHidden(true);
        }
    },
    
    gridpanelRowClickfunc: function (thisExt, record, element, rowIndex, e, eOpts) {
        var detailData = record.getData();
        // 如果点击的是对应的 操作按钮
        if(e.target.dataset.qtip === '详情'){
            monpot.fn.showNewModelWin('view', detailData.name, detailData.code);
            return;
        } else if(e.target.dataset.qtip === '修改'){
            monpot.fn.showNewModelWin('edit', detailData.name, detailData.code);
            return;
        } else if(e.target.dataset.qtip === '删除'){
            // todo 删除待处理
            return;
        }
        if(monpot.v.currentType === 'disasterpoint'){
            // 点击的是地灾点，查询得到相应的监测设备
            var selectedDisasterpoint = record.getData();
            // todo
        }
    },
    
    getBack: function () {
        if(monpot.v.currentType === 'disasterpoint'){
            // 如果当前是地灾点，则返回到行政区划
        } else if(monpot.v.currentType === 'device'){
            // 如果当前是设备列表，则返回到对应的地灾点列表
            var fatData = monpot.fn.findFatItems( monpot.v.parentType, monpot.v.parentCode );
        }
    },

    addNew: function () {
        monpot.fn.showNewModelWin('add');
    }
});