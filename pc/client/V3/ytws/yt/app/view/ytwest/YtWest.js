/**
 * Created by LBM on 2017/12/28.
 */
Ext.define('yt.view.ytwest.YtWest', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.container.Container',
        'Ext.layout.container.Fit',
        'Ext.layout.container.VBox',
        'Ext.list.Tree',
        'yt.plugin.SearchField',
        'yt.view.ytwest.YtWestController',
        'yt.view.ytwest.YtWestModel'
    ],

    /*
    Uncomment to give this component an xtype*/
    xtype: 'yt-west',


    viewModel: {
        type: 'ytwest'
    },

    controller: 'ytwest',

    ui: 'west-panel-ui',
    title: '地灾点列表',
    width: 250,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    border: false,
    scrollable: 'y',
    bodyPadding: 2,
    items: [
        {
            xtype: 'searchField',
            floating: false,
            hideLabel: true,
            height: 30,
            emptyText: "地灾点或监测设备名称",
            listeners: {
                specialkey: function (text, field, event, eOpts) {
                    if (field.getKeyName() == "ENTER") {
                        alert(text.getValue());
                    }
                },
                change: function (text, newValue, oldValue, eOpts) {
                    if (newValue != '') {
                        text.getTrigger('clear').show();
                    } else if (newValue == '') {
                        text.getTrigger('clear').hide();
                    }
                }
            }
        }, {
            xtype: "container",
            flex: 1,
            reference: 'dzDataTreeContainerRef',
            layout: 'fit',
            items: [{
                xtype: 'treelist',
                reference: 'dzDataTreeRef',
                rootVisible: false,
                useArrows: true,
                frame: false,
                bufferedRenderer: false,
                animate: true,
                rowLines: true,
                columnLines: true,
                singleExpand: false,
                expanderOnly: false,
                expanderFirst: false,
                itemRipple: true
            }]
        }]
});