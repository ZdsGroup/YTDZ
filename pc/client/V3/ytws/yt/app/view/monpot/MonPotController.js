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

    getRegionEchartsConfig: function () {
        if(!monpot.v.menuListData)return null;
        monpot.v.currentDataList = monpot.v.menuListData;
        monpot.v.currentType = 'region';
        monpot.v.parentType = null;
        monpot.v.parentCode = null;
        // 设置相关按钮的可用状态
        Ext.getCmp('monpotGridpanelUpdate').setDisabled(true);
        Ext.getCmp('monpotGridpanelBack').setDisabled(true);

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

        var xdata = [];
        var yvalue = [];
        Ext.each(monpot.v.currentDataList, function (eachDZPointItem) {
            xdata.push(eachDZPointItem.text);
            yvalue.push(Number(eachDZPointItem.num));
        })
        var newConfig = Ext.clone(monpot.v.DZPointEchartsConfig);
        newConfig.xAxis.data = xdata;
        newConfig.series[0].data = yvalue;

        monpot.fn.updateGridStore( monpot.v.currentDataList );
        return newConfig;
    }
}

Ext.define('yt.view.monpot.MonPotController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.monpot',

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
            }
            console.log(params);
        });
    },
    
    gridpanelRowClickfunc: function (thisExt, record, element, rowIndex, e, eOpts) {
        // 如果点击的是对应的 操作按钮
        if(e.target.dataset.qtip === '详情'){
            if(monpot.v.currentType === 'disasterpoint'){
                // 展示地灾点详情

            }
            return;
        } else if(e.target.dataset.qtip === '修改'){
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
        }
    },
    
    getBack: function () {
        if(monpot.v.currentType === 'disasterpoint'){
            // 如果当前是地灾点，则返回到行政区划
            monpot.fn.updateEcharts( monpot.fn.getRegionEchartsConfig() );
        } else if(monpot.v.currentType === 'device'){
            // 如果当前是设备列表，则返回到对应的地灾点
        }
    }
});