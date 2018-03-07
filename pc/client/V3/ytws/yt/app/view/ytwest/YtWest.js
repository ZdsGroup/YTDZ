/**
 * Created by LBM on 2017/12/28.
 */
Ext.define('yt.view.ytwest.YtWest', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.container.Container',
        'Ext.form.field.ComboBox',
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
                    xtype: 'combobox',
                    id: 'dzDataSearchRef',
                    floating: false,
                    hideLabel: true,
                    emptyText: "地灾点或监测设备名称",
                    queryMode: 'local',

                    triggerCls: '',
                    enableKeyEvents: true,
                    triggers: {
                        clearbtn: {
                            weight: 0,
                            cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            hidden: true,
                            handler: function (e) {
                                var me = this;
                                me.clearValue();
                                me.getTrigger('clearbtn').hide();
                                me.getTrigger('picker').hide();
                                if(me.isExpanded){
                                    me.onEsc(e);
                                }
                            },
                            scope: 'this'
                        },
                        searchbtn: {
                            weight: 1,
                            cls: Ext.baseCSSPrefix + 'form-search-trigger',
                            // handler: 'onSearchClick',//实际应用中追加事件绑定
                            scope: 'this'
                        }
                    },

                    listeners: {
                        specialkey: function (combobox, field, event, eOpts) {
                            if (field.getKeyName() == "ENTER") {
                                alert(combobox.getRawValue());
                            }
                        },
                        keyup: function (combobox, e, eOpts) {
                            var inputValue = combobox.getRawValue();
                            if (inputValue != '') {
                                combobox.getTrigger('clearbtn').show();
                                combobox.getTrigger('picker').show();
                            } else if (inputValue == '') {
                                combobox.getTrigger('clearbtn').hide();
                                combobox.getTrigger('picker').hide();
                            }
                        },
                        afterrender: function( combobox, eOpts ) {
                            combobox.getTrigger('picker').hide();
                        },

                        beforequery : function(e){
                            var combo = e.combo;
                            if(!e.forceAll){
                                var value = e.query;
                                combo.store.clearFilter(true);
                                combo.store.filterBy(
                                    function(record,id){
                                        var text = record.get(combo.displayField);
                                        return ( text.indexOf(value) != -1 );
                                    }
                                );
                                combo.expand();
                                return false;
                            }
                        },

                        select: function( combo, record, eOpts ) {
                            //
                            var selectedData = record.getData();
                            var dzDatatree = Ext.getCmp('dzDataTreeRef');

                            var treeDataModel = null;
                            dzDatatree.getStore().each(function (items,index) {
                                var itemsData = items.getData();
                                if( selectedData.text === itemsData.text &&
                                    selectedData.type === itemsData.type &&
                                    selectedData.code === itemsData.code ){
                                    treeDataModel = items;
                                }
                            })

                            if(treeDataModel){
                                dzDatatree.setSelection(treeDataModel);
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
                    'select': 'treeSelection'
                }
            }]
        }]
});