/**
 * Created by lyuwei on 2018/1/18.
 */
Ext.define('yt.view.ytmap.detail.analytics.AnalyticsSBDBController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.analyticssbdb',

    /**
     * Called when the view is created
     */
    init: function() {

    },

    tlxsbdbBoxReady: function(thisExt, width, height, eOpts ){
        var me = this;
        var meView = me.getView();
        var nowDate = new Date('2017-12-7 18:00:00');

        meView.lookupReference('tlxsbdb_startTime').setValue( nowDate );
        meView.lookupReference('tlxsbdb_endTime').setValue( Ext.Date.add( nowDate, Ext.Date.DAY, -1 ) );

        me.tlxsbdbUpdateEcharts();
    },

    tlxsbdbUpdateEcharts: function () {
        var me = this;
        var meView = me.getView();
        var thisEcharts = meView.lookupReference('tlxsbdb').down('echartsbasepanel').getEcharts();
        var param = {};

        var action = "tbmwys/echarts/device";
        param.quakeid = '100000';// todo 暂且使用固定设备 id
        param.begin = meView.lookupReference('tlxsbdb_startTime').getRawValue() + ":00:00";

        var mask = ajax.fn.showMask(meView.lookupReference('tlxsbdb'), '数据加载中...');

        function successCallBack(response, opts) {
            ajax.fn.hideMask(mask);
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
            var devicetypecompareOption = {
                color: [
                    '#60acfc','#32d3eb','#5bc49f','#feb64d','#ff7c7c','#9287e7'
                ],
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
                    data: ['X轴', 'Y轴', 'H轴', '二维', '三维']
                }],
                yAxis: [{
                    type: 'value',
                    // splitArea: {
                    //     show: true
                    // },
                    name: '位移(mm)',
                    min: function(value) {
                        return Math.ceil(value.min - value.min * 0.01);
                    },
                    max: function(value) {
                        return Math.ceil(value.max + value.max * 0.01);
                    }
                }],
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
            thisEcharts.setOption(devicetypecompareOption);
        };
        function failureCallBack(response, opts) {
            ajax.fn.hideMask(mask);
        };
        ajax.fn.executeV2(param, 'GET', conf.serviceUrl + action, successCallBack, failureCallBack);
    },

    dqsbdndbBoxReady: function(thisExt, width, height, eOpts ){
        var me = this;
        var meView = me.getView();
        var nowDate = new Date('2017-12-7 18:00:00');

        meView.lookupReference('dqsbdndb_endTime').setValue( nowDate.getFullYear().toString() );
        meView.lookupReference('dqsbdndb_startTime').setValue( Ext.Date.add( nowDate, Ext.Date.YEAR, -1 ).getFullYear().toString() );

        meView.lookupReference('dqsbdndb_searchType').setValue('X轴位移');

        me.dqsbdndbUpdateEcharts();
    },

    dqsbdndbUpdateEcharts: function () {
        var me = this;
        var meView = me.getView();
        var thisEcharts = meView.lookupReference('dqsbdndb').down('echartsbasepanel').getEcharts();
        var param = {};

        var action = "tbmwys/echarts/year";
        param.deviceid = '7';// todo 暂且使用固定设备 id
        param.begin = meView.lookupReference('dqsbdndb_startTime').getValue();
        param.end = meView.lookupReference('dqsbdndb_endTime').getValue();

        var mask = ajax.fn.showMask(meView.lookupReference('dqsbdndb'), '数据加载中...');

        function successCallBack(response, opts) {
            ajax.fn.hideMask(mask);
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
            var devicetypecompareOption = {
                color: [
                    '#60acfc','#32d3eb','#5bc49f','#feb64d','#ff7c7c','#9287e7'
                ],
                legend: {
                    data: []
                },
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
                calculable: false,
                xAxis: [{
                    type: 'category',
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                }],
                yAxis: [{
                    type: 'value',
                    // splitArea: {
                    //     show: true
                    // },
                    name: '位移(mm)',
                    min: function(value) {
                        return Math.ceil(value.min - value.min * 0.01);
                    },
                    max: function(value) {
                        return Math.ceil(value.max + value.max * 0.01);
                    }
                }],
                series: []
            };

            var type = 'dx';
            switch ( meView.lookupReference('dqsbdndb_searchType').getValue() ){
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
            if (result['data'] != null) {
                Ext.each(result.data,function (item, index, allitems, returnbollean) {
                    legend.push(item.year);
                    var devItem = {
                        name: item.year,
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
                    }
                    series.push(devItem);
                })
            }
            devicetypecompareOption.series = series;
            devicetypecompareOption.legend.data = legend;
            thisEcharts.setOption(devicetypecompareOption);
        };
        function failureCallBack(response, opts) {
            ajax.fn.hideMask(mask);
        };
        ajax.fn.executeV2(param, 'GET', conf.serviceUrl + action, successCallBack, failureCallBack);
    }
});