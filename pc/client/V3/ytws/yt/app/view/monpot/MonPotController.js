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

    /**以上为历史数据，暂时不删除*/
    detailPanel: null
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
                    if (result['code'] !== 0) return;// 返回结果 code 为 0 正常，否则不正常
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
                    if (result['code'] !== 0) return;// 返回结果 code 为 0 正常，否则不正常
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
    },

    getDetailPanel: function () {
        if(monpot.v.detailPanel) {

            monpot.v.detailPanel.down('tabpanel[name=disasterpointDetailPanel]').setHidden(true);
            monpot.v.detailPanel.down('tabpanel[name=deviceDetailPanel]').setHidden(true);

            monpot.v.detailPanel.down('[name=gobackDetail]').setHidden(true);

            return monpot.v.detailPanel;
        }

        var height_80 = window.innerHeight * 0.8;
        var width_80 = window.innerWidth * 0.8;
        var winOption = {
            title: "详情",
            width: width_80,
            height: height_80,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            modal: true,
            closable: true,
            closeAction: 'method-hide',
            maximizable: true,
            minimizable: false,
            resizable: true,
            tools: [
                {
                    // type:'left',
                    itemId: 'reply',
                    glyph: 'xf112@FontAwesome', // Reply icon
                    tooltip: '返回',
                    name: 'gobackDetail',
                    hidden:true,
                    handler: function(event, toolEl, panelHeader) {
                        monpot.fn.getBackDetailPanel();
                    }
                }
            ],
            items: [
                {
                    xtype: 'tabpanel',
                    name: 'disasterpointDetailPanel',
                    ui: 'navigation1',
                    border: false,
                    hidden: true,
                    flex: 1,
                    defaults: {
                        bodyPadding: 5,
                        scrollable: true,
                        closable: false,
                        border: false
                    },
                    tabPosition: 'left',
                    tabRotation: 0,
                    items: []
                },
                {
                    xtype: 'tabpanel',
                    name: 'deviceDetailPanel',
                    ui: 'navigation1',
                    border: false,
                    hidden: true,
                    flex: 1,
                    defaults: {
                        bodyPadding: 5,
                        scrollable: true,
                        closable: false,
                        border: false
                    },
                    tabPosition: 'left',
                    tabRotation: 0,
                    items: []
                }
            ]
        }
        monpot.v.detailPanel = Ext.create("Ext.window.Window", winOption);

        Ext.on('resize', function (width, height)
        {
            if(monpot.v.detailPanel){
                monpot.v.detailPanel.setWidth(width * 0.8);
                monpot.v.detailPanel.setHeight(height * 0.8);
            }
        });

        return monpot.v.detailPanel;
    },

    getBackDetailPanel: function () {
        var popwindow = monpot.fn.getDetailPanel();
        popwindow.down('tabpanel[name=disasterpointDetailPanel]').setHidden(false);
        popwindow.setTitle(popwindow.preTitle);
    },

    showDZDDetailPanel: function (detailInfo) {
        var popwindow = monpot.fn.getDetailPanel();
        popwindow.setTitle( detailInfo.name + '详情');
        var dzdpanel = popwindow.down('tabpanel[name=disasterpointDetailPanel]');
        // 清楚历史数据
        dzdpanel.removeAll();
        var itemsarr = [
                {
                    title: '详情信息',
                    iconCls: 'fa fa-file-image-o',
                    xtype: 'monpot-detail',

                    // config
                    quakeId: detailInfo.quakeid.toString()
                },
                {
                    title: '预警信息',
                    iconCls: 'fa fa-exclamation-triangle',
                    xtype: 'monpot-alertinfo',

                    // config
                    quakeId: detailInfo.quakeid.toString()
                },
                {
                    title: '数据列表',
                    iconCls: 'fa fa-list',
                    itemId: 'deviceDataListId',
                    xtype: 'monpot-monitordata',

                    // config
                    quakeId: detailInfo.quakeid.toString(),
                    deviceId: '',
                    deviceType: ''
                },
                {
                    title: '设备列表',
                    iconCls: 'fa fa-th',
                    xtype: 'monpot-devicelist',

                    quakeId: detailInfo.quakeid.toString(),
                    deviceType: '',
                    detailBtnClick: function (thisExt, record, element, rowIndex, e, eOpts) {
                        var detailData = record.getData();
                        if(e.target.dataset.qtip === '详情' || e.type === "dblclick"){
                            monpot.fn.showDeviceDetailPanel(detailData,true);
                        }
                    }
                }
        ]
        dzdpanel.add( itemsarr );
        dzdpanel.setHidden(false);
        dzdpanel.setActiveTab(0);
        popwindow.show();
    },

    showDeviceDetailPanel: function (deviceInfo, isCanBack) {
        var popwindow = monpot.fn.getDetailPanel();
        if(isCanBack){
            // 可以返回
            popwindow.preTitle = popwindow.getTitle();
            monpot.v.detailPanel.down('[name=gobackDetail]').setHidden(false);
        }
        popwindow.setTitle( deviceInfo.name + '详情');
        var devicepanel = popwindow.down('tabpanel[name=deviceDetailPanel]');
        // 清楚历史数据
        devicepanel.removeAll();
        var itemsarr = [
            {
                title: '详情信息',
                iconCls: 'fa fa-file-image-o',
                xtype: 'monpot-devicedetail',

                // config
                deviceId: deviceInfo.deviceid.toString()
            },
            {
                title: '预警信息',
                iconCls: 'fa fa-exclamation-triangle',
                xtype: 'monpot-alertinfo',

                // config
                quakeId: deviceInfo.quakeid.toString(),
                deviceCode: deviceInfo.deviceid.toString()
            },
            {
                title: '数据列表',
                iconCls: 'fa fa-list',
                xtype: 'monpot-monitordata',

                // config
                quakeId: deviceInfo.quakeid.toString(),
                deviceId: deviceInfo.deviceid.toString(),
                deviceType:
                    deviceInfo.type === 1 ? 'wysb' :
                        deviceInfo.type === 2 ? 'ylsb' : 'lfsb'
            },
            {
                title: '智能分析',
                iconCls: 'fa fa-lightbulb-o',
                xtype: 'monpot-analytics',

                // config
                deviceType:
                    deviceInfo.type === 1 ? 'wysb' :
                        deviceInfo.type === 2 ? 'ylsb' : 'lfsb',
                deviceCode: deviceInfo.deviceid.toString(),
                quakeId: deviceInfo.quakeid.toString()
            }
        ]
        devicepanel.add( itemsarr );
        devicepanel.setHidden(false);
        devicepanel.setActiveTab(0);
        popwindow.show();
    }
}

