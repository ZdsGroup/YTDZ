/**
 * Created by lyuwei on 2018/1/22.
 */
Ext.define('yt.view.monpot.deviceDetail', {
    extend: 'Ext.form.Panel',

    /*
    Uncomment to give this component an xtype
    xtype: '',
    */
    xtype: 'devicedetail',

    viewModel: {
        type: 'monpot'
    },

    requires: [
        'Ext.layout.container.VBox',
        'yt.view.monpot.MonPotModel'
    ],
    defaultType: 'textfield',
    fieldDefaults: {
        labelAlign: 'left',
        labelWidth: 110,
    },
    margin: '10 10 10 10',
    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },
    config: {
        deviceData: {},
        editable: false
    },
    scrollable: 'y',
    items: [
        /* include child components here */
        {
            fieldLabel: '名称',
            bind: {
                value:'{deviceDetailData.name}',
                editable: '{detailEditable}'
            }
        },
        {
            fieldLabel: '承担单位',
            bind: {
                value:'{deviceDetailData.company}',
                editable: '{detailEditable}'
            }
        },
        {
            fieldLabel: '负责人',
            bind: {
                value:'{deviceDetailData.username}',
                editable: '{detailEditable}'
            }
        },
        {
            fieldLabel: '联系电话',
            bind: {
                value:'{deviceDetailData.mobile}',
                editable: '{detailEditable}'
            }
        },
        {
            fieldLabel: '设备类型',
            bind: {
                value:'{deviceDetailData.type}',
                editable: '{detailEditable}'
            }
        },
        {
            fieldLabel: '设备地址',
            bind: {
                value:'{deviceDetailData.address}',
                editable: '{detailEditable}'
            }
        }
    ],

    initComponent: function(){
        var me = this;
        me.on("boxready", function () {
            var meViewModel = me.getViewModel();
            if (me.deviceData) {
                meViewModel.set('deviceDetailData',me.deviceData)
            }
            meViewModel.set('detailEditable',me.editable);
        });
        me.callParent();
    },
});