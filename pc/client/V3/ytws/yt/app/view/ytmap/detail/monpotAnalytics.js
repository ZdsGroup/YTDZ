/**
 * Created by lyuwei on 2018/1/9.
 */
Ext.define('yt.view.ytmap.detail.monpotAnalytics', {
    extend: 'Ext.panel.Panel',

    /*
    Uncomment to give this component an xtype
    xtype: 'monpotanalytics',
    */
    xtype: 'monpot-analytics',

    requires: [
        'Ext.button.Button',
        'Ext.chart.CartesianChart',
        'Ext.chart.axis.Category',
        'Ext.chart.axis.Numeric',
        'Ext.chart.series.Line',
        'Ext.container.Container',
        'Ext.form.field.Checkbox',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Date',
        'Ext.layout.container.Fit',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.tab.Panel',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Separator',
        'yt.view.ytmap.detail.DetailViewModel'
    ],

    layout: 'fit',

    viewModel: {
        type: 'detailViewModel'
    },

    tbar: [
        {
            xtype: 'combo',
            fieldLabel: '设备筛选',
            labelWidth: 65,
            labelAlign: 'right',
            displayField: 'label',
            queryMode: 'local',
            selectOnTab: true,
            store: {
                data: [
                    {label: '位移设备'},
                    {label: '监测设备'},
                    {label: '雨量设备'}
                ]
            }
        },
        {
            xtype: 'combo',
            displayField: 'label',
            queryMode: 'local',
            selectOnTab: true,
            store: {
                data: [
                    {label: '设备1'},
                    {label: '设备2'},
                    {label: '设备3'}
                ]
            }
        },
        // '-',
        // { xtype: 'datefield', fieldLabel: '查询时间',labelAlign: 'right', labelWidth: 65},
        // { xtype: 'datefield', fieldLabel: '至', labelAlign: 'right', labelWidth: 20},
        // { xtype: 'button', text: '搜索'}
    ],

    items: [
        {
            xtype: 'tabpanel',
            ui: 'navigation',
            flex: 1,
            tabBar: {
                layout: {
                    pack: 'left'
                },
                border: false
            },
            defaults: {
                bodyPadding: 5
            },
            items: [
                {
                    title: '设备对比',
                    xtype: 'container',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'panel',
                            title: '同类型设备对比',
                            height: '50%',
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            tbar: [
                                { xtype: 'datefield', fieldLabel: '查询时间',labelAlign: 'right', labelWidth: 65},
                                { xtype: 'datefield', fieldLabel: '至', labelAlign: 'right', labelWidth: 20},
                                { xtype: 'button', text: '搜索'},
                                '-',
                                { xtype: 'checkbox', boxLabel: '对比设备1',inputValue: '对比设备1'},
                                { xtype: 'checkbox', boxLabel: '对比设备2',inputValue: '对比设备2'},
                                { xtype: 'checkbox', boxLabel: '对比设备3',inputValue: '对比设备3'},
                                '->',
                                { xtype: 'button', text: '导出表格' }
                            ],
                            items: [
                                {
                                    xtype: 'chart',
                                    legend: {
                                        type: 'sprite',
                                        docked: 'right'
                                    },
                                    flex: 1,
                                    bind: '{linechartData}',
                                    // insetPadding: '40 10 0 0',
                                    axes: [{
                                        type: 'numeric',
                                        fields: ['data1', 'data2', 'data3', 'data4' ],
                                        position: 'left',
                                        minimum: 0
                                        // renderer: 'onAxisLabelRender'
                                    }, {
                                        type: 'category',
                                        fields: 'month',
                                        position: 'bottom',
                                        label: {
                                            rotate: {
                                                degrees: -45
                                            }
                                        }
                                    }],
                                    series: [{
                                        type: 'line',
                                        title: '设备1',
                                        xField: 'month',
                                        yField: 'data1',
                                        tooltip: {
                                            trackMouse: true
                                            // ,renderer: 'onSeriesTooltipRender'
                                        }
                                    }, {
                                        type: 'line',
                                        title: '设备2',
                                        xField: 'month',
                                        yField: 'data2',
                                        marker: {
                                            type: 'triangle',
                                            fx: {
                                                duration: 200,
                                                easing: 'backOut'
                                            }
                                        },
                                        highlightCfg: {
                                            scaling: 2
                                        },
                                        tooltip: {
                                            trackMouse: true
                                            // ,renderer: 'onSeriesTooltipRender'
                                        }
                                    }, {
                                        type: 'line',
                                        title: '设备3',
                                        xField: 'month',
                                        yField: 'data3',
                                        marker: {
                                            type: 'arrow',
                                            fx: {
                                                duration: 200,
                                                easing: 'backOut'
                                            }
                                        },
                                        highlightCfg: {
                                            scaling: 2
                                        },
                                        tooltip: {
                                            trackMouse: true
                                            // ,renderer: 'onSeriesTooltipRender'
                                        }
                                    }, {
                                        type: 'line',
                                        title: '设备4',
                                        xField: 'month',
                                        yField: 'data4',
                                        marker: {
                                            type: 'cross',
                                            fx: {
                                                duration: 200,
                                                easing: 'backOut'
                                            }
                                        },
                                        highlightCfg: {
                                            scaling: 2
                                        },
                                        tooltip: {
                                            trackMouse: true
                                            // ,renderer: 'onSeriesTooltipRender'
                                        }
                                    }]
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            title: '当前设备多年对比',
                            height: '50%',
                            layout: 'fit',
                            tbar: [
                                { xtype: 'datefield', fieldLabel: '查询时间',labelAlign: 'right', labelWidth: 65},
                                { xtype: 'datefield', fieldLabel: '至', labelAlign: 'right', labelWidth: 20},
                                { xtype: 'button', text: '搜索'},
                                '->',
                                { xtype: 'button', text: '导出表格' }
                            ],
                            items: [
                                {
                                    xtype: 'chart',
                                    legend: {
                                        type: 'sprite',
                                        docked: 'right'
                                    },
                                    bind: '{linechartData}',
                                    // insetPadding: '40 10 0 0',
                                    axes: [{
                                        type: 'numeric',
                                        fields: ['data1', 'data2', 'data3', 'data4' ],
                                        position: 'left',
                                        grid: true,
                                        minimum: 0
                                        // renderer: 'onAxisLabelRender'
                                    }, {
                                        type: 'category',
                                        fields: 'month',
                                        position: 'bottom',
                                        grid: true,
                                        label: {
                                            rotate: {
                                                degrees: -45
                                            }
                                        }
                                    }],
                                    series: [{
                                        type: 'line',
                                        title: '2017',
                                        xField: 'month',
                                        yField: 'data1',
                                        marker: {
                                            type: 'square',
                                            fx: {
                                                duration: 200,
                                                easing: 'backOut'
                                            }
                                        },
                                        highlightCfg: {
                                            scaling: 2
                                        },
                                        tooltip: {
                                            trackMouse: true
                                            // ,renderer: 'onSeriesTooltipRender'
                                        }
                                    }, {
                                        type: 'line',
                                        title: '2016',
                                        xField: 'month',
                                        yField: 'data2',
                                        marker: {
                                            type: 'triangle',
                                            fx: {
                                                duration: 200,
                                                easing: 'backOut'
                                            }
                                        },
                                        highlightCfg: {
                                            scaling: 2
                                        },
                                        tooltip: {
                                            trackMouse: true
                                            // ,renderer: 'onSeriesTooltipRender'
                                        }
                                    }, {
                                        type: 'line',
                                        title: '2015',
                                        xField: 'month',
                                        yField: 'data3',
                                        marker: {
                                            type: 'arrow',
                                            fx: {
                                                duration: 200,
                                                easing: 'backOut'
                                            }
                                        },
                                        highlightCfg: {
                                            scaling: 2
                                        },
                                        tooltip: {
                                            trackMouse: true
                                            // ,renderer: 'onSeriesTooltipRender'
                                        }
                                    }, {
                                        type: 'line',
                                        title: '2014',
                                        xField: 'month',
                                        yField: 'data4',
                                        marker: {
                                            type: 'cross',
                                            fx: {
                                                duration: 200,
                                                easing: 'backOut'
                                            }
                                        },
                                        highlightCfg: {
                                            scaling: 2
                                        },
                                        tooltip: {
                                            trackMouse: true
                                            // ,renderer: 'onSeriesTooltipRender'
                                        }
                                    }]
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    title: '位移变化图',
                    layout: 'fit',
                    tbar: [
                        { xtype: 'datefield', fieldLabel: '查询时间',labelAlign: 'right', labelWidth: 65},
                        { xtype: 'datefield', fieldLabel: '至', labelAlign: 'right', labelWidth: 20},
                        { xtype: 'button', text: '搜索'},
                        '->',
                        { xtype: 'button', text: '导出表格' }
                    ],
                    items: [
                        {
                            xtype: 'chart',
                            legend: {
                                type: 'sprite',
                                docked: 'bottom'
                            },
                            bind: '{linechartData}',
                            // insetPadding: '40 10 0 0',
                            axes: [{
                                type: 'numeric',
                                fields: ['data1', 'data2', 'data3'],
                                position: 'left',
                                grid: true,
                                minimum: 0
                                // renderer: 'onAxisLabelRender'
                            }, {
                                type: 'category',
                                fields: 'month',
                                position: 'bottom',
                                grid: true,
                                label: {
                                    rotate: {
                                        degrees: -45
                                    }
                                }
                            }],
                            series: [{
                                type: 'line',
                                title: 'X走势图',
                                xField: 'month',
                                yField: 'data1',
                                marker: {
                                    type: 'square',
                                    fx: {
                                        duration: 200,
                                        easing: 'backOut'
                                    }
                                },
                                highlightCfg: {
                                    scaling: 2
                                },
                                tooltip: {
                                    trackMouse: true
                                    // ,renderer: 'onSeriesTooltipRender'
                                }
                            }, {
                                type: 'line',
                                title: 'Y走势图',
                                xField: 'month',
                                yField: 'data2',
                                marker: {
                                    type: 'triangle',
                                    fx: {
                                        duration: 200,
                                        easing: 'backOut'
                                    }
                                },
                                highlightCfg: {
                                    scaling: 2
                                },
                                tooltip: {
                                    trackMouse: true
                                    // ,renderer: 'onSeriesTooltipRender'
                                }
                            }, {
                                type: 'line',
                                title: 'H走势图',
                                xField: 'month',
                                yField: 'data3',
                                marker: {
                                    type: 'arrow',
                                    fx: {
                                        duration: 200,
                                        easing: 'backOut'
                                    }
                                },
                                highlightCfg: {
                                    scaling: 2
                                },
                                tooltip: {
                                    trackMouse: true
                                    // ,renderer: 'onSeriesTooltipRender'
                                }
                            }]
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    title: '断面曲线图',
                    layout: 'fit',
                    tbar: [
                        { xtype: 'datefield', fieldLabel: '查询时间',labelAlign: 'right', labelWidth: 65},
                        { xtype: 'datefield', fieldLabel: '至', labelAlign: 'right', labelWidth: 20},
                        { xtype: 'button', text: '搜索'},
                        '->',
                        { xtype: 'button', text: '导出表格' }
                    ],
                    items: [
                        {
                            xtype: 'chart',
                            legend: {
                                type: 'sprite',
                                docked: 'bottom'
                            },
                            bind: '{linechartData}',
                            // insetPadding: '40 10 0 0',
                            axes: [{
                                type: 'numeric',
                                fields: ['data1', 'data2'],
                                position: 'left',
                                grid: true,
                                minimum: 0
                                // renderer: 'onAxisLabelRender'
                            }, {
                                type: 'category',
                                fields: 'month',
                                position: 'bottom',
                                grid: true,
                                label: {
                                    rotate: {
                                        degrees: -45
                                    }
                                }
                            }],
                            series: [{
                                type: 'line',
                                title: '监测设备1',
                                xField: 'month',
                                yField: 'data1',
                                marker: {
                                    type: 'square',
                                    fx: {
                                        duration: 200,
                                        easing: 'backOut'
                                    }
                                },
                                highlightCfg: {
                                    scaling: 2
                                },
                                tooltip: {
                                    trackMouse: true
                                    // ,renderer: 'onSeriesTooltipRender'
                                }
                            }, {
                                type: 'line',
                                title: '监测设备2',
                                xField: 'month',
                                yField: 'data2',
                                marker: {
                                    type: 'triangle',
                                    fx: {
                                        duration: 200,
                                        easing: 'backOut'
                                    }
                                },
                                highlightCfg: {
                                    scaling: 2
                                },
                                tooltip: {
                                    trackMouse: true
                                    // ,renderer: 'onSeriesTooltipRender'
                                }
                            }]
                        }
                    ]
                },
                {
                    title: '速度与加速度图',
                    xtype: 'panel',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    tbar: [
                        { xtype: 'datefield', fieldLabel: '查询时间',labelAlign: 'right', labelWidth: 65},
                        { xtype: 'datefield', fieldLabel: '至', labelAlign: 'right', labelWidth: 20},
                        { xtype: 'button', text: '搜索'},
                        '->',
                        { xtype: 'button', text: '导出表格' }
                    ],
                    items: [
                        {
                            xtype: 'panel',
                            title: '速度图',
                            height: '50%',
                            layout: 'fit',
                            items: [
                                {
                                    xtype: 'chart',
                                    legend: {
                                        type: 'sprite',
                                        docked: 'right'
                                    },
                                    bind: '{linechartData}',
                                    // insetPadding: '40 10 0 0',
                                    axes: [{
                                        type: 'numeric',
                                        fields: ['data1', 'data2', 'data3'],
                                        position: 'left',
                                        grid: true,
                                        minimum: 0
                                        // renderer: 'onAxisLabelRender'
                                    }, {
                                        type: 'category',
                                        fields: 'month',
                                        position: 'bottom',
                                        grid: true,
                                        label: {
                                            rotate: {
                                                degrees: -45
                                            }
                                        }
                                    }],
                                    series: [{
                                        type: 'line',
                                        title: 'X轴速度',
                                        xField: 'month',
                                        yField: 'data1',
                                        marker: {
                                            type: 'square',
                                            fx: {
                                                duration: 200,
                                                easing: 'backOut'
                                            }
                                        },
                                        highlightCfg: {
                                            scaling: 2
                                        },
                                        tooltip: {
                                            trackMouse: true
                                            // ,renderer: 'onSeriesTooltipRender'
                                        }
                                    }, {
                                        type: 'line',
                                        title: 'Y轴速度',
                                        xField: 'month',
                                        yField: 'data2',
                                        marker: {
                                            type: 'triangle',
                                            fx: {
                                                duration: 200,
                                                easing: 'backOut'
                                            }
                                        },
                                        highlightCfg: {
                                            scaling: 2
                                        },
                                        tooltip: {
                                            trackMouse: true
                                            // ,renderer: 'onSeriesTooltipRender'
                                        }
                                    }, {
                                        type: 'line',
                                        title: 'H轴速度',
                                        xField: 'month',
                                        yField: 'data3',
                                        marker: {
                                            type: 'arrow',
                                            fx: {
                                                duration: 200,
                                                easing: 'backOut'
                                            }
                                        },
                                        highlightCfg: {
                                            scaling: 2
                                        },
                                        tooltip: {
                                            trackMouse: true
                                            // ,renderer: 'onSeriesTooltipRender'
                                        }
                                    }]
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            title: '加速度图',
                            height: '50%',
                            layout: 'fit',
                            items: [
                                {
                                    xtype: 'chart',
                                    legend: {
                                        type: 'sprite',
                                        docked: 'right'
                                    },
                                    bind: '{linechartData}',
                                    // insetPadding: '40 10 0 0',
                                    axes: [{
                                        type: 'numeric',
                                        fields: ['data1', 'data2', 'data3'],
                                        position: 'left',
                                        grid: true,
                                        minimum: 0
                                        // renderer: 'onAxisLabelRender'
                                    }, {
                                        type: 'category',
                                        fields: 'month',
                                        position: 'bottom',
                                        grid: true,
                                        label: {
                                            rotate: {
                                                degrees: -45
                                            }
                                        }
                                    }],
                                    series: [{
                                        type: 'line',
                                        title: 'X轴加速度',
                                        xField: 'month',
                                        yField: 'data1',
                                        marker: {
                                            type: 'square',
                                            fx: {
                                                duration: 200,
                                                easing: 'backOut'
                                            }
                                        },
                                        highlightCfg: {
                                            scaling: 2
                                        },
                                        tooltip: {
                                            trackMouse: true
                                            // ,renderer: 'onSeriesTooltipRender'
                                        }
                                    }, {
                                        type: 'line',
                                        title: 'Y轴加速度',
                                        xField: 'month',
                                        yField: 'data2',
                                        marker: {
                                            type: 'triangle',
                                            fx: {
                                                duration: 200,
                                                easing: 'backOut'
                                            }
                                        },
                                        highlightCfg: {
                                            scaling: 2
                                        },
                                        tooltip: {
                                            trackMouse: true
                                            // ,renderer: 'onSeriesTooltipRender'
                                        }
                                    }, {
                                        type: 'line',
                                        title: 'H轴加速度',
                                        xField: 'month',
                                        yField: 'data3',
                                        marker: {
                                            type: 'arrow',
                                            fx: {
                                                duration: 200,
                                                easing: 'backOut'
                                            }
                                        },
                                        highlightCfg: {
                                            scaling: 2
                                        },
                                        tooltip: {
                                            trackMouse: true
                                            // ,renderer: 'onSeriesTooltipRender'
                                        }
                                    }]
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '散点与平面矢量图',
                    html: '散点与平面矢量图'
                },
                {
                    xtype: 'panel',
                    title: '雨量折线图',
                    layout: 'fit',
                    tbar: [
                        { xtype: 'datefield', fieldLabel: '查询时间',labelAlign: 'right', labelWidth: 65},
                        { xtype: 'datefield', fieldLabel: '至', labelAlign: 'right', labelWidth: 20},
                        { xtype: 'button', text: '搜索'},
                        '->',
                        { xtype: 'button', text: '导出表格' }
                    ],
                    items: [
                        {
                            xtype: 'chart',
                            legend: {
                                type: 'sprite',
                                docked: 'bottom'
                            },
                            bind: '{linechartData}',
                            // insetPadding: '40 10 0 0',
                            axes: [{
                                type: 'numeric',
                                fields: ['data1', 'data2', 'data3'],
                                position: 'left',
                                grid: true,
                                minimum: 0
                                // renderer: 'onAxisLabelRender'
                            }, {
                                type: 'category',
                                fields: 'month',
                                position: 'bottom',
                                grid: true,
                                label: {
                                    rotate: {
                                        degrees: -45
                                    }
                                }
                            }],
                            series: [{
                                type: 'line',
                                title: '红色警戒',
                                xField: 'month',
                                yField: 'data1',
                                marker: {
                                    type: 'square',
                                    fx: {
                                        duration: 200,
                                        easing: 'backOut'
                                    }
                                },
                                highlightCfg: {
                                    scaling: 2
                                },
                                tooltip: {
                                    trackMouse: true
                                    // ,renderer: 'onSeriesTooltipRender'
                                }
                            }, {
                                type: 'line',
                                title: '蓝色警戒',
                                xField: 'month',
                                yField: 'data2',
                                marker: {
                                    type: 'triangle',
                                    fx: {
                                        duration: 200,
                                        easing: 'backOut'
                                    }
                                },
                                highlightCfg: {
                                    scaling: 2
                                },
                                tooltip: {
                                    trackMouse: true
                                    // ,renderer: 'onSeriesTooltipRender'
                                }
                            }, {
                                type: 'line',
                                title: '黄色警戒',
                                xField: 'month',
                                yField: 'data3',
                                marker: {
                                    type: 'arrow',
                                    fx: {
                                        duration: 200,
                                        easing: 'backOut'
                                    }
                                },
                                highlightCfg: {
                                    scaling: 2
                                },
                                tooltip: {
                                    trackMouse: true
                                    // ,renderer: 'onSeriesTooltipRender'
                                }
                            }]
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    title: '变化过程线',
                    layout: 'fit',
                    tbar: [
                        { xtype: 'datefield', fieldLabel: '查询时间',labelAlign: 'right', labelWidth: 65},
                        { xtype: 'datefield', fieldLabel: '至', labelAlign: 'right', labelWidth: 20},
                        { xtype: 'button', text: '搜索'},
                        '->',
                        { xtype: 'button', text: '导出表格' }
                    ],
                    items: [
                        {
                            xtype: 'chart',
                            legend: {
                                type: 'sprite',
                                docked: 'bottom'
                            },
                            bind: '{linechartData}',
                            // insetPadding: '40 10 0 0',
                            axes: [{
                                type: 'numeric',
                                fields: ['data1', 'data2'],
                                position: 'left',
                                grid: true,
                                minimum: 0
                                // renderer: 'onAxisLabelRender'
                            }, {
                                type: 'category',
                                fields: 'month',
                                position: 'bottom',
                                grid: true,
                                label: {
                                    rotate: {
                                        degrees: -45
                                    }
                                }
                            }],
                            series: [{
                                type: 'line',
                                title: '监测数据1',
                                xField: 'month',
                                yField: 'data1',
                                marker: {
                                    type: 'square',
                                    fx: {
                                        duration: 200,
                                        easing: 'backOut'
                                    }
                                },
                                highlightCfg: {
                                    scaling: 2
                                },
                                tooltip: {
                                    trackMouse: true
                                    // ,renderer: 'onSeriesTooltipRender'
                                }
                            }, {
                                type: 'line',
                                title: '监测数据2',
                                xField: 'month',
                                yField: 'data2',
                                marker: {
                                    type: 'triangle',
                                    fx: {
                                        duration: 200,
                                        easing: 'backOut'
                                    }
                                },
                                highlightCfg: {
                                    scaling: 2
                                },
                                tooltip: {
                                    trackMouse: true
                                    // ,renderer: 'onSeriesTooltipRender'
                                }
                            }]
                        }
                    ]
                }
            ]
        }
    ]
});