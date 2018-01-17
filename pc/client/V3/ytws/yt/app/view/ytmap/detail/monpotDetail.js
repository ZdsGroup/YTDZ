/**
 * Created by lyuwei on 2018/1/9.
 */
Ext.define('yt.view.ytmap.detail.monpotDetail', {
    extend: 'Ext.Container',

    /*
    Uncomment to give this component an xtype
    xtype: 'monpotdetail',
    */
    xtype: 'monpot-detail',

    requires: [
        'yt.view.ytmap.detail.DetailViewModel'
    ],

    viewModel: {
        type: 'detailViewModel'
    },

    controller: 'detailViewController',

    cls: 'monpot-detail',

    requires: [
        'Ext.grid.Panel',
        'Ext.panel.Panel',
        'Ext.ux.layout.ResponsiveColumn',
        'yt.view.ytmap.detail.DetailViewController',
        'yt.view.ytmap.detail.DetailViewModel'
    ],

    layout: 'responsivecolumn',

    items: [
        /* include child components here */
        {
            title: '设备图片',
            xtype: 'imagecomponent',
            src: 'http://yt.qinchenguang.com/img/1.png',
            userCls: 'big-30',
            height: 340
        },

        {
            xtype: 'gridpanel',
            height: 340,
            iconCls: 'fa fa-info',
            title: '设备运行情况',
            ui: 'map-detail-secend-panel-ui',
            userCls: 'big-70',
            bind: '{deviceList}',
            // margin: '0 5 0 5',
            border: true,
            columnLines: true,
            reserveScrollbar: true,
            multiSelect: false,
            scrollable: 'y',
            viewConfig: {
                stripeRows: false
            },
            columns: [{
                dataIndex: 'name',
                text: '设备名称',
                flex: 1,

                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center',
            }, {
                dataIndex: 'connectstatus',
                text: '通讯状态',
                flex: 1,

                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center',
                renderer : 'rendererDeviceStatus'
            }, {
                dataIndex: 'batterystatus',
                text: '电池状态',
                flex: 1,

                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center',
                renderer : 'rendererDeviceStatus'
            }, {
                dataIndex: 'runstatus',
                text: '运行状态',
                flex: 1,

                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center',
                renderer : 'rendererDeviceStatus'
            }, {
                dataIndex: '5',
                text: '设备频率',
                flex: 1,

                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center'
            }, {
                dataIndex: 'username',
                text: '联系人',
                flex: 1,

                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center'
            }, {
                dataIndex: 'mobile',
                text: '联系电话',
                flex: 1,

                hideable: false,
                menuDisabled: true,
                resizable: false,
                sortable: false,
                align: 'center'
            }]
        },

        {
            xtype: 'panel',
            title: '维护信息',
            ui: 'map-detail-secend-panel-ui',
            userCls: 'big-100',
            iconCls: 'fa fa-wrench'
        }
    ]
});