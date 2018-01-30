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
            isw.fn.stopPlay();
            isw.v.self = view;
            isw.fn.autoPlay();

            var imgs = [
                {
                    src: 'resources/test/0.jpg'
                },
                {
                    src: 'resources/test/1.jpg'
                },
                {
                    src: 'resources/test/2.jpg'
                }
            ];

            isw.fn.insertImage(imgs);
        }
    },

    items: [
        /* include child components here */
        {
            xtype: 'container',
            flex: 1,
            layout: 'card',
            items: []
        },
        {
            xtype: 'container',
            height: 30,
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'center'
            },

            items: []
        }
    ]
});


var isw = {
    v: {
        self: null,
        imgIndex: 0,
        imgNum: 0,
        task: null
    },
    fn: {
        insertImage: function (imgArray) {
            if (imgArray && imgArray.length > 0) {
                var imgContainer = isw.v.self.items.items[0];
                var menuContainer = isw.v.self.items.items[1];

                if (imgContainer && menuContainer) {
                    imgContainer.removeAll(true);
                    menuContainer.removeAll(true);
                }

                isw.v.imgNum = imgArray.length;
                for (var index = 1; index - 1 < isw.v.imgNum; index++) {
                    var imgItem = imgArray[index - 1];
                    if (imgItem) {
                        var src = imgItem['src'];

                        var img = Ext.create('Ext.Img', {
                            src: src
                        });

                        var menu = Ext.create('Ext.button.Button', {
                            text: parseInt(index),
                            listeners: {
                                click: function (btn) {
                                    isw.fn.doCardNavigation(btn.text - 1)
                                }
                            }
                        });

                        imgContainer.add(img);
                        menuContainer.add(menu);
                    }
                }
            }
        },
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
            if (isw.v.imgNum > 0) {
                if (isw.v.imgIndex < isw.v.imgNum) {
                    isw.fn.doCardNavigation(isw.v.imgIndex);
                    isw.v.imgIndex++;
                } else {
                    isw.v.imgIndex = 0;
                    isw.fn.doCardNavigation(isw.v.imgIndex);
                }
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
            }
            isw.v.task = null;
            isw.v.imgNum = 0;
            isw.v.imgIndex = 0;
        }
    }
}