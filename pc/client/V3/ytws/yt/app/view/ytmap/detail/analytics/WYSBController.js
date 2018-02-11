/**
 * Created by lyuwei on 2018/1/18.
 */
Ext.define('yt.view.ytmap.detail.analytics.WYSBController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.analyticswysb',

    requires: [
        'Ext.chart.series.Bar',
        'Ext.chart.series.Scatter',
        'Ext.util.TaskManager'
    ],

    /**
     * Called when the view is created
     */
    init: function() {

    },

    baseboxreadyFunc: function () {
        var me = this;
        var meView = me.getView();

        var nowDate = new Date('2017-12-8 20:00:00');
        meView.lookupReference('startTime').setValue( Ext.Date.add( nowDate, Ext.Date.DAY, -1 ) );
        meView.lookupReference('endTime').setValue( nowDate );
    },

    // 位移变化图
    wybhtReady: function (thisExt, width, height, eOpts) {
        var me = this;
        me.baseboxreadyFunc();
        me.wybhtUpdateEcharts();
    },
    wybhtUpdateEcharts: function () {
        var me = this;
        var meView = me.getView();
        var thisEcharts = meView.down('echartsbasepanel').getEcharts();
        var param = {};

        var action = "tbmwys/echarts/hour";
        param.deviceid = meView.deviceCode;
        param.begin = meView.lookupReference('startTime').getRawValue() + ":00:00";
        param.end = meView.lookupReference('endTime').getRawValue() + ":59:59";

        var mask = ajax.fn.showMask( meView, '数据加载中...');
        function successCallBack(response, opts) {
            ajax.fn.hideMask(mask);
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
            if (result['code'] !== 0) return;// 返回结果 code 为 0 正常，否则不正常
            var devicetypecompareOption = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    top: 50,
                    bottom: 10,
                    left: 20,
                    right: 20,
                    containLabel: true
                },
                legend: {
                    data: ['X轴位移', 'Y轴位移', 'H轴位移', '二维位移长度', '三维位移长度']
                },
                calculable: false,
                xAxis: [{
                    type: 'category',
                    data: []
                }],
                yAxis: [{
                    type: 'value',
                    // splitArea: {
                    //     show: true
                    // },
                    name: '长度(mm)',
                }],
                series: []
            }

            var xAxisData = [];
            var dxs = [];
            var dys = [];
            var dhs = [];
            var d2s = [];
            var d3s = [];
            var dxseries = {
                name: 'X轴位移',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        }
                    }
                }
            }
            var dyseries = {
                name: 'Y轴位移',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        }
                    }
                }
            }
            var dhseries = {
                name: 'H轴位移',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        }
                    }
                }
            }
            var d2series = {
                name: '二维位移长度',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        }
                    }
                }
            }
            var d3series = {
                name: '三维位移长度',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        }
                    }
                }
            }
            var series = [];
            series.push(dxseries);
            series.push(dyseries);
            series.push(dhseries);
            series.push(d2series);
            series.push(d3series);
            Ext.each(result.data.tbmwyList, function(item, index) {
                dxs.push(item.dx);
                dys.push(item.dy);
                dhs.push(item.dh);
                d2s.push(item.d2);
                d3s.push(item.d3);
                xAxisData.push(item.datekey);
            });
            dxseries.data = dxs;
            dyseries.data = dys;
            dhseries.data = dhs;
            d2series.data = d2s;
            d3series.data = d3s;
            devicetypecompareOption.series = series;
            devicetypecompareOption.xAxis[0].data = xAxisData;
            thisEcharts.setOption(devicetypecompareOption);
        }
        function failureCallBack(response, opts) {
            ajax.fn.hideMask(mask);
        }
        ajax.fn.executeV2(param, 'GET', conf.serviceUrl + action, successCallBack, failureCallBack);
    },

    // 断面曲线图
    dmqxtReady: function (thisExt, width, height, eOpts) {
        var me = this;
        me.baseboxreadyFunc();
        me.getView().lookupReference('searchType').setValue('X轴位移');
        me.dmqxtUpdateEcharts();
    },
    dmqxtUpdateEcharts: function () {
        var me = this;
        var meView = me.getView();
        var thisEcharts = meView.down('echartsbasepanel').getEcharts();
        var param = {};

        var action = "tbmwys/echarts/dmqx";
        param.quakeid = meView.quakeCode;
        param.begin = meView.lookupReference('startTime').getRawValue() + ":00:00";
        param.end = meView.lookupReference('endTime').getRawValue() + ":59:59";

        var mask = ajax.fn.showMask( meView, '数据加载中...');
        function successCallBack(response, opts) {
            ajax.fn.hideMask(mask);
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
            if (result['code'] !== 0) return;// 返回结果 code 为 0 正常，否则不正常
            var devicetypecompareOption = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    top: 50,
                    bottom: 10,
                    left: 10,
                    right: 10,
                    containLabel: true
                },
                legend: {
                    data: []
                },
                calculable: false,
                xAxis: [{
                    type: 'category',
                }],
                yAxis: [{
                    type: 'value',
                    // splitArea: {
                    //     show: true
                    // },
                    name: '位移(mm)'
                }],
                series: []
            };
            var type = 'dx';
            switch ( meView.lookupReference('searchType').getValue() ){
                case 'X轴位移':
                    type = 'dx';
                    break;
                case 'Y轴位移':
                    type = 'dy';
                    break;
                case 'H轴位移':
                    type = 'dh';
                    break;
                case '二维位移长度':
                    type = 'd2';
                    break;
                case '三维位移长度':
                    type = 'd3';
                    break;
            }
            var series = [];
            var legend = [];
            Ext.each(result.data.dataList, function(item, index) {
                legend.push(item.devicename);
                var devItem = {
                    name: item.devicename,
                    type: 'line',
                    data: item[type],
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
            thisEcharts.setOption(devicetypecompareOption);
        }
        function failureCallBack(response, opts) {
            ajax.fn.hideMask(mask);
        }
        ajax.fn.executeV2(param, 'GET', conf.serviceUrl + action, successCallBack, failureCallBack);
    },

    // 加速度图
    jsdtBoxReady: function (thisExt, width, height, eOpts) {
        var me = this;
        var meView = me.getView();
        me.baseboxreadyFunc();
        me.jsdtUpdateEcharts();
    },
    jsdtUpdateEcharts: function () {
        var me = this;
        var meView = me.getView();
        var thisEcharts = meView.down('echartsbasepanel').getEcharts();

        var param = {};
        var action = "tbmwys/echarts/hour";
        param.deviceid = meView.deviceCode;
        param.begin = meView.lookupReference('startTime').getRawValue() + ":00:00";
        param.end = meView.lookupReference('endTime').getRawValue() + ":59:59";
        var mask = ajax.fn.showMask( meView, '数据加载中...');
        function successCallBack(response, opts) {
            ajax.fn.hideMask(mask);
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
            if (result['code'] !== 0) return;// 返回结果 code 为 0 正常，否则不正常
            // 速度部分
            var devicetypecompareOption = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    top: 50,
                    bottom: 10,
                    left: 20,
                    right: 20,
                    containLabel: true
                },
                legend: {
                    data: ['X轴速度', 'Y轴速度', 'H轴速度']
                },
                calculable: false,
                xAxis: [{
                    type: 'category',
                    data: []
                }],
                yAxis: [{
                    type: 'value',
                    // splitArea: {
                    //     show: true
                    // },
                    name: '长度(mm)',
                }],
                series: []
            }

            var xAxisData = [];
            var dxs = [];
            var dys = [];
            var dhs = [];
            var dxseries = {
                name: 'X轴速度',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        }
                    }
                }
            }
            var dyseries = {
                name: 'Y轴速度',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        }
                    }
                }
            }
            var dhseries = {
                name: 'H轴速度',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        }
                    }
                }
            }
            var series = [];
            series.push(dxseries);
            series.push(dyseries);
            series.push(dhseries);
            Ext.each(result.data.tbmwyList, function(item, index) {
                dxs.push(item.xs);
                dys.push(item.ys);
                dhs.push(item.hs);
                xAxisData.push(item.datekey);
            });
            dxseries.data = dxs;
            dyseries.data = dys;
            dhseries.data = dhs;
            devicetypecompareOption.series = series;
            devicetypecompareOption.xAxis[0].data = xAxisData;
            thisEcharts.setOption(devicetypecompareOption);
        }
        function failureCallBack(response, opts) {
            ajax.fn.hideMask(mask);
        }
        ajax.fn.executeV2(param, 'GET', conf.serviceUrl + action, successCallBack, failureCallBack);
    },

    // 速度图
    sdtBoxReady: function (thisExt, width, height, eOpts) {
        var me = this;
        var meView = me.getView();
        me.baseboxreadyFunc();
        me.sdtUpdateEcharts();
    },
    sdtUpdateEcharts: function () {
        var me = this;
        var meView = me.getView();
        var thisEcharts = meView.down('echartsbasepanel').getEcharts();
        var param = {};

        var action = "tbmwys/echarts/hour";
        param.deviceid = meView.deviceCode;
        param.begin = meView.lookupReference('startTime').getRawValue() + ":00:00";
        param.end = meView.lookupReference('endTime').getRawValue() + ":59:59";

        var mask = ajax.fn.showMask( meView, '数据加载中...');
        function successCallBack(response, opts) {
            ajax.fn.hideMask(mask);
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
            if (result['code'] !== 0) return;// 返回结果 code 为 0 正常，否则不正常
            // 加速度开始
            var gdevicetypecompareOption = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    top: 50,
                    bottom: 10,
                    left: 20,
                    right: 20,
                    containLabel: true
                },
                legend: {
                    data: ['X轴加速度', 'Y轴加速度', 'H轴加速度']
                },
                calculable: false,
                xAxis: [{
                    type: 'category',
                    data: []
                }],
                yAxis: [{
                    type: 'value',
                    // splitArea: {
                    //     show: true
                    // },
                    name: '位移(mm)',
                }],
                series: []
            }
            var gxAxisData = [];
            var gdxs = [];
            var gdys = [];
            var gdhs = [];
            var gdxseries = {
                name: 'X轴加速度',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        }
                    }
                }
            }
            var gdyseries = {
                name: 'Y轴加速度',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        }
                    }
                }
            }
            var gdhseries = {
                name: 'H轴加速度',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        }
                    }
                }
            }
            var gseries = [];
            gseries.push(gdxseries);
            gseries.push(gdyseries);
            gseries.push(gdhseries);
            Ext.each(result.data.tbmwyList, function(item, index) {
                gdxs.push(item.xxs);
                gdys.push(item.yys);
                gdhs.push(item.hhs);
                gxAxisData.push(item.datekey);
            });
            gdxseries.data = gdxs;
            gdyseries.data = gdys;
            gdhseries.data = gdhs;
            gdevicetypecompareOption.series = gseries;
            gdevicetypecompareOption.xAxis[0].data = gxAxisData;
            thisEcharts.setOption(gdevicetypecompareOption);
        }
        function failureCallBack(response, opts) {
            ajax.fn.hideMask(mask);
        }
        ajax.fn.executeV2(param, 'GET', conf.serviceUrl + action, successCallBack, failureCallBack);
    },

    sdypmsltReady: function (thisExt, width, height, eOpts) {
        var me = this;
        me.baseboxreadyFunc();
        me.sdypmsltUpdateEcharts();
    },
    sdypmsltUpdateEcharts: function () {
        var me = this;
        var meView = me.getView();
        var thisEcharts = meView.down('echartsbasepanel').getEcharts();
        var param = {};

        if(meView.playTask){
            Ext.TaskManager.stop( meView.playTask );
            meView.lookupReference('playbtn').setDisabled(false);
        }

        var action = "tbmwys/echarts/hour";
        param.deviceid = meView.deviceCode;
        param.begin = meView.lookupReference('startTime').getRawValue() + ":00:00";
        param.end = meView.lookupReference('endTime').getRawValue() + ":59:59";

        var mask = ajax.fn.showMask( meView, '数据加载中...');
        function successCallBack(response, opts) {
            ajax.fn.hideMask(mask);
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
            if (result['code'] !== 0) return;// 返回结果 code 为 0 正常，否则不正常

            var historyPoint = result.data.vectors;
            var startPoint = [ historyPoint.shift() ];
            var endPoint = [ historyPoint.pop() ];

            var devicetypecompareOption = {
                color: [
                    '#6DC576', '#8DA8C9', '#E37072'
                ],
                legend: {
                    y: 'top',
                    data: ['起始点', '历史点', '结束点']
                },
                tooltip: {
                    trigger: 'none',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                grid: {
                    top: 60,
                    bottom: 10,
                    left: 20,
                    right: 40,
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    name: 'Y(mm)',
                    nameRotate: 270,
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    name: 'X(mm)',
                    splitLine: {
                        show: false
                    }
                },
                series: [
                    {
                        name: '起始点',
                        type: 'scatter',
                        data: startPoint
                    },
                    {
                        name: '历史点',
                        type: 'scatter',
                        data: historyPoint
                    },
                    {
                        name: '结束点',
                        type: 'scatter',
                        data: endPoint
                    }
                ]
            }
            // 没有过程连线之前的 echarts option
            meView.preNoLinkOption = devicetypecompareOption;
            meView.preLinkArr = Ext.Array.union( startPoint, historyPoint );
            meView.preLinkArr = Ext.Array.union( meView.preLinkArr, endPoint );

            thisEcharts.clear();
            thisEcharts.setOption(devicetypecompareOption);
        }
        function failureCallBack(response, opts) {
            ajax.fn.hideMask(mask);
        }
        ajax.fn.executeV2(param, 'GET', conf.serviceUrl + action, successCallBack, failureCallBack);
    },
    playLink: function () {
        var me = this;
        var meView = me.getView();

        var links = meView.preLinkArr.map(function(item, i) {
            return {
                source: i,
                target: i + 1
            };
        });

        var taskIndex = 0;
        var playTask = {
            run: function () {
                if(taskIndex >= links.length){
                    Ext.TaskManager.stop( meView.playTask );
                    meView.lookupReference('playbtn').setDisabled(false);
                }

                var newOption = Ext.clone( meView.preNoLinkOption );
                newOption.series.push({
                    type: 'graph',
                    layout: 'none',
                    coordinateSystem: 'cartesian2d',
                    symbolSize: 0,
                    label: {
                        normal: {
                            show: true
                        }
                    },
                    edgeSymbol: ['circle', 'arrow'],
                    edgeSymbolSize: [2, 8],
                    data: Ext.Array.slice( meView.preLinkArr, 0, taskIndex),
                    links: Ext.Array.slice( links, 0, taskIndex),
                    lineStyle: {
                        normal: {
                            color: '#8DA8C9'
                        }
                    }
                })
                meView.down('echartsbasepanel').getEcharts().setOption( newOption );
                taskIndex++;
            },
            interval: 400
        }
        meView.playTask = playTask;
        meView.lookupReference('playbtn').setDisabled(true);
        Ext.TaskManager.start( meView.playTask );
    },

    // 平面矢量图
    // 平面矢量图
    pmsltBoxReady: function (thisExt, width, height, eOpts) {
        var me = this;
        me.baseboxreadyFunc();
        me.pmsltUpdateEcharts();
    },
    pmsltUpdateEcharts: function () {
        var me = this;
        var meView = me.getView();
        var thisEcharts = meView.down('echartsbasepanel').getEcharts();

        var param = {};
        var action = "tbmwys/echarts/hour";
        param.deviceid = meView.deviceCode;
        param.begin = meView.lookupReference('startTime').getRawValue() + ":00:00";
        param.end = meView.lookupReference('endTime').getRawValue() + ":59:59";

        var mask = ajax.fn.showMask( meView, '数据加载中...');
        function successCallBack(response, opts) {
            ajax.fn.hideMask(mask);
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
            if (result['code'] !== 0) return;// 返回结果 code 为 0 正常，否则不正常

            var vectors = result.data.points;
            var startPoint = [ vectors[0] ];
            var endPoint = [ vectors[vectors.length - 1] ];
            var historyPoint = vectors;
            var links = historyPoint.map(function(item, i) {
                return {
                    source: i,
                    target: i + 1
                };
            });
            links.pop();

            var devicetypecompareOption = {
                color: [
                    '#8DA8C9', '#8DA8C9', '#6DC576', '#E37072'
                ],
                legend: {
                    y: 'top',
                    data: ['起始点', '历史点', '结束点']
                },
                tooltip: {
                    trigger: 'none',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                grid: {
                    top: 60,
                    bottom: 10,
                    left: 20,
                    right: 40,
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    name: '坐标Y(mm)',
                    nameRotate: 270,
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    name: '坐标X(mm)',
                    splitLine: {
                        show: false
                    }
                },
                series: [{
                    name: '历史点',
                    type: 'scatter',
                    data: historyPoint
                },
                    {
                        type: 'graph',
                        layout: 'none',
                        coordinateSystem: 'cartesian2d',
                        symbolSize: 0,
                        label: {
                            normal: {
                                show: true
                            }
                        },
                        edgeSymbol: ['circle', 'arrow'],
                        edgeSymbolSize: [2, 8],
                        data: historyPoint,
                        links: links,
                        lineStyle: {
                            normal: {
                                color: '#8DA8C9'
                            }
                        }
                    },
                    {
                        name: '起始点',
                        type: 'scatter',
                        data: startPoint
                    },
                    {
                        name: '结束点',
                        type: 'scatter',
                        data: endPoint
                    }
                ]
            }

            thisEcharts.clear();
            thisEcharts.setOption(devicetypecompareOption);
        }
        function failureCallBack(response, opts) {
            ajax.fn.hideMask(mask);
        }
        ajax.fn.executeV2(param, 'GET', conf.serviceUrl + action, successCallBack, failureCallBack);
    }
});