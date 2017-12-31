/**
 * Created by LBM on 2017/12/28.
 */
Ext.define('yt.view.ytwest.YtWestController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.ytwest',

    requires: [
        'Ext.data.TreeStore'
    ],

    /**
     * Called when the view is created
     */
    init: function () {
        this.getView().addCls('treelist-with-nav');
    },
    arHandler: function () {
        this.getDzDataTree();
    },
    //获取地灾点树
    getDzDataTree: function () {
        var me = this;
        var dzDataTree = me.lookupReference('dzDataTreeRef');
        var dzDataTreeCon = me.lookupReference('dzDataTreeContainerRef');
        var mask = ajax.fn.showMask(dzDataTreeCon, '数据加载中...');

        ajax.v.method = 'GET';
        ajax.v.url = conf.serviceUrl + 'devices/sides';
        ajax.v.successCallBack = function (response, opts) {
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
            var dataList = result['data']['tree'];
            if (dataList && dataList.length > 0) {
                var treeStore = new Ext.create('Ext.data.TreeStore', {
                    data: conf.dataList//此处需要根据需要预处理数据，以满足tree组件显示需求,现在使用conf.dataList作为测试数据
                });
                dzDataTree.setStore(treeStore);
                //dzDataTree.setExpanderFirst(false);//false-表示下拉箭头位于右侧，与expanderFirst: false效果一致
            }

            ajax.fn.hideMask(mask);

        };
        ajax.v.failureCallBack = function (response, opts) {
            ajax.fn.hideMask(mask);
        };
        ajax.fn.execute();
    }
});