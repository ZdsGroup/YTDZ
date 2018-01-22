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
        disasterpointData: {},
        editable: false
    },
    scrollable: 'y',
    items: [
        /* include child components here */
        {
            fieldLabel: '名称',
            bind: {
                value:'{disasterpointDetailData.name}',
                editable: '{detailEditable}'
            }
        },
        {
            fieldLabel: '公司',
            bind: {
                value:'{disasterpointDetailData.company}',
                editable: '{detailEditable}'
            }
        },
        {
            fieldLabel: '负责人',
            bind: {
                value:'{disasterpointDetailData.username}',
                editable: '{detailEditable}'
            }
        },
        {
            fieldLabel: '联系电话',
            bind: {
                value:'{disasterpointDetailData.mobile}',
                editable: '{detailEditable}'
            }
        },
        {
            fieldLabel: '地灾点类型',
            bind: {
                value:'{disasterpointDetailData.dtype}',
                editable: '{detailEditable}'
            }
        },
        {
            fieldLabel: '地灾点地址',
            bind: {
                value:'{disasterpointDetailData.address}',
                editable: '{detailEditable}'
            }
        }
    ],

    initComponent: function(){
        var me = this;
        me.on("boxready", function () {
            var meViewModel = me.getViewModel();
            if (me.disasterpointData) {
                meViewModel.set('disasterpointDetailData',me.disasterpointData)
            }
            meViewModel.set('detailEditable',me.editable);
        });
        me.callParent();
    },
});