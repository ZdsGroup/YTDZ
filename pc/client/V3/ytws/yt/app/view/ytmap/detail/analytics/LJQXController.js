Ext.define('yt.view.ytmap.detail.analytics.LJQXController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.analyticsLJQX',

    config: {
        /*
            Uncomment to add references to view components
            refs: [{
                ref: 'list',
                selector: 'grid'
            }],
        */
        /*
            Uncomment to listen for events from view components
            control: {
                    'useredit button[action=save]': {
                    click: 'updateUser'
                }
            }
        */
    },
    /**
     * Called when the view is created
     */
    init: function () { },

    ljqxBoxReady: function (thisExt, width, height, eOpts) {
        var me = this;
        var meView = me.getView();

        // var nowDate = new Date('2017-9-8 8:00:00');
        var nowDate = new Date();
        meView.lookupReference('ljqx_startTime').setValue(Ext.Date.add(nowDate, Ext.Date.DAY, -1));
        meView.lookupReference('ljqx_endTime').setValue(nowDate);

        me.ljqxUpdateEcharts();
    },

    ljqxUpdateEcharts: function () {
        var me = this;
        var meView = me.getView();
        var thisEcharts = meView.down('echartsbasepanel').getEcharts();
        var params = {};
        params.deviceid = meView.deviceCode;
        // 开始时间
        params.begin = meView.lookupReference('ljqx_startTime').getRawValue() + ":00:00";
        // 结束时间
        params.end = meView.lookupReference('ljqx_endTime').getRawValue() + ":59:59";

        var action = '';
        switch (meView.deviceType) {
            case 'wysb':
                action = 'tbmwys/echarts/hour';
                break;
            case 'ylsb':
                action = 'rains/echarts/hour';
                break;
            case 'lfsb':
                action = 'crevices/echarts/hour';
                break;
        }

        var mask = ajax.fn.showMask(meView, '数据加载中...');

        // 接口返回参数
        function ljqx_successCallBack(response, opts) {
            ajax.fn.hideMask(mask);
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
            if (result['code'] !== 0) return;// 返回结果 code 为 0 正常，否则不正常

            var devicetypecompareOption = {};

            switch (meView.deviceType) {
                case 'wysb':// 位移设备
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
                            left: 20,
                            right: 70,
                            containLabel: true
                        },
                        legend: {
                            data: ['X轴累计位移', 'Y轴累计位移', 'H轴累计位移', '二维累计位移长度', '三维累计位移长度']
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
                            min: function (value) {
                                return Math.floor(value.min - Math.abs(value.min) * 0.01);
                            },
                            max: function (value) {
                                return Math.ceil(value.max + Math.abs(value.max) * 0.01);
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
                    var xAxisData = [];
                    var dxs = [];
                    var dys = [];
                    var dhs = [];
                    var d2s = [];
                    var d3s = [];
                    var dxseries = {
                        name: 'X轴累计位移',
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
                        name: 'Y轴累计位移',
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
                        name: 'H轴累计位移',
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
                        name: '二维累计位移长度',
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
                        name: '三维累计位移长度',
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
                    Ext.each(result.data.tbmwyList, function (item, index) {
                        dxs.push(item.sx);
                        dys.push(item.sy);
                        dhs.push(item.sh);
                        d2s.push(item.s2);
                        d3s.push(item.s3);
                        xAxisData.push(item.datekey);
                    });
                    dxseries.data = dxs;
                    dyseries.data = dys;
                    dhseries.data = dhs;
                    d2series.data = d2s;
                    d3series.data = d3s;
                    devicetypecompareOption.series = series;
                    devicetypecompareOption.xAxis[0].data = xAxisData;
                    break;
                case 'ylsb':// 雨量设备
                    devicetypecompareOption = {
                        color: [
                            '#387FFF'
                        ],
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        grid: {
                            top: 50,
                            bottom: 60,
                            left: 20,
                            right: 70,
                            containLabel: true
                        },
                        legend: {
                            data: ['累计雨量']
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
                            name: '雨量(ml)',
                            min: function (value) {
                                return Math.floor(value.min - Math.abs(value.min) * 0.01);
                            },
                            max: function (value) {
                                return Math.ceil(value.max + Math.abs(value.max) * 0.01);
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
                        series: [
                            {
                                name: '累计雨量',
                                type: 'line',
                                data: [],
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true
                                        }
                                    }
                                }
                            }

                        ]
                    };
                    var xAxisData = [];
                    var totalDatas = [];
                    Ext.each(result.data.rainList, function (item, index) {
                        xAxisData.push(item.datekey);
                        totalDatas.push(item.s1);
                    });
                    devicetypecompareOption.series[0].data = totalDatas;
                    devicetypecompareOption.xAxis[0].data = xAxisData;
                    break;
                case 'lfsb':// 裂缝设备
                    devicetypecompareOption = {
                        color: [
                            '#387FFF'
                        ],
                        backgroundColor: "#ffffff",
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        grid: {
                            top: 50,
                            bottom: 60,
                            left: 20,
                            right: 70,
                            containLabel: true
                        },
                        legend: {
                            data: ['裂缝累计曲线']
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
                            min: function (value) {
                                return Math.floor(value.min - Math.abs(value.min) * 0.01);
                            },
                            max: function (value) {
                                return Math.ceil(value.max + Math.abs(value.max) * 0.01);
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
                        series: [{
                            name: '裂缝累计曲线',
                            type: 'line',
                            data: [],
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true
                                    }
                                }
                            }
                        }]
                    };
                    var xAxisData = [];
                    var datas = [];
                    Ext.each(result.data.creviceList, function (item, index) {
                        xAxisData.push(item.datekey);
                        datas.push(item.s1);
                    });
                    devicetypecompareOption.series[0].data = datas;
                    devicetypecompareOption.xAxis[0].data = xAxisData;
                    break;

            }

            thisEcharts.setOption(devicetypecompareOption);
        }
        function ljqx_failureCallBack(response, opts) {
            ajax.fn.hideMask(mask);
        }
        ajax.fn.executeV2(params, 'GET', conf.serviceUrl + action, ljqx_successCallBack, ljqx_failureCallBack);

    }
});