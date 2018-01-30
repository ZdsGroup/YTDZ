/**
 * Created by LBM on 2018/1/30.
 */
Ext.define('yt.plugin.ImageSwiper', {
    extend: 'Ext.Container',

    /*
    Uncomment to give this component an xtype*/
    xtype: 'imageswiper',

    requires: [
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.layout.container.Card',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.util.TaskManager'
    ],


    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },
    listeners: {
        added: function (view, container, pos, eOpts) {
            isw.v.self = view;
            isw.v.imgIndex = 0;
            isw.fn.autoPlay();
        }
    },

    items: [
        /* include child components here */
        {
            xtype: 'container',
            flex: 1,
            layout: 'card',
            items: [
                {
                    xtype: 'image',
                    src: 'resources/test/0.jpg'
                },
                {
                    xtype: 'image',
                    src: 'resources/test/1.jpg'
                },
                {
                    xtype: 'image',
                    src: 'resources/test/2.jpg'
                }
            ]
        },
        {
            xtype: 'container',
            height: 30,
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'center'
            },

            items: [
                {
                    xtype: 'button',
                    text: '0',
                    listeners: {
                        click: function () {
                            isw.fn.doCardNavigation(0)
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: '1',
                    listeners: {
                        click: function () {
                            isw.fn.doCardNavigation(1)
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: '2',
                    listeners: {
                        click: function () {
                            isw.fn.doCardNavigation(2)
                        }
                    }
                }
            ]
        }
    ]
});


var isw = {
    v: {
        self: null,
        imgIndex: 0,
        imgNum: 3,
        task: null
    },
    fn: {
        doCardNavigation: function (index) {
            if (isw.v.self) {
                var card = isw.v.self.items.items[0];
                if (card) {
                    var l = card.getLayout();
                    l.setActiveItem(index);
                    isw.v.imgIndex = index;
                }
            }
        },
        autoPlayTask: function () {
            if (isw.v.imgIndex < isw.v.imgNum) {
                isw.fn.doCardNavigation(isw.v.imgIndex);
                isw.v.imgIndex++;
            } else {
                isw.v.imgIndex = 0;
                isw.fn.doCardNavigation(isw.v.imgIndex);
            }
        },
        autoPlay: function () {
            isw.v.task = {
                run: isw.fn.autoPlayTask,
                interval: 2000
            };
            Ext.TaskManager.start(isw.v.task);
        },
        stopPlay: function () {
            if (isw.v.task) {
                Ext.TaskManager.stop(isw.v.task, true);
                isw.v.task = null;
            }
        }
    }
}