Ext.define('yt.view.monpot.MonPotController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.monpot',

    requires: [
        'Ext.data.Store'
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

        me.updateMonpotDataGrid(1);
    },

    pagebuttonChange: function (thisExt, page, eOpts ) {
        var me = this;
        me.updateMonpotDataGrid(page);
        return false;
    },

    updateMonpotDataGrid: function (pageindex) {
        if(!pageindex)return;
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
        var params = {};
        // 分页用的默认属性
        params.pageno = pageindex;
        params.pagesize = meView.getViewModel().get('gridPageStore').pageSize;
        params.userid = g.v.userId;
        params.name = meView.lookupReference('monpotName').getValue();
        if(queryType === 'dzd')
        {
            action = "quakes";
            params.regionid = queryArea;
        }
        else
        {
            action = "devices";
            params.regionid = queryArea;
            params.type = qyeryDeviceType;
        }
        var mask = ajax.fn.showMask(meView, '数据加载中...');
        // 查询地灾点
        function successCallBack(response, opts) {
            ajax.fn.hideMask(mask);
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
            if (result['code'] !== 0) return;// 返回结果 code 为 0 正常，否则不正常
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
            meView.lookupReference('monpotName').setValue('');
        }
        else
        {
            meView.lookupReference('queryDeviceTypeRef').setHidden(true);
            meView.lookupReference('monpotName').setValue('');
        }
    },
    
    gridpanelRowClickfunc: function (thisExt, record, element, rowIndex, e, eOpts) {
        var detailData = record.getData();
        // 如果点击的是对应的 操作按钮
        if(e.target.dataset.qtip === '详情' || e.type === "dblclick"){
            // 查看当前点击的是地灾点还是监测设备
            if(detailData.hasOwnProperty('deviceid')){
                // 点击的是设备
                monpot.fn.showDeviceDetailPanel(detailData,false);
            } else {
                // 点击的是地灾点
                monpot.fn.showDZDDetailPanel(detailData);
            }
            return;
        } else if(e.target.dataset.qtip === '修改'){
            monpot.fn.showNewModelWin('edit', detailData.name, detailData.code);
            return;
        } else if(e.target.dataset.qtip === '删除'){
            // todo 删除待处理
            return;
        }
        // if(monpot.v.currentType === 'disasterpoint'){
        //     // 点击的是地灾点，查询得到相应的监测设备
        //     var selectedDisasterpoint = record.getData();
        // }
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