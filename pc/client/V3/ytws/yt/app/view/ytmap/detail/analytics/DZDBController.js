/**
 * Created by lyuwei on 2018/1/28.
 */
Ext.define('yt.view.ytmap.detail.analytics.DZDBController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.analyticsdzdb',

    /**
     * Called when the view is created
     */
    init: function() {

    },

    dzdbBoxReady: function () {
        var me = this;
        var meView = me.getView();
        // var nowDate = new Date('2017-12-7 18:00:00');
        var nowDate = new Date();

        meView.lookupReference('endTime').setValue( nowDate.getFullYear().toString() );
        meView.lookupReference('startTime').setValue( Ext.Date.add( nowDate, Ext.Date.YEAR, -1 ).getFullYear().toString() );

        switch(meView.deviceType){
            case 'wysb':
                // 位移设备单站对比有对比指标
                meView.lookupReference('searchType').setHidden(false);
                meView.lookupReference('searchType').setValue('X轴位移');
                break;
            case 'ylsb':
                meView.lookupReference('searchType').setHidden(true);
                break;
            case 'lfsb':
                meView.lookupReference('searchType').setHidden(true);
                break;
        }

        me.dzdbUpdateEcharts();
    },

    dzdbUpdateEcharts: function () {
        var me = this;
        var meView = me.getView();
        var thisEcharts = meView.down('echartsbasepanel').getEcharts();

        var action = '';
        switch(meView.deviceType){
            case 'wysb':
                action = 'tbmwys/echarts/year';
                break;
            case 'ylsb':
                action = 'rains/echarts/year';
                break;
            case 'lfsb':
                action = 'crevices/echarts/year';
                break;
        }

        var params = {};
        params.deviceid = meView.deviceCode;// todo 暂且使用固定设备 id
        params.begin = meView.lookupReference('startTime').getValue();
        params.end = meView.lookupReference('endTime').getValue();

        var mask = ajax.fn.showMask(meView, '数据加载中...');

        function successCallBack(response, opts) {
            ajax.fn.hideMask(mask);
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);

            var devicetypecompareOption = {};

            switch(meView.deviceType){
                case 'wysb':
                    devicetypecompareOption = {
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
                    break;
                case 'ylsb':
                    devicetypecompareOption = {
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
                            splitArea: {
                                show: true
                            },
                            name: '雨量(mm)',
                            min: function(value) {
                                return Math.ceil(value.min - value.min * 0.01);
                            },
                            max: function(value) {
                                return Math.ceil(value.max + value.max * 0.01);
                            }
                        }],
                        series: []
                    }
                    var series = [];
                    var legend = [];
                    Ext.each(result.data, function(item, index) {
                        legend.push(item.year);
                        var devItem = {
                            name: item.year,
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
                        }
                        series.push(devItem);
                    });
                    devicetypecompareOption.series = series;
                    devicetypecompareOption.legend.data = legend;
                    break;
                case 'lfsb':
                    devicetypecompareOption = {
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
                            splitArea: {
                                show: true
                            },
                            name: '长度(mm)',
                            min: function(value) {
                                return Math.ceil(value.min - value.min * 0.01);
                            },
                            max: function(value) {
                                return Math.ceil(value.max + value.max * 0.01);
                            }
                        }],
                        series: []
                    }
                    var series = [];
                    var legend = [];
                    Ext.each(result.data, function(item, index) {
                        legend.push(item.year);
                        var devItem = {
                            name: item.year,
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
                        }
                        series.push(devItem);
                    });
                    devicetypecompareOption.series = series;
                    devicetypecompareOption.legend.data = legend;
                    break;
            }

            thisEcharts.clear();
            thisEcharts.setOption(devicetypecompareOption);
        }
        function failureCallBack(response, opts) {
            ajax.fn.hideMask(mask);
        }

        ajax.fn.executeV2(params, 'GET', conf.serviceUrl + action, successCallBack, failureCallBack);
    }
});