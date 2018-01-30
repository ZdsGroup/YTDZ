/**
 * Created by lyuwei on 2018/1/17.
 */
Ext.define('yt.view.ytmap.detail.DetailView', {
    extend: 'Ext.Container',

    requires: [
        'Ext.layout.container.Fit',
        'Ext.tab.Panel'
    ],

    /*
    Uncomment to give this component an xtype
    xtype: 'detail',
    */
    xtype: 'detailView',

    layout: 'fit',

    border: false,

    items: [
        /* include child components here */
        {
            xtype: 'tabpanel',
            ui: 'navigation1',
            id: 'deviceDetailContainerID',
            hidden: true,
            border: false,
            flex: 1,
            defaults: {
                bodyPadding: 5,
                scrollable: true,
                closable: false,
                border: false
            },
            tabPosition: 'left',
            tabRotation: 0,
            items: []
        },
        {
            xtype: 'tabpanel',
            ui: 'navigation1',
            id: 'dzDetailContainerID',
            hidden: true,
            border: false,
            flex: 1,
            defaults: {
                bodyPadding: 5,
                scrollable: true,
                closable: false,
                border: false
            },
            tabPosition: 'left',
            tabRotation: 0,
            items: []
        }
    ]
});