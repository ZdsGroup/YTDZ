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

    // 行政区划的 echarts 配置
    regionEchartsConfig: {
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value',
            name: '地灾点数量(个)',
        },
        series: [
            {
                data: [],
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                type: 'bar'
            }
        ]
    },

    DZPointEchartsConfig: {
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value',
            name: '设备个数(个)',
        },
        series: [
            {
                data: [],
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                type: 'bar'
            }
        ]
    },

    deviceEchartsConfig: {
        xAxis: {
            type: 'category',
            data: ['位移设备','雨量设备','裂缝设备']
        },
        yAxis: {
            type: 'value',
            name: '设备个数(个)',
        },
        series: [
            {
                data: [],
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                type: 'bar'
            }
        ]
    }
}

monpot.fn = {
    updateEcharts: function (echartsConfig) {
        if(!echartsConfig)return;
        var monpotEcharts = Ext.getCmp('monpotEchart').getEcharts();
        monpotEcharts.clear();
        monpotEcharts.setOption(echartsConfig);
    },
    updateGridStore: function (data) {
        if(!data)return;
        var gridPanel = Ext.getCmp('monpotGridpanel');
        gridPanel.setStore(
            new Ext.create('Ext.data.Store', {
                data: data
            })
        )
    },

    findFatItems: function (fatType, fatCode) {
        var findItems = null;

        function eachChildren(itemData) {
            if(findItems)return false;
            if(itemData.type === fatType && itemData.code === fatCode){
                return true;
            }
            if(itemData.hasOwnProperty('children') && itemData.children){
                Ext.each(itemData.children,function (eachItems) {
                    if( eachChildren(eachItems) ){
                        findItems = itemData;
                    }
                })
            }
        }
        Ext.each(monpot.v.menuListData,function (eachRegion) {
            eachChildren(eachRegion);
        })

        return findItems;
    },

    getRegionEchartsConfig: function () {
        if(!monpot.v.menuListData)return null;
        monpot.v.currentDataList = monpot.v.menuListData;
        monpot.v.currentType = 'region';
        monpot.v.parentType = null;
        monpot.v.parentCode = null;
        // 设置相关按钮的可用状态
        Ext.getCmp('monpotGridpanelUpdate').setDisabled(true);
        Ext.getCmp('monpotGridpanelBack').setDisabled(true);
        Ext.getCmp('monpotGridActionColumn').hide();

        var xdata = [];
        var yvalue = [];
        Ext.each(monpot.v.menuListData, function (eachRegionItem) {
            xdata.push(eachRegionItem.text);
            yvalue.push(Number(eachRegionItem.num));
        })
        var newConfig = Ext.clone(monpot.v.regionEchartsConfig);
        newConfig.xAxis.data = xdata;
        newConfig.series[0].data = yvalue;

        monpot.fn.updateGridStore( monpot.v.menuListData );
        return newConfig;
    },
    
    getDZPointEchartsConfig: function (regionData) {
        if(!regionData)return null;
        monpot.v.currentDataList = regionData.hasOwnProperty('children') ? regionData.children : [];
        monpot.v.currentType = 'disasterpoint';
        monpot.v.parentType = 'region';
        monpot.v.parentCode = regionData.code;
        // 设置相关按钮的可用状态
        Ext.getCmp('monpotGridpanelUpdate').setDisabled(false);
        Ext.getCmp('monpotGridpanelBack').setDisabled(false);
        Ext.getCmp('monpotGridActionColumn').show();

        var xdata = [];
        var yvalue = [];
        Ext.each(monpot.v.currentDataList, function (eachDZpointItem) {
            xdata.push(eachDZpointItem.text);
            yvalue.push(Number(eachDZpointItem.num));
        })
        var newConfig = Ext.clone(monpot.v.DZPointEchartsConfig);
        newConfig.xAxis.data = xdata;
        newConfig.series[0].data = yvalue;

        monpot.fn.updateGridStore( monpot.v.currentDataList );
        return newConfig;
    },

    updateDeviceEchartsConfig: function (DZPointData) {
        if(!DZPointData)return null;
        monpot.v.currentDataList = DZPointData.hasOwnProperty('children') ? DZPointData.children : [];
        monpot.v.currentType = 'device';
        monpot.v.parentType = 'disasterpoint';
        monpot.v.parentCode = DZPointData.code;
        // 设置相关按钮的可用状态
        Ext.getCmp('monpotGridpanelUpdate').setDisabled(false);
        Ext.getCmp('monpotGridpanelBack').setDisabled(false);
        Ext.getCmp('monpotGridActionColumn').show();

        var newConfig = Ext.clone(monpot.v.deviceEchartsConfig);
        newConfig.series[0].data = [
            DZPointData.weiyiDeviceNum,
            DZPointData.rainDeviceNum,
            DZPointData.crevDeviceNum
        ];

        monpot.fn.updateGridStore( monpot.v.currentDataList );
        return newConfig;
    },
    
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

        var mask = ajax.fn.showMask(meView, '数据加载中...');
        function successCallBack(response, opts) {
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
            if (result['data'] != null) {
                var dataList = result['data'];
                if (dataList && dataList.length > 0) {
                    monpot.v.menuListData = dataList;

                    // todo test
                    monpot.fn.updateEcharts( monpot.fn.getRegionEchartsConfig() );
                }
            }
            ajax.fn.hideMask(mask);
        }
        function failureCallBack(response, opts) {
            ajax.fn.hideMask(mask);
        }
        ajax.fn.executeV2({},'GET',conf.serviceUrl + 'menu/tree',successCallBack,failureCallBack);

        var meEcharts = Ext.getCmp('monpotEchart').getEcharts();
        meEcharts.on('click', function (params) {
            // echarts 的钻取只能往下钻
            if(monpot.v.currentType === 'region'){
                // 接下来需要展示的是 地灾点
                // params.dataIndex 代表点击的是第几个地灾点
                var selectedRegion = monpot.v.currentDataList[params.dataIndex];
                monpot.fn.updateEcharts( monpot.fn.getDZPointEchartsConfig(selectedRegion) );
            } else if(monpot.v.currentType === 'disasterpoint'){
                // 接下来要展示的是 设备列表
                var selectedDZPoint = monpot.v.currentDataList[params.dataIndex];
                monpot.fn.updateEcharts( monpot.fn.updateDeviceEchartsConfig(selectedDZPoint) );
            }
        });
    },
    
    gridpanelRowClickfunc: function (thisExt, record, element, rowIndex, e, eOpts) {
        var detailData = record.getData();
        // 如果点击的是对应的 操作按钮
        if(e.target.dataset.qtip === '详情'){
            monpot.fn.showNewModelWin('view', detailData.text, detailData.code);
            return;
        } else if(e.target.dataset.qtip === '修改'){
            monpot.fn.showNewModelWin('edit', detailData.text, detailData.code);
            return;
        } else if(e.target.dataset.qtip === '删除'){
            return;
        }
        if(monpot.v.currentType === 'region'){
            // 接下来需要展示的是 地灾点
            var selectedRegion = record.getData();
            monpot.fn.updateEcharts( monpot.fn.getDZPointEchartsConfig(selectedRegion) );
        } else if(monpot.v.currentType === 'disasterpoint'){
            // 接下来要展示的是 设备列表
            var selectedDZPoint = record.getData();
            monpot.fn.updateEcharts( monpot.fn.updateDeviceEchartsConfig(selectedDZPoint) );
        }
    },
    
    getBack: function () {
        if(monpot.v.currentType === 'disasterpoint'){
            // 如果当前是地灾点，则返回到行政区划
            monpot.fn.updateEcharts( monpot.fn.getRegionEchartsConfig() );
        } else if(monpot.v.currentType === 'device'){
            // 如果当前是设备列表，则返回到对应的地灾点列表
            var fatData = monpot.fn.findFatItems( monpot.v.parentType, monpot.v.parentCode );
            monpot.fn.updateEcharts( monpot.fn.getDZPointEchartsConfig(fatData) );
        }
    },

    addNew: function () {
        monpot.fn.showNewModelWin('add');
    }
});