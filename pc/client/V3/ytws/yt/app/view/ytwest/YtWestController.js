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
        var noteData = record.data;
        if (noteData.type !== 'disasterpoint' && noteData.type !== 'device')
            return;
        var findMark = null;
        if (noteData.type === 'disasterpoint') {
            // 选中的是地灾点节点
            if (mv.v.jcsbMarkerGroup) {
                mv.v.jcsbMarkerGroup.clearLayers();
            }
            mv.fn.dzAreaLine(noteData.coordinates);
            mv.fn.showJcsbMarkersByDZ(noteData);

            mv.v.dzMarkerGroup.eachLayer(function (markLayer) {
                if (markLayer.options.id === noteData.code)
                    findMark = markLayer
            })

        } else if (noteData.type === 'device') {
            // 选中的是设备
            var parentData = record.parentNode.data;
            // 把对应的quakeid设置到当前noteData里面
            noteData.quakeId = parentData.code;
            if (mv.v.jcsbMarkerGroup) {
                mv.v.jcsbMarkerGroup.clearLayers();
            }
            mv.fn.dzAreaLine(parentData.coordinates);
            mv.fn.showJcsbMarkersByDZ(parentData);
            // 找到对应 code 的 mv.v.dzMarkerGroup mark对象，然后高亮
            mv.v.jcsbMarkerGroup.eachLayer(function (markLayer) {
                if (markLayer.options.id === noteData.code)
                    findMark = markLayer
            })
        }
        // 高亮
        if (findMark) {
            if (noteData.type === 'device'){
                mv.fn.showHighMarker(findMark);
            }else {
                if (mv.v.selDzMarker){
                    mv.v.dzMarkerGroup.addLayer(mv.v.selDzMarker);
                }
                mv.v.selDzMarker = findMark;
            }
        }

        //var isNowCreate = false;
        // if (!mv.v.mapDetailPanel) {
            // isNowCreate = true;
            mv.v.isMapDetaiMaximize = false;
            mv.v.mapDetailPanelParam = {
                gapX: 5,
                gapY: 40,
                bottomY: 5,//底部间隔
                w: 350,//数值或百分比，如：100%
                h: 250,//数值或百分比，如：100%
                align: 'tr' //右上
            };
        // }

        var showMondataType = mv.fn.calcParamByType(noteData);
        mv.fn.createDetailPanel(mv.v.mapParentId, mv.v.mapDetailPanelParam);

        // 切换概要面板中更多按钮状态
        var moreBtn = Ext.getCmp('mondataMoreId');
        moreBtn.setIconCls('fa fa-window-maximize');
        moreBtn.setTooltip('更多信息');

        //显示属性面板
        if (mv.v.mapDetailPanel) {
            if (!mv.v.mapDetailPanelInfo || mv.v.mapDetailPanelInfo.code !== noteData.code) {
                // 如果点击的信息与上次参数不一致才刷新界面，不然不刷新
                mv.fn.switchSummarypanel(noteData, showMondataType);

                mv.v.mapDetailPanelInfo = noteData;
            }

            if (mv.v.mapDetailPanelInfo == null) {
                mv.v.mapDetailPanelInfo = noteData;
            }


            mv.fn.showBasicInfo();
        }
    }
});