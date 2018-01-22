/**
 * Created by lyuwei on 2018/1/22.
 */
Ext.define('yt.view.monpot.disasterpointDetail', {
    extend: 'Ext.form.Panel',

    /*
    Uncomment to give this component an xtype
    xtype: 'disasterpointdetail',
    */
    xtype: 'disasterpointdetail',

    viewModel: {
        type: 'monpot'
    },

    requires: [
        'Ext.layout.container.VBox',
        'yt.view.monpot.MonPotModel'
    ],
    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 115,
        msgTarget: 'side'
    },
    defaults: {
        defaultType: 'textfield'
    },
    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },
    config: {
        disasterpointData: {},
    },

    bind: '{disasterpointDetailData}',
    items: [
        /* include child components here */
        { fieldLabel: '名称', value: '{name}' },
        { fieldLabel: '公司', value: '{company}' },
        { fieldLabel: '负责人', value: '{username}' },
        { fieldLabel: '联系电话', value: '{mobile}' },
        { fieldLabel: '地灾点类型', value: '{dtype}' },
        { fieldLabel: '地灾点地址', value: '{address}' },
    ],

    initComponent: function(){
        var me = this;
        me.on("boxready", function () {
            if (me.disasterpointData) {
                disasterpointDetailData
            }
        });
        me.callParent();
    },
});