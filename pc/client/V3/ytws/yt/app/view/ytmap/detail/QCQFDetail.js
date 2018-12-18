Ext.define('yt.view.ytmap.detail.QCQFDetail',{
    extend: 'Ext.panel.Panel',

    xtype: 'QCQF-detail',

    requires: [
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.form.Panel',
        'Ext.form.field.Display',
        'Ext.form.field.TextArea',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'yt.plugin.ImageSwiper',
        'yt.view.ytmap.detail.DetailViewModel',
        'yt.view.ytmap.detail.QCQFDetailController'
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

            margin: '0 10',

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
            height: 100,
            editable: false,
            margin: '0 10 10 10',
            bind: {
                value: '{QCQFDetailData.content}'
            }
        },
        {
            xtype: 'container',
            height: 150,
            html: '<div id="qcqfMapContainer" style="width: 100%;height: 100%;overflow: hidden;margin:0;position: relative;border: hidden;"></div>',
            margin: '0 10 10 10'
        },
        {
            title: '评论图片',
            xtype: 'imageswiper',
            reference: 'imgswiper',
            height: 500,
            width: '100%',
            margin: '10'
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