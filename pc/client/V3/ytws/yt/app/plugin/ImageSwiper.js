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

    config: {
        imgArray: [],

        imgIndex: 0,
        imgNum: 0,
        task: null
    },

    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },
    listeners: {
        added: function (view, container, pos, eOpts) {

        }
    },

    items: [
        /* include child components here */
        {
            xtype: 'container',
            name: 'imgCard',
            flex: 1,
            layout: 'card',
            items: []
        },
        {
            xtype: 'container',
            name: 'controllerBtn',
            height: 30,
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'center'
            },
            baseCls: 'background-color: #000 !important',
            items: []
        }
    ],

    initComponent: function () {
        var me = this;
        me.callParent();

        if(me.getImgArray().length > 0)
            me.insertImage( me.getImgArray() );
    },

    destroy: function () {
        var me = this;

        // 先停止后 destroy
        me.stopPlay();

        me.callParent();
    },

    insertImage: function (imgArray) {
        if(!(imgArray instanceof Array))
            return;
        var me = this;
        // 先暂停播放
        me.stopPlay();
        if (imgArray && imgArray.length > 0) {
            var imgContainer = me.down('container[name=imgCard]');
            var menuContainer = me.down('container[name=controllerBtn]');

            if (imgContainer && menuContainer) {
                imgContainer.removeAll(true);
                menuContainer.removeAll(true);
            }

            me.imgNum = imgArray.length;
            for (var index = 1; index - 1 < me.imgNum; index++) {
                var imgItem = imgArray[index - 1];
                if (imgItem) {
                    var src = imgItem['url'];

                    var img = Ext.create('Ext.Img', {
                        src: src
                    });

                    var menu = Ext.create('Ext.button.Button', {
                        text: parseInt(index),
                        listeners: {
                            click: function (btn) {
                                // 先停止自动播放，后设置对应的图片，再开启自动播放
                                me.stopPlay();
                                me.doCardNavigation(btn.text - 1, me);
                                me.autoPlay();
                            }
                        }
                    });

                    imgContainer.add(img);
                    menuContainer.add(menu);
                }
            }
        }

        me.autoPlay();
    },
    doCardNavigation: function (index, view) {
        var me = this;
        if(view)
            me = view;
        if (me) {
            var card = me.down('container[name=imgCard]');
            if (card) {
                var l = card.getLayout();
                l.setActiveItem(index);
                me.imgIndex = index;
            }
        }
    },

    autoPlayTask: function (view) {
        if (view.imgNum > 0) {
            if (view.imgIndex < view.imgNum) {
                view.doCardNavigation(view.imgIndex, view);
                view.imgIndex++;
            } else {
                view.imgIndex = 0;
                view.doCardNavigation(view.imgIndex, view);
            }
        }
    },
    autoPlay: function () {
        var me = this;
        me.task = {
            run: function () {
                me.autoPlayTask(me);
            },
            interval: 2000
        };
        Ext.TaskManager.start(me.task);
    },
    stopPlay: function () {
        var me = this;
        if (me.task) {
            Ext.TaskManager.stop(me.task, true);
        }
        me.task = null;
        // me.imgNum = 0;
        // me.imgIndex = 0;
    }
});