/**
 * Created by LBM on 2017/12/28.
 */
Ext.define('yt.view.ytwest.YtWest', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.container.Container',
        'Ext.layout.container.Fit',
        'Ext.list.Tree',
        'Ext.tree.Panel',
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
    id: 'dzDataTreeContainerId',
    //title: '地灾点列表',
    width: 250,
    /*layout: {
        type: 'vbox',
        align: 'stretch'
    },*/
    border: false,
    scrollable: 'y',
    bodyPadding: 2,
    items: [
        {
            xtype: 'container',
            height: 32,
            layout: 'fit',
            items: [
                {
                    xtype: 'searchField',
                    floating: false,
                    hideLabel: true,
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
                }
            ]
        }, {
            xtype: "container",
            flex: 1,
            layout: 'fit',
            items: [{
                xtype: 'treepanel',
                id: 'dzDataTreeRef',
                rootVisible: false,
                useArrows: true,
                frame: false,
                bufferedRenderer: false,
                animate: true,
                rowLines: true,
                columnLines: true,
                singleExpand: false,
                expanderOnly: true,
                expanderFirst: false,
                itemRipple: true,

                listeners: {
                    // 'selectionchange': 'treeSelection',
                    'itemclick': 'treeSelection'
                }
            }]
        }]
});