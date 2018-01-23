/**
 * Created by LBM on 2017/12/30.
 */
Ext.define('yt.view.monpot.MonPot', {
    extend: 'Ext.Container',

    requires: [
        'Ext.button.Button',
        'Ext.chart.series.Bar',
        'Ext.container.Container',
        'Ext.grid.Panel',
        'Ext.grid.column.Action',
        'Ext.layout.container.Fit',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.toolbar.Fill',
        'Ext.tree.Column',
        'yt.view.monpot.MonPotController',
        'yt.view.monpot.MonPotModel',
        'yt.view.ytmap.detail.analytics.EchartsBasePanel'
    ],

    /*
    Uncomment to give this component an xtype*/
    xtype: 'yt-monpot',


    viewModel: {
        type: 'monpot'
    },

    controller: 'monpot',

    layout: {
        type: 'hbox',
        pack: 'start',
        align: 'stretch'
    },
    border: false,
    listeners: {
        boxready: 'monpotViewBoxReadyfunc'
    },
    items: [
        /* include child components here */
        {
            xtype: 'panel',
            flex: 1,
            layout: 'fit',
            items: [
                {
                    xtype: 'echartsbasepanel',
                    id: 'monpotEchart',
                    echartsOption: {
                        xAxis: {
                            type: 'category',
                            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            data: [120, 200, 150, 80, 70, 110, 130],
                            type: 'bar'
                        }]
                    }
                }
            ]
        },
        {
            xtype: 'panel',
            flex: 1,
            layout: {
                type: 'vbox',
                pack: 'start',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'gridpanel',
                    id: 'monpotGridpanel',

                    flex: 1,
                    border: true,
                    scrollable: 'y',
                    margin: '10 10 10 10',
                    reserveScrollbar: true,
                    useArrows: true,
                    rootVisible: false,
                    multiSelect: true,
                    singleExpand: true,
                    tbar: [
                        '->',
                        {
                            xtype: 'button',
                            id: 'monpotGridpanelUpdate',
                            text: '新增',
                            handler: 'addNew'
                        },
                        {
                            xtype: 'button',
                            id: 'monpotGridpanelBack',
                            text: '返回上一级',
                            handler: 'getBack'
                        }
                    ],
                    viewConfig: {
                        stripeRows: false
                    },
                    store: {
                        data: []
                    },
                    columns: [{
                        text: '名称',
                        dataIndex: 'text',

                        flex: 1,
                        align: 'center',
                        hideable: false,
                        menuDisabled: true,
                        resizable: false,
                        sortable: false
                    }, {
                        text: '编码',
                        dataIndex: 'code',

                        flex: 1,
                        align: 'center',
                        hideable: false,
                        menuDisabled: true,
                        resizable: false,
                        sortable: false
                    },{
                        xtype: 'actioncolumn',
                        id: 'monpotGridActionColumn',
                        text: '操作',

                        width: 165,
                        align: 'center',
                        items: [
                            {
                                xtype: 'button',
                                iconCls: 'x-fa fa-info-circle actioncolumnMargin',
                                tooltip: '详情'
                            },
                            {
                                xtype: 'button',
                                iconCls: 'x-fa fa-edit actioncolumnMargin',
                                tooltip: '修改'
                            },
                            {
                                xtype: 'button',
                                iconCls: 'x-fa fa-trash',
                                tooltip: '删除'
                            }
                        ],

                        hideable: false,
                        menuDisabled: true,
                        resizable: false,
                        sortable: false
                    }],
                    listeners: {
                        rowclick: 'gridpanelRowClickfunc'
                    }
                }
            ]
        }
    ]
});