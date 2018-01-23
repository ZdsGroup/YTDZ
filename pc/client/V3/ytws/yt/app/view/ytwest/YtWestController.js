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
        var noteData = record.data;
        if (noteData.type !== 'disasterpoint' && noteData.type !== 'device')
            return;
        if (noteData.type === 'disasterpoint') {
            // 选中的是地灾点节点
            if (mv.v.jcsbMarkerGroup) {
                mv.v.jcsbMarkerGroup.clearLayers();
            }
            mv.fn.dzAreaLine(noteData.coordinates);
            mv.fn.showJcsbMarkersByDZ(noteData);
        } else if (noteData.type === 'device'){
            console.log( noteData )
            // 选中的是设备
            var parentData = record.parentNode.data;
            if (mv.v.jcsbMarkerGroup) {
                mv.v.jcsbMarkerGroup.clearLayers();
            }
            mv.fn.dzAreaLine(parentData.coordinates);
            mv.fn.showJcsbMarkersByDZ(parentData);
        }

        //显示属性面板
        var isNowCreate = false;
        if (!mv.v.mapDetailPanel || !mv.v.mapDetailPanel.isVisible()) {
            isNowCreate = true;
            mv.v.isMapDetaiMaximize = false;
            mv.v.mapDetailPanelParam = {
                gapX: 5,
                gapY: 40,
                bottomY: 5,//底部间隔
                w: 300,//数值或百分比，如：100%
                h: '100%',//数值或百分比，如：100%
                align: 'br' //右下
            };
            mv.fn.createDetailPanel(mv.v.mapParentId, mv.v.mapDetailPanelParam);
        }
        if (mv.v.mapDetailPanel) {
            if (!mv.v.mapDetailPanelInfo || mv.v.mapDetailPanelInfo.code !== noteData.code) {
                // 如果点击的信息与上次参数不一致才刷新界面，不然不刷新
                Ext.getCmp('mondataTitleId').setHtml(noteData.text);
                Ext.getCmp('mondataAddressId').setHtml(); // todo address 没找到对应字段
                var showMondataType = '';

                if (noteData.type === 'disasterpoint')
                    showMondataType = '地面塌陷';
                else if (noteData.type === 'device'){
                    showMondataType = '设备';
                    if( noteData.deviceType === 1 )
                        showMondataType = '位移设备'
                    else if( noteData.deviceType === 2 )
                        showMondataType = '雨量设备'
                    else if( noteData.deviceType === 3 )
                        showMondataType = '裂缝设备'
                }
                Ext.getCmp('mondataTypeId').setHtml(showMondataType);

                Ext.getCmp('mondataRankId').setValue(noteData.rank);
                Ext.getCmp('mondataRankId').setLimit(noteData.rank);
                Ext.getCmp('mondataRankId').setMinimum(noteData.rank);

                mv.v.mapDetailPanelInfo = noteData;
            }

            if (mv.v.mapDetailPanelInfo == null) {
                mv.v.mapDetailPanelInfo = noteData;
            }

            // 如果面板是打开状态就直接改变数据，否则显示
            if (isNowCreate) {
                mv.fn.showBasicInfo();
            }
        }
    }
});