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

    viewModel: {
        type: 'detailViewModel'
    },

    cls: 'monpot-detail',

    requires: [
        'Ext.grid.Panel',
        'Ext.panel.Panel',
        'Ext.ux.layout.ResponsiveColumn',
        'yt.view.ytmap.detail.DetailViewModel'
    ],

    layout: 'responsivecolumn',

    items: [
        /* include child components here */
        {
            title: '设备图片',
            xtype: 'imagecomponent',
            src: 'http://yt.qinchenguang.com/img/1.png',
            userCls: 'big-30'
        },

        {
            xtype: 'gridpanel',
            iconCls: 'fa fa-info-circle',
            title: '设备运行情况',
            userCls: 'big-70',
            scrollable: 'y',
            bind: '{deviceList}',
            columns: [{
                dataIndex: 'name',
                text: '设备名称',
                flex: 1
            }, {
                dataIndex: 'connectstatus',
                text: '通讯状态',
                flex: 1
            }, {
                dataIndex: 'batterystatus',
                text: '电池状态',
                flex: 1
            }, {
                dataIndex: 'runstatus',
                text: '运行状态',
                flex: 1
            }, {
                dataIndex: '5',
                text: '设备频率',
                flex: 1
            }, {
                dataIndex: 'username',
                text: '联系人',
                flex: 1
            }, {
                dataIndex: 'mobile',
                text: '联系电话',
                flex: 1
            }]
        },

        {
            xtype: 'panel',
            title: '维护信息',
            userCls: 'big-100'
        }
    ]
});