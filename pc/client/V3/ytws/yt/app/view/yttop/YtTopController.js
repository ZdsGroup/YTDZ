/**
 * Created by LBM on 2017/12/27.
 */
Ext.define('yt.view.yttop.YtTopController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.top',

    requires: [
        'Ext.data.TreeStore',
        'Ext.layout.container.VBox',
        'Ext.tree.Panel',
        'Ext.window.Window'
    ],

    /**
     * Called when the view is created
     */
    init: function () {

    },
    loginOutHandler: function () {
        //清空缓存
        localUtils.clearLocalStorage(conf.sysLocalStore);

        //应用更新之后自动重载
        window.location.reload();
    },
    showUserFavosList: function () {
        var me = this;
        // 如果已经展示则直接返回
        if (me.favosShowWin && me.favosShowWin.isVisible()) {
            return;
        }
        if (!me.favosShowWin) {
            var width = 200;
            var x = document.body.clientWidth - 5 - width;
            var y = 90;
            var winOptions = {
                title: "我的收藏",
                ui: 'collect-window-ui',
                iconCls: 'fa fa-heart',
                width: width,
                height: 200,
                x: x,
                y: y,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                modal: false,
                closable: true,
                border: false,
                closeAction: 'method-hide',
                maximizable: false,
                minimizable: false,
                resizable: false,
                closeToolText: '关闭',
                items: [{
                    xtype: 'treepanel',
                    id: 'favosWindowTreeRef',
                    displayField: 'quakeName',
                    rootVisible: false,

                    listeners: {
                        itemclick: me.favosSelection
                    }
                }]
            };
            me.favosShowWin = Ext.create("Ext.window.Window", winOptions);
        }
        // 展示用户收藏夹列表
        me.favosShowWin.show();

        me.getUserFavos(1);
    },
    getUserFavos: function (pageNo) {
        var favosDataTree = Ext.getCmp('favosWindowTreeRef');
        var mask = ajax.fn.showMask(favosDataTree, '数据加载中...');

        var action = 'userfavos';
        var params = {
            pageno: pageNo | 1,
            pagesize: 100
        };

        function successCallBack(response, opts) {
            ajax.fn.hideMask(mask);
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
            if (!result['data']) return;

            var getTree = result['data'];
            for (var i = 0; i < getTree.length; i++) {
                getTree[i].leaf = true
            }
            var treeStore = new Ext.create('Ext.data.TreeStore', {
                data: result['data']
            });
            favosDataTree.setStore(treeStore)
        }

        function failureCallBack(response, opts) {
            ajax.fn.hideMask(mask);
        }

        ajax.fn.executeV2(params, 'GET', conf.serviceUrl + action, successCallBack, failureCallBack);
    },

    // favosSelection
    favosSelection: function (thisExt, record) {
        // 联动逻辑
        var noteData = record.data;
        mv.fn.markClickCallFunc(noteData.quakeid);
    }
});