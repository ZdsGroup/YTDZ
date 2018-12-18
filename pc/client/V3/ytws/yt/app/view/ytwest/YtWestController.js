
var westglobal = {};

westglobal.fn = {
    clickfunc: function (record) {
        var noteData = record.data;
        if (noteData.type !== 'disasterpoint' && noteData.type !== 'device')
            return;
        if (noteData.type === 'disasterpoint') {
            // 选中的是地灾点节点
            mv.fn.markClickCallFunc(noteData.code);
            return;
        } else if (noteData.type === 'device') {
            // 选中的是设备
            var parentData = record.parentNode.data;
            // 把对应的quakeid设置到当前noteData里面
            noteData.quakeId = parentData.code;
            mv.fn.markClickCallFunc(parentData.code);
            
            // 找到对应 code 的 mv.v.dzMarkerGroup mark对象，然后高亮
            var findMark = null;
            mv.v.jcsbMarkerGroup.eachLayer(function (markLayer) {
                if (markLayer.options.id === noteData.code)
                    findMark = markLayer
            })
            mv.v.map.flyTo(findMark.getLatLng());
            mv.fn.showHighMarker(findMark,'jcsb');
            mv.fn.caclulateMarkVisible();
            mv.v.isMapDetaiMaximize = false;
            

            // 显示概要面板
            mv.fn.markClickShowDetail(findMark);
        }
    }
};

/**
 * Created by LBM on 2017/12/28.
 */
Ext.define('yt.view.ytwest.YtWestController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.ytwest',

    /**
     * Called when the view is created
     */
    init: function () {
        this.getView().addCls('treelist-with-nav');
    },

    treeSelection: function (thisExt, record, eOpts) {
        //停止图片轮播功能
        // isw.fn.stopPlay();
        westglobal.fn.clickfunc(record);
    }
});
