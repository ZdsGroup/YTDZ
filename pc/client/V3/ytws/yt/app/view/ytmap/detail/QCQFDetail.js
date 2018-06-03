Ext.define('yt.view.ytmap.detail.QCQFDetail',{
    extend: 'Ext.panel.Panel',

    xtype: 'QCQF-detail',

    requires: [
        'yt.view.ytmap.detail.DetailViewModel',
        'yt.view.ytmap.detail.QCQFDetailController',

        'Ext.form.Panel',
        'Ext.form.field.Display',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.button.Button',
        'yt.plugin.ImageSwiper'
    ],

    viewModel: {
        type: 'detailViewModel'
    },

    controller: 'QCQFDetailController',

    config: {
        QCQFId: ''
    },

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    
    items: [
        {
            xtype: 'form',

            margin: '10 0 10 10',

            fieldDefaults: {
                labelAlign: 'left',
                labelStyle: 'font-weight:bold',
                labelWidth: 85
            },

            layout: {
                type: 'hbox',
                pack: 'center',
                align: 'stretch'
            },

            items: [
                {
                    xtype: 'displayfield',
                    fieldLabel: '用户名',
                    flex: 1,
                    bind: {
                        value: '{QCQFDetailData.username}'
                    }
                },
                {
                    xtype: 'displayfield',
                    fieldLabel: '联系方式',
                    flex: 1,
                    bind: {
                        value: '{QCQFDetailData.contact}'
                    }
                },
                {
                    xtype: 'displayfield',
                    fieldLabel: '评论时间',
                    flex: 1,
                    bind: {
                        value: '{QCQFDetailData.createtime}'
                    }
                }
            ]
        },
        {
            xtype: 'textareafield',
            fieldLabel: '评论详细内容',
            labelAlign: 'top',
            labelStyle: 'font-weight:bold',
            height: 200,
            editable: false,
            margin: '0 10 10 10',
            bind: {
                value: '{QCQFDetailData.content}'
            }
        },
        {
            title: '评论图片',
            xtype: 'imageswiper',
            reference: 'imgswiper',
            margin: '0 10 10 10'
        },
        {
            xtype: 'panel',
            layout: {
                type: 'hbox',
                pack: 'center',
                align: 'stretch'
            },
            margin: '0 0 10 0',
            items: [
                {
                    xtype: 'button',
                    reference: 'stateButton',
                    text: '处置',
                    bind: {
                        disabled: '{QCQFDetailData.state}'
                    },
                    handler: 'changeDetailState'
                }
            ]
        }
    ],

    listeners: {
        afterrender: 'afterRendererFunction'
    }
})