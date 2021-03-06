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
        'Ext.form.field.ComboBox',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.tab.Panel',
        'yt.view.ytmap.detail.DetailViewModel',
        'yt.view.ytmap.detail.monpotAnalyticsController'
    ],

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    viewModel: {
        type: 'detailViewModel'
    },

    config: {
        deviceType: '',
        deviceCode: '',
        quakeId: ''
    },

    controller: 'monpotanalytics',

    items: [
        {
            // 如果点击弹出的是监测设备详细面板则该部分不显示
            xtype: 'panel',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'left'
            },
            hidden: true,
            border: false,
            defaults: {
                bodyPadding: 5
            },
            items: [
                {
                    xtype: 'combo',
                    reference: 'deviceTypeCombo',
                    fieldLabel: '设备类型',
                    labelWidth: 65,
                    labelAlign: 'right',
                    displayField: 'label',
                    queryMode: 'local',
                    selectOnTab: true,
                    editable: false,
                    typeAhead: false,
                    allowBlank: false,
                    emptyText: '请选择设备类型',
                    store: {
                        data: [
                            {label: '裂缝设备', type: 'lfsb'},
                            {label: '位移设备', type: 'wysb'},
                            {label: '雨量设备', type: 'ylsb'}
                        ]
                    },
                    listeners: {
                        select: 'deviceTypeChange'
                    }
                }
            ]
        },
        {
            xtype: 'tabpanel',
            reference: 'analyticsTabContainer',
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
            items: [],
            listeners: {
                added: function(thisDom, container, pos, eOpts){
                    this.setActiveTab(0);
                }
            }
        }
    ],

    listeners: {
        boxready: 'boxReadyFunc'
    }
});