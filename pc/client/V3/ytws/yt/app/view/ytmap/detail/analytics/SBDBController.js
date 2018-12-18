/**
 * Created by lyuwei on 2018/1/18.
 */
Ext.define('yt.view.ytmap.detail.analytics.SBDBController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.analyticssbdb',

    requires: [
        'Ext.data.Store'
    ],

    /**
     * Called when the view is created
     */
    init: function() {

    },

    dzdbBoxReady: function(thisExt, width, height, eOpts ){
        var me = this;
        var meView = me.getView();
        // var nowDate = new Date('2017-12-7 18:00:00');
        var nowDate = new Date();

        meView.lookupReference('endTime').setValue( nowDate );
        meView.lookupReference('startTime').setValue( Ext.Date.add( nowDate, Ext.Date.DAY, -1 ) );

        // 查询需要对比的设备列表
        var comparedDeviceView = meView.lookupReference('comparedDevice');
        var comparedDeviceType = null;
        switch(meView.deviceType){
            case 'wysb':
                // 位移设备多站对比只有起始时间
                meView.lookupReference('endTime').setHidden(true);
                comparedDeviceType = 1;
                break;
            case 'ylsb':
                meView.lookupReference('endTime').setHidden(false);
                comparedDeviceType = 2;
                break;
            case 'lfsb':
                meView.lookupReference('endTime').setHidden(false);
                comparedDeviceType = 3;
                break;
        }

        var mask = ajax.fn.showMask(comparedDeviceView);
        function successCallBack(response, opts) {
            ajax.fn.hideMask(mask);
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
            if (result['code'] !== 0) return;// 返回结果 code 为 0 正常，否则不正常
            var allSameTypeDevice = result['data']['rows'];

            var allDeviceStore = [];
            Ext.each(allSameTypeDevice, function(item, index) {
                if(item.deviceid.toString() !== meView.deviceCode.toString()){
                    allDeviceStore.push(
                        {
                            'name': item.name, // + '-' + item.quakeid, // 暂时只显示名称
                            'devicecode': item.deviceid
                        }
                    )
                }
            });
            comparedDeviceView.setStore(
                new Ext.data.Store({
                    data: allDeviceStore
                })
            )

            // 对比的设备列表加载完毕之后执行查询
            me.tlxsbdbUpdateEcharts();
        }
        function failureCallBack(response, opts) {
            ajax.fn.hideMask(mask);
        }

        if(comparedDeviceType)
            ajax.fn.executeV2(
                {
                    "type": comparedDeviceType,
                    "pageno": 1,
                    "pagesize": 200
                },
                'GET',
                conf.serviceUrl + 'devices',
                successCallBack,
                failureCallBack
            );
    },

    tlxsbdbUpdateEcharts: function () {
        var me = this;
        var meView = me.getView();
        var thisEcharts = meView.down('echartsbasepanel').getEcharts();

        var comparedDeviceIds = meView.lookupReference('comparedDevice').getValue();
        comparedDeviceIds.push( meView.deviceCode );
        comparedDeviceIds = comparedDeviceIds.join(',');

        var params = {};
        // params.quakeid = meView.quakeCode; // 有了对比设备列表 quakeid 不使用
        params.begin = meView.lookupReference('startTime').getRawValue() + ":00:00";
        params.deviceids = comparedDeviceIds; // 对比的设备

        var action = '';
        switch(meView.deviceType){
            case 'wysb':
                action = 'tbmwys/echarts/device';
                break;
            case 'ylsb':
                action = 'rains/echarts/device';
                params.end = meView.lookupReference('endTime').getRawValue() + ":59:59";
                break;
            case 'lfsb':
                action = 'crevices/echarts/device';
                params.end = meView.lookupReference('endTime').getRawValue() + ":59:59";
                break;
        }

        var mask = ajax.fn.showMask(meView, '数据加载中...');

        function successCallBack(response, opts) {
            ajax.fn.hideMask(mask);
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);

            var devicetypecompareOption = {};

            switch(meView.deviceType){
                case 'wysb':
                    devicetypecompareOption = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        grid: {
                            top: 50,
                            bottom: 60,
                            left: 10,
                            right: 70,
                            containLabel: true
                        },
                        legend: {
                            data: []
                        },
                        calculable: false,
                        xAxis: [{
                            type: 'category',
                            data: ['X轴', 'Y轴', 'H轴', '二维', '三维']
                        }],
                        yAxis: [{
                            type: 'value',
                            splitArea: {
                                show: true
                            },
                            name: '位移(mm)',
                            min: function(value) {
                                return Math.floor(value.min - Math.abs( value.min ) * 0.01);
                            },
                            max: function(value) {
                                return Math.ceil(value.max + Math.abs( value.max ) * 0.01);
                            }
                        }],
                        dataZoom: [
                            {
                                type: 'slider',
                                xAxisIndex: 0,
                                filterMode: 'empty'
                            },
                            {
                                type: 'slider',
                                yAxisIndex: 0,
                                filterMode: 'empty'
                            },
                            {
                                type: 'inside',
                                xAxisIndex: 0,
                                filterMode: 'empty'
                            },
                            {
                                type: 'inside',
                                yAxisIndex: 0,
                                filterMode: 'empty'
                            }
                        ],
                        series: []
                    };

                    var series = [];
                    var legend = [];
                    if (result['data'] != null) {
                        Ext.each(result.data,function (item, index, allitems, returnbollean) {
                            legend.push(item.devicename);

                            var devItem = {
                                name: item.devicename,
                                type: 'line',
                                data: [item.dx, item.dy, item.dh, item.d2, item.d3],
                                smooth: true,
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true
                                        }
                                    }
                                }
                            };
                            series.push(devItem);
                        })
                    }
                    devicetypecompareOption.series = series;
                    devicetypecompareOption.legend.data = legend;
                    break;
                case 'ylsb':
                    devicetypecompareOption = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        grid: {
                            top: 50,
                            bottom: 60,
                            left: 15,
                            right: 70,
                            containLabel: true
                        },
                        legend: {
                            data: []
                        },
                        calculable: false,
                        xAxis: [{
                            type: 'category',
                            data: []
                        }],
                        yAxis: [{
                            type: 'value',
                            splitArea: {
                                show: true
                            },
                            name: '累计雨量(mm)',
                            min: function(value) {
                                return Math.floor(value.min - Math.abs( value.min ) * 0.01);
                            },
                            max: function(value) {
                                return Math.ceil(value.max + Math.abs( value.max ) * 0.01);
                            }
                        }],
                        dataZoom: [
                            {
                                type: 'slider',
                                xAxisIndex: 0,
                                filterMode: 'empty'
                            },
                            {
                                type: 'slider',
                                yAxisIndex: 0,
                                filterMode: 'empty'
                            },
                            {
                                type: 'inside',
                                xAxisIndex: 0,
                                filterMode: 'empty'
                            },
                            {
                                type: 'inside',
                                yAxisIndex: 0,
                                filterMode: 'empty'
                            }
                        ],
                        series: []
                    }
                    var series = [];
                    var legend = [];
                    Ext.each(result.data.dataList, function(item, index) {
                        legend.push(item.devicename);
                        var devItem = {
                            name: item.devicename,
                            type: 'line',
                            data: item.rainVal,
                            smooth: true,
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true
                                    }
                                }
                            }
                        };
                        series.push(devItem);
                    });
                    devicetypecompareOption.series = series;
                    devicetypecompareOption.legend.data = legend;
                    devicetypecompareOption.xAxis[0].data = result.data.hourVal;
                    break;
                case 'lfsb':
                    devicetypecompareOption = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        grid: {
                            top: 50,
                            bottom: 60,
                            left: 10,
                            right: 70,
                            containLabel: true
                        },
                        legend: {
                            data: []
                        },
                        calculable: false,
                        xAxis: [{
                            type: 'category',
                            data: []
                        }],
                        yAxis: [{
                            type: 'value',
                            splitArea: {
                                show: true
                            },
                            name: '裂缝(mm)',
                            min: function(value) {
                                return Math.floor(value.min - Math.abs( value.min ) * 0.01);
                            },
                            max: function(value) {
                                return Math.ceil(value.max + Math.abs( value.max ) * 0.01);
                            }
                        }],
                        dataZoom: [
                            {
                                type: 'slider',
                                xAxisIndex: 0,
                                filterMode: 'empty'
                            },
                            {
                                type: 'slider',
                                yAxisIndex: 0,
                                filterMode: 'empty'
                            },
                            {
                                type: 'inside',
                                xAxisIndex: 0,
                                filterMode: 'empty'
                            },
                            {
                                type: 'inside',
                                yAxisIndex: 0,
                                filterMode: 'empty'
                            }
                        ],
                        series: []
                    }
                    var series = [];
                    var legend = [];
                    Ext.each(result.data, function(item, index) {
                        legend.push(item.devicename);
                        var devItem = {
                            name: item.devicename,
                            type: 'line',
                            data: item.rainVal,
                            smooth: true,
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true
                                    }
                                }
                            }
                        };
                        series.push(devItem);
                    });
                    devicetypecompareOption.series = series;
                    devicetypecompareOption.legend.data = legend;
                    devicetypecompareOption.xAxis[0].data = result.data.hourVal;
                    break;
            }

            thisEcharts.clear();
            thisEcharts.setOption(devicetypecompareOption);
        };
        function failureCallBack(response, opts) {
            ajax.fn.hideMask(mask);
        };
        ajax.fn.executeV2(params, 'GET', conf.serviceUrl + action, successCallBack, failureCallBack);
    }
